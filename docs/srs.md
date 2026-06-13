**TÀI LIỆU SRS HỆ THỐNG QUẢN LÝ THƯ VIỆN TRỰC TUYẾN**

1. **Giới thiệu (Introduction)**  
   1. **Mục đích (Purpose)**  
      Mục đích của hệ thống là xây dựng một nền tảng công nghệ số toàn diện, giúp tối ưu hóa quy trình quản lý vận hành kho sách và nâng cao trải nghiệm tiếp cận tri thức cho độc giả thông qua nền tảng số và các giải pháp trí tuệ nhân tạo. Hệ thống quản lý thư viện (**Library Management System \- LMS**) cụ thể gồm các mục tiêu cốt lõi sau:

   **1\. Tin học hoá quy trình quản lý thư viện:**  
* **Giảm thiểu tác vụ thủ công:** Giảm thiểu các công việc ghi chép sổ sách truyền thống, giảm thiểu sai sót trong công việc ghi chép.  
* **Quản lý tài nguyên dễ dàng:** Lưu trữ dữ liệu tài nguyên trên một hệ thống duy nhất, giúp tra cứu và cập nhật dữ liệu theo thời gian thực.  
* **Tối ưu hoá quản lý tài nguyên:** Kiểm soát chặt chẽ trạng thái của tài nguyên trong thư viện  
  **2\. Nâng cao trải nghiệm cá nhân cho người dùng:**  
* **Minh bạch thông tin:** Đảm bảo hiển thị chính xác thông tin về tài nguyên của thư viện (giá sách, số lượng sách còn lại,...).  
* **Cung cấp không gian số:** Cho phép người dùng có thể thao tác với hệ thống mọi nơi mà không cần đến trực tiếp thư viện.  
* **Dễ dàng thao tác với hệ thống:** Tối ưu hoá trải nghiệm người dùng với hệ thống thông qua giao diện đơn giản, dễ sử dụng.

		**3\. Phát triển hệ thống quản lý thông minh với tích hợp AI**

* **Hỗ trợ người dùng với trợ lý ảo:** Đóng vai trò như một thủ thư ảo, tương tác và hỗ trợ người dùng khi sử dụng hệ thống.  
* **Tăng tỷ lệ giữ chân người dùng bằng hệ thống gợi ý:** Phân tích hành vi, sở thích của từng cá nhân để tự động đề xuất những tựa sách tương tự, thúc đẩy nhu cầu đọc sách.  
* **Thấu hiểu nhu cầu qua tìm kiếm ngữ nghĩa:** Thay thế cơ chế tìm kiếm từ khóa chính xác kiểu cũ bằng khả năng hiểu ý định tự nhiên của người dùng, giúp tìm ra cuốn sách phù hợp ngay cả khi người dùng chỉ mô tả nội dung chung. 

		**4\. Đảm bảo an toàn dữ liệu và thống kê**

* **Bảo mật và phân quyền:** Đảm bảo an toàn và bảo mật dữ liệu thông qua cơ chế phân quyền, kiểm soát truy cập và lưu vết hành động.  
* **Quản lý dựa trên dữ liệu:** Tổng hợp dữ liệu, xuất báo cáo thống kê trực quan (doanh thu bán sách, tần suất mượn trả theo thể loại,...) nhằm hỗ trợ quản lý thư viện.


  2. **Phạm vi hệ thống (System scopes)**  
     Hệ thống quản lý thư viện (Library Management System – LMS) được thiết kế và triển khai với phạm vi hoạt động bao quát từ nghiệp vụ mượn/trả sách truyền thống đến thương mại điện tử bán sách, kết hợp các tính năng AI hiện đại, đảm bảo đáp ứng nhu cầu của độc giả, thủ thư và ban quản trị. Cụ thể:   
     **1\. Phạm vi chức năng:**  
     Hệ thống cung cấp các chức năng chính sau:  
* **Quản lý người dùng và phân quyền (Auth & RBAC)**:   
  * Đăng ký, đăng nhập, quản lý tài khoản cho Khách /Độc giả, Thủ thư/Nhân viên và Quản trị viên (Admin).  
  * Phân quyền chi tiết theo vai trò (Role-Based Access Control), mã hóa thông tin bảo mật.  
  * Theo dõi phiên làm việc (Session) và ghi nhật ký hoạt động hệ thống (Audit logs).  
