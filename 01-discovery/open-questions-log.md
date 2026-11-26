# NHẬT KÝ CÂU HỎI MỞ (OPEN QUESTIONS LOG)

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 1.0 – Bản nháp

**Ngày tạo:** 21/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Đang sử dụng – Nguồn duy nhất cho câu hỏi mở của dự án

---

## 1. Mục đích

Tài liệu gộp toàn bộ câu hỏi chưa được làm rõ từ các tài liệu Discovery, phân tích quy trình và thiết kế To-Be vào một danh sách duy nhất, có mã thống nhất.

Trước bản này, nhiều tài liệu tự đánh mã riêng, dẫn đến trùng mã nhưng khác nội dung (ví dụ OQ-001 ở hai tài liệu là hai câu hỏi khác nhau). Từ phiên bản này:

- Câu hỏi mới chỉ được thêm vào tài liệu này, dùng mã `Q-xx`.
- Các tài liệu khác tham chiếu mã `Q-xx` thay vì tự tạo danh sách riêng.
- Mã cũ được giữ trong bảng đối chiếu ở mục 4 để truy vết.

## 2. Quy ước trạng thái

| Trạng thái | Ý nghĩa |
| --- | --- |
| Mở | Chưa có câu trả lời. |
| Có giả định | Có câu trả lời giả lập hoặc thiết kế đang đề xuất một phương án; chưa được stakeholder có thẩm quyền xác nhận. |
| Đã xác nhận | Đã được stakeholder có thẩm quyền xác nhận; ghi rõ người và ngày xác nhận. |
| Đóng | Không còn cần thiết hoặc đã chuyển sang tài liệu khác; ghi lý do. |

Vì toàn bộ stakeholder của dự án là giả lập, chưa câu hỏi nào ở trạng thái **Đã xác nhận**.

## 3. Danh sách câu hỏi

### 3.1. SLA và thời hạn xử lý

| Mã | Câu hỏi | Stakeholder cần xác nhận | Ảnh hưởng | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Q-01 | SLA được tính theo giờ làm việc hay thời gian liên tục? Nhiệm vụ quá hạn được xử lý thế nào? | HR, IT | Task & SLA, KPI-01, KPI-02, KPI-04 | Mở | |
| Q-02 | Ai được phép thay đổi thời hạn xử lý nhiệm vụ? | HR, Manager | Task & SLA, Audit Log | Mở | |
| Q-03 | Hạn của từng loại nhiệm vụ onboarding phụ thuộc ngày bắt đầu như thế nào? Khi đổi ngày, những nhiệm vụ đang xử lý nào chịu tác động? | HR, IT | Onboarding (Sub_DateChange), BR-ON-04 | Mở | |
| Q-04 | Khi ngày nghỉ việc thay đổi, những nhiệm vụ nào bị ảnh hưởng và hạn được tính lại thế nào? | HR, IT | Offboarding | Mở | |
| Q-05 | Khi nhiệm vụ hoặc yêu cầu phê duyệt quá hạn, hệ thống thông báo cho ai? Có cần chuyển cấp xử lý (escalation) không? | HR, Manager, IT | Thông báo (F-13), Escalation (F-17) | Mở | Liên quan câu hỏi phỏng vấn MGR-Q10. |

### 3.2. Quyền truy cập và phê duyệt

