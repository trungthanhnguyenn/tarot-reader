# Tarot Reader - Ứng Dụng Bói Bài Tarot Online

Ứng dụng web cho phép người dùng nhập tên và ngày sinh để nhận được một lượt bói bài Tarot ba lá (quá khứ, hiện tại, tương lai) được giải nghĩa bởi mô hình ngôn ngữ lớn (LLM).

## Stack Công Nghệ

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
*   **Backend:** Node.js, Express, TypeScript
*   **Database:** SQLite
*   **LLM:** Google Gemini AI (Gemini 1.5 Flash - Free tier)
*   **Deployment:** (Tùy chọn) Docker

## Cấu Trúc Repo

```
tarot-reader/
├── client/                 # Frontend React (Vite)
├── server/                 # Backend Node.js (Express)
├── assets/                 # Hình ảnh 78 lá bài
├── cards.json              # Dữ liệu chi tiết về các lá bài
├── .env.example            # File môi trường mẫu
└── README.md
```

## Hướng Dẫn Cài Đặt và Chạy

**Yêu cầu:**

*   Node.js (v18+)
*   npm

**Các bước:**

1.  **Clone repo:**

    ```bash
    git clone https://github.com/your-username/tarot-reader.git
    cd tarot-reader
    ```

2.  **Cài đặt dependencies:**

    ```bash
    npm run install:all
    ```

3.  **Cấu hình biến môi trường:**

    *   Tạo file `.env` trong thư mục gốc của dự án.
    *   Thêm `GEMINI_KEY=your_gemini_api_key_here` vào file `.env`.
    *   Để lấy API key miễn phí:
        1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
        2. Đăng nhập bằng tài khoản Google
        3. Tạo API key mới
        4. Copy key vào file `.env`

4.  **Chạy ứng dụng (development mode):**

    ```bash
    npm run dev
    ```

    *   Client sẽ chạy trên `http://localhost:3000`
    *   Server sẽ chạy trên `http://localhost:4000`

## Quy Trình CI/CD (GitHub Actions)

Repo này được cấu hình với GitHub Actions để tự động thực hiện các công việc sau mỗi lần push hoặc tạo pull request:

*   **Build:** Xây dựng cả client và server để đảm bảo không có lỗi biên dịch.
*   **Lint:** Kiểm tra mã nguồn với ESLint để duy trì chất lượng và tính nhất quán.

## Cấu Trúc Dữ Liệu

### `cards.json`

Mỗi lá bài trong file `cards.json` có cấu trúc như sau:

```json
{
  "id": "rws-00",
  "name": "The Fool",
  "vietnamese": "Kẻ Khờ",
  "keywords": ["khởi đầu", "ngây thơ", "tiềm năng"],
  "upright": "Một khởi đầu mới đầy tiềm năng đang chờ đón bạn.",
  "reversed": "Sự liều lĩnh thiếu suy nghĩ có thể dẫn đến rắc rối.",
  "image": "data/img/rws/the-fool.png"
}
```

### Database (`readings` table)

Bảng `readings` trong file `tarot.db` (SQLite) được dùng để cache kết quả:

*   `id` (TEXT, PRIMARY KEY): Hash của `name + dob + date`.
*   `name` (TEXT): Tên người dùng.
*   `dob` (TEXT): Ngày sinh (YYYY-MM-DD).
*   `date` (TEXT): Ngày bốc bài (YYYY-MM-DD).
*   `cards` (TEXT): Chuỗi JSON chứa mảng 3 lá bài đã bốc.
*   `reading` (TEXT): Chuỗi Markdown chứa kết quả giải nghĩa từ LLM.