* **Tra cứu và tìm kiếm sách**:  
  * Tìm kiếm, lọc sách theo danh mục, tác giả, nhà xuất bản, khoảng giá, tình trạng kho.  
  * Tìm kiếm bằng ngôn ngữ tự nhiên thông qua AI Semantic Search (Vector Embeddings).  
  * Xem chi tiết thông tin sách (mô tả, giá bán/giá cọc, tình trạng còn/hết hàng).  
* **Quy trình mượn sách:**   
  * Quản lý giỏ hàng, danh sách yêu thích.  
  * Quy trình tạo yêu cầu mượn sách (hẹn ngày lấy, ngày trả).  
  * Hủy phiếu mượn.  
  * Đánh giá, bình luận, chấm điểm (rating) sau khi hoàn tất giao dịch.  
* **Quản lý kho sách và vận hành (Backoffice):**   
  * CRUD thông tin sách, danh mục, tác giả, nhà xuất bản, vị trí kệ sách thực tế.  
  * Phê duyệt phiếu mượn, tiếp nhận sách trả, tự động tính tiền phạt khi trả quá hạn.  
* **Tích hợp trí tuệ nhân tạo (AI Features):**   
  * Tìm kiếm ngữ nghĩa (Semantic Search) bằng Vector Embeddings.  
  * Hệ thống gợi ý sách cá nhân hóa theo hành vi người dùng (Recommendation System).  
  * Trợ lý ảo AI Chatbot tư vấn, tóm tắt sách và hướng dẫn lộ trình đọc.  
* **Thông báo và báo cáo:**   
  * Tự động gửi email xác thực, hóa đơn điện tử, nhắc nhở sách sắp/đã quá hạn.  
  * Báo cáo thống kê doanh thu, số lượng sách bán ra, tần suất mượn sách và dự báo xu hướng đầu sách quan tâm.

		**2\. Phạm vi địa lý**

* **Phạm vi hoạt động:** Hệ thống vận hành tập trung tại một hoặc nhiều cơ sở thư viện/cửa hàng sách thực tế (chi nhánh), hỗ trợ quản lý vị trí kệ sách theo từng cơ sở.  
* **Mở rộng (nếu có):** Khả năng mở rộng liên kết nhiều chi nhánh/thư viện trên các khu vực, tỉnh thành khác nhau trong tương lai.

		**3\. Phạm vi đối tượng sử dụng**

* **Khách vãng lai (Guest)**: Người dùng chưa đăng nhập, có thể tra cứu thông tin sách, tìm kiếm, đặt lịch hẹn đến thư viện, tra cứu trạng thái đơn/phiếu mượn.  
* **Khách hàng/Độc giả (Customer/Reader):** Người dùng đã đăng ký tài khoản, thực hiện mượn sách, đánh giá, sử dụng AI Chatbot và nhận gợi ý cá nhân hóa.  
* **Thủ thư/Nhân viên vận hành (Librarian/Staff):** Quản lý kho sách, điều phối phiếu mượn/trả, xử lý đơn hàng bán sách tại cơ sở vật lý.  
* **Quản trị viên (Admin):** Có quyền hạn cao nhất, quản lý người dùng, phân quyền, tài chính, báo cáo thống kê và cấu hình hệ thống.

		**4\. Phạm vi công nghệ**

* **Nền tảng:** Hệ thống hoạt động trên giao diện web (responsive), có khả năng mở rộng sang ứng dụng di động (Android/iOS) trong các giai đoạn sau (nếu thời gian cho phép).  
* **Tích hợp API:**  
  * Cổng thanh toán điện tử (MoMo, VNPay, Stripe...).  
  * Dịch vụ gửi email (SMTP, SendGrid, Amazon SES).  
  * Lưu trữ ảnh/tài liệu trên Cloud Storage (Cloudinary/AWS S3).  
  * AI Provider (OpenAI/Gemini) cho Semantic Search, Recommendation và Chatbot, có cơ chế fallback về tìm kiếm SQL Like khi API AI gặp lỗi.  
  * Quét mã vạch ISBN hoặc OCR ảnh bìa sách để tự động điền thông tin.  
* **Bảo mật thông tin:** Áp dụng mã hóa dữ liệu (JWT, mã hóa mật khẩu), kiểm soát truy cập theo vai trò, theo dõi và ngắt phiên đăng nhập khi nghi vấn bất thường.

		**5\. Phạm vi vận hành và quản lý**

