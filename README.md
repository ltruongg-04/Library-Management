# Library Management

Library Management là hệ thống quản lý thư viện trực tuyến, hỗ trợ độc giả, thủ thư và quản trị viên trong các nghiệp vụ mượn trả sách, quản lý kho sách, phân quyền, thông báo, thanh toán và thống kê vận hành. Dự án được xây dựng theo mô hình client-server với frontend Next.js, backend Spring Boot và cơ sở dữ liệu MySQL.

## Mục Tiêu

- Tin học hóa quy trình quản lý thư viện, giảm thao tác thủ công và hạn chế sai sót khi theo dõi sách, bản sao sách, phiếu mượn và lịch sử giao dịch.
- Nâng cao trải nghiệm độc giả với danh mục sách trực tuyến, tìm kiếm, đặt mượn, đặt lịch đọc tại thư viện, quản lý sách yêu thích và theo dõi lịch sử mượn.
- Hỗ trợ vận hành tại quầy cho thủ thư, bao gồm quản lý kho sách, duyệt phiếu mượn, xác nhận trả sách, xử lý phí phạt và kiểm duyệt đánh giá.
- Đảm bảo an toàn dữ liệu bằng xác thực JWT, RBAC, quản lý vai trò/quyền, audit log và cấu hình CORS theo môi trường.
- Cung cấp nền tảng mở rộng cho email notification, thanh toán VNPAY, reCAPTCHA, lưu trữ file qua MinIO hoặc Google Cloud Storage tương thích S3.

## Tính Năng Chính

- Xác thực: đăng ký, đăng nhập, kích hoạt tài khoản, NextAuth OAuth, JWT access token.
- Danh mục sách: xem danh sách, chi tiết sách, tác giả, thể loại, ảnh bìa, bản sao sách và trạng thái khả dụng.
- Mượn trả: đặt mượn online, tra cứu phiếu mượn, gia hạn, hủy phiếu, đặt lịch đến thư viện và xử lý khách chưa có tài khoản.
- Quản trị: dashboard, quản lý sách, tác giả, thể loại, thành viên, vai trò, phân quyền, đánh giá, lịch hẹn, chính sách mượn và nhật ký hệ thống.
- RBAC: các vai trò chính gồm Admin, Librarian và Customer; quyền chi tiết được lưu riêng theo permission id.
- Email và thông báo: template email Thymeleaf, Resend API, notification trong ứng dụng.
- Thanh toán: tích hợp VNPAY sandbox/production qua biến môi trường.
- Lưu trữ tệp: upload ảnh/file qua MinIO local hoặc endpoint tương thích S3/GCS.

## Kiến Trúc

```text
Library-Management/
├── code/
│   ├── Next-frontend/      # Ứng dụng Next.js, React, TailwindCSS
│   └── backend-layered/    # Spring Boot REST API theo Controller-Service-Repository
├── docs/                   # SRS, user stories, ERD, convention, UI/UX guideline
├── scripts/                # Script hỗ trợ vận hành
├── docker-compose.yml      # Stack local: MySQL, Redis, MinIO, backend, frontend
└── README.md
```

Backend tuân thủ kiến trúc phân lớp:

- `controller`: REST API, validate request, trả response DTO.
- `service`: xử lý nghiệp vụ, transaction, cache invalidation.
- `repository`: Spring Data JPA truy cập MySQL.
- `entity`: mapping database, không expose trực tiếp ra API.
- `dto`, `mapper`, `config`, `job`, `common`: lớp hỗ trợ theo chức năng.

Frontend dùng App Router, tách component theo `base/` và `features/`, text UI tập trung trong `src/constants/ui-text`, API qua service wrapper dùng Axios.

## Công Nghệ

| Thành phần | Công nghệ                                                                          |
| ---------- | ---------------------------------------------------------------------------------- |
| Frontend   | Next.js 14.2, React 18, TypeScript, TailwindCSS, NextAuth, Axios, React Hook Form  |
| Backend    | Java 24, Spring Boot 3.4, Spring Web, Spring Security, Spring Data JPA, Validation |
| Database   | MySQL 8, Flyway migrations                                                         |
| Cache      | Caffeine mặc định, Redis tùy chọn                                                  |
| Storage    | MinIO local hoặc Google Cloud Storage/S3-compatible endpoint                       |
| Email      | Resend, Thymeleaf templates                                                        |
| Payment    | VNPAY                                                                              |
| DevOps     | Docker, Docker Compose, Maven, npm                                                 |

## Yêu Cầu Môi Trường

- Node.js 20+ và npm.
- Java 24 và Maven 3.9+.
- Docker Desktop nếu chạy bằng Docker Compose.
- MySQL 8 nếu chạy backend local không dùng container database.

## Chạy Nhanh Bằng Docker

