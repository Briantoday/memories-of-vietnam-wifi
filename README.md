# Memories of Vietnam — Wi-Fi Landing Page

Trang landing hiện ra sau khi khách kết nối Wi-Fi tại quầy Memories of Vietnam, Nhà ga T2 Cảng Hàng không Quốc tế Nội Bài.

## Cấu trúc file

```
.
├── index.html        # Trang chính
├── styles.css        # Style + animation
├── script.js         # Song ngữ + slideshow + reveal
├── images/           # ẢNH PHỐI CẢNH (cần bạn drop vào)
│   ├── render-1.jpg
│   ├── render-2.jpg
│   ├── render-3.jpg
│   └── render-4.jpg
└── README.md
```

## Bạn cần làm gì để chạy được

### 1. Thêm ảnh phối cảnh
Bỏ 4 ảnh phối cảnh quầy đã gửi mình vào folder `images/`, đặt tên đúng:
- `render-1.jpg` → ảnh khu Spirits / Chocolate
- `render-2.jpg` → ảnh storefront "MEMORIES of VIETNAM"
- `render-3.jpg` → ảnh khu Specialties (mái nhà tranh)
- `render-4.jpg` → ảnh tổng quan storefront

> Format `.jpg` hoặc `.png` đều được. Khuyến nghị resize về **max 1600px chiều ngang** + nén để page load nhanh trên 4G yếu (dùng [squoosh.app](https://squoosh.app) hoặc [tinypng.com](https://tinypng.com)).

### 2. Xem thử local
Mở `index.html` trực tiếp bằng trình duyệt là chạy được — không cần server.

### 3. Phần map nhà ga
Hiện đang là placeholder ("Interactive terminal map coming soon"). Khi bạn chuẩn bị xong file PNG bản đồ + báo flow captive portal, mình sẽ overlay bản đồ + animation vào sau.

## Tùy biến nhanh

| Đổi gì | Ở đâu |
|---|---|
| Câu copy | Sửa trực tiếp trong `index.html` — mỗi text có `data-en="..."` (tiếng Anh) và `data-vi="..."` (tiếng Việt) |
| Màu sắc | Sửa trong `styles.css` — block `:root { --red-deep: ...; --red-bright: ...; ... }` |
| Font | Sửa link Google Fonts trong `index.html` + biến `--font-display`, `--font-body` trong CSS |
| Slideshow tốc độ | Đổi `INTERVAL` trong `script.js` (mặc định 5000ms) |
| Ngôn ngữ mặc định | Đổi `DEFAULT_LANG` trong `script.js` ('en' hoặc 'vi') |

## Hosting (sẽ làm sau khi chốt domain)

Recommend **Cloudflare Pages**:
1. Đẩy folder này lên GitHub
2. Vào Cloudflare Pages → Connect repository → chọn repo
3. Build command: để trống. Output: thư mục gốc.
4. Custom domain: trỏ về domain đã mua

Hoặc đơn giản hơn: kéo-thả thẳng cả folder vào dashboard Cloudflare Pages.

## Captive portal Unifi (cần IT cấu hình)

- **External Portal URL**: trỏ về landing page đã host (vd `https://memoriesofvietnam.com`)
- **Pre-Authorization Access**: whitelist domain landing page + `fonts.googleapis.com` + `fonts.gstatic.com` để khách load được trước khi authenticate
- **Flow**: chờ bạn confirm IT muốn dạng *auto-authorize sau X giây* hay *nút Continue to Wi-Fi*. Khi confirmed, mình thêm xử lý vào `script.js`.
