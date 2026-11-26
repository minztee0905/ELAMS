# MA TRẬN TRUY VẾT YÊU CẦU (RTM) – EMPLOYEE OFFBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Nguồn:** [BRD](../02-requirements/brd/brd-offboarding.md), [Business Rules](../02-requirements/business-rules/business-rules-catalog.md), [BPMN To-Be](../03-process-models/to-be/offboarding/to-be-offboarding.bpmn), [Use Case](../02-requirements/use-case-specifications/offboarding-use-cases.md), [User Stories](../02-requirements/user-stories/offboarding-user-stories.md), [SRS](../02-requirements/srs/srs-elams.md), [Đặc tả màn hình](../06-ui-ux/offboarding-screen-specifications.md), [UAT](../07-validation/uat-offboarding.md)

---

## 1. Yêu cầu nghiệp vụ

| BREQ | Ưu tiên | BG | Quy tắc | BPMN | Use case | User story | Màn hình | SRS | UAT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BREQ-OFF-01 Yêu cầu đủ thông tin, có cờ đột xuất | Must | BG-01 | BR-OFF-01 | H01 | UC-OFF-01 | US-OFF-01 | SCR-OFF-01 | FR-OFF-01, 02 | UAT-OFF-01, 02 |
| BREQ-OFF-02 Danh sách thu hồi lập tự động | Must | BG-03 | BR-OFF-02, BR-GEN-01 | S01 | UC-OFF-01, 05 | US-OFF-01, 07 | SCR-OFF-01, 03 | FR-OFF-03, 07; FR-GEN-14 | UAT-OFF-01, 07 |
| BREQ-OFF-03 Bàn giao có Manager xác nhận | Must | BG-02 | BR-OFF-08 | Sub_Handover (W01–W03) | UC-OFF-03, 04 | US-OFF-03, 04, 05 | SCR-OFF-05 | FR-OFF-09, 10 | UAT-OFF-04, 05 |
| BREQ-OFF-04 Thu hồi đúng 18:00 hoặc trong 4 giờ | Must | BG-03 | BR-OFF-03, BR-OFF-04 | VG_Wait, V_Timer, V_Urgent | UC-OFF-05, 09 | US-OFF-02, 06 | SCR-OFF-01, 02, 03 | FR-OFF-04, 05 | UAT-OFF-03, 06 |
| BREQ-OFF-05 Thu hồi quyền không có ngoại lệ | Must | BG-03 | BR-OFF-05 | V01, V02, VG01, V03 | UC-OFF-05 | US-OFF-07 | SCR-OFF-03 | FR-OFF-06, 08 | UAT-OFF-07, 11 |
| BREQ-OFF-06 Thiết bị, ngoại lệ có kiểm soát | Must | BG-04 | BR-OFF-06 | Sub_Devices (D02–D04) | UC-OFF-06, 07 | US-OFF-08, 09 | SCR-OFF-04, SCR-ON-03 | FR-OFF-11, 12 | UAT-OFF-08, 09 |
| BREQ-OFF-07 Đóng khi đủ điều kiện và HR xác nhận | Must | BG-01 | BR-OFF-08 | S02, G01, H02, H03 | UC-OFF-08 | US-OFF-10 | SCR-OFF-02 | FR-OFF-13 | UAT-OFF-10, 11 |
| BREQ-OFF-08 Theo dõi tại một nơi | Must | BG-02 | BR-GEN-01 | Toàn quy trình | UC-OFF-02 | US-OFF-12 | SCR-OFF-02 | FR-GEN-03; FR-OFF-13 | UAT-OFF-01, 12 |
| BREQ-OFF-09 Lịch sử thu hồi và ngoại lệ | Must | BG-05 | BR-GEN-02, BR-GEN-03 | D04, V02 | UC-OFF-05, 07 | US-OFF-06, 09 | SCR-OFF-03, SCR-ON-03 | FR-GEN-08, 09 | UAT-OFF-06, 09 |
| BREQ-OFF-10 Đổi ngày nghỉ việc | Should | BG-02 | BR-OFF-07 | Sub_DateChange (C01, C02) | UC-OFF-09 | US-OFF-11 | SCR-OFF-02 | FR-OFF-15 | UAT-OFF-13 |
| BREQ-OFF-11 Cảnh báo quá hạn | Should | BG-02 | BR-GEN-01, BR-OFF-05 | – | UC-OFF-10 | US-OFF-13 | SCR-ON-03, SCR-OFF-02 | FR-GEN-06; FR-OFF-14 | UAT-OFF-14 |

## 2. Ràng buộc chất lượng

| BQ | Nội dung | User story / AC | Màn hình | UAT |
| --- | --- | --- | --- | --- |
| BQ-OFF-01 | Lỗi hệ thống không báo đã thu hồi hoặc đã hoàn tất | US-OFF-10 AC-5 | SCR-OFF-02, 03 | UAT-OFF-11 |
| BQ-OFF-02 | Thời điểm thu hồi theo giờ Việt Nam | – | SCR-OFF-01, 03 | UAT-OFF-03, 06 |
| BQ-OFF-03 | Giao diện tiếng Việt | – | Mọi màn hình | Mọi test case |

## 3. Nhận xét

- Mọi BREQ đều có use case, story, màn hình và UAT. Truy ngược: mọi use case, story và màn hình gắn với ít nhất một BREQ.
- BREQ-OFF-11 không có bước trên BPMN, giống hai quy trình còn lại.
- Hạn xử lý của nhiệm vụ thu hồi quyền thông thường chưa có số cụ thể (chờ Q-01); KPI-04 cần mốc này để đo.
