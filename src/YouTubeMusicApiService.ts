import { Settings } from "./Settings"

export interface YouTubeMusicApiSong {
    title: string
    artist: string
    videoId: string
    songDuration: number
    elapsedSeconds?: number
    isPaused?: boolean
}

export interface YouTubeMusicApiPlayback {
    hasSession: boolean
    title?: string
    artist?: string
    videoId?: string
    isPlaying?: boolean
    positionMs?: number
    durationMs?: number
}

function getApiSettings(): {
    enabled: boolean
    host: string
    port: number
    accessToken: string
} {
    const api = (Settings.view as any).ytmusicApi || {}
    const port = Number(api.port)

    return {
        enabled: api.enabled !== false,
        host: String(api.host || "127.0.0.1").trim() || "127.0.0.1",
        port: Number.isFinite(port) && port > 0 ? port : 26538,
        accessToken: String(api.accessToken || "")
    }
}

function getBaseUrl(): string {
    const api = getApiSettings()
    return `http://${api.host}:${api.port}`
}

async function requestWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal
        })
    } finally {
        clearTimeout(timeout)
    }
}

export class YouTubeMusicApiService {
    private static readonly authCooldownMs = 60000
    private static authPromise: Promise<string | null> | null = null
    private static nextAuthAttemptAt = 0
    private static lastElapsedSeconds = -1
    private static lastIncrementTime = 0

    public static async readPlayback(): Promise<YouTubeMusicApiPlayback> {
        const api = getApiSettings()
        if (!api.enabled) return { hasSession: false }

        let response = await this.requestSong(api.accessToken)

        if (response.status === 204) return { hasSession: false }

        if (response.status === 401 || response.status === 403) {
            if (api.accessToken) this.saveAccessToken("")

            const token = await this.authorizeWithCooldown()
            if (!token) return { hasSession: false }

            response = await this.requestSong(token)
        }

        if (response.status === 204) return { hasSession: false }
        if (!response.ok) throw new Error(`YouTube Music API HTTP ${response.status}`)

        const song = await response.json() as YouTubeMusicApiSong
        if (!song || !song.title) return { hasSession: false }

        const elapsedSeconds = song.elapsedSeconds || 0
        const now = Date.now()
        if (elapsedSeconds !== this.lastElapsedSeconds) {
            this.lastElapsedSeconds = elapsedSeconds
            this.lastIncrementTime = now
        }

        let positionMs = elapsedSeconds * 1000
        if (song.isPaused !== true && this.lastIncrementTime > 0) {
            const drift = now - this.lastIncrementTime
            if (drift < 1500) {
                positionMs += drift
            }
        }

        return {
            hasSession: true,
            title: song.title,
            artist: song.artist || "",
            videoId: song.videoId || `${song.title}:${song.artist || ""}`,
            isPlaying: song.isPaused !== true,
            positionMs: Math.max(0, Math.round(positionMs)),
            durationMs: Math.max(0, Math.round((song.songDuration || 0) * 1000))
        }
    }

    private static requestSong(accessToken: string): Promise<Response> {
        const headers: Record<string, string> = {}
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`

        return requestWithTimeout(`${getBaseUrl()}/api/v1/song`, {
            method: "GET",
            headers
        })
    }

    private static authorizeWithCooldown(): Promise<string | null> {
        const now = Date.now()
        if (now < this.nextAuthAttemptAt) return Promise.resolve(null)
        if (this.authPromise) return this.authPromise

        this.authPromise = this.authorize()
            .then((token) => {
                this.nextAuthAttemptAt = 0
                return token
            })
            .catch(() => {
                this.nextAuthAttemptAt = Date.now() + this.authCooldownMs
                return null
            })
            .finally(() => {
                this.authPromise = null
            })

        return this.authPromise
    }

    private static async authorize(): Promise<string | null> {
        const clientId = Settings.credentials.uuid || "discordlyrics"
        const response = await requestWithTimeout(`${getBaseUrl()}/auth/${encodeURIComponent(clientId)}`, {
            method: "POST"
        }, 10000)

        if (!response.ok) return null

        const body = await response.json() as { accessToken?: string }
        const accessToken = body.accessToken || ""
        if (!accessToken) return null

        this.saveAccessToken(accessToken)

        return accessToken
    }

    public static async sendCommand(command: string, data?: any): Promise<boolean> {
        const api = getApiSettings()
        if (!api.enabled) return false

        try {
            let token = api.accessToken
            let response = await this.executeCommandRequest(token, command, data)

            if (response.status === 401 || response.status === 403) {
                if (api.accessToken) this.saveAccessToken("")

                token = await this.authorizeWithCooldown() || ""
                if (!token) return false

                response = await this.executeCommandRequest(token, command, data)
            }

            return response.ok
        } catch (e) {
            return false
        }
    }

    private static executeCommandRequest(accessToken: string, command: string, data?: any): Promise<Response> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        }
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`

        const body: Record<string, any> = { command }
        if (data !== undefined) body.data = data

        return requestWithTimeout(`${getBaseUrl()}/api/v1/command`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
    }

    private static saveAccessToken(accessToken: string): void {
        ;(Settings.view as any).ytmusicApi = {
            ...(Settings.view as any).ytmusicApi,
            accessToken
        }
        Settings.save()
    }
}
