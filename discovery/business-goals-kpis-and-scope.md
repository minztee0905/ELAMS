# MỤC TIÊU NGHIỆP VỤ, KPI VÀ PHẠM VI DỰ ÁN

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 1.0 – Bản nháp

**Ngày tạo:** 20/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Đề xuất – Chưa được xác nhận bởi stakeholder thực tế

---

## 1. Mục đích tài liệu

Tài liệu được xây dựng nhằm xác định mục tiêu nghiệp vụ, các chỉ số đo lường hiệu quả (KPIs), phạm vi triển khai và mức độ ưu tiên của các chức năng trong dự án ELAMS.

Tài liệu là cơ sở để:

- Định hướng quá trình phân tích và thiết kế hệ thống.
- Đảm bảo các yêu cầu chức năng phù hợp với mục tiêu kinh doanh.
- Xác định các tính năng cần ưu tiên trong phiên bản đầu tiên (MVP).
- Kiểm soát việc mở rộng phạm vi dự án.
- Đánh giá mức độ thành công của giải pháp được đề xuất.

## 2. Vấn đề nghiệp vụ cần giải quyết

Dựa trên Project Charter và kết quả khai thác yêu cầu giả lập, TechNova đang gặp các vấn đề chính:

| ID | Vấn đề nghiệp vụ | Tác động |
| --- | --- | --- |
| BP-01 | Quy trình onboarding và offboarding thực hiện qua nhiều công cụ | Khó kiểm soát và theo dõi tiến độ |
| BP-02 | Nhiệm vụ giữa HR, IT và Manager chưa được quản lý tập trung | Dễ bỏ sót hoặc chậm trễ |
| BP-03 | Quy trình phê duyệt quyền truy cập chưa thống nhất | Tăng rủi ro cấp quyền sai |
| BP-04 | Việc thu hồi quyền khi nhân viên nghỉ việc khó kiểm soát | Tiềm ẩn rủi ro bảo mật |
| BP-05 | Thiết bị CNTT được theo dõi thủ công | Khó xác định tình trạng và người sử dụng |
| BP-06 | Thiếu dữ liệu và lịch sử hoạt động tập trung | Khó đánh giá hiệu quả và truy vết |

## 3. Mục tiêu nghiệp vụ (Business Goals)

### BG-01 – Chuẩn hóa quy trình quản lý vòng đời nhân viên

Xây dựng quy trình thống nhất để quản lý việc tiếp nhận và nghỉ việc của nhân viên, giảm sự phụ thuộc vào email, Excel và các hình thức trao đổi thủ công.

**Kết quả mong đợi:**

- Các yêu cầu onboarding/offboarding được quản lý tập trung.
- Mỗi yêu cầu có trạng thái xử lý rõ ràng.
- Các bộ phận thực hiện công việc theo một quy trình thống nhất.

### BG-02 – Nâng cao hiệu quả xử lý nhiệm vụ

Giúp HR, IT và Manager phối hợp hiệu quả hơn thông qua cơ chế phân công, theo dõi tiến độ và cảnh báo quá hạn.

**Kết quả mong đợi:**

- Mỗi nhiệm vụ có người phụ trách và thời hạn.
- Người quản lý có thể theo dõi tiến độ.
- Các nhiệm vụ chậm trễ được phát hiện và xử lý kịp thời.

### BG-03 – Tăng cường kiểm soát quyền truy cập

Chuẩn hóa quy trình yêu cầu, phê duyệt, cấp và thu hồi quyền truy cập của nhân viên.

**Kết quả mong đợi:**

- Các yêu cầu cấp quyền tuân theo quy trình phê duyệt.
- Quyền nhạy cảm được kiểm tra ở cấp phù hợp.
- Hoạt động cấp và thu hồi quyền có lịch sử để truy vết.

### BG-04 – Nâng cao khả năng quản lý thiết bị CNTT

Hỗ trợ IT quản lý thiết bị được cấp phát cho nhân viên và theo dõi việc thu hồi khi nhân viên nghỉ việc.

**Kết quả mong đợi:**

