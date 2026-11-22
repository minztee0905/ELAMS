# Mô hình quy trình ELAMS

Lưu BPMN As-Is cho hiện trạng, BPMN To-Be cho quy trình tương lai và activity diagram cho hành vi cần phân tích chi tiết.

Mỗi quy trình cần xác định sự kiện bắt đầu/kết thúc, bên tham gia, trách nhiệm, điểm quyết định, dữ liệu bàn giao và nhánh ngoại lệ phù hợp. Ghi rõ hiện trạng hay đề xuất để tránh nhầm lẫn.

BPMN mô tả quy trình qua các bên tham gia. Activity diagram được bổ sung khi cần làm rõ logic của một tác vụ hoặc use case. Lưu nguồn sơ đồ có thể chỉnh sửa cùng bản xuất và liên kết tới yêu cầu liên quan.

## Phân nhóm sơ đồ

| Quy trình | As-Is | To-Be |
| --- | --- | --- |
| Onboarding | [as-is/onboarding](as-is/onboarding/) | [to-be/onboarding](to-be/onboarding/) |
| Access Request & Approval | [as-is/access-request](as-is/access-request/) | [to-be/access-request](to-be/access-request/) |
| Offboarding | [as-is/offboarding](as-is/offboarding/) | [to-be/offboarding](to-be/offboarding/) |

Trong mỗi nhóm, giữ BPMN và PNG quy trình chính hoặc ngoại lệ cùng nhau. Cả ba quy trình đã có BPMN As-Is và To-Be.

Tài liệu phân tích chung vẫn đặt ở cấp này: [As-Is Process Analysis](as-is-process-analysis.md) và [Pain Point & Gap Analysis](pain-point-and-gap-analysis.md).

BPMN ở đây là tài liệu BA. Mô hình Camunda thực thi sẽ được phát triển riêng tại [09-implementation/workflow](../09-implementation/workflow/); không mặc định sao chép To-Be sang đó. Việc di chuyển file không cập nhật lại nội dung hoặc thời điểm xuất của PNG.

## Nguyên tắc mô hình hóa

Áp dụng từ ngày 21/11/2026, khi chuẩn hóa toàn bộ BPMN hiện có:

- As-Is chỉ mô tả hiện trạng; các kiểm soát mới (phê duyệt ngoại lệ, bằng chứng, xác minh) thuộc To-Be và được truy vết qua Gap Analysis.
- Không tách bước "hệ thống ghi nhận/lưu" sau mỗi thao tác của người dùng; việc ghi nhận nằm trong thao tác đó.
- Quy trình đã có sơ đồ riêng thì tham chiếu bằng Call Activity thay vì vẽ lại (ví dụ As-Is Onboarding tham chiếu AS-02).
- Mỗi sơ đồ hoặc sơ đồ con nên dưới khoảng 15–20 task; vượt quá thì tách thành sơ đồ con.
- Cơ chế thực thi (worker, retry, idempotency) ghi tại `09-implementation/`, không đưa vào BPMN nghiệp vụ.

| Sơ đồ (tính cả sơ đồ con) | Trước khi rút gọn | Sau khi rút gọn |
| --- | --- | --- |
| As-Is Access Request | 19 task, 8 gateway, 35 luồng | 17 task, 7 gateway, 33 luồng (giữ nguyên logic) |
| As-Is Onboarding | 26 task, 6 gateway, 4 lane | 19 task + 1 Call Activity, 5 gateway, 3 lane |
| As-Is Offboarding | 35 task, 11 gateway, 60 luồng | 23 task, 8 gateway, 42 luồng |
| To-Be Onboarding | 50 task, 18 gateway, 91 luồng | 27 task, 12 gateway, 57 luồng |
| To-Be Access Request | – (tạo mới) | 8 task, 5 gateway, 20 luồng |
| To-Be Offboarding | – (tạo mới) | 17 task, 8 gateway, 43 luồng |

Bản trước khi rút gọn: [99-archive/process-models-before-simplification](../99-archive/process-models-before-simplification/). PNG cũ đã được xoá ngày 21/11/2026; BA xuất lại từ Camunda Modeler. Hai To-Be Access Request và Offboarding tạo ngày 21/11/2026 chưa có PNG.

Quy tắc đi kèm To-Be: [Onboarding](../02-requirements/design-decisions/onboarding-to-be-design-decisions.md), [Access Request](../02-requirements/design-decisions/access-request-to-be-design-decisions.md), [Offboarding](../02-requirements/design-decisions/offboarding-to-be-design-decisions.md).
