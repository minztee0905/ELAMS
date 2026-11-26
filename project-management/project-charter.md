# TÀI LIỆU KHỞI TẠO DỰ ÁN (PROJECT CHARTER)

**Tên dự án:** Hệ thống quản lý vòng đời nhân viên và quyền truy cập (Employee Lifecycle & Access Management System – ELAMS)

**Doanh nghiệp:** TechNova (Doanh nghiệp giả định)

**Phiên bản:** 1.0 – Bản nháp

**Ngày tạo:** 20/11/2026

**Loại dự án:** Phân tích nghiệp vụ và thiết kế hệ thống

---

## 1. Bối cảnh doanh nghiệp (Business Background)

TechNova là một doanh nghiệp công nghệ giả định với quy mô khoảng 500 nhân viên, bao gồm nhiều phòng ban như Nhân sự (HR), Công nghệ thông tin (IT), Kế toán, Kinh doanh và các bộ phận quản lý.

Hiện tại, các quy trình tiếp nhận nhân viên mới (Onboarding) và xử lý nhân viên nghỉ việc (Offboarding) chủ yếu được thực hiện thủ công thông qua email, bảng tính Excel và các ứng dụng nhắn tin.

Việc phối hợp giữa các phòng ban chưa được quản lý trên một hệ thống tập trung, dẫn đến khó khăn trong việc theo dõi tiến độ, phân công trách nhiệm và kiểm soát quyền truy cập của nhân viên.

## 2. Vấn đề nghiệp vụ (Problem Statement)

Doanh nghiệp đang gặp phải những vấn đề chính sau:

### 2.1. Quy trình tiếp nhận nhân viên mới chưa được chuẩn hóa

- Bộ phận HR phải thông báo thủ công cho IT khi có nhân viên mới.
- Các nhiệm vụ như tạo tài khoản, cấp quyền truy cập và chuẩn bị thiết bị có thể bị bỏ sót hoặc chậm trễ.
- Không có hệ thống tập trung để theo dõi tiến độ tiếp nhận nhân viên.

### 2.2. Quản lý quyền truy cập thiếu nhất quán

- Các yêu cầu cấp quyền chủ yếu được gửi qua email hoặc tin nhắn.
- Việc phê duyệt chưa có quy trình thống nhất.
- Khó truy vết lịch sử cấp, thay đổi hoặc thu hồi quyền.

### 2.3. Quy trình nghỉ việc tiềm ẩn rủi ro bảo mật

- Tài khoản của nhân viên nghỉ việc có thể chưa được vô hiệu hóa đúng thời hạn.
- Khó kiểm soát việc thu hồi quyền truy cập và thiết bị công ty.
- Thiếu cơ chế xác nhận các nhiệm vụ bắt buộc đã hoàn tất.

### 2.4. Thiếu công cụ giám sát và báo cáo

- Người quản lý khó theo dõi trạng thái xử lý của từng yêu cầu.
- Không có dữ liệu tập trung để đánh giá thời gian và hiệu quả xử lý.
- Việc xác định bộ phận hoặc nhiệm vụ bị chậm trễ còn gặp khó khăn.

## 3. Mục tiêu nghiệp vụ (Business Objectives)

Dự án ELAMS được đề xuất nhằm đạt được những mục tiêu sau:

- **BO-01:** Xây dựng một hệ thống tập trung để quản lý quy trình tiếp nhận và nghỉ việc của nhân viên.
- **BO-02:** Chuẩn hóa quy trình yêu cầu, phê duyệt, cấp và thu hồi quyền truy cập.
- **BO-03:** Tăng khả năng theo dõi nhiệm vụ, người phụ trách và thời hạn hoàn thành.
- **BO-04:** Hỗ trợ quản lý việc cấp phát và thu hồi thiết bị CNTT.
- **BO-05:** Lưu trữ lịch sử thao tác và phê duyệt nhằm tăng khả năng kiểm tra, truy vết.
- **BO-06:** Cung cấp báo cáo và bảng điều khiển giúp nhà quản lý giám sát hiệu quả quy trình.

