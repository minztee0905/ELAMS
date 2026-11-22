# USER STORIES VÀ ACCEPTANCE CRITERIA – EMPLOYEE ONBOARDING

**Dự án:** ELAMS

**Phạm vi:** Lát cắt Onboarding

**Phiên bản:** 0.3 – Bản nháp

**Thay đổi bản 0.3:** US-ON-02 AC-3 theo nguyên tắc khởi tạo trọn gói; US-ON-04 AC-1 dùng hai yêu cầu onboarding khác nhau; US-ON-09 thêm AC thu hồi quyền đã cấp khi phê duyệt không còn hiệu lực (BR-ON-12).

**Thay đổi bản 0.2:** Cập nhật US-ON-13 và US-ON-15 theo phân quyền và điều kiện kích hoạt cảnh báo trong Use Case v0.2.

**Ngày tạo:** 22/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [Đặc tả Use Case Onboarding](../use-case-specifications/onboarding-use-cases.md), [BRD Onboarding](../brd/brd-onboarding.md), [Business Rules Catalog](../business-rules/business-rules-catalog.md)

---

## 1. Quy ước

- **Mẫu story:** Là [vai trò], tôi muốn [hành động] để [giá trị].
- **Acceptance Criteria (AC):** viết theo Given/When/Then; mỗi AC kiểm chứng được và tham chiếu quy tắc khi có.
- **Mã:** `US-ON-xx`; AC đánh số `US-ON-xx.AC-n` để dùng trong RTM và UAT.
- **Ước lượng:** Story point tương đối (1, 2, 3, 5, 8) do BA đề xuất, dùng để thể hiện độ lớn, chưa thống nhất với nhóm phát triển.
- **Dữ liệu ví dụ:** nhân viên mới Nguyễn Văn An, chức danh Kế toán viên, phòng Kế toán, ngày bắt đầu 01/12/2026, Manager Trần Thị Bình. Quyền: Email công ty (bắt buộc), Phần mềm kế toán (bắt buộc, nhạy cảm), Kho tài liệu chung (không bắt buộc). Thiết bị: laptop. Nhân viên mới thứ hai (chỉ dùng ở US-ON-04): Lê Minh Châu, phòng Kế toán, ngày bắt đầu 08/12/2026, cùng Manager Trần Thị Bình.

**Definition of Ready** áp dụng cho mọi story: có BREQ và UC liên quan, AC kiểm chứng được, các câu hỏi mở ảnh hưởng đã có giả định ghi rõ.

## 2. Tổng hợp

| Mã | Story | Vai trò | UC | BREQ | Ưu tiên | Điểm |
| --- | --- | --- | --- | --- | --- | --- |
| US-ON-01 | Tạo yêu cầu onboarding | HR | UC-ON-01 | 01, 02 | Must | 5 |
| US-ON-02 | Tự động tạo nhiệm vụ khi khởi tạo | HR | UC-ON-01 | 03 | Must | 5 |
| US-ON-03 | Theo dõi tiến độ một yêu cầu | HR | UC-ON-02 | 04, 06 | Must | 3 |
| US-ON-04 | Xem việc cần làm của tôi | Manager, IT, Security | UC-ON-02 | 04 | Must | 2 |
| US-ON-05 | Phê duyệt hoặc từ chối nhu cầu quyền | Manager | UC-ON-03 | 05, 06, 10 | Must | 5 |
| US-ON-06 | Điều chỉnh quyền bắt buộc bị chặn | Manager | UC-ON-03 | 06 | Must | 3 |
| US-ON-07 | Xét duyệt quyền nhạy cảm | Security | UC-ON-04 | 05, 10 | Must | 3 |
| US-ON-08 | Cấp quyền với tài khoản đúng, không trùng | IT | UC-ON-05 | 05, 07 | Must | 5 |
| US-ON-09 | Báo lỗi cấp quyền và khắc phục | IT | UC-ON-05 | 06 | Must | 3 |
| US-ON-10 | Ghi nhận bàn giao thiết bị | IT | UC-ON-06 | 08 | Must | 3 |
| US-ON-11 | Ghi nhận thiếu thiết bị | IT | UC-ON-06 | 08 | Must | 2 |
| US-ON-12 | Xác nhận hoàn tất onboarding | HR | UC-ON-07 | 09 | Must | 5 |
| US-ON-13 | Xem lịch sử thao tác | Security, System Admin | UC-ON-09 | 10 | Must | 2 |
| US-ON-14 | Đổi ngày bắt đầu | HR | UC-ON-08 | 11 | Should | 5 |
| US-ON-15 | Nhận cảnh báo nhiệm vụ quá hạn | HR, Manager, Security, IT | UC-ON-10 | 12 | Should | 3 |

