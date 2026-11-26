# Quy tắc và quyết định thiết kế cho Access Request To-Be

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 21/11/2026

**Trạng thái:** Đề xuất thiết kế của BA, chưa phải chính sách được phê duyệt.

**Sơ đồ liên quan:** [Access Request & Approval To-Be](../../process-models/to-be/access-request/to-be-access-request-approval.bpmn) (TB-AC-01).

**Mức chi tiết:** Thấp hơn Onboarding To-Be theo nguyên tắc tại [roadmap](../../project-management/roadmap.md), mục 3.

---

## 1. Tóm tắt thay đổi so với As-Is

| As-Is (AS-02) | To-Be (TB-AC-01) | Gap |
| --- | --- | --- |
| Gửi yêu cầu qua email, không có biểu mẫu | Tạo yêu cầu trên biểu mẫu có trường bắt buộc (R01) | GAP-AC-01 |
| Manager duyệt qua email | Manager xử lý trong Approval Inbox (M01) | GAP-AC-02 |
| Manager tự xác định quyền nhạy cảm | ELAMS xác định cấp phê duyệt theo danh mục quyền (S01) | GAP-AC-03 |
| Phê duyệt Security qua email | Security chỉ nhận yêu cầu sau khi Manager đã duyệt (SE01) | GAP-AC-04 |
| IT nhận email rồi tự xác minh phê duyệt | IT chỉ nhận nhiệm vụ cấp quyền khi đã đủ phê duyệt (I01) | GAP-AC-05 |
| Quyết định nằm rải rác trong nhiều email | Lịch sử yêu cầu lưu người duyệt, kết quả, lý do, thời điểm (S02) | GAP-AC-06 |
| Yêu cầu bổ sung qua email | Trạng thái Chờ bổ sung; người yêu cầu gửi lại hoặc hủy (R02) | GAP-AC-07 |

Sơ đồ giảm từ 17 task, 7 gateway (As-Is) xuống 8 task, 5 gateway: các bước chuyển email giữa các bên và bước IT tự xác minh phê duyệt không còn cần thiết.

## 2. Quy tắc nghiệp vụ

Phát biểu chính thức, loại, nguồn, trạng thái và câu hỏi mở của từng quy tắc nằm tại [Business Rules Catalog](../business-rules/business-rules-catalog.md). Bảng dưới đây chỉ ghi tên ngắn và vị trí trong BPMN.

| Mã | Tên ngắn | Vị trí trong BPMN |
| --- | --- | --- |
| BR-AC-01 | Trường bắt buộc của yêu cầu | R01 |
| BR-AC-02 | Lý do khi từ chối/bổ sung; không tự hủy khi chờ bổ sung | M01, SE01 |
| BR-AC-03 | Cấp phê duyệt suy ra từ danh mục quyền | S01, SG01, SE01 |
| BR-AC-04 | IT chỉ nhận việc khi đủ phê duyệt | I01 |
| BR-AC-05 | Chỉ đóng Đã cấp khi kết quả được ghi nhận | S02 |
| BR-AC-06 | Không tự phê duyệt yêu cầu của mình | M01 |
| BR-AC-07 | Không gửi trùng yêu cầu cho cùng quyền | R01 |

## 3. Trạng thái yêu cầu

| Trạng thái | Ý nghĩa | Bước liên quan |
| --- | --- | --- |
| Chờ Manager duyệt | Đã gửi, đang ở Approval Inbox của Manager | M01 |
| Chờ bổ sung | Manager yêu cầu thêm thông tin; chưa kết thúc | R02 |
| Chờ Security duyệt | Quyền nhạy cảm, Manager đã duyệt | SE01 |
| Chờ cấp quyền | Đủ phê duyệt, IT đang xử lý hoặc khắc phục lỗi | I01, I02 |
| Đã cấp | Kết thúc thành công | AR_End |
| Bị từ chối | Manager hoặc Security từ chối, có lý do | E_RejMgr, E_RejSec |
| Đã hủy | Người yêu cầu chủ động hủy khi đang chờ bổ sung | E_Cancel |

Không phản hồi khi đang Chờ bổ sung không làm yêu cầu tự hủy, trừ khi có chính sách được duyệt (Q-12).

## 4. Quan hệ với Onboarding To-Be

Logic phê duyệt từng quyền thống nhất với nhánh `Sub_Access` trong [Onboarding To-Be](../../process-models/to-be/onboarding/to-be-onboarding.bpmn): Manager duyệt → phân loại theo danh mục → Security duyệt nếu nhạy cảm → IT chuẩn bị tài khoản và cấp quyền. Điểm khác biệt:

- Onboarding có phân loại quyền bắt buộc/không bắt buộc và trạng thái BLOCKED; Access Request độc lập không có khái niệm này.
- Access Request có luồng bổ sung thông tin và hủy do người yêu cầu thực hiện.

Khi chuyển sang mô hình thực thi, có thể cân nhắc tách phần phê duyệt chung thành một quy trình dùng lại (Call Activity).

## 5. Ngoài phạm vi sơ đồ này

- Thu hồi quyền lẻ ngoài offboarding (MVP có nhắc "yêu cầu cấp hoặc thu hồi quyền"); hiện chỉ mô hình thu hồi trong [Offboarding To-Be](../../process-models/to-be/offboarding/to-be-offboarding.bpmn).
- Ủy quyền phê duyệt (Q-13), escalation, quyền tạm thời có hạn (Q-14): Could Have.
- Nhắc hạn phê duyệt (Q-05): Should Have.

## 6. Câu hỏi cần xác nhận

Theo dõi tại [Open Questions Log](../../discovery/open-questions-log.md): Q-06, Q-07 (danh mục quyền nhạy cảm), Q-12 (sửa yêu cầu sau khi gửi), Q-15 (đã có giả định), Q-35 (Manager tự yêu cầu quyền), Q-36 (Security có được yêu cầu bổ sung không).
