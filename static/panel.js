$(
`
<header id="app-titlebar" aria-label="Thanh tiêu đề">
    <div class="titlebar-left">
        <img src="logo_discordlyric.png" alt="">
        <span>DiscordLyrics Panel</span>
    </div>
    <div class="titlebar-surface"></div>
    <div class="titlebar-actions">
        <button id="window-minimize" class="titlebar-button" title="Thu nhỏ" type="button" aria-label="Thu nhỏ">
            <svg viewBox="0 0 16 16"><path d="M3 8h10v1H3z"/></svg>
        </button>
        <button id="window-maximize" class="titlebar-button" title="Phóng to / khôi phục" type="button" aria-label="Phóng to hoặc khôi phục">
            <svg viewBox="0 0 16 16"><path d="M4 4h8v8H4V4zm1 1v6h6V5H5z"/></svg>
        </button>
        <button id="window-close" class="titlebar-button close" title="Đóng xuống tray" type="button" aria-label="Đóng xuống tray">
            <svg viewBox="0 0 16 16"><path d="m4.28 3.57 3.71 3.72 3.72-3.72.72.72L8.7 8l3.72 3.72-.72.72L8 8.72l-3.72 3.72-.72-.72L7.28 8 3.56 4.29z"/></svg>
        </button>
    </div>
</header>
<main id="app-shell" aria-label="DiscordLyrics">
    <aside id="discord-panel">
        <nav class="server-rail" aria-label="Điều hướng nhanh">
            <div class="rail-logo"><img src="logo_discordlyric.png" alt="DiscordLyric"></div>
            <div class="rail-divider"></div>
            <div class="rail-dot active"><img src="logo_spotify.svg" alt="Spotify"></div>
            <div class="rail-dot"><img src="logo_ytmusic.svg" alt="YouTube Music"></div>
        </nav>

        <section class="discord-home">
            <header class="top-card">
                <div>
                    <p class="kicker">DiscordLyrics</p>
                    <h1>Discord status cho nhạc</h1>
                </div>
                <span id="token-state" class="status-pill muted">Chưa kiểm tra</span>
            </header>

            <section class="settings-block token-block">
                <div class="block-title">
                    <span class="channel-mark"></span>
                    <div>
                        <h2>Kết nối Discord</h2>
                        <p>Chỉ cần token Discord. Nhạc được đọc từ Spotify, SpotX hoặc Windows Media.</p>
                    </div>
                </div>
                <label class="field-stack" for="user-token">
                    <span>Token Discord</span>
                    <div class="token-row">
                        <input type="password" id="user-token" class="text-input" autocomplete="off" spellcheck="false">
                        <button id="check-token" class="button primary" type="button">Kiểm tra</button>
                    </div>
                </label>
            </section>

            <section class="settings-block">
                <div class="block-title">
                    <span class="channel-mark"></span>
                    <div>
                        <h2>YouTube Music API</h2>
                        <p>Ưu tiên đọc từ máy chủ API local của YouTube Music desktop, sau đó mới dùng Windows Media.</p>
                    </div>
                </div>
                <label class="switch-row" for="enable-ytmusic-api">
                    <span>
                        <strong>Dùng API YouTube Music</strong>
                        <small>Mặc định: http://127.0.0.1:26538</small>
                    </span>
                    <input type="checkbox" id="enable-ytmusic-api" checked>
                    <i></i>
                </label>
                <div class="field-grid api-grid">
                    <label class="field-stack" for="ytmusic-api-host">
                        <span>Host</span>
                        <input type="text" id="ytmusic-api-host" class="text-input" value="127.0.0.1" spellcheck="false">
                    </label>
                    <label class="field-stack" for="ytmusic-api-port">
                        <span>Cổng</span>
                        <input type="text" id="ytmusic-api-port" class="text-input number-input" maxlength="5" value="26538" inputmode="numeric">
                    </label>
                </div>
                <label class="switch-row" for="enable-ytmusic-web">
                    <span>
                        <strong>Nhận YouTube Music từ trình duyệt</strong>
                        <small>Cần cài extension DiscordLyrics YouTube Music Web Bridge</small>
                    </span>
                    <input type="checkbox" id="enable-ytmusic-web" checked>
                    <i></i>
                </label>
            </section>

            <section class="settings-block">
                <div class="block-title compact">
                    <span class="channel-mark"></span>
                    <h2>Hiển thị status</h2>
                </div>
                <label class="switch-row" for="enable-timestamp">
                    <span>
                        <strong>Hiện thời gian lyric</strong>
                        <small>Ví dụ: [2:17]</small>
                    </span>
                    <input type="checkbox" id="enable-timestamp" checked>
                    <i></i>
                </label>
                <label class="switch-row" for="enable-label">
                    <span>
                        <strong>Hiện nhãn lời bài hát</strong>
                        <small>Thêm chữ "Lời bài hát" trước lyric</small>
                    </span>
                    <input type="checkbox" id="enable-label" checked>
                    <i></i>
                </label>
                <div class="preview-panel">
                    <span>Xem trước</span>
                    <b id="status-preview">[2:17] Lời bài hát - La-la-la</b>
                </div>
                <label class="switch-row" for="enable-advanced-swt">
                    <span>
                        <strong>Mẫu status riêng</strong>
                        <small>Dùng khi muốn tự viết format</small>
                    </span>
                    <input type="checkbox" id="enable-advanced-swt">
                    <i></i>
                </label>
                <div id="advanced-swt" class="advanced-card hidden">
                    <label class="field-stack compact-field" for="custom-emoji">
                        <span>Emoji</span>
                        <input maxlength="4" id="custom-emoji" class="text-input emoji-input">
                    </label>
                    <label class="field-stack" for="custom-status">
                        <span>Mẫu status</span>
                        <textarea rows="3" id="custom-status" class="text-area" spellcheck="false"></textarea>
                    </label>
                    <p class="hint">Có thể dùng: {lyrics}, {timestamp}, {song_name}, {song_author}</p>
                </div>
            </section>

            <section class="settings-block timing-block">
                <div class="block-title compact">
                    <span class="channel-mark"></span>
                    <h2>Đồng bộ thời gian</h2>
                </div>
                <div class="field-grid">
                    <label class="field-stack" for="send-time-offset">
                        <span>Độ trễ gửi (mili giây)</span>
                        <div class="unit-input">
                            <input type="text" id="send-time-offset" class="text-input number-input" maxlength="6" value="200" inputmode="numeric">
                            <em>ms</em>
                        </div>
                        <small>200ms = 0.2 giây</small>
                    </label>
                    <label class="field-stack" for="min-send-interval">
                        <span>Giới hạn gửi Discord</span>
                        <div class="unit-input">
                            <input id="min-send-interval" class="text-input number-input" type="text" maxlength="6" value="700" inputmode="numeric">
                            <em>ms</em>
                        </div>
                        <small>Gửi giãn cách tối thiểu</small>
                    </label>
                    <label class="field-stack" for="autooffset">
                        <span>Tính trung bình</span>
                        <div class="unit-input">
                            <input id="autooffset" class="text-input number-input" type="text" maxlength="2">
                            <em>lần gửi</em>
                        </div>
                        <small>Số mẫu đo trễ</small>
                    </label>
                </div>
                <label class="switch-row" for="enable-autooffset">
                    <span>
                        <strong>Tự chỉnh độ trễ gửi</strong>
                        <small>App tự đo Discord và cập nhật ô ms phía trên</small>
                    </span>
                    <input type="checkbox" id="enable-autooffset">
                    <i></i>
                </label>
            </section>

            <section class="settings-block update-block">
                <div class="block-title compact">
                    <span class="channel-mark"></span>
                    <h2>Cập nhật app</h2>
                </div>
                <label class="switch-row" for="enable-autoupdate">
                    <span>
                        <strong>Tự kiểm tra cập nhật</strong>
                        <small>Khi có bản mới trên GitHub Releases, app sẽ mở DiscordLyricsSetup.exe.</small>
                    </span>
                    <input type="checkbox" id="enable-autoupdate">
                    <i></i>
                </label>
                <div class="update-actions">
                    <button id="check-update" class="button primary" type="button">Kiểm tra cập nhật</button>
                    <button id="install-update" class="button ghost hidden" type="button">Cài bản mới</button>
                </div>
                <p id="update-status" class="update-status">Chưa kiểm tra cập nhật.</p>
            </section>
        </section>
    </aside>

    <section id="spotify-panel">
        <div class="spotify-topbar">
            <div class="popup-artwork" aria-hidden="true">
                <img src="logo_spotify.svg" alt="">
            </div>
            <div class="track-heading">
                <p class="kicker">Đang phát</p>
                <h2 id="song-title">Chưa phát nhạc</h2>
                <p id="song-artist">Mở Spotify hoặc SpotX để bắt đầu</p>
            </div>
            <div class="topbar-actions">
                <span id="play-state" class="spotify-state idle">Đang chờ</span>
                <div class="media-controls-mini" aria-label="Điều khiển nhạc thu nhỏ">
                    <button class="mini-media-button mini-media-play" data-media-action="playPause" title="Phát / tạm dừng" type="button"><svg class="play-symbol" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="pause-symbol" viewBox="0 0 24 24"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg></button>
                    <button class="mini-media-button" data-media-action="next" title="Qua bài" type="button"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm10-12h2v12h-2z"/></svg></button>
                </div>
                <button id="toggle-mini-player" class="icon-button" title="Thu nhỏ thành pop-up" type="button">
                    <svg class="shrink-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <rect x="13" y="13" width="8" height="8" rx="1" ry="1"></rect>
                    </svg>
                    <svg class="expand-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                    </svg>
                </button>
            </div>
        </div>

        <section class="lyrics-stage">
            <div class="lyric-orb"></div>
            <div class="lyrics-content">
                <p class="lyric-label">Lời bài hát</p>
                <div id="lyrics-scroller" class="lyrics-scroller">
                    <div class="lyric-line-item empty empty-idle">
                        <span class="empty-title">Spotify</span>
                        <span class="empty-hint">Mở app nhạc và phát bài để bắt đầu</span>
                    </div>
                </div>
                <div class="track-meta">
                    <span id="progress-time">0:00</span>
                    <span id="lyric-source">Nguồn lyric: Chưa lấy</span>
                </div>
                <div class="progress-shell" role="slider" aria-label="Tua bài hát">
                    <span id="progress-fill"></span>
                </div>
                <div class="media-controls media-controls-main" aria-label="Điều khiển nhạc">
                    <button class="media-button" data-media-action="toggleShuffle" title="Trộn bài" type="button"><svg viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.38 10.17l-1.42 1.41 3.17 3.17L14.5 20H20v-5.5l-2.04 2.04-3.08-3.17z"/></svg></button>
                    <button class="media-button" data-media-action="previous" title="Lùi bài" type="button"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg></button>
                    <button class="media-button media-button-play" data-media-action="playPause" title="Phát / tạm dừng" type="button"><svg class="play-symbol" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="pause-symbol" viewBox="0 0 24 24"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg></button>
                    <button class="media-button" data-media-action="next" title="Qua bài" type="button"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm10-12h2v12h-2z"/></svg></button>
                    <button class="media-button" data-media-action="cycleRepeat" title="Lặp lại" type="button"><svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg></button>
                </div>
            </div>
        </section>

        <div class="mini-player-bar">
            <div class="media-controls media-controls-popup" aria-label="Điều khiển nhạc pop-up">
                <button class="media-button" data-media-action="toggleShuffle" title="Trộn bài" type="button"><svg viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.38 10.17l-1.42 1.41 3.17 3.17L14.5 20H20v-5.5l-2.04 2.04-3.08-3.17z"/></svg></button>
                <button class="media-button" data-media-action="previous" title="Lùi bài" type="button"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg></button>
                <button class="media-button media-button-play" data-media-action="playPause" title="Phát / tạm dừng" type="button"><svg class="play-symbol" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="pause-symbol" viewBox="0 0 24 24"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg></button>
                <button class="media-button" data-media-action="next" title="Qua bài" type="button"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm10-12h2v12h-2z"/></svg></button>
                <button class="media-button" data-media-action="cycleRepeat" title="Lặp lại" type="button"><svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg></button>
            </div>
        </div>

        <div class="pill-progress-shell" aria-hidden="true">
            <span id="pill-progress-fill"></span>
        </div>

        <section class="spotify-footer">
            <article class="mini-card">
                <span class="mini-label">Discord status</span>
                <strong id="status-mini">Sẵn sàng gửi lyric lên trạng thái</strong>
            </article>
            <article class="mini-card log-card">
                <span class="mini-label">Nhật ký chạy</span>
                <pre id="terminal-output">Đang chờ Spotify hoặc SpotX phát nhạc...</pre>
            </article>
        </section>
    </section>
</main>

<style>
    :root {
        --bg: #08090d;
        --discord-rail: #2c2d32;
        --discord-panel: #2c2d32;
        --discord-card: #1e1f22;
        --discord-card-2: #2b2d31;
        --discord-border: rgba(255, 255, 255, .08);
        --discord-text: #f4f6fb;
        --discord-muted: #b4b9c6;
        --accent: #5865f2;
        --accent-2: #1db954;
        --source-accent: #1db954;
        --source-accent-soft: rgba(29, 185, 84, .14);
        --source-accent-border: rgba(29, 185, 84, .32);
        --spotify-bg: #0a0c0b;
        --spotify-card: #111513;
        --spotify-soft: #1b211e;
        --spotify-text: #f7fff9;
        --spotify-muted: #a8b5ae;
        --danger: #ff677d;
        --radius: 18px;
    }

    body.ytmusic-source {
        --source-accent: #ff0033;
        --source-accent-soft: rgba(255, 0, 51, .14);
        --source-accent-border: rgba(255, 0, 51, .32);
        --accent-2: #ff0033;
    }

    * {
        box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: #1a1b20 transparent;
    }

    *::-webkit-scrollbar {
        width: 14px;
        height: 14px;
    }

    *::-webkit-scrollbar-track {
        background: transparent;
    }

    *::-webkit-scrollbar-thumb {
        min-height: 44px;
        border: 4px solid transparent;
        border-radius: 999px;
        background-color: rgba(26, 27, 32, .92);
        background-clip: padding-box;
    }

    *::-webkit-scrollbar-thumb:hover {
        background-color: rgba(10, 11, 15, .98);
    }

    *::-webkit-scrollbar-corner {
        background: transparent;
    }

    html,
    body {
        margin: 0;
        height: 100dvh;
        overflow: hidden;
        background: var(--bg);
        color: var(--discord-text);
        font-family: "Segoe UI Variable", "Segoe UI", Arial, sans-serif;
        letter-spacing: 0;
        user-select: none;
    }

    #app-titlebar {
        position: relative;
        z-index: 20;
        display: grid;
        grid-template-columns: minmax(340px, 37vw) minmax(0, 1fr) auto;
        height: 38px;
        color: #e8ecf6;
        background: transparent;
        -webkit-app-region: drag;
    }

    .titlebar-left,
    .titlebar-surface,
    .titlebar-actions {
        min-width: 0;
        height: 38px;
        background: var(--discord-panel);
        border-bottom: 1px solid rgba(255, 255, 255, .075);
    }

    .titlebar-left {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 0 12px;
        border-right: 1px solid rgba(255, 255, 255, .06);
    }

    .titlebar-left img {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, .12);
    }

    .titlebar-left span {
        overflow: hidden;
        color: #eef2fb;
        font-size: 12px;
        font-weight: 650;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .titlebar-surface {
        box-shadow: 0 14px 34px rgba(0, 0, 0, .16);
    }

    .titlebar-actions {
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        overflow: hidden;
        box-shadow: 12px 14px 34px rgba(0, 0, 0, .18);
        -webkit-app-region: no-drag;
    }

    .titlebar-button {
        display: grid;
        width: 48px;
        height: 38px;
        place-items: center;
        border: 0;
        color: rgba(238, 242, 251, .72);
        background: transparent;
        cursor: pointer;
        outline: none;
        transition: background .14s ease, color .14s ease;
    }

    .titlebar-button svg {
        width: 15px;
        height: 15px;
        fill: currentColor;
    }

    .titlebar-button:hover {
        color: #fff;
        background: rgba(255, 255, 255, .08);
    }

    .titlebar-button.close:hover {
        color: #fff;
        background: #e84d5b;
    }

    button,
    input,
    textarea {
        font: inherit;
    }

    #app-shell {
        display: grid;
        grid-template-columns: minmax(340px, 37vw) minmax(0, 1fr);
        height: calc(100dvh - 38px);
        overflow: hidden;
        background:
            radial-gradient(circle at 12% 8%, rgba(88, 101, 242, .2), transparent 28%),
            linear-gradient(135deg, #090a0f 0%, #111315 48%, #050605 100%);
    }

    #discord-panel {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr);
        min-width: 0;
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        border-right: 1px solid rgba(255, 255, 255, .1);
        background: var(--discord-panel);
    }

    .server-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 16px 12px;
        background: var(--discord-rail);
        border-right: 1px solid rgba(255, 255, 255, .06);
    }

    .rail-logo,
    .rail-dot {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #fff;
        background: #252833;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08);
        position: relative;
        transition: border-radius 0.2s ease, background-color 0.2s ease;
    }

    .rail-logo {
        background: linear-gradient(145deg, #5865f2, #3d46bd);
        font-weight: 900;
        letter-spacing: .5px;
        cursor: pointer;
    }

    .rail-logo:has(img),
    .rail-dot:has(img) {
        background: none;
        box-shadow: none;
    }

    .rail-logo img,
    .rail-dot img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }

    /* Left indicator bar matching Discord's */
    .rail-logo::before,
    .rail-dot::before {
        content: "";
        position: absolute;
        left: -10px;
        width: 4px;
        height: 0px;
        border-radius: 0 4px 4px 0;
        background: #fff;
        transition: height 0.2s ease, transform 0.2s ease;
        transform: scaleY(0);
        transform-origin: center;
    }

    /* Hover effects */
    .rail-logo:hover,
    .rail-dot:hover {
        border-radius: 16px;
    }

    .rail-logo:hover::before,
    .rail-dot:hover::before {
        height: 20px;
        transform: scaleY(1);
    }

    /* Active states */
    .rail-logo.active,
    .rail-dot.active {
        border-radius: 16px;
    }

    .rail-logo.active::before,
    .rail-dot.active::before {
        height: 40px;
        transform: scaleY(1);
    }

    .rail-dot {
        position: relative;
    }

    .rail-dot::after {
        content: "";
        width: 18px;
        height: 18px;
        border-radius: 6px;
        background: rgba(255, 255, 255, .24);
    }

    .rail-dot:has(img)::after {
        display: none;
    }

    .rail-dot.soft::after {
        background: var(--accent-2);
    }

    .rail-divider {
        width: 32px;
        height: 1px;
        background: rgba(255, 255, 255, .14);
    }

    .discord-home {
        min-width: 0;
        height: 100%;
        overflow-y: auto;
        padding: 24px 24px 36px;
        scrollbar-color: #18191f transparent;
    }

    .top-card,
    .settings-block {
        border: 1px solid var(--discord-border);
        border-radius: var(--radius);
        background: var(--discord-card);
        box-shadow: 0 18px 50px rgba(0, 0, 0, .22);
    }

    .top-card {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        padding: 22px;
        margin-bottom: 16px;
    }

    .kicker {
        margin: 0 0 8px;
        color: var(--discord-muted);
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
    }

    .top-card h1,
    .spotify-topbar h2,
    .lyrics-content h1,
    .block-title h2 {
        margin: 0;
    }

    .top-card h1 {
        max-width: 520px;
        color: #fff;
        font-size: clamp(24px, 2.6vw, 34px);
        line-height: 1.08;
        font-weight: 900;
    }

    .status-pill,
    .spotify-state {
        flex: 0 0 auto;
        padding: 8px 12px;
        border-radius: 999px;
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        background: rgba(88, 101, 242, .2);
        border: 1px solid rgba(88, 101, 242, .35);
        white-space: nowrap;
    }

    .status-pill.ok,
    .spotify-state.playing {
        color: #06110a;
        background: var(--accent-2);
        border-color: rgba(255, 255, 255, .2);
    }

    .status-pill.bad {
        background: rgba(255, 103, 125, .18);
        border-color: rgba(255, 103, 125, .45);
        color: #ffd5dc;
    }

    .settings-block {
        margin-top: 14px;
        padding: 18px;
    }

    .block-title {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
    }

    .block-title.compact {
        align-items: center;
        margin-bottom: 12px;
    }

    .channel-mark {
        width: 10px;
        height: 28px;
        margin-top: 2px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 20px rgba(88, 101, 242, .35);
    }

    .block-title h2 {
        color: #fff;
        font-size: 18px;
        line-height: 1.2;
        font-weight: 850;
    }

    .block-title p,
    .hint {
        margin: 5px 0 0;
        color: var(--discord-muted);
        font-size: 13px;
        line-height: 1.5;
        user-select: text;
    }

    .field-stack {
        display: grid;
        gap: 8px;
        color: #dfe4ee;
        font-size: 13px;
        font-weight: 750;
    }

    .token-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 112px;
        gap: 10px;
        align-items: stretch;
    }

    .text-input,
    .text-area {
        width: 100%;
        min-height: 42px;
        border: 1px solid rgba(255, 255, 255, .11);
        border-radius: 12px;
        outline: none;
        background: rgba(10, 11, 16, .72);
        color: #fff;
        padding: 10px 12px;
        user-select: text;
        transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
    }

    .text-area {
        min-height: 88px;
        resize: vertical;
    }

    .text-input:focus,
    .text-area:focus {
        border-color: rgba(88, 101, 242, .82);
        box-shadow: 0 0 0 4px rgba(88, 101, 242, .18);
        background: rgba(10, 11, 16, .9);
    }

    .button {
        min-height: 42px;
        border: 0;
        border-radius: 12px;
        color: #fff;
        font-weight: 850;
        cursor: pointer;
        transition: transform .16s ease, filter .16s ease;
    }

    .button.primary {
        background: linear-gradient(180deg, #6772ff, #4f5be8);
    }

    .button.ghost {
        color: #dfe4ee;
        background: rgba(255, 255, 255, .1);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12);
    }

    .button:hover {
        filter: brightness(1.08);
    }

    .button:active {
        transform: translateY(1px) scale(.99);
    }

    .switch-row {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 54px;
        gap: 14px;
        align-items: center;
        min-height: 56px;
        padding: 12px 0;
        border-top: 1px solid rgba(255, 255, 255, .07);
        cursor: pointer;
    }

    .switch-row:first-of-type {
        border-top: 0;
    }

    .switch-row strong,
    .switch-row small {
        display: block;
    }

    .switch-row strong {
        color: #f3f5fb;
        font-size: 14px;
    }

    .switch-row small {
        margin-top: 3px;
        color: var(--discord-muted);
        font-size: 12px;
    }

    .switch-row input {
        position: absolute;
        right: 0;
        width: 54px;
        height: 30px;
        margin: 0;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
    }

    .switch-row i {
        position: relative;
        width: 54px;
        height: 30px;
        border-radius: 999px;
        background: rgba(255, 255, 255, .14);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08);
        transition: background .16s ease;
    }

    .switch-row i::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 4px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #fff;
        transition: transform .16s ease;
    }

    .switch-row input:checked + i {
        background: var(--source-accent);
    }

    .switch-row input:checked + i::after {
        transform: translateX(24px);
    }

    .switch-row input:disabled + i {
        opacity: .45;
    }

    .preview-panel {
        display: grid;
        gap: 8px;
        margin: 10px 0;
        padding: 13px;
        border-radius: 14px;
        border: 1px solid var(--source-accent-border);
        background: var(--source-accent-soft);
    }

    .preview-panel span {
        color: var(--discord-muted);
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
    }

    .preview-panel b {
        color: #fff;
        font-size: 14px;
        line-height: 1.35;
        user-select: text;
    }

    .advanced-card {
        margin-top: 10px;
        display: grid;
        gap: 12px;
        padding: 14px;
        border-radius: 14px;
        background: rgba(11, 12, 18, .45);
        border: 1px solid rgba(255, 255, 255, .08);
    }

    .compact-field {
        max-width: 130px;
    }

    .emoji-input,
    .number-input {
        text-align: center;
    }

    .field-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 8px;
    }

    .api-grid {
        grid-template-columns: minmax(0, 1fr) 120px;
    }

    .field-grid .field-stack > span {
        min-height: 36px;
        display: flex;
        align-items: flex-end;
    }

    .field-grid .field-stack > small {
        min-height: 32px;
        display: block;
    }

    .unit-input {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
    }

    .unit-input em {
        color: var(--discord-muted);
        font-style: normal;
        font-size: 12px;
        white-space: nowrap;
    }

    .hidden {
        display: none;
    }

    .update-actions {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 10px;
        margin-top: 8px;
    }

    .update-status {
        margin: 10px 0 0;
        color: var(--discord-muted);
        font-size: 13px;
        line-height: 1.45;
        user-select: text;
    }

    #spotify-panel {
        display: grid;
        grid-template-rows: auto minmax(260px, 1fr) auto;
        min-width: 0;
        height: 100%;
        overflow: hidden;
        padding: 24px;
        background:
            linear-gradient(180deg, hsla(var(--dynamic-hue, 145), 25%, 10%, 0.72), hsla(var(--dynamic-hue, 145), 15%, 5%, 0.98)),
            var(--spotify-bg);
    }

    .spotify-topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 16px;
    }

    .topbar-actions {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .spotify-topbar .kicker {
        color: var(--spotify-muted);
    }

    .popup-artwork {
        display: none;
    }

    .spotify-topbar h2 {
        color: var(--spotify-text);
        font-size: clamp(22px, 2.6vw, 34px);
        line-height: 1.06;
        font-weight: 900;
    }

    .spotify-topbar p:last-child {
        margin: 8px 0 0;
        color: var(--spotify-muted);
        font-size: 15px;
        font-weight: 700;
    }

    .spotify-state {
        background: var(--source-accent-soft);
        border-color: var(--source-accent-border);
        color: #c6f7d7;
    }

    .spotify-state.idle {
        background: rgba(255, 255, 255, .08);
        border-color: rgba(255, 255, 255, .12);
        color: var(--spotify-muted);
    }

    .lyrics-stage {
        position: relative;
        min-height: 0;
        overflow: hidden;
        border-radius: 28px;
        border: 1px solid rgba(255, 255, 255, .09);
        background:
            linear-gradient(135deg, hsla(var(--dynamic-hue, 145), 30%, 15%, 0.88), hsla(var(--dynamic-hue, 145), 20%, 10%, 0.92) 48%, hsla(var(--dynamic-hue, 145), 15%, 6%, 0.94)),
            #152019;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, .08), 0 28px 80px rgba(0, 0, 0, .35);
    }

    .lyric-orb {
        position: absolute;
        right: -12%;
        top: -20%;
        width: 46vw;
        height: 46vw;
        min-width: 420px;
        min-height: 420px;
        border-radius: 50%;
        background:
            radial-gradient(circle at 35% 35%, hsla(var(--dynamic-hue, 145), 60%, 45%, 0.45), hsla(var(--dynamic-hue, 145), 50%, 25%, 0.08) 38%, transparent 66%),
            radial-gradient(circle at 60% 70%, hsla(var(--dynamic-hue, 145), 65%, 40%, 0.3), transparent 54%);
        filter: blur(20px);
        opacity: .62;
        pointer-events: none;
    }

    .lyrics-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 100%;
        padding: 24px clamp(24px, 4vw, 48px);
        overflow: hidden;
    }

    .lyrics-scroller {
        position: relative;
        flex: 1;
        overflow-y: auto;
        padding: 40px 0;
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        scroll-behavior: smooth;
        mask-image: linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%);
    }

    .lyrics-scroller::-webkit-scrollbar {
        display: none;
    }

    .lyrics-scroller {
        scrollbar-width: none;
    }

    .lyric-line-item {
        width: 100%;
        max-width: 42ch;
        color: rgba(247, 255, 249, 0.58);
        font-size: clamp(20px, 2.8vw, 34px);
        line-height: 1.28;
        font-weight: 800;
        text-align: center;
        text-wrap: balance;
        transition: color 0.3s ease, transform 0.3s ease;
        transform-origin: center center;
        user-select: text;
        cursor: default;
    }

    .lyric-line-item.active {
        color: #fff;
        transform: scale(1.02);
        text-shadow: 0 4px 16px rgba(255, 255, 255, 0.18);
    }

    .lyric-line-item.empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        max-width: 28ch;
        color: rgba(247, 255, 249, 0.72);
        font-size: clamp(20px, 2.8vw, 30px);
        font-weight: 800;
        text-align: center;
        margin-top: auto;
        margin-bottom: auto;
    }

    .lyric-line-item.empty-idle .empty-title {
        font-size: clamp(24px, 3.2vw, 36px);
        font-weight: 900;
        color: rgba(247, 255, 249, 0.42);
        letter-spacing: -0.02em;
    }

    .lyric-line-item.empty-idle .empty-hint {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.45;
        color: rgba(247, 255, 249, 0.52);
    }

    .lyrics-stage.idle .lyric-orb {
        opacity: 0.28;
    }

    .lyric-label {
        margin: 0 0 16px;
        color: rgba(247, 255, 249, .68);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    .lyrics-content h1 {
        max-width: 980px;
        color: var(--spotify-text);
        font-size: clamp(34px, 5.2vw, 78px);
        line-height: 1.02;
        font-weight: 950;
        text-wrap: balance;
        text-shadow: 0 14px 46px rgba(0, 0, 0, .3);
        user-select: text;
    }

    .track-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-top: 26px;
        color: rgba(247, 255, 249, .72);
        font-weight: 800;
    }

    .track-meta span {
        padding: 9px 12px;
        border-radius: 999px;
        background: rgba(0, 0, 0, .22);
        border: 1px solid rgba(255, 255, 255, .09);
    }

    .progress-shell {
        position: relative;
        height: 8px;
        margin-top: 20px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255, 255, 255, .16);
    }

    #progress-fill {
        display: block;
        width: 4%;
        height: 100%;
        border-radius: inherit;
        background: var(--source-accent);
        transition: width .32s ease;
    }

    .media-controls,
    .media-controls-mini {
        -webkit-app-region: no-drag;
    }

    .media-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .media-controls-main {
        height: 56px;
        margin-top: 16px;
    }

    .media-controls-popup,
    .media-controls-mini {
        display: none;
    }

    .media-button,
    .mini-media-button {
        display: grid;
        place-items: center;
        border: 0;
        color: rgba(255, 255, 255, .72);
        background: transparent;
        cursor: pointer;
        transition: color .16s ease, transform .16s ease, opacity .16s ease, background .16s ease;
        -webkit-app-region: no-drag;
    }

    .media-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        position: relative;
    }

    .media-button[data-media-action="toggleShuffle"].active,
    .media-button[data-media-action="cycleRepeat"].active {
        color: var(--source-accent) !important;
    }

    .media-button[data-media-action="toggleShuffle"].active::after,
    .media-button[data-media-action="cycleRepeat"].active::after {
        content: "";
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--source-accent);
    }

    .media-button[data-media-action="cycleRepeat"].repeat-track::before {
        content: "1";
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 8px;
        font-weight: bold;
        background: var(--source-accent);
        color: #000;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: grid;
        place-items: center;
    }

    .media-button:hover,
    .mini-media-button:hover {
        color: #fff;
        transform: scale(1.08);
    }

    .media-button:active,
    .mini-media-button:active {
        transform: scale(.96);
    }

    .media-button svg {
        width: 22px;
        height: 22px;
        fill: currentColor;
    }

    .mini-media-button svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }

    .media-button-play,
    .mini-media-play {
        color: #050505;
        background: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, .26);
    }

    .media-button-play {
        width: 56px;
        height: 56px;
    }

    .media-button-play svg {
        width: 28px;
        height: 28px;
    }

    .pause-symbol {
        display: none;
    }

    body.playback-playing .play-symbol {
        display: none;
    }

    body.playback-playing .pause-symbol {
        display: block;
    }

    .spotify-footer {
        display: grid;
        grid-template-columns: minmax(240px, .72fr) minmax(300px, 1fr);
        gap: 14px;
        margin-top: 14px;
        align-items: stretch;
    }

    .mini-card {
        min-width: 0;
        min-height: 96px;
        display: flex;
        flex-direction: column;
        border-radius: var(--radius);
        border: 1px solid rgba(255, 255, 255, .08);
        background: rgba(17, 21, 19, .88);
        padding: 16px;
        box-shadow: 0 18px 44px rgba(0, 0, 0, .22);
    }

    .mini-label {
        display: block;
        color: var(--spotify-muted);
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .mini-card strong {
        display: block;
        color: #fff;
        font-size: 16px;
        line-height: 1.35;
        user-select: text;
    }

    #terminal-output {
        margin: 0;
        flex: 1;
        max-height: 96px;
        overflow: hidden auto;
        scrollbar-color: #1a1b20 transparent;
        white-space: pre-wrap;
        color: #dce4de;
        font-family: "Cascadia Mono", Consolas, monospace;
        font-size: 12px;
        line-height: 1.55;
        user-select: text;
    }

    .mini-player-bar,
    .pill-progress-shell {
        display: none;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: min(420px, calc(100vw - 36px));
        max-width: 520px;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 18px;
        background: #1f222b;
        box-shadow: 0 30px 90px rgba(0, 0, 0, .5);
        z-index: 9999;
        overflow: hidden;
    }

    .modal-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 48px;
        padding: 0 16px;
        background: #282c37;
        color: #fff;
        font-weight: 850;
    }

    .modal-close {
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: 10px;
        background: rgba(255, 255, 255, .08);
        color: #fff;
        font-size: 20px;
        cursor: pointer;
    }

    .modal-body {
        padding: 16px;
        line-height: 1.5;
        user-select: text;
    }

    @media (max-width: 1050px) {
        html,
        body {
            overflow: auto;
        }

        #app-shell {
            display: block;
            height: auto;
            overflow: visible;
        }

        #discord-panel {
            min-height: 720px;
            height: auto;
            max-height: none;
        }

        #spotify-panel {
            min-height: 760px;
            height: auto;
        }
    }

    @media (max-height: 880px) and (min-width: 1051px) {
        .discord-home,
        #spotify-panel {
            padding: 14px 18px;
        }

        .server-rail {
            gap: 10px;
            padding: 14px 8px;
        }

        .rail-logo,
        .rail-dot {
            width: 40px;
            height: 40px;
            border-radius: 13px;
        }

        .top-card {
            padding: 16px;
            margin-bottom: 10px;
        }

        .top-card h1 {
            font-size: clamp(24px, 2.3vw, 32px);
            line-height: 1.04;
        }

        .settings-block {
            margin-top: 10px;
            padding: 14px;
        }

        .block-title {
            margin-bottom: 10px;
        }

        .block-title p,
        .hint {
            font-size: 12px;
            line-height: 1.38;
        }

        .switch-row {
            min-height: 48px;
            padding: 8px 0;
        }

        .preview-panel {
            padding: 10px 12px;
            margin: 6px 0;
        }

        .spotify-topbar {
            margin-bottom: 12px;
        }

        .spotify-topbar h2 {
            font-size: clamp(28px, 3vw, 42px);
        }

        .lyrics-content {
            padding: 28px 34px;
        }

        .lyric-label {
            margin-bottom: 10px;
        }

        .lyrics-content h1 {
            font-size: clamp(32px, 4vw, 58px);
            line-height: 1.05;
        }

        .track-meta {
            margin-top: 18px;
        }

        .spotify-footer {
            margin-top: 10px;
        }

        .mini-card {
            padding: 12px 14px;
        }

        #terminal-output {
            max-height: 72px;
            font-size: 11px;
        }
    }

    @media (max-height: 720px) and (min-width: 1051px) {
        #app-shell {
            grid-template-columns: minmax(320px, 38vw) minmax(0, 1fr);
        }

        #discord-panel {
            grid-template-columns: 58px minmax(0, 1fr);
        }

        .server-rail {
            gap: 8px;
        }

        .rail-logo,
        .rail-dot {
            width: 34px;
            height: 34px;
            border-radius: 11px;
        }

        .top-card {
            align-items: center;
        }

        .top-card h1 {
            font-size: 22px;
        }

        .settings-block {
            padding: 12px;
        }

        .text-input,
        .text-area,
        .button {
            min-height: 36px;
            border-radius: 10px;
            padding: 8px 10px;
        }

        .spotify-footer {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 620px) {
        #discord-panel {
            grid-template-columns: 58px minmax(0, 1fr);
        }

        .discord-home,
        #spotify-panel {
            padding: 14px;
        }

        .field-grid,
        .spotify-footer {
            grid-template-columns: 1fr;
        }

        .token-row {
            grid-template-columns: 1fr;
        }

        .lyrics-content h1 {
            font-size: 40px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            transition: none !important;
            animation: none !important;
        }
    }
    #spotify-panel.ytmusic-theme {
        background:
            linear-gradient(180deg, hsla(var(--dynamic-hue, 0), 25%, 10%, 0.72), hsla(var(--dynamic-hue, 0), 15%, 5%, 0.98)),
            #0a0808;
    }
    #spotify-panel.ytmusic-theme .lyrics-stage {
        background:
            linear-gradient(135deg, hsla(var(--dynamic-hue, 0), 30%, 15%, 0.88), hsla(var(--dynamic-hue, 0), 20%, 10%, 0.92) 48%, hsla(var(--dynamic-hue, 0), 15%, 6%, 0.94)),
            #201515;
    }
    #spotify-panel.ytmusic-theme .lyric-orb {
        background:
            radial-gradient(circle at 35% 35%, hsla(var(--dynamic-hue, 0), 60%, 45%, 0.45), hsla(var(--dynamic-hue, 0), 50%, 25%, 0.08) 38%, transparent 66%),
            radial-gradient(circle at 60% 70%, hsla(var(--dynamic-hue, 0), 65%, 40%, 0.3), transparent 54%);
    }
    #spotify-panel.ytmusic-theme #progress-fill {
        background: var(--source-accent);
    }
    #spotify-panel.ytmusic-theme .spotify-state.playing {
        background: var(--source-accent-soft);
        border-color: var(--source-accent-border);
        color: #ffd6de;
    }
    .rail-dot {
        cursor: pointer;
    }

    .icon-button {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, .15);
        background: rgba(255, 255, 255, .05);
        color: #fff;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
        padding: 0;
        outline: none;
    }

    .icon-button:hover {
        background: rgba(255, 255, 255, .15);
        border-color: rgba(255, 255, 255, .3);
    }

    body:not(.mini-mode) .expand-icon {
        display: none !important;
    }

    body.mini-mode .shrink-icon {
        display: none !important;
    }

    .lyrics-stage {
        position: relative;
    }

    body.mini-mode #discord-panel {
        display: none !important;
    }

    body.mini-mode #app-titlebar {
        display: none !important;
    }

    html.mini-mode,
    body.mini-mode,
    body.mini-mode #app-shell {
        background: transparent !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        overflow: hidden !important;
        -webkit-app-region: drag;
    }

    body.mini-mode #app-shell {
        display: block !important;
        height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
        padding: 0 !important;
    }

    body.mini-mode #spotify-panel {
        container-type: inline-size;
        position: relative !important;
        display: grid !important;
        grid-template-rows: auto minmax(0, 1fr) auto !important;
        gap: 14px !important;
        padding: 16px !important;
        border-radius: 24px !important;
        clip-path: inset(0 round 24px) !important;
        transform: translateZ(0) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        box-shadow:
            0 10px 36px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -26px 70px rgba(0, 0, 0, 0.22) !important;
        background:
            radial-gradient(circle at 18% 14%, hsla(var(--dynamic-hue, 145), 55%, 46%, 0.32), transparent 34%),
            linear-gradient(145deg, hsla(var(--dynamic-hue, 145), 42%, 18%, 0.92), hsla(var(--dynamic-hue, 145), 36%, 8%, 0.95) 58%, rgba(16, 18, 16, 0.96)) !important;
        backdrop-filter: blur(24px) saturate(160%) !important;
        -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
        overflow: hidden !important;
        width: 100% !important;
        height: 100vh !important;
        min-height: 0 !important;
    }

    body.mini-mode #spotify-panel::after {
        content: "";
        position: absolute;
        right: 8px;
        bottom: 8px;
        width: 15px;
        height: 15px;
        opacity: .36;
        background:
            linear-gradient(135deg, transparent 0 45%, rgba(255, 255, 255, .72) 45% 55%, transparent 55%),
            linear-gradient(135deg, transparent 0 67%, rgba(255, 255, 255, .72) 67% 77%, transparent 77%);
        pointer-events: none;
        -webkit-app-region: no-drag;
    }

    body.mini-mode #spotify-panel.ytmusic-theme {
        background:
            radial-gradient(circle at 18% 14%, hsla(var(--dynamic-hue, 0), 70%, 48%, 0.30), transparent 34%),
            linear-gradient(145deg, hsla(var(--dynamic-hue, 0), 42%, 18%, 0.92), hsla(var(--dynamic-hue, 0), 36%, 8%, 0.95) 58%, rgba(18, 12, 12, 0.96)) !important;
    }

    body.mini-mode .spotify-topbar {
        grid-row: 1 !important;
        display: grid !important;
        grid-template-columns: 58px minmax(0, 1fr) 30px !important;
        gap: 12px !important;
        align-items: center !important;
        margin: 0 !important;
        padding: 0 !important;
        min-width: 0 !important;
    }

    body.mini-mode .spotify-topbar > div:nth-child(2) {
        min-width: 0 !important;
    }

    body.mini-mode .spotify-topbar > div:last-child {
        display: flex !important;
        justify-content: flex-end !important;
        min-width: 0 !important;
    }

    body.mini-mode .popup-artwork {
        display: grid !important;
        width: 58px !important;
        height: 58px !important;
        place-items: center !important;
        border-radius: 14px !important;
        background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04)),
            hsla(var(--dynamic-hue, 145), 44%, 24%, 0.62) !important;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 12px 34px rgba(0, 0, 0, 0.34) !important;
        overflow: hidden !important;
    }

    body.mini-mode .popup-artwork img {
        width: 32px !important;
        height: 32px !important;
        object-fit: contain !important;
    }

    body.mini-mode .lyrics-stage {
        grid-row: 2 !important;
        min-height: 0 !important;
        height: 100% !important;
        border-radius: 20px !important;
        border: 1px solid rgba(255, 255, 255, 0.10) !important;
        background: rgba(10, 12, 11, 0.34) !important;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        overflow: hidden !important;
    }

    body.mini-mode .spotify-topbar .kicker {
        display: none !important;
    }

    body.mini-mode #play-state {
        display: none !important;
    }

    body.mini-mode #song-artist {
        font-size: clamp(11px, 3.6cqw, 13px) !important;
        color: rgba(255, 255, 255, 0.62) !important;
        margin-top: 2px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 100% !important;
    }

    body.mini-mode .spotify-footer {
        display: none !important;
    }

    body.mini-mode .lyrics-content {
        padding: 18px 18px 12px !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }

    body.mini-mode .lyric-label {
        font-size: 11px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.8px !important;
        color: rgba(255, 255, 255, 0.7) !important;
        margin-bottom: 12px !important;
    }

    body.mini-mode .lyrics-scroller {
        overflow: hidden !important;
        padding: 8px 0 !important;
        gap: 14px !important;
        margin-bottom: 8px !important;
        mask-image: linear-gradient(to bottom, transparent 0%, white 18%, white 82%, transparent 100%) !important;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 18%, white 82%, transparent 100%) !important;
        -webkit-app-region: no-drag;
    }

    body.mini-mode .icon-button {
        -webkit-app-region: no-drag;
        background: transparent !important;
        border: none !important;
        width: 28px !important;
        height: 28px !important;
        color: rgba(255, 255, 255, 0.7) !important;
        opacity: 0.8;
        transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease !important;
    }

    body.mini-mode .icon-button:hover {
        transform: scale(1.1) !important;
        opacity: 1 !important;
        color: #fff !important;
        background: transparent !important;
    }

    body.mini-mode .lyric-line-item {
        font-size: clamp(14px, 5cqw, 22px) !important;
        color: rgba(255, 255, 255, 0.52) !important;
        opacity: 1 !important;
        transform: none !important;
        line-height: 1.22 !important;
        max-width: 36ch !important;
    }

    body.mini-mode .lyric-line-item.active {
        color: #ffffff !important;
        transform: scale(1.02) !important;
        text-shadow: 0 4px 12px rgba(255, 255, 255, 0.15) !important;
    }

    body.mini-mode .track-meta {
        display: none !important;
    }

    body.mini-mode .progress-shell {
        height: 5px !important;
        margin-top: 10px !important;
        border-radius: 999px !important;
        background: rgba(255, 255, 255, 0.14) !important;
    }

    body.mini-mode #progress-fill {
        background: var(--source-accent) !important;
    }

    body.mini-mode .mini-player-bar {
        display: block !important;
        grid-row: 3 !important;
        -webkit-app-region: no-drag;
    }

    body.mini-mode .media-controls-main {
        display: none !important;
    }

    body.mini-mode .media-controls-popup {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 10px !important;
        margin: 0 !important;
    }

    body.mini-mode .media-controls-popup .media-button {
        width: 28px !important;
        height: 28px !important;
        color: rgba(255, 255, 255, .72) !important;
    }

    body.mini-mode .media-controls-popup .media-button-play {
        width: 38px !important;
        height: 38px !important;
        color: #050505 !important;
        background: #fff !important;
    }

    body.mini-mode .media-controls-popup .media-button svg {
        width: 18px !important;
        height: 18px !important;
    }

    body.mini-mode #song-title {
        font-size: clamp(13px, 4.5cqw, 17px) !important;
        font-weight: 800 !important;
        color: #fff !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 100% !important;
    }

    body.mini-mode *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
    }
    body.mini-mode * {
        scrollbar-width: none !important;
    }

    @media (max-width: 330px), (max-height: 220px) {
        body.mini-mode #spotify-panel {
            grid-template-rows: auto !important;
            gap: 0 !important;
            padding: 10px 12px 14px !important;
            border-radius: 14px !important;
            clip-path: inset(0 round 14px) !important;
        }

        body.mini-mode .spotify-topbar {
            grid-template-columns: 36px minmax(0, 1fr) auto !important;
            gap: 10px !important;
            align-items: center !important;
        }

        body.mini-mode .mini-player-bar {
            display: none !important;
        }

        body.mini-mode .media-controls-popup {
            display: none !important;
        }

        body.mini-mode .media-controls-mini {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 8px !important;
        }

        body.mini-mode .mini-media-button {
            width: 28px !important;
            height: 28px !important;
            color: rgba(255, 255, 255, .78) !important;
            padding: 0 !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }

        body.mini-mode .mini-media-play {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            color: #050505 !important;
            background: #fff !important;
        }

        body.mini-mode .mini-media-button svg {
            width: 16px !important;
            height: 16px !important;
        }

        body.mini-mode .popup-artwork {
            width: 36px !important;
            height: 36px !important;
            border-radius: 10px !important;
        }

        body.mini-mode .popup-artwork img {
            width: 23px !important;
            height: 23px !important;
        }

        body.mini-mode #song-title {
            font-size: 13px !important;
            line-height: 1.15 !important;
            max-width: 100% !important;
        }

        body.mini-mode #song-artist {
            font-size: 11px !important;
            line-height: 1.15 !important;
            max-width: 100% !important;
        }

        body.mini-mode .lyrics-stage {
            display: none !important;
        }

        body.mini-mode .icon-button {
            display: none !important;
        }

        body.mini-mode .pill-progress-shell {
            display: block !important;
            position: absolute;
            left: 10px;
            right: 10px;
            bottom: 5px;
            height: 2px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.12);
            overflow: hidden;
            pointer-events: none;
            -webkit-app-region: no-drag;
        }

        body.mini-mode #pill-progress-fill {
            display: block;
            height: 100%;
            width: 4%;
            border-radius: inherit;
            background: var(--source-accent);
            transition: width .32s ease;
        }

        body.mini-mode #spotify-panel::after {
            right: 5px;
            bottom: 10px;
            width: 10px;
            height: 10px;
        }
    }

    @media (max-height: 70px) {
        body.mini-mode #spotify-panel {
            padding: 8px 12px 12px !important;
            border-radius: 12px !important;
            clip-path: inset(0 round 12px) !important;
        }

        body.mini-mode .spotify-topbar {
            grid-template-columns: 32px minmax(0, 1fr) auto !important;
            gap: 8px !important;
        }

        body.mini-mode .popup-artwork {
            width: 32px !important;
            height: 32px !important;
            border-radius: 9px !important;
        }

        body.mini-mode .popup-artwork img {
            width: 21px !important;
            height: 21px !important;
        }

        body.mini-mode #song-title {
            font-size: 12px !important;
            line-height: 1.05 !important;
        }

        body.mini-mode #song-artist {
            display: none !important;
        }

        body.mini-mode .mini-player-bar {
            display: none !important;
        }

        body.mini-mode .media-controls-popup {
            display: none !important;
        }

        body.mini-mode .media-controls-mini {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 6px !important;
        }

        body.mini-mode .mini-media-play {
            width: 30px !important;
            height: 30px !important;
        }

        body.mini-mode .icon-button {
            display: none !important;
        }

        body.mini-mode .pill-progress-shell {
            display: block !important;
            position: absolute;
            left: 10px;
            right: 10px;
            bottom: 4px;
            height: 2px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.12);
            overflow: hidden;
            pointer-events: none;
        }

        body.mini-mode #pill-progress-fill {
            display: block;
            height: 100%;
            width: 4%;
            border-radius: inherit;
            background: var(--source-accent);
        }

        body.mini-mode #spotify-panel::after {
            right: 4px;
            bottom: 8px;
            width: 8px;
            height: 8px;
        }
    }
</style>
`
).appendTo(document.body)