* **Quản lý kho và tồn kho theo thời gian thực:** Theo dõi tình trạng còn/hết sách (cho mượn và cho bán) tránh trùng lặp giao dịch trên cùng một bản sách.  
* **Tự động hóa quy trình nghiệp vụ:** Tự động tính tiền phạt trả sách quá hạn, tự động gửi thông báo/nhắc nhở, tự động cập nhật trạng thái đơn hàng và phiếu mượn theo luồng (Chờ duyệt → Đang xử lý → Hoàn thành/Đã hủy).  
* **Hỗ trợ và tư vấn:** Cung cấp Form gửi yêu cầu hỗ trợ, Chatbot/FAQ giải đáp tự động về chính sách mượn trả, hoàn tiền.  
* **Đối soát và báo cáo:** Đối soát giao dịch thanh toán với cổng thanh toán bên thứ ba, xuất báo cáo định kỳ phục vụ ban quản trị.

  **6\. Ngoài phạm vi hệ thống (Out of scope)** 

* Tích hợp trực tiếp với hệ thống quản lý xuất bản/phát hành sách của Nhà xuất bản ở cấp quốc gia.  
* Hệ thống quản lý vận chuyển riêng (giao hàng) — sử dụng dịch vụ vận chuyển bên thứ ba (nếu có) thông qua tích hợp API ở giai đoạn mở rộng.  
* Cổng thanh toán quốc tế (chỉ tập trung các cổng thanh toán trong nước: MoMo, VNPay, ZaloPay...).  
* Hệ thống quản lý thiết bị phần cứng phức tạp (máy quét RFID cho toàn bộ kệ sách, hệ thống an ninh chống trộm sách bằng cảm biến).


  3. **Mục tiêu hệ thống (System objectives)**  
     Mục tiêu của hệ thống quản lý thư viện (Library Management System) là xây dựng một nền tảng tập trung, hiện đại, ứng dụng AI nhằm số hóa toàn bộ quy trình quản lý mượn/trả sách, nâng cao trải nghiệm độc giả và hỗ trợ ban quản trị ra quyết định hiệu quả. Các mục tiêu chính bao gồm: 

     ### **1\. Mục tiêu nghiệp vụ (Business objectives)**

* **Số hóa quy trình mượn/trả sách:** Thay thế phương pháp ghi chép thủ công bằng hệ thống quản lý tập trung, tự động hóa việc phê duyệt phiếu mượn, tiếp nhận trả sách và tính toán tiền phạt.  
* **Tối ưu quản lý kho:** Theo dõi chính xác số lượng tồn kho, vị trí kệ sách thực tế, tránh tình trạng thất lạc hoặc sai lệch dữ liệu giữa kho thực tế và hệ thống.

  ### **2\. Mục tiêu phục vụ độc giả/khách hàng**

* **Nâng cao trải nghiệm tra cứu:** Cung cấp tính năng tìm kiếm thông minh bằng ngôn ngữ tự nhiên (Semantic Search), giúp độc giả tìm sách nhanh và chính xác hơn so với tìm kiếm từ khóa truyền thống.  
* **Cá nhân hóa trải nghiệm:** Ứng dụng AI Recommendation để gợi ý sách phù hợp dựa trên hành vi và lịch sử mượn, trả sách của từng người dùng.  
* **Hỗ trợ tư vấn :** Trợ lý ảo AI Chatbot giúp tóm tắt nội dung sách, tư vấn lộ trình đọc và giải đáp thắc mắc theo thời gian thực.  
* **Minh bạch thông tin:** Đảm bảo độc giả luôn nắm rõ tình trạng sách (còn/hết), trạng thái đơn hàng/phiếu mượn, hóa đơn chi tiết và lịch sử giao dịch.

  ### **3. Mục tiêu công nghệ**

* **Xây dựng hệ thống ổn định, có khả năng mở rộng:** Thiết kế kiến trúc cho phép xử lý đồng thời nhiều giao dịch (đặt mượn sách) mà không xảy ra tranh chấp tài nguyên (ví dụ hai người cùng mượn cuốn sách cuối cùng).  
* **Tích hợp AI có dự phòng (Fallback):** Đảm bảo khi API AI (OpenAI/Gemini) gặp lỗi hoặc mất kết nối, hệ thống tự động chuyển sang tìm kiếm từ khóa SQL Like để không làm gián đoạn trải nghiệm người dùng.  
* **Đảm bảo bảo mật dữ liệu:** Áp dụng JWT, mã hóa thông tin nhạy cảm, kiểm soát phiên đăng nhập (Session) và ghi nhật ký hoạt động (Audit log) để phát hiện truy cập bất thường.

  ### **4\. Mục tiêu quản lý và vận hành**

