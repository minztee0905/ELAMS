# ELAMS

**Employee Lifecycle & Access Management System**

ELAMS quản lý vòng đời nhân viên và quyền truy cập, tập trung vào onboarding, offboarding, phê duyệt quyền, nhiệm vụ và bàn giao thiết bị. Dự án có hai mục tiêu: xây dựng portfolio ứng tuyển Business Analyst Intern và phát triển phần mềm thực tế gồm frontend, backend, database và workflow.

Workspace lưu tài liệu phân tích nghiệp vụ, sơ đồ và thiết kế UI/UX; thư mục phát triển đã được chuẩn bị, chưa khởi tạo project lập trình hoặc cài dependency. Người dùng phụ trách vai trò BA; trợ lý hỗ trợ phân tích và thiết kế.

## Bắt đầu

1. Đọc [Project Charter](00-project-management/project-charter.md), [Roadmap](00-project-management/roadmap.md) và [Stakeholder Analysis](01-discovery/stakeholder-analysis.md).
2. Xem [phân tích As-Is](03-process-models/as-is-process-analysis.md), [Gap Analysis](03-process-models/pain-point-and-gap-analysis.md) và các sơ đồ trong [As-Is](03-process-models/as-is/) hoặc [To-Be](03-process-models/to-be/).
3. Theo dõi câu hỏi chưa được làm rõ tại [Open Questions Log](01-discovery/open-questions-log.md).
4. BA rà soát nội dung và quyết định công việc tiếp theo; phân biệt bản nháp với yêu cầu đã được xác nhận.

## Cấu trúc thư mục

| Thư mục | Nội dung dự kiến |
| --- | --- |
| [00-project-management](00-project-management/) | Project Charter và tài liệu quản lý dự án |
| [01-discovery](01-discovery/) | Bối cảnh, stakeholder, khảo sát, nguồn thông tin và thuật ngữ |
| [02-requirements](02-requirements/) | BRD, SRS, business rules, use case, user story và acceptance criteria |
| [03-process-models](03-process-models/) | BPMN hiện trạng và tương lai, activity diagram |
| [04-data-models](04-data-models/) | Mô hình dữ liệu, ERD và data dictionary |
| [05-interaction-models](05-interaction-models/) | Use case diagram, system context và sequence diagram |
| [06-ui-ux](06-ui-ux/) | User flow, cấu trúc màn hình, wireframe, thiết kế Figma và prototype |
| [07-validation](07-validation/) | Checklist rà soát, phản hồi và kịch bản UAT |
| [08-traceability](08-traceability/) | Liên kết mục tiêu, yêu cầu, sơ đồ, màn hình và kiểm thử |
| [09-implementation](09-implementation/) | Chuẩn bị mã nguồn frontend, backend, database và workflow thực thi |
| [99-archive](99-archive/) | Phiên bản đã được thay thế hoặc ngừng sử dụng |

## Nguyên tắc làm việc

- Viết nội dung bằng tiếng Việt; giữ thuật ngữ tiếng Anh khi cần để thống nhất với dự án.
- Phân biệt yêu cầu đã xác nhận, giả định và câu hỏi còn mở. Câu hỏi mới chỉ thêm vào Open Questions Log với mã `Q-xx`.
- Giữ tài liệu BA ở mức nghiệp vụ; cơ chế thực thi (engine, retry, idempotency) ghi tại `09-implementation/`.
- Giai đoạn lập trình là tùy chọn, thực hiện sau khi portfolio BA đã có thể gửi đi.
- Chỉ ghi trạng thái đã duyệt khi có xác nhận của người có thẩm quyền.
- Lưu nguồn sơ đồ có thể chỉnh sửa cùng bản xuất khi bắt đầu xây dựng sơ đồ.
- Thiết kế Figma sẽ được thực hiện ở giai đoạn UI/UX; thư mục hiện tại dùng để lưu mô tả, liên kết và bản xuất.

## Vị trí sơ đồ và tài liệu yêu cầu

- `03-process-models/as-is/` và `03-process-models/to-be/` chia theo `onboarding/`, `access-request/`, `offboarding/`. PNG quy trình chính và ngoại lệ nằm cùng nhóm với BPMN tương ứng.
- `02-requirements/` chia thành `brd/`, `srs/`, `business-rules/`, `use-case-specifications/`, `user-stories/` và `design-decisions/`. Xem [các quyết định thiết kế Onboarding To-Be](02-requirements/design-decisions/onboarding-to-be-design-decisions.md).
- `09-implementation/` gồm `frontend/`, `backend/`, `database/`, `workflow/`; xem [hướng dẫn thư mục phát triển](09-implementation/README.md).

## BPMN phân tích và BPMN thực thi

BPMN tại `03-process-models/` là mô hình phân tích nghiệp vụ. BPMN To-Be không mặc định là bản triển khai được trên Camunda. `09-implementation/workflow/` dành cho mô hình thực thi sau khi bổ sung cấu hình engine, worker và kiểm thử phù hợp. Hiện chưa sao chép mô hình BA vào thư mục này; chỉ có [ghi chú kỹ thuật Onboarding](09-implementation/workflow/onboarding-technical-notes.md).
