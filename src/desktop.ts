import { app, BrowserWindow, Menu, shell, Tray } from "electron"
import { join } from "node:path"
import "./index"

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false
const appUserModelId = "local.discordlyrics.desktop"

function getIconPath(): string {
    if (app.isPackaged) {
        return join(process.resourcesPath, "assets", "icon.ico")
    }

    return join(__dirname, "../assets/icon.ico")
}

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1120,
        height: 680,
        minWidth: 900,
        minHeight: 560,
        title: "DiscordLyrics",
        icon: getIconPath(),
        backgroundColor: "#202124",
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: "deny" }
    })

    mainWindow.on("close", (event) => {
        if (isQuitting) return

        event.preventDefault()
        mainWindow?.hide()
    })

    setTimeout(() => {
        mainWindow?.loadURL("http://127.0.0.1:8999")
    }, 800)
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
            click: () => {
                isQuitting = true
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
