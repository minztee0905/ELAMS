# PHÂN TÍCH VẤN ĐỀ VÀ KHOẢNG CÁCH NGHIỆP VỤ (PAIN POINT & GAP ANALYSIS)

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 20/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Đề xuất – Chưa xác nhận với stakeholder thực tế

---

## 1. Mục đích tài liệu

Tài liệu này phân tích những hạn chế của ba quy trình nghiệp vụ hiện tại:

- AS-01 – Employee Onboarding
- AS-02 – Access Request & Approval
- AS-03 – Employee Offboarding

Dựa trên kết quả phân tích As-Is, tài liệu xác định khoảng cách giữa cách vận hành hiện tại và cách vận hành mong muốn khi có hệ thống ELAMS.

Kết quả phân tích được sử dụng làm cơ sở xây dựng BPMN To-Be, Business Rules, BRD và SRS.

## 2. Phạm vi phân tích

Phạm vi bao gồm:

1. Quản lý yêu cầu onboarding và offboarding.
2. Phân công và theo dõi nhiệm vụ.
3. Yêu cầu và phê duyệt quyền truy cập.
4. Cấp phát và thu hồi thiết bị CNTT.
5. Kiểm soát thời hạn xử lý.
6. Lưu trữ lịch sử xử lý và báo cáo.

Các phân tích được xây dựng từ bối cảnh TechNova giả lập, tài liệu Business Discovery và mô hình BPMN As-Is.

## 3. Phân tích nguyên nhân và tác động (Pain Point Analysis)

### 3.1. Nhóm vấn đề quản lý thông tin

**Các Pain Points liên quan:** PP-01, PP-05, PP-06, PP-11.

**Hiện trạng:**

Thông tin nhân viên, yêu cầu cấp quyền và thông báo nghỉ việc được quản lý phân tán thông qua email, Excel và ứng dụng nhắn tin.

**Nguyên nhân giả định:**

- Không có hệ thống quản lý yêu cầu tập trung.
- Thiếu biểu mẫu và quy tắc kiểm tra dữ liệu thống nhất.
- Việc cập nhật thông tin phụ thuộc vào thao tác thủ công.

**Tác động:**

- Thông tin có thể thiếu hoặc không nhất quán.
- Người xử lý mất thời gian xác minh thông tin.
- Thay đổi dữ liệu có thể không được thông báo đầy đủ.
- Khó kiểm tra phiên bản thông tin mới nhất.

**Hướng cải tiến:**

Tập trung quản lý yêu cầu trên ELAMS, chuẩn hóa dữ liệu đầu vào và quản lý lịch sử cập nhật.

### 3.2. Nhóm vấn đề quản lý nhiệm vụ

**Các Pain Points liên quan:** PP-02, PP-03, PP-08, PP-12.

**Hiện trạng:**

HR, IT và Manager theo dõi nhiệm vụ bằng email hoặc các bảng tính riêng.

**Nguyên nhân giả định:**

- Không có danh sách nhiệm vụ chung.
- Thiếu cơ chế xác định người phụ trách.
- Trạng thái xử lý không được cập nhật tập trung.

**Tác động:**

- Nhiệm vụ có nguy cơ bị bỏ sót.
- Khó xác định trách nhiệm khi chậm trễ.
- HR phải liên hệ thủ công để kiểm tra tiến độ.

**Hướng cải tiến:**

Tự động tạo nhiệm vụ dựa trên quy trình, phân công người phụ trách và cho phép cập nhật trạng thái xử lý trên hệ thống.

### 3.3. Nhóm vấn đề phê duyệt quyền truy cập

**Các Pain Points liên quan:** PP-07, PP-09, PP-10.

**Hiện trạng:**

Các yêu cầu cấp quyền được phê duyệt qua email hoặc tin nhắn. Việc xác định quyền nhạy cảm và kiểm tra phê duyệt được thực hiện thủ công.

**Nguyên nhân giả định:**

