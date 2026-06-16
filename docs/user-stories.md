# USER STORIES — HỆ THỐNG QUẢN LÝ THƯ VIỆN TRỰC TUYẾN (LMS)

---

## **1. Tổng quan & Bối cảnh (Overview & Context)**

### **Vấn đề (Problem):**

Hiện tại, các thư viện truyền thống vẫn dựa hoàn toàn vào quy trình thủ công để vận hành: ghi chép sổ sách bằng tay, quản lý kho sách trên giấy/excel, xử lý phiếu mượn trả thủ công. Điều này dẫn đến nhiều vấn đề nghiêm trọng:

* **Quản lý kho sách thiếu chính xác:** Không kiểm soát được tồn kho theo thời gian thực, dễ xảy ra sai lệch giữa kho thực tế và dữ liệu ghi chép.
* **Trải nghiệm độc giả kém:** Người dùng phải đến trực tiếp thư viện để tra cứu, đăng ký mượn sách, không có kênh trực tuyến.
* **Quy trình mượn/trả sách rườm rà:** Thủ tục thủ công tốn thời gian, dễ bỏ sót, không kiểm soát được tình trạng quá hạn trả sách.
* **Thiếu công cụ tìm kiếm thông minh:** Tìm kiếm từ khóa truyền thống không hiểu ý định tự nhiên của người dùng, khó tìm sách phù hợp khi chỉ mô tả chung chung.
* **Không có cơ chế cá nhân hóa:** Không có hệ thống gợi ý sách dựa trên hành vi, sở thích đọc của từng cá nhân.
* **Báo cáo thống kê thủ công:** Tổng hợp doanh thu, tần suất mượn sách, xu hướng đọc đều phải làm thủ công, không có dữ liệu trực quan để hỗ trợ ra quyết định.

**Pain Points hiện tại:**

* Ghi chép sổ sách truyền thống dễ sai sót, mất thời gian, không đồng bộ
* Độc giả không biết sách còn hay hết nếu không đến trực tiếp thư viện
* Tranh chấp khi nhiều người cùng muốn mượn cuốn sách cuối cùng
* Tính tiền phạt quá hạn thủ công dễ sai và gây tranh cãi
* Không có kênh nhắc nhở tự động khi sách sắp/quá hạn trả
* Không có dữ liệu để phân tích xu hướng đọc, dự báo nhu cầu nhập sách
* Thiếu cơ chế phân quyền rõ ràng giữa các vai trò (Độc giả, Thủ thư, Admin)

### **Giá trị Nghiệp vụ (Business Value):**

1. **Số hóa toàn diện quy trình thư viện**: Thay thế ghi chép thủ công bằng hệ thống quản lý tập trung, tự động hóa phê duyệt phiếu mượn, tiếp nhận trả sách, tính tiền phạt.
2. **Nâng cao trải nghiệm độc giả**: Cung cấp giao diện tra cứu trực tuyến, tìm kiếm ngữ nghĩa bằng AI, gợi ý sách cá nhân hóa, trợ lý ảo chatbot hỗ trợ 24/7.
3. **Quản lý kho sách chính xác**: Theo dõi tồn kho thời gian thực, hỗ trợ quét ISBN/OCR khi nhập sách, quản lý vị trí kệ sách thực tế.
4. **Đảm bảo bảo mật và phân quyền**: Áp dụng JWT, RBAC, mã hóa dữ liệu nhạy cảm, ghi nhật ký hoạt động (audit logs), kiểm soát phiên đăng nhập.
5. **Hỗ trợ ra quyết định bằng dữ liệu**: Báo cáo thống kê trực quan về doanh thu, tần suất mượn sách, dự báo xu hướng đầu sách bằng AI.
6. **Tự động hóa thông báo**: Gửi email/SMS tự động xác nhận tài khoản, phiếu mượn, nhắc nhở sách sắp/quá hạn, giảm tải cho nhân viên.

### **Đối tượng (Actor):**

* **Khách vãng lai (Guest)**:
  * Tra cứu thông tin sách, tìm kiếm, xem trang chủ, đặt lịch hẹn đến thư viện.
  * Tra cứu trạng thái phiếu mượn bằng mã phiếu + SĐT.
  * Sử dụng Chatbot FAQ.

* **Độc giả (Customer)**:
  * Đặt mượn sách trực tuyến, thanh toán tiền cọc.
  * Quản lý danh sách yêu thích, lịch sử mượn sách.
  * Đánh giá, bình luận, tương tác AI Chatbot.
  * Nhận gợi ý sách cá nhân hóa, thông báo tự động.

* **Thủ thư / Nhân viên vận hành (Librarian/Staff)**:
  * Quản lý kho sách (CRUD), danh mục, tác giả, NXB, nhà cung cấp.
  * Phê duyệt phiếu mượn, xác nhận trả sách, tính tiền phạt.
  * Kiểm duyệt đánh giá/bình luận vi phạm.

* **Quản trị viên (Admin)**:
  * Quản lý tài khoản người dùng, phân quyền RBAC.
  * Cấu hình chính sách nghiệp vụ, cổng thanh toán, hệ thống.
  * Xem thống kê, báo cáo, audit logs, quản lý phiên đăng nhập.
  * Quản lý banner, nội dung CMS, hạng thành viên.

---
---

## **2. Danh sách User Stories**

---

### **US-01: Đăng ký tài khoản**

#### **User Story Statement**

Là một Khách vãng lai (Guest), tôi muốn đăng ký tài khoản bằng họ tên, email và mật khẩu để có thể sử dụng các tính năng mượn sách, đánh giá và nhận gợi ý cá nhân hóa.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Đăng ký tài khoản thành công**

1\. Khách vãng lai truy cập trang chủ hệ thống

2\. Click nút "Đăng ký" trên header/navbar

3\. Hệ thống hiển thị form đăng ký với các trường:

   \- Họ và tên (bắt buộc)

   \- Email (bắt buộc, định dạng email hợp lệ)

   \- Mật khẩu (bắt buộc, tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)

   \- Xác nhận mật khẩu (bắt buộc, phải trùng khớp)

4\. Người dùng điền thông tin và click "Đăng ký"

5\. Hệ thống validate:

   \- Các trường bắt buộc không được để trống

   \- Email đúng định dạng và chưa tồn tại trong hệ thống

   \- Mật khẩu đủ mạnh

   \- Xác nhận mật khẩu trùng khớp

6\. Nếu hợp lệ:

   \- Tạo tài khoản với role CUSTOMER, trạng thái INACTIVE (chờ xác thực)

   \- Gửi email chứa mã/link kích hoạt tài khoản

   \- Hiển thị thông báo: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản."

   \- Chuyển hướng về trang đăng nhập

7\. Nếu không hợp lệ:

   \- Hiển thị thông báo lỗi cụ thể dưới từng trường

   \- Giữ lại dữ liệu đã nhập (trừ mật khẩu)

**Luồng phụ: Xác thực email**

1\. Người dùng mở email và click link kích hoạt

2\. Hệ thống xác thực token:

   \- Nếu hợp lệ: chuyển trạng thái tài khoản sang ACTIVE, hiển thị "Kích hoạt tài khoản thành công"

   \- Nếu token hết hạn: hiển thị "Link kích hoạt đã hết hạn", cung cấp nút gửi lại email

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Đăng ký thành công**

**Given**: Khách vãng lai truy cập trang đăng ký
**When**: Nhập đầy đủ họ tên, email chưa tồn tại, mật khẩu đủ mạnh và xác nhận mật khẩu trùng khớp, sau đó click "Đăng ký"
**Then**:

* Tài khoản mới được tạo với role CUSTOMER
* Email xác thực được gửi đến địa chỉ email đã đăng ký
* Hiển thị thông báo thành công và hướng dẫn kiểm tra email

**AC-02: Đăng ký thất bại — Email đã tồn tại**

**Given**: Trong hệ thống đã có tài khoản với email "user@example.com"
**When**: Khách nhập email "user@example.com" và click "Đăng ký"
**Then**:

* Hiển thị lỗi "Email đã được sử dụng"
* Không tạo tài khoản mới
* Form giữ lại dữ liệu đã nhập

**AC-03: Đăng ký thất bại — Mật khẩu yếu**

**Given**: Khách vãng lai đang ở trang đăng ký
**When**: Nhập mật khẩu ít hơn 8 ký tự hoặc không bao gồm chữ hoa/chữ thường/số/ký tự đặc biệt
**Then**:

* Hiển thị lỗi "Mật khẩu phải có tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
* Form không được submit

**AC-04: Đăng ký thất bại — Thiếu trường bắt buộc**

**Given**: Khách vãng lai đang ở trang đăng ký
**When**: Bỏ trống một hoặc nhiều trường bắt buộc và click "Đăng ký"
**Then**:

* Hiển thị lỗi validation tương ứng cho từng trường:
  * "Họ và tên là bắt buộc"
  * "Email là bắt buộc"
  * "Mật khẩu là bắt buộc"
* Form không được submit

**AC-05: Xác thực email thành công**

**Given**: Tài khoản đã được tạo với trạng thái INACTIVE
**When**: Người dùng click link kích hoạt hợp lệ từ email
**Then**:

* Trạng thái tài khoản chuyển sang ACTIVE
* Hiển thị thông báo "Kích hoạt tài khoản thành công"
* Người dùng có thể đăng nhập

---

### **US-02: Đăng nhập hệ thống**

#### **User Story Statement**

Là một người dùng đã có tài khoản, tôi muốn đăng nhập bằng email và mật khẩu để truy cập các tính năng hệ thống phù hợp với vai trò của tôi.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Đăng nhập thành công**

1\. Người dùng truy cập trang đăng nhập

2\. Nhập email và mật khẩu

3\. Click "Đăng nhập"

4\. Hệ thống xác thực:

   \- Email tồn tại trong hệ thống

   \- Mật khẩu đúng

   \- Tài khoản đang ở trạng thái ACTIVE

5\. Nếu hợp lệ:

   \- Tạo session/JWT token

   \- Chuyển hướng về trang chủ hoặc dashboard tương ứng với role

   \- Ghi nhận audit log (user, thời gian, IP)

6\. Nếu không hợp lệ:

   \- Hiển thị thông báo "Email hoặc mật khẩu không đúng"

   \- Không tiết lộ email có tồn tại hay không (bảo mật)

**Luồng phụ: Quên mật khẩu**

1\. Người dùng click "Quên mật khẩu" tại trang đăng nhập

2\. Nhập email đã đăng ký

3\. Hệ thống gửi link reset mật khẩu qua email (có thời hạn)

4\. Người dùng click link, nhập mật khẩu mới và xác nhận

5\. Hệ thống cập nhật mật khẩu và thông báo thành công

**Luồng ngoại lệ: Tài khoản bị khóa do đăng nhập sai nhiều lần**

1\. Người dùng đăng nhập sai mật khẩu liên tiếp (>= 5 lần)

2\. Hệ thống tạm khóa tài khoản trong 15 phút