document.title = "DiscordLyrics Panel"

const userTokenInput = $("#user-token")
const checkTokenButton = $("#check-token")
const enableTimestampCheckbox = $("#enable-timestamp")
const enableLabelCheckbox = $("#enable-label")
const statusPreview = $("#status-preview")
const advancedSWT = $("#advanced-swt")
const enableAdvancedSWT = $("#enable-advanced-swt")
const customEmoji = $("#custom-emoji")
const customStatus = $("#custom-status")
const sendTimeOffset = $("#send-time-offset")
const minSendInterval = $("#min-send-interval")
const enableAutooffset = $("#enable-autooffset")
const autooffset = $("#autooffset")
const enableYtMusicApi = $("#enable-ytmusic-api")
const enableYtMusicWeb = $("#enable-ytmusic-web")
const ytMusicApiHost = $("#ytmusic-api-host")
const ytMusicApiPort = $("#ytmusic-api-port")
const enableAutoupdate = $("#enable-autoupdate")
const checkUpdateButton = $("#check-update")
const installUpdateButton = $("#install-update")
const updateStatus = $("#update-status")
const terminalOutput = $("#terminal-output")
const tokenState = $("#token-state")
const songTitle = $("#song-title")
const songArtist = $("#song-artist")
const lyricsScroller = $("#lyrics-scroller")
const progressTime = $("#progress-time")
const lyricSource = $("#lyric-source")
const playState = $("#play-state")
const progressFill = $("#progress-fill")
const pillProgressFill = $("#pill-progress-fill")
const progressShell = $(".progress-shell")
const statusMini = $("#status-mini")
const titlebar = $("#app-titlebar")
const titlebarMinimize = $("#window-minimize")
const titlebarMaximize = $("#window-maximize")
const titlebarClose = $("#window-close")
const windowControls = window.discordLyricsWindow