* **Tự động hóa thông báo:** Gửi email/SMS tự động cho các sự kiện quan trọng (xác nhận đơn hàng, phê duyệt phiếu mượn, nhắc nhở sách sắp/quá hạn) nhằm giảm tải công việc thủ công cho nhân viên.  
* **Hỗ trợ ra quyết định bằng dữ liệu:** Cung cấp báo cáo thống kê trực quan về doanh thu, lượng sách mượn/bán, hành vi khách hàng, kèm theo dự báo xu hướng đầu sách được quan tâm dựa trên AI.  
* **Đối soát tài chính minh bạch:** Tự động đối soát giao dịch giữa hệ thống và cổng thanh toán bên thứ ba, quản lý quy trình hoàn tiền rõ ràng, có kiểm soát.

  ### **5. Mục tiêu dài hạn**

* **Trở thành nền tảng quản lý thư viện thông minh kiểu mẫu:** Kết hợp hài hòa giữa nghiệp vụ thư viện truyền thống (mượn/trả) và tích hợp sâu AI để tạo lợi thế cạnh tranh.  
* **Khả năng mở rộng đa chi nhánh:** Hướng tới khả năng quản lý đồng thời nhiều cơ sở thư viện/nhà sách trên các khu vực khác nhau trong các giai đoạn phát triển tiếp theo.  
2. **Mô tả tổng quan về dự án (System overview)**  
   1. **Kiến trúc hệ thống (System architecture)**  
      Hệ thống quản lý thư viện trực tuyến được phát triển theo kiến trúc phân lớp (Layered Architecture) kết hợp mô hình Client-Server. Backend sử dụng Java Spring Boot làm framework chính để triển khai dịch vụ RESTful API, Frontend sử dụng ReactJS kết hợp Tailwind CSS, và hệ thống dữ liệu được lưu trữ trên RDBMS MySQL.  
      **Các tầng chính của hệ thống:**  
      **1\. Presentation Layer (Tầng hiển thị/Frontend UI)**  
* **Công nghệ áp dụng:** ReactJS, JavaScript (ES6+), TailwindCSS, Axios.  
* **Vai trò**: Cung cấp giao diện ứng dụng web mượt mà cho Customer, Staff và Admin. Đảm nhận hiển thị giao diện người dùng với các chức năng như:  
  * Đăng nhập, đăng ký.  
  * Tra cứu, tìm kiếm thông tin.  
  * Quản lý thư viện  
  * Thanh toán  
  * Báo cáo thống kê

		**2\. Application Layer (Backend)**

* **Công nghệ sử dụng:** Spring Boot, Node.js.  
* **Vai trò**: Spring Boot chịu trách nhiệm xử lý logic nghiệp vụ, tổ chức theo mô hình **Controller \- Service \- Repository:**  
  * **Controller**: Tiếp nhận các yêu cầu từ Frontend và trả về response.  
  * **Service:** Xử lý toàn bộ logic nghiệp vụ của hệ thống, đồng thời tích hợp mô-đun Spring AI để giao tiếp với các mô hình AI bên ngoài.  
  * **Repository (Data Access Object \- DAO)**: Chịu trách nhiệm giao tiếp trực tiếp với cơ sở dữ liệu thông qua **Spring Data JPA/Hibernate.**  
* Tích hợp bộ lọc bảo mật **Spring Security \+ JWT** để thực hiện xác thực và phân quyền dựa trên vai trò.  
  	**3\. Data Layer (Database và lưu trữ)**  
* **Relational Database (SQL):** Sử dụng MySQL để lưu trữ dữ liệu chính (tên sách, giá sách, …).  
* **Vector Database:** Sử dụng ChromaDB để lưu trữ các chuỗi mã hoá toán học (Vector Embeddings) của nội dung sách, phục vụ cho tính năng AI Semantic Search.  
* **Lưu trữ các tệp phi cấu trúc (File Storage):** Các tài nguyên lớn như ảnh bìa sách, file sẽ được lưu trữ trên Cloudinary/AWS S3.

		**4\. Kiến trúc chi tiết trong Spring Boot**

* **Spring Boot Modules:**  
  * **Spring Web**: Xây dựng RESTful API.  
  * **Spring Data JPA/Hibernate:** ORM kết nối database.  
  * **Spring Security \+ JWT:** Xác thực và phân quyền người dùng.  
  * **Spring Validation:** Validate dữ liệu đầu vào.  
  * **Spring AOP và Logging:** Ghi lại hoạt động (audit log).  
