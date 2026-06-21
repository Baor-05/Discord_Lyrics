# Release Notes - DiscordLyrics v1.4.1

Phiên bản **v1.4.1** tập trung vào polish giao diện và giảm nguy cơ Discord rate limit khi lyric đổi nhanh.

## Thay Đổi Chính

- Giao diện chính gọn hơn, lyric view dễ đọc hơn, footer log cân hơn.
- Mini popup và pill mode được chỉnh lại spacing, scale và progress bar.
- Thanh titlebar custom bo góc, đồng bộ hơn với giao diện app.
- Empty state hiển thị đúng nguồn đang chọn: Spotify hoặc YouTube Music.
- Theme đổi accent theo nguồn nhạc: Spotify xanh, YouTube Music đỏ.
- Cải thiện luồng gửi Discord Custom Status:
  - Giới hạn request nội bộ khi lyric thay đổi quá nhanh.
  - Không retry liên tục cùng một status khi Discord trả lỗi.
  - Tôn trọng `retry_after` khi gặp `429`.
  - Tạm dừng gửi nếu token bị `401/403`, mở lại khi đổi token hoặc kiểm tra token hợp lệ.
  - Debounce thao tác xóa status khi pause/stop để tránh gửi clear liên tục.
  - Ưu tiên gửi lyric mới nhất khi các dòng lyric chạy quá nhanh.

## File Cần Upload Lên GitHub Releases

Upload các file trong thư mục `desktop-release`:

- `DiscordLyricsSetup.exe`
- `latest.yml`
- `DiscordLyricsSetup.exe.blockmap`

`DiscordLyricsSetup.exe` là file người dùng tải về để cài đặt. `latest.yml` và `.blockmap` cần cho tính năng cập nhật tự động trong app.