- Chưa có luồng phê duyệt được chuẩn hóa trên hệ thống.
- Thiếu danh mục phân loại quyền truy cập.
- Lịch sử phê duyệt không được quản lý tập trung.

**Tác động:**

- Yêu cầu có thể bị chậm phê duyệt.
- IT phải xác minh quyết định phê duyệt.
- Có nguy cơ bỏ sót cấp phê duyệt bắt buộc.
- Khó truy vết trách nhiệm khi phát sinh sự cố.

**Hướng cải tiến:**

Xây dựng quy trình phê duyệt theo mức độ nhạy cảm của quyền truy cập, kiểm tra điều kiện trước khi cấp quyền và lưu lịch sử quyết định.

### 3.4. Nhóm vấn đề kiểm soát thời hạn

**Các Pain Points liên quan:** PP-04, PP-14.

**Hiện trạng:**

Các bộ phận theo dõi thời hạn thực hiện chủ yếu bằng phương pháp thủ công.

**Nguyên nhân giả định:**

- Không có cơ chế quản lý SLA tập trung.
- Thiếu công cụ nhận diện nhiệm vụ quá hạn.
- Việc nhắc nhở phụ thuộc vào từng nhân viên.

**Tác động:**

- Khó kiểm soát tiến độ onboarding.
- Các nhiệm vụ thu hồi quyền có nguy cơ hoàn thành trễ.
- Người quản lý không kịp thời phát hiện công việc bị tồn đọng.

**Hướng cải tiến:**

Quản lý thời hạn xử lý, xác định nhiệm vụ quá hạn và hỗ trợ thông báo cho người phụ trách.

### 3.5. Nhóm vấn đề thu hồi quyền và thiết bị

**Các Pain Points liên quan:** PP-13, PP-15.

**Hiện trạng:**

Việc thu hồi quyền truy cập và thiết bị được theo dõi qua nhiều biểu mẫu và nguồn thông tin khác nhau.

**Nguyên nhân giả định:**

- Thiếu dữ liệu tập trung về tài khoản và thiết bị đã cấp.
- Thiếu cơ chế kiểm soát điều kiện hoàn tất offboarding.
- Việc xử lý ngoại lệ chưa được ghi nhận thống nhất.

**Tác động:**

- Có nguy cơ bỏ sót tài khoản cần thu hồi.
- Khó xác nhận thiết bị đã được hoàn trả.
- HR mất thời gian đối chiếu kết quả giữa các bộ phận.
- Có thể phát sinh rủi ro khi đóng quy trình chưa hoàn tất.

**Hướng cải tiến:**

Theo dõi nhiệm vụ thu hồi trên ELAMS, ghi nhận kết quả và bằng chứng xử lý, kiểm tra các điều kiện bắt buộc trước khi hoàn tất offboarding.

---

## 4. Gap Analysis – Employee Onboarding

| Gap ID | As-Is | Khoảng cách | To-Be đề xuất |
| --- | --- | --- | --- |
| GAP-ON-01 | HR nhập Excel và gửi email | Thiếu nguồn dữ liệu tập trung | HR tạo yêu cầu onboarding trên ELAMS |
| GAP-ON-02 | HR thông báo thủ công cho các bộ phận | Chưa có cơ chế tạo nhiệm vụ thống nhất | Hệ thống tạo nhiệm vụ từ mẫu quy trình |
| GAP-ON-03 | HR liên hệ IT để kiểm tra tiến độ | Không có trạng thái tập trung | Các bên theo dõi nhiệm vụ trực tiếp |
| GAP-ON-04 | IT kiểm tra thông tin qua email | Thiếu kiểm tra dữ liệu đầu vào | Biểu mẫu có trường bắt buộc và validation |
| GAP-ON-05 | IT ghi nhận cấp thiết bị thủ công | Thiếu lịch sử cấp phát tập trung | Ghi nhận thiết bị được bàn giao cho nhân viên |
| GAP-ON-06 | HR tự đối chiếu kết quả để hoàn tất | Thiếu kiểm tra điều kiện hoàn tất | Hệ thống kiểm tra nhiệm vụ bắt buộc |

