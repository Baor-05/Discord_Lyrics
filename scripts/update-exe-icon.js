const path = require("node:path")
const packageJson = require("../package.json")
const { rcedit } = require("rcedit")

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main(context) {
    const appOutDir = context && context.appOutDir
        ? context.appOutDir
        : path.resolve("desktop-release/win-unpacked")
    const exePath = path.join(appOutDir, "DiscordLyrics.exe")
    const iconPath = path.resolve("assets/icon.ico")

    let lastError

    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            await rcedit(exePath, {
                icon: iconPath,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "version-string": {
                    CompanyName: packageJson.author || "DiscordLyrics",
                    FileDescription: "DiscordLyrics",
                    FileVersion: packageJson.version,
                    InternalName: "DiscordLyrics",
                    OriginalFilename: "DiscordLyrics.exe",
                    ProductName: "DiscordLyrics",
                    ProductVersion: packageJson.version
                }
            })
            console.log(`Updated exe icon and version ${packageJson.version}: ${exePath}`)
            return
        } catch (error) {
            lastError = error
            console.warn(`rcedit icon update failed on attempt ${attempt}; retrying...`)
            await wait(1500)
        }
    }

    throw lastError
}

module.exports = main

if (require.main === module) {
    main().catch((error) => {
        console.error(error)
        process.exit(1)
    })
}
