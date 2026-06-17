import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { basename, join } from "node:path"
import { spawn } from "node:child_process"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

type ReleaseAsset = {
    name: string
    browser_download_url: string
}

type GithubRelease = {
    html_url: string
    tag_name: string
    name?: string
    prerelease?: boolean
    draft?: boolean
    assets: ReleaseAsset[]
}

export type UpdateCheckResult = {
    currentVersion: string
    latestVersion: string
    hasUpdate: boolean
    releaseUrl?: string
    installerAssetName?: string
    message: string
}

export class Updater {
    private static readonly owner = "Baor-05"
    private static readonly repo = "Discord_Lyrics"
    private static readonly apiUrl = `https://api.github.com/repos/${Updater.owner}/${Updater.repo}/releases/latest`

    public static async tryUpdate(): Promise<boolean> {
        const update = await Updater.checkLatest()

        if (!update.hasUpdate) {
            return false
        }

        await Updater.downloadAndRunLatest()
        return true
    }

    public static async checkLatest(): Promise<UpdateCheckResult> {
        const currentVersion = Updater.getCurrentVersion()
        const release = await Updater.fetchLatestRelease()
        const latestVersion = Updater.cleanVersion(release.tag_name || release.name || "0.0.0")
        const installerAsset = Updater.findInstallerAsset(release.assets)
        const hasUpdate = Updater.compareVersions(latestVersion, currentVersion) > 0

        if (!hasUpdate) {
            return {
                currentVersion,
                latestVersion,
                hasUpdate: false,
                releaseUrl: release.html_url,
                installerAssetName: installerAsset?.name,
                message: `Bạn đang dùng bản mới nhất (${currentVersion}).`
            }
        }

        if (!installerAsset) {
            return {
                currentVersion,
                latestVersion,
                hasUpdate: true,
                releaseUrl: release.html_url,
                message: `Có bản ${latestVersion}, nhưng release chưa có DiscordLyricsSetup.exe.`
            }
        }

        return {
            currentVersion,
            latestVersion,
            hasUpdate: true,
            releaseUrl: release.html_url,
            installerAssetName: installerAsset.name,
            message: `Có bản mới ${latestVersion}. Có thể tải và cài đặt ngay.`
        }
    }

    public static async downloadAndRunLatest(): Promise<UpdateCheckResult> {
        const update = await Updater.checkLatest()

        if (!update.hasUpdate) {
            return update
        }

        const release = await Updater.fetchLatestRelease()
        const installerAsset = Updater.findInstallerAsset(release.assets)

        if (!installerAsset) {
            throw new Error("Release mới không có DiscordLyricsSetup.exe")
        }

        const downloadPath = await Updater.downloadAsset(installerAsset, update.latestVersion)
        Updater.runInstaller(downloadPath)

        return {
            ...update,
            message: "Đã mở trình cài đặt bản mới. App sẽ tự đóng để Windows cập nhật file."
        }
    }

    private static async fetchLatestRelease(): Promise<GithubRelease> {
        const response = await fetch(Updater.apiUrl, {
            headers: {
                "Accept": "application/vnd.github+json",
                "User-Agent": "DiscordLyrics-Updater"
            }
        })

        if (!response.ok) {
            throw new Error(`GitHub trả về HTTP ${response.status}`)
        }

        return await response.json() as GithubRelease
    }

    private static async downloadAsset(asset: ReleaseAsset, version: string): Promise<string> {
        const response = await fetch(asset.browser_download_url, {
            headers: {
                "User-Agent": "DiscordLyrics-Updater"
            }
        })

        if (!response.ok || !response.body) {
            throw new Error(`Không tải được ${asset.name}. HTTP ${response.status}`)
        }

        const outputDir = join(tmpdir(), "DiscordLyrics", "updates", Updater.cleanVersion(version))
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true })
        }

        const safeName = basename(asset.name || "DiscordLyricsSetup.exe")
        const outputPath = join(outputDir, safeName)
        await pipeline(Readable.fromWeb(response.body as any), createWriteStream(outputPath))

        return outputPath
    }

    private static runInstaller(installerPath: string): void {
        const child = spawn(installerPath, [], {
            detached: true,
            stdio: "ignore"
        })

        child.unref()
    }

    private static findInstallerAsset(assets: ReleaseAsset[] = []): ReleaseAsset | undefined {
        return assets.find((asset) => /^DiscordLyricsSetup\.exe$/i.test(asset.name))
            || assets.find((asset) => /setup.*\.exe$/i.test(asset.name))
            || assets.find((asset) => /\.exe$/i.test(asset.name))
    }

    private static getCurrentVersion(): string {
        try {
            const packageJsonPath = join(__dirname, "../package.json")
            const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
            return Updater.cleanVersion(String(packageJson.version || "0.0.0"))
        } catch {
            try {
                return Updater.cleanVersion(readFileSync(join(__dirname, "../VERSION"), "utf-8"))
            } catch {
                return "0.0.0"
            }
        }
    }

    private static cleanVersion(version: string): string {
        return version.trim().replace(/^v/i, "").replace(/[^\d.].*$/, "")
    }

    private static compareVersions(a: string, b: string): number {
        const left = Updater.toVersionParts(a)
        const right = Updater.toVersionParts(b)
        const max = Math.max(left.length, right.length)

        for (let i = 0; i < max; i++) {
            const diff = (left[i] || 0) - (right[i] || 0)
            if (diff !== 0) return diff
        }

        return 0
    }

    private static toVersionParts(version: string): number[] {
        return Updater.cleanVersion(version)
            .split(".")
            .map((part) => Number(part))
            .map((part) => Number.isFinite(part) ? part : 0)
    }
}