## 4. Phạm vi dự án (Project Scope)

### 4.1. Trong phạm vi (In Scope)

Hệ thống dự kiến bao gồm các phân hệ:

#### 1. Quản lý tiếp nhận nhân viên mới (Employee Onboarding)

- Tạo yêu cầu tiếp nhận nhân viên mới.
- Phân công nhiệm vụ cho các bộ phận liên quan.
- Theo dõi tiến độ xử lý.
- Xác nhận hoàn tất quy trình tiếp nhận.

#### 2. Quản lý nhân viên nghỉ việc (Employee Offboarding)

- Tạo yêu cầu nghỉ việc.
- Phân công nhiệm vụ thu hồi quyền truy cập và thiết bị.
- Theo dõi trạng thái xử lý.
- Xác nhận hoàn tất quy trình nghỉ việc.

#### 3. Quản lý yêu cầu quyền truy cập (Access Request & Approval)

- Tạo yêu cầu cấp hoặc thu hồi quyền truy cập.
- Phê duyệt hoặc từ chối yêu cầu.
- Theo dõi trạng thái yêu cầu.
- Lưu trữ lịch sử phê duyệt.

#### 4. Quản lý thiết bị CNTT (IT Asset Management)

- Theo dõi danh sách thiết bị.
- Ghi nhận việc cấp phát thiết bị cho nhân viên.
- Ghi nhận việc thu hồi thiết bị.
- Theo dõi trạng thái thiết bị.

#### 5. Quản lý nhiệm vụ và thời hạn xử lý (Task & SLA Management)

- Tự động tạo hoặc phân công nhiệm vụ theo quy trình.
- Theo dõi thời hạn xử lý.
- Cảnh báo các nhiệm vụ quá hạn.

#### 6. Báo cáo và lịch sử hoạt động (Dashboard & Audit Log)

- Thống kê số lượng yêu cầu theo trạng thái.
- Theo dõi các nhiệm vụ đang xử lý hoặc quá hạn.
- Lưu trữ lịch sử thao tác quan trọng trong hệ thống.

### 4.2. Ngoài phạm vi (Out of Scope)

Dự án không bao gồm:

- Quản lý tuyển dụng nhân sự.
- Quản lý bảng lương.
- Quản lý chấm công và nghỉ phép.
- Đánh giá hiệu suất làm việc.
- Tích hợp thực tế với Active Directory, Microsoft Entra ID hoặc các hệ thống quản lý tài khoản doanh nghiệp.
- Tự động vô hiệu hóa tài khoản trên các hệ thống bên ngoài.

## 5. Các bên liên quan (Key Stakeholders)

| Bên liên quan | Vai trò |
| --- | --- |
| Nhân viên nhân sự (HR Staff) | Khởi tạo và theo dõi quy trình tiếp nhận, nghỉ việc |
| Nhân viên CNTT (IT Staff) | Xử lý cấp/thu hồi quyền và thiết bị |
| Trưởng bộ phận (Department Manager) | Xác nhận nhu cầu, phê duyệt các yêu cầu thuộc thẩm quyền |
| Nhân viên (Employee) | Thực hiện các nhiệm vụ được phân công, xác nhận bàn giao |
| Người phê duyệt bảo mật (Security Approver) | Xét duyệt các yêu cầu truy cập cần kiểm soát đặc biệt |
| Quản trị viên hệ thống (System Administrator) | Quản lý người dùng, vai trò và cấu hình hệ thống |

## 6. Kết quả mong đợi (Expected Outcomes)

Sau khi hệ thống được triển khai, doanh nghiệp kỳ vọng:

- Giảm các nhiệm vụ bị bỏ sót trong quá trình tiếp nhận và nghỉ việc.
- Tăng tính minh bạch trong việc phân công và theo dõi công việc.
- Hỗ trợ kiểm soát tốt hơn việc cấp và thu hồi quyền truy cập.
- Nâng cao khả năng quản lý thiết bị CNTT.
- Hỗ trợ các bộ phận phối hợp hiệu quả thông qua quy trình thống nhất.