const spotifyRailDot = $(".rail-dot:has(img[alt='Spotify'])")
const ytmusicRailDot = $(".rail-dot:has(img[alt='YouTube Music'])")
const popupArtworkImg = $(".popup-artwork img")

spotifyRailDot.on("click", () => {
    if (settings.view.activeSource === "spotify") return
    settings.view.activeSource = "spotify"
    applySourceTheme("spotify")
    saveSettings()
})

ytmusicRailDot.on("click", () => {
    if (settings.view.activeSource === "ytmusic") return
    settings.view.activeSource = "ytmusic"
    applySourceTheme("ytmusic")
    saveSettings()
})

$(".rail-logo").on("click", () => {
    if (!settingsLoaded) return
    settings.view.discordEnabled = settings.view.discordEnabled !== false ? false : true
    updateDiscordButtonState()
    saveSettings()
})

$("#toggle-mini-player").on("click", () => {
    if (!settingsLoaded) return
    const isMini = settings.view.miniMode === true
    settings.view.miniMode = !isMini
    $("html, body").toggleClass("mini-mode", !isMini)
    saveSettings()
})

titlebarMinimize.on("click", () => windowControls && windowControls.minimize())
titlebarMaximize.on("click", () => windowControls && windowControls.toggleMaximize())
titlebarClose.on("click", () => windowControls && windowControls.close())

