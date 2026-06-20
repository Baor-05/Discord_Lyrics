import { execFile } from "node:child_process"

export interface WindowsMediaPlayback {
    hasSession: boolean
    sourceAppUserModelId?: string
    title?: string
    artist?: string
    playbackStatus?: string
    positionMs?: number
    endTimeMs?: number
    isShuffleActive?: boolean | null
    repeatState?: string | null
}

export type WindowsMediaControlAction = "play" | "pause" | "playPause" | "stop" | "next" | "previous" | "seekBy" | "seekTo" | "toggleShuffle" | "cycleRepeat"

export interface WindowsMediaControlOptions {
    deltaMs?: number
    positionMs?: number
}

export interface WindowsMediaControlResult {
    ok: boolean
    message?: string
}

export class WindowsMediaService {
    private static readonly script = `
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding
$targetSource = '%%TARGET_SOURCE%%'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod })[0]
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
$managerType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime]
$propsType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType=WindowsRuntime]
$manager = Await ($managerType::RequestAsync()) $managerType
$session = $null
foreach ($candidate in $manager.GetSessions()) {
    $match = $false
    if ($targetSource -eq 'spotify') {
        if ($candidate.SourceAppUserModelId -match 'Spotify') {
            $match = $true
        }
    } else {
        if ($candidate.SourceAppUserModelId -match 'YouTubeMusic|YTM|youtube-music|youtube') {
            $match = $true
        } else {
            $props = Await ($candidate.TryGetMediaPropertiesAsync()) $propsType
            if ($props.Title -match 'YouTube Music' -or $props.Artist -match 'YouTube Music') {
                $match = $true
            }
        }
    }
    if ($match) {
        $session = $candidate
        break
    }
}
if ($null -eq $session) {
    [pscustomobject]@{ hasSession = $false } | ConvertTo-Json -Compress
    exit
}
$props = Await ($session.TryGetMediaPropertiesAsync()) $propsType
$playback = $session.GetPlaybackInfo()
$timeline = $session.GetTimelineProperties()
$pos = $timeline.Position.TotalMilliseconds
if ($playback.PlaybackStatus.ToString() -eq 'Playing') {
    $lastUpdated = $timeline.LastUpdatedTime.UtcDateTime
    $now = [System.DateTime]::UtcNow
    $diff = ($now - $lastUpdated).TotalMilliseconds
    if ($diff -gt 0) {
        $pos += $diff
    }
}
$endTime = $timeline.EndTime.TotalMilliseconds
if ($pos -gt $endTime -and $endTime -gt 0) {
    $pos = $endTime
}
$shuffle = $null
if ($null -ne $playback.IsShuffleActive) {
    $shuffle = $playback.IsShuffleActive
}
$repeat = $null
if ($null -ne $playback.AutoRepeatMode) {
    $modeStr = $playback.AutoRepeatMode.ToString()
    if ($modeStr -eq 'None') { $repeat = 'off' }
    elseif ($modeStr -eq 'Track') { $repeat = 'track' }
    elseif ($modeStr -eq 'List') { $repeat = 'context' }
}
[pscustomobject]@{
    hasSession = $true
    sourceAppUserModelId = $session.SourceAppUserModelId
    title = $props.Title
    artist = $props.Artist
    playbackStatus = $playback.PlaybackStatus.ToString()
    positionMs = [math]::Round($pos)
    endTimeMs = [math]::Round($endTime)
    isShuffleActive = $shuffle
    repeatState = $repeat
} | ConvertTo-Json -Compress
`

    public static readPlayback(targetSource: string = "spotify"): Promise<WindowsMediaPlayback> {
        const scriptContent = this.script.replace("%%TARGET_SOURCE%%", targetSource)
        return new Promise((resolve, reject) => {
            execFile(
                "powershell.exe",
                ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", scriptContent],
                { windowsHide: true, timeout: 5000 },
                (error, stdout, stderr) => {
                    if (error) return reject(error)

                    try {
                        resolve(JSON.parse(stdout.trim()) as WindowsMediaPlayback)
                    } catch(e) {
                        if (stderr.trim()) {
                            reject(new Error(stderr.trim()))
                        } else {
                            reject(e)
                        }
                    }
                }
            )
        })
    }