Tổng: 15 story, 54 điểm (Must 46, Should 8), 56 AC. BREQ-ON-13 (dashboard) để ở bước wireframe.

---

## 3. Chi tiết

### US-ON-01 – Tạo yêu cầu onboarding

**Là** nhân viên HR, **tôi muốn** tạo yêu cầu onboarding trên một biểu mẫu chuẩn **để** các bộ phận có đủ thông tin xử lý mà không phải hỏi lại qua email.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | HR mở biểu mẫu và chọn chức danh Kế toán viên | ELAMS tải mẫu | Danh sách quyền và thiết bị được đề xuất; mỗi quyền đã ghi bắt buộc hoặc không bắt buộc | BR-ON-01 |
| AC-2 | Biểu mẫu thiếu ngày bắt đầu | HR gửi yêu cầu | Yêu cầu không được tạo; trường ngày bắt đầu được chỉ ra kèm lý do | – |
| AC-3 | Ngày bắt đầu nằm trong quá khứ | HR gửi yêu cầu | Yêu cầu không được tạo; ELAMS báo ngày không hợp lệ | – |
| AC-4 | Nguyễn Văn An đã có yêu cầu onboarding đang xử lý | HR tạo yêu cầu mới cho An | Yêu cầu không được tạo; ELAMS hiển thị mã yêu cầu hiện có | BR-ON-11 |
| AC-5 | Quyền Email công ty là bắt buộc theo mẫu | HR đổi quyền này sang không bắt buộc | ELAMS không cho lưu thay đổi | BR-ON-01 |

**Giả định:** ngày bắt đầu không được trước ngày tạo yêu cầu; chính sách khoảng cách tối thiểu chờ Q-03.

### US-ON-02 – Tự động tạo nhiệm vụ khi khởi tạo

**Là** nhân viên HR, **tôi muốn** hệ thống tự tạo và giao nhiệm vụ cho từng bộ phận khi tôi gửi yêu cầu **để** không bộ phận nào bị bỏ sót.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu của An hợp lệ | HR gửi yêu cầu | Yêu cầu chuyển Đang xử lý; có nhiệm vụ xét duyệt quyền cho Trần Thị Bình và nhiệm vụ cấp laptop cho IT; mỗi nhiệm vụ có người phụ trách và hạn | BR-GEN-01 |
| AC-2 | Danh sách quyền có 3 quyền | Yêu cầu được khởi tạo | Chỉ quyền đầu tiên (Email công ty) có nhiệm vụ xét duyệt; hai quyền sau ở trạng thái Chờ xử lý | BR-ON-09 |
| AC-3 | Yêu cầu của An hợp lệ nhưng tạo nhiệm vụ thất bại | Quá trình khởi tạo kết thúc | Không có yêu cầu hay nhiệm vụ nào của An được ghi nhận; HR được báo khởi tạo chưa thành công; dữ liệu đã nhập vẫn còn trên biểu mẫu | BREQ-ON-03, BQ-ON-01 |
| AC-4 | Lần khởi tạo trước chưa thành công | HR thử lại | Chỉ có một yêu cầu và một bộ nhiệm vụ cho An | BQ-ON-01, BR-ON-11 |

