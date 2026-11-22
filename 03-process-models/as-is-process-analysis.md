# PHÂN TÍCH QUY TRÌNH NGHIỆP VỤ HIỆN TẠI (AS-IS PROCESS ANALYSIS)

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 1.0 – Bản nháp

**Ngày tạo:** 20/11/2026

**Trạng thái:** Quy trình giả lập, chưa được xác minh với doanh nghiệp thực tế.

---

## 1. Mục đích tài liệu

Tài liệu mô tả các quy trình nghiệp vụ hiện tại của TechNova trước khi triển khai hệ thống ELAMS.

Mục đích:

- Xác định trình tự thực hiện công việc.
- Xác định trách nhiệm của các bộ phận.
- Xác định thông tin đầu vào và kết quả đầu ra.
- Ghi nhận các điểm ra quyết định và tình huống ngoại lệ.
- Phát hiện những vấn đề và hạn chế trong quy trình hiện tại.
- Làm cơ sở xây dựng BPMN As-Is, Gap Analysis và quy trình To-Be.

Các hoạt động được mô tả dựa trên tình huống doanh nghiệp giả lập và [biên bản phỏng vấn giả lập](../01-discovery/interview-notes.md).

## 2. Tổng quan các quy trình

| ID | Quy trình | Bộ phận tham gia |
| --- | --- | --- |
| AS-01 | Tiếp nhận nhân viên mới (Onboarding) | HR, Manager, IT, Employee |
| AS-02 | Yêu cầu và phê duyệt quyền truy cập | Employee, Manager, Security, IT |
| AS-03 | Xử lý nhân viên nghỉ việc (Offboarding) | HR, Manager, IT, Employee |

---

## 3. AS-01 – Quy trình tiếp nhận nhân viên mới (Onboarding)

### 3.1. Mô tả quy trình

Khi có nhân viên mới được tuyển dụng, bộ phận HR tiếp nhận thông tin và gửi email đến các bộ phận liên quan để chuẩn bị tài khoản, quyền truy cập và thiết bị làm việc.

Việc phối hợp và theo dõi được thực hiện thủ công thông qua email, Excel và tin nhắn.

### 3.2. Thông tin quy trình

| Thuộc tính | Nội dung |
| --- | --- |
| Process ID | AS-01 |
| Tên quy trình | Employee Onboarding |
| Sự kiện bắt đầu | HR nhận thông tin nhân viên đã xác nhận nhận việc |
| Kết quả mong đợi | Nhân viên có tài khoản, quyền truy cập và thiết bị cần thiết |
| Process Owner | HR Department |
| Đơn vị phối hợp | Manager, IT, Employee |
| Công cụ hiện tại | Email, Excel, ứng dụng nhắn tin |

### 3.3. Luồng xử lý chính (Main Flow)

| Bước | Người thực hiện | Hoạt động | Đầu vào | Đầu ra |
| --- | --- | --- | --- | --- |
| 1 | HR | Tiếp nhận thông tin nhân viên mới | Thông tin tuyển dụng | Hồ sơ nhân viên |
| 2 | HR | Nhập thông tin vào Excel | Hồ sơ nhân viên | Danh sách nhân viên cập nhật |
| 3 | HR | Gửi email thông báo cho Manager và IT | Thông tin nhân viên, ngày bắt đầu | Email thông báo |
| 4 | Manager | Xác định tài khoản và quyền truy cập cần thiết | Vị trí, phòng ban | Danh sách quyền yêu cầu |
| 5 | Manager | Gửi yêu cầu cấp quyền cho IT | Danh sách quyền | Email yêu cầu |
| 6 | IT | Kiểm tra thông tin và yêu cầu phê duyệt cần thiết | Email yêu cầu | Yêu cầu đủ điều kiện xử lý hoặc cần bổ sung |
| 7 | IT | Tạo tài khoản và cấp các quyền đã được phê duyệt | Yêu cầu hợp lệ | Tài khoản và quyền truy cập |
| 8 | IT | Chuẩn bị và ghi nhận cấp phát thiết bị | Danh sách thiết bị cần cấp | Thiết bị sẵn sàng bàn giao |
| 9 | IT | Thông báo hoàn tất cho HR | Kết quả xử lý | Email xác nhận |
| 10 | HR | Kiểm tra các công việc đã hoàn thành | Email, Excel | Kết quả kiểm tra |
| 11 | HR | Xác nhận hoàn tất quy trình | Các công việc bắt buộc hoàn thành | Onboarding hoàn tất |

