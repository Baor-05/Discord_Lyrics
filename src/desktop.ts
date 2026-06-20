import { app, BrowserWindow, Menu, shell, Tray } from "electron"
import { join } from "node:path"
import { Settings } from "./Settings"
import { shutdown } from "./index"

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false
let isRecreating = false
const appUserModelId = "local.discordlyrics.desktop"

;(global as any).toggleMiniMode = (enabled: boolean) => {
    if (mainWindow) {
        try {
            const bounds = mainWindow.getBounds()
            const isCurrentlyMini = mainWindow.isAlwaysOnTop()
            if (isCurrentlyMini) {
                (Settings.view as any).miniWindowWidth = bounds.width;
                (Settings.view as any).miniWindowHeight = bounds.height;
                (Settings.view as any).miniWindowX = bounds.x;
                (Settings.view as any).miniWindowY = bounds.y;
            } else {
                (Settings.view as any).windowWidth = bounds.width;
                (Settings.view as any).windowHeight = bounds.height;
                (Settings.view as any).windowX = bounds.x;
                (Settings.view as any).windowY = bounds.y;
            }
            Settings.save()
        } catch (e) {
            // Ignore error
        }

        isRecreating = true
        mainWindow.destroy()
        mainWindow = null
    }
    createWindow()
}

function getIconPath(): string {
    if (app.isPackaged) {
        return join(process.resourcesPath, "assets", "icon.ico")
    }

    return join(__dirname, "../assets/icon.ico")
}

function createWindow(): void {
    const isMini = (Settings.view as any).miniMode || false

    // Load saved bounds from Settings
    const savedWidth = isMini ? (Settings.view as any).miniWindowWidth : (Settings.view as any).windowWidth
    const savedHeight = isMini ? (Settings.view as any).miniWindowHeight : (Settings.view as any).windowHeight
    const savedX = isMini ? (Settings.view as any).miniWindowX : (Settings.view as any).windowX
    const savedY = isMini ? (Settings.view as any).miniWindowY : (Settings.view as any).windowY

    mainWindow = new BrowserWindow({
        width: savedWidth || (isMini ? 380 : 1120),
        height: savedHeight || (isMini ? 360 : 680),
        x: savedX,
        y: savedY,
        minWidth: isMini ? 250 : 900,
        minHeight: isMini ? 50 : 560,
        alwaysOnTop: isMini,
        frame: !isMini,
        transparent: isMini,
        resizable: true,
        hasShadow: !isMini,
        title: "DiscordLyrics",
        icon: getIconPath(),
        backgroundColor: isMini ? "#00000000" : "#202124",
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    const saveBounds = () => {
        if (!mainWindow) return
        try {
            const bounds = mainWindow.getBounds()
            const isCurrentlyMini = mainWindow.isAlwaysOnTop()
            if (isCurrentlyMini) {
                (Settings.view as any).miniWindowWidth = bounds.width;
                (Settings.view as any).miniWindowHeight = bounds.height;
                (Settings.view as any).miniWindowX = bounds.x;
                (Settings.view as any).miniWindowY = bounds.y;
            } else {
                (Settings.view as any).windowWidth = bounds.width;
                (Settings.view as any).windowHeight = bounds.height;
                (Settings.view as any).windowX = bounds.x;
                (Settings.view as any).windowY = bounds.y;
            }
            Settings.save()
        } catch (e) {
            // Ignore error if window is destroyed
        }
    }

    mainWindow.on("resize", saveBounds)
    mainWindow.on("move", saveBounds)

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: "deny" }
    })

    mainWindow.on("close", (event) => {
        if (isQuitting) return

        event.preventDefault()
        mainWindow?.hide()
    })

    const delay = isRecreating ? 0 : 800
    isRecreating = false // Reset recreation flag
    setTimeout(() => {
        mainWindow?.loadURL("http://127.0.0.1:8999")
    }, delay)
}

function showMainWindow(): void {
    if (!mainWindow) createWindow()

    mainWindow?.show()
    mainWindow?.focus()
}

function createTray(): void {
    tray = new Tray(getIconPath())
    tray.setToolTip("DiscordLyrics")
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Open DiscordLyrics",
            click: showMainWindow
        },
        {
            label: "Quit",
            click: async () => {
                isQuitting = true
                try {
                    await shutdown()
                } catch (e) {
                    // Ignore errors
                }
                app.quit()
            }
        }
    ]))
    tray.on("double-click", showMainWindow)
}

app.setAppUserModelId(appUserModelId)

app.whenReady().then(() => {
    createWindow()
    createTray()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        // Keep running in the tray until the user chooses Quit.
    }
})