- Có thể xác định thiết bị đang được giao cho nhân viên nào.
- Ghi nhận được trạng thái cấp phát và thu hồi.
- Những trường hợp chưa hoàn trả được theo dõi riêng.

### BG-05 – Nâng cao tính minh bạch và khả năng giám sát

Cung cấp thông tin tổng hợp và lịch sử thao tác để hỗ trợ nhà quản lý theo dõi hiệu quả vận hành.

**Kết quả mong đợi:**

- Có dashboard theo dõi các yêu cầu và nhiệm vụ.
- Có thể xác định nhiệm vụ quá hạn.
- Các quyết định phê duyệt và thao tác quan trọng được lưu lịch sử.

## 4. Chỉ số đo lường hiệu quả (Key Performance Indicators)

### 4.1. Danh sách KPI đề xuất

| KPI ID | Chỉ số | Mục tiêu đề xuất | Liên kết mục tiêu |
| --- | --- | --- | --- |
| KPI-01 | Tỷ lệ nhiệm vụ onboarding hoàn thành đúng SLA | ≥ 95% | BG-01, BG-02 |
| KPI-02 | Tỷ lệ nhiệm vụ offboarding hoàn thành đúng SLA | ≥ 98% | BG-01, BG-02 |
| KPI-03 | Tỷ lệ yêu cầu cấp quyền được phê duyệt hợp lệ trước khi thực hiện | 100% | BG-03 |
| KPI-04 | Tỷ lệ nhiệm vụ thu hồi quyền hoàn thành đúng hạn | 100% | BG-03 |
| KPI-05 | Tỷ lệ thiết bị được ghi nhận bàn giao hoặc thu hồi đầy đủ | ≥ 98% | BG-04 |
| KPI-06 | Tỷ lệ quyết định phê duyệt có lịch sử truy vết | 100% | BG-05 |

Các mục tiêu trên là giả định để xây dựng bài toán BA, chưa được đối chiếu với dữ liệu vận hành thực tế.

### 4.2. Cách tính KPI

**KPI-01 – Tỷ lệ nhiệm vụ onboarding hoàn thành đúng hạn**

Công thức:

Tỷ lệ hoàn thành đúng hạn = (Số nhiệm vụ onboarding hoàn thành trong SLA / Tổng số nhiệm vụ onboarding đến hạn trong kỳ) × 100%

Ví dụ:

- Tổng số nhiệm vụ đến hạn trong kỳ: 100.
- Số nhiệm vụ hoàn thành trong SLA: 96.
- Tỷ lệ hoàn thành đúng hạn: 96%.

**KPI-03 – Tỷ lệ yêu cầu cấp quyền tuân thủ phê duyệt**

Công thức:

Tỷ lệ tuân thủ = (Số yêu cầu cấp quyền đã thực hiện có phê duyệt hợp lệ trước thời điểm thực hiện / Tổng số yêu cầu cấp quyền đã thực hiện) × 100%

Mục tiêu: 100%.

**KPI-04 – Tỷ lệ thu hồi quyền đúng hạn**

Công thức:

Tỷ lệ thu hồi đúng hạn = (Số nhiệm vụ thu hồi quyền hoàn thành đúng hạn / Tổng số nhiệm vụ thu hồi quyền đến hạn trong kỳ) × 100%

Mục tiêu: 100%.

Các trường hợp ngoại lệ, dữ liệu thiếu và nhiệm vụ bị hủy cần được định nghĩa rõ trước khi KPI được sử dụng trong môi trường thực tế.

### 4.3. Phương pháp đo lường

Hệ thống dự kiến lưu trữ:

- Thời điểm tạo yêu cầu.
- Thời điểm bắt đầu xử lý.
- Hạn hoàn thành của nhiệm vụ.
- Thời điểm hoàn thành thực tế.
- Trạng thái nhiệm vụ.
- Lịch sử phê duyệt.
- Lịch sử cấp/thu hồi quyền.
- Lịch sử cấp phát/thu hồi thiết bị.

Các thông tin này được sử dụng để tính toán và hiển thị KPI.

