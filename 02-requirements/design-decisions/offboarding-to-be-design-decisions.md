# Quy tắc và quyết định thiết kế cho Offboarding To-Be

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 21/11/2026

**Trạng thái:** Đề xuất thiết kế của BA, chưa phải chính sách được phê duyệt.

**Sơ đồ liên quan:** [Employee Offboarding To-Be](../../03-process-models/to-be/offboarding/to-be-offboarding.bpmn) (TB-OFF-01).

**Mức chi tiết:** Thấp hơn Onboarding To-Be theo nguyên tắc tại [roadmap](../../00-project-management/roadmap.md), mục 3.

---

## 1. Cấu trúc sơ đồ

Sơ đồ chính (HR, ELAMS) gồm: tạo yêu cầu → ELAMS lập danh sách và tạo nhiệm vụ → ba nhánh song song → kiểm tra điều kiện hoàn tất → HR xác nhận. Mỗi nhánh là một sơ đồ con (mở dấu + trong Camunda Modeler):

| Sơ đồ con | Lane | Nội dung chính |
| --- | --- | --- |
| Sub_Handover – Bàn giao công việc | Manager, Employee | Lập kế hoạch, bàn giao, Manager xác nhận |
| Sub_Revoke – Thu hồi quyền truy cập | ELAMS, IT | Chờ đến thời điểm thu hồi hoặc chuyển sang đột xuất; IT thu hồi; ELAMS đối chiếu |
| Sub_Devices – Thu hồi thiết bị | Manager, Employee, IT | Hoàn trả, kiểm tra; thiết bị còn thiếu thì Manager quyết định tiếp tục thu hồi hoặc duyệt ngoại lệ |
| Sub_DateChange – Thay đổi ngày nghỉ việc | HR, ELAMS | Event subprocess không ngắt; tính lại hạn và thời điểm thu hồi |

Tổng: 17 task, 8 gateway, 43 luồng (As-Is: 23 task, 8 gateway, 42 luồng).

## 2. Tóm tắt thay đổi so với As-Is

| As-Is (AS-03) | To-Be (TB-OFF-01) | Gap |
| --- | --- | --- |
| HR ghi Excel và gửi email | HR tạo yêu cầu offboarding trên ELAMS (H01) | GAP-OFF-01 |
| IT tự xác định tài khoản cần thu hồi | ELAMS lập danh sách từ lịch sử cấp quyền; ELAMS đối chiếu kết quả (S01, V02) | GAP-OFF-02 |
| Thiết bị theo dõi riêng lẻ | Đối chiếu với thiết bị đã cấp lúc onboarding (S01, D02) | GAP-OFF-03 |
| HR đối chiếu email, Excel, biên bản | ELAMS kiểm tra điều kiện hoàn tất trước khi HR xác nhận (S02) | GAP-OFF-04 |
| Thiết bị chưa trả chỉ được nhắc thủ công | Ghi nhận thiếu, lý do, bằng chứng; Manager duyệt ngoại lệ (D03, D04) | GAP-OFF-05 |
| Đổi ngày qua email | Event subprocess tính lại hạn và thời điểm thu hồi (C02) | GAP-OFF-06 |
| Nghỉ đột xuất báo qua email | Đánh dấu đột xuất trên yêu cầu; thu hồi bắt đầu ngay (V_Urgent) | GAP-OFF-07 |
| Không biết nhiệm vụ nào quá hạn | Mọi nhiệm vụ có người phụ trách và hạn; ELAMS đánh dấu quá hạn (S01) | GAP-OFF-08 |

## 3. Quy tắc nghiệp vụ

Phát biểu chính thức, loại, nguồn, trạng thái và câu hỏi mở của từng quy tắc nằm tại [Business Rules Catalog](../business-rules/business-rules-catalog.md). Bảng dưới đây chỉ ghi tên ngắn và vị trí trong BPMN.

| Mã | Tên ngắn | Vị trí trong BPMN |
| --- | --- | --- |
| BR-OFF-01 | Trường bắt buộc của yêu cầu offboarding | H01 |
| BR-OFF-02 | Danh sách thu hồi lập từ lịch sử cấp phát | S01 |
| BR-OFF-03 | Thu hồi theo ngày nghỉ việc; đột xuất thì ngay | V_Timer, V01 |
| BR-OFF-04 | Chuyển sang đột xuất giữa chừng thì thu hồi ngay | V_Urgent, V01 |
| BR-OFF-05 | Thu hồi quyền không có ngoại lệ | V02, VG01, V03 |
| BR-OFF-06 | Ngoại lệ thiết bị cần lý do, bằng chứng, người duyệt | D03, D04, DG02 |
| BR-OFF-07 | Đổi ngày nghỉ việc: tính lại hạn và thời điểm thu hồi | C02 |
| BR-OFF-08 | Điều kiện đóng offboarding | S02, G01, H03 |

## 4. Lựa chọn thiết kế

- **Event-based gateway trong Sub_Revoke:** thu hồi quyền bắt đầu theo sự kiện nào đến trước, đến thời điểm thu hồi hoặc yêu cầu chuyển sang đột xuất. Cách này thể hiện rõ GAP-OFF-07 trên sơ đồ mà không cần thêm event subprocess như bản As-Is.
- **Ngoại lệ chỉ áp dụng cho thiết bị:** thu hồi quyền là kiểm soát bảo mật (BG-03, KPI-04 mục tiêu 100%) nên không có nhánh ngoại lệ; thiết bị có thể mất hoặc chậm trả nên cần ngoại lệ có kiểm soát (KPI-05 mục tiêu ≥ 98%).
- **Không mô hình nhắc việc và quá hạn bằng phần tử riêng:** SLA là thuộc tính của mọi nhiệm vụ, được ghi trong mô tả S01 và annotation; thông báo tự động là Should Have.
- **Cách thời điểm chờ cập nhật khi đổi ngày** (timer đang chờ được thay thế thế nào) là cơ chế thực thi, cần đặc tả khi triển khai tương tự SRS-ON-02 trong [ghi chú kỹ thuật Onboarding](../../09-implementation/workflow/onboarding-technical-notes.md).

## 5. Câu hỏi cần xác nhận

Theo dõi tại [Open Questions Log](../../01-discovery/open-questions-log.md): Q-04 (đổi ngày nghỉ việc), Q-22 (điều kiện đóng khi còn thiết bị), Q-23 (người duyệt ngoại lệ), Q-24 (HR xác nhận), Q-25 (thu hồi theo ngày hay giờ), Q-26 (thời hạn thu hồi khẩn), Q-27 (trách nhiệm khi không thu hồi được), Q-34 (theo dõi thiết bị sau ngoại lệ).
