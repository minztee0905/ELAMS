# MA TRẬN TRUY VẾT YÊU CẦU (RTM) – ACCESS REQUEST & APPROVAL

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Nguồn:** [BRD](../requirements/brd/brd-access-request.md), [Business Rules](../requirements/business-rules/business-rules-catalog.md), [BPMN To-Be](../process-models/to-be/access-request/to-be-access-request-approval.bpmn), [Use Case](../requirements/use-case-specifications/access-request-use-cases.md), [User Stories](../requirements/user-stories/access-request-user-stories.md), [SRS](../requirements/srs/srs-elams.md), [Đặc tả màn hình](../ui-ux/access-request-screen-specifications.md), [UAT](../validation/uat-access-request.md)

---

## 1. Yêu cầu nghiệp vụ

| BREQ | Ưu tiên | BG | Quy tắc | BPMN | Use case | User story | Màn hình | SRS | UAT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BREQ-AC-01 Biểu mẫu chuẩn, chặn trùng | Must | BG-01 | BR-AC-01, BR-AC-07 | R01 | UC-AC-01 | US-AC-01 | SCR-AC-01 | FR-AC-01, 03 | UAT-AC-01, 02, 03 |
| BREQ-AC-02 Manager xử lý tại Approval Inbox | Must | BG-02 | BR-AC-02, BR-AC-06 | M01, MG01 | UC-AC-04 | US-AC-02, 03, 04 | SCR-ON-03, SCR-AC-03 | FR-AC-02, 04, 05 | UAT-AC-04, 06, 09 |
| BREQ-AC-03 Bổ sung hoặc hủy, không tự hủy | Must | BG-01 | BR-AC-02 | R02, RG01, E_Cancel | UC-AC-02 | US-AC-05 | SCR-AC-03, 02 | FR-AC-06 | UAT-AC-07 |
| BREQ-AC-04 Cấp phê duyệt theo danh mục | Must | BG-03 | BR-AC-03 | S01, SG01, SE01, SG02 | UC-AC-04, 05 | US-AC-03, 06 | SCR-AC-01, SCR-ON-03 | FR-AC-07 | UAT-AC-03 |
| BREQ-AC-05 IT nhận việc khi đủ phê duyệt, không trùng tài khoản | Must | BG-03 | BR-AC-04, BR-ON-10 | I01 | UC-AC-06 | US-AC-07 | SCR-ON-04 | FR-AC-08; FR-GEN-15 | UAT-AC-04, 05 |
| BREQ-AC-06 Chỉ Đã cấp khi IT ghi nhận thành công | Must | BG-03 | BR-AC-05 | IG01, I02, S02 | UC-AC-06 | US-AC-07, 08 | SCR-ON-04, SCR-AC-03 | FR-AC-09 | UAT-AC-04, 08 |
| BREQ-AC-07 Theo dõi trạng thái và thông báo | Must | BG-02 | BR-GEN-01 | S02, toàn quy trình | UC-AC-03 | US-AC-09 | SCR-AC-02, 03 | FR-AC-10; FR-GEN-05 | UAT-AC-03, 09 |
| BREQ-AC-08 Lý do và lịch sử quyết định | Must | BG-05 | BR-GEN-02, BR-GEN-03 | M01, SE01 | UC-AC-04, 05 | US-AC-03, 04, 06 | SCR-ON-03, SCR-AC-03 | FR-GEN-08, 09 | UAT-AC-03, 06 |
| BREQ-AC-09 Cảnh báo quá hạn | Should | BG-02 | BR-GEN-01 | – | UC-AC-07 | US-AC-10 | SCR-ON-03, SCR-AC-02 | FR-GEN-06 | UAT-AC-10 |

## 2. Ràng buộc chất lượng

| BQ | Nội dung | User story / AC | Màn hình | UAT |
| --- | --- | --- | --- | --- |
| BQ-AC-01 | Gửi lại không tạo yêu cầu mới | US-AC-05 AC-2 | SCR-AC-03 | UAT-AC-07 |
| BQ-AC-02 | Lỗi hệ thống không báo đã cấp | US-AC-08 AC-2 | SCR-ON-04 | UAT-AC-08 |
| BQ-AC-03 | Giao diện tiếng Việt | – | Mọi màn hình | Mọi test case |

## 3. Nhận xét

- Mọi BREQ đều có use case, story, màn hình và UAT. Truy ngược: mọi use case, story và màn hình gắn với ít nhất một BREQ.
- BREQ-AC-09 không có bước trên BPMN: cảnh báo do hệ thống kích hoạt theo thời gian, giống BREQ-ON-12.
- BR-ON-10 được dùng cho cả hai quy trình; cân nhắc chuyển thành quy tắc dùng chung khi làm SRS.