Để đánh giá mức độ cải thiện so với quy trình cũ, doanh nghiệp cần có dữ liệu baseline trước khi triển khai. Trong dự án giả lập, chưa có baseline thực tế nên chưa thể kết luận hệ thống giúp giảm bao nhiêu phần trăm thời gian xử lý.

## 5. Phạm vi dự án (Project Scope)

### 5.1. Phạm vi MVP – Must Have

**Module 01 – Employee Onboarding**

- HR tạo yêu cầu onboarding.
- Nhập thông tin nhân viên mới.
- Theo dõi trạng thái yêu cầu.
- Tạo và phân công các nhiệm vụ cần thiết.
- Xác nhận hoàn tất onboarding khi đáp ứng điều kiện.

**Module 02 – Employee Offboarding**

- HR tạo yêu cầu offboarding.
- Ghi nhận ngày nghỉ việc dự kiến.
- Tạo nhiệm vụ thu hồi tài khoản và thiết bị.
- Theo dõi tiến độ.
- Kiểm tra điều kiện hoàn tất quy trình.

**Module 03 – Access Request & Approval**

- Tạo yêu cầu cấp hoặc thu hồi quyền.
- Hiển thị thông tin và lý do yêu cầu.
- Phê duyệt hoặc từ chối.
- Hỗ trợ nhiều cấp phê duyệt đối với quyền nhạy cảm.
- Lưu lịch sử phê duyệt.

**Module 04 – Task Management**

- Tạo nhiệm vụ từ quy trình.
- Gán người phụ trách.
- Theo dõi trạng thái và thời hạn.
- Cập nhật kết quả thực hiện.
- Xác định nhiệm vụ quá hạn.

**Chức năng nền tảng bắt buộc**

- Đăng nhập giả lập theo vai trò.
- Kiểm soát quyền thao tác theo vai trò.
- Lưu lịch sử các hành động nghiệp vụ quan trọng.
- Ghi nhận việc cấp phát và thu hồi thiết bị gắn với onboarding/offboarding.

### 5.2. Phạm vi mở rộng – Should Have

- Danh mục và màn hình quản lý thiết bị CNTT đầy đủ.
- Dashboard tổng hợp KPI.
- Thông báo nhắc việc và cảnh báo quá hạn.
- Xuất báo cáo.
- Cấu hình mẫu nhiệm vụ theo bộ phận.

### 5.3. Phạm vi có thể bổ sung – Could Have

- Quy trình chuyển phòng ban (Internal Transfer).
- Cơ chế ủy quyền phê duyệt.
- Cơ chế escalation nhiều cấp.
- Quản lý quyền truy cập tạm thời.
- Phân tích xu hướng hiệu quả vận hành.

### 5.4. Ngoài phạm vi – Won't Have

- Tuyển dụng nhân sự.
- Quản lý bảng lương.
- Chấm công và nghỉ phép.
- Đánh giá hiệu suất.
- Tích hợp thực tế với Active Directory hoặc Microsoft Entra ID.
- Tự động điều khiển thiết bị hoặc hệ thống tài khoản bên ngoài.
- Phát triển ứng dụng mobile riêng biệt.

## 6. Danh sách ưu tiên theo MoSCoW

| ID | Chức năng | Mức ưu tiên |
| --- | --- | --- |
| F-01 | Tạo yêu cầu onboarding | Must |
| F-02 | Theo dõi onboarding | Must |
| F-03 | Tạo yêu cầu offboarding | Must |
| F-04 | Theo dõi offboarding | Must |
| F-05 | Yêu cầu cấp/thu hồi quyền | Must |
| F-06 | Phê duyệt nhiều cấp theo chính sách | Must |
| F-07 | Phân công và cập nhật nhiệm vụ | Must |
| F-08 | Kiểm tra điều kiện hoàn tất quy trình | Must |
| F-09 | Ghi nhận bàn giao và thu hồi thiết bị | Must |
| F-10 | Phân quyền theo vai trò | Must |
| F-11 | Ghi lịch sử thao tác quan trọng | Must |
| F-12 | Dashboard KPI | Should |
| F-13 | Thông báo và cảnh báo quá hạn | Should |
| F-14 | Danh mục quản lý thiết bị đầy đủ | Should |
| F-15 | Xuất báo cáo | Should |
| F-16 | Ủy quyền phê duyệt | Could |
| F-17 | Chuyển cấp xử lý tự động | Could |
| F-18 | Quy trình chuyển phòng ban | Could |

