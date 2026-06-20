import express from "express"
import { createServer } from "node:http"
import { WebSocketServer } from "ws"
import { join } from "node:path"
import { Settings } from "../Settings"
import { SpotifyService } from "../SpotifyService"
import { Debug } from "../Debug"
import { WindowsMediaService } from "../WindowsMediaService"
import { YouTubeMusicWebService } from "../YouTubeMusicWebService"
import { YouTubeMusicApiService } from "../YouTubeMusicApiService"
import { Updater } from "../Updater"

const clients: Set<import("ws").WebSocket> = new Set()
type PlaybackRefresh = () => void | Promise<void>

function getSettingsPayload(): object {
    return {
        credentials: Settings.credentials,
        view: Settings.view,
        timings: Settings.timings,
        update: Settings.update
    }
}

export function broadcastPanelMessage(type: string, payload: object): void {
    const message = JSON.stringify({ type, payload })

    for (const client of clients) {
        if (client.readyState === client.OPEN) {
            client.send(message)
        }
    }
}

export function broadcastSettings(): void {
    broadcastPanelMessage("settings", getSettingsPayload())
}

export function startServer(refreshPlayback?: PlaybackRefresh): void {
    const app = express()
    const httpServer = createServer(app)
    const wss = new WebSocketServer({
        server: httpServer,
        path: "/ws"
    })

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type")
        if (req.method === "OPTIONS") return res.sendStatus(204)
        next()
    })
    app.use(express.json({ limit: "16kb" }))
    app.use("/", express.static(join(__dirname, "../../static")))

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "../../static/index.html"))
    })

    app.post("/api/ytmusic-web/playback", (req, res) => {
        const accepted = YouTubeMusicWebService.update(req.body)
        if (accepted) {
            const pending = YouTubeMusicWebService.dequeueCommand()
            if (pending) {
                return res.json({ command: pending.command, data: pending.data })
            }
            return res.sendStatus(204)
        }
        res.sendStatus(400)
    })

    app.post("/api/playback/control", async (req, res) => {
        const allowedActions = new Set(["play", "pause", "playPause", "stop", "next", "previous", "seekBy", "seekTo", "toggleShuffle", "cycleRepeat"])
        const source = req.body?.source === "ytmusic" ? "ytmusic" : "spotify"
        const action = String(req.body?.action || "")

        if (!allowedActions.has(action)) {
            return res.status(400).json({ ok: false, message: "Invalid playback action" })
        }

        try {
            if (source === "ytmusic") {
                let executed = false

                // 1. Try YouTube Music Desktop API
                const apiSettings = (Settings.view as any).ytmusicApi || {}
                if (apiSettings.enabled !== false) {
                    let apiCommand = action
                    let apiData: any = undefined

                    if (action === "toggleShuffle") {
                        apiCommand = "shuffle"
                    } else if (action === "cycleRepeat") {
                        apiCommand = "repeatMode"
                        let newMode = 1
                        try {
                            const mediaState = await WindowsMediaService.readPlayback("ytmusic")
                            if (mediaState.hasSession) {
                                const currentRepeat = mediaState.repeatState || "off"
                                if (currentRepeat === "track") {
                                    newMode = 0
                                } else if (currentRepeat === "context") {
                                    newMode = 2
                                } else {
                                    newMode = 1
                                }
                            }
                        } catch {}
                        apiData = newMode
                    } else if (action === "seekTo") {
                        apiData = Math.round(Number(req.body?.positionMs || 0) / 1000)
                    }

                    executed = await YouTubeMusicApiService.sendCommand(apiCommand, apiData)
                }

                // 2. Try YouTube Music Web Extension (enqueuing the command)
                if (!executed && YouTubeMusicWebService.readPlayback().hasSession) {
                    YouTubeMusicWebService.enqueueCommand(action, {
                        positionMs: Number(req.body?.positionMs || 0)
                    })
                    executed = true
                }

                // 3. Fallback to Windows Media Session
                if (!executed) {
                    const result = await WindowsMediaService.controlSession(source, action as any, {
                        deltaMs: Number(req.body?.deltaMs || 0),
                        positionMs: Number(req.body?.positionMs || 0)
                    })
                    executed = result.ok
                }

                if (executed && refreshPlayback) {
                    await refreshPlayback()
                    setTimeout(() => {
                        Promise.resolve(refreshPlayback()).catch((error) => {
                            Debug.write("Delayed playback refresh failed: " + (error as Error).stack)
                        })
                    }, 250)
                }

                return res.json({ ok: executed })
            }

            // Spotify control path remains unchanged
            const result = await WindowsMediaService.controlSession(source, action as any, {
                deltaMs: Number(req.body?.deltaMs || 0),
                positionMs: Number(req.body?.positionMs || 0)
            })

            if (result.ok && refreshPlayback) {
                await refreshPlayback()
                setTimeout(() => {
                    Promise.resolve(refreshPlayback()).catch((error) => {
                        Debug.write("Delayed playback refresh failed: " + (error as Error).stack)
                    })
                }, 250)
            }

            res.status(result.ok ? 200 : 404).json(result)
        } catch (e) {
            Debug.write("Playback control failed: " + (e as Error).stack)
            res.status(500).json({ ok: false, message: "Playback control failed" })
        }
    })

    app.get("/api/update/check", async (req, res) => {
        try {
            res.json(await Updater.checkLatest())
        } catch (e) {
            Debug.write("Update check failed: " + (e as Error).stack)
            res.status(500).json({
                hasUpdate: false,
                message: "Không kiểm tra được cập nhật. Hãy kiểm tra mạng hoặc GitHub Releases."
            })
        }
    })

    app.post("/api/update/install", async (req, res) => {
        try {
            const result = await Updater.downloadAndRunLatest()
            res.json(result)

            if (result.hasUpdate) {
                setTimeout(() => process.exit(0), 1000)
            }
        } catch (e) {
            Debug.write("Update install failed: " + (e as Error).stack)
            res.status(500).json({
                hasUpdate: false,
                message: "Không tải hoặc mở được trình cài đặt bản mới."
            })
        }
    })

    app.get("/callback", async (req, res) => {
        if (Settings.credentials.useExternalAuthServer) {
            if (!req.query.refresh_token) return res.sendStatus(401)

            const refreshToken = req.query.refresh_token
            Settings.credentials.refreshToken = refreshToken as string
            Settings.save()
        } else {
            if (!req.query.code) return res.sendStatus(401)

            const code = req.query.code
            Settings.credentials.code = code as string

            try {
                await SpotifyService.exchange()
                Settings.save()
            } catch(e) {
                Debug.write("Spotify authorization callback failed: " + (e as Error).stack)
                return res.status(500).send("Spotify authorization failed. Check Client ID, Client Secret, Redirect URI, then try Authorize Spotify again.")
            }
        }

        res.send("OK. You can close this page now.")
    })

    wss.on("connection", (ws) => {
        clients.add(ws)

        ws.on("message", (data) => {
            const message = JSON.parse(data.toString())
            const settings = message.type === "settings" ? message.payload : message
            // Not typed but it's necessary

            const oldActiveSource = (Settings.view as any).activeSource || "spotify"
            const newActiveSource = settings.view.activeSource || "spotify"

            const oldMiniMode = (Settings.view as any).miniMode || false
            const newMiniMode = settings.view.miniMode || false

            Settings.credentials = settings.credentials
            Settings.view = settings.view
            Settings.timings = settings.timings
            Settings.update = settings.update

            Settings.save()

            if (oldMiniMode !== newMiniMode) {
                if (typeof (global as any).toggleMiniMode === "function") {
                    (global as any).toggleMiniMode(newMiniMode)
                }
            }

            if (oldActiveSource !== newActiveSource) {
                // Switch media playback!
                if (newActiveSource === "spotify") {
                    // Pause YouTube Music, Play Spotify
                    WindowsMediaService.controlSession("ytmusic", "pause")
                        .then(() => {
                            setTimeout(() => {
                                WindowsMediaService.controlSession("spotify", "play")
                            }, 500) // 500ms delay to make it smooth
                        })
                } else if (newActiveSource === "ytmusic") {
                    // Pause Spotify, Play YouTube Music
                    WindowsMediaService.controlSession("spotify", "pause")
                        .then(() => {
                            setTimeout(() => {
                                WindowsMediaService.controlSession("ytmusic", "play")
                            }, 500)
                        })
                }
            }
        })

        ws.on("close", () => clients.delete(ws))

        ws.send(JSON.stringify({
            type: "settings",
            payload: getSettingsPayload()
        }))
    })

    httpServer.listen(8999)
}