titlebar.on("dblclick", (event) => {
    if ($(event.target).closest("button").length) return
    if (windowControls) windowControls.toggleMaximize()
})

let settings = {
    credentials: {
        token: "",
        cookies: "",
        clientID: "",
        clientSecret: "",
        useExternalAuthServer: false,
        code: "",
        refreshToken: "",
        uuid: "",
        customRedirectUri: ""
    },
    view: {
        timestamp: true,
        label: true,
        advanced: {
            enabled: false,
            customEmoji: "🎶",
            customStatus: "[{timestamp}] Lời bài hát - {lyrics}"
        },
        activeSource: "spotify",
        discordEnabled: true,
        miniMode: false,
        ytmusicApi: {
            enabled: true,
            host: "127.0.0.1",
            port: 26538,
            accessToken: ""
        },
        ytmusicWeb: {
            enabled: true
        }
    },
    timings: {
        sendTimeOffset: 200,
        enableAutooffset: true,
        autooffset: 3,
        minSendInterval: 700
    },
    update: {
        enableAutoupdate: false
    }
}

let settingsLoaded = false
let lastRenderedSong = ""
let lastRenderedSongLyricsCount = -1
let lastRenderedSource = ""
let lastActiveLineTime = -1
let latestUpdateInfo = null
let latestPlaybackProgressMs = 0
let latestPlaybackDurationMs = 0
let isSeeking = false