### US-ON-03 – Theo dõi tiến độ một yêu cầu

**Là** nhân viên HR, **tôi muốn** xem trạng thái của yêu cầu và từng nhiệm vụ ở một nơi **để** biết còn việc gì, ai đang giữ và hạn khi nào.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu của An đang xử lý | HR mở yêu cầu | Thấy trạng thái yêu cầu, từng nhiệm vụ với người phụ trách, hạn, trạng thái | BR-GEN-01 |
| AC-2 | Phần mềm kế toán đang BLOCKED | HR mở yêu cầu | Thấy quyền BLOCKED, lý do và người cần xử lý; thấy quyền phía sau đang chờ vì quyền này | BR-ON-02, BR-ON-09 |
| AC-3 | Kho tài liệu chung bị từ chối | HR mở yêu cầu | Quyền hiển thị REJECTED kèm lý do và người từ chối | BR-ON-02, BR-GEN-02 |

### US-ON-04 – Xem việc cần làm của tôi

**Là** Manager, IT hoặc Security, **tôi muốn** thấy danh sách nhiệm vụ được giao cho mình **để** xử lý mà không phải chờ email.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Bình có 2 nhiệm vụ xét duyệt thuộc hai yêu cầu khác nhau: quyền Email công ty của An (hạn 26/11/2026) và quyền Email công ty của Châu (hạn 02/12/2026) | Bình mở danh sách việc cần làm | Thấy đúng 2 nhiệm vụ, nhiệm vụ của An đứng trước | BR-GEN-01, BR-ON-09 |
| AC-2 | Một nhân viên IT khác không được giao nhiệm vụ của An | Người đó mở danh sách | Không thấy nhiệm vụ của An | – (ma trận quyền ở SRS, Q-33) |

### US-ON-05 – Phê duyệt hoặc từ chối nhu cầu quyền

**Là** Manager, **tôi muốn** phê duyệt hoặc từ chối từng quyền của nhân viên mới **để** chỉ những quyền cần cho công việc mới được cấp.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Quyền Email công ty (không nhạy cảm) chờ Bình duyệt | Bình phê duyệt | IT nhận nhiệm vụ cấp quyền; quyết định lưu người, kết quả, thời điểm | BR-AC-03, BR-GEN-03 |
| AC-2 | Quyền Phần mềm kế toán (nhạy cảm) chờ Bình duyệt | Bình phê duyệt | Security nhận nhiệm vụ xét duyệt; IT chưa nhận nhiệm vụ | BR-AC-03, BR-AC-04 |
| AC-3 | Quyền Kho tài liệu chung (không bắt buộc) | Bình từ chối và nhập lý do | Quyền kết thúc REJECTED; không có nhiệm vụ cấp quyền | BR-ON-01, BR-ON-02 |
| AC-4 | Bất kỳ quyền nào | Bình từ chối mà không nhập lý do | Quyết định không được lưu | BR-GEN-02 |
| AC-5 | Quyền Email công ty (bắt buộc) | Bình từ chối và nhập lý do | Quyền chuyển BLOCKED (không phải REJECTED); Bình nhận nhiệm vụ điều chỉnh | BR-ON-01, BR-ON-02 |

### US-ON-06 – Điều chỉnh quyền bắt buộc bị chặn

**Là** Manager, **tôi muốn** điều chỉnh nhu cầu của một quyền bắt buộc đã bị chặn **để** onboarding có thể tiếp tục.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Phần mềm kế toán BLOCKED do Security từ chối mức quyền quản trị | Bình đổi sang mức quyền xem và gửi lại | Quyền quay lại bước xét duyệt của Manager với nội dung mới | BR-ON-02 |
| AC-2 | Quyền đang BLOCKED | Chưa có điều chỉnh | Quyền phía sau vẫn ở trạng thái Chờ xử lý | BR-ON-09 |
| AC-3 | Quyền đang BLOCKED | Bình cố đánh dấu quyền là không bắt buộc | ELAMS không cho thay đổi phân loại | BR-ON-01 |