    public static controlSession(source: string, action: WindowsMediaControlAction, options: WindowsMediaControlOptions = {}): Promise<WindowsMediaControlResult> {
        const safeSource = source === "ytmusic" ? "ytmusic" : "spotify"
        const safeDeltaMs = Number.isFinite(options.deltaMs) ? Math.round(options.deltaMs!) : 0
        const safePositionMs = Number.isFinite(options.positionMs) ? Math.round(options.positionMs!) : 0
        const script = `
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding
$targetSource = '${safeSource}'
$action = '${action}'
$deltaMs = ${safeDeltaMs}
$positionMs = ${safePositionMs}
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod })[0]
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
$managerType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime]
$propsType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType=WindowsRuntime]
$manager = Await ($managerType::RequestAsync()) $managerType
$session = $null
foreach ($candidate in $manager.GetSessions()) {
    $match = $false
    if ($targetSource -eq 'spotify') {
        if ($candidate.SourceAppUserModelId -match 'Spotify') { $match = $true }
    } elseif ($targetSource -eq 'ytmusic') {
        if ($candidate.SourceAppUserModelId -match 'YouTubeMusic|YTM|youtube-music|youtube') {
            $match = $true
        } else {
            $props = Await ($candidate.TryGetMediaPropertiesAsync()) $propsType
            if ($props.Title -match 'YouTube Music' -or $props.Artist -match 'YouTube Music') {
                $match = $true
            }
        }
    }
    if ($match) {
        $session = $candidate
        break
    }
}
if ($null -eq $session) {
    [pscustomobject]@{ ok = $false; message = "No media session" } | ConvertTo-Json -Compress
    exit
}
$playback = $session.GetPlaybackInfo()
$timeline = $session.GetTimelineProperties()
if ($action -eq 'play') {
    Await ($session.TryPlayAsync()) ([bool]) | Out-Null
} elseif ($action -eq 'pause') {
    Await ($session.TryPauseAsync()) ([bool]) | Out-Null
} elseif ($action -eq 'playPause') {
    if ($playback.PlaybackStatus.ToString() -eq 'Playing') {
        Await ($session.TryPauseAsync()) ([bool]) | Out-Null
    } else {
        Await ($session.TryPlayAsync()) ([bool]) | Out-Null
    }
} elseif ($action -eq 'stop') {
    Await ($session.TryStopAsync()) ([bool]) | Out-Null
} elseif ($action -eq 'next') {
    Await ($session.TrySkipNextAsync()) ([bool]) | Out-Null
} elseif ($action -eq 'previous') {
    Await ($session.TrySkipPreviousAsync()) ([bool]) | Out-Null
} elseif ($action -eq 'toggleShuffle') {
    $currentShuffle = $playback.IsShuffleActive
    $newShuffle = -not $currentShuffle
    Await ($session.TryChangeShuffleActiveAsync($newShuffle)) ([bool]) | Out-Null
} elseif ($action -eq 'cycleRepeat') {
    $currentRepeat = 'None'
    if ($null -ne $playback.AutoRepeatMode) {
        $currentRepeat = $playback.AutoRepeatMode.ToString()
    }
    $newRepeat = [Windows.Media.MediaPlaybackAutoRepeatMode]::None
    if ($currentRepeat -eq 'None') {
        $newRepeat = [Windows.Media.MediaPlaybackAutoRepeatMode]::List
    } elseif ($currentRepeat -eq 'List') {
        $newRepeat = [Windows.Media.MediaPlaybackAutoRepeatMode]::Track
    }
    Await ($session.TryChangeAutoRepeatModeAsync($newRepeat)) ([bool]) | Out-Null
} elseif ($action -eq 'seekBy' -or $action -eq 'seekTo') {
    $newPositionMs = $positionMs
    if ($action -eq 'seekBy') {
        $pos = $timeline.Position.TotalMilliseconds
        if ($playback.PlaybackStatus.ToString() -eq 'Playing') {
            $lastUpdated = $timeline.LastUpdatedTime.UtcDateTime
            $now = [System.DateTime]::UtcNow
            $diff = ($now - $lastUpdated).TotalMilliseconds
            if ($diff -gt 0) {
                $pos += $diff
            }
        }
        $newPositionMs = [math]::Round($pos) + $deltaMs
    }
    $endMs = [math]::Round($timeline.EndTime.TotalMilliseconds)
    if ($newPositionMs -lt 0) { $newPositionMs = 0 }
    if ($endMs -gt 0 -and $newPositionMs -gt $endMs) { $newPositionMs = $endMs }
    Await ($session.TryChangePlaybackPositionAsync([int64]($newPositionMs * 10000))) ([bool]) | Out-Null
}
[pscustomobject]@{ ok = $true } | ConvertTo-Json -Compress
`
        return new Promise((resolve) => {
            execFile(
                "powershell.exe",
                ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
                { windowsHide: true, timeout: 5000 },
                (error, stdout) => {
                    if (error) return resolve({ ok: false, message: error.message })

                    try {
                        resolve(JSON.parse(stdout.trim()) as WindowsMediaControlResult)
                    } catch {
                        resolve({ ok: true })
                    }
                }
            )
        })
    }
}
