# DiscordLyrics v1.4.1

DiscordLyrics là ứng dụng Windows giúp hiển thị lyric bài hát đang phát lên Discord Custom Status. App đọc nhạc từ Spotify, SpotX hoặc YouTube Music, tự lấy lyric từ nhiều nguồn, đồng bộ lyric theo thời gian và có giao diện desktop/popup để theo dõi bài hát.

App không cần Spotify Developer API cho nhu cầu cơ bản. Bạn chỉ cần Discord token để gửi status.

> Lưu ý bảo mật: Discord token là thông tin nhạy cảm. Không chia sẻ token, không commit `settings.json`, không gửi token lên GitHub.

## Tính Năng Chính

- Đọc nhạc từ Spotify, SpotX và YouTube Music.
- Chọn riêng chế độ Spotify/SpotX hoặc YouTube Music.
- Hỗ trợ YouTube Music desktop API và YouTube Music web bridge.
- Lấy lyric tự động từ nhiều nguồn và dùng cache để tải nhanh hơn.
- Gửi lyric hiện tại lên Discord Custom Status.
- Tự lưu token, setting, vị trí và kích thước cửa sổ.
- Giao diện tiếng Việt, theme đổi theo nguồn nhạc.
- Pop-up nổi kiểu Spotify, có thể kéo, resize và thu nhỏ dạng pill.
- Điều khiển nhạc: shuffle, lùi bài, play/pause, next, repeat.
- Kéo/click thanh thời gian để tua bài.
- Kiểm tra cập nhật và tự cài bản mới từ GitHub Releases.
- Chạy nền, thu nhỏ xuống system tray khi đóng cửa sổ.

## Có Gì Mới Ở v1.4.1

- Polish lại giao diện chính, lyric view, footer log, mini popup và pill mode.
- Thanh titlebar custom gọn hơn, bo góc giống app desktop hiện đại.
- Empty state hiển thị đúng Spotify hoặc YouTube Music khi chưa phát nhạc.
- Accent màu đổi theo nguồn: Spotify xanh, YouTube Music đỏ.
- Cải thiện logic gửi Discord để giảm nguy cơ bị rate limit:
  - Có giới hạn request nội bộ khi lyric đổi quá nhanh.
  - Không retry liên tục cùng một lyric khi Discord trả lỗi.
  - Tôn trọng `retry_after` khi Discord trả `429`.
  - Token bị `401/403` sẽ tạm dừng gửi cho tới khi đổi token hoặc kiểm tra token lại.
  - Pause/stop có debounce trước khi xóa Discord status để tránh gửi clear liên tục.
  - Khi lyric chạy nhanh, app ưu tiên gửi dòng mới nhất thay vì cố gửi lại các dòng đã trôi qua.

## Cài Đặt

### Cách 1: Dành cho người dùng phổ thông

Bạn không cần cài Node.js.