**Giả định:** Những quyền nhạy cảm phải được Security Approver phê duyệt trước khi IT thực hiện. Chi tiết được mô tả tại AS-02.

### 3.4. Luồng thay thế và ngoại lệ

**AF-01 – Thông tin nhân viên không đầy đủ**

- IT phát hiện thiếu thông tin bắt buộc.
- IT gửi yêu cầu bổ sung cho HR.
- HR cập nhật thông tin và gửi lại yêu cầu.
- IT tiếp tục xử lý sau khi có đủ thông tin.

**AF-02 – Thiết bị không đủ để cấp phát**

- IT kiểm tra và phát hiện không còn thiết bị phù hợp.
- IT thông báo cho HR và Manager.
- Các bên phối hợp tìm phương án xử lý.
- Việc bàn giao thiết bị được thực hiện khi có thiết bị phù hợp.

**AF-03 – Quyền truy cập cần phê duyệt bổ sung**

- IT xác định yêu cầu có quyền nhạy cảm.
- Yêu cầu được chuyển đến Security Approver.
- IT chỉ thực hiện cấp quyền sau khi nhận đủ phê duyệt hợp lệ.

**AF-04 – Nhân viên thay đổi ngày bắt đầu làm việc**

- HR nhận thông tin thay đổi.
- HR gửi email cập nhật cho các bộ phận liên quan.
- IT và Manager điều chỉnh kế hoạch xử lý thủ công.

### 3.5. Điểm hạn chế của quy trình

| ID | Pain Point | Tác động |
| --- | --- | --- |
| PP-01 | Thông tin được gửi qua email và Excel | Dễ thiếu hoặc sai lệch dữ liệu |
| PP-02 | HR không có công cụ theo dõi trạng thái tập trung | Khó biết nhiệm vụ nào chưa hoàn thành |
| PP-03 | Việc phân công nhiệm vụ thủ công | Có thể bỏ sót trách nhiệm |
| PP-04 | Thiếu cơ chế tự động cảnh báo quá hạn | Có thể làm chậm tiến độ onboarding |
| PP-05 | Thay đổi thông tin phải gửi lại cho nhiều bên | Dễ xảy ra bất đồng bộ thông tin |

---

## 4. AS-02 – Quy trình yêu cầu và phê duyệt quyền truy cập

### 4.1. Mô tả quy trình

Khi nhân viên cần được cấp quyền truy cập vào một hệ thống nội bộ, yêu cầu được gửi đến Manager để xem xét.

Đối với quyền nhạy cảm, yêu cầu phải được Security Approver phê duyệt bổ sung.

Sau khi hoàn tất phê duyệt, IT thực hiện cấp quyền và thông báo kết quả.

### 4.2. Thông tin quy trình

| Thuộc tính | Nội dung |
| --- | --- |
| Process ID | AS-02 |
| Tên quy trình | Access Request & Approval |
| Sự kiện bắt đầu | Phát sinh nhu cầu cấp quyền |
| Kết quả | Quyền được cấp hoặc yêu cầu bị từ chối |
| Process Owner | Department Manager |
| Bộ phận phối hợp | Employee, Security, IT |
| Công cụ hiện tại | Email, tin nhắn, biểu mẫu thủ công |

### 4.3. Luồng xử lý chính