**Mục tiêu nghiệp vụ liên quan:** BG-01, BG-02, BG-04.

**Kết quả mong đợi:**

Quy trình onboarding được quản lý tập trung, từng nhiệm vụ có người phụ trách, thời hạn và trạng thái. HR có thể xác nhận tiến độ mà không cần đối chiếu nhiều email hoặc bảng tính.

## 5. Gap Analysis – Access Request & Approval

| Gap ID | As-Is | Khoảng cách | To-Be đề xuất |
| --- | --- | --- | --- |
| GAP-AC-01 | Nhân viên gửi email yêu cầu quyền | Thiếu biểu mẫu chuẩn | Tạo yêu cầu cấp quyền trên hệ thống |
| GAP-AC-02 | Manager phê duyệt qua email | Thiếu danh sách chờ duyệt tập trung | Manager xử lý yêu cầu trong Approval Inbox |
| GAP-AC-03 | IT xác định quyền nhạy cảm thủ công | Thiếu phân loại quyền thống nhất | Hệ thống xác định luồng duyệt theo danh mục quyền |
| GAP-AC-04 | Phê duyệt Security qua email | Thiếu kiểm soát trình tự phê duyệt | Hỗ trợ phê duyệt nhiều cấp |
| GAP-AC-05 | IT xác minh phê duyệt thủ công | Thiếu kiểm tra trạng thái trước khi cấp quyền | Chỉ cho phép ghi nhận cấp quyền khi đủ phê duyệt |
| GAP-AC-06 | Quyết định nằm trong nhiều email | Thiếu lịch sử truy vết | Lưu người duyệt, kết quả, lý do và thời điểm |
| GAP-AC-07 | Yêu cầu bổ sung thông tin qua email | Thiếu trạng thái xử lý bổ sung | Quản lý trạng thái chờ bổ sung và gửi lại |

**Mục tiêu nghiệp vụ liên quan:** BG-03, BG-05.

**Kết quả mong đợi:**

Các yêu cầu cấp quyền được quản lý theo quy trình phê duyệt rõ ràng. IT có thể kiểm tra tính hợp lệ trước khi thực hiện và hệ thống lưu đầy đủ lịch sử quyết định.

## 6. Gap Analysis – Employee Offboarding

| Gap ID | As-Is | Khoảng cách | To-Be đề xuất |
| --- | --- | --- | --- |
| GAP-OFF-01 | HR gửi email thông báo nghỉ việc | Thiếu yêu cầu tập trung | HR tạo yêu cầu offboarding |
| GAP-OFF-02 | IT xác định tài khoản cần thu hồi thủ công | Thiếu danh sách nhiệm vụ thu hồi tập trung | Tạo và theo dõi nhiệm vụ thu hồi quyền |
| GAP-OFF-03 | IT và HR theo dõi thu hồi thiết bị riêng lẻ | Thiếu dữ liệu bàn giao tập trung | Ghi nhận thiết bị và trạng thái thu hồi |
| GAP-OFF-04 | HR đối chiếu kết quả thủ công | Thiếu điều kiện kiểm tra thống nhất | Kiểm tra nhiệm vụ bắt buộc trước khi hoàn tất |
| GAP-OFF-05 | Ngoại lệ được xử lý qua trao đổi thủ công | Thiếu lịch sử và kiểm soát ngoại lệ | Ghi nhận ngoại lệ, bằng chứng và quyết định |
| GAP-OFF-06 | Ngày nghỉ việc thay đổi qua email | Thiếu cơ chế đồng bộ thay đổi | Cập nhật thời hạn liên quan khi ngày nghỉ thay đổi |
| GAP-OFF-07 | IT nhận thông báo nghỉ việc đột xuất | Chưa có cơ chế ưu tiên tập trung | Đánh dấu và xử lý yêu cầu thu hồi khẩn |
| GAP-OFF-08 | HR khó biết nhiệm vụ nào quá hạn | Thiếu công cụ giám sát SLA | Theo dõi thời hạn và cảnh báo quá hạn |

