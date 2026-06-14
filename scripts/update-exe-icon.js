const path = require("node:path")
const { rcedit } = require("rcedit")

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
    const exePath = path.resolve("desktop-release/win-unpacked/DiscordLyrics.exe")
    const iconPath = path.resolve("assets/icon.ico")

    let lastError

    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            await rcedit(exePath, {
                icon: iconPath
            })
            console.log(`Updated exe icon: ${exePath}`)
            return
        } catch (error) {
            lastError = error
            console.warn(`rcedit icon update failed on attempt ${attempt}; retrying...`)
            await wait(1500)
        }
    }

    throw lastError
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
