# KHAI THÁC YÊU CẦU NGHIỆP VỤ (REQUIREMENT ELICITATION)

**Dự án:** Hệ thống quản lý vòng đời nhân viên và quyền truy cập (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 1.0 – Bản nháp

**Ngày tạo:** 20/11/2026

**Người thực hiện:** Business Analyst

---

## 1. Mục đích

Tài liệu được xây dựng nhằm chuẩn bị hoạt động khai thác yêu cầu nghiệp vụ từ các bên liên quan.

Các thông tin cần làm rõ bao gồm:

- Quy trình tiếp nhận và nghỉ việc hiện tại.
- Vai trò và trách nhiệm của từng bộ phận.
- Các khó khăn trong quá trình thực hiện.
- Quy tắc phê duyệt và xử lý ngoại lệ.
- Nhu cầu về tính năng của hệ thống mới.
- Các yêu cầu liên quan đến bảo mật, thời gian xử lý và lịch sử thao tác.

## 2. Phương pháp khai thác yêu cầu

Các phương pháp dự kiến áp dụng:

| Phương pháp | Mục đích |
| --- | --- |
| Stakeholder Interview | Tìm hiểu nhu cầu và khó khăn của từng bên |
| Process Walkthrough | Tìm hiểu trình tự thực hiện các công việc |
| Document Analysis | Phân tích các biểu mẫu và chính sách giả định |
| Scenario Analysis | Làm rõ những tình huống ngoại lệ |
| Requirements Workshop | Đối chiếu và giải quyết mâu thuẫn giữa các nhóm |

Trong phạm vi dự án cá nhân, hoạt động phỏng vấn và workshop sẽ được mô phỏng. Các kết quả chưa được xác minh phải được ghi nhận dưới dạng giả định.

## 3. Bộ câu hỏi phỏng vấn HR Staff

**Mục tiêu:** Tìm hiểu quy trình tiếp nhận và nghỉ việc của nhân viên.

### A. Quy trình hiện tại (As-Is)

**HR-Q01:** Khi có nhân viên mới, bộ phận HR bắt đầu quy trình tiếp nhận như thế nào?

**HR-Q02:** HR cần cung cấp những thông tin nào cho IT và trưởng bộ phận?

**HR-Q03:** HR đang sử dụng công cụ nào để theo dõi tiến độ onboarding?

**HR-Q04:** Những công việc nào bắt buộc phải hoàn tất trước ngày nhân viên bắt đầu làm việc?

**HR-Q05:** Khi nhân viên nghỉ việc, HR phải thông báo cho những bộ phận nào?

**HR-Q06:** Ai chịu trách nhiệm xác nhận toàn bộ quy trình offboarding đã hoàn tất?

### B. Khó khăn hiện tại (Pain Points)

**HR-Q07:** Những nguyên nhân phổ biến nào khiến quy trình onboarding bị chậm?

**HR-Q08:** HR có thường gặp trường hợp IT chưa hoàn thành nhiệm vụ nhưng không được thông báo không?

**HR-Q09:** HR đang gặp khó khăn gì khi theo dõi việc thu hồi thiết bị và tài khoản?

### C. Nhu cầu hệ thống mới (To-Be)

**HR-Q10:** HR muốn theo dõi những trạng thái nào của yêu cầu onboarding/offboarding?

**HR-Q11:** HR có cần nhận thông báo khi nhiệm vụ quá hạn không?

**HR-Q12:** Những thông tin nào cần xuất hiện trên màn hình theo dõi tiến độ?

**HR-Q13:** HR có được phép thay đổi ngày bắt đầu làm việc hoặc ngày nghỉ việc sau khi tạo yêu cầu không?

**HR-Q14:** Nếu một nhiệm vụ bắt buộc chưa hoàn thành, HR có được phép đóng yêu cầu không?

---

## 4. Bộ câu hỏi phỏng vấn IT Staff

**Mục tiêu:** Tìm hiểu quy trình cấp/thu hồi quyền truy cập và quản lý thiết bị.

### A. Quy trình hiện tại (As-Is)

**IT-Q01:** IT nhận yêu cầu cấp tài khoản cho nhân viên mới qua những kênh nào?

**IT-Q02:** IT cần những thông tin gì để thực hiện yêu cầu?

**IT-Q03:** IT xác định nhân viên được cấp những quyền truy cập nào bằng cách nào?

**IT-Q04:** IT có cần kiểm tra trạng thái phê duyệt trước khi cấp quyền không?

**IT-Q05:** Quy trình cấp phát laptop và thiết bị đang diễn ra như thế nào?

**IT-Q06:** Khi nhân viên nghỉ việc, IT nhận thông tin để thu hồi tài khoản và thiết bị như thế nào?

### B. Khó khăn hiện tại (Pain Points)

**IT-Q07:** Những loại yêu cầu nào thường bị thiếu thông tin?

**IT-Q08:** IT có gặp tình trạng nhiều yêu cầu trùng lặp không?

**IT-Q09:** IT đang theo dõi lịch sử cấp phát và thu hồi thiết bị bằng cách nào?

### C. Nhu cầu hệ thống mới (To-Be)

**IT-Q10:** IT muốn danh sách nhiệm vụ được sắp xếp theo tiêu chí nào?

**IT-Q11:** IT cần cập nhật những trạng thái nào trong quá trình xử lý nhiệm vụ?

**IT-Q12:** Nếu quyền truy cập chưa được phê duyệt, hệ thống nên xử lý thế nào?

**IT-Q13:** Nếu không còn laptop để cấp phát, IT cần quy trình xử lý ngoại lệ nào?

**IT-Q14:** IT cần lưu những bằng chứng gì khi hoàn tất việc cấp hoặc thu hồi quyền?

---

## 5. Bộ câu hỏi phỏng vấn Department Manager

**Mục tiêu:** Tìm hiểu quy trình xác nhận nhu cầu và phê duyệt.

**MGR-Q01:** Trưởng bộ phận có vai trò gì khi tiếp nhận nhân viên mới?

**MGR-Q02:** Ai xác định danh sách quyền truy cập cần thiết cho từng vị trí?

**MGR-Q03:** Những yêu cầu nào bắt buộc phải được trưởng bộ phận phê duyệt?

**MGR-Q04:** Khi từ chối yêu cầu, người phê duyệt có cần nhập lý do không?

**MGR-Q05:** Nếu người phê duyệt nghỉ phép hoặc vắng mặt, yêu cầu sẽ được xử lý như thế nào?

**MGR-Q06:** Trưởng bộ phận có cần xem lịch sử các yêu cầu đã phê duyệt không?

**MGR-Q07:** Trưởng bộ phận được xem thông tin của nhân viên thuộc những phòng ban nào?

**MGR-Q08:** Những loại yêu cầu nào cần ưu tiên xử lý?

**MGR-Q09:** Khi nhân viên nghỉ việc, trưởng bộ phận cần xác nhận những công việc gì?

**MGR-Q10:** Nếu yêu cầu quá hạn phê duyệt, hệ thống nên thông báo cho ai?

---

## 6. Bộ câu hỏi phỏng vấn Security Approver

**Mục tiêu:** Xác định chính sách kiểm soát quyền truy cập.

**SEC-Q01:** Doanh nghiệp phân loại quyền truy cập theo những mức độ nhạy cảm nào?

**SEC-Q02:** Những loại quyền nào bắt buộc phải được bộ phận bảo mật phê duyệt?

**SEC-Q03:** Có trường hợp nào cần nhiều cấp phê duyệt không?

**SEC-Q04:** Một yêu cầu cấp quyền cần cung cấp những thông tin nào để được xét duyệt?

**SEC-Q05:** Quyền truy cập tạm thời có cần ngày hết hạn không?

**SEC-Q06:** Ai có quyền phê duyệt ngoại lệ đối với chính sách bảo mật?

**SEC-Q07:** Khi nhân viên nghỉ việc, những quyền nào phải được thu hồi ngay lập tức?

**SEC-Q08:** Nếu hệ thống bên ngoài không thể thu hồi quyền đúng hạn, quy trình xử lý sự cố là gì?

**SEC-Q09:** Những sự kiện nào bắt buộc phải được ghi vào Audit Log?

**SEC-Q10:** Ai được phép xem lịch sử cấp, thay đổi và thu hồi quyền?

---

## 7. Câu hỏi về tình huống ngoại lệ (Exception Scenarios)

### Scenario 01 – Nhân viên bắt đầu làm việc sớm hơn dự kiến

- Nếu HR thay đổi ngày bắt đầu làm việc, hệ thống cần cập nhật những nhiệm vụ nào?
- Ai được thông báo về thay đổi?
- SLA của các nhiệm vụ sẽ được tính lại như thế nào?

### Scenario 02 – Quyền truy cập chưa được phê duyệt

- IT có được phép cấp quyền trước khi phê duyệt không?
- Nếu yêu cầu bị từ chối, hệ thống cần cập nhật trạng thái nào?
- Người yêu cầu có được gửi lại yêu cầu không?

### Scenario 03 – Nhân viên nghỉ việc nhưng chưa hoàn trả laptop

- Hệ thống có cho phép hoàn tất offboarding không?
- Ai có quyền xử lý ngoại lệ?
- Thiết bị chưa thu hồi phải được theo dõi như thế nào?

### Scenario 04 – Người phê duyệt vắng mặt

- Yêu cầu có được chuyển sang người khác không?
- Ai được quyền chỉ định người phê duyệt thay thế?
- Việc ủy quyền có cần thời hạn và lịch sử không?

### Scenario 05 – Nhiệm vụ quá thời hạn xử lý

- SLA được tính theo giờ làm việc hay thời gian liên tục?
- Khi quá hạn, hệ thống gửi thông báo cho ai?
- Có cần cơ chế chuyển cấp xử lý (Escalation) không?

## 8. Các nhóm yêu cầu cần tổng hợp

Sau khi có kết quả phỏng vấn, BA sẽ phân loại thông tin thành:

1. Business Requirements – Yêu cầu nghiệp vụ.
2. Stakeholder Requirements – Yêu cầu của các bên liên quan.
3. Functional Requirements – Yêu cầu chức năng.
4. Non-functional Requirements – Yêu cầu phi chức năng.
5. Business Rules – Quy tắc nghiệp vụ.
6. Assumptions – Giả định.
7. Open Questions – Vấn đề chưa được làm rõ.
8. Constraints – Ràng buộc.

## 9. Tiêu chí hoàn thành

Hoạt động khai thác yêu cầu được xem là hoàn tất khi:

- Có bộ câu hỏi cho các stakeholder chính.
- Có biên bản ghi nhận kết quả phỏng vấn hoặc mô phỏng.
- Có danh sách yêu cầu sơ bộ có mã định danh.
- Các giả định được phân biệt với yêu cầu đã xác nhận.
- Các vấn đề chưa rõ được ghi nhận để tiếp tục phân tích.