| Mã | Câu hỏi | Stakeholder cần xác nhận | Ảnh hưởng | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Q-06 | Tiêu chí phân loại quyền nhạy cảm là gì? Quyền nào chỉ cần Manager duyệt, quyền nào cần thêm Security Approver? | Security Approver | Access Request, Sub_Access (A05, AG02) | Có giả định | Giả lập SEC-Q02: quyền dữ liệu tài chính và quyền quản trị hệ thống cần Security duyệt sau Manager. Chưa có danh mục đầy đủ. |
| Q-07 | Ai phân loại quyền và quản lý danh mục quyền nhạy cảm? | Security Approver, System Administrator | Danh mục quyền, Access Request | Mở | |
| Q-08 | Ai có thẩm quyền xác định và thay đổi danh sách quyền bắt buộc theo vị trí? | Manager, Security Approver | Onboarding, BR-ON-01 | Mở | |
| Q-09 | Có được cấp một phần quyền khi các quyền khác đang chờ duyệt không? Thứ tự xử lý các quyền được chốt thế nào? | Manager, IT | Sub_Access, BR-ON-09 | Có giả định | To-Be hiện xử lý tuần tự: quyền sau phải chờ quyền trước kết thúc. |
| Q-10 | Nếu tất cả quyền bị từ chối đều là quyền không bắt buộc, kết quả nhóm REJECTED có được chấp nhận không? Có cần Manager xác nhận thêm không? | Manager | Sub_Access, BR-ON-02 | Mở | |
| Q-11 | Trạng thái BLOCKED của một quyền được hiển thị thế nào ở cấp yêu cầu onboarding? Điều kiện cụ thể để tiếp tục xử lý là gì? | HR, IT | Sub_Access, màn hình theo dõi | Mở | |
| Q-12 | Có cho phép sửa yêu cầu sau khi đã gửi phê duyệt không? | Manager, Security Approver | Access Request | Mở | |
| Q-13 | Khi ủy quyền phê duyệt, ai được phép chỉ định người thay thế? Phạm vi và thời hạn ủy quyền thế nào? | Manager, System Administrator | Ủy quyền phê duyệt (F-16) | Mở | Liên quan REQ-008. |
| Q-14 | Quyền truy cập tạm thời có cần ngày hết hạn không? | Security Approver | Quyền tạm thời (Could Have) | Mở | |
| Q-15 | IT có được cấp quyền trước khi yêu cầu được phê duyệt không? | IT, Security Approver | Access Request, KPI-03 | Có giả định | Giả lập IT-Q12: không được. Đã phản ánh trong REQ-005 và To-Be (A08). |
| Q-16 | Quy tắc khi hủy onboarding, hoặc khi cần cấp lại quyền sau khi item quyền đã kết thúc là gì? | HR, Manager, IT | Onboarding, Sub_Access | Mở | |
| Q-35 | Khi Manager là người yêu cầu quyền cho chính mình, ai phê duyệt thay (cấp trên, Security)? | Manager, Security Approver | Access Request To-Be (M01), BR-AC-06 | Mở | Phát sinh khi thiết kế Access Request To-Be ngày 21/11/2026. |
| Q-36 | Security Approver có được yêu cầu bổ sung thông tin hay chỉ duyệt/từ chối? | Security Approver | Access Request To-Be (SE01) | Có giả định | To-Be hiện chỉ cho Security duyệt hoặc từ chối. |
| Q-37 | Khi nào một phê duyệt quyền được coi là không còn hiệu lực (người duyệt rút lại, nội dung quyền thay đổi sau khi duyệt, quá thời hạn hiệu lực)? | Security Approver, Manager | Onboarding (UC-ON-05 EF-03, A11), BR-ON-12 | Mở | Phát sinh khi review Use Case ngày 22/11/2026. |

### 3.3. Onboarding

| Mã | Câu hỏi | Stakeholder cần xác nhận | Ảnh hưởng | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Q-17 | Những mẫu nhiệm vụ nào cần tạo khi onboarding? | HR, IT | Onboarding (S04), cấu hình mẫu nhiệm vụ | Mở | |
| Q-18 | Yêu cầu onboarding được coi là hoàn tất ở thời điểm nào? | HR | Onboarding (S06, H03, S07) | Có giả định | To-Be hiện đề xuất: hoàn tất khi các điều kiện bắt buộc đạt và HR xác nhận (BR-ON-06, BR-ON-08). |
| Q-19 | Nhân viên mới có cần xác nhận nhận thiết bị không? | HR, IT | Sub_Devices | Có giả định | To-Be hiện đề xuất Employee xác nhận bằng biên bản (D06). |
| Q-20 | Ai có quyền khởi tạo yêu cầu onboarding và offboarding? | HR, Project Sponsor | Phân quyền theo vai trò | Có giả định | Giả định hiện tại: HR khởi tạo (RACI). |
| Q-21 | Ai có quyền thay đổi người phụ trách nhiệm vụ? | HR, Manager | Task Management | Mở | |
| Q-38 | Nhận diện "cùng một nhân viên" khi kiểm tra trùng yêu cầu onboarding bằng gì (email cá nhân, số CCCD, mã ứng viên)? | HR | Onboarding (SCR-ON-01, UC-ON-01 EF-03), BR-ON-11 | Có giả định | Giả định hiện tại: email cá nhân. Phát sinh khi đặc tả màn hình ngày 26/11/2026. |
| Q-39 | HR có được xóa một quyền bắt buộc theo mẫu vị trí khỏi yêu cầu onboarding không? | HR, Manager, Security Approver | Onboarding (SCR-ON-01), BR-ON-01, Q-08 | Có giả định | Giả định hiện tại: không được xóa, tương tự không được đổi sang không bắt buộc. Phát sinh khi đặc tả màn hình ngày 26/11/2026. |
| Q-40 | Manager có phải ghi lý do nghiệp vụ khi phê duyệt quyền nhạy cảm để Security tham khảo không? | Manager, Security Approver | Onboarding (SCR-ON-03, UC-ON-04), US-ON-07 AC-1 | Có giả định | Giả định hiện tại: không bắt buộc. Phát sinh khi đặc tả màn hình ngày 26/11/2026. |