* **Luồng xử lý điển hình:**  
  * Người dùng (khách vãng lai/độc giả) gửi request từ Frontend → REST API.  
  * API Gateway (Spring controller) tiếp nhận → gọi Service.  
  * Service xử lý logic nghiệp vụ, đồng thời tương tác với Repository.  
  * Repository sử dụng JPA/Hibernate truy vấn Database.  
  * Kết quả trả về qua Service → Controller → Response JSON cho Frontend.

		**5\. Kiến trúc triển khai (Deployment Architecture)**

* Hệ thống có thể triển khai theo mô hình **Microservices** hoặc **Monolithic (modular**) tuỳ giai đoạn  
* **Môi trường triển khai:**  
  * **Dev và Test:** Chạy trên máy cục bộ (local) hoặc Docker.  
  * **Production:** Triển khai trên **Cloud (AWS, Azure, GCP)** hoặc **On-premise Server.**  
* **Các thành phần chính khi deploy:**  
  * **Load Balancer:** Phân phối tải giữ nhiều Instance.  
  * **Spring Boot App:** Backend xử lý nghiệp vụ.  
  * **Database Server:** MySQL.  
  * **File Storage/Cloud Storage:** Lưu ảnh bìa sách, file.  
  * **Monitoring & Logging:** ELK Stack (Elasticsearch, Logstash, Kibana) hoặc Grafana \+ Prometheus.  
  2. **Các yếu tố bên ngoài tác động đến hệ thống (External factors affecting the system)**  
     Hệ thống quản lý thư viện tuyến không hoạt động độc lập mà chịu sự tác động trực tiếp và gián tiếp từ nhiều yếu tố bên ngoài. Các yếu tố này ảnh hưởng đến khả năng vận hành, bảo trì và mở rộng hệ thống.   
1. **Yếu tố công nghệ**  
   1. **Khả năng tương thích công nghệ:**  
* Hệ thống phải tương thích với nhiều trình duyệt (Chrome, Safari, Edge) và các hệ điều hành khác nhau (Window, iOS, Android).  
* Khả năng tích hợp với API và dịch vụ đám mây của các nhà cung cấp thanh toán và các nền tảng khác như OpenAI, Gemini, ZaloPay, MoMo, AWS,...  
  2. **Hạ tầng công nghệ:**  
* Chất lượng internet của người dùng (yếu tố quyết định tốc độ tải và trải nghiệm sử dụng).  
* Hiệu năng của máy chủ lưu trữ và dịch vụ đám mây (AWS, Azure, GCP).  
* Khả năng hỗ trợ khi có lưu lượng truy cập tăng cao (peak traffic).  
  3. **Phát triển công nghệ mới:**  
* Yêu cầu cập nhật thường xuyên để hỗ trợ các công nghệ mới.  
2. **Yếu tố con người**  
* **Độc giả / Khách hàng:** Sử dụng hệ thống để tìm kiếm đầu sách, quản lý hồ sơ mượn trả, tạo phiếu mượn sách và thanh toán quá hạn trả sách trực tuyến. Trải nghiệm của họ quyết định mức độ thành công của hệ thống.  
* **Thủ thư / Nhân viên vận hành**: Tương tác trực tiếp với hệ thống để nhập liệu, truy cập hồ sơ mượn trả, quản lý kho sách và xử lý phiếu mượn, các trường hợp quá hạn trả sách.  
* **Quản trị viên (Admin):** Quản lý tài khoản người dùng, phân quyền, và giám sát hoạt động an toàn của toàn bộ hệ thống.  
3. **Yếu tố pháp lý**  
* **Bảo mật và quyền riêng tư:** Phải tuân thủ các tiêu chuẩn bảo mật thông tin (như **PDPA/GDPR**) để đảm bảo dữ liệu cá nhân của người dùng không bị rò rỉ và chỉ được truy cập bởi người có thẩm quyền. Yêu cầu bắt buộc mã hóa dữ liệu nhạy cảm (chứng chỉ **SSL/TLS**, bảo mật thanh toán **PCI-DSS**).  
* **Bản quyền tài sản trí tuệ:** Phải tuân thủ nghiêm ngặt các quy định về bản quyền nội dung khi phân phối sách điện tử (**Ebook**) hoặc trích dẫn, tóm tắt sách thông qua AI.  
4. **Yếu tố xã hội và môi trường**  
* **Xu hướng số hóa và thói quen người dùng**: Dựa trên sự quen thuộc của người dùng với việc mua sắm, đặt lịch online và thói quen thanh toán điện tử trong cộng đồng.  
* **Sự mong đợi về chất lượng dịch vụ**: Người dùng hiện đại mong muốn trải nghiệm dịch vụ thông minh, nhanh chóng, minh bạch và có tính cá nhân hóa cao.  
5. **Yếu tố kinh tế**  
* **Chi phí vận hành:** Bị ảnh hưởng bởi chi phí triển khai ban đầu (phần mềm, hạ tầng) và chi phí bảo trì liên tục (thuê server, chi phí gọi API AI trả phí theo token, cập nhật bảo mật).  
* **Phụ thuộc nhà cung cấp dịch vụ:** Dễ bị ảnh hưởng, gián đoạn giao dịch nếu hệ thống thanh toán hoặc hệ thống AI của bên thứ ba gặp sự cố.  
3. **Yêu cầu chức năng (Functional requirements)**  
   1. **Chức năng không cần đăng nhập (Public/Guest):**  
      