| Bước | Người thực hiện | Hoạt động | Đầu vào | Đầu ra |
| --- | --- | --- | --- | --- |
| 1 | Employee hoặc Manager | Xác định nhu cầu truy cập | Nhu cầu công việc | Nội dung yêu cầu |
| 2 | Employee hoặc Manager | Gửi yêu cầu qua email | Thông tin quyền, lý do | Email yêu cầu |
| 3 | Manager | Kiểm tra tính phù hợp với công việc | Nội dung yêu cầu | Quyết định phê duyệt hoặc từ chối |
| 4 | Manager | Xác định yêu cầu có cần Security phê duyệt không | Loại quyền | Kết quả phân loại |
| 5 | Security Approver | Xem xét yêu cầu nhạy cảm (nếu có) | Yêu cầu đã được Manager duyệt | Quyết định bảo mật |
| 6 | Manager hoặc Security | Chuyển yêu cầu hợp lệ đến IT | Các phê duyệt | Email yêu cầu thực hiện |
| 7 | IT | Kiểm tra các phê duyệt bắt buộc | Thông tin phê duyệt | Kết quả kiểm tra |
| 8 | IT | Thực hiện cấp quyền | Yêu cầu hợp lệ | Quyền truy cập được cấp |
| 9 | IT | Thông báo kết quả | Kết quả cấp quyền | Email xác nhận |
| 10 | Người yêu cầu | Tiếp nhận kết quả | Email xác nhận | Quy trình kết thúc |

### 4.4. Các điểm quyết định

**D-01 – Manager có phê duyệt không?**

- Có: Tiếp tục xác định loại quyền.
- Không: Thông báo từ chối và kết thúc yêu cầu.

**D-02 – Quyền truy cập có nhạy cảm không?**

- Có: Chuyển đến Security Approver.
- Không: Chuyển đến IT sau khi Manager phê duyệt.

**D-03 – Security Approver có phê duyệt không?**

- Có: Chuyển đến IT.
- Không: Thông báo từ chối và kết thúc yêu cầu.

**D-04 – IT đã nhận đủ phê duyệt hợp lệ chưa?**

- Có: Thực hiện cấp quyền.
- Không: Yêu cầu bổ sung hoặc xác minh phê duyệt trước khi xử lý.

### 4.5. Luồng thay thế và ngoại lệ

**AF-01 – Manager từ chối**

- Manager từ chối yêu cầu.
- Lý do được gửi đến người yêu cầu.
- Quy trình kết thúc mà không cấp quyền.

**AF-02 – Security Approver từ chối**

- Security Approver từ chối quyền nhạy cảm.
- Người yêu cầu được thông báo.
- IT không thực hiện cấp quyền.

**AF-03 – Yêu cầu thiếu thông tin**

- Manager hoặc IT phát hiện thiếu thông tin.
- Người yêu cầu được yêu cầu bổ sung.
- Quy trình tiếp tục sau khi thông tin hợp lệ.

**AF-04 – Người phê duyệt vắng mặt**

- Yêu cầu phải chờ người phê duyệt.
- Việc xử lý thay thế, nếu có, được thực hiện thủ công theo chính sách hiện tại.

### 4.6. Điểm hạn chế

| ID | Pain Point | Tác động |
| --- | --- | --- |
| PP-06 | Yêu cầu không có biểu mẫu chuẩn | Thiếu thông tin bắt buộc |
| PP-07 | Việc phê duyệt qua email khó theo dõi | Dễ thất lạc quyết định |
| PP-08 | Không có danh sách yêu cầu đang chờ duyệt tập trung | Khó kiểm soát tiến độ |
| PP-09 | Việc phân loại quyền nhạy cảm thực hiện thủ công | Có nguy cơ bỏ sót bước phê duyệt |
| PP-10 | Lịch sử phê duyệt phân tán | Khó truy vết trách nhiệm |

---

## 5. AS-03 – Quy trình xử lý nhân viên nghỉ việc (Offboarding)

