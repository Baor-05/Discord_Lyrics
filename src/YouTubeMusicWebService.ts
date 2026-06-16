import { YouTubeMusicApiPlayback } from "./YouTubeMusicApiService"

export interface YouTubeMusicWebPayload {
    source?: string
    pageUrl?: string
    title?: string
    artist?: string
    videoId?: string
    isPlaying?: boolean
    positionMs?: number
    durationMs?: number
}

export class YouTubeMusicWebService {
    private static readonly maxAgeMs = 5000
    private static lastPayload: YouTubeMusicWebPayload | null = null
    private static lastUpdatedAt = 0

    public static update(payload: YouTubeMusicWebPayload): boolean {
        if (!this.isValidPayload(payload)) return false

        this.lastPayload = {
            source: "ytmusic-web",
            pageUrl: payload.pageUrl,
            title: payload.title?.normalize("NFC").trim(),
            artist: payload.artist?.normalize("NFC").trim() || "",
            videoId: payload.videoId || payload.pageUrl || `${payload.title}:${payload.artist || ""}`,
            isPlaying: payload.isPlaying === true,
            positionMs: this.safeMs(payload.positionMs),
            durationMs: this.safeMs(payload.durationMs)
        }
        this.lastUpdatedAt = Date.now()

        return true
    }

    public static readPlayback(): YouTubeMusicApiPlayback {
        if (!this.lastPayload || Date.now() - this.lastUpdatedAt > this.maxAgeMs) {
            return { hasSession: false }
        }

        return {
            hasSession: true,
            title: this.lastPayload.title,
            artist: this.lastPayload.artist || "",
            videoId: this.lastPayload.videoId,
            isPlaying: this.lastPayload.isPlaying === true,
            positionMs: this.lastPayload.positionMs || 0,
            durationMs: this.lastPayload.durationMs || 0
        }
    }

    private static isValidPayload(payload: YouTubeMusicWebPayload): boolean {
        if (!payload || payload.source !== "ytmusic-web") return false
        if (!payload.title || !payload.title.trim()) return false

        try {
            const url = new URL(payload.pageUrl || "")
            return url.hostname === "music.youtube.com"
        } catch {
            return false
        }
    }

    private static safeMs(value: unknown): number {
        const numberValue = Number(value)
        if (!Number.isFinite(numberValue) || numberValue < 0) return 0
        return Math.round(numberValue)
    }
}
