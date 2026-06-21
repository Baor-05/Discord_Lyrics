import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("discordLyricsWindow", {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
    close: () => ipcRenderer.invoke("window:close")
})