**Mục tiêu nghiệp vụ liên quan:** BG-01, BG-02, BG-03, BG-04, BG-05.

**Kết quả mong đợi:**

Doanh nghiệp có khả năng kiểm soát tiến độ offboarding, xác định nhiệm vụ thu hồi chưa hoàn thành và ghi nhận các ngoại lệ trước khi đóng quy trình.

---

## 7. Xác định cơ hội cải tiến (Improvement Opportunities)

| ID | Cơ hội cải tiến | Giá trị nghiệp vụ |
| --- | --- | --- |
| IMP-01 | Chuẩn hóa biểu mẫu yêu cầu | Giảm dữ liệu thiếu hoặc sai |
| IMP-02 | Tạo nhiệm vụ theo mẫu quy trình | Hạn chế bỏ sót công việc |
| IMP-03 | Xây dựng Approval Workflow | Tăng tính nhất quán của quyết định |
| IMP-04 | Kiểm tra điều kiện cấp quyền | Giảm rủi ro thực hiện sai phê duyệt |
| IMP-05 | Theo dõi trạng thái và SLA | Cải thiện khả năng giám sát |
| IMP-06 | Quản lý bàn giao thiết bị | Tăng khả năng truy vết tài sản |
| IMP-07 | Quản lý ngoại lệ có phê duyệt | Kiểm soát các trường hợp không theo quy trình chuẩn |
| IMP-08 | Audit Log | Hỗ trợ kiểm tra trách nhiệm và lịch sử |
| IMP-09 | Dashboard & Reports | Hỗ trợ theo dõi các chỉ số vận hành |

## 8. Đề xuất mức độ ưu tiên

Sử dụng phương pháp MoSCoW:

| Gap ID | Mức ưu tiên | Lý do |
| --- | --- | --- |
| GAP-ON-01 | Must | Chức năng nền tảng của onboarding |
| GAP-ON-02 | Must | Đảm bảo nhiệm vụ được tạo và phân công |
| GAP-ON-03 | Must | Phục vụ theo dõi tiến độ |
| GAP-ON-04 | Must | Kiểm soát dữ liệu đầu vào |
| GAP-ON-05 | Must | Phục vụ bàn giao thiết bị |
| GAP-ON-06 | Must | Kiểm soát điều kiện hoàn tất |
| GAP-AC-01 | Must | Chức năng nền tảng của Access Request |
| GAP-AC-02 | Must | Phục vụ phê duyệt |
| GAP-AC-03 | Must | Xác định đúng cấp phê duyệt |
| GAP-AC-04 | Must | Kiểm soát quyền nhạy cảm |
| GAP-AC-05 | Must | Ngăn cấp quyền chưa được duyệt |
| GAP-AC-06 | Must | Truy vết quyết định |
| GAP-AC-07 | Must | Hoàn thiện luồng bổ sung thông tin |
| GAP-OFF-01 | Must | Chức năng nền tảng của offboarding |
| GAP-OFF-02 | Must | Quản lý nhiệm vụ thu hồi |
| GAP-OFF-03 | Must | Quản lý bàn giao tài sản |
| GAP-OFF-04 | Must | Kiểm soát điều kiện đóng quy trình |
| GAP-OFF-05 | Must | Xử lý ngoại lệ có kiểm soát |
| GAP-OFF-06 | Should | Đồng bộ thay đổi thời hạn |
| GAP-OFF-07 | Must | Hỗ trợ xử lý tình huống khẩn |
| GAP-OFF-08 | Should | Cảnh báo quá hạn tự động |

