# BIÊN BẢN PHỎNG VẤN GIẢ LẬP (INTERVIEW NOTES)

**Dự án:** ELAMS

**Phiên bản:** 0.1

**Hình thức:** Mô phỏng phỏng vấn stakeholder

**Lưu ý:** Toàn bộ câu trả lời bên dưới là dữ liệu giả định phục vụ phân tích nghiệp vụ, không phải kết quả phỏng vấn doanh nghiệp thực tế.

---

## 1. HR Staff

**Câu hỏi HR-Q01:** Khi có nhân viên mới, HR bắt đầu quy trình như thế nào?

**Câu trả lời giả lập:**

HR tiếp nhận thông tin nhân viên từ bộ phận tuyển dụng, cập nhật vào Excel và gửi email cho IT cùng trưởng bộ phận. Nội dung email bao gồm họ tên, phòng ban, chức danh và ngày bắt đầu làm việc.

**Nhận định BA:**

Quy trình chưa có một đầu mối tập trung để tạo và theo dõi yêu cầu onboarding.

**Yêu cầu sơ bộ – REQ-001:**

Hệ thống cần cho phép HR tạo yêu cầu onboarding với các thông tin bắt buộc của nhân viên.

---

**Câu hỏi HR-Q03:** HR theo dõi tiến độ onboarding bằng cách nào?

**Câu trả lời giả lập:**

HR thường kiểm tra email hoặc liên hệ trực tiếp với IT để biết nhiệm vụ đã hoàn thành hay chưa.

**Nhận định BA:**

HR thiếu khả năng theo dõi tiến độ theo thời gian và trạng thái nhiệm vụ.

**Yêu cầu sơ bộ – REQ-002:**

Hệ thống cần hiển thị danh sách nhiệm vụ, trạng thái xử lý và người phụ trách của từng yêu cầu onboarding.

---

**Câu hỏi HR-Q14:** Có được hoàn tất offboarding khi vẫn còn nhiệm vụ bắt buộc chưa hoàn thành không?

**Câu trả lời giả lập:**

Không. Các nhiệm vụ bắt buộc như thu hồi quyền truy cập và thiết bị phải hoàn thành trước khi đóng quy trình, trừ trường hợp ngoại lệ đã được phê duyệt hợp lệ theo chính sách.

**Nhận định BA:**

Cần xác định điều kiện hoàn tất và cơ chế xử lý ngoại lệ.

**Yêu cầu sơ bộ – REQ-003:**

Hệ thống phải kiểm tra điều kiện hoàn tất trước khi cho phép đóng yêu cầu offboarding.

## 2. IT Staff

**Câu hỏi IT-Q01:** IT nhận yêu cầu cấp tài khoản bằng cách nào?

**Câu trả lời giả lập:**

Các yêu cầu chủ yếu được gửi qua email và tin nhắn. Một số yêu cầu không có đầy đủ thông tin về phòng ban hoặc loại quyền truy cập.

**Nhận định BA:**

Thông tin yêu cầu không thống nhất, dễ dẫn đến trao đổi bổ sung và chậm xử lý.

**Yêu cầu sơ bộ – REQ-004:**

Hệ thống cần cung cấp biểu mẫu yêu cầu cấp quyền với các trường thông tin bắt buộc.

---

**Câu hỏi IT-Q12:** Nếu yêu cầu chưa được phê duyệt, IT có được phép cấp quyền không?

**Câu trả lời giả lập:**

Không. IT chỉ được thực hiện cấp quyền khi các bước phê duyệt bắt buộc đã hoàn tất.

**Nhận định BA:**

Trạng thái phê duyệt là điều kiện tiên quyết trước khi tạo hoặc thực hiện nhiệm vụ cấp quyền.

**Yêu cầu sơ bộ – REQ-005:**

Hệ thống phải ngăn việc ghi nhận hoàn tất cấp quyền nếu yêu cầu chưa được phê duyệt hợp lệ.

---

**Câu hỏi IT-Q13:** Nếu không còn laptop để cấp thì xử lý thế nào?

**Câu trả lời giả lập:**

IT thông báo tình trạng thiếu thiết bị cho HR và trưởng bộ phận, đồng thời cập nhật nhiệm vụ sang trạng thái chờ thiết bị.

**Nhận định BA:**

Cần có trạng thái ngoại lệ và cơ chế thông báo cho những bên liên quan.

**Yêu cầu sơ bộ – REQ-006:**

Hệ thống cần cho phép IT ghi nhận tình trạng thiếu thiết bị và thông báo đến các bên liên quan.

## 3. Department Manager

**Câu hỏi MGR-Q04:** Khi từ chối yêu cầu, người phê duyệt có cần nhập lý do không?

**Câu trả lời giả lập:**

Có. Mọi quyết định từ chối cần được giải thích để người yêu cầu biết nguyên nhân và thực hiện điều chỉnh.

**Nhận định BA:**

Lý do từ chối là thông tin bắt buộc, cần được lưu cùng lịch sử phê duyệt.

**Yêu cầu sơ bộ – REQ-007:**