3\. Hiển thị thông báo: "Tài khoản đã bị tạm khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau 15 phút."

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Đăng nhập thành công**

**Given**: Người dùng có tài khoản ACTIVE
**When**: Nhập đúng email và mật khẩu, click "Đăng nhập"
**Then**:

* Hệ thống tạo JWT token
* Chuyển hướng về trang chủ/dashboard tương ứng role
* Ghi nhận audit log

**AC-02: Đăng nhập thất bại — Sai thông tin**

**Given**: Người dùng nhập sai email hoặc mật khẩu
**When**: Click "Đăng nhập"
**Then**:

* Hiển thị "Email hoặc mật khẩu không đúng"
* Không tạo session

**AC-03: Chặn đăng nhập — Đăng nhập sai nhiều lần**

**Given**: Người dùng đăng nhập sai >= 5 lần liên tiếp
**When**: Thử đăng nhập lần thứ 6
**Then**:

* Tài khoản bị tạm khóa 15 phút
* Hiển thị thông báo tạm khóa

**AC-04: Quên mật khẩu**

**Given**: Người dùng có tài khoản đã đăng ký
**When**: Nhập email vào form "Quên mật khẩu" và submit
**Then**:

* Email chứa link reset mật khẩu được gửi
* Link có thời hạn sử dụng
* Sau khi đặt lại mật khẩu, người dùng có thể đăng nhập bằng mật khẩu mới

---

### **US-03: Xem trang chủ**

#### **User Story Statement**

Là một người dùng (Guest hoặc Customer), tôi muốn xem trang chủ để nắm bắt danh mục sách phổ biến, sách mới nhập và các thông tin ưu đãi/tin tức từ thư viện.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem trang chủ**

1\. Người dùng truy cập URL gốc của hệ thống

2\. Hệ thống hiển thị trang chủ gồm:

   \- Banner quảng cáo/ưu đãi (carousel)

   \- Danh sách sách phổ biến (lượt mượn nhiều nhất)

   \- Sách mới nhập kho

   \- Gợi ý sách cá nhân hóa bởi AI (nếu đã đăng nhập)

   \- Tin tức/sự kiện thư viện

3\. Mỗi đầu sách hiển thị: ảnh bìa, tên sách, tác giả, đánh giá trung bình

4\. Người dùng có thể click vào sách để xem chi tiết

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị trang chủ đầy đủ**

**Given**: Người dùng (Guest hoặc Customer) truy cập trang chủ
**When**: Trang tải xong
**Then**:

* Hiển thị banner quảng cáo
* Hiển thị danh sách sách phổ biến (tối thiểu 4 đầu sách)
* Hiển thị danh sách sách mới nhập
* Mỗi sách hiển thị: ảnh bìa, tên sách, tác giả, rating

**AC-02: Gợi ý cá nhân hóa cho Customer**

**Given**: Customer đã đăng nhập và có lịch sử mượn sách
**When**: Truy cập trang chủ
**Then**:

* Hiển thị section "Gợi ý cho bạn" với danh sách sách do AI Recommendation đề xuất

**AC-03: Performance trang chủ**

**Given**: Hệ thống có dữ liệu sách
**When**: Người dùng truy cập trang chủ
**Then**:

* Trang tải xong trong vòng 2 giây
* Banner và ảnh bìa sách tải không bị lỗi

---

### **US-04: Xem danh sách sách và Tìm kiếm**

#### **User Story Statement**

Là một người dùng, tôi muốn xem danh sách sách với khả năng lọc, sắp xếp, phân trang và tìm kiếm thông minh bằng ngôn ngữ tự nhiên (AI Semantic Search) để nhanh chóng tìm được cuốn sách phù hợp.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem danh sách sách**

1\. Người dùng điều hướng đến trang "Danh sách sách"

2\. Hệ thống hiển thị danh sách sách với các thông tin:

   \- Ảnh bìa

   \- Tên sách

   \- Tác giả

   \- Nhà xuất bản

   \- Thể loại

   \- Giá bán / Giá đặt cọc

   \- Tình trạng kho (Còn/Hết)

   \- Đánh giá trung bình

3\. Người dùng có thể:

   \- Tìm kiếm bằng ô tìm kiếm (từ khóa hoặc ngôn ngữ tự nhiên)

   \- Lọc theo: thể loại, tác giả, nhà xuất bản, khoảng giá, tình trạng kho

   \- Sắp xếp theo: giá (tăng/giảm), ngày xuất bản (mới nhất/cũ nhất), đánh giá

   \- Phân trang: mặc định 12 sách/trang, có lựa chọn 12/24/48

**Luồng phụ: Tìm kiếm bằng AI Semantic Search**

1\. Người dùng nhập mô tả ngôn ngữ tự nhiên vào ô tìm kiếm (VD: "sách về lập trình web cho người mới bắt đầu")

2\. Hệ thống gửi query đến AI API (Vector Embeddings)

3\. Trả về kết quả sách phù hợp ý định, không nhất thiết khớp chính xác từ khóa

4\. Nếu API AI gặp lỗi: tự động fallback về tìm kiếm SQL Like, hiển thị thông báo nhỏ "Đang sử dụng tìm kiếm cơ bản"

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị danh sách sách**

**Given**: Hệ thống có dữ liệu sách
**When**: Người dùng truy cập trang danh sách sách
**Then**:

* Danh sách sách hiển thị với ảnh bìa, tên sách, tác giả, giá, tình trạng kho, rating
* Có phân trang (mặc định 12 sách/trang)
* Có thanh tìm kiếm, bộ lọc và sắp xếp

**AC-02: Tìm kiếm AI Semantic Search thành công**

**Given**: API AI đang hoạt động bình thường
**When**: Người dùng nhập "cuốn sách dạy nấu ăn cho gia đình" và submit
**Then**:

* Hệ thống trả về các sách liên quan đến chủ đề nấu ăn gia đình
* Kết quả không nhất thiết chứa chính xác từ khóa nhưng phù hợp ngữ nghĩa

**AC-03: Fallback khi API AI lỗi**

**Given**: API AI (OpenAI/Gemini) gặp lỗi hoặc timeout
**When**: Người dùng thực hiện tìm kiếm
**Then**:

* Hệ thống tự động chuyển sang tìm kiếm SQL Like
* Kết quả vẫn được trả về
* Hiển thị thông báo nhỏ "Đang sử dụng tìm kiếm cơ bản"

**AC-04: Lọc sách theo đa tiêu chí**

**Given**: Có sách thuộc nhiều thể loại, tác giả, khoảng giá khác nhau
**When**: Người dùng chọn thể loại "Công nghệ thông tin" + khoảng giá "50.000 - 150.000 VND"
**Then**:

* Danh sách chỉ hiển thị sách thỏa mãn cả hai điều kiện
* Số lượng kết quả được cập nhật

**AC-05: Phân trang danh sách sách**

**Given**: Có hơn 12 đầu sách
**When**: Người dùng truy cập trang danh sách sách
**Then**:

* Mặc định hiển thị 12 sách đầu tiên
* Có điều khiển phân trang (next/prev)
* Có tùy chọn số sách/trang: 12, 24, 48
* Hiển thị "Hiển thị X–Y của Z sách"

---

### **US-05: Xem chi tiết sách**

#### **User Story Statement**

Là một người dùng, tôi muốn xem chi tiết một cuốn sách (mô tả, tác giả, NXB, giá, tình trạng kho, đánh giá) để quyết định có mượn sách hay không.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem chi tiết sách**

1\. Người dùng click vào một cuốn sách từ danh sách sách hoặc trang chủ

2\. Hệ thống hiển thị trang chi tiết sách với:

   \- Ảnh bìa sách (lớn)

   \- Tên sách, tác giả, nhà xuất bản, năm xuất bản

   \- Thể loại

   \- Mô tả nội dung

   \- Giá bán / Giá đặt cọc

   \- Tình trạng kho (Còn X cuốn / Hết hàng)

   \- Vị trí kệ sách (nếu có)

   \- Đánh giá trung bình + số lượng đánh giá

   \- Danh sách đánh giá/bình luận từ độc giả

   \- Gợi ý sách tương tự (AI Recommendation)

3\. Nếu là Customer đã đăng nhập:

   \- Hiển thị nút "Mượn sách"

   \- Hiển thị nút "Thêm vào yêu thích" (❤)

   \- Hiển thị form đánh giá/bình luận (nếu đã hoàn tất giao dịch mượn trước đó)

4\. Nếu là Guest:

   \- Nút "Mượn sách" yêu cầu đăng nhập trước

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị chi tiết sách đầy đủ**

**Given**: Sách tồn tại trong hệ thống
**When**: Người dùng click vào sách từ danh sách
**Then**:

* Hiển thị đầy đủ: ảnh bìa, tên, tác giả, NXB, mô tả, giá, tình trạng kho, đánh giá
* Hiển thị danh sách gợi ý sách tương tự

**AC-02: Hiển thị tình trạng kho chính xác**

**Given**: Sách có 3 bản sao trong kho, 2 đang được mượn
**When**: Xem chi tiết sách
**Then**:

* Hiển thị "Còn 1 cuốn" với trạng thái "Còn hàng"

**AC-03: Guest không thể mượn sách**

**Given**: Khách vãng lai xem chi tiết sách
**When**: Click nút "Mượn sách"
**Then**:

* Chuyển hướng đến trang đăng nhập hoặc hiển thị popup yêu cầu đăng nhập

---

### **US-06: Đặt mượn sách**

#### **User Story Statement**

Là một Độc giả (Customer), tôi muốn đặt mượn sách trực tuyến (chọn sách, chọn ngày đến lấy và ngày trả) để có thể mượn sách mà không cần đến thư viện để đăng ký thủ công.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Đặt mượn sách thành công**

1\. Customer đăng nhập và tìm sách muốn mượn

2\. Click "Mượn sách" tại trang chi tiết sách

3\. Hệ thống kiểm tra tình trạng kho:

   \- Nếu còn sách: hiển thị form đặt mượn

   \- Nếu hết sách: hiển thị "Sách hiện không có sẵn", gợi ý "Đặt giữ chỗ"

4\. Form đặt mượn gồm:

   \- Tên sách (read-only)

   \- Ngày đến lấy sách (bắt buộc, >= ngày hiện tại + 1)

   \- Ngày hoàn trả dự kiến (bắt buộc, <= ngày lấy + số ngày mượn tối đa theo cấu hình)

   \- Phương thức thanh toán tiền cọc: Tiền mặt khi nhận / Ví điện tử (MoMo, VNPay)

5\. Customer điền thông tin và click "Xác nhận mượn"

6\. Hệ thống validate:

   \- Sách vẫn còn trong kho (kiểm tra lại lần cuối, tránh race condition)

   \- Ngày hợp lệ

   \- Customer không vượt quá số sách mượn đồng thời tối đa

7\. Nếu hợp lệ:

   \- Tạo phiếu mượn với trạng thái "Chờ duyệt"

   \- Giảm số lượng sách available trong kho (tạm giữ)

   \- Nếu thanh toán online: chuyển đến cổng thanh toán

   \- Gửi email xác nhận phiếu mượn

   \- Hiển thị thông báo "Đặt mượn sách thành công! Phiếu mượn đang chờ phê duyệt."

