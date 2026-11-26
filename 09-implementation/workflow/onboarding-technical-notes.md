# Ghi chú kỹ thuật – Onboarding To-Be

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 21/11/2026

**Trạng thái:** Ghi chú cho giai đoạn lập trình (tùy chọn). Không thuộc bộ hồ sơ BA.

**Lưu ý:** Mã phần tử nhắc tới bên dưới (S08, `Boundary_CompletionChanged`, `Wait_NewCompletionInputs`, AT_*, A08…) thuộc BPMN To-Be trước khi rút gọn, có trong lịch sử Git. BPMN hiện hành ở mức nghiệp vụ; khi xây dựng mô hình thực thi cần thiết kế lại các phần tử này.

**Nguồn:** Chuyển từ [Onboarding To-Be design decisions](../../02-requirements/design-decisions/onboarding-to-be-design-decisions.md) bản 0.4 theo đề xuất RM-01 trong [roadmap-change-proposals.md](../../00-project-management/roadmap-change-proposals.md). Nội dung được giữ nguyên ý, chỉ sắp xếp lại.

---

## 1. Phạm vi

Tài liệu lưu các quyết định về cơ chế thực thi (Camunda, worker, retry, đồng bộ, idempotency) đã được thảo luận khi thiết kế BPMN Onboarding To-Be. Các nội dung này cần thiết khi triển khai phần mềm nhưng vượt quá phạm vi mô hình nghiệp vụ. Tài liệu BA chỉ giữ yêu cầu ở mức nghiệp vụ và liên kết tới đây.

## 2. Đóng onboarding và xử lý lỗi (từ BR-ON-08)

- Sau khi HR xác nhận, ELAMS cập nhật Completed và audit rồi mới kết thúc.
- Chỉ lỗi nghiệp vụ có mã `ON_COMPLETION_CONDITIONS_CHANGED` (điều kiện hoặc phiên bản thay đổi trước lúc ghi) mới quay về chờ nghiệp vụ qua `Boundary_CompletionChanged` tới S08.
- Trong giao dịch ghi, worker vẫn phải kiểm tra điều kiện/phiên bản mới nhất.
- Không dùng Boundary Error này cho lỗi DB, mạng hoặc backend.
- Lỗi kỹ thuật: worker báo fail job với số retry còn lại và thời gian chờ theo cấu hình. Hết retry tạo Incident để người vận hành xử lý; job chưa hoàn tất không được đưa luồng tới End Event. HR không sửa lỗi kỹ thuật và không xác nhận đã khắc phục kỹ thuật.
- Đây là yêu cầu triển khai, chưa phải cấu hình engine đã được thiết lập trong file BPMN.
- Lịch sử thiết kế: đã bỏ G03, G_CloseFailure, S_CloseTechnical và H_CloseRetry khỏi luồng đóng.

Nguồn: [Camunda Job workers](https://docs.camunda.io/docs/components/concepts/job-workers/), [Camunda Incidents](https://docs.camunda.io/docs/components/concepts/incidents/).

## 3. Chờ dữ liệu mới trước khi kiểm tra lại (từ BR-ON-07)

- Luồng S08 → H04 → Conditional Catch Event `Wait_NewCompletionInputs` → S06.
- Chỉ dữ liệu liên quan điều kiện hoàn tất có revision mới hơn lần đã kiểm tra mới cho phép quay lại S06.
- Đọc dữ liệu, ghi audit hoặc đổi trạng thái hiển thị không được coi là cập nhật mới.

## 4. Kiểm soát trùng lặp và đồng thời

Sequential Multi-instance chỉ giảm nguy cơ tạo trùng trong cùng một quy trình. Nhiều quy trình độc lập hoặc các lần retry vẫn có thể thao tác cùng một nhân viên/hệ thống đích. Backend cần idempotency, kiểm soát đồng thời và đối soát định danh tài khoản; không được dùng lựa chọn tuần tự thay cho các cơ chế này.

## 5. Hạng mục đặc tả kỹ thuật

| Mã | Nội dung cần đặc tả | Ví dụ cần kiểm chứng |
| --- | --- | --- |
| SRS-ON-02 | Thiết kế đồng bộ lịch theo nền tảng thực tế. Nếu dùng timer/job đang hoạt động, xác định cách cập nhật, hủy hoặc thay thế, trạng thái PENDING/FAILED, retry và phục hồi. Callback theo phiên bản cũ phải được nhận diện trước khi thực hiện nghiệp vụ. | Đổi ngày khi đang chờ phải làm lịch mới có hiệu lực; job cũ không được thực hiện theo hạn lỗi thời; lỗi đồng bộ không được báo hoàn tất. |
| SRS-ON-03 | Tính nhất quán giữa lưu hồ sơ và tạo đủ nhiệm vụ bắt buộc; xử lý tạo dở dang, retry, khóa định danh lần gửi và phục hồi. Chọn cơ chế giao dịch hoặc điều phối phù hợp trong thiết kế thực thi. | Lưu hồ sơ thành công nhưng tạo nhiệm vụ thất bại không được coi đã khởi tạo hoàn chỉnh; retry không tạo trùng hồ sơ hoặc nhiệm vụ; chỉ xử lý tiếp khi đủ nhiệm vụ. |
| SRS-ON-05 | Thiết kế biến cục bộ, thứ tự collection và output theo accessItemId/phiên bản cho Multi-instance tuần tự. Dùng tài khoản đúng nhân viên/hệ thống đích; kiểm soát trùng giữa các quy trình độc lập và khi retry bằng idempotency/kiểm soát đồng thời. | Item sau chỉ bắt đầu khi item trước kết thúc; quyền thứ hai dùng lại tài khoản đã tạo cho quyền trước cùng hệ thống; hai quy trình độc lập không được tạo hai tài khoản cho cùng định danh. |
| SRS-ON-06 | Thiết kế completionInputsRevision và snapshot đã kiểm tra. Đăng ký chờ phải nhận ra cập nhật đến sớm; không dùng audit hoặc lần kiểm tra làm dữ liệu kích hoạt lại. | Bấm hoàn thành H04 mà chưa có dữ liệu mới vẫn chờ; cập nhật trước khi đăng ký chờ không bị mất; chỉ ghi audit không làm lặp kiểm tra. |
| SRS-ON-07 | Cấu hình worker fail job, retry/backoff và Incident cho lỗi kỹ thuật; vận hành khắc phục. Chỉ dùng mã BPMN Error đã định nghĩa cho thay đổi điều kiện nghiệp vụ. Đóng/audit phải idempotent, đối soát trường hợp commit nhưng mất phản hồi. | Job thất bại chưa tới End Event; hết retry tạo Incident; xử lý lại không ghi hai lần Completed/audit; thay đổi điều kiện nghiệp vụ quay về S08 thay vì giao HR sửa lỗi kỹ thuật. |

Sơ đồ hiện tại không có Timer Event trong nhánh cấp quyền hoặc thiết bị. Yêu cầu đồng bộ lịch áp dụng khi hệ thống thực tế có lịch chờ hoặc job liên quan; việc cập nhật cơ sở dữ liệu không được coi là bằng chứng lịch đó đã đổi.

## 6. Câu hỏi kỹ thuật cần chốt khi triển khai

- Những lịch chờ hoặc job nào thực sự được sử dụng trong phiên bản triển khai đầu tiên?
- Cách phối hợp tài khoản chung giữa các quy trình độc lập (cùng nhân viên, cùng hệ thống đích) như thế nào?

Câu hỏi nghiệp vụ liên quan được theo dõi tại [Open Questions Log](../../01-discovery/open-questions-log.md).