### US-ON-07 – Xét duyệt quyền nhạy cảm

**Là** Security Approver, **tôi muốn** xét duyệt các quyền nhạy cảm sau khi Manager đã duyệt **để** quyền rủi ro cao được kiểm soát đúng cấp.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Phần mềm kế toán đã được Bình phê duyệt | Security mở nhiệm vụ | Thấy quyết định và lý do nghiệp vụ của Manager | BR-AC-03 |
| AC-2 | Như trên | Security phê duyệt | IT nhận nhiệm vụ cấp quyền | BR-AC-04 |
| AC-3 | Như trên | Security từ chối và nhập lý do | Quyền bắt buộc chuyển BLOCKED; Bình nhận nhiệm vụ điều chỉnh | BR-ON-01, BR-GEN-02 |
| AC-4 | Quyền chưa được Manager phê duyệt | – | Security không có nhiệm vụ xét duyệt cho quyền đó | BR-AC-03 |

### US-ON-08 – Cấp quyền với tài khoản đúng, không trùng

**Là** nhân viên IT, **tôi muốn** biết nhân viên đã có tài khoản trên hệ thống đích hay chưa trước khi cấp quyền **để** không tạo trùng tài khoản.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Quyền đã đủ phê duyệt | IT mở nhiệm vụ | Thấy các phê duyệt đã có và tài khoản đã ghi nhận của An trên hệ thống đích (nếu có) | BR-AC-04, BR-ON-10 |
| AC-2 | An chưa có tài khoản | IT tạo tài khoản, cấp quyền và cập nhật thành công kèm bằng chứng | Quyền chuyển COMPLETED; quyền tiếp theo bắt đầu | BR-ON-02, BR-ON-09 |
| AC-3 | Tài khoản của An trên hệ thống đích đã được tạo cho quyền trước | IT xử lý quyền thứ hai trên cùng hệ thống | ELAMS đề xuất dùng lại tài khoản đó; không có tài khoản thứ hai được ghi nhận | BR-ON-10 |
| AC-4 | Quyền chưa đủ phê duyệt | – | Không có nhiệm vụ cấp quyền cho IT | BR-AC-04 |

### US-ON-09 – Báo lỗi cấp quyền và khắc phục

**Là** nhân viên IT, **tôi muốn** ghi nhận khi cấp quyền thất bại hoặc chưa xác định được tài khoản **để** quyền không bị coi là đã xong khi chưa xong.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | IT không xác định được An đã có tài khoản hay chưa | IT cập nhật kết quả "chưa xác định" | Quyền chuyển BLOCKED kèm lý do; IT không tạo tài khoản mới | BR-ON-10 |
| AC-2 | Cấp quyền thất bại | IT cập nhật thất bại và lý do | Quyền chuyển BLOCKED; HR thấy lý do trên yêu cầu | BR-ON-02 |
| AC-3 | Quyền BLOCKED do lỗi cấp | IT khắc phục và gửi lại | IT quay lại bước kiểm tra tài khoản trước khi cấp tiếp | BR-ON-10 |
| AC-4 | IT đã cấp quyền Phần mềm kế toán cho An, nhưng ELAMS phát hiện phê duyệt của Security không còn hiệu lực | ELAMS kiểm tra kết quả | Quyền chuyển BLOCKED; IT nhận yêu cầu thu hồi hoặc tạm ngừng quyền trên hệ thống đích | BR-ON-12 |
| AC-5 | Như AC-4 | IT thu hồi quyền và ghi kết quả kèm bằng chứng | Quyền giữ BLOCKED; quyền chỉ được cấp lại sau khi có phê duyệt hợp lệ mới | BR-ON-12, BR-AC-04 |

### US-ON-10 – Ghi nhận bàn giao thiết bị