| Tên chức năng | Mô tả |
| :---- | :---- |
| đăng ký  | \- Cho phép người dùng tạo tài khoản mới \- Nhập thông tin: họ tên, email, mật khẩu  |
| đăng nhập  | \- Nhập email và mật khẩu \- Hỗ trợ quên mật khẩu và xác thực lại qua email  |
| xem trang chủ  | \- Hiển thị danh mục sách phổ biến, sách mới nhập, banner ưu đãi, tin tức thị trường sách  |
| xem thông tin giới thiệu  | \- Xem thông tin tổng quan về thư viện/cửa hàng (sứ mệnh, tầm nhìn, không gian đọc, nội quy mượn trả)  |
| xem thông tin liên hệ  | \- Hiển thị địa chỉ, hotline, bản đồ đường đi  |
| xem danh sách sách   | \- Hiển thị toàn bộ đầu sách (phân trang, sắp xếp theo giá/ngày xuất bản, lọc theo thể loại/tác giả/nhà xuất bản/khoảng giá/tình trạng kho)  |
| xem chi tiết sách  | \- Hiển thị ảnh bìa, mô tả nội dung, tác giả, NXB, giá bán/giá đặt cọc, tình trạng còn/hết hàng, đánh giá  |
| tìm kiếm thông minh (AI Semantic Search)  | \- Tìm kiếm sách bằng ngôn ngữ tự nhiên thông qua Vector Embeddings \- Fallback về tìm kiếm từ khóa SQL Like nếu API AI lỗi  |
| đặt lịch hẹn đến thư viện  | \- Cho phép khách vãng lai đặt lịch mượn sách/đọc tại chỗ không cần tài khoản (nhập họ tên, SĐT, email)  |
| tra cứu phiếu mượn sách nhanh  | \- Tra cứu trạng thái phiếu mượn bằng Mã đơn/Mã phiếu \+ SĐT  |
| gửi yêu cầu tư vấn/hỗ trợ  | \- Form gửi câu hỏi, yêu cầu tư vấn hoặc phản hồi dịch vụ đến CSKH  |
| chatbot/FAQ  | \- Tự động giải đáp câu hỏi thường gặp về nội quy, chính sách hoàn tiền, hướng dẫn sử dụng  |

   2. **Chức năng dành cho Độc giả (Customer):**  
      

| Tên chức năng | Mô tả |
| :---- | :---- |
| đăng xuất  | \- Thực hiện thoát khỏi hệ thống   |
| cập nhật hồ sơ cá nhân  | \- Cập nhật ảnh đại diện, ngày sinh, giới tính, SĐT, … |
| đổi mật khẩu   | \- Thay đổi mật khẩu, quản lý thông tin xác thực bảo mật  |
| thêm sách vào danh sách yêu thích  | \- Lưu sách quan tâm vào danh sách yêu thích   |
| xóa sách danh sách yêu thích  | \- Xóa sách đã thêm  |
| đặt mượn sách    | \- Chọn sách, chọn thời gian mượn (ngày đến lấy, ngày hoàn trả), gửi yêu cầu tạo phiếu mượn  |
| thanh toán phí mượn sách | \- Chọn sách mượn, chọn phương thức thanh toán (tiền mặt khi nhận/ví điện tử) |
| hủy phiếu mượn  | \- Hủy yêu cầu mượn trực tuyến. |
| gia hạn phiếu mượn   | \- Yêu cầu gia hạn thời gian mượn nếu sách không bị người khác đặt giữ  |
| đặt giữ chỗ sách (reservation)  | \- Đặt giữ sách khi sách đang hết, nhận thông báo khi sách có sẵn  |
| tương tác AI Chatbot  | \- Khung chat hỗ trợ tóm tắt sách, tư vấn, gợi ý lộ trình đọc theo thời gian thực   |
| xem gợi ý sách cá nhân hóa  | \- Hiển thị danh sách sách gợi ý (AI Recommendation) tại trang chủ và trang chi tiết sách  |
| xem lịch sử mượn sách  | \- Xem lịch sử chi tiết (lọc theo nhà sách, thời gian,trạng thái: đang mượn, đã trả, qua hạn)  |
| thêm đánh giá/bình luận/rating  | \- Thêm mới đánh giá, bình luận, chấm điểm cho đầu sách sau khi hoàn tất trải nghiệm  |
| xóa đánh giá  | \- Xóa đánh giá/bình luận đã đăng  |
| xem chi tiết hóa đơn  | \- Xem hóa đơn (tiền sách quá hạn), lịch sử thanh toán  |
| nhận thông báo  | \- Nhận thông báo qua Email/SMS: mã kích hoạt tài khoản, xác nhận đặt hàng, kết quả phê duyệt phiếu mượn, nhắc nhở sách sắp/quá hạn trả  |

   3. **Chức năng dành cho Thủ thư/Nhân viên (Librarian/Staff):**