**Luồng ngoại lệ: Tranh chấp tài nguyên**

1\. Hai Customer cùng mượn cuốn sách cuối cùng

2\. Hệ thống sử dụng cơ chế lock (Optimistic/Pessimistic locking):

   \- Customer submit trước được ưu tiên

   \- Customer submit sau nhận thông báo "Sách vừa được người khác mượn. Bạn có muốn đặt giữ chỗ?"

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Đặt mượn sách thành công**

**Given**: Customer đăng nhập và sách còn trong kho
**When**: Chọn sách, nhập ngày lấy/trả hợp lệ, chọn phương thức thanh toán và click "Xác nhận mượn"
**Then**:

* Phiếu mượn được tạo với trạng thái "Chờ duyệt"
* Tồn kho giảm tương ứng (tạm giữ)
* Email xác nhận được gửi đến Customer
* Hiển thị thông báo thành công

**AC-02: Không cho mượn khi hết sách**

**Given**: Sách có 0 bản sao available
**When**: Customer click "Mượn sách"
**Then**:

* Hiển thị thông báo "Sách hiện không có sẵn"
* Hiển thị nút "Đặt giữ chỗ" (reservation)

**AC-03: Giới hạn số sách mượn đồng thời**

**Given**: Customer đang mượn số sách bằng giới hạn tối đa (theo cấu hình Admin)
**When**: Thử mượn thêm sách
**Then**:

* Hiển thị thông báo "Bạn đã đạt giới hạn mượn sách đồng thời. Vui lòng trả sách trước khi mượn thêm."

**AC-04: Xử lý tranh chấp cuốn sách cuối cùng**

**Given**: Sách chỉ còn 1 bản, 2 Customer cùng đặt mượn gần như đồng thời
**When**: Cả hai submit yêu cầu
**Then**:

* Customer submit trước thành công
* Customer submit sau nhận thông báo "Sách vừa hết" và được gợi ý đặt giữ chỗ

**AC-05: Thanh toán tiền cọc online**

**Given**: Customer chọn thanh toán bằng ví điện tử
**When**: Xác nhận đặt mượn
**Then**:

* Chuyển đến trang thanh toán của cổng (MoMo/VNPay)
* Sau khi thanh toán thành công: phiếu mượn chuyển sang "Chờ duyệt"
* Nếu thanh toán thất bại: phiếu mượn không được tạo, tồn kho khôi phục

---

### **US-07: Hủy phiếu mượn**

#### **User Story Statement**

Là một Độc giả, tôi muốn hủy phiếu mượn sách đang ở trạng thái "Chờ duyệt" hoặc "Chờ lấy sách" để có thể thay đổi kế hoạch mượn sách.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Hủy phiếu mượn**

1\. Customer truy cập trang "Lịch sử mượn sách"

2\. Tìm phiếu mượn muốn hủy (trạng thái "Chờ duyệt" hoặc "Chờ lấy sách")

3\. Click nút "Hủy phiếu mượn"

4\. Hệ thống hiển thị dialog xác nhận: "Bạn có chắc chắn muốn hủy phiếu mượn này?"

5\. Customer click "Xác nhận"

6\. Hệ thống:

   \- Chuyển trạng thái phiếu mượn sang "Đã hủy"

   \- Hoàn lại tồn kho cho sách tương ứng

   \- Nếu đã thanh toán cọc: tạo yêu cầu hoàn tiền

   \- Gửi email xác nhận hủy

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hủy phiếu mượn thành công**

**Given**: Customer có phiếu mượn ở trạng thái "Chờ duyệt"
**When**: Click "Hủy phiếu mượn" và xác nhận
**Then**:

* Trạng thái phiếu chuyển sang "Đã hủy"
* Tồn kho sách tăng lại
* Email xác nhận hủy được gửi

**AC-02: Không hủy được phiếu đang mượn**

**Given**: Phiếu mượn ở trạng thái "Đang mượn"
**When**: Customer thử hủy
**Then**:

* Không hiển thị nút "Hủy phiếu mượn"
* Hoặc hiển thị thông báo "Không thể hủy phiếu mượn khi sách đang được mượn"

---

### **US-08: Gia hạn phiếu mượn**

#### **User Story Statement**

Là một Độc giả, tôi muốn yêu cầu gia hạn phiếu mượn sách nếu sách không bị người khác đặt giữ, để có thêm thời gian đọc sách.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Gia hạn phiếu mượn**

1\. Customer truy cập trang "Lịch sử mượn sách"

2\. Tìm phiếu mượn ở trạng thái "Đang mượn" và chưa quá hạn

3\. Click "Gia hạn"

4\. Hệ thống kiểm tra:

   \- Sách không bị người khác đặt giữ (reservation)

   \- Phiếu mượn chưa bị gia hạn quá số lần cho phép (theo cấu hình)

5\. Nếu hợp lệ:

   \- Tạo yêu cầu gia hạn, gửi đến Thủ thư để duyệt

   \- Trạng thái phiếu chuyển sang "Chờ duyệt gia hạn"

6\. Thủ thư duyệt → ngày trả dự kiến được cập nhật

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Gia hạn thành công**

**Given**: Phiếu mượn đang ở trạng thái "Đang mượn" và sách không bị đặt giữ
**When**: Customer click "Gia hạn" và Thủ thư duyệt
**Then**:

* Ngày trả dự kiến được cập nhật (thêm N ngày theo cấu hình)
* Hiển thị thông báo "Gia hạn thành công"

**AC-02: Không cho gia hạn khi sách bị đặt giữ**

**Given**: Sách đang có người khác đặt giữ chỗ (reservation)
**When**: Customer thử gia hạn
**Then**:

* Hiển thị thông báo "Không thể gia hạn vì sách đang có người đặt giữ"

---

### **US-09: Đặt giữ chỗ sách (Reservation)**

#### **User Story Statement**

Là một Độc giả, tôi muốn đặt giữ chỗ sách khi sách đang hết để nhận thông báo khi sách có sẵn và được ưu tiên mượn.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Đặt giữ chỗ sách**

1\. Customer xem chi tiết sách, thấy tình trạng "Hết hàng"

2\. Click "Đặt giữ chỗ"

3\. Hệ thống tạo bản ghi reservation trong hàng đợi

4\. Khi sách được trả hoặc nhập kho mới:

   \- Hệ thống kiểm tra hàng đợi reservation (FIFO)

   \- Gửi thông báo cho Customer đầu hàng đợi: "Sách [Tên sách] đã có sẵn!"

   \- Customer có thời hạn X ngày để đến lấy trước khi mất ưu tiên

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Đặt giữ chỗ thành công**

**Given**: Sách đang hết
**When**: Customer click "Đặt giữ chỗ"
**Then**:

* Bản ghi reservation được tạo
* Hiển thị thông báo "Đặt giữ chỗ thành công. Bạn sẽ được thông báo khi sách có sẵn."
* Hiển thị vị trí trong hàng đợi

**AC-02: Thông báo khi sách có sẵn**

**Given**: Customer đã đặt giữ chỗ và sách vừa được trả
**When**: Sách trở lại kho
**Then**:

* Gửi email/SMS thông báo đến Customer đầu hàng đợi
* Customer có thời hạn nhận sách theo cấu hình

---

### **US-10: Quản lý danh sách yêu thích**

#### **User Story Statement**

Là một Độc giả, tôi muốn thêm/xóa sách vào danh sách yêu thích để lưu lại những cuốn sách quan tâm và dễ dàng tìm lại.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Thêm sách vào yêu thích**

1\. Customer xem chi tiết sách hoặc tại danh sách sách

2\. Click biểu tượng ❤ (trái tim) trên sách

3\. Sách được thêm vào danh sách yêu thích

4\. Biểu tượng ❤ chuyển sang trạng thái đã chọn (filled)

**Luồng phụ: Xóa sách khỏi yêu thích**

1\. Customer click biểu tượng ❤ đã filled trên sách

2\. Hoặc vào trang "Danh sách yêu thích" và click "Xóa"

3\. Sách bị xóa khỏi danh sách yêu thích

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Thêm sách vào yêu thích**

**Given**: Customer đã đăng nhập
**When**: Click ❤ trên một cuốn sách
**Then**:

* Sách được thêm vào danh sách yêu thích
* Biểu tượng ❤ chuyển sang trạng thái filled
* Hiển thị animation nhỏ xác nhận

**AC-02: Xóa sách khỏi yêu thích**

**Given**: Customer có sách trong danh sách yêu thích
**When**: Click ❤ lần nữa hoặc click "Xóa" trong trang yêu thích
**Then**:

* Sách bị xóa khỏi danh sách yêu thích
* Biểu tượng ❤ trở về trạng thái outline

---

### **US-11: Xem lịch sử mượn sách**

#### **User Story Statement**

Là một Độc giả, tôi muốn xem lịch sử mượn sách (lọc theo trạng thái, thời gian) để theo dõi các phiếu mượn đang mượn, đã trả và quá hạn.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem lịch sử mượn sách**

1\. Customer đăng nhập và điều hướng đến "Lịch sử mượn sách"

2\. Hệ thống hiển thị danh sách phiếu mượn với:

   \- Tên sách, ảnh bìa

   \- Ngày mượn, ngày trả dự kiến, ngày trả thực tế (nếu đã trả)

   \- Trạng thái: Chờ duyệt / Chờ lấy / Đang mượn / Đã trả / Quá hạn / Đã hủy

   \- Tiền cọc / Tiền phạt (nếu có)

3\. Customer có thể lọc theo:

   \- Trạng thái (đang mượn, đã trả, quá hạn)

   \- Khoảng thời gian

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị lịch sử mượn sách**

**Given**: Customer có lịch sử mượn sách
**When**: Truy cập "Lịch sử mượn sách"
**Then**:

* Danh sách phiếu mượn hiển thị đầy đủ thông tin
* Có lọc theo trạng thái và thời gian
* Phiếu quá hạn được highlight bằng màu đỏ/cam

**AC-02: Lịch sử trống**

**Given**: Customer chưa mượn sách bao giờ
**When**: Truy cập "Lịch sử mượn sách"
**Then**:

* Hiển thị thông báo "Bạn chưa có lịch sử mượn sách" với link đến trang danh sách sách

---

### **US-12: Đánh giá và bình luận sách**

#### **User Story Statement**

Là một Độc giả đã hoàn tất mượn sách, tôi muốn thêm đánh giá (rating 1-5 sao) và bình luận cho cuốn sách đó để chia sẻ trải nghiệm với cộng đồng.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Thêm đánh giá**

1\. Customer truy cập trang chi tiết sách đã mượn và trả xong

2\. Hệ thống hiển thị form đánh giá:

   \- Rating: 1-5 sao (bắt buộc)

   \- Bình luận: text (tùy chọn)

3\. Customer chọn số sao, viết bình luận và click "Gửi đánh giá"

