# PHÂN TÍCH CÁC BÊN LIÊN QUAN (STAKEHOLDER ANALYSIS)

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 1.0 – Bản nháp

**Ngày tạo:** 20/11/2026

**Trạng thái:** Chưa xác nhận với stakeholder thực tế

---

## 1. Mục đích tài liệu

Tài liệu này được xây dựng nhằm xác định các bên liên quan đến dự án ELAMS, phân tích vai trò, trách nhiệm, nhu cầu, khó khăn và mức độ ảnh hưởng của từng bên.

Kết quả phân tích được sử dụng để hỗ trợ thu thập yêu cầu nghiệp vụ, xác định phạm vi chức năng và thiết kế quy trình phù hợp với nhu cầu của doanh nghiệp.

## 2. Danh sách các bên liên quan (Stakeholder Register)

| ID | Stakeholder | Vai trò trong dự án |
| --- | --- | --- |
| ST-01 | Ban lãnh đạo / Project Sponsor | Phê duyệt mục tiêu, phạm vi và định hướng dự án |
| ST-02 | HR Staff | Khởi tạo và quản lý quy trình tiếp nhận, nghỉ việc |
| ST-03 | IT Staff | Thực hiện cấp, thu hồi quyền và quản lý thiết bị |
| ST-04 | Department Manager | Xác nhận nhu cầu và phê duyệt yêu cầu thuộc thẩm quyền |
| ST-05 | Security Approver | Phê duyệt quyền truy cập nhạy cảm theo chính sách |
| ST-06 | Employee | Thực hiện nhiệm vụ và xác nhận bàn giao |
| ST-07 | System Administrator | Quản trị người dùng, vai trò và cấu hình hệ thống |
| ST-08 | Business Analyst | Phân tích, đặc tả và xác thực yêu cầu hệ thống |

## 3. Phân tích nhu cầu và khó khăn của Stakeholder

### 3.1. HR Staff (Nhân viên nhân sự)

**Trách nhiệm:**

- Tạo yêu cầu onboarding và offboarding.
- Cập nhật thông tin nhân viên.
- Theo dõi tiến độ thực hiện các nhiệm vụ.
- Phối hợp với IT và các trưởng bộ phận.

**Pain Points:**

- Phải gửi email hoặc tin nhắn đến nhiều bộ phận.
- Khó theo dõi nhiệm vụ nào đã hoàn thành.
- Không biết ai chịu trách nhiệm khi công việc bị chậm trễ.

**Needs:**

- Tạo và theo dõi yêu cầu tập trung.
- Tự động phân công nhiệm vụ theo quy trình.
- Nhận thông báo khi nhiệm vụ hoàn thành hoặc quá hạn.
- Theo dõi trạng thái tổng thể của từng nhân viên.

### 3.2. IT Staff (Nhân viên CNTT)

**Trách nhiệm:**

- Tiếp nhận nhiệm vụ cấp và thu hồi tài khoản.
- Thực hiện thay đổi quyền truy cập đã được phê duyệt.
- Cấp phát và thu hồi thiết bị CNTT.
- Cập nhật kết quả thực hiện nhiệm vụ.

**Pain Points:**

- Yêu cầu được gửi qua nhiều kênh khác nhau.
- Thông tin yêu cầu có thể không đầy đủ.
- Khó theo dõi thứ tự ưu tiên và thời hạn xử lý.

**Needs:**

- Danh sách nhiệm vụ rõ ràng.
- Thông tin nhân viên và quyền cần cấp hoặc thu hồi đầy đủ.
- Trạng thái phê duyệt trước khi thực hiện.
- Công cụ theo dõi thiết bị được bàn giao.

### 3.3. Department Manager (Trưởng bộ phận)

**Trách nhiệm:**

- Xác nhận nhu cầu cấp quyền cho nhân viên.
- Phê duyệt hoặc từ chối yêu cầu thuộc thẩm quyền.
- Theo dõi tiến độ onboarding và offboarding của nhân viên trong bộ phận.

**Pain Points:**

- Khó xác định yêu cầu nào đang chờ phê duyệt.
- Thiếu thông tin để đưa ra quyết định.
- Không có lịch sử tập trung của các yêu cầu đã duyệt.

**Needs:**

- Danh sách yêu cầu chờ phê duyệt.
- Thông tin chi tiết và lý do yêu cầu.
- Chức năng phê duyệt hoặc từ chối.
- Khả năng xem lịch sử quyết định.

### 3.4. Security Approver (Người phê duyệt bảo mật)

**Trách nhiệm:**

- Đánh giá yêu cầu truy cập có mức độ nhạy cảm cao.
- Phê duyệt hoặc từ chối theo chính sách bảo mật.
- Kiểm tra lịch sử phê duyệt khi cần thiết.

**Pain Points:**

- Không có quy trình phân loại quyền nhạy cảm thống nhất.
- Khó truy vết ai đã phê duyệt một quyền truy cập.
- Thiếu thông tin để đánh giá rủi ro.

**Needs:**

- Phân loại quyền truy cập theo mức độ nhạy cảm.
- Yêu cầu có đầy đủ lý do và thông tin liên quan.
- Lịch sử phê duyệt và thao tác.
- Cơ chế từ chối hoặc yêu cầu bổ sung thông tin.

### 3.5. Employee (Nhân viên)

**Trách nhiệm:**

- Cung cấp hoặc xác nhận thông tin cần thiết.
- Thực hiện các nhiệm vụ được giao.
- Xác nhận bàn giao hoặc hoàn trả thiết bị.

**Pain Points:**

- Không biết tiến độ xử lý yêu cầu.
- Phải liên hệ nhiều bộ phận để hỏi thông tin.
- Khó xác định những nhiệm vụ bản thân cần thực hiện.