userTokenInput.on("change", () => {
    settings.credentials.token = userTokenInput.val().replace(/"/g, "")
    setTokenState(settings.credentials.token ? "Token đã nhập" : "Chưa kiểm tra", "muted")
    saveSettings()
})

checkTokenButton.on("click", async () => {
    settings.credentials.token = userTokenInput.val().replace(/"/g, "")
    saveSettings()
    checkTokenButton.text("Đang kiểm tra...")
    setTokenState("Đang kiểm tra", "muted")
    const valid = await checkToken(settings.credentials.token)
    checkTokenButton.text("Kiểm tra")

    if (!valid) {
        setTokenState("Token lỗi", "bad")
        modal("Kiểm tra token", "Token không hợp lệ hoặc Discord từ chối yêu cầu.", "rgba(255, 160, 174, 1)")
        return
    }

    setTokenState("Đã kết nối", "ok")
    notifyDiscordTokenValidated()
    modal("Kiểm tra token", "Token hợp lệ. App có thể cập nhật trạng thái Discord.", "rgba(137, 245, 174, 1)")
})

enableTimestampCheckbox.on("click", () => {
    settings.view.timestamp = enableTimestampCheckbox.prop("checked")
    saveSettings()
    updateStatusPreview()
})

enableLabelCheckbox.on("click", () => {
    settings.view.label = enableLabelCheckbox.prop("checked")
    saveSettings()
    updateStatusPreview()
})

enableAdvancedSWT.on("click", () => {
    const enabled = enableAdvancedSWT.prop("checked")
    settings.view.advanced.enabled = enabled
    advancedSWT.toggleClass("hidden", !enabled)
    enableTimestampCheckbox.prop("disabled", enabled)
    enableLabelCheckbox.prop("disabled", enabled)
    saveSettings()
})

customEmoji.on("input", () => {
    settings.view.advanced.customEmoji = customEmoji.val()
    saveSettings()
})

customStatus.on("input", () => {
    settings.view.advanced.customStatus = customStatus.val()
    saveSettings()
})

sendTimeOffset.on("input", () => {
    const value = Math.round(Number(String(sendTimeOffset.val()).replace(",", ".")))

    if (!Number.isFinite(value) || value < 0) {
        sendTimeOffset.css("color", "rgba(255, 160, 174, 1)")
        return
    }

    sendTimeOffset.css("color", "")
    settings.timings.sendTimeOffset = value
    saveSettings()
})

enableAutooffset.on("click", () => {
    settings.timings.enableAutooffset = enableAutooffset.prop("checked")
    saveSettings()
})

autooffset.on("input", () => {
    const value = Number(autooffset.val())

    if (Number.isNaN(value)) {
        autooffset.css("color", "rgba(255, 160, 174, 1)")
        return
    }

    autooffset.css("color", "")
    settings.timings.autooffset = value
    saveSettings()
})

minSendInterval.on("input", () => {
    const value = Math.round(Number(String(minSendInterval.val()).replace(",", ".")))

    if (!Number.isFinite(value) || value < 0) {
        minSendInterval.css("color", "rgba(255, 160, 174, 1)")
        return
    }

    minSendInterval.css("color", "")
    settings.timings.minSendInterval = value
    saveSettings()
})

enableYtMusicApi.on("click", () => {
    settings.view.ytmusicApi = settings.view.ytmusicApi || {}
    settings.view.ytmusicApi.enabled = enableYtMusicApi.prop("checked")
    saveSettings()
})

enableYtMusicWeb.on("click", () => {
    settings.view.ytmusicWeb = settings.view.ytmusicWeb || {}
    settings.view.ytmusicWeb.enabled = enableYtMusicWeb.prop("checked")
    saveSettings()
})

ytMusicApiHost.on("input", () => {
    const value = String(ytMusicApiHost.val()).trim()
    settings.view.ytmusicApi = settings.view.ytmusicApi || {}
    settings.view.ytmusicApi.host = value || "127.0.0.1"
    saveSettings()
})

ytMusicApiPort.on("input", () => {
    const value = Math.round(Number(String(ytMusicApiPort.val()).replace(",", ".")))

    if (!Number.isFinite(value) || value <= 0 || value > 65535) {
        ytMusicApiPort.css("color", "rgba(255, 160, 174, 1)")
        return
    }

    ytMusicApiPort.css("color", "")
    settings.view.ytmusicApi = settings.view.ytmusicApi || {}
    settings.view.ytmusicApi.port = value
    saveSettings()
})

enableAutoupdate.on("click", () => {
    settings.update = settings.update || {}
    settings.update.enableAutoupdate = enableAutoupdate.prop("checked")
    saveSettings()
})

checkUpdateButton.on("click", () => {
    checkForUpdate()
})

installUpdateButton.on("click", () => {
    installLatestUpdate()
})

$(".media-button, .mini-media-button").on("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    const action = $(event.currentTarget).attr("data-media-action")
    sendPlaybackControl(action)
})

progressShell.on("pointerdown", (event) => {
    if (!latestPlaybackDurationMs) return

    isSeeking = true
    $("body").addClass("seeking")
    updateSeekPreview(event)

    const target = event.currentTarget
    if (target.setPointerCapture && event.originalEvent && event.originalEvent.pointerId !== undefined) {
        target.setPointerCapture(event.originalEvent.pointerId)
    }
})

progressShell.on("pointermove", (event) => {
    if (!isSeeking || !latestPlaybackDurationMs) return
    updateSeekPreview(event)
})

progressShell.on("pointerup pointercancel", (event) => {
    if (!isSeeking || !latestPlaybackDurationMs) return

    isSeeking = false
    $("body").removeClass("seeking")
    const percent = getProgressPointerPercent(event)
    const positionMs = Math.round((percent / 100) * latestPlaybackDurationMs)
    sendPlaybackControl("seekTo", { positionMs })
})


function getControlSource() {
    return (settings.view.activeSource || "spotify") === "ytmusic" ? "ytmusic" : "spotify"
}

async function sendPlaybackControl(action, payload = {}) {
    if (!action) return

    const body = {
        source: getControlSource(),
        action,
        ...payload
    }

    try {
        const response = await fetch("/api/playback/control", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            statusMini.text(data && data.message ? data.message : "Không điều khiển được app nhạc")
        }
    } catch {
        statusMini.text("Không gửi được lệnh điều khiển")
    }
}

function getProgressPointerPercent(event) {
    const rect = progressShell[0].getBoundingClientRect()
    const clientX = event.originalEvent && typeof event.originalEvent.clientX === "number"
        ? event.originalEvent.clientX
        : event.clientX
    const raw = ((clientX - rect.left) / rect.width) * 100

    return Math.max(0, Math.min(100, raw))
}

function updateSeekPreview(event) {
    const percent = getProgressPointerPercent(event)
    const positionMs = Math.round((percent / 100) * latestPlaybackDurationMs)

    progressFill.css("width", `${percent}%`)
    pillProgressFill.css("width", `${percent}%`)
    progressShell.css("--progress-percent", percent)
    progressTime.text(formatSeconds(positionMs / 1000))
}

function getPlaybackProgressPercent(playback) {
    const durationMs = Number(playback.durationMs || 0)
    const progressMs = Number(playback.progressMs || 0)

    if (durationMs > 0 && progressMs >= 0) {
        return Math.max(0, Math.min(100, (progressMs / durationMs) * 100))
    }

    return progressPercent(playback.progress)
}


function formatSeconds(seconds) {
    seconds = Number(seconds)
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
    const rounded = Math.floor(seconds)
    const minutes = Math.floor(rounded / 60)
    const rest = rounded % 60
    return `${minutes}:${rest < 10 ? "0" : ""}${rest}`
}

function getStatusString(lyrics, time) {
    const safeLyrics = String(lyrics || "").replace("♪", "🎶")
    return `${settings.view.timestamp ? `[${formatSeconds((time / 1000).toFixed(0))}] ` : ""}${settings.view.label ? "Lời bài hát - " : ""}${safeLyrics}`
}

function updateStatusPreview() {
    statusPreview.text(getStatusString("La-la-la", 137000))
}

function setTokenState(text, state) {
    tokenState.text(text)
    tokenState.removeClass("ok bad muted").addClass(state || "muted")
}

async function checkToken(token) {
    try {
        const response = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: token
            }
        })

        return response.ok
    } catch {
        return false
    }
}