4\. Hệ thống lưu đánh giá, cập nhật rating trung bình của sách

5\. Đánh giá hiển thị trong trang chi tiết sách

**Luồng phụ: Xóa đánh giá**

1\. Customer vào trang chi tiết sách có đánh giá của mình

2\. Click "Xóa" trên đánh giá

3\. Xác nhận xóa → đánh giá bị xóa, rating trung bình cập nhật lại

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Thêm đánh giá thành công**

**Given**: Customer đã hoàn tất mượn và trả sách
**When**: Chọn rating + viết bình luận và click "Gửi"
**Then**:

* Đánh giá được lưu
* Rating trung bình của sách được cập nhật
* Đánh giá hiển thị trong trang chi tiết sách

**AC-02: Không đánh giá khi chưa mượn**

**Given**: Customer chưa từng mượn cuốn sách này
**When**: Truy cập trang chi tiết sách
**Then**:

* Form đánh giá không hiển thị
* Hoặc hiển thị thông báo "Bạn cần mượn sách trước khi đánh giá"

---

### **US-13: Tương tác AI Chatbot**

#### **User Story Statement**

Là một Độc giả, tôi muốn tương tác với AI Chatbot để được tóm tắt nội dung sách, tư vấn sách phù hợp và gợi ý lộ trình đọc theo sở thích cá nhân.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Tương tác Chatbot**

1\. Người dùng click biểu tượng chatbot (góc dưới phải)

2\. Khung chat mở lên, hiển thị lời chào

3\. Người dùng nhập câu hỏi/yêu cầu (VD: "Tóm tắt cuốn Sapiens", "Gợi ý sách về AI")

4\. Chatbot xử lý bằng AI (OpenAI/Gemini) và trả lời theo thời gian thực (streaming)

5\. Nếu API AI gặp lỗi: fallback về câu trả lời FAQ có sẵn

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Chatbot phản hồi thành công**

**Given**: API AI đang hoạt động
**When**: Người dùng gửi câu hỏi "Tóm tắt cuốn Đắc Nhân Tâm"
**Then**:

* Chatbot phản hồi nội dung tóm tắt sách trong vòng 5 giây
* Phản hồi hiển thị theo kiểu streaming (typewriter effect)

**AC-02: Guest sử dụng chatbot FAQ**

**Given**: Khách vãng lai chưa đăng nhập
**When**: Hỏi "Chính sách mượn sách như thế nào?"
**Then**:

* Chatbot trả lời dựa trên FAQ có sẵn
* Không yêu cầu đăng nhập cho câu hỏi FAQ

---

### **US-14: Cập nhật hồ sơ cá nhân và Đổi mật khẩu**

#### **User Story Statement**

Là một Độc giả, tôi muốn cập nhật hồ sơ cá nhân (ảnh đại diện, ngày sinh, SĐT, giới tính) và đổi mật khẩu để đảm bảo thông tin luôn chính xác và tài khoản được bảo mật.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Cập nhật hồ sơ**

1\. Customer truy cập trang "Hồ sơ cá nhân"

2\. Hệ thống hiển thị thông tin hiện tại:

   \- Ảnh đại diện

   \- Họ và tên

   \- Email (read-only)

   \- Ngày sinh, giới tính, SĐT

3\. Customer chỉnh sửa thông tin và click "Lưu"

4\. Hệ thống validate và cập nhật

**Luồng phụ: Đổi mật khẩu**

1\. Customer click "Đổi mật khẩu"

2\. Nhập mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu mới

3\. Hệ thống validate:

   \- Mật khẩu hiện tại đúng

   \- Mật khẩu mới đủ mạnh

   \- Mật khẩu mới khác mật khẩu cũ

4\. Cập nhật mật khẩu thành công

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Cập nhật hồ sơ thành công**

**Given**: Customer đã đăng nhập
**When**: Thay đổi SĐT và click "Lưu"
**Then**:

* Thông tin được cập nhật
* Hiển thị thông báo "Cập nhật hồ sơ thành công"

**AC-02: Đổi mật khẩu thành công**

**Given**: Customer nhập đúng mật khẩu hiện tại
**When**: Nhập mật khẩu mới hợp lệ và xác nhận
**Then**:

* Mật khẩu được cập nhật
* Session hiện tại được giữ, các session khác bị hủy (optional)

---

### **US-15: Nhận thông báo tự động**

#### **User Story Statement**

Là một Độc giả, tôi muốn nhận thông báo qua Email/SMS khi có sự kiện quan trọng (xác nhận tài khoản, phê duyệt phiếu mượn, sách sắp quá hạn) để nắm rõ trạng thái giao dịch.

#### **Luồng Người dùng (User Flow)**

**Các sự kiện trigger thông báo:**

1\. Đăng ký tài khoản → Email kích hoạt

2\. Đặt mượn sách → Email xác nhận phiếu mượn

3\. Phiếu mượn được duyệt/từ chối → Email kết quả

4\. Sách sắp đến hạn trả (trước 2 ngày) → Email/SMS nhắc nhở

5\. Sách quá hạn → Email/SMS cảnh báo + thông tin tiền phạt

6\. Sách đặt giữ có sẵn → Email thông báo

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Nhắc nhở sách sắp quá hạn**

**Given**: Phiếu mượn còn 2 ngày nữa đến hạn trả
**When**: Hệ thống chạy job nhắc nhở
**Then**:

* Email/SMS được gửi đến Customer
* Nội dung email bao gồm: tên sách, ngày trả dự kiến, hướng dẫn gia hạn

**AC-02: Retry khi gửi email thất bại**

**Given**: Email service gặp lỗi tạm thời
**When**: Hệ thống thử gửi email
**Then**:

* Retry tối đa 3 lần với exponential backoff
* Ghi log nếu vẫn thất bại

---

### **US-16: Đặt lịch hẹn đến thư viện (Guest)**

#### **User Story Statement**

Là một Khách vãng lai, tôi muốn đặt lịch hẹn đến thư viện (nhập họ tên, SĐT, email) để đọc sách hoặc mượn sách tại chỗ mà không cần đăng ký tài khoản.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Đặt lịch hẹn**

1\. Guest truy cập trang "Đặt lịch hẹn"

2\. Nhập thông tin: Họ tên, SĐT, Email, Ngày/giờ muốn đến, Mục đích (mượn sách/đọc tại chỗ)

3\. Click "Đặt lịch"

4\. Hệ thống ghi nhận và gửi email/SMS xác nhận

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Đặt lịch thành công**

**Given**: Guest nhập đầy đủ thông tin hợp lệ
**When**: Click "Đặt lịch"
**Then**:

* Lịch hẹn được ghi nhận
* Email/SMS xác nhận được gửi
* Hiển thị mã lịch hẹn để tra cứu

---

### **US-17: Tra cứu phiếu mượn sách nhanh (Guest)**

#### **User Story Statement**

Là một người dùng, tôi muốn tra cứu nhanh trạng thái phiếu mượn bằng mã phiếu + SĐT mà không cần đăng nhập.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Tra cứu phiếu mượn**

1\. Người dùng truy cập trang "Tra cứu phiếu mượn"

2\. Nhập mã phiếu mượn + SĐT đăng ký

3\. Click "Tra cứu"

4\. Hệ thống hiển thị thông tin phiếu mượn: tên sách, trạng thái, ngày mượn, ngày trả dự kiến, tiền cọc/phạt

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Tra cứu thành công**

**Given**: Phiếu mượn tồn tại
**When**: Nhập đúng mã phiếu + SĐT
**Then**:

* Hiển thị thông tin phiếu mượn

**AC-02: Tra cứu thất bại**

**Given**: Mã phiếu hoặc SĐT không khớp
**When**: Nhập sai thông tin
**Then**:

* Hiển thị "Không tìm thấy phiếu mượn. Vui lòng kiểm tra lại thông tin."

---

### **US-18: Quản lý kho sách (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn quản lý kho sách (CRUD sách, danh mục, tác giả, NXB, nhà cung cấp) với hỗ trợ quét ISBN/OCR để giảm thao tác thủ công và đảm bảo tồn kho chính xác.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Quản lý danh sách sách**

1\. Staff đăng nhập và truy cập "Quản lý kho sách"

2\. Hệ thống hiển thị danh sách sách với:

   \- Ảnh bìa, tên sách, tác giả, thể loại

   \- Số lượng tồn kho, số lượng đang cho mượn

   \- Vị trí kệ sách

   \- Trạng thái (active/deleted)

3\. Staff có thể tìm kiếm, sắp xếp theo tồn kho, thể loại

4\. Các hành động: Thêm mới, Chỉnh sửa, Xóa mềm

**Luồng: Thêm mới sách**

1\. Staff click "Thêm sách mới"

2\. Hệ thống hiển thị form:

   \- Tên sách (bắt buộc)

   \- Tác giả (bắt buộc, chọn từ danh sách hoặc thêm mới)

   \- Thể loại (bắt buộc)

   \- Nhà xuất bản

   \- ISBN

   \- Mô tả nội dung

   \- Giá bán / Giá đặt cọc

   \- Số lượng nhập

   \- Vị trí kệ sách

   \- Ảnh bìa (upload lên Cloudinary/S3)

3\. Hỗ trợ quét mã vạch ISBN → auto-fill thông tin sách

4\. Hỗ trợ OCR ảnh bìa → tự động nhận diện tên sách, tác giả

5\. Staff click "Lưu" → tạo sách mới

**Luồng: Xóa mềm sách**

1\. Staff click "Xóa" trên một sách

2\. Dialog xác nhận: "Sách sẽ bị ẩn khỏi giao diện người dùng nhưng dữ liệu được giữ lại"

3\. Xác nhận → sách bị soft-delete, không hiển thị cho Customer/Guest nhưng dữ liệu lịch sử vẫn giữ nguyên

**Luồng: Quản lý Danh mục / Tác giả / NXB / Nhà cung cấp**

1\. Staff truy cập các trang quản lý tương ứng

2\. CRUD thông tin: Thêm, Sửa, Xóa (mềm nếu có liên kết dữ liệu)

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Thêm sách mới thành công**

**Given**: Staff đang ở trang quản lý kho sách
**When**: Nhập đầy đủ thông tin hợp lệ và click "Lưu"
**Then**:

* Sách mới được tạo trong hệ thống
* Số lượng tồn kho được cập nhật
* Sách hiển thị trên giao diện người dùng

**AC-02: Quét ISBN auto-fill**

**Given**: Staff quét mã vạch ISBN của sách
**When**: Hệ thống nhận diện mã vạch
**Then**:

* Tự động điền các trường: tên sách, tác giả, NXB, năm XB
* Staff có thể chỉnh sửa trước khi lưu

**AC-03: Xóa mềm sách**

**Given**: Sách đang active và không có phiếu mượn "Đang mượn"
**When**: Staff xóa mềm sách
**Then**:

* Sách bị ẩn khỏi giao diện người dùng
* Dữ liệu lịch sử (phiếu mượn cũ, hóa đơn) vẫn giữ nguyên
* Tồn kho không bao gồm sách đã xóa mềm