### 3.4. Offboarding và thiết bị

| Mã | Câu hỏi | Stakeholder cần xác nhận | Ảnh hưởng | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Q-22 | Điều kiện nào cho phép đóng offboarding khi thiết bị chưa hoàn trả hoặc còn nghĩa vụ bàn giao? Có biên bản ngoại lệ đã duyệt thì có được đóng không? | HR, Manager, IT | Offboarding, KPI-05 | Có giả định | Giả lập HR-Q14: không đóng khi còn nhiệm vụ bắt buộc, trừ ngoại lệ được duyệt hợp lệ theo chính sách. |
| Q-23 | Ai có thẩm quyền phê duyệt ngoại lệ thiết bị? | HR, Manager | Offboarding | Mở | |
| Q-24 | Ai xác nhận hoàn tất offboarding? | HR | Offboarding | Có giả định | RACI đề xuất HR là A/R. |
| Q-25 | Thời điểm thu hồi quyền được xác định theo ngày hay theo giờ cụ thể? | Security Approver, IT | Offboarding, KPI-04 | Mở | |
| Q-26 | Thu hồi quyền khẩn (nghỉ việc đột xuất) phải hoàn thành trong thời hạn nào? | Security Approver, IT | Offboarding | Mở | |
| Q-27 | Khi không thể thu hồi tài khoản đúng hạn, ai chịu trách nhiệm xử lý? | IT, Security Approver | Offboarding | Mở | |
| Q-28 | Hệ thống quản lý thiết bị ở mức danh mục hay theo từng tài sản cụ thể? | IT | IT Asset Management, ERD | Mở | |
| Q-34 | Thiết bị được đóng theo ngoại lệ đã duyệt có cần tiếp tục theo dõi (bồi hoàn, thu hồi sau) không? Ai theo dõi? | HR, IT, Manager | Offboarding To-Be (Sub_Devices), BR-OFF-06, KPI-05 | Mở | Phát sinh khi thiết kế Offboarding To-Be ngày 21/11/2026. |

### 3.5. Audit Log, KPI và phạm vi xem dữ liệu

| Mã | Câu hỏi | Stakeholder cần xác nhận | Ảnh hưởng | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Q-29 | Những thao tác nào bắt buộc ghi Audit Log? | Security Approver, System Administrator | Audit Log, KPI-06 | Có giả định | Giả lập SEC-Q09: tạo yêu cầu, phê duyệt, từ chối, cập nhật trạng thái, thay đổi quyền, thao tác quản trị quan trọng. |
| Q-30 | Những vai trò nào được xem Audit Log? | Security Approver, System Administrator | Phân quyền, Audit Log, UC-ON-09 | Có giả định | Interview Notes (OQ-008) ghi nhận Security và Administrator. Use Case v0.2 áp dụng: chỉ hai vai trò này xem toàn bộ lịch sử; HR, Manager xem quyết định trong yêu cầu của mình. |
| Q-31 | Ai có quyền xem KPI của toàn doanh nghiệp? | Project Sponsor | Dashboard (F-12) | Mở | |
| Q-32 | Nhiệm vụ bị hủy có được tính vào KPI không? | Project Sponsor, HR | KPI-01, KPI-02, KPI-04 | Mở | |
| Q-33 | Manager có được xem yêu cầu của phòng ban khác không? | Manager, System Administrator | Phân quyền theo vai trò | Mở | Liên quan câu hỏi phỏng vấn MGR-Q07. |

