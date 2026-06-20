const DISCORDLYRICS_ENDPOINTS = [
  "http://127.0.0.1:8999/api/ytmusic-web/playback",
  "http://localhost:8999/api/ytmusic-web/playback"
]

let lastPayloadKey = ""
let lastSentAt = 0

function textFromSelector(selectors) {
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    const text = element && element.textContent ? element.textContent.trim() : ""
    if (text) return text
  }

  return ""
}

function getMediaSessionMetadata() {
  const metadata = navigator.mediaSession && navigator.mediaSession.metadata

  return {
    title: metadata && metadata.title ? String(metadata.title).trim() : "",
    artist: metadata && metadata.artist ? String(metadata.artist).trim() : "",
    album: metadata && metadata.album ? String(metadata.album).trim() : ""
  }
}

function normalizeArtist(text) {
  return String(text || "")
    .replace(/\s+\u2022\s+.*$/, "")
    .split(" - ")[0]
    .trim()
}

function getVideoId() {
  try {
    return new URL(location.href).searchParams.get("v") || ""
  } catch {
    return ""
  }
}

function collectPlayback() {
  const video = document.querySelector("video")
  const mediaSession = getMediaSessionMetadata()
  const domTitle = textFromSelector([
    "ytmusic-player-bar yt-formatted-string.title",
    "ytmusic-player-bar .title",
    "#layout ytmusic-player-bar .title",
    ".ytmusic-player-bar .title"
  ])
  const domArtist = textFromSelector([
    "ytmusic-player-bar yt-formatted-string.byline",
    "ytmusic-player-bar .byline",
    "#layout ytmusic-player-bar .byline",
    ".ytmusic-player-bar .byline",
    "ytmusic-player-bar .subtitle"
  ])

  const title = mediaSession.title || domTitle || document.title.replace(/\s*[-|]\s*YouTube Music\s*$/i, "").trim()
  const artist = normalizeArtist(mediaSession.artist || domArtist)

  if (!title || !video) return null

  return {
    source: "ytmusic-web",
    pageUrl: location.href,
    title,
    artist,
    videoId: getVideoId() || `${title}:${artist}`,
    isPlaying: video.paused === false && video.ended === false,
    positionMs: Math.max(0, Math.round((video.currentTime || 0) * 1000)),
    durationMs: Number.isFinite(video.duration) ? Math.max(0, Math.round(video.duration * 1000)) : 0
  }
}

function executeCommand(command, data) {
  const video = document.querySelector("video")
  if (!video) return

  switch (command) {
    case "play":
      video.play().catch(() => {})
      break
    case "pause":
      video.pause().catch(() => {})
      break
    case "playPause":
      if (video.paused) {
        video.play().catch(() => {})
      } else {
        video.pause().catch(() => {})
      }
      break
    case "next":
      const nextBtn = document.querySelector("ytmusic-player-bar .next-button, button[aria-label*='Next'], button[title*='Next'], #button[title*='Next']")
      if (nextBtn) nextBtn.click()
      break
    case "previous":
      const prevBtn = document.querySelector("ytmusic-player-bar .previous-button, button[aria-label*='Previous'], button[title*='Previous'], #button[title*='Previous']")
      if (prevBtn) prevBtn.click()
      break
    case "seekTo":
      if (data && typeof data.positionMs === "number") {
        video.currentTime = data.positionMs / 1000
      }
      break
    case "toggleShuffle":
      const shuffleBtn = document.querySelector("ytmusic-player-bar .shuffle, ytmusic-player-bar #shuffle, ytmusic-player-bar tp-yt-paper-icon-button[id='shuffle'], button[aria-label*='Shuffle'], button[title*='Shuffle']")
      if (shuffleBtn) shuffleBtn.click()
      break
    case "cycleRepeat":
      const repeatBtn = document.querySelector("ytmusic-player-bar .repeat, ytmusic-player-bar #repeat, ytmusic-player-bar tp-yt-paper-icon-button[id='repeat'], button[aria-label*='Repeat'], button[title*='Repeat']")
      if (repeatBtn) repeatBtn.click()
      break
  }
}

async function postPayload(payload) {
  for (const endpoint of DISCORDLYRICS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        if (response.status === 200) {
          const data = await response.json().catch(() => null)
          if (data && data.command) {
            executeCommand(data.command, data.data)
          }
        }
        return true
      }
    } catch {
      // Try next endpoint.
    }
  }

  return false
}

async function sendPlayback(force = false) {
  const payload = collectPlayback()
  if (!payload) return

  const now = Date.now()
  const payloadKey = JSON.stringify({
    url: payload.pageUrl,
    title: payload.title,
    artist: payload.artist,
    videoId: payload.videoId,
    isPlaying: payload.isPlaying,
    second: Math.floor(payload.positionMs / 1000)
  })

  if (!force && payloadKey === lastPayloadKey && now - lastSentAt < 1200) return

  if (await postPayload(payload)) {
    lastPayloadKey = payloadKey
    lastSentAt = now
  }
}

document.documentElement.dataset.discordlyricsYtmusicBridge = "running"

setInterval(() => sendPlayback(false), 1000)
document.addEventListener("yt-navigate-finish", () => setTimeout(() => sendPlayback(true), 500))
document.addEventListener("play", () => sendPlayback(true), true)
document.addEventListener("pause", () => sendPlayback(true), true)
sendPlayback(true)
