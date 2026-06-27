# Hướng dẫn dành cho AI Agent của Library-Management

Bạn đang hỗ trợ dự án Library-Management. Trước khi thực hiện bất kỳ tác vụ nào, viết code, hoặc sửa đổi kiến trúc, bạn PHẢI đọc và tuân thủ nghiêm ngặt các hướng dẫn được cung cấp trong thư mục `docs/`.

## Tài liệu tham khảo cốt lõi

1. **Coding Conventions & Architecture (`docs/convention.md`)**
   - **Frontend (Next.js 16+)**: Tuân thủ nghiêm ngặt các quy tắc của App Router, hiểu rõ Server Components và Client Components, sử dụng Turbopack, xử lý routing chính xác, và tổ chức các component một cách gọn gàng vào thư mục `base/` hoặc `features/`.
   - **Backend (Spring Boot)**: Triển khai kiến trúc đa tầng (Controller, Service, Repository, Entity, DTO). Không bao giờ expose (để lộ) trực tiếp các Database Entities. Tuân thủ nghiêm ngặt các quy tắc đặt tên và quản lý transaction.

2. **UI/UX Design System (`docs/UI UX style guideline.md`)**
   - Áp dụng đúng các design tokens, màu sắc, typography (kiểu chữ), khoảng cách (spacing), và phong cách component.
   - Tất cả UI code ở frontend phải tuân thủ đúng theo hướng dẫn phong cách này.

3. **Database Design (`docs/DB-erd.md`)**
   - Luôn tham khảo Sơ đồ quan hệ thực thể (ERD) khi viết SQL, JPA Repositories, hoặc thiết kế các entity ở backend.
   - Đảm bảo các mối quan hệ (One-to-Many, Many-to-Many, v.v.) khớp với schema đã được tài liệu hóa.

4. **Software Requirements Specification (`docs/srs.md`)**
   - Sử dụng tài liệu SRS để hiểu các yêu cầu phi chức năng (non-functional requirements), các ràng buộc kỹ thuật, và đặc tả hệ thống trước khi đề xuất thay đổi kiến trúc.

5. **User Stories & Business Logic (`docs/user-stories.md`)**
   - Nắm vững các luồng công việc cụ thể (workflows), chân dung người dùng (user personas), và tiêu chí nghiệm thu (acceptance criteria).
   - Luôn đối chiếu logic code với user stories để đảm bảo đáp ứng đúng yêu cầu nghiệp vụ.

## Quy tắc hành động của Agent

- **Không tự bịa ra tiêu chuẩn:** Không đưa ra các quy tắc code mới xung đột với tài liệu `docs/convention.md`.
- **Giữ cho repository sạch sẽ:** Không tạo ra các file ví dụ (example) hoặc bản demo trừ khi được yêu cầu rõ ràng.
- **Luôn kiểm tra Context (Bối cảnh):** Khi có nghi ngờ về logic nghiệp vụ hoặc phong cách UI, hãy đọc tài liệu tương ứng trong thư mục `docs/` trước tiên.
- **Không sử dụng text cứng (hard text):** bạn phải tách text ra thành file text .ui hoặc sử dụng i18n.
- **Tạo file `.svg` và icon riêng biệt.**
- **Luôn tuân theo file `.agent`**
- **Đảm bảo tính tương tác (Interactive UI):** Khi sử dụng hoặc thêm các component UI như Dropdown, Modal, Dialog... PHẢI đảm bảo đã gắn sự kiện trigger (như `onClick`) và quản lý state tương ứng để component hoạt động. Tuyệt đối không import component mà không sử dụng (ghost import) hoặc thiếu logic trigger.

# Frontend Development Guidelines (Next-frontend)

- **Xử lí text tĩnh (Static Text):** Dùng i18n (tránh để text tĩnh trực tiếp trong component, hãy sử dụng thông qua file hằng số hoặc thư viện i18n).
- **Xử lí Form:** Recommend xử lí bằng tay (manual state) trước để hiểu rõ cách hoạt động của form. Sau đó, sử dụng **React Hook Form**.
- **Xử lí API:** Recommend dùng **Axios** hoặc **Fetch**.
- **Cấu trúc gọi API:** Cần viết các hàm xử lí request và response dùng chung (reusable wrapper/interceptor) để dễ quản lí và tái sử dụng.
- **Giao diện (UI):** Để các component đẹp và thống nhất, nên dùng chung 1 thư viện, ưu tiên sử dụng **shadcn/ui**.
