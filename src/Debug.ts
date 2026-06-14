import { unlinkSync, appendFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

function getLogDir(): string {
    const appData = process.env.APPDATA || (process.env.USERPROFILE ? join(process.env.USERPROFILE, "AppData", "Roaming") : process.cwd())
    return join(appData, "DiscordLyrics")
}

export class Debug {
    public static path: string = getLogDir()

    public static write(text: string): void {
        const date = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        const dir = this.path
        try {
            if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
            appendFileSync(join(dir, "log.txt"), `[${date}]: ${text}\n`)
        } catch (e) {}
    }
}

try {
    const logFile = join(Debug.path, "log.txt")
    if (existsSync(logFile)) unlinkSync(logFile)
} catch (e) {}