### 5.1. Mô tả quy trình

Khi nhân viên nghỉ việc, HR gửi thông báo đến Manager và IT.

Các bộ phận thực hiện bàn giao công việc, thu hồi quyền truy cập và thu hồi thiết bị.

HR theo dõi tình trạng hoàn thành và xác nhận kết thúc quy trình.

### 5.2. Thông tin quy trình

| Thuộc tính | Nội dung |
| --- | --- |
| Process ID | AS-03 |
| Tên quy trình | Employee Offboarding |
| Sự kiện bắt đầu | HR xác nhận thông tin nghỉ việc |
| Kết quả mong đợi | Hoàn tất bàn giao, thu hồi quyền và thiết bị |
| Process Owner | HR Department |
| Bộ phận phối hợp | Manager, IT, Employee |
| Công cụ hiện tại | Email, Excel và biểu mẫu bàn giao |

### 5.3. Luồng xử lý chính

| Bước | Người thực hiện | Hoạt động | Đầu vào | Đầu ra |
| --- | --- | --- | --- | --- |
| 1 | HR | Tiếp nhận thông tin nghỉ việc | Thông tin nhân viên, ngày nghỉ | Hồ sơ nghỉ việc |
| 2 | HR | Ghi nhận thông tin vào Excel | Hồ sơ nghỉ việc | Danh sách cập nhật |
| 3 | HR | Thông báo cho Manager và IT | Ngày nghỉ, thông tin nhân viên | Email thông báo |
| 4 | Manager | Xác định và theo dõi công việc bàn giao | Danh sách công việc | Kế hoạch bàn giao |
| 5 | IT | Xác định tài khoản và quyền cần thu hồi | Danh sách tài khoản | Danh sách thu hồi |
| 6 | Employee và Manager | Thực hiện, xác nhận bàn giao công việc | Kế hoạch bàn giao | Xác nhận bàn giao |
| 7 | IT | Thu hồi hoặc vô hiệu hóa quyền theo thời điểm quy định | Danh sách quyền | Kết quả thu hồi |
| 8 | Employee và IT | Bàn giao và kiểm tra thiết bị | Danh sách thiết bị đã cấp | Biên bản bàn giao |
| 9 | IT | Thông báo kết quả thu hồi cho HR | Kết quả thu hồi | Email xác nhận |
| 10 | Manager | Xác nhận hoàn tất bàn giao công việc | Kết quả bàn giao | Xác nhận của Manager |
| 11 | HR | Kiểm tra các nhiệm vụ bắt buộc | Email, Excel và biên bản | Kết quả kiểm tra |
| 12 | HR | Xác nhận hoàn tất offboarding | Các xác nhận cần thiết | Quy trình kết thúc |

**Lưu ý:** Thời điểm thu hồi quyền không nhất thiết trùng với thời điểm bàn giao thiết bị. Quy tắc về ngày nghỉ việc, thời gian vô hiệu hóa và trường hợp nghỉ việc đột xuất sẽ được làm rõ sau.

### 5.4. Luồng thay thế và ngoại lệ

**AF-01 – Nhân viên chưa hoàn trả thiết bị**

- IT ghi nhận thiết bị chưa được thu hồi.
- IT thông báo cho HR và Manager.
- Các bên tiếp tục xử lý việc bàn giao.
- HR chưa xác nhận hoàn tất quy trình nếu không có quyết định xử lý ngoại lệ hợp lệ.

**AF-02 – Không thể thu hồi quyền truy cập**

- IT phát hiện lỗi hoặc trở ngại khi thu hồi.
- IT thông báo đến bộ phận liên quan.
- Sự việc được ghi nhận và theo dõi đến khi giải quyết.
- Việc hoàn tất offboarding phải tuân thủ điều kiện kiểm soát quyền truy cập.

**AF-03 – Thay đổi ngày nghỉ việc**

