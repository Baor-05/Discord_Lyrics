# DiscordLyrics v1.0

DiscordLyrics là công cụ tự động đồng bộ và thay đổi trạng thái tùy chỉnh (custom status) trên Discord thành lời bài hát đang phát trên Spotify hoặc YouTube Music.

Ứng dụng chạy mượt mà trên Windows, tự động lấy thông tin bài hát đang phát qua Windows Media (SMTC) và cập nhật trạng thái Discord theo thời gian thực.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Bằng File `.exe` (Không cần cài Node.js)

Dự án đã được đóng gói sẵn thành các tệp thực thi độc lập `.exe` giúp người dùng cuối có thể chạy ngay lập tức mà không cần cài đặt môi trường phát triển.

Có hai phiên bản đóng gói sẵn mà bạn có thể lựa chọn sử dụng:

### 1. Phiên bản Cửa sổ giao diện (Desktop App - Khuyên dùng)
Phiên bản này có giao diện cửa sổ ứng dụng tích hợp sẵn bảng cấu hình và có thể thu nhỏ xuống khay hệ thống (System Tray).

*   **Bước 1**: Truy cập thư mục `desktop-release/win-unpacked/`.
*   **Bước 2**: Nhấp đúp chuột vào tệp `DiscordLyrics.exe` (hoặc nhấp đúp vào file shortcut `desktop-release/DiscordLyrics.lnk`).
*   **Bước 3**: Cửa sổ giao diện sẽ mở ra. Bạn nhập **Discord Token** vào ô cấu hình để bắt đầu.
*   **Chạy nền**: Khi bấm nút đóng (X) cửa sổ, ứng dụng sẽ tự động ẩn xuống khay hệ thống (khay icon dưới góc phải màn hình) để tiếp tục cập nhật lyric chạy nền.
*   **Thoát hoàn toàn**: Nhấp chuột phải vào icon ứng dụng trên khay hệ thống -> Chọn **Quit**.

> ⚠️ **Lưu ý quan trọng**: Không di chuyển riêng lẻ file `DiscordLyrics.exe` ra ngoài. Phải giữ nguyên cả thư mục `desktop-release/win-unpacked` hoặc sử dụng tệp Shortcut `DiscordLyrics.lnk` để chạy ứng dụng.

---

### 2. Phiên bản Dòng lệnh (Console App)
Phiên bản siêu nhẹ, hiển thị nhật ký chạy trực tiếp trong cửa sổ dòng lệnh.

*   **Bước 1**: Truy cập thư mục `release/`.
*   **Bước 2**: Nhấp đúp chuột vào tệp `DiscordLyrics.exe`. Một cửa sổ đen (Console) sẽ hiện lên và hiển thị nhật ký hoạt động.
*   **Bước 3**: Mở trình duyệt web bất kỳ và truy cập địa chỉ:
    ```text
    http://localhost:8999
    ```
*   **Bước 4**: Bảng điều khiển cấu hình trực quan hiện ra, bạn dán **Discord Token** vào cấu hình và lưu lại.
*   **Thoát ứng dụng**: Đóng cửa sổ dòng lệnh đen đang chạy.

---

## 🛠️ Hướng Dẫn Dành Cho Nhà Phát Triển (Chạy từ mã nguồn)

Nếu bạn muốn tùy chỉnh code hoặc chạy trực tiếp từ mã nguồn:

### Yêu cầu hệ thống
*   Node.js phiên bản 18 trở lên.
*   Trình quản lý gói `npm`.

### Cài đặt & Khởi chạy
1.  Mở PowerShell tại thư mục dự án và chạy lệnh cài đặt thư viện:
    ```powershell
    npm install
    ```
2.  Biên dịch mã nguồn TypeScript:
    ```powershell
    npm run build
    ```
3.  Khởi chạy ứng dụng:
    ```powershell
    npm start
    ```
4.  Truy cập bảng điều khiển trên trình duyệt tại: `http://localhost:8999` để thiết lập.

### Các lệnh đóng gói (Packaging)
*   Đóng gói ra bản Console `.exe`:
    ```powershell
    npm run package:win
    ```
*   Đóng gói ra bản Desktop Electron:
    ```powershell
    npm run package:desktop
    ```

---

## ⚙️ Hướng Dẫn Cấu Hình Chi Tiết

### 1. Cấu hình Discord Token
*   Để cập nhật trạng thái, ứng dụng cần **Discord Token** cá nhân của bạn.
*   Dán token vào ô **Token Discord** trên bảng điều khiển và nhấn **Kiểm tra (Check)** để kết nối.
*   ⚠️ **Bảo mật**: Tuyệt đối không chia sẻ Discord Token của bạn cho bất kỳ ai khác. File cấu hình cục bộ `settings.json` được lưu trên máy của bạn và sẽ chứa token này.

### 2. Chọn Nguồn Nhạc (Spotify hoặc YouTube Music)
Ứng dụng hỗ trợ chuyển đổi nguồn trực quan ngay trên Sidebar phía bên trái:
*   🟢 **Spotify**:
    *   Mặc định tự động nhận nhạc chạy từ phần mềm **Spotify Desktop** hoặc **SpotX** trên Windows.
    *   Hỗ trợ cấu hình Spotify Developer API (nhập Client ID/Secret) nếu muốn cập nhật trạng thái nhạc trực tiếp qua API chính chủ (yêu cầu Premium).
*   🔴 **YouTube Music**:
    *   Hỗ trợ tự động nhận diện từ phần mềm **YouTube Music Desktop App** (phổ biến từ th-ch trên GitHub) hoặc các trình duyệt web đang phát tab YouTube Music.
    *   Khi nhấn chọn YouTube Music trên Sidebar, ứng dụng sẽ đổi giao diện sang tông màu đỏ và tự động dừng nhạc trên Spotify để phát YouTube Music.

### 3. Tối Ưu Cân Chỉnh Lời Nhạc
Trên bảng cấu hình, bạn có thể thiết lập:
*   **Hiển thị thời gian lyric**: Thêm mốc thời gian trước lời nhạc (ví dụ: `[2:17]`).
*   **Hiển thị nhãn lời bài hát**: Thêm tiền tố `Lời bài hát - ` trước status.
*   **Mẫu status riêng (Advanced)**: Tự tạo mẫu hiển thị tùy chỉnh bằng các từ khóa như `{lyrics}`, `{timestamp}`, `{song_name}`, `{song_author}`.
*   **Tự động cân chỉnh độ trễ (Auto Offset)**: Tự động đo độ trễ mạng tới Discord API để căn thời gian gửi lời nhạc lên sớm hoặc muộn hơn, giúp lời nhạc hiển thị chuẩn xác nhất mà không bị Discord giới hạn tần suất (Rate Limit).