**AC-04: Ràng buộc dữ liệu khi xóa danh mục**

**Given**: Danh mục "Công nghệ thông tin" có 50 sách đang sử dụng
**When**: Staff thử xóa danh mục
**Then**:

* Hiển thị cảnh báo "Danh mục đang có 50 sách liên kết. Không thể xóa."

---

### **US-19: Quản lý nhập kho sách (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn tạo phiếu nhập kho khi nhập sách từ nhà cung cấp để cập nhật tồn kho chính xác và lưu lịch sử nhập kho.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Tạo phiếu nhập kho**

1\. Staff truy cập "Quản lý nhập kho"

2\. Click "Tạo phiếu nhập kho"

3\. Chọn nhà cung cấp, thêm danh sách sách nhập (sách, số lượng, giá nhập)

4\. Click "Lưu"

5\. Hệ thống tạo phiếu nhập và tự động cập nhật tồn kho cho các sách tương ứng

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Tạo phiếu nhập kho thành công**

**Given**: Staff đang tạo phiếu nhập kho
**When**: Chọn nhà cung cấp, thêm danh sách sách + số lượng và click "Lưu"
**Then**:

* Phiếu nhập được tạo với mã phiếu duy nhất
* Tồn kho các sách tương ứng tăng đúng số lượng nhập
* Phiếu nhập hiển thị trong lịch sử nhập kho

---

### **US-20: Phê duyệt và quản lý phiếu mượn (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn phê duyệt/từ chối phiếu mượn, cập nhật trạng thái phiếu mượn, xác nhận trả sách và tự động tính tiền phạt quá hạn để vận hành quy trình mượn/trả sách trơn tru.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Phê duyệt phiếu mượn**

1\. Staff truy cập "Quản lý phiếu mượn"

2\. Hệ thống hiển thị danh sách phiếu mượn với:

   \- Mã phiếu, tên Customer, tên sách, ngày mượn, ngày trả dự kiến

   \- Trạng thái: Chờ duyệt / Chờ lấy / Đang mượn / Đã trả / Quá hạn / Đã hủy

3\. Staff xem chi tiết phiếu và click "Phê duyệt" hoặc "Từ chối"

4\. Nếu phê duyệt: trạng thái chuyển "Chờ lấy sách", gửi email thông báo Customer

5\. Nếu từ chối: nhập lý do, trạng thái chuyển "Đã từ chối", hoàn lại tồn kho

**Luồng: Xác nhận trả sách**

1\. Customer đến trả sách

2\. Staff tìm phiếu mượn, click "Xác nhận trả sách"

3\. Ghi nhận tình trạng sách (nguyên vẹn/hư hỏng)

4\. Hệ thống:

   \- Chuyển trạng thái phiếu sang "Đã trả"

   \- Cập nhật tồn kho (tăng lại)

   \- Nếu trả quá hạn: tự động tính tiền phạt = (số ngày quá hạn) × (mức phạt/ngày theo cấu hình)

   \- Gửi email xác nhận + hóa đơn tiền phạt (nếu có)

**Luồng: Duyệt yêu cầu gia hạn**

1\. Staff xem danh sách yêu cầu gia hạn

2\. Kiểm tra điều kiện (sách không bị đặt giữ)

3\. Phê duyệt/Từ chối → cập nhật ngày trả

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Phê duyệt phiếu mượn thành công**

**Given**: Có phiếu mượn ở trạng thái "Chờ duyệt"
**When**: Staff click "Phê duyệt"
**Then**:

* Trạng thái chuyển sang "Chờ lấy sách"
* Email thông báo gửi đến Customer
* Ghi nhận người duyệt và thời gian

**AC-02: Tính tiền phạt quá hạn**

**Given**: Customer trả sách trễ 5 ngày, mức phạt 5.000 VND/ngày
**When**: Staff xác nhận trả sách
**Then**:

* Tiền phạt = 5 × 5.000 = 25.000 VND
* Hiển thị hóa đơn phạt cho Customer
* Phiếu mượn ghi nhận tiền phạt

**AC-03: Từ chối phiếu mượn**

**Given**: Phiếu mượn ở trạng thái "Chờ duyệt"
**When**: Staff click "Từ chối" và nhập lý do
**Then**:

* Trạng thái chuyển "Đã từ chối"
* Tồn kho hoàn lại
* Email thông báo lý do từ chối gửi đến Customer

---

### **US-21: Kiểm duyệt đánh giá/bình luận (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn kiểm duyệt và ẩn/xóa các bình luận vi phạm (spam, ngôn từ xấu) để bảo vệ cộng đồng đọc sách.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Kiểm duyệt bình luận**

1\. Staff truy cập "Quản lý đánh giá/bình luận"

2\. Xem danh sách bình luận (lọc theo: mới nhất, bị report)

3\. Kiểm tra nội dung

4\. Nếu vi phạm: click "Ẩn" hoặc "Xóa", nhập lý do

5\. Bình luận bị ẩn khỏi giao diện công khai

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Ẩn bình luận vi phạm**

**Given**: Bình luận chứa ngôn từ xấu
**When**: Staff click "Ẩn"
**Then**:

* Bình luận không còn hiển thị trên trang chi tiết sách
* Dữ liệu bình luận vẫn được lưu (audit trail)
* Rating trung bình được tính lại

---

### **US-22: Quản lý tài khoản người dùng (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn quản lý tài khoản người dùng (tạo, sửa, khóa/mở khóa) và phân quyền theo vai trò (Admin, Librarian, Customer) để kiểm soát truy cập hệ thống.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Quản lý danh sách tài khoản**

1\. Admin đăng nhập và truy cập "Quản lý người dùng"

2\. Hệ thống hiển thị danh sách tài khoản:

   \- Họ tên, email, vai trò (role), trạng thái (Active/Locked/Inactive)

   \- Ngày tạo, lần đăng nhập cuối

3\. Admin có thể: tìm kiếm, lọc theo role, trạng thái

4\. Hành động: Tạo mới, Chỉnh sửa, Khóa/Mở khóa

**Luồng: Tạo tài khoản mới (Admin/Staff)**

1\. Admin click "Tạo tài khoản"

2\. Nhập: Họ tên, email, role (Admin/Librarian/Customer), mật khẩu tạm

3\. Click "Lưu" → tài khoản được tạo, gửi email mật khẩu tạm cho người dùng

**Luồng: Khóa tài khoản**

1\. Admin click "Khóa" trên tài khoản

2\. Nhập lý do khóa

3\. Tài khoản chuyển trạng thái "Locked"

4\. Phiên đăng nhập hiện tại của tài khoản đó bị ngắt (terminate session)

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Tạo tài khoản Staff thành công**

**Given**: Admin đang ở trang quản lý người dùng
**When**: Tạo tài khoản mới với role Librarian
**Then**:

* Tài khoản được tạo với role Librarian
* Email chứa mật khẩu tạm được gửi
* Tài khoản hiển thị trong danh sách

**AC-02: Khóa tài khoản**

**Given**: Tài khoản Customer đang active
**When**: Admin khóa tài khoản
**Then**:

* Trạng thái chuyển "Locked"
* Session hiện tại bị ngắt
* Người dùng không thể đăng nhập, nhận thông báo "Tài khoản đã bị khóa"

**AC-03: Phân quyền theo vai trò**

**Given**: Admin gán role Librarian cho tài khoản
**When**: Tài khoản đó đăng nhập
**Then**:

* Chỉ thấy menu và chức năng của Librarian
* Truy cập API của Admin bị từ chối (403)

---

### **US-23: Quản lý vai trò và Phân quyền chi tiết (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn tạo/sửa/xóa vai trò (roles) và cấp phát quyền hạn chi tiết (permissions) cho từng vai trò để kiểm soát truy cập hệ thống theo nguyên tắc bảo mật.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Quản lý vai trò**

1\. Admin truy cập "Quản lý vai trò"

2\. Xem danh sách roles (Admin, Librarian, Customer)

3\. Tạo mới / Chỉnh sửa role: đặt tên, gán danh sách permissions

4\. Xóa role (chỉ khi không có tài khoản nào đang sử dụng)

**Luồng phụ: Phân quyền chi tiết**

1\. Admin chọn role cần phân quyền

2\. Hệ thống hiển thị danh sách permissions (grouped theo module):

   \- Module Sách: xem/thêm/sửa/xóa

   \- Module Phiếu mượn: xem/duyệt/cập nhật

   \- Module Người dùng: xem/tạo/khóa

   \- Module Báo cáo: xem/xuất

   \- Module Log: xem

3\. Admin check/uncheck permissions và lưu

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Phân quyền hoạt động đúng**

**Given**: Role Librarian chỉ có quyền xem và duyệt phiếu mượn
**When**: Librarian cố truy cập API xóa phiếu mượn
**Then**:

* API trả về 403 Forbidden
* Giao diện không hiển thị nút "Xóa"

**AC-02: Không xóa role đang sử dụng**

**Given**: Role Librarian có 5 tài khoản đang gán
**When**: Admin thử xóa role
**Then**:

* Hiển thị cảnh báo "Không thể xóa vai trò đang có 5 tài khoản sử dụng"

---

### **US-24: Cấu hình chính sách nghiệp vụ (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn cấu hình các thông số nghiệp vụ (số ngày mượn tối đa, mức phạt/ngày quá hạn, số sách mượn đồng thời, tỷ lệ tiền cọc) trên giao diện để linh hoạt điều chỉnh chính sách mà không cần thay đổi mã nguồn.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Cấu hình chính sách**

1\. Admin truy cập "Cấu hình hệ thống" → "Chính sách mượn sách"

2\. Hệ thống hiển thị các thông số hiện tại:

   \- Số ngày mượn tối đa (mặc định: 14)

   \- Mức phạt/ngày quá hạn (mặc định: 5.000 VND)

   \- Số sách mượn đồng thời tối đa (mặc định: 5)

   \- Tỷ lệ tiền cọc (mặc định: 30% giá sách)

   \- Số lần gia hạn tối đa (mặc định: 1)

3\. Admin chỉnh sửa và click "Lưu"

4\. Cấu hình mới được áp dụng cho các giao dịch sau thời điểm lưu

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Cấu hình chính sách thành công**

**Given**: Admin đang ở trang cấu hình chính sách
**When**: Thay đổi "Mức phạt/ngày quá hạn" thành 10.000 VND và lưu
**Then**:

* Cấu hình mới được lưu
* Các phiếu mượn mới sẽ áp dụng mức phạt 10.000 VND/ngày
* Phiếu mượn đang tồn tại giữ nguyên mức phạt cũ (hoặc theo rule sản phẩm)

---

### **US-25: Thống kê và Báo cáo (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn xem thống kê doanh thu, tần suất mượn sách, đánh giá và dự báo xu hướng bằng AI để hỗ trợ ra quyết định quản lý.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem báo cáo**

1\. Admin truy cập "Dashboard thống kê"

