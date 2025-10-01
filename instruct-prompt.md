Vai trò: Bạn là Senior Web-Engineer chuyên React / Node.js, nhiệm vụ tạo 1 repo hoàn chỉnh cho trang web Tarot Online theo yêu cầu sau.
1. Tổng quan
Mục tiêu: web cho phép user nhập Tên + Ngày sinh → bốc bài Tarot → LLM (Gemini) trả lời.
Dữ liệu đầu vào:
– Thư mục assets/ chứa 78 ảnh *.png.
– File cards.json (mỗi lá có name, keywords, upright, reversed, …).
Output: 1 repo Git với:
Frontend: React + Vite + TailwindCSS (đẹp, responsive).
Backend: Node.js (Express) + SQLite.
LLM: Google Gemini (Gemini 1.5 Flash).
Cache: nếu đã bốc bài hôm nay → trả kết quả cũ.
2. Cấu trúc repo
Copy
tarot-web/
├── client/                 # React Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormInput.tsx
│   │   │   ├── TarotResult.tsx
│   │   └── App.tsx
├── server/                 # Node + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── tarot.ts
│   │   ├── utils/
│   │   │   ├── db.ts
│   │   │   └── gemini.ts
│   │   └── index.ts
├── assets/                 # ảnh 78 lá
├── cards.json
├── .env.example
└── README.md
3. Chi tiết yêu cầu
A. Frontend (React + Vite + TailwindCSS)
Trang đơn:
– Input: Tên (text) + Ngày sinh (<input type="date">).
– Validate realtime (xem phần B).
– Nút “Bốc bài”.
Kết quả:
– 3-lá spread: Past / Present / Future.
– Hiển thị ảnh lá + keywords + câu giải nghĩa do LLM trả về.
– Loading skeleton + lottie (nếu muốn đẹp).
Dark/light mode toggle (Tailwind dark:).
B. Backend (Express + TypeScript)
Routes:
Copy
POST /api/tarot
body: { name: string, dob: string }   // dob = YYYY-MM-DD
Validation chặt chẽ:
name:
– Tối thiểu 2 ký tự, chỉ chữ cái và khoảng trắng.
– Max 50 ký tự.
dob:
– Đúng định dạng ISO (regex /^\d{4}-\d{2}-\d{2}$/).
– Không được tương lai (new Date(dob) <= new Date()).
– Tuổi 13-100.
Trả về 400 + message rõ ràng nếu lỗi.
C. Logic bốc bài & Cache
Bốc bài:
– Shuffle 78 lá → lấy 3 lá.
– 50 % upright, 50 % reversed (random boolean).
– Trả về cho FE: mảng 3 objects {name, imageUrl, isReversed}.
Cache:
– Key: hash(name + dob + today’s date).
– Lưu vào SQLite bảng readings:
Copy
id TEXT PRIMARY KEY,
name TEXT,
dob TEXT,
date TEXT,       -- ISO date
cards TEXT,      -- JSON string [ {name, isReversed} ]
reading TEXT     -- Markdown từ LLM
– Nếu key đã tồn tại → trả kết quả cũ ngay.
D. Gọi LLM (Gemini)
Prompt template:
Copy
Bạn là Tarot reader. User: {name}, sinh {dob}.  
Lá 1 (quá khứ): {card1} {isReversed ? "reversed" : "upright"}  
Lá 2 (hiện tại): …  
Lá 3 (tương lai): …  
Hãy viết 1 đoạn 300-400 từ, thân thiện, không dài dòng. Tiếng Việt.
Trả về Markdown (có thể có **bold**, emoji 🃏).
E. Dev & Deploy
.env.example:
Copy
GEMINI_KEY=your_gemini_api_key_here
PORT=4000
Scripts:
npm run dev => client Vite dev server.
npm run build => build client → /dist.
npm run serve => backend serve static + API.
Docker compose tùy chọn.
4. Checklist đầu ra
[ ] git init, push lên GitHub (tarot-reader).
[ ] README: cách cài đặt, chạy thử, cấu trúc dữ liệu.
[ ] ESLint + Prettier ở cả client & server.
[ ] PR template & GitHub Actions CI (build + lint).