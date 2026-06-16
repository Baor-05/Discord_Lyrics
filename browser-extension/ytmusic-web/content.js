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

      if (response.ok || response.status === 204) return true
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