| Tên chức năng | Mô tả |
| :---- | :---- |
| đăng xuất  | \- Thực hiện thoát khỏi hệ thống   |
| hiển thị danh sách sách (phân trang, tìm kiếm, sắp xếp)  | \- Xem danh sách sách trong kho, sắp xếp theo số lượng tồn, thể loại  |
| thêm mới sách    | \- Thêm sách mới, hỗ trợ quét mã vạch ISBN hoặc OCR ảnh bìa để tự động điền thông tin, tải ảnh bìa lên Cloudinary/S3  |
| cập nhật thông tin sách  | \- Sửa thông tin sách, số lượng tồn kho, vị trí kệ sách thực tế  |
| xóa mềm sách (soft delete)  | \- Ẩn sách khỏi giao diện người dùng nhưng giữ lại dữ liệu gốc   |
| quản lý danh mục thể loại     | \- Thêm, sửa, xóa thể loại sách  |
| quản lý danh sách tác giả   | \- Thêm, sửa, xóa thông tin tác giả  |
| quản lý danh sách nhà xuất bản    | \- Thêm, sửa, xóa thông tin nhà xuất bản  |
| quản lý nhà cung cấp  | \- Thêm, sửa, xóa thông tin nhà cung cấp sách  |
| tạo phiếu nhập kho  | \- Tạo phiếu nhập sách từ nhà cung cấp, cập nhật số lượng tồn theo phiếu nhập    |
| xem lịch sử nhập kho  | \- Hiển thị lịch sử các phiếu nhập kho  |
| tiếp nhận và phê duyệt phiếu mượn  | \- Kiểm tra, phê duyệt/từ chối yêu cầu mượn sách trực tuyến từ độc giả  |
| cập nhật trạng thái phiếu mượn  | \- Chuyển trạng thái: Chờ lấy → Đang mượn → Đã trả sách/Quá hạn  |
| duyệt yêu cầu gia hạn  | \- Phê duyệt/từ chối yêu cầu gia hạn mượn sách của độc giả  |
| xác nhận trả sách  | \- Ghi nhận tình trạng sách khi thu hồi (nguyên vẹn/hư hỏng), cập nhật lại kho, tự động tính tiền phạt nếu trả quá hạn  |
| kiểm duyệt đánh giá/bình luận   | \- Ẩn/xóa các bình luận vi phạm (spam, ngôn từ xấu)  |

   4. **Chức năng dành cho Quản trị viên (Admin):**  
      