**Là** nhân viên IT, **tôi muốn** ghi nhận bàn giao thiết bị kèm biên bản **để** truy được thiết bị nào đang ở với ai.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Laptop đã giao, An đã ký biên bản | IT nhập mã thiết bị, thời gian, tình trạng, mã biên bản và đính kèm biên bản | Nhiệm vụ thiết bị hoàn thành; thiết bị gắn với An | BR-GEN-03 |
| AC-2 | Thiếu file biên bản | IT lưu ghi nhận | Nhiệm vụ chưa hoàn thành; ELAMS chỉ ra biên bản còn thiếu | – |

### US-ON-11 – Ghi nhận thiếu thiết bị

**Là** nhân viên IT, **tôi muốn** ghi nhận khi chưa có thiết bị phù hợp **để** HR biết lý do chờ và nhiệm vụ không bị coi là quên.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Kho không có laptop phù hợp | IT ghi nhận thiếu thiết bị và lý do | Nhiệm vụ ở trạng thái chờ; HR thấy lý do trên yêu cầu | BR-ON-03 |
| AC-2 | Nhiệm vụ đang chờ thiết bị | Chưa có xác nhận mới từ IT | Nhiệm vụ không tự chuyển trạng thái | BR-ON-03 |
| AC-3 | Nhiệm vụ đang chờ thiết bị | IT xác nhận đã có laptop thay thế | Nhiệm vụ quay lại bước kiểm tra và bàn giao | BR-ON-03 |

### US-ON-12 – Xác nhận hoàn tất onboarding

**Là** nhân viên HR, **tôi muốn** chỉ đóng onboarding khi hệ thống xác nhận mọi điều kiện bắt buộc đã đạt **để** không đóng nhầm khi nhân viên còn thiếu quyền hoặc thiết bị.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Email và Phần mềm kế toán COMPLETED, Kho tài liệu REJECTED, laptop đã bàn giao | Nhánh cuối cùng kết thúc | Yêu cầu chuyển Chờ HR xác nhận; HR thấy tóm tắt kết quả từng quyền và thiết bị | BR-ON-06 |
| AC-2 | Như AC-1 | HR xác nhận hoàn tất | Yêu cầu chuyển Hoàn tất; lịch sử ghi người xác nhận và thời điểm | BR-ON-08, BR-GEN-03 |
| AC-3 | Phần mềm kế toán đang BLOCKED | ELAMS kiểm tra điều kiện | Yêu cầu chuyển Chờ xử lý điều kiện còn thiếu; HR thấy điều kiện chưa đạt và người đang giữ; HR không có nút xác nhận hoàn tất | BR-ON-06, BR-ON-07 |
| AC-4 | Yêu cầu đang Chờ xử lý điều kiện còn thiếu | HR chỉ mở xem yêu cầu, không có dữ liệu nào thay đổi | ELAMS không kiểm tra lại | BR-ON-07 |
| AC-5 | HR đang xác nhận thì phê duyệt của một quyền hết hiệu lực | HR bấm xác nhận | Yêu cầu không chuyển Hoàn tất; quay về Chờ xử lý điều kiện còn thiếu và HR được báo lý do | BR-ON-08 |

### US-ON-13 – Xem lịch sử thao tác

**Là** Security Approver hoặc System Administrator, **tôi muốn** xem lịch sử thao tác của một yêu cầu onboarding **để** truy vết ai đã quyết định gì và khi nào.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu của An đã hoàn tất | Security mở lịch sử | Thấy theo thời gian: tạo yêu cầu, từng quyết định phê duyệt/từ chối kèm lý do, cấp quyền, bàn giao thiết bị, xác nhận hoàn tất | BR-GEN-03 |
| AC-2 | Security đang xem lịch sử | – | Không có chức năng sửa hoặc xóa bản ghi lịch sử | BR-GEN-03, BQ-ON-04 |
| AC-3 | Người dùng có vai trò HR hoặc Manager | Mở chức năng lịch sử thao tác | Không truy cập được; quyết định và lý do trong yêu cầu của mình vẫn xem được tại chi tiết yêu cầu (US-ON-03) | – (giả định Q-30) |