Các mức ưu tiên này là đề xuất ban đầu. Riêng kiểm soát thu hồi quyền khẩn cấp vẫn thuộc phạm vi Must, dù cơ chế thông báo nâng cao có thể triển khai sau.

## 9. Ma trận liên kết từ vấn đề đến giải pháp

| Vấn đề | Business Goal | Gap | Cơ hội cải tiến |
| --- | --- | --- | --- |
| PP-02: Khó theo dõi onboarding | BG-02 | GAP-ON-03 | IMP-05 |
| PP-03: Phân công thủ công | BG-02 | GAP-ON-02 | IMP-02 |
| PP-07: Phê duyệt khó theo dõi | BG-03 | GAP-AC-02 | IMP-03 |
| PP-09: Phân loại quyền thủ công | BG-03 | GAP-AC-03 | IMP-03 |
| PP-10: Lịch sử phê duyệt phân tán | BG-05 | GAP-AC-06 | IMP-08 |
| PP-12: Dễ bỏ sót nhiệm vụ thu hồi | BG-03 | GAP-OFF-02 | IMP-02 |
| PP-13: Khó xác minh thiết bị | BG-04 | GAP-OFF-03 | IMP-06 |
| PP-15: HR đối chiếu nhiều nguồn | BG-01 | GAP-OFF-04 | IMP-07 |

Ma trận trên là các liên kết tiêu biểu; các tài liệu yêu cầu sau này sẽ mở rộng quan hệ truy vết cho toàn bộ yêu cầu thuộc phạm vi MVP.

## 10. Giả định và vấn đề cần xác minh

> **Ghi chú (21/11/2026):** Các câu hỏi dưới đây đã được gộp vào [Open Questions Log](../discovery/open-questions-log.md) với mã mới `Q-xx`. Bảng này được giữ để truy vết; theo dõi và cập nhật trạng thái tại Open Questions Log.

| ID | Vấn đề | Nhóm liên quan |
| --- | --- | --- |
| GA-01 | Những mẫu nhiệm vụ nào cần tạo khi onboarding? | HR, IT |
| GA-02 | Ai có quyền thay đổi người phụ trách nhiệm vụ? | HR, Manager |
| GA-03 | Danh mục quyền nhạy cảm được quản lý bởi ai? | Security |
| GA-04 | Ai được quyền phê duyệt ngoại lệ thiết bị? | HR, Manager |
| GA-05 | Điều kiện nào cho phép đóng offboarding khi vẫn còn nghĩa vụ bàn giao? | HR, Manager, IT |
| GA-06 | Cách tính SLA và xử lý nhiệm vụ quá hạn? | HR, IT |
| GA-07 | Quy trình thu hồi quyền khẩn cần hoàn thành trong thời hạn nào? | Security, IT |
| GA-08 | Hệ thống quản lý thiết bị ở mức danh mục hay theo từng tài sản cụ thể? | IT |

Các nội dung chưa có câu trả lời cần được ghi vào Open Questions Log, không được tự động coi là chính sách đã được phê duyệt.

## 11. Kết luận

Kết quả Gap Analysis cho thấy nhu cầu cải tiến trọng tâm của TechNova là:

1. Chuyển từ quản lý yêu cầu phân tán sang quản lý tập trung.
2. Chuẩn hóa hoạt động tạo và phân công nhiệm vụ.
3. Kiểm soát quy trình phê duyệt quyền truy cập.
4. Quản lý việc thu hồi quyền và thiết bị.
5. Hỗ trợ theo dõi thời hạn, ngoại lệ và lịch sử hoạt động.

Các khoảng cách đã được ghi nhận sẽ là đầu vào cho việc thiết kế [BPMN To-Be](to-be/).

Khi triển khai ELAMS thành phần mềm thực tế, các cải tiến sẽ tiếp tục được chuyển thành Functional Requirements, Business Rules, thiết kế dữ liệu, API và Acceptance Criteria.

**Trạng thái tài liệu:** Draft – Đề xuất, chưa được xác nhận bởi stakeholder thực tế.
