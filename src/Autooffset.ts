export class Autooffset {
    public keys: number[]
    public limit: number

    constructor() {
        this.keys = []
        this.limit = 3
    }

    public addValue(value: number): void {
        this.keys.unshift(value)
        // Keep up to 10 historical values to analyze variance
        if (this.keys.length > 10) {
            this.keys.pop()
        }
    }

    public getAverageValue(limit: number): number {
        const activeKeys = this.keys.slice(0, limit).filter((key) => key > 0)
        let sum = 0

        for (const key of activeKeys) {
            sum += key
        }

        return activeKeys.length ? sum / activeKeys.length : 0
    }

    public getVarianceLimit(): number {
        const activeKeys = this.keys.filter((key) => key > 0)
        if (activeKeys.length < 3) return 3 // Default limit

        const min = Math.min(...activeKeys)
        const max = Math.max(...activeKeys)

        // If variance (network jitter) is high (> 150ms), increase limit to 6 to smooth out the offset
        if (max - min > 150) {
            return 6
        }
        return 3
    }

    // Deprecated but kept for compatibility
    public setLimit(limit: number): void {
        this.limit = limit
    }
}