2\. Hệ thống hiển thị:

   \- Tổng doanh thu (ngày/tuần/tháng/năm)

   \- Số lượng phiếu mượn (theo trạng thái)

   \- Sách mượn nhiều nhất (top 10)

   \- Tỷ lệ đánh giá tích cực/tiêu cực

   \- Biểu đồ AI dự báo xu hướng đầu sách

3\. Admin có thể lọc theo khoảng thời gian

4\. Click "Xuất báo cáo" → tải file Excel hoặc PDF

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị dashboard thống kê**

**Given**: Hệ thống có dữ liệu giao dịch
**When**: Admin truy cập dashboard
**Then**:

* Hiển thị đầy đủ các chỉ số: doanh thu, số phiếu mượn, top sách, tỷ lệ đánh giá
* Biểu đồ trực quan (bar chart, line chart, pie chart)
* Dữ liệu cập nhật real-time hoặc gần real-time

**AC-02: Xuất báo cáo Excel**

**Given**: Admin đang xem dashboard
**When**: Click "Xuất báo cáo" → chọn Excel
**Then**:

* File Excel được tải về với dữ liệu thống kê tương ứng
* File chứa các sheet: Doanh thu, Phiếu mượn, Top sách

**AC-03: AI dự báo xu hướng**

**Given**: Có dữ liệu mượn sách >= 3 tháng
**When**: Admin xem biểu đồ AI xu hướng
**Then**:

* Hiển thị dự báo nhu cầu mượn/đọc cho tháng tiếp theo
* Gợi ý đầu sách cần nhập thêm

---

### **US-26: Đối soát giao dịch và Quản lý hoàn tiền (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn đối soát tự động giao dịch thanh toán với cổng thanh toán bên thứ ba và phê duyệt yêu cầu hoàn tiền để đảm bảo minh bạch tài chính.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Đối soát giao dịch**

1\. Admin truy cập "Đối soát giao dịch"

2\. Chọn khoảng thời gian và cổng thanh toán

3\. Hệ thống so sánh dữ liệu nội bộ vs API cổng thanh toán

4\. Hiển thị kết quả: số lượng khớp, không khớp, tổng doanh thu chênh lệch

**Luồng phụ: Quản lý hoàn tiền**

1\. Admin xem danh sách yêu cầu hoàn tiền (từ phiếu mượn bị hủy)

2\. Kiểm tra chi tiết và phê duyệt/từ chối

3\. Nếu phê duyệt: hệ thống gửi lệnh hoàn tiền qua cổng thanh toán

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Đối soát giao dịch thành công**

**Given**: Có giao dịch thanh toán trong khoảng thời gian được chọn
**When**: Admin chạy đối soát
**Then**:

* Hiển thị báo cáo so sánh: giao dịch khớp, không khớp
* Highlight các giao dịch bất thường

**AC-02: Hoàn tiền thành công**

**Given**: Phiếu mượn bị hủy có yêu cầu hoàn tiền
**When**: Admin phê duyệt hoàn tiền
**Then**:

* Lệnh hoàn tiền được gửi đến cổng thanh toán
* Trạng thái yêu cầu chuyển "Đã hoàn tiền"
* Customer nhận email xác nhận hoàn tiền

---

### **US-27: Quản lý banner quảng cáo và CMS (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn quản lý banner quảng cáo trên trang chủ (thêm, sửa, xóa) và quản lý nội dung CMS (bài viết, trang tĩnh) để chủ động cập nhật thông tin quảng bá.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Quản lý banner**

1\. Admin truy cập "Quản lý banner"

2\. Xem danh sách banner hiện tại (ảnh, link, thứ tự hiển thị, trạng thái)

3\. Thêm mới: upload ảnh, nhập link đích, chọn vị trí hiển thị

4\. Sắp xếp thứ tự: kéo thả

5\. Bật/tắt banner

**Luồng phụ: Quản lý bài viết/trang tĩnh**

1\. Admin truy cập "Quản lý nội dung"

2\. CRUD bài viết: tiêu đề, nội dung (rich text editor), ảnh đại diện, trạng thái (nháp/xuất bản)

3\. Quản lý trang tĩnh: Giới thiệu, Chính sách, FAQ

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Thêm banner mới**

**Given**: Admin ở trang quản lý banner
**When**: Upload ảnh, nhập link đích, chọn trạng thái "Active" và lưu
**Then**:

* Banner mới hiển thị trên trang chủ
* Thứ tự hiển thị đúng vị trí đã cấu hình

**AC-02: Quản lý bài viết**

**Given**: Admin tạo bài viết mới
**When**: Nhập nội dung và chọn "Xuất bản"
**Then**:

* Bài viết hiển thị trên trang tin tức/blog
* Bài viết ở trạng thái "Nháp" không hiển thị cho người dùng

---

### **US-28: Xem nhật ký hệ thống — Audit Logs (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn xem nhật ký hệ thống (audit logs) với khả năng lọc theo người dùng, hành động, thời gian để giám sát an ninh và truy vết sự cố.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem audit logs**

1\. Admin truy cập "Nhật ký hệ thống"

2\. Hệ thống hiển thị danh sách log:

   \- Thời gian (timestamp)

   \- Người dùng (username/email)

   \- Hành động (LOGIN, CREATE, UPDATE, DELETE, EXPORT, ...)

   \- Đối tượng tác động (User, Book, BorrowTicket, ...)

   \- IP address

   \- Kết quả (Success/Failed)

3\. Admin có thể:

   \- Lọc theo: khoảng thời gian, user, loại hành động

   \- Tìm kiếm theo keyword

   \- Phân trang

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị audit logs**

**Given**: Hệ thống có dữ liệu log
**When**: Admin truy cập trang audit logs
**Then**:

* Hiển thị danh sách log với đầy đủ thông tin
* Có bộ lọc theo thời gian, user, hành động
* Log mới nhất hiển thị trên đầu

**AC-02: Lọc log theo user**

**Given**: Admin muốn kiểm tra hoạt động của user "librarian01@example.com"
**When**: Chọn lọc theo user
**Then**:

* Chỉ hiển thị log của user đó
* Kết quả phân trang chính xác

---

### **US-29: Quản lý phiên đăng nhập — Active Sessions (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn xem danh sách phiên đăng nhập đang hoạt động và có khả năng ngắt phiên (terminate session) khi phát hiện truy cập bất thường để bảo vệ hệ thống.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Quản lý session**

1\. Admin truy cập "Quản lý phiên đăng nhập"

2\. Xem danh sách session đang active: user, IP, thời gian bắt đầu, thiết bị/trình duyệt

3\. Nếu nghi vấn: click "Ngắt phiên"

4\. Phiên bị ngắt ngay lập tức, người dùng bị buộc đăng xuất

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Ngắt phiên thành công**

**Given**: Có session đang active
**When**: Admin click "Ngắt phiên"
**Then**:

* Session bị hủy ngay lập tức
* Người dùng bị buộc đăng xuất ở lần request tiếp theo
* Ghi nhận audit log cho hành động terminate session

---

### **US-30: Quản lý hạng thành viên — Membership Tier (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn cấu hình các hạng thành viên và quyền lợi tương ứng (giảm phí mượn, ưu tiên đặt giữ, tăng số sách mượn đồng thời) để khuyến khích độc giả sử dụng hệ thống.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Cấu hình hạng thành viên**

1\. Admin truy cập "Quản lý hạng thành viên"

2\. Xem danh sách hạng: tên, điều kiện thăng hạng, quyền lợi

3\. Thêm/sửa/xóa hạng thành viên

4\. Cấu hình quyền lợi mỗi hạng:

   \- Giảm % phí mượn

   \- Ưu tiên đặt giữ chỗ

   \- Tăng số sách mượn đồng thời

   \- Miễn phí gia hạn

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Cấu hình hạng thành viên thành công**

**Given**: Admin tạo hạng "Gold" với điều kiện >= 50 lượt mượn
**When**: Lưu cấu hình
**Then**:

* Hạng "Gold" hiển thị trong danh sách
* Customer đạt 50 lượt mượn tự động được nâng hạng (hoặc theo rule)
* Quyền lợi Gold được áp dụng cho giao dịch tiếp theo

---

### **US-31: Cấu hình hệ thống (Admin)**

#### **User Story Statement**

Là Admin, tôi muốn cấu hình ngôn ngữ, múi giờ, cổng thanh toán tích hợp và thiết lập sao lưu/phục hồi dữ liệu tự động để đảm bảo hệ thống vận hành ổn định.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Cấu hình hệ thống**

1\. Admin truy cập "Cài đặt hệ thống"

2\. Cấu hình:

   \- Ngôn ngữ mặc định

   \- Múi giờ

   \- Danh sách cổng thanh toán (bật/tắt MoMo, VNPay, Stripe)

   \- Lịch sao lưu tự động (hàng ngày/hàng tuần)

3\. Lưu cấu hình

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Cấu hình cổng thanh toán**

**Given**: Admin bật cổng thanh toán MoMo
**When**: Customer thanh toán tiền cọc
**Then**:

* MoMo hiển thị trong danh sách phương thức thanh toán
* Giao dịch qua MoMo hoạt động bình thường

**AC-02: Sao lưu tự động**

**Given**: Cấu hình sao lưu hàng ngày lúc 02:00 AM
**When**: Đến 02:00 AM
**Then**:

* Hệ thống tự động sao lưu database
* Ghi log kết quả sao lưu (thành công/thất bại)
* Admin có thể phục hồi từ bản sao lưu gần nhất

---

### **US-32: Xem thông tin Giới thiệu & Liên hệ**

#### **User Story Statement**

Là một người dùng, tôi muốn xem thông tin giới thiệu về thư viện và thông tin liên hệ (địa chỉ, hotline, bản đồ) để biết thêm về thư viện và cách liên hệ.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Xem giới thiệu và liên hệ**

1\. Người dùng click "Giới thiệu" hoặc "Liên hệ" trên menu

2\. Trang Giới thiệu: sứ mệnh, tầm nhìn, không gian đọc, nội quy mượn trả

3\. Trang Liên hệ: địa chỉ, hotline, email, bản đồ (Google Maps embed)

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Hiển thị trang giới thiệu**

**Given**: Người dùng click "Giới thiệu"
**When**: Trang tải xong
**Then**:

* Hiển thị đầy đủ thông tin thư viện
* Nội quy mượn trả rõ ràng

**AC-02: Hiển thị trang liên hệ**

**Given**: Người dùng click "Liên hệ"
**When**: Trang tải xong
**Then**:

* Hiển thị địa chỉ, hotline, email
* Bản đồ Google Maps hiển thị đúng vị trí

---

### **US-33: Gửi yêu cầu hỗ trợ / Tư vấn**

#### **User Story Statement**

Là một người dùng, tôi muốn gửi yêu cầu hỗ trợ/tư vấn qua form liên hệ để nhận được phản hồi từ bộ phận chăm sóc khách hàng.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Gửi yêu cầu hỗ trợ**

1\. Người dùng truy cập "Hỗ trợ" hoặc "Liên hệ"

