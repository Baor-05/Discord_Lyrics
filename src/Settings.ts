import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { Debug } from "./Debug"

function getSettingsPath(): string {
    const appData = process.env.APPDATA || (process.env.USERPROFILE ? join(process.env.USERPROFILE, "AppData", "Roaming") : process.cwd())

    return join(appData, "DiscordLyrics", "settings.json")
}

function readSettingsFile(path: string): unknown {
    const content = readFileSync(path, { encoding: "utf-8" }).replace(/^\uFEFF/, "")

    return JSON.parse(content)
}

export class Settings {
    public static credentials = {
        token: "",
        cookies: "",
        clientID: "",
        clientSecret: "",
        useExternalAuthServer: "",
        code: "",
        refreshToken: "",
        uuid: "",
        customRedirectUri: ""
    }

    public static view = {
        timestamp: true,
        label: true,
        advanced: {
            enabled: false,
            customEmoji: "\uD83C\uDFB6",
            customStatus: "[{timestamp}] [{lyrics}]"
        },
        activeSource: "spotify",
        discordEnabled: true,
        miniMode: false,
        windowWidth: 1120,
        windowHeight: 680,
        miniWindowWidth: 380,
        miniWindowHeight: 360,
        windowX: undefined as number | undefined,
        windowY: undefined as number | undefined,
        miniWindowX: undefined as number | undefined,
        miniWindowY: undefined as number | undefined,
        ytmusicApi: {
            enabled: true,
            host: "127.0.0.1",
            port: 26538,
            accessToken: ""
        },
        ytmusicWeb: {
            enabled: true
        }
    }

    public static timings = {
        sendTimeOffset: 200,
        enableAutooffset: true,
        autooffset: 3,
        minSendInterval: 700
    }

    public static update = {
        enableAutoupdate: false
    }

    public static settingsPath = getSettingsPath()

    public static save(): void {
        mkdirSync(dirname(this.settingsPath), { recursive: true })
        writeFileSync(this.settingsPath, JSON.stringify({
            credentials: this.credentials,
            view: this.view,
            timings: this.timings,
            update: this.update
        }, null, 2))
    }

    public static load(): void {
        let settings: any

        try {
            settings = readSettingsFile(this.settingsPath)
        } catch(e) {
            const legacyPaths = [
                join(dirname(process.execPath), "settings.json"),
                "./settings.json"
            ]

            for (const path of legacyPaths) {
                try {
                    if (existsSync(path)) {
                        settings = readSettingsFile(path)
                        Debug.write("Migrated settings from " + path + " to " + this.settingsPath)
                        break
                    }
                } catch(legacyError) {
                    Debug.write("An error occurred while trying to read settings from " + path + ". Error: " + (legacyError as Error).stack)
                }
            }
        }

        if (settings) {
            this.credentials = settings.credentials || this.credentials
            this.view = {
                ...this.view,
                ...(settings.view || {}),
                advanced: {
                    ...this.view.advanced,
                    ...((settings.view && settings.view.advanced) || {})
                },
                ytmusicApi: {
                    ...(this.view as any).ytmusicApi,
                    ...((settings.view && settings.view.ytmusicApi) || {})
                },
                ytmusicWeb: {
                    ...(this.view as any).ytmusicWeb,
                    ...((settings.view && settings.view.ytmusicWeb) || {})
                }
            }
            this.timings = {
                ...this.timings,
                ...(settings.timings || {})
            }
            this.update = settings.update || this.update
            this.save()
        }
    }
}