async function checkForUpdate() {
    checkUpdateButton.text("Đang kiểm tra...")
    installUpdateButton.addClass("hidden")
    updateStatus.text("Đang kiểm tra GitHub Releases...")

    try {
        const response = await fetch("/api/update/check")
        const data = await response.json()
        latestUpdateInfo = data
        updateStatus.text(data.message || "Đã kiểm tra cập nhật.")
        installUpdateButton.toggleClass("hidden", !data.hasUpdate)
    } catch {
        latestUpdateInfo = null
        updateStatus.text("Không kiểm tra được cập nhật. Hãy kiểm tra mạng hoặc thử lại sau.")
        installUpdateButton.addClass("hidden")
    } finally {
        checkUpdateButton.text("Kiểm tra cập nhật")
    }
}

async function installLatestUpdate() {
    installUpdateButton.text("Đang tải...")
    updateStatus.text("Đang tải bản mới. Không tắt app trong lúc tải.")

    try {
        const response = await fetch("/api/update/install", { method: "POST" })
        const data = await response.json()
        latestUpdateInfo = data
        updateStatus.text(data.message || "Đã mở trình cài đặt bản mới.")
        installUpdateButton.addClass("hidden")
    } catch {
        updateStatus.text("Không tải hoặc mở được trình cài đặt bản mới.")
    } finally {
        installUpdateButton.text("Cài bản mới")
    }
}