2\. Điền form: Họ tên, Email, SĐT, Chủ đề, Nội dung yêu cầu

3\. Click "Gửi"

4\. Hệ thống ghi nhận yêu cầu, gửi email xác nhận đã nhận

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Gửi yêu cầu thành công**

**Given**: Người dùng điền đầy đủ form
**When**: Click "Gửi"
**Then**:

* Yêu cầu được ghi nhận
* Email xác nhận "Chúng tôi đã nhận yêu cầu của bạn" được gửi
* Hiển thị mã yêu cầu để theo dõi

---

### **US-34: Tìm kiếm thông tin độc giả tại quầy (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn tìm kiếm nhanh thông tin tài khoản độc giả theo SĐT, email hoặc mã thẻ thư viện (QR code) khi độc giả đến trực tiếp tại quầy, để xác định danh tính và phục vụ quy trình mượn sách tại chỗ.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Tìm kiếm độc giả đã có tài khoản**

1\. Độc giả đến quầy thư viện muốn mượn sách

2\. Staff truy cập chức năng "Tìm kiếm độc giả" trên giao diện quản lý

3\. Staff tìm kiếm bằng một trong các cách:

   \- Nhập SĐT hoặc email vào ô tìm kiếm

   \- Quét mã QR trên thẻ thư viện/điện thoại của độc giả

   \- Nhập mã thẻ thư viện thủ công

4\. Hệ thống trả về kết quả:

   \- Họ tên, email, SĐT, ảnh đại diện

   \- Hạng thành viên (nếu có)

   \- Số sách đang mượn / Giới hạn mượn đồng thời

   \- Trạng thái tài khoản (Active/Locked)

   \- Lịch sử mượn sách gần đây (5 phiếu gần nhất)

   \- Khoản phạt chưa thanh toán (nếu có)

5\. Staff xác nhận đúng người và tiếp tục quy trình tạo phiếu mượn

**Luồng phụ: Độc giả chưa có tài khoản (vãng lai)**

1\. Staff tìm kiếm nhưng không tìm thấy kết quả

2\. Hệ thống hiển thị thông báo "Không tìm thấy độc giả" kèm nút "Tạo hồ sơ độc giả vãng lai"

3\. Staff click "Tạo hồ sơ độc giả vãng lai":

   \- Nhập: Họ tên (bắt buộc), SĐT (bắt buộc), Email (tùy chọn), CMND/CCCD (bắt buộc)

4\. Hệ thống tạo hồ sơ độc giả vãng lai (role: WALK_IN_CUSTOMER) với trạng thái đặc biệt

5\. Staff tiếp tục quy trình tạo phiếu mượn cho độc giả vãng lai

**Luồng ngoại lệ: Tài khoản bị khóa hoặc có nợ phạt**

1\. Nếu tài khoản ở trạng thái LOCKED: hiển thị cảnh báo "Tài khoản đã bị khóa — Không thể tạo phiếu mượn"

2\. Nếu có khoản phạt chưa thanh toán: hiển thị cảnh báo "Độc giả có khoản phạt chưa thanh toán: X VND", cho phép Staff yêu cầu thanh toán trước hoặc ghi nhận nợ

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Tìm kiếm độc giả bằng SĐT thành công**

**Given**: Độc giả có tài khoản với SĐT "0901234567" trong hệ thống
**When**: Staff nhập "0901234567" vào ô tìm kiếm và submit
**Then**:

* Hiển thị thông tin đầy đủ của độc giả (họ tên, email, hạng thành viên, số sách đang mượn)
* Hiển thị lịch sử mượn sách gần đây
* Hiển thị khoản phạt chưa thanh toán (nếu có)

**AC-02: Tìm kiếm bằng QR code thành công**

**Given**: Độc giả đưa mã QR thẻ thư viện cho Staff
**When**: Staff quét QR bằng camera/đầu đọc
**Then**:

* Hệ thống tự động nhận diện mã thẻ và hiển thị thông tin độc giả
* Thời gian phản hồi < 2 giây

**AC-03: Tạo hồ sơ độc giả vãng lai thành công**

**Given**: Không tìm thấy độc giả trong hệ thống
**When**: Staff nhập đầy đủ Họ tên, SĐT, CMND/CCCD và click "Tạo hồ sơ"
**Then**:

* Hồ sơ độc giả vãng lai được tạo
* Hệ thống tự động gán mã thẻ thư viện tạm thời
* Staff có thể tiếp tục tạo phiếu mượn cho độc giả vãng lai

**AC-04: Cảnh báo tài khoản bị khóa**

**Given**: Độc giả có tài khoản ở trạng thái LOCKED
**When**: Staff tìm kiếm và xem thông tin
**Then**:

* Hiển thị cảnh báo đỏ "Tài khoản đã bị khóa"
* Nút "Tạo phiếu mượn" bị vô hiệu hóa (disabled)
* Hiển thị lý do khóa (nếu có)

**AC-05: Cảnh báo nợ phạt chưa thanh toán**

**Given**: Độc giả có khoản phạt 50.000 VND chưa thanh toán
**When**: Staff tìm kiếm và xem thông tin
**Then**:

* Hiển thị cảnh báo cam "Có khoản phạt chưa thanh toán: 50.000 VND"
* Hiển thị nút "Thu phạt ngay" để xử lý trước khi tạo phiếu mượn mới

---

### **US-35: Tạo phiếu mượn trực tiếp tại quầy — Walk-in Borrow (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn tạo phiếu mượn trực tiếp tại quầy cho độc giả đến thư viện (bao gồm cả độc giả đã có tài khoản và độc giả vãng lai chưa dùng app), chọn sách từ kho thực tế, nhập ngày mượn/ngày trả, xác nhận giao sách ngay tại chỗ — mà không cần độc giả phải đăng nhập app hay qua bước duyệt online, để phục vụ mượn sách tại chỗ nhanh chóng.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Tạo phiếu mượn trực tiếp cho độc giả đã có tài khoản**

1\. Độc giả mang sách muốn mượn đến quầy thủ thư

2\. Staff tìm kiếm độc giả (theo US-34) và xác nhận danh tính

3\. Staff click "Tạo phiếu mượn trực tiếp"

4\. Hệ thống hiển thị form tạo phiếu mượn tại quầy:

   \- Thông tin độc giả (read-only, đã chọn ở bước trước)

   \- Danh sách sách mượn: Staff thêm sách bằng cách:

     \+ Quét mã vạch ISBN trên sách

     \+ Hoặc tìm kiếm theo tên sách / mã sách

   \- Ngày mượn (mặc định: ngày hiện tại)

   \- Ngày hẹn trả (mặc định: ngày hiện tại + số ngày mượn tối đa theo cấu hình)

   \- Phương thức thanh toán tiền cọc: Tiền mặt / Miễn cọc (tùy hạng thành viên)

   \- Ghi chú (tùy chọn)

5\. Staff kiểm tra và click "Xác nhận tạo phiếu"

6\. Hệ thống validate:

   \- Sách còn trong kho (tồn kho > 0)

   \- Độc giả chưa vượt giới hạn mượn đồng thời

   \- Tài khoản không bị khóa và không có nợ phạt (hoặc đã xử lý)

   \- Ngày hẹn trả hợp lệ

7\. Nếu hợp lệ:

   \- Tạo phiếu mượn với trạng thái **"Đang mượn"** (bỏ qua bước "Chờ duyệt" và "Chờ lấy")

   \- Trừ tồn kho ngay lập tức

   \- Ghi nhận tiền cọc (nếu có)

   \- In/gửi biên nhận cho độc giả (tùy chọn: in giấy hoặc gửi email/SMS)

   \- Ghi nhận audit log: Staff nào tạo, thời gian, IP

   \- Phiếu mượn xuất hiện trong lịch sử mượn sách của độc giả (nếu có tài khoản)

**Luồng phụ: Tạo phiếu mượn cho độc giả vãng lai**

1\. Staff tạo hồ sơ độc giả vãng lai (theo US-34, luồng phụ)

2\. Tiếp tục quy trình tạo phiếu mượn trực tiếp như luồng chính

3\. Bắt buộc thu tiền cọc bằng tiền mặt (không cho miễn cọc)

4\. Bắt buộc ghi nhận CMND/CCCD của độc giả vãng lai

**Luồng phụ: Thêm nhiều sách vào cùng một phiếu**

1\. Staff quét lần lượt mã vạch ISBN của các cuốn sách

2\. Mỗi lần quét, sách được thêm vào danh sách trên phiếu mượn

3\. Hiển thị số lượng sách hiện tại / giới hạn mượn đồng thời còn lại

4\. Nếu vượt giới hạn: cảnh báo và không cho thêm

**Luồng ngoại lệ: Sách hết tồn kho**

1\. Staff thêm sách nhưng tồn kho = 0

2\. Hệ thống hiển thị cảnh báo "Sách [Tên sách] hiện không còn trong kho"

3\. Gợi ý "Đặt giữ chỗ cho độc giả?" nếu độc giả muốn đợi

**Luồng ngoại lệ: Tranh chấp tồn kho giữa online và offline**

1\. Staff tạo phiếu tại quầy đồng thời có Customer đặt mượn online cùng cuốn sách cuối cùng

2\. Hệ thống sử dụng cơ chế lock (Pessimistic locking) — ưu tiên giao dịch submit trước

3\. Giao dịch submit sau nhận thông báo "Sách vừa hết"

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Tạo phiếu mượn trực tiếp thành công — Độc giả đã có tài khoản**

**Given**: Staff đã xác nhận danh tính độc giả (tài khoản Active, chưa vượt giới hạn mượn)
**When**: Thêm sách (quét ISBN hoặc tìm kiếm), chọn ngày trả, chọn phương thức cọc và click "Xác nhận tạo phiếu"
**Then**:

* Phiếu mượn được tạo với trạng thái **"Đang mượn"** (không qua "Chờ duyệt")
* Tồn kho sách giảm tương ứng
* Tiền cọc được ghi nhận (nếu có)
* Biên nhận được tạo (có thể in hoặc gửi email)
* Phiếu mượn hiển thị trong lịch sử mượn của độc giả
* Audit log ghi nhận hành động

**AC-02: Tạo phiếu mượn trực tiếp cho độc giả vãng lai**

**Given**: Độc giả chưa có tài khoản, Staff đã tạo hồ sơ vãng lai
**When**: Staff tạo phiếu mượn trực tiếp cho độc giả vãng lai
**Then**:

* Phiếu mượn được tạo và liên kết với hồ sơ vãng lai
* Bắt buộc thu tiền cọc bằng tiền mặt
* CMND/CCCD được ghi nhận trên phiếu
* Biên nhận kèm thông tin phiếu mượn được in/gửi cho độc giả

**AC-03: Quét ISBN thêm sách nhanh**

**Given**: Staff đang tạo phiếu mượn trực tiếp
**When**: Quét mã vạch ISBN trên cuốn sách
**Then**:

* Sách được tự động nhận diện và thêm vào danh sách phiếu mượn
* Hiển thị: tên sách, tác giả, giá cọc, tồn kho hiện tại
* Thời gian phản hồi < 1 giây

