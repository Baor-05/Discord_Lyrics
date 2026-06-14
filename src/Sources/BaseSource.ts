export interface LyricsLine {
    time: number
    text: string
}

export interface SongLyrics {
    lines: LyricsLine[]
}

export interface CachedSongLyrics extends SongLyrics {
    appName: string
}

export abstract class BaseSource {
    public abstract getLyrics(name: string, artist: string): Promise<SongLyrics>

    public abstract getAppName(): string

    protected isMetadataLine(text: string, name: string, artist: string): boolean {
        const value = text.trim()
        if (!value) return true

        // Check if it matches title or artist or combination (like title - artist)
        const lowerVal = value.toLowerCase()
        const lowerName = name.trim().toLowerCase()
        const lowerArtist = artist.trim().toLowerCase()

        if (lowerVal === lowerName || lowerVal === lowerArtist) return true
        if (lowerVal.includes(" - ") && (lowerVal.includes(lowerName) || lowerVal.includes(lowerArtist))) return true
        if (lowerVal.includes(" : ") && (lowerVal.includes(lowerName) || lowerVal.includes(lowerArtist))) return true

        const cleanName = lowerName.replace(/\s*[\(\[][^)]*[\)\]]/g, "").trim()
        const cleanArtist = lowerArtist.replace(/\s*[\(\[][^)]*[\)\]]/g, "").trim()

        if (cleanName && lowerVal === cleanName) return true
        if (cleanName && lowerVal.includes(" - ") && lowerVal.includes(cleanName)) return true

        // Check English "by" pattern: e.g., "composed by", "written by", "produced by", "lyrics by", "music by"
        if (/^\s*(?:composed|written|produced|arranged|recorded|mixed|mastered|lyrics|music|words|artwork|visuals)\s+by\b/i.test(value)) {
            return true
        }

        // Check standard colon/dash prefix pattern for metadata categories
        return /^\s*(?:作\s*词|作\s*詞|作\s*曲|编\s*曲|編\s*曲|制\s*作|製\s*作|监\s*制|監\s*製|和\s*声|和\s*聲|录\s*音|錄\s*音|混\s*音|母\s*带|母\s*帶|歌\s*词|歌\s*詞|企\s*划|企\s*劃|统\s*筹|統\s*籌|出\s*品|词\s*曲|詞\s*曲|词|詞|曲|lrc|composer|lyricist|lyrics?|music|arranger|producer|vocal|guitar|bass|drum|piano|keyboard|mixing|recording|mastering|studio|engineer|op|sp|written|composed|produced|arranged|recorded|mixed|mastered|vocals|drums|keyboards|synthesizer|artwork|designer|publisher|copyright|artist|title|album)\s*[:：\s-]/i.test(value)
    }

    protected normalizeLyrics(lyrics: SongLyrics, name: string, artist: string): SongLyrics {
        return {
            lines: lyrics.lines
                .map((line) => ({
                    time: line.time,
                    text: line.text.trim() || "♪"
                }))
                .filter((line) => !this.isMetadataLine(line.text, name, artist))
                .sort((a, b) => a.time - b.time)
        }
    }
}
