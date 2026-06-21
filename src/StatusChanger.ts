import { PlaybackState } from "./PlaybackState"
import { Settings } from "./Settings"
import { LyricsLine } from "./Sources/BaseSource"
import { Autooffset } from "./Autooffset"
import { Debug } from "./Debug"
import { broadcastSettings } from "./Panel/Server"

export class StatusChanger {
    public playbackState: PlaybackState

    public sentLines: LyricsLine[]

    public autooffset: Autooffset

    private lastStatusKey: string
    private lastSongId: string
    private lastSavedAutoOffset: number
    private lastSentTime: number
    private rateLimitResetTime: number
    private isRequestPending: boolean
    private dynamicMinSendInterval: number
    private sentTimestamps: number[]
    private requestBackoffUntil: number
    private blockedToken: string
    private clearStatusScheduledAt: number
    private readonly requestWindowMs = 10000
    private readonly maxRequestsPerWindow = 10
    private readonly clearDebounceMs = 1800

    constructor(playbackState: PlaybackState) {
        this.playbackState = playbackState

        this.sentLines = []

        this.autooffset = new Autooffset()

        this.lastStatusKey = ""
        this.lastSongId = ""
        this.lastSavedAutoOffset = Settings.timings.sendTimeOffset
        this.lastSentTime = 0
        this.rateLimitResetTime = 0
        this.isRequestPending = false
        this.dynamicMinSendInterval = Settings.timings.minSendInterval ?? 700
        this.sentTimestamps = []
        this.requestBackoffUntil = 0
        this.blockedToken = ""
        this.clearStatusScheduledAt = 0
    }