### US-ON-14 – Đổi ngày bắt đầu (Should)

**Là** nhân viên HR, **tôi muốn** đổi ngày bắt đầu khi yêu cầu đang xử lý **để** hạn của các bên được cập nhật mà không phải báo từng người.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Ngày bắt đầu 01/12/2026; nhiệm vụ cấp laptop chưa xong; Email công ty đã COMPLETED | HR đổi sang 08/12/2026 kèm lý do | Hạn nhiệm vụ cấp laptop được tính lại; quyền Email công ty giữ nguyên COMPLETED | BR-ON-04 |
| AC-2 | Như AC-1 | Đổi ngày | Không quyền nào bị cấp lại hoặc thu hồi vì đổi ngày | BR-ON-04 |
| AC-3 | Hạn nhiệm vụ chưa cập nhật xong theo ngày mới | Mọi nhánh khác đã đạt | Yêu cầu chưa được chuyển Chờ HR xác nhận | BR-ON-05 |

**Giả định:** cách tính hạn mới chờ Q-03.

### US-ON-15 – Nhận cảnh báo nhiệm vụ quá hạn (Should)

**Là** người phụ trách nhiệm vụ (HR, Manager, Security, IT) hoặc HR phụ trách yêu cầu, **tôi muốn** được báo khi nhiệm vụ quá hạn **để** xử lý trước khi nhân viên mới bắt đầu làm việc.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nhiệm vụ cấp laptop hạn 28/11/2026, chưa xong | Qua hạn | Nhiệm vụ được đánh dấu quá hạn; người phụ trách và HR nhận thông báo | BR-GEN-01 |
| AC-2 | Nhiệm vụ đã hoàn thành trước hạn | Đến hạn | Không có cảnh báo | BR-GEN-01 |
| AC-3 | Quyền Phần mềm kế toán đang BLOCKED, nhiệm vụ điều chỉnh của Bình hạn 27/11/2026 | Qua hạn | Bình và HR nhận cảnh báo (nhiệm vụ đang chờ vẫn được cảnh báo) | BR-GEN-01 |
| AC-4 | Đã gửi cảnh báo quá hạn cho nhiệm vụ cấp laptop | ELAMS kiểm tra lại, hạn không đổi | Không gửi cảnh báo lần hai | BR-GEN-01 |
| AC-5 | Nhiệm vụ cấp laptop đang Quá hạn | HR dời ngày bắt đầu, hạn mới là 05/12/2026 | Dấu Quá hạn được gỡ | BR-GEN-01, BR-ON-04 |

**Giả định:** cách tính SLA và người nhận escalation chờ Q-01, Q-05.

---

## 4. Độ phủ

| Quy tắc | Story kiểm chứng |
| --- | --- |
| BR-GEN-01 | US-ON-02, 03, 04, 15 |
| BR-GEN-02 | US-ON-03, 05, 07 |
| BR-GEN-03 | US-ON-05, 10, 12, 13 |
| BR-AC-03 | US-ON-05, 07 |
| BR-AC-04 | US-ON-05, 07, 08, 09 |
| BR-ON-01 | US-ON-01, 05, 06, 07 |
| BR-ON-02 | US-ON-03, 05, 06, 08, 09 |
| BR-ON-03 | US-ON-11 |
| BR-ON-04 | US-ON-14, 15 |
| BR-ON-05 | US-ON-14 |
| BR-ON-06, BR-ON-07, BR-ON-08 | US-ON-12 |
| BR-ON-09 | US-ON-02, 03, 04, 06, 08 |
| BR-ON-10 | US-ON-08, 09 |
| BR-ON-11 | US-ON-01, 02 |
| BR-ON-12 | US-ON-09 |

Mọi quy tắc BR-GEN và BR-ON áp dụng cho Onboarding đều có ít nhất một AC kiểm chứng. Bảng này là đầu vào cho RTM.
