# Phát triển phần mềm ELAMS

Thư mục chuẩn bị cho giai đoạn phát triển ELAMS thành phần mềm thực tế. Hiện chưa khởi tạo project, viết mã nguồn hoặc cài dependency.

**Giai đoạn này là tùy chọn** (RM-06): chỉ bắt đầu sau khi portfolio BA đã có thể gửi đi. Không bắt buộc cho mục tiêu ứng tuyển BA Intern.

| Thư mục | Mục đích |
| --- | --- |
| [frontend](frontend/) | Mã nguồn giao diện |
| [backend](backend/) | API và business logic |
| [database](database/) | Migration, schema và dữ liệu mẫu |
| [workflow](workflow/) | BPMN thực thi bằng Camunda và cấu hình workflow liên quan |

[BPMN To-Be](../03-process-models/to-be/) là mô hình phân tích nghiệp vụ. Thư mục `workflow/` chỉ nhận mô hình thực thi khi có hoạt động triển khai được yêu cầu, cùng cấu hình và kiểm thử phù hợp. Đợt tổ chức thư mục này không sao chép hoặc di chuyển BPMN BA vào `workflow/`.

Các quyết định về cơ chế thực thi được tách khỏi tài liệu BA lưu tại [workflow/onboarding-technical-notes.md](workflow/onboarding-technical-notes.md).

Các thư mục trống có `.gitkeep` để sẵn sàng theo dõi bằng Git khi workspace được quản lý bằng Git.