    public changeStatusRequest(text: string | null, token: string, emoji: string): Promise<Response> {
        this.lastSentTime = Date.now()
        this.isRequestPending = true
        const now = Date.now()

        const request = fetch("https://discord.com/api/v9/users/@me/settings", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                custom_status: {
                    text,
                    emoji_id: null,
                    emoji_name: emoji,
                    expires_at: null
                }
            })
        })

        request.then(async (response) => {
            this.autooffset.addValue(Date.now() - now)

            if (!response.ok) {
                await this.handleDiscordFailure(response, token, "update")
                return
            }

            // Slowly decay dynamicMinSendInterval on success
            const targetMinInterval = Settings.timings.minSendInterval ?? 700
            if (this.dynamicMinSendInterval > targetMinInterval) {
                this.dynamicMinSendInterval = Math.max(targetMinInterval, this.dynamicMinSendInterval - 100)
            }

            this.updateAutoOffsetSetting()
        }).catch(() => {
            this.applyTransientBackoff("Discord status update request failed")
        }).finally(() => {
            this.isRequestPending = false
        })

        return request
    }

    public clearStatusRequest(token: string): Promise<Response> {
        this.lastSentTime = Date.now()
        this.isRequestPending = true
        const request = fetch("https://discord.com/api/v9/users/@me/settings", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                custom_status: null
            })
        })

        request.then(async (response) => {
            if (!response.ok) {
                await this.handleDiscordFailure(response, token, "clear")
            }
        }).catch(() => {
            this.applyTransientBackoff("Discord status clear request failed")
        }).finally(() => {
            this.isRequestPending = false
        })

        return request
    }

    public changeStatus(): void {
        const now = Date.now()
        if (now >= this.rateLimitResetTime && now >= this.requestBackoffUntil) {
            this.playbackState.rateLimitResetTime = 0
            this.playbackState.rateLimitDuration = 0
        }

        const playbackState = this.playbackState

        if (playbackState.songId !== this.lastSongId) {
            this.sentLines = []
            this.lastStatusKey = ""
            this.lastSongId = playbackState.songId
        }

        const lyrics = playbackState.lyrics
        const canSendDiscordStatus = this.canSendDiscordStatus(playbackState)

        if (playbackState.lyricsLoading) return

        // 1. If song has no lyrics, handle fallback status
        if (!playbackState.hasLyrics || !lyrics || !lyrics.lines.length || lyrics.lines.every((line) => !line.text.trim())) {
            playbackState.currentLine = null

            if (!canSendDiscordStatus) return

            const songName = playbackState.songName
            if (!songName) return

            const key = `song-fallback:${playbackState.songId}:${songName}`
            this.trySendStatus(songName, "\uD83C\uDFB6", key)
            return
        }

        // 2. Find the active line based on song progress (no offset for local UI)
        const songProgress = playbackState.songProgress
        const lines = lyrics.lines
        let localActiveLine: LyricsLine | null = null

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const nextLine = lines[i + 1]

            if (line.time < songProgress) {
                if (nextLine && nextLine.time < songProgress) continue
                localActiveLine = line
                break
            }
        }

        // 3. Update in-app playback state instantly for smooth sync
        if (playbackState.currentLine !== localActiveLine) {
            Debug.write(`Active line changed from ${playbackState.currentLine?.time} to ${localActiveLine?.time} (progress=${songProgress}, text="${localActiveLine?.text.trim()}")`)
        }
        playbackState.currentLine = localActiveLine

        // Now, check if we can make Discord requests. If a request is pending, we can't send status to Discord, but we've already updated the local playbackState.currentLine!
        // 4. If status sending is disabled or paused, don't make any network calls to Discord.
        if (!canSendDiscordStatus) return

        // 5. Calculate active line for Discord status using the offset
        const offset = Settings.timings.sendTimeOffset
        let activeLine: LyricsLine | null = null

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const nextLine = lines[i + 1]

            if (line.time < (songProgress + offset)) {
                if (nextLine && nextLine.time < (songProgress + offset)) continue
                activeLine = line
                break
            }
        }

        // 6. Determine Discord status key and text. If several lyric lines pass while Discord is throttled,
        // this method naturally sends the newest active line on the next allowed tick.
        if (activeLine) {
            if (!activeLine.text.trim()) {
                // Instrumental line
                const key = `instrumental:${playbackState.songId}:${activeLine.time}`
                this.trySendStatus("", "\uD83C\uDFB6", key)
            } else {
                // Normal lyric line
                const key = `line:${playbackState.songId}:${activeLine.time}:${activeLine.text}`
                const text = Settings.view.advanced.enabled
                    ? this.parseStatusString(Settings.view.advanced.customStatus, activeLine)
                    : this.getStatusString(activeLine)
                const emoji = Settings.view.advanced.enabled
                    ? Settings.view.advanced.customEmoji
                    : "\uD83C\uDFB6"
                this.trySendStatus(text, emoji, key)
            }
        } else {
            // Intro section
            const key = `instrumental:${playbackState.songId}:intro`
            this.trySendStatus("", "\uD83C\uDFB6", key)
        }
    }

    public songChanged(): void {
        this.sentLines = []
        this.lastStatusKey = ""
    }

    public resetTokenBlock(token?: string): void {
        if (!this.blockedToken) return
        if (token && token !== this.blockedToken) return

        this.blockedToken = ""
        Debug.write("Discord token block cleared after token validation.")
    }

    public formatSeconds(s: number): string {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0' ) + s
    }

    public getStatusString(line: LyricsLine): string {
        return `${Settings.view.timestamp ? `[${this.formatSeconds(+(line.time / 1000).toFixed(0))}] ` : ""}${Settings.view.label ? "Lời bài hát - " : ""}${line.text.replace("\u266A", "\uD83C\uDFB6")}`.slice(0, 128)
    }

    public parseStatusString(status: string, statusLine?: LyricsLine): string {
        const line = statusLine || this.playbackState.currentLine
        if(line) {
            const songName = this.playbackState.songName
            const songAuthor = this.playbackState.songAuthor

            status = status
                .replace("{lyrics}", line.text)
                .replace("{lyrics_upper}", line.text.toUpperCase())
                .replace("{lyrics_lower}", line.text.toLowerCase())
                .replace("{lyrics_letters_only}", line.text.replace(/['",\.]/gi, ""))
                .replace("{lyrics_upper_letters_only}", line.text.toUpperCase().replace(/['",\.]/gi, ""))
                .replace("{lyrics_lower_letters_only}", line.text.toLowerCase().replace(/['",\.]/gi, ""))
                .replace("\u266A", "\uD83C\uDFB6")
                .replace("{timestamp}", this.formatSeconds(+(line.time / 1000).toFixed()))
                .replace("{song_name}", songName)
                .replace("{song_name_upper}", songName.toUpperCase())
                .replace("{song_name_lower}", songName.toLowerCase())
                .replace("{song_name_cropped}", songName.replace(/( ?- ?.+)|(\(.+\))/gi, ""))
                .replace("{song_name_upper_cropped}", songName.toUpperCase().replace(/( ?- ?.+)|(\(.+\))/gi, ""))
                .replace("{song_name_lower_cropped}", songName.toLowerCase().replace(/( ?- ?.+)|(\(.+\))/gi, ""))
                .replace("{song_author}", songAuthor)
                .replace("{song_author_upper}", songAuthor.toUpperCase())
                .replace("{song_author_lower}", songAuthor.toLowerCase());
        }

        return status.slice(0, 128);
    }

    private canSendDiscordStatus(playbackState: PlaybackState): boolean {
        if (!Settings.credentials.token) return false
        if (this.isTokenBlocked()) return false

        if (!Settings.view.discordEnabled) {
            this.clearStatusOnce()
            return false
        }

        if (playbackState.ended || !playbackState.isPlaying) {
            this.scheduleClearStatus()
            return false
        }

        this.clearStatusScheduledAt = 0
        return true
    }

    private scheduleClearStatus(): void {
        if (this.lastStatusKey === "clear") return

        const now = Date.now()
        if (!this.clearStatusScheduledAt) {
            this.clearStatusScheduledAt = now + this.clearDebounceMs
            return
        }

        if (now < this.clearStatusScheduledAt) return

        this.clearStatusScheduledAt = 0
        this.clearStatusOnce()
    }

    private clearStatusOnce(): void {
        if (this.lastStatusKey === "clear") return

        if (!this.canDispatchDiscordRequest()) return

        this.lastStatusKey = "clear"
        this.sentLines = []
        this.recordDiscordDispatch()
        this.clearStatusRequest(Settings.credentials.token)
            .catch((e) => Debug.write("Discord status clear failed: " + e.stack))
    }

    private trySendStatus(text: string | null, emoji: string, key: string): void {
        if (this.lastStatusKey === key) return
        if (Date.now() - this.lastSentTime < this.dynamicMinSendInterval) return
        if (!this.canDispatchDiscordRequest()) return

        this.lastStatusKey = key
        this.recordDiscordDispatch()
        this.changeStatusRequest(text === null ? null : text.slice(0, 128), Settings.credentials.token, emoji)
            .catch((e) => Debug.write("Discord status update failed: " + e.stack))
    }

    private canDispatchDiscordRequest(): boolean {
        const now = Date.now()

        if (this.isRequestPending) return false
        if (this.isTokenBlocked()) return false
        if (now < this.rateLimitResetTime || now < this.requestBackoffUntil) return false

        this.sentTimestamps = this.sentTimestamps.filter((time) => now - time < this.requestWindowMs)
        if (this.sentTimestamps.length >= this.maxRequestsPerWindow) {
            const resetTime = this.sentTimestamps[0] + this.requestWindowMs
            if (resetTime > this.requestBackoffUntil + 50) {
                Debug.write(`Local Discord send budget reached. Holding requests for ${Math.ceil((resetTime - now) / 1000)} seconds.`)
            }

            this.requestBackoffUntil = Math.max(this.requestBackoffUntil, resetTime)
            this.playbackState.rateLimitResetTime = this.requestBackoffUntil
            this.playbackState.rateLimitDuration = Math.max(0, (this.requestBackoffUntil - now) / 1000)
            this.dynamicMinSendInterval = Math.max(this.dynamicMinSendInterval, 2500)
            return false
        }

        return true
    }

    private recordDiscordDispatch(): void {
        this.lastSentTime = Date.now()
        this.sentTimestamps.push(this.lastSentTime)
    }

    private async handleDiscordFailure(response: Response, token: string, action: string): Promise<void> {
        Debug.write(`Discord status ${action} failed with HTTP ${response.status}`)

        if (response.status === 429) {
            const retryAfter = await this.getRetryAfter(response)
            const resetTime = Date.now() + Math.ceil(retryAfter * 1000)
            this.rateLimitResetTime = resetTime
            this.playbackState.rateLimitResetTime = resetTime
            this.playbackState.rateLimitDuration = retryAfter
            this.dynamicMinSendInterval = Math.max(this.dynamicMinSendInterval, 3000)
            Debug.write(`Discord rate limited. Holding requests for ${retryAfter} seconds.`)
            return
        }

        if (response.status === 401 || response.status === 403) {
            this.blockedToken = token
            Debug.write("Discord token was rejected. Status sending is paused until the token changes or is checked again.")
            return
        }

        this.applyTransientBackoff(`Discord status ${action} failed with HTTP ${response.status}`)
    }

    private async getRetryAfter(response: Response): Promise<number> {
        try {
            const body: any = await response.clone().json()
            const retryAfter = Number(body?.retry_after)
            if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter
        } catch {}

        const retryHeader = response.headers.get("Retry-After")
        const retryAfter = retryHeader ? Number(retryHeader) : NaN
        return Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 5
    }

    private applyTransientBackoff(message: string): void {
        const resetTime = Date.now() + 5000
        this.requestBackoffUntil = Math.max(this.requestBackoffUntil, resetTime)
        this.playbackState.rateLimitResetTime = this.requestBackoffUntil
        this.playbackState.rateLimitDuration = Math.max(0, (this.requestBackoffUntil - Date.now()) / 1000)
        Debug.write(`${message}. Holding Discord requests briefly.`)
    }

    private isTokenBlocked(): boolean {
        if (!this.blockedToken) return false

        if (Settings.credentials.token !== this.blockedToken) {
            this.blockedToken = ""
            return false
        }

        return true
    }

    private updateAutoOffsetSetting(): void {
        if (!Settings.timings.enableAutooffset) return

        const dynamicLimit = this.autooffset.getVarianceLimit()
        const average = this.autooffset.getAverageValue(dynamicLimit)
        if (!Number.isFinite(average) || average <= 0) return

        const measuredOffset = Math.max(50, Math.min(2000, Math.round(average + 100)))
        if (Math.abs(measuredOffset - this.lastSavedAutoOffset) < 25) return

        Settings.timings.sendTimeOffset = measuredOffset
        this.lastSavedAutoOffset = measuredOffset
        Settings.save()
        broadcastSettings()
    }
}