**AC-04: Không cho mượn khi vượt giới hạn**

**Given**: Độc giả đang mượn số sách bằng giới hạn tối đa (theo cấu hình)
**When**: Staff thử thêm sách vào phiếu mượn
**Then**:

* Hiển thị thông báo "Độc giả đã đạt giới hạn mượn sách đồng thời (X/X). Không thể thêm sách."
* Không cho tạo phiếu mượn

**AC-05: Đồng bộ tồn kho giữa online và offline**

**Given**: Sách còn 1 bản, đồng thời có Customer đặt mượn online và Staff tạo phiếu tại quầy
**When**: Cả hai submit gần như đồng thời
**Then**:

* Giao dịch submit trước thành công
* Giao dịch submit sau nhận thông báo "Sách vừa hết"
* Tồn kho không bị âm
* Cơ chế lock đảm bảo tính nhất quán dữ liệu

**AC-06: Phiếu mượn tại quầy xuất hiện trong lịch sử online của độc giả**

**Given**: Staff tạo phiếu mượn tại quầy cho độc giả có tài khoản
**When**: Độc giả đăng nhập app và xem "Lịch sử mượn sách"
**Then**:

* Phiếu mượn tại quầy hiển thị với nhãn "Mượn tại quầy" hoặc nguồn "Walk-in"
* Thông tin đầy đủ: tên sách, ngày mượn, ngày hẹn trả, tiền cọc
* Độc giả có thể yêu cầu gia hạn phiếu mượn tại quầy thông qua app

---

### **US-36: Thu tiền cọc và tiền phạt tại quầy (Librarian/Staff)**

#### **User Story Statement**

Là Thủ thư/Nhân viên, tôi muốn ghi nhận thanh toán tiền mặt cho tiền cọc khi tạo phiếu mượn tại quầy hoặc tiền phạt khi độc giả trả sách quá hạn, in/gửi biên nhận cho độc giả, để đảm bảo thu chi tại quầy được ghi nhận minh bạch trên hệ thống.

#### **Luồng Người dùng (User Flow)**

**Luồng chính: Thu tiền cọc khi tạo phiếu mượn tại quầy**

1\. Staff tạo phiếu mượn trực tiếp (theo US-35)

2\. Hệ thống tính tiền cọc tự động dựa trên cấu hình (tỷ lệ % giá sách)

3\. Hiển thị tổng tiền cọc cần thu

4\. Staff xác nhận đã nhận tiền mặt từ độc giả

5\. Hệ thống:

   \- Ghi nhận thanh toán với phương thức "Tiền mặt tại quầy"

   \- Cập nhật trạng thái cọc trên phiếu mượn: "Đã thu cọc"

   \- Tạo biên nhận thu tiền cọc

   \- Staff có thể: in biên nhận giấy hoặc gửi biên nhận qua email/SMS

**Luồng phụ: Thu tiền phạt khi trả sách quá hạn tại quầy**

1\. Độc giả đến trả sách quá hạn

2\. Staff xác nhận trả sách (theo US-20)

3\. Hệ thống tự động tính tiền phạt = (số ngày quá hạn) × (mức phạt/ngày theo cấu hình)

4\. Hiển thị chi tiết tiền phạt cho Staff:

   \- Tên sách, ngày hẹn trả, ngày trả thực tế, số ngày trễ, đơn giá phạt/ngày, tổng phạt

5\. Staff thông báo cho độc giả và thu tiền mặt

6\. Staff click "Xác nhận đã thu phạt"

7\. Hệ thống:

   \- Ghi nhận thanh toán tiền phạt

   \- Cập nhật trạng thái khoản phạt: "Đã thanh toán"

   \- Tạo biên nhận thu tiền phạt

   \- Hoàn lại tiền cọc nếu có (trừ tiền phạt từ tiền cọc hoặc hoàn riêng)

**Luồng phụ: Hoàn tiền cọc khi trả sách đúng hạn tại quầy**

1\. Độc giả trả sách đúng hạn, sách nguyên vẹn

2\. Staff xác nhận trả sách

3\. Hệ thống hiển thị: "Hoàn cọc: X VND"

4\. Staff hoàn tiền cọc bằng tiền mặt cho độc giả

5\. Staff click "Xác nhận đã hoàn cọc"

6\. Hệ thống ghi nhận hoàn cọc, tạo biên nhận

**Luồng ngoại lệ: Sách bị hư hỏng**

1\. Staff ghi nhận sách trả bị hư hỏng

2\. Hệ thống tính phí bồi thường theo chính sách (% giá sách hoặc toàn bộ giá sách)

3\. Staff thu tiền bồi thường + tiền phạt quá hạn (nếu có)

4\. Ghi nhận trên hệ thống, tạo biên nhận

#### **Tiêu chí Chấp nhận (Acceptance Criteria)**

**AC-01: Thu tiền cọc thành công**

**Given**: Staff tạo phiếu mượn trực tiếp, tiền cọc = 30.000 VND
**When**: Staff xác nhận đã thu tiền mặt
**Then**:

* Phiếu mượn ghi nhận cọc 30.000 VND, phương thức "Tiền mặt tại quầy"
* Biên nhận được tạo với mã biên nhận duy nhất
* Biên nhận hiển thị: tên độc giả, tên sách, số tiền cọc, ngày thu, Staff thu tiền
* Có thể in biên nhận hoặc gửi qua email/SMS

**AC-02: Thu tiền phạt quá hạn thành công**

**Given**: Độc giả trả sách trễ 3 ngày, mức phạt 5.000 VND/ngày → Tổng phạt = 15.000 VND
**When**: Staff click "Xác nhận đã thu phạt"
**Then**:

* Khoản phạt 15.000 VND được ghi nhận "Đã thanh toán"
* Biên nhận thu phạt được tạo với chi tiết: ngày hẹn trả, ngày trả thực tế, số ngày trễ, đơn giá, tổng phạt
* Phiếu mượn cập nhật trạng thái "Đã trả — Đã thu phạt"

**AC-03: Hoàn tiền cọc khi trả sách đúng hạn**

**Given**: Độc giả trả sách đúng hạn, sách nguyên vẹn, đã đóng cọc 30.000 VND
**When**: Staff xác nhận trả sách và hoàn cọc
**Then**:

* Cọc 30.000 VND được ghi nhận "Đã hoàn"
* Biên nhận hoàn cọc được tạo
* Phiếu mượn cập nhật trạng thái "Đã trả — Đã hoàn cọc"

**AC-04: Xử lý sách hư hỏng**

**Given**: Sách trả bị hư hỏng, giá sách 200.000 VND, chính sách bồi thường 50%
**When**: Staff ghi nhận hư hỏng và thu tiền bồi thường
**Then**:

* Phí bồi thường = 100.000 VND được ghi nhận
* Nếu có tiền cọc: trừ bồi thường từ cọc, hoàn phần chênh lệch (hoặc thu thêm)
* Biên nhận bồi thường được tạo
* Sách được đánh dấu "Hư hỏng" trong hệ thống kho

**AC-05: Biên nhận đầy đủ thông tin**

**Given**: Staff thu tiền cọc hoặc phạt
**When**: Biên nhận được tạo
**Then**:

* Biên nhận chứa: mã biên nhận, tên thư viện, tên độc giả, danh sách sách, loại giao dịch (cọc/phạt/bồi thường/hoàn cọc), số tiền, ngày giờ, tên Staff thu tiền
* Biên nhận có thể in (A5/thermal printer) hoặc gửi email/SMS

---
---

## **3. Bảng tổng hợp User Stories**

| Mã | User Story | Actor | Độ ưu tiên |
| :---- | :---- | :---- | :---- |
| US-01 | Đăng ký tài khoản | Guest | Cao |
| US-02 | Đăng nhập hệ thống | Guest/Customer/Staff/Admin | Cao |
| US-03 | Xem trang chủ | Guest/Customer | Cao |
| US-04 | Xem danh sách sách và Tìm kiếm (bao gồm AI Semantic Search) | Guest/Customer | Cao |
| US-05 | Xem chi tiết sách | Guest/Customer | Cao |
| US-06 | Đặt mượn sách (Online) | Customer | Cao |
| US-07 | Hủy phiếu mượn | Customer | Trung bình |
| US-08 | Gia hạn phiếu mượn | Customer | Trung bình |
| US-09 | Đặt giữ chỗ sách (Reservation) | Customer | Trung bình |
| US-10 | Quản lý danh sách yêu thích | Customer | Trung bình |
| US-11 | Xem lịch sử mượn sách | Customer | Cao |
| US-12 | Đánh giá và bình luận sách | Customer | Trung bình |
| US-13 | Tương tác AI Chatbot | Guest/Customer | Trung bình |
| US-14 | Cập nhật hồ sơ cá nhân và Đổi mật khẩu | Customer | Cao |
| US-15 | Nhận thông báo tự động | Customer | Cao |
| US-16 | Đặt lịch hẹn đến thư viện | Guest | Thấp |
| US-17 | Tra cứu phiếu mượn nhanh | Guest/Customer | Thấp |
| US-18 | Quản lý kho sách (CRUD sách, danh mục, tác giả, NXB, nhà cung cấp) | Librarian/Staff | Cao |
| US-19 | Quản lý nhập kho sách | Librarian/Staff | Cao |
| US-20 | Phê duyệt và quản lý phiếu mượn (Online) | Librarian/Staff | Cao |
| US-21 | Kiểm duyệt đánh giá/bình luận | Librarian/Staff | Thấp |
| US-22 | Quản lý tài khoản người dùng | Admin | Cao |
| US-23 | Quản lý vai trò và Phân quyền chi tiết | Admin | Cao |
| US-24 | Cấu hình chính sách nghiệp vụ | Admin | Trung bình |
| US-25 | Thống kê và Báo cáo (bao gồm AI dự báo) | Admin | Trung bình |
| US-26 | Đối soát giao dịch và Quản lý hoàn tiền | Admin | Trung bình |
| US-27 | Quản lý banner quảng cáo và CMS | Admin | Thấp |
| US-28 | Xem nhật ký hệ thống (Audit Logs) | Admin | Trung bình |
| US-29 | Quản lý phiên đăng nhập (Active Sessions) | Admin | Thấp |
| US-30 | Quản lý hạng thành viên (Membership Tier) | Admin | Thấp |
| US-31 | Cấu hình hệ thống | Admin | Trung bình |
| US-32 | Xem thông tin Giới thiệu & Liên hệ | Guest/Customer | Thấp |
| US-33 | Gửi yêu cầu hỗ trợ / Tư vấn | Guest/Customer | Thấp |
| **US-34** | **Tìm kiếm thông tin độc giả tại quầy** | **Librarian/Staff** | **Cao** |
| **US-35** | **Tạo phiếu mượn trực tiếp tại quầy (Walk-in Borrow)** | **Librarian/Staff** | **Cao** |
| **US-36** | **Thu tiền cọc và tiền phạt tại quầy** | **Librarian/Staff** | **Cao** |