1. Mở trang [Releases](https://github.com/Baor-05/Discord_Lyrics/releases).
2. Tải file `DiscordLyricsSetup.exe` ở bản mới nhất.
3. Mở `DiscordLyricsSetup.exe` và cài như app Windows bình thường.
4. Mở `DiscordLyrics`.
5. Dán Discord token vào ô `Token Discord`.
6. Bấm `Kiểm tra`.
7. Chọn nguồn nhạc ở thanh icon bên trái:
   - Icon Spotify: dùng cho Spotify hoặc SpotX.
   - Icon YouTube Music: dùng cho YouTube Music.
8. Mở app nhạc và phát bài hát.

Khi bấm nút `X`, app sẽ thu nhỏ xuống tray thay vì thoát hẳn. Muốn thoát hoàn toàn, bấm chuột phải vào icon DiscordLyrics ở tray và chọn `Quit`.

### Cách 2: Dành cho dev

Yêu cầu:

- Windows 10 hoặc Windows 11.
- Cài [Node.js](https://nodejs.org/en).

Cài thư viện:

```powershell
npm install
```

Build TypeScript:

```powershell
npm run build
```

Chạy desktop app khi phát triển:

```powershell
npm run desktop
```

Đóng gói installer:

```powershell
npm run package:desktop
```

## Cách Lấy Discord Token

1. Mở [discord.com/app](https://discord.com/app) trên trình duyệt, không dùng app Discord desktop.
2. Nhấn `F12` để mở DevTools, sau đó vào tab `Network`.
3. Thực hiện một hành động bất kỳ như đổi server, mở chat hoặc gửi tin nhắn.
4. Click vào một request bất kỳ, vào `Request Headers`, tìm header `Authorization`.
5. Copy giá trị đó và dán vào ô `Token Discord` trong app.

## Cài Đặt YouTube Music

DiscordLyrics có 2 cách nhận YouTube Music.

### Cách 1: YouTube Music Desktop

1. Cài YouTube Music desktop theo hướng dẫn Windows tại [app-youtube-music#windows](https://github.com/code/app-youtube-music#windows).
2. Mở YouTube Music desktop.
3. Vào cài đặt của YouTube Music desktop và bật `Máy chủ API`.
4. Đặt:
   - Tên máy chủ: `127.0.0.1`
   - Cổng: `26538`
   - Chiến thuật xác thực: `Xác thực ngay yêu cầu đầu tiên`
5. Trong DiscordLyrics, chọn icon YouTube Music.
6. Giữ bật `Dùng API YouTube Music`.
7. Khi YouTube Music hỏi cấp quyền API lần đầu, bấm cho phép.

### Cách 2: YouTube Music Web

Để nhận nhạc từ `music.youtube.com` trong Chrome/Edge, cần cài extension đi kèm:

1. Mở trang quản lý extension:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
2. Bật `Developer mode`.
3. Chọn `Load unpacked`.
4. Chọn thư mục:

```text
resources/browser-extension/ytmusic-web/
```

Nếu chạy từ mã nguồn, dùng thư mục:

```text
browser-extension/ytmusic-web/
```

Thứ tự ưu tiên khi chọn chế độ YouTube Music:

1. YouTube Music desktop API đang phát.
2. YouTube Music web đang phát.
3. YouTube Music desktop API đang tạm dừng.
4. Windows Media fallback.

## Luồng Chạy

1. App khởi động server nội bộ tại `http://localhost:8999`.
2. Panel desktop kết nối với server qua WebSocket.
3. App đọc setting từ:

```text
%APPDATA%\DiscordLyrics\settings.json
```

4. Người dùng chọn nguồn nhạc: Spotify hoặc YouTube Music.
5. App đọc bài hát đang phát qua Spotify/SpotX, YouTube Music API/web bridge hoặc Windows Media Session.
6. Khi phát hiện bài mới, app xóa lyric cũ và tìm lyric mới.
7. `LyricsFetcher` kiểm tra cache trước, nếu chưa có thì gọi các nguồn lyric bên ngoài.
8. Lyric được chuẩn hóa, lọc metadata và lưu lại vào cache.
9. UI cập nhật tên bài, nghệ sĩ, lyric, progress, nguồn lyric và trạng thái Discord.
10. `StatusChanger` xác định dòng lyric hiện tại và gửi lên Discord khi cần.
11. Nếu Discord trả rate limit, app tạm dừng gửi theo thời gian Discord yêu cầu.
12. Khi pause/stop đủ lâu hoặc thoát app, app gửi yêu cầu xóa Discord Custom Status.

## Cách Dùng

### Kết nối Discord

1. Mở app.
2. Dán Discord token vào ô `Token Discord`.
3. Bấm `Kiểm tra`.
4. Nếu trạng thái báo đã kết nối, app có thể cập nhật Discord Custom Status.

Token chỉ được lưu trên máy của bạn trong file setting cục bộ. Không commit file này lên Git.

### Chọn nguồn nhạc

Ở thanh icon bên trái:

- Chọn icon Spotify để đọc Spotify hoặc SpotX.
- Chọn icon YouTube Music để đọc YouTube Music.

Khi đổi nguồn, giao diện và icon pop-up sẽ đổi theo nguồn đang chạy.

### Dùng pop-up

1. Bấm nút thu nhỏ ở góc phải khu vực đang phát.
2. App chuyển sang cửa sổ pop-up nhỏ.
3. Kéo pop-up đến vị trí mong muốn.
4. Kéo góc dưới phải để resize.
5. Bấm icon mở rộng để quay lại panel đầy đủ.

Kích thước nhỏ nhất của pop-up là `250x50`.

### Cập nhật app

Trong panel, mở mục `Cập nhật app`.

- Bấm `Kiểm tra cập nhật` để kiểm tra bản mới trên GitHub Releases.
- Nếu có bản mới, bấm `Cài bản mới`; app sẽ tải `DiscordLyricsSetup.exe`, mở trình cài đặt và tự đóng để Windows cập nhật file.
- Có thể bật `Tự kiểm tra cập nhật` nếu muốn app tự kiểm tra khi khởi động.

### Chỉnh độ trễ

`Độ trễ gửi (ms)` là thời gian app gửi lyric sớm hơn hoặc muộn hơn so với timestamp lyric.

Ví dụ:

- `200ms` nghĩa là gửi sớm khoảng 0.2 giây.
- `500ms` nghĩa là gửi sớm khoảng 0.5 giây.

Discord có độ trễ riêng, nên đặt `1ms` không có nghĩa là status sẽ hiện tức thì. Mức thực tế nên dùng thường là `200ms` đến `500ms`.

### Giới hạn gửi Discord

`Giới hạn gửi Discord` là khoảng cách tối thiểu giữa hai lần đổi status. Tính năng này giúp giảm nguy cơ bị Discord rate limit khi lyric đổi quá nhanh.

Khuyên dùng:

1. Bật tự chỉnh độ trễ gửi.
2. Giới hạn gửi Discord nên để khoảng `700ms` đến `1200ms`.
3. Tính trung bình nên để khoảng `3` đến `6`.
4. Hạn chế dùng icon trong custom status nếu không cần.

## Ghi Chú Bảo Mật

DiscordLyrics sử dụng Discord token cá nhân để cập nhật custom status. Hãy tự chịu trách nhiệm khi sử dụng token cá nhân và chỉ chạy app trên máy của bạn.

Nếu lỡ commit token lên GitHub, hãy đổi token ngay bằng cách đăng xuất toàn bộ phiên Discord hoặc đổi mật khẩu Discord.