| Tên chức năng | Mô tả |
| :---- | :---- |
| đăng xuất  | \- Thực hiện thoát khỏi hệ thống   |
| quản lý tài khoản người dùng  | \- Tạo mới, chỉnh sửa, khóa/mở khóa tài khoản Admin, Thủ thư, Khách hàng   |
| quản lý vai trò (roles)    | \- Tạo, sửa, xóa vai trò (Admin, Librarian, Customer)   |
| phân quyền chi tiết (permissions)  | \- Cấp phát quyền hạn cho từng vai trò/tài khoản (VD: cấp quyền tạo hóa đơn cho thủ thư, chặn quyền xem log của khách)  |
| quản lý hạng thành viên (membership tier)  | \- Cấu hình các hạng thành viên và quyền lợi tương ứng (giảm phí mượn, ưu tiên đặt giữ...)  |
| quản lý cổng thanh toán    | \- Quản lý danh sách nhà cung cấp dịch vụ thanh toán tích hợp (MoMo, VNPay, Stripe)  |
| đối soát giao dịch (reconciliation)  | \- Đối soát tự động số lượng giao dịch và tổng doanh thu giữa hệ thống với API bên thứ ba  |
| quản lý hoàn tiền (refund)  | \- Quản lý và phê duyệt lệnh hoàn tiền cho phiếu mượn bị hủy  |
| cấu hình chính sách nghiệp vụ  | \- Cấu hình số ngày mượn tối đa, mức phạt/ngày trả quá hạn, số lượng sách mượn đồng thời, tỷ lệ tiền cọc  |
| thống kê doanh thu   | \- Thống kê doanh thu bán sách, tiền cọc/tiền phạt mượn sách theo ngày/tuần/tháng/năm    |
| thống kê đánh giá   | \- Tỷ lệ đánh giá tích cực/tiêu cực theo từng đầu sách hoặc nhà sách  |
| báo cáo AI xu hướng  | \- Biểu đồ AI phân tích xu hướng dịch chuyển danh mục, dự báo nhu cầu mượn/đọc cho tháng tiếp theo  |
| xuất báo cáo  | \- Xuất dữ liệu báo cáo thống kê ra Excel hoặc PDF |
| xem nhật ký hệ thống (audit logs)  | \- Truy cập, lọc dữ liệu log: ai đăng nhập, hành động gì, vào thời gian nào  |
| quản lý banner quảng cáo   | \- Thêm, sửa, xóa banner hiển thị trên trang chủ  |
| quản lý nội dung CMS  | \- Quản lý bài viết/tin tức (blog sách, review, sự kiện)(nếu có), trang tĩnh (giới thiệu, chính sách, FAQ)  |
| cấu hình hệ thống  | \- Cài đặt ngôn ngữ, múi giờ, sao lưu và phục hồi dữ liệu tự động  |
| quản lý phiên làm việc (active sessions)  | \- Xem danh sách phiên đang hoạt động, có quyền ngắt phiên (terminate session) khi nghi vấn  |

   5. **Phạm vi viết Unit Test (Unit Test Scope):**

| Tên chức năng | Mô tả |
| :---- | :---- |
| unit test module Auth  | \- Kiểm tra đăng ký/đăng nhập với thông tin hợp lệ \- Kiểm tra xử lý lỗi khi thiếu trường, email sai định dạng, mật khẩu yếu \- Kiểm tra cơ chế chặn truy cập khi đăng nhập sai nhiều lần   |
| unit test module AI & Tìm kiếm  | \- Kiểm tra tính chính xác dữ liệu trả về khi gọi API Semantic Search \- Kiểm tra luồng Fallback về tìm kiếm SQL Like khi API OpenAI/Gemini lỗi hoặc mất kết nối    |
| unit test module Mượn sách  | \- Kiểm tra xử lý tranh chấp tài nguyên (2 người cùng mượn cuốn sách cuối) \- Kiểm tra tính toán giá tiền \- Kiểm tra xử lý khi cổng thanh toán báo lỗi  |
| unit test module Reservation & Renewal   | \- Kiểm tra logic hàng đợi đặt giữ sách (reservation queue) \- Kiểm tra điều kiện được/không được gia hạn (có người đặt giữ thì không cho gia hạn)  |
| unit test module Quản trị kho  | \- Kiểm tra thêm mới, sửa đổi thông tin sách, kệ sách \- Kiểm tra ràng buộc dữ liệu liên kết \- Kiểm tra luồng xóa mềm (Soft Delete) đảm bảo không mất lịch sử hóa đơn cũ  |
| unit test module Thống kê & Báo cáo  | \- Kiểm tra tính chính xác thuật toán cộng dồn doanh thu, phân loại nhóm khách hàng, lọc log hệ thống theo thời gian  |
| unit test module Thông báo (Notification)  | \- Kiểm tra trigger gửi email đúng thời điểm (xác nhận đơn, nhắc hạn trả) \- Kiểm tra retry logic khi gửi email thất bại  |
| unit test module RBAC  | \- Kiểm tra phân quyền chặn truy cập API khi user không đủ quyền (test 403 Forbidden the o từng role)  |

   

4. **Yêu cầu về cơ sở dữ liệu (Database requirements):**  
   1. **Sơ đồ (Diagram):**  
   2. **Bảng và ràng buộc (Table & Constraints):**  
   3. **Sơ đồ luồng (Data Flow Diagram):**  
   4. **Các sơ đồ use-case:**