function saveSettings() {
    if (!settingsLoaded) return

    ws.send(JSON.stringify({
        type: "settings",
        payload: settings
    }))
}

function notifyDiscordTokenValidated() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify({
        type: "discord-token-validated",
        payload: {
            token: settings.credentials.token
        }
    }))
}

function updateDiscordButtonState() {
    const isEnabled = settings.view.discordEnabled !== false;
    $(".rail-logo img").attr("src", isEnabled ? "logo_discordlyric.png" : "logo_discordlyric_red.png");
}

function applySourceTheme(source) {
    const isYtMusic = source === "ytmusic"

    $("body").toggleClass("ytmusic-source", isYtMusic).toggleClass("spotify-source", !isYtMusic)
    spotifyRailDot.toggleClass("active", !isYtMusic)
    ytmusicRailDot.toggleClass("active", isYtMusic)
    $("#spotify-panel").toggleClass("ytmusic-theme", isYtMusic)
    popupArtworkImg.attr("src", isYtMusic ? "logo_ytmusic.svg" : "logo_spotify.svg")
    popupArtworkImg.attr("alt", isYtMusic ? "YouTube Music" : "Spotify")

    if (isYtMusic) {
        $(".spotify-topbar .kicker").text("ĐANG PHÁT (YT MUSIC)")
        if ($("#song-artist").text().includes("Spotify")) {
            $("#song-artist").text("Mở YouTube Music để bắt đầu")
        }
    } else {
        $(".spotify-topbar .kicker").text("ĐANG PHÁT")
        if ($("#song-artist").text().includes("YouTube Music")) {
            $("#song-artist").text("Mở Spotify hoặc SpotX để bắt đầu")
        }
    }
}

