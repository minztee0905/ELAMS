# ROADMAP DỰ ÁN ELAMS

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Phiên bản:** 1.2

**Cập nhật:** 26/11/2026

**Mục tiêu:** Hoàn thiện hồ sơ BA cho một dự án nhỏ để đưa vào CV ứng tuyển Business Analyst Intern.

**Thay đổi so với bản 1.0:** Áp dụng các đề xuất đã duyệt trong [roadmap-change-proposals.md](roadmap-change-proposals.md): làm lát cắt dọc Onboarding trước (RM-03), giới hạn độ sâu Task 08 (RM-01, RM-02), đưa Portfolio lên sớm (RM-05), lập trình là tùy chọn (RM-06).

**Thay đổi bản 1.2:** Sau khi xong lát cắt Onboarding, làm Access Request và Offboarding với cùng chuỗi sản phẩm, rồi mới làm SRS, ERD và portfolio (BA quyết định 26/11/2026).

---

## 1. Roadmap 24 Task gốc

| Giai đoạn | Task | Trạng thái | Tài liệu |
| --- | --- | --- | --- |
| Phase 1 – Business Discovery | 01–04 | Có bản nháp | [Project Charter](project-charter.md), [Stakeholder Analysis](../discovery/stakeholder-analysis.md), [Requirement Elicitation](../discovery/requirement-elicitation.md), [Interview Notes](../discovery/interview-notes.md), [Business Goals, KPIs & Scope](../discovery/business-goals-kpis-and-scope.md) |
| Phase 2 – Business Analysis | 05–07 | Đã thực hiện; BPMN As-Is đã duyệt (22/11/2026) | [As-Is Process Analysis](../process-models/as-is-process-analysis.md), [BPMN As-Is](../process-models/as-is/), [Pain Point & Gap Analysis](../process-models/pain-point-and-gap-analysis.md) |
| Phase 2 – BPMN To-Be | 08 | Đã duyệt cả 3 quy trình (22/11/2026) | [Onboarding To-Be](../process-models/to-be/onboarding/), [Access Request To-Be](../process-models/to-be/access-request/), [Offboarding To-Be](../process-models/to-be/offboarding/) |
| Phase 2 – Business Rules | 09 | Có bản nháp (22/11/2026) | [Business Rules Catalog](../requirements/business-rules/business-rules-catalog.md) – 29 quy tắc cho cả 3 quy trình |
| Phase 2 – BRD | 10 | Có bản nháp phần Onboarding (22/11/2026) | [BRD Onboarding](../requirements/brd/brd-onboarding.md) |
| Phase 3 – System Analysis & SRS | 11–16 | Đang làm – có Use Case và User Stories phần Onboarding | [Use Case Onboarding](../requirements/use-case-specifications/onboarding-use-cases.md), [User Stories Onboarding](../requirements/user-stories/onboarding-user-stories.md) |
| Phase 4 – UI/UX | 17–18 | Có phần Onboarding | [Đặc tả màn hình Onboarding](../ui-ux/onboarding-screen-specifications.md), [Figma](https://www.figma.com/design/sxQaybHEwuvCMIBTmxwuxE/ELAMS) |
| Phase 5 – Validation | 19–22 | Có phần Onboarding | [RTM Onboarding](../traceability/rtm-onboarding.md), [UAT Onboarding](../validation/uat-onboarding.md), [Review log](../validation/review-log.md) (mẫu) |
| Phase 6 – Portfolio | 23–24 | Chưa bắt đầu | |
| Lập trình ứng dụng | – | Xong | [implementation](../implementation/) |

Tài liệu dùng chung: [Open Questions Log](../discovery/open-questions-log.md).

## 2. Thứ tự thực hiện

Mỗi quy trình đi qua cùng một chuỗi: chốt câu hỏi mở → BRD → Use Case → User Stories/AC → đặc tả màn hình → wireframe Figma → RTM → UAT. Tài liệu cấp hệ thống (ERD, SRS) làm sau khi đủ 3 quy trình.

| Bước | Nội dung | Kết quả cuối bước | Trạng thái |
| --- | --- | --- | --- |
| A | Chốt BPMN To-Be cả 3 quy trình ở mức nghiệp vụ | BPMN To-Be ổn định | Hoàn thành 22/11/2026 |
| B | Onboarding: Business Rules → BRD → Use Case → User Stories/AC → Wireframe → RTM → UAT | Bộ hồ sơ Onboarding | Xong bản nháp 26/11/2026 |
| D1 | Access Request: cùng chuỗi như bước B | Bộ hồ sơ Access Request | Xong bản nháp 26/11/2026 |
| D2 | Offboarding: cùng chuỗi như bước B | Bộ hồ sơ Offboarding | Xong bản nháp 26/11/2026 |
| E | Cấp hệ thống: sơ đồ ngữ cảnh, ERD và từ điển dữ liệu, SRS, RTM tổng | Hồ sơ toàn hệ thống | Xong bản nháp 26/11/2026 (sơ đồ ngữ cảnh nằm trong SRS mục 2.1) |
| F | Review với ít nhất một người thật; README portfolio, case study; nộp CV | Portfolio hoàn chỉnh | Chưa bắt đầu |
| G | Lập trình ứng dụng cho cả 3 quy trình | Ứng dụng web chạy được, kiểm thử theo UAT | Xong 26/11/2026 ([ghi chú triển khai](../implementation/implementation-notes.md)) |

## 3. Nguyên tắc giới hạn phạm vi

- BPMN To-Be ở mức nghiệp vụ: ai làm gì, điểm quyết định, ngoại lệ, vị trí hệ thống hỗ trợ. Cơ chế thực thi ghi tại `implementation/`.
- Access Request và Offboarding To-Be làm ở mức chi tiết thấp hơn Onboarding.
- Ưu tiên sản phẩm theo mức Cốt lõi/Rút gọn tại [Project Charter](project-charter.md), mục 7.
- Chỉ đưa vào CV các sản phẩm đã hoàn thành.