Chạy toàn bộ stack local:

```bash
docker compose up --build
```

Mặc định các dịch vụ sẽ mở tại:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8081` trong Docker Compose
- MySQL: `localhost:3306`, database `librarydb`
- Redis: `localhost:6379`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

Dừng stack:

```bash
docker compose down
```

Nếu muốn xóa cả volume dữ liệu local:

```bash
docker compose down -v
```

## Chạy Local Từng Phần

### 1. Backend

Tạo file cấu hình từ mẫu:

```bash
cd code/backend-layered
cp .env.example .env
```

Cập nhật `.env` theo môi trường local. Tối thiểu cần các biến:

- `PORT`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `VNPAY_TMN_CODE`
- `VNPAY_HASH_SECRET`
- `VNPAY_PAY_URL`
- `MINIO_URL`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET_NAME`
- `RECAPTCHA_SECRET_KEY`

Chạy backend:

```bash
mvn spring-boot:run
```

Kiểm tra build/test:

```bash
mvn test
```

Backend đọc cấu hình từ `resource/application.yml`, `.env` và `.env.backend` nếu có.

### 2. Frontend

Tạo file cấu hình từ mẫu:

```bash
cd code/Next-frontend
cp .env.example .env.local
```

Cập nhật các biến quan trọng:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `BACKEND_URL`
- `BACKEND_INTERNAL_URL`
- `NEXT_PUBLIC_API_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

Cài dependency và chạy dev server:

```bash
npm install
npm run dev
```

Kiểm tra frontend:

```bash
npm run lint
npx tsc --noEmit
```

## Biến Môi Trường

Không commit secret thật vào repository. Các file mẫu hiện có:

- `code/backend-layered/.env.example`
- `code/Next-frontend/.env.example`

Một số nhóm cấu hình quan trọng:

- Database: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, pool config.
- Auth: `JWT_SECRET`, `NEXTAUTH_SECRET`, Google OAuth client.
- CORS/URL: `BACKEND_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGIN_PATTERNS`.
- Storage: `MINIO_URL`, `MINIO_BUCKET_NAME`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`.
- Payment: `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_PAY_URL`, `VNPAY_RETURN_URL`, `VNPAY_IPN_URL`.
- Email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- Bot protection: `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.

## Database Và Migration

- ERD và ghi chú schema nằm trong `docs/DB-erd.md`.
- Flyway migrations nằm trong `code/backend-layered/resource/db/migration`.
- `application.yml` hiện để `spring.flyway.enabled` theo biến `FLYWAY_ENABLED`, mặc định `false`.
- Khi thay đổi entity, cần đối chiếu với ERD và không expose entity trực tiếp qua controller.

## Quy Ước Phát Triển

Trước khi sửa code, đọc các tài liệu trong `docs/`:

- `docs/convention.md`: quy ước frontend/backend, cấu trúc thư mục, naming, transaction, DTO, repository/service/controller.
- `docs/UI UX style guideline.md`: design tokens, typography, spacing, component style, dark/light mode.
- `docs/DB-erd.md`: thiết kế database và quan hệ entity.
- `docs/srs.md`: yêu cầu hệ thống và ranh giới kiến trúc.
- `docs/user-stories.md`: luồng nghiệp vụ và acceptance criteria.

Một số quy tắc quan trọng:

- Không hard-code text UI trong component; dùng `src/constants/ui-text` hoặc cơ chế i18n.
- UI mới/chỉnh sửa phải khai báo màu cho cả light và dark mode.
- Component tương tác như dropdown, modal, dialog phải có trigger và state đầy đủ.
- Backend không trả entity trực tiếp; dùng DTO/mapper.
- Service ghi dữ liệu cần quản lý transaction rõ ràng.
- Không tạo file demo/example nếu không có yêu cầu.

## Lệnh Hữu Ích

Root:

```bash
docker compose up --build
docker compose down
```

Backend:

```bash
cd code/backend-layered
mvn test
mvn spring-boot:run
```

Frontend:

```bash
cd code/Next-frontend
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```

## Tài Liệu Nghiệp Vụ

- SRS: `docs/srs.md`
- User stories: `docs/user-stories.md`
- ERD: `docs/DB-erd.md`
- Convention: `docs/convention.md`
- UI/UX guideline: `docs/UI UX style guideline.md`
- Migration storage: `docs/migrate-minio-to-gcs.md`

## Ghi Chú Bảo Mật

Repository có cấu hình cho nhiều môi trường local/staging/deploy. Khi làm việc với thanh toán, email, Google OAuth, reCAPTCHA, database cloud hoặc storage cloud, hãy tạo secret riêng theo môi trường và xoay khóa nếu nghi ngờ bị lộ. README chỉ nên mô tả tên biến môi trường, không đưa giá trị secret thật vào tài liệu.