function loadSettings(settingsToLoad) {
    settings = $.extend(true, settings, JSON.parse(settingsToLoad))

    updateDiscordButtonState()

    const isMiniMode = settings.view.miniMode || false;
    $("html, body").toggleClass("mini-mode", isMiniMode);

    userTokenInput.val(settings.credentials.token)
    enableTimestampCheckbox.prop("checked", settings.view.timestamp)
    enableLabelCheckbox.prop("checked", settings.view.label)
    customEmoji.val(settings.view.advanced.customEmoji)
    customStatus.val(settings.view.advanced.customStatus)
    sendTimeOffset.val(settings.timings.sendTimeOffset)
    minSendInterval.val(settings.timings.minSendInterval || 700)
    enableAutooffset.prop("checked", settings.timings.enableAutooffset)
    autooffset.val(settings.timings.autooffset)
    enableYtMusicApi.prop("checked", settings.view.ytmusicApi.enabled !== false)
    enableYtMusicWeb.prop("checked", settings.view.ytmusicWeb.enabled !== false)
    ytMusicApiHost.val(settings.view.ytmusicApi.host || "127.0.0.1")
    ytMusicApiPort.val(settings.view.ytmusicApi.port || 26538)
    enableAutoupdate.prop("checked", Boolean(settings.update && settings.update.enableAutoupdate))
    setTokenState(settings.credentials.token ? "Token đã nhập" : "Chưa kiểm tra", "muted")

    const activeSource = settings.view.activeSource || "spotify"
    applySourceTheme(activeSource)

    if (settings.view.advanced.enabled) {
        enableAdvancedSWT.prop("checked", true)
        advancedSWT.removeClass("hidden")
        enableTimestampCheckbox.prop("disabled", true)
        enableLabelCheckbox.prop("disabled", true)
    } else {
        enableAdvancedSWT.prop("checked", false)
        advancedSWT.addClass("hidden")
        enableTimestampCheckbox.prop("disabled", false)
        enableLabelCheckbox.prop("disabled", false)
    }

    updateStatusPreview()
    settingsLoaded = true
}

function progressPercent(progress) {
    if (!progress || typeof progress !== "string") return 4
    const parts = progress.split(":").map((part) => Number(part))
    if (parts.some((part) => Number.isNaN(part))) return 4
    const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0]
    return Math.max(4, Math.min(96, Math.round((seconds / 270) * 100)))
}

function updatePlayback(playback) {
    const activeSource = playback.source || settings.view.activeSource || "spotify"
    applySourceTheme(activeSource)
    const song = playback.song || "Chưa phát nhạc"
    const artist = playback.author || (activeSource === "ytmusic" ? "Mở YouTube Music để bắt đầu" : "Mở Spotify hoặc SpotX để bắt đầu")

    // Hashing function to generate beautiful HSL colors matching the song
    if (playback.song && song !== "Chưa phát nhạc") {
        const hashInput = song + " - " + artist;
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
            hash = hashInput.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        document.documentElement.style.setProperty("--dynamic-hue", hue.toString());
    } else {
        const defaultHue = activeSource === "ytmusic" ? "0" : "145";
        document.documentElement.style.setProperty("--dynamic-hue", defaultHue);
    }
    const lyric = playback.lyricsDisplay || playback.currentLyrics || "Chưa có lyric để hiển thị"
    const source = playback.fetchedFrom || "Chưa lấy"
    const progress = playback.progress || "0:00"
    const isPlaying = Boolean(playback.isPlaying && playback.song)
    const hasSong = Boolean(playback.song && song !== "Chưa phát nhạc")
    let discordText = hasSong
        ? (isPlaying ? "Đang gửi lyric lên Discord" : "Đã nhận bài hát, chờ phát tiếp")
        : (activeSource === "ytmusic" ? "Chờ YouTube Music phát nhạc" : "Chờ Spotify hoặc SpotX phát nhạc")

    if (playback.rateLimitResetTime && playback.rateLimitResetTime > Date.now()) {
        const remainingSec = ((playback.rateLimitResetTime - Date.now()) / 1000).toFixed(1)
        const triggerTime = new Date(playback.rateLimitResetTime - Math.ceil((playback.rateLimitDuration || 5) * 1000))
        const timeStr = triggerTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        discordText = `${timeStr}: Bị cấm gửi status trong ${remainingSec} giây`
    }

    latestPlaybackProgressMs = Number(playback.progressMs || 0)
    latestPlaybackDurationMs = Number(playback.durationMs || 0)
    const progressValue = getPlaybackProgressPercent(playback)

    songTitle.text(song).attr("title", song)
    songArtist.text(artist).attr("title", artist)
    progressTime.text(progress)
    lyricSource.text(`Nguồn lyric: ${source}`)
    if (!isSeeking) {
        progressFill.css("width", `${progressValue}%`)
        pillProgressFill.css("width", `${progressValue}%`)
        progressShell.css("--progress-percent", progressValue)
        progressShell.attr("aria-valuemin", 0)
        progressShell.attr("aria-valuemax", latestPlaybackDurationMs || 0)
        progressShell.attr("aria-valuenow", latestPlaybackProgressMs || 0)
    }
    playState.text(isPlaying ? "Đang phát" : "Đang chờ").toggleClass("playing", isPlaying).toggleClass("idle", !isPlaying)
    $("body").toggleClass("playback-playing", isPlaying)
    $(".lyrics-stage").toggleClass("idle", !hasSong)
    statusMini.text(discordText)

    // Update shuffle button active state
    const shuffleBtn = $(`.media-button[data-media-action="toggleShuffle"]`)
    if (playback.isShuffleActive) {
        shuffleBtn.addClass("active")
        shuffleBtn.attr("title", "Tắt trộn bài")
    } else {
        shuffleBtn.removeClass("active")
        shuffleBtn.attr("title", "Trộn bài")
    }

    // Update repeat button active state
    const repeatBtn = $(`.media-button[data-media-action="cycleRepeat"]`)
    repeatBtn.removeClass("active repeat-track")
    if (playback.repeatState === "track") {
        repeatBtn.addClass("active repeat-track")
        repeatBtn.attr("title", "Tắt lặp lại")
    } else if (playback.repeatState === "context") {
        repeatBtn.addClass("active")
        repeatBtn.attr("title", "Lặp 1 bài")
    } else {
        repeatBtn.attr("title", "Lặp lại danh sách phát")
    }

    terminalOutput.text(`
Bài hát: ${song}
Nghệ sĩ: ${artist}
Thời gian: ${progress}
Lyric hiện tại: ${lyric}
Nguồn lyric: ${source}
`.trim())

    // Update Spotify-style scrollable lyrics list
    const currentSongKey = song + " - " + artist
    const currentLyricsCount = playback.lyricsLines ? playback.lyricsLines.length : 0
    if (currentSongKey !== lastRenderedSong || currentLyricsCount !== lastRenderedSongLyricsCount || activeSource !== lastRenderedSource) {
        lastRenderedSong = currentSongKey
        lastRenderedSongLyricsCount = currentLyricsCount
        lastRenderedSource = activeSource
        lastActiveLineTime = -1

        lyricsScroller.empty()

        if (playback.lyricsLines && playback.lyricsLines.length) {
            playback.lyricsLines.forEach((line) => {
                const lineEl = $("<div>")
                    .addClass("lyric-line-item")
                    .attr("data-time", line.time)
                    .text(line.text.replace("♪", "🎶"))
                lyricsScroller.append(lineEl)
            })
        } else {
            const emptyEl = $("<div>").addClass("lyric-line-item empty")
            if (!hasSong) {
                const sourceLabel = activeSource === "ytmusic" ? "YouTube Music" : "Spotify"
                emptyEl
                    .addClass("empty-idle")
                    .append($("<span>").addClass("empty-title").text(sourceLabel))
                    .append($("<span>").addClass("empty-hint").text("Mở app nhạc và phát bài để bắt đầu"))
            } else {
                emptyEl.text(playback.lyricsDisplayBase || "Chưa có lyric để hiển thị")
            }
            lyricsScroller.append(emptyEl)
        }
    }

    // Update active line highlighting and scrolling
    const activeTime = playback.currentLineTime !== undefined ? playback.currentLineTime : -1
    if (activeTime !== lastActiveLineTime) {
        lastActiveLineTime = activeTime

        const lines = $(".lyric-line-item")
        lines.removeClass("active")

        if (activeTime !== -1) {
            const activeLine = $(`.lyric-line-item[data-time="${activeTime}"]`)
            if (activeLine.length) {
                activeLine.addClass("active")

                // Center scroll active line
                const scrollerHeight = lyricsScroller.height()
                const activeTop = activeLine.position().top
                const activeHeight = activeLine.outerHeight()
                const currentScroll = lyricsScroller.scrollTop()

                const targetScroll = currentScroll + activeTop - (scrollerHeight / 2) + (activeHeight / 2)

                lyricsScroller.animate({ scrollTop: targetScroll }, { duration: 220, queue: false })
            }
        } else {
            lyricsScroller.animate({ scrollTop: 0 }, { duration: 220, queue: false })
        }
    }
}

function modal(title, description, color = "white") {
    const modalWindow = $(`
    <div class="modal">
        <div class="modal-top">
            <span>${title}</span>
            <button class="modal-close" type="button">×</button>
        </div>
        <div class="modal-body" style="color: ${color};">${description}</div>
    </div>
    `)

    modalWindow.find(".modal-close").on("click", () => modalWindow.remove())
    modalWindow.appendTo(document.body)
}

const ws = new WebSocket("ws://localhost:8999/ws")

ws.onmessage = (message) => {
    const data = JSON.parse(message.data)

    if (data.type === "settings") {
        loadSettings(JSON.stringify(data.payload))
    } else if (data.type === "playback") {
        updatePlayback(data.payload)
    }
}
