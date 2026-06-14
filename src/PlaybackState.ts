import { LyricsLine, SongLyrics } from "./Sources/BaseSource"

export class PlaybackState {
    public songName: string
    public songAuthor: string

    public songId: string
    public oldSongId: string

    public songDuration: number
    public songProgress: number

    public lyrics: SongLyrics | null
    public currentLine: LyricsLine | null
    public hasLyrics: boolean
    public lyricsLoading: boolean

    public isPlaying: boolean
    public errorMessage: string
    public rateLimitResetTime: number
    public rateLimitDuration: number

    constructor() {
        this.songName = ""
        this.songAuthor = ""

        this.songId = ""
        this.oldSongId = ""

        this.songDuration = 0
        this.songProgress = 0

        this.lyrics = null
        this.currentLine = null
        this.hasLyrics = false
        this.lyricsLoading = false

        this.isPlaying = false
        this.errorMessage = ""
        this.rateLimitResetTime = 0
        this.rateLimitDuration = 0
    }

    get ended(): boolean {
        return this.songDuration < this.songProgress
    }
}