**Needs:**

- Xem các nhiệm vụ liên quan đến mình.
- Theo dõi trạng thái yêu cầu.
- Nhận thông báo khi cần thực hiện hành động.
- Xác nhận hoàn tất nhiệm vụ được giao.

### 3.6. System Administrator (Quản trị viên hệ thống)

**Trách nhiệm:**

- Quản lý người dùng và vai trò.
- Cấu hình danh mục và một số chính sách hệ thống.
- Theo dõi hoạt động quản trị.

**Pain Points:**

- Khó kiểm soát quyền truy cập khi phân quyền thủ công.
- Thiếu lịch sử thay đổi cấu hình.
- Khó quản lý các nhóm người dùng khác nhau.

**Needs:**

- Quản lý tài khoản và phân quyền theo vai trò.
- Cấu hình các danh mục phục vụ quy trình.
- Theo dõi lịch sử thay đổi quan trọng.
- Kiểm soát quyền truy cập vào chức năng quản trị.

## 4. Ma trận mức độ ảnh hưởng và quan tâm (Power–Interest Matrix)

| Stakeholder | Mức ảnh hưởng | Mức quan tâm | Chiến lược |
| --- | --- | --- | --- |
| Project Sponsor | Cao | Cao | Quản lý chặt chẽ |
| HR Staff | Trung bình | Cao | Tham gia thường xuyên |
| IT Staff | Trung bình | Cao | Tham gia thường xuyên |
| Department Manager | Cao | Cao | Quản lý chặt chẽ |
| Security Approver | Cao | Cao | Quản lý chặt chẽ |
| Employee | Thấp | Trung bình | Cập nhật thông tin |
| System Administrator | Trung bình | Cao | Tham gia thường xuyên |

Các mức đánh giá là giả định ban đầu và có thể thay đổi sau khi làm rõ cơ cấu tổ chức.

## 5. Ma trận trách nhiệm RACI

Quy ước:

- **R – Responsible:** Người thực hiện.
- **A – Accountable:** Người chịu trách nhiệm cuối cùng.
- **C – Consulted:** Người được tham vấn.
- **I – Informed:** Người được thông báo.

| Hoạt động | HR | IT | Manager | Security |
| --- | --- | --- | --- | --- |
| Khởi tạo onboarding | A/R | I | C | I |
| Xác nhận nhu cầu cấp quyền thông thường | C | I | A/R | I |
| Phê duyệt quyền nhạy cảm | I | C | C | A/R |
| Cấp tài khoản theo yêu cầu được duyệt | I | A/R | I | I |
| Cấp phát thiết bị | C | A/R | I | I |
| Khởi tạo offboarding | A/R | I | C | I |
| Thu hồi quyền truy cập | I | A/R | I | C |
| Thu hồi thiết bị | C | A/R | I | I |
| Xác nhận hoàn tất offboarding | A/R | C | C | I |

**Lưu ý:** RACI trên là mô hình trách nhiệm đề xuất. Vai trò chịu trách nhiệm cuối cùng cần được xác minh khi xây dựng chính sách phê duyệt và quy trình To-Be.

## 6. Kế hoạch tương tác với Stakeholder

| Stakeholder | Phương pháp đề xuất | Nội dung cần làm rõ |
| --- | --- | --- |
| Project Sponsor | Phỏng vấn | Mục tiêu, KPI, phạm vi, ưu tiên |
| HR Staff | Phỏng vấn, quan sát quy trình giả lập | Onboarding, offboarding, dữ liệu nhân viên |
| IT Staff | Phỏng vấn, walkthrough | Cấp quyền, thu hồi quyền, quản lý thiết bị |
| Department Manager | Phỏng vấn | Quyền phê duyệt, chính sách và ngoại lệ |
| Security Approver | Phỏng vấn chuyên sâu | Quyền nhạy cảm, chính sách bảo mật |
| Employee | Khảo sát hoặc phỏng vấn | Nhu cầu theo dõi và xác nhận nhiệm vụ |
| System Administrator | Workshop | Vai trò, phân quyền và cấu hình |

## 7. Các vấn đề cần xác minh

> **Ghi chú (21/11/2026):** Các câu hỏi dưới đây đã được gộp vào [Open Questions Log](open-questions-log.md) với mã mới `Q-xx`. Bảng này được giữ để truy vết; theo dõi và cập nhật trạng thái tại Open Questions Log.

- Ai có quyền khởi tạo yêu cầu onboarding và offboarding?
- Quyền truy cập nào cần Manager phê duyệt?
- Những quyền nào cần Security Approver phê duyệt thêm?
- IT có được cấp quyền trước khi yêu cầu được phê duyệt không?
- Ai được phép xác nhận hoàn tất offboarding?
- Nếu nhân viên chưa hoàn trả thiết bị, quy trình sẽ được xử lý thế nào?
- Nếu nhiệm vụ quá hạn, hệ thống cần thông báo cho ai?
- Người quản lý có được xem yêu cầu của phòng ban khác không?

## 8. Kết luận

Các bên liên quan chính của ELAMS bao gồm HR, IT, Department Manager và Security Approver. Đây là các nhóm đóng vai trò trực tiếp trong việc khởi tạo, phê duyệt và thực hiện quy trình.

Employee và System Administrator là các nhóm sử dụng hệ thống với nhu cầu và quyền hạn riêng.

Các giả định về trách nhiệm, quyền phê duyệt và nhu cầu nghiệp vụ sẽ tiếp tục được làm rõ trong giai đoạn thu thập yêu cầu trước khi chính thức đặc tả quy trình To-Be và chức năng hệ thống.