Hệ thống phải yêu cầu nhập lý do khi người có thẩm quyền từ chối yêu cầu cấp quyền.

---

**Câu hỏi MGR-Q05:** Nếu người phê duyệt vắng mặt thì sao?

**Câu trả lời giả lập:**

Manager có thể chỉ định người phê duyệt thay thế nếu người đó được ủy quyền theo chính sách.

**Nhận định BA:**

Cần cơ chế ủy quyền có hiệu lực và phạm vi cụ thể.

**Yêu cầu sơ bộ – REQ-008:**

Hệ thống cần hỗ trợ chỉ định người phê duyệt thay thế theo phạm vi và thời hạn ủy quyền hợp lệ.

## 4. Security Approver

**Câu hỏi SEC-Q02:** Quyền nào cần phê duyệt bảo mật?

**Câu trả lời giả lập:**

Những quyền có mức độ nhạy cảm cao, ví dụ quyền truy cập dữ liệu tài chính hoặc quyền quản trị hệ thống, cần được Security Approver kiểm tra sau bước xác nhận của Manager.

**Nhận định BA:**

Quy trình phê duyệt thay đổi dựa trên mức độ nhạy cảm của quyền truy cập.

**Yêu cầu sơ bộ – REQ-009:**

Hệ thống cần hỗ trợ quy trình phê duyệt nhiều cấp đối với các quyền truy cập được phân loại là nhạy cảm.

---

**Câu hỏi SEC-Q09:** Những hoạt động nào cần được ghi log?

**Câu trả lời giả lập:**

Các thao tác tạo yêu cầu, phê duyệt, từ chối, cập nhật trạng thái thực hiện, thay đổi quyền và thao tác quản trị quan trọng phải được lưu lịch sử.

**Nhận định BA:**

Audit Log là một yêu cầu quan trọng để truy vết trách nhiệm.

**Yêu cầu sơ bộ – REQ-010:**

Hệ thống cần lưu lịch sử các thao tác nghiệp vụ quan trọng, bao gồm người thực hiện, thời điểm, hành động và đối tượng bị tác động.

## 5. Danh sách yêu cầu sơ bộ

| ID | Yêu cầu | Nguồn giả lập |
| --- | --- | --- |
| REQ-001 | Tạo yêu cầu onboarding | HR-Q01 |
| REQ-002 | Theo dõi tiến độ nhiệm vụ | HR-Q03 |
| REQ-003 | Kiểm tra điều kiện hoàn tất offboarding | HR-Q14 |
| REQ-004 | Biểu mẫu yêu cầu cấp quyền | IT-Q01 |
| REQ-005 | Kiểm soát điều kiện cấp quyền | IT-Q12 |
| REQ-006 | Xử lý trường hợp thiếu thiết bị | IT-Q13 |
| REQ-007 | Bắt buộc nhập lý do từ chối | MGR-Q04 |
| REQ-008 | Hỗ trợ ủy quyền phê duyệt | MGR-Q05 |
| REQ-009 | Phê duyệt nhiều cấp | SEC-Q02 |
| REQ-010 | Lưu lịch sử thao tác | SEC-Q09 |

**Trạng thái của toàn bộ yêu cầu:** Proposed – Chưa được xác minh.

## 6. Các vấn đề chưa được làm rõ (Open Questions)

> **Ghi chú (21/11/2026):** Các câu hỏi dưới đây đã được gộp vào [Open Questions Log](open-questions-log.md) với mã mới `Q-xx`. Bảng này được giữ để truy vết; theo dõi và cập nhật trạng thái tại Open Questions Log.

| ID | Vấn đề | Stakeholder cần xác nhận |
| --- | --- | --- |
| OQ-001 | SLA onboarding được tính như thế nào? | HR, IT |
| OQ-002 | Những quyền nào được phân loại nhạy cảm? | Security Approver |
| OQ-003 | Ai có quyền phê duyệt ngoại lệ khi chưa thu hồi thiết bị? | HR, Manager |
| OQ-004 | Có cho phép sửa yêu cầu sau khi đã gửi phê duyệt? | Manager, Security |
| OQ-005 | Khi ủy quyền phê duyệt, ai được phép chỉ định người thay thế? | Manager, Administrator |
| OQ-006 | Ngày nghỉ việc thay đổi có ảnh hưởng đến những nhiệm vụ nào? | HR, IT |
| OQ-007 | Quyền truy cập tạm thời có cần ngày hết hạn không? | Security Approver |
| OQ-008 | Những vai trò nào được xem Audit Log? | Security, Administrator |

## 7. Kết luận

Bản mô phỏng ban đầu cho thấy nhu cầu cốt lõi của ELAMS tập trung vào:

- Quản lý tập trung các yêu cầu vòng đời nhân viên.
- Theo dõi và phân công nhiệm vụ.
- Kiểm soát quy trình phê duyệt quyền truy cập.
- Quản lý thiết bị và xử lý ngoại lệ.
- Lưu lịch sử để phục vụ kiểm tra và truy vết.

Các yêu cầu trên sẽ được tiếp tục phân tích, ưu tiên và hoàn thiện trong các tài liệu BRD, SRS và Business Rules Catalog.