Các kết quả trên là kỳ vọng nghiệp vụ. Chỉ số mục tiêu cụ thể và phương pháp đo lường sẽ được xác định trong giai đoạn phân tích yêu cầu.

## 7. Sản phẩm bàn giao (Project Deliverables)

Dự án dự kiến cung cấp các sản phẩm dưới đây. Mức ưu tiên được bổ sung ngày 21/11/2026 theo đề xuất RM-04 trong [roadmap-change-proposals.md](roadmap-change-proposals.md):

- **Cốt lõi:** làm đầy đủ, là phần chính của portfolio.
- **Rút gọn:** làm ở mức tiêu biểu, đủ thể hiện kỹ năng.

| STT | Sản phẩm | Mức | Mức độ thực hiện |
| --- | --- | --- | --- |
| 1 | Tài liệu khởi tạo dự án (Project Charter) | Cốt lõi | Đã có bản nháp |
| 2 | Tài liệu phân tích các bên liên quan (Stakeholder Analysis) | Cốt lõi | Đã có bản nháp |
| 3 | Tài liệu yêu cầu nghiệp vụ (BRD) | Cốt lõi | Bản rút gọn, khoảng 8–12 trang |
| 4 | Tài liệu đặc tả yêu cầu phần mềm (SRS) | Rút gọn | Tập trung yêu cầu chức năng và phi chức năng chính |
| 5 | Sơ đồ quy trình nghiệp vụ BPMN (As-Is và To-Be) | Cốt lõi | Đầy đủ 3 quy trình; To-Be của Access Request và Offboarding ở mức nghiệp vụ |
| 6 | Sơ đồ Use Case và đặc tả Use Case | Cốt lõi | Sơ đồ tổng thể; 4–6 đặc tả cho các use case chính |
| 7 | Sơ đồ Activity, Sequence và State | Rút gọn | Mỗi loại 1 sơ đồ tiêu biểu |
| 8 | Sơ đồ thực thể liên kết (ERD) | Rút gọn | Mức khái niệm/logic, kèm data dictionary ngắn |
| 9 | Danh mục quy tắc nghiệp vụ (Business Rules Catalog) | Cốt lõi | Đầy đủ cho phạm vi MVP |
| 10 | Thiết kế giao diện và prototype bằng Figma | Cốt lõi | Các luồng chính của Onboarding và Approval Inbox |
| 11 | User Stories và Acceptance Criteria | Cốt lõi | Theo các module Must |
| 12 | Ma trận truy vết yêu cầu (RTM) | Cốt lõi | BG → REQ → Use Case/Story → Màn hình → UAT |
| 13 | Kịch bản kiểm thử chấp nhận người dùng (UAT Test Cases) | Rút gọn | Khoảng 10–15 test case cho luồng chính và ngoại lệ quan trọng |
| 14 | Nhật ký review với người thật (Review Log) | Cốt lõi | Ít nhất một lượt review (RM-07) |
| 15 | Case study portfolio | Cốt lõi | Một trang tóm tắt; có thể thêm bản tiếng Anh |

Thứ tự thực hiện xem tại [Roadmap](roadmap.md).

## 8. Giả định và ràng buộc (Assumptions & Constraints)

### Giả định

- TechNova là doanh nghiệp giả định phục vụ mục đích xây dựng portfolio BA.
- Doanh nghiệp có quy trình phối hợp giữa HR, IT và các trưởng bộ phận.
- Các chính sách cấp quyền, thu hồi thiết bị và thời hạn xử lý sẽ được xây dựng dưới dạng giả định và ghi rõ trong tài liệu nghiệp vụ.
- Các bên liên quan được mô phỏng để thực hành thu thập và phân tích yêu cầu.

### Ràng buộc

- Dự án được thực hiện bởi một cá nhân.
- Trọng tâm là phân tích nghiệp vụ, thiết kế hệ thống và giao diện.
- Việc cấp và thu hồi quyền trên hệ thống bên ngoài chỉ được mô phỏng, không thực hiện tích hợp thực tế.
