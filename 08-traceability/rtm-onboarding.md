# MA TRẬN TRUY VẾT YÊU CẦU (RTM) – EMPLOYEE ONBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Nguồn:** [BRD](../02-requirements/brd/brd-onboarding.md), [Business Rules](../02-requirements/business-rules/business-rules-catalog.md), [BPMN To-Be](../03-process-models/to-be/onboarding/to-be-onboarding.bpmn), [Use Case](../02-requirements/use-case-specifications/onboarding-use-cases.md), [User Stories](../02-requirements/user-stories/onboarding-user-stories.md), [Đặc tả màn hình](../06-ui-ux/onboarding-screen-specifications.md)

---

## 1. Yêu cầu nghiệp vụ

Kịch bản UAT: [uat-onboarding.md](../07-validation/uat-onboarding.md).

| BREQ | Ưu tiên | BG | Quy tắc | BPMN | Use case | User story | Màn hình | UAT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BREQ-ON-01 Tạo yêu cầu tập trung | Must | BG-01 | BR-ON-01, BR-ON-11 | H01 | UC-ON-01 | US-ON-01 | SCR-ON-01 | UAT-ON-01, 03 |
| BREQ-ON-02 Kiểm tra dữ liệu trước khi khởi tạo | Must | BG-01 | – | S01, G01, H02 | UC-ON-01 | US-ON-01 | SCR-ON-01 | UAT-ON-02 |
| BREQ-ON-03 Tạo đủ nhiệm vụ bắt buộc | Must | BG-02 | BR-GEN-01, BR-ON-09 | S03 | UC-ON-01 | US-ON-02 | SCR-ON-01, 02 | UAT-ON-01, 04 |
| BREQ-ON-04 Theo dõi tiến độ tại một nơi | Must | BG-02 | BR-GEN-01 | Toàn quy trình | UC-ON-02 | US-ON-03, 04 | SCR-ON-02, 03 | UAT-ON-01, 14 |
| BREQ-ON-05 Phê duyệt đúng cấp trước khi cấp | Must | BG-03 | BR-AC-03, BR-AC-04, BR-ON-01, BR-ON-12 | A01, A05, A06, A11 | UC-ON-03, 04, 05 | US-ON-05, 07, 08, 09 | SCR-ON-03, 04 | UAT-ON-05, 10 |
| BREQ-ON-06 Kết quả riêng từng quyền, quyền bị chặn có lý do | Must | BG-03 | BR-ON-02, BR-ON-09 | A03, AG_Optional, A04, A14 | UC-ON-02, 03, 05 | US-ON-03, 05, 06, 09 | SCR-ON-02, 03, 04 | UAT-ON-06, 07, 09 |
| BREQ-ON-07 Không tạo trùng tài khoản | Must | BG-03 | BR-ON-10 | AT | UC-ON-05 | US-ON-08, 09 | SCR-ON-04 | UAT-ON-08, 09 |
| BREQ-ON-08 Ghi nhận bàn giao, theo dõi thiếu thiết bị | Must | BG-04 | BR-ON-03 | Sub_Devices (D01–D08) | UC-ON-06 | US-ON-10, 11 | SCR-ON-05, 02 | UAT-ON-11 |
| BREQ-ON-09 Đóng khi đủ điều kiện và HR xác nhận | Must | BG-01 | BR-ON-06, BR-ON-07, BR-ON-08 | S06, G02, H04, Wait_NewData, H03, S07 | UC-ON-07 | US-ON-12 | SCR-ON-02 | UAT-ON-12, 13 |
| BREQ-ON-10 Lý do từ chối và lịch sử thao tác | Must | BG-05 | BR-GEN-02, BR-GEN-03 | A01, A03, A06 | UC-ON-03, 04, 09 | US-ON-05, 07, 13 | SCR-ON-03, 02 | UAT-ON-06, 14 |
| BREQ-ON-11 Cập nhật hạn khi đổi ngày bắt đầu | Should | BG-02 | BR-ON-04, BR-ON-05 | Sub_DateChange (C01–C04) | UC-ON-08 | US-ON-14 | SCR-ON-02 | UAT-ON-15 |
| BREQ-ON-12 Cảnh báo quá hạn | Should | BG-02 | BR-GEN-01 | – | UC-ON-10 | US-ON-15 | SCR-ON-03, 02 | UAT-ON-16 |
| BREQ-ON-13 Tổng quan yêu cầu (dashboard) | Should | BG-05 | – | – | – | – | – | – |

## 2. Ràng buộc chất lượng

| BQ | Nội dung | Use case | User story / AC | Màn hình | UAT |
| --- | --- | --- | --- | --- | --- |
| BQ-ON-01 | Gửi lại không tạo trùng | UC-ON-01 EF-02, UC-ON-05 AF-01 | US-ON-02 AC-3, AC-4; US-ON-08 AC-3 | SCR-ON-01, 04 | UAT-ON-04, 08 |
| BQ-ON-02 | Lỗi hệ thống không báo thành công | UC-ON-07 EF-02 | – | SCR-ON-02 (MSG-13) | UAT-ON-13 |
| BQ-ON-03 | Giao diện tiếng Việt | – | – | Mọi màn hình | Mọi test case |
| BQ-ON-04 | Lịch sử không sửa, xóa được | UC-ON-09 | US-ON-13 AC-2 | SCR-ON-02 | UAT-ON-14 |

## 3. Lỗ hổng phát hiện

| # | Lỗ hổng | Xử lý |
| --- | --- | --- |
| 1 | BREQ-ON-13 chưa có use case, story và màn hình. | Cố ý hoãn (Should). Bổ sung khi làm Dashboard. |
| 2 | BREQ-ON-12 không có bước trên BPMN. | Chấp nhận: cảnh báo do hệ thống kích hoạt theo thời gian, đã mô tả điều kiện ở UC-ON-10. |
| 3 | BQ-ON-02 chưa có AC kiểm chứng. | Kiểm chứng trực tiếp bằng UAT-ON-13. |

Truy ngược: mọi use case, user story và màn hình đều gắn với ít nhất một BREQ.