- HR cập nhật thông tin nghỉ việc.
- HR thông báo cho Manager và IT.
- Các bộ phận điều chỉnh kế hoạch thu hồi và bàn giao.

**AF-04 – Nhân viên nghỉ việc đột xuất**

- HR thông báo tình huống khẩn cấp.
- IT ưu tiên xử lý việc thu hồi quyền truy cập theo chính sách.
- Các nhiệm vụ bàn giao còn lại được tiếp tục theo dõi.

### 5.5. Điểm hạn chế

| ID | Pain Point | Tác động |
| --- | --- | --- |
| PP-11 | Thông tin nghỉ việc được gửi thủ công | Có thể thông báo chậm |
| PP-12 | Không có danh sách nhiệm vụ thu hồi tập trung | Dễ bỏ sót tài khoản |
| PP-13 | Khó xác minh trạng thái thiết bị | Có thể thất lạc thiết bị |
| PP-14 | Thiếu cơ chế giám sát nhiệm vụ quá hạn | Có nguy cơ thu hồi quyền chậm |
| PP-15 | HR phải đối chiếu nhiều nguồn dữ liệu | Khó xác nhận hoàn tất |

---

## 6. Tổng hợp Pain Points

| Nhóm | Pain Point | Quy trình liên quan |
| --- | --- | --- |
| Quản lý dữ liệu | PP-01, PP-05, PP-06 | Onboarding, Access Request |
| Quản lý nhiệm vụ | PP-02, PP-03, PP-08, PP-12 | Onboarding, Access, Offboarding |
| Kiểm soát thời hạn | PP-04, PP-14 | Onboarding, Offboarding |
| Phê duyệt | PP-07, PP-09, PP-10 | Access Request |
| Thu hồi quyền và thiết bị | PP-11, PP-13, PP-15 | Offboarding |

## 7. Các vấn đề cần tiếp tục xác minh

> **Ghi chú (21/11/2026):** Các câu hỏi dưới đây đã được gộp vào [Open Questions Log](../01-discovery/open-questions-log.md) với mã mới `Q-xx`. Bảng này được giữ để truy vết; theo dõi và cập nhật trạng thái tại Open Questions Log.

| ID | Câu hỏi |
| --- | --- |
| OQ-009 | Nhân viên mới có cần xác nhận nhận thiết bị không? |
| OQ-010 | Yêu cầu onboarding được coi là hoàn tất ở thời điểm nào? |
| OQ-011 | Ai phân loại quyền truy cập nhạy cảm? |
| OQ-012 | Có được cấp một phần quyền khi các quyền khác đang chờ duyệt không? |
| OQ-013 | Thời điểm thu hồi quyền được xác định theo ngày hay giờ cụ thể? |
| OQ-014 | Khi không thể thu hồi tài khoản đúng hạn, ai có trách nhiệm xử lý? |
| OQ-015 | Quy trình offboarding có được đóng khi thiết bị chưa hoàn trả nhưng đã có biên bản xử lý ngoại lệ không? |

## 8. Kết luận

Ba quy trình nghiệp vụ hiện tại của TechNova đang phụ thuộc nhiều vào email, Excel và trao đổi thủ công giữa các phòng ban.

Những hạn chế nổi bật bao gồm:

- Thiếu một hệ thống quản lý tập trung.
- Khó kiểm soát tiến độ và trách nhiệm.
- Quy trình phê duyệt chưa thống nhất.
- Thiếu công cụ theo dõi việc thu hồi quyền và thiết bị.
- Khó truy vết thông tin và lịch sử xử lý.

Các quy trình As-Is này sẽ được sử dụng làm cơ sở xây dựng [BPMN As-Is](as-is/), sau đó thực hiện [Gap Analysis](pain-point-and-gap-analysis.md) và đề xuất [quy trình To-Be](to-be/).

**Trạng thái:** Bản mô phỏng phục vụ phân tích, chưa được xác minh với stakeholder thực tế.