## 4. Bảng đối chiếu mã cũ và mã mới

| Tài liệu nguồn | Mã cũ | Mã mới |
| --- | --- | --- |
| [business-goals-kpis-and-scope.md](business-goals-kpis-and-scope.md), mục 9 | OQ-001 | Q-01 |
| | OQ-002 | Q-02 |
| | OQ-003 | Q-06 |
| | OQ-004 | Q-22 |
| | OQ-005 | Q-29 |
| | OQ-006 | Q-31 |
| | OQ-007 | Q-32 |
| | OQ-008 | Q-04 |
| [interview-notes.md](interview-notes.md), mục 6 | OQ-001 | Q-01 |
| | OQ-002 | Q-06 |
| | OQ-003 | Q-23 |
| | OQ-004 | Q-12 |
| | OQ-005 | Q-13 |
| | OQ-006 | Q-04 |
| | OQ-007 | Q-14 |
| | OQ-008 | Q-30 |
| [as-is-process-analysis.md](../03-process-models/as-is-process-analysis.md), mục 7 | OQ-009 | Q-19 |
| | OQ-010 | Q-18 |
| | OQ-011 | Q-07 |
| | OQ-012 | Q-09 |
| | OQ-013 | Q-25 |
| | OQ-014 | Q-27 |
| | OQ-015 | Q-22 |
| [pain-point-and-gap-analysis.md](../03-process-models/pain-point-and-gap-analysis.md), mục 10 | GA-01 | Q-17 |
| | GA-02 | Q-21 |
| | GA-03 | Q-07 |
| | GA-04 | Q-23 |
| | GA-05 | Q-22 |
| | GA-06 | Q-01 |
| | GA-07 | Q-26 |
| | GA-08 | Q-28 |
| [stakeholder-analysis.md](stakeholder-analysis.md), mục 7 (chưa đánh mã) | Ai có quyền khởi tạo onboarding/offboarding | Q-20 |
| | Quyền nào cần Manager phê duyệt | Q-06 |
| | Quyền nào cần Security Approver phê duyệt thêm | Q-06 |
| | IT có được cấp quyền trước khi phê duyệt | Q-15 |
| | Ai xác nhận hoàn tất offboarding | Q-24 |
| | Nhân viên chưa hoàn trả thiết bị | Q-22 |
| | Nhiệm vụ quá hạn thông báo cho ai | Q-05 |
| | Manager xem yêu cầu phòng ban khác | Q-33 |
| [Onboarding To-Be design decisions](../02-requirements/design-decisions/onboarding-to-be-design-decisions.md), bản 0.4 (chưa đánh mã) | Thẩm quyền danh sách quyền bắt buộc | Q-08 |
| | Kết quả nhóm REJECTED | Q-10 |
| | Hiển thị và điều kiện tiếp tục khi BLOCKED | Q-11 |
| | Thứ tự xử lý quyền | Q-09 (phần phối hợp tài khoản giữa các quy trình chuyển sang [ghi chú kỹ thuật](../09-implementation/workflow/onboarding-technical-notes.md)) |
| | Hạn nhiệm vụ phụ thuộc ngày bắt đầu | Q-03 |
| | Lịch chờ/job dùng trong bản triển khai đầu | Chuyển sang [ghi chú kỹ thuật](../09-implementation/workflow/onboarding-technical-notes.md) |
| | Hủy onboarding hoặc cấp lại quyền | Q-16 |

## 5. Cách cập nhật

- Khi có câu trả lời, cập nhật cột Trạng thái và Ghi chú; ghi nguồn, người trả lời và ngày.
- Câu trả lời trở thành quy tắc thì chuyển sang Business Rules Catalog và ghi mã quy tắc vào cột Ghi chú.
- Không xóa câu hỏi đã đóng; giữ lại để truy vết.
