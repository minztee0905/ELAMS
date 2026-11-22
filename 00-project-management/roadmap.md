# ROADMAP DỰ ÁN ELAMS

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Phiên bản:** 1.1

**Cập nhật:** 22/11/2026

**Mục tiêu:** Hoàn thiện hồ sơ BA cho một dự án nhỏ để đưa vào CV ứng tuyển Business Analyst Intern.

**Thay đổi so với bản 1.0:** Áp dụng các đề xuất đã duyệt trong [roadmap-change-proposals.md](roadmap-change-proposals.md): làm lát cắt dọc Onboarding trước (RM-03), giới hạn độ sâu Task 08 (RM-01, RM-02), đưa Portfolio lên sớm (RM-05), lập trình là tùy chọn (RM-06).

---

## 1. Roadmap 24 Task gốc

| Giai đoạn | Task | Trạng thái | Tài liệu |
| --- | --- | --- | --- |
| Phase 1 – Business Discovery | 01–04 | Có bản nháp | [Project Charter](project-charter.md), [Stakeholder Analysis](../01-discovery/stakeholder-analysis.md), [Requirement Elicitation](../01-discovery/requirement-elicitation.md), [Interview Notes](../01-discovery/interview-notes.md), [Business Goals, KPIs & Scope](../01-discovery/business-goals-kpis-and-scope.md) |
| Phase 2 – Business Analysis | 05–07 | Đã thực hiện; BPMN As-Is đã duyệt (22/11/2026) | [As-Is Process Analysis](../03-process-models/as-is-process-analysis.md), [BPMN As-Is](../03-process-models/as-is/), [Pain Point & Gap Analysis](../03-process-models/pain-point-and-gap-analysis.md) |
| Phase 2 – BPMN To-Be | 08 | Đã duyệt cả 3 quy trình (22/11/2026) | [Onboarding To-Be](../03-process-models/to-be/onboarding/), [Access Request To-Be](../03-process-models/to-be/access-request/), [Offboarding To-Be](../03-process-models/to-be/offboarding/) |
| Phase 2 – Business Rules | 09 | Có bản nháp (22/11/2026) | [Business Rules Catalog](../02-requirements/business-rules/business-rules-catalog.md) – 29 quy tắc cho cả 3 quy trình |
| Phase 2 – BRD | 10 | Có bản nháp phần Onboarding (22/11/2026) | [BRD Onboarding](../02-requirements/brd/brd-onboarding.md) |
| Phase 3 – System Analysis & SRS | 11–16 | Đang làm – có Use Case và User Stories phần Onboarding (22/11/2026) | [Use Case Onboarding](../02-requirements/use-case-specifications/onboarding-use-cases.md), [User Stories Onboarding](../02-requirements/user-stories/onboarding-user-stories.md) |
| Phase 4 – UI/UX | 17–18 | Chưa bắt đầu | |
| Phase 5 – Validation | 19–22 | Chưa bắt đầu | [Review log](../07-validation/review-log.md) (mẫu) |
| Phase 6 – Portfolio | 23–24 | Chưa bắt đầu | |
| Ngoài roadmap BA – Lập trình MVP | – | Tùy chọn, sau khi portfolio có thể gửi đi | [09-implementation](../09-implementation/) |

Tài liệu dùng chung: [Open Questions Log](../01-discovery/open-questions-log.md).

## 2. Thứ tự thực hiện sau điều chỉnh

Thứ tự giai đoạn của roadmap gốc giữ nguyên. Thay đổi nằm ở cách thực hiện: hoàn thành trọn chuỗi sản phẩm cho **Onboarding** trước, rồi mới mở rộng sang hai quy trình còn lại.

| Bước | Nội dung | Task gốc liên quan | Kết quả cuối bước | Trạng thái |
| --- | --- | --- | --- | --- |
| A | Chốt Onboarding To-Be ở mức nghiệp vụ; tách ghi chú kỹ thuật; gộp Open Questions Log; rút gọn và chuẩn hóa 4 BPMN; xuất lại PNG | 08 | BPMN Onboarding To-Be ổn định | Hoàn thành 22/11/2026 – BA đã kiểm duyệt và thông qua toàn bộ BPMN |
| B | Lát cắt Onboarding: Business Rules → BRD rút gọn → Use Case + User Stories/AC → Wireframe → RTM → UAT | 09, 10, 11–16, 17–18, 19–22 (phần Onboarding) | Một bộ hồ sơ hoàn chỉnh cho một quy trình | Đang làm – đã có Business Rules, BRD, Use Case, User Stories/AC; tiếp theo là Wireframe |
| C | Viết case study một trang và README portfolio; có thể thêm bản tóm tắt tiếng Anh (RM-08); **bắt đầu nộp CV** | 23–24 | Portfolio có thể gửi đi | Chưa bắt đầu |
| D | Mở rộng sang Access Request và Offboarding: To-Be ở mức nghiệp vụ, tái sử dụng khung từ bước B | 08, 09–22 (phần còn lại) | Hồ sơ phủ 3 quy trình | Đã làm sớm phần BPMN To-Be (BPMN-05, BPMN-06); phần còn lại chưa bắt đầu |
| E | Hoàn thiện SRS, ERD, sơ đồ bổ sung; review với ít nhất một người thật (RM-07) | 11–16, 19–22 | Hồ sơ đầy đủ, có bằng chứng review | Chưa bắt đầu |
| F | (Tùy chọn) Lập trình MVP | Ngoài roadmap BA | Bản demo phần mềm | Tùy chọn |

## 3. Nguyên tắc giới hạn phạm vi

- BPMN To-Be ở mức nghiệp vụ: ai làm gì, điểm quyết định, ngoại lệ, vị trí hệ thống hỗ trợ. Cơ chế thực thi ghi tại `09-implementation/`.
- Access Request và Offboarding To-Be làm ở mức chi tiết thấp hơn Onboarding.
- Ưu tiên sản phẩm theo mức Cốt lõi/Rút gọn tại [Project Charter](project-charter.md), mục 7.
- Chỉ đưa vào CV các sản phẩm đã hoàn thành.