Các mức độ ưu tiên được đề xuất theo giá trị nghiệp vụ, rủi ro và khả năng hoàn thành trong phạm vi dự án cá nhân.

## 7. Ràng buộc dự án (Project Constraints)

- Dự án được thực hiện bởi một cá nhân.
- Mục tiêu chính là hoàn thiện hồ sơ phân tích nghiệp vụ và thiết kế hệ thống.
- Thiết kế giao diện thực hiện trên Figma.
- Các nghiệp vụ tích hợp với hệ thống bên ngoài sẽ được mô phỏng.
- Tài liệu sử dụng tiếng Việt, kèm các thuật ngữ BA thông dụng bằng tiếng Anh.

## 8. Giả định dự án (Project Assumptions)

- TechNova có khoảng 500 nhân viên.
- HR chịu trách nhiệm khởi tạo quy trình onboarding và offboarding.
- IT chịu trách nhiệm thực hiện các nhiệm vụ liên quan đến tài khoản và thiết bị.
- Department Manager chịu trách nhiệm xác nhận nhu cầu cấp quyền theo thẩm quyền.
- Security Approver phê duyệt các quyền truy cập nhạy cảm.
- Chính sách phê duyệt và thời hạn SLA sẽ được mô phỏng dựa trên các tình huống nghiệp vụ hợp lý.
- Các giả định sẽ được ghi nhận và rà soát trong quá trình phân tích.

## 9. Các vấn đề chưa được xác nhận (Open Questions)

> **Ghi chú (21/11/2026):** Các câu hỏi dưới đây đã được gộp vào [Open Questions Log](open-questions-log.md) với mã mới `Q-xx`. Bảng này được giữ để truy vết; theo dõi và cập nhật trạng thái tại Open Questions Log.

| ID | Vấn đề cần làm rõ |
| --- | --- |
| OQ-001 | SLA được tính theo giờ làm việc hay thời gian liên tục? |
| OQ-002 | Ai được phép thay đổi thời hạn xử lý nhiệm vụ? |
| OQ-003 | Chính sách phân loại quyền nhạy cảm cụ thể là gì? |
| OQ-004 | Trường hợp không thu hồi được thiết bị có được đóng offboarding không? |
| OQ-005 | Những thao tác nào bắt buộc phải ghi Audit Log? |
| OQ-006 | Ai có quyền xem KPI của toàn doanh nghiệp? |
| OQ-007 | Các nhiệm vụ bị hủy có được tính vào KPI hay không? |
| OQ-008 | Khi thay đổi ngày nghỉ việc, hạn xử lý các nhiệm vụ được tính lại như thế nào? |

## 10. Tiêu chí hoàn thành giai đoạn Business Discovery

Giai đoạn Business Discovery được xem là hoàn tất ở mức bản nháp khi:

- Đã xác định vấn đề nghiệp vụ.
- Đã xác định các bên liên quan.
- Đã xây dựng bộ câu hỏi khai thác yêu cầu.
- Đã ghi nhận các yêu cầu sơ bộ.
- Đã xác định mục tiêu nghiệp vụ và KPI.
- Đã xác định phạm vi MVP.
- Đã lập danh sách giả định và vấn đề chưa được xác nhận.

Các kết quả này là cơ sở để tiếp tục phân tích quy trình nghiệp vụ As-Is và To-Be.

---

## 11. Kết luận

Dự án ELAMS tập trung giải quyết các vấn đề trong việc quản lý quy trình tiếp nhận, nghỉ việc và kiểm soát quyền truy cập của nhân viên.

Phiên bản MVP ưu tiên các nghiệp vụ onboarding, offboarding, access approval và task management.

Những chức năng mở rộng như internal transfer, dashboard nâng cao và ủy quyền phê duyệt sẽ được xem xét sau khi các chức năng cốt lõi được phân tích và thiết kế đầy đủ.
