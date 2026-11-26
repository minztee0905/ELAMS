# KỊCH BẢN UAT – EMPLOYEE ONBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Đã chuẩn bị, chưa thực hiện

**Nguồn:** [User Stories và AC](../requirements/user-stories/onboarding-user-stories.md), [Đặc tả màn hình](../ui-ux/onboarding-screen-specifications.md), [RTM](../traceability/rtm-onboarding.md)

---

## 1. Chuẩn bị

**Người tham gia:**

| Vai trò | Người thử |
| --- | --- |
| HR Staff | Lê Thu Hà |
| Department Manager | Trần Thị Bình |
| Security Approver | Võ Thanh Hải |
| IT Staff | Phạm Quốc Dũng, Đỗ Minh Khoa (IT không được giao nhiệm vụ) |
| System Administrator | Quản trị viên |

**Dữ liệu cấu hình:**

- Mẫu vị trí Kế toán viên gồm 3 quyền theo thứ tự:
  - Email công ty, Microsoft 365, bắt buộc.
  - Phần mềm kế toán, MISA, bắt buộc, nhạy cảm.
  - Kho tài liệu chung, SharePoint, không bắt buộc.
- Thiết bị theo mẫu: 1 laptop.

**Nhân viên mới:**

| Họ tên | Email cá nhân | Chức danh | Ngày bắt đầu | Manager |
| --- | --- | --- | --- | --- |
| Nguyễn Văn An | an.nguyen@gmail.com | Kế toán viên | 01/12/2026 | Trần Thị Bình |
| Lê Minh Châu | chau.le@gmail.com | Kế toán viên | 08/12/2026 | Trần Thị Bình |

Ngày thực hiện giả định là 24/11/2026; các test về hạn và quá hạn ghi rõ thời điểm cần giả lập.

**Tiêu chí đạt:** mọi bước có kết quả thực tế khớp kết quả mong đợi. Một bước sai là test case không đạt và được ghi lỗi.

## 2. Tổng hợp

| Mã | Test case | Ưu tiên | BREQ | Acceptance Criteria | Kết quả |
| --- | --- | --- | --- | --- | --- |
| UAT-ON-01 | Tạo yêu cầu hợp lệ | Must | 01, 03, 04 | US-ON-01 AC-1, AC-5; US-ON-02 AC-1, AC-2; US-ON-03 AC-1 | |
| UAT-ON-02 | Dữ liệu không hợp lệ | Must | 02 | US-ON-01 AC-2, AC-3 | |
| UAT-ON-03 | Chặn yêu cầu trùng | Must | 01 | US-ON-01 AC-4 | |
| UAT-ON-04 | Khởi tạo thất bại và gửi lại | Must | 03 | US-ON-02 AC-3, AC-4 | |
| UAT-ON-05 | Phê duyệt quyền thường và quyền nhạy cảm | Must | 05 | US-ON-05 AC-1, AC-2; US-ON-07 AC-1, AC-2, AC-4; US-ON-08 AC-4 | |
| UAT-ON-06 | Từ chối quyền không bắt buộc | Must | 06, 10 | US-ON-05 AC-3, AC-4; US-ON-03 AC-3 | |
| UAT-ON-07 | Từ chối quyền bắt buộc và điều chỉnh | Must | 06 | US-ON-05 AC-5; US-ON-06 AC-1, AC-2, AC-3; US-ON-07 AC-3; US-ON-03 AC-2 | |
| UAT-ON-08 | Cấp quyền và dùng lại tài khoản | Must | 07 | US-ON-08 AC-1, AC-2, AC-3 | |
| UAT-ON-09 | Lỗi cấp quyền và khắc phục | Must | 06, 07 | US-ON-09 AC-1, AC-2, AC-3 | |
| UAT-ON-10 | Thu hồi quyền khi phê duyệt mất hiệu lực | Must | 05 | US-ON-09 AC-4, AC-5 | |
| UAT-ON-11 | Thiếu thiết bị và bàn giao | Must | 08 | US-ON-10 AC-1, AC-2; US-ON-11 AC-1, AC-2, AC-3 | |
| UAT-ON-12 | Xác nhận hoàn tất onboarding | Must | 09 | US-ON-12 AC-1, AC-2, AC-3, AC-4 | |
| UAT-ON-13 | Điều kiện thay đổi và lỗi khi xác nhận | Must | 09 | US-ON-12 AC-5; BQ-ON-02 | |
| UAT-ON-14 | Việc cần làm, lịch sử và phân quyền | Must | 04, 10 | US-ON-04 AC-1, AC-2; US-ON-13 AC-1, AC-2, AC-3 | |
| UAT-ON-15 | Đổi ngày bắt đầu | Should | 11 | US-ON-14 AC-1, AC-2, AC-3; US-ON-15 AC-5 | |
| UAT-ON-16 | Cảnh báo nhiệm vụ quá hạn | Should | 12 | US-ON-15 AC-1, AC-2, AC-3, AC-4 | |

16 test case phủ toàn bộ 56 AC và BQ-ON-02. BQ-ON-03 (giao diện tiếng Việt) được kiểm trong mọi test case.

---

## 3. Chi tiết

### UAT-ON-01 – Tạo yêu cầu hợp lệ

**Vai trò:** HR · **Màn hình:** SCR-ON-01, SCR-ON-02 · **Tiền điều kiện:** An chưa có yêu cầu onboarding.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Mở Tạo yêu cầu, nhập thông tin của An, chọn chức danh Kế toán viên | Danh sách 3 quyền và 1 laptop được đề xuất; mỗi quyền ghi bắt buộc hoặc không bắt buộc |
| 2 | Thử đổi Email công ty sang không bắt buộc | Không đổi được; quyền vẫn là bắt buộc |
| 3 | Bấm Gửi yêu cầu | Thông báo đã tạo yêu cầu; yêu cầu ở trạng thái Đang xử lý |
| 4 | Xem danh sách nhiệm vụ đã tạo | Có nhiệm vụ xét duyệt Email công ty cho Trần Thị Bình và nhiệm vụ cấp laptop cho IT, mỗi nhiệm vụ có người phụ trách và hạn |
| 5 | Mở chi tiết yêu cầu, thẻ Quyền | Chỉ Email công ty đang xử lý; Phần mềm kế toán và Kho tài liệu chung ở trạng thái Chờ xử lý |

### UAT-ON-02 – Dữ liệu không hợp lệ

**Vai trò:** HR · **Màn hình:** SCR-ON-01

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Nhập đủ thông tin của Châu nhưng để trống ngày bắt đầu, bấm Gửi | Không tạo yêu cầu; trường Ngày bắt đầu báo lỗi kèm lý do |
| 2 | Nhập ngày bắt đầu 20/11/2026, bấm Gửi | Không tạo yêu cầu; báo ngày bắt đầu không được trước hôm nay |
| 3 | Kiểm tra danh sách nhiệm vụ của Bình và IT | Không có nhiệm vụ nào cho Châu |

### UAT-ON-03 – Chặn yêu cầu trùng

**Vai trò:** HR · **Màn hình:** SCR-ON-01 · **Tiền điều kiện:** Hoàn thành UAT-ON-01.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Tạo yêu cầu mới với email an.nguyen@gmail.com, bấm Gửi | Không tạo yêu cầu; cảnh báo An đã có yêu cầu đang xử lý và hiển thị mã yêu cầu hiện có |
| 2 | Bấm liên kết mở yêu cầu hiện có | Mở đúng yêu cầu của An đã tạo ở UAT-ON-01 |

### UAT-ON-04 – Khởi tạo thất bại và gửi lại

**Vai trò:** HR · **Màn hình:** SCR-ON-01 · **Tiền điều kiện:** Nhóm phát triển giả lập lỗi khi tạo nhiệm vụ.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Nhập yêu cầu hợp lệ cho Châu, bấm Gửi | Báo khởi tạo chưa thành công; dữ liệu đã nhập vẫn còn trên biểu mẫu |
| 2 | Kiểm tra danh sách yêu cầu và nhiệm vụ | Không có yêu cầu hay nhiệm vụ nào của Châu |
| 3 | Tắt giả lập lỗi, bấm Gửi lại | Tạo yêu cầu thành công |
| 4 | Kiểm tra lại | Chỉ có một yêu cầu và một bộ nhiệm vụ cho Châu |

### UAT-ON-05 – Phê duyệt quyền thường và quyền nhạy cảm

**Vai trò:** Manager, Security, IT · **Màn hình:** SCR-ON-03 · **Tiền điều kiện:** Yêu cầu của An từ UAT-ON-01.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình phê duyệt Email công ty | Quyết định lưu người, kết quả, thời điểm; IT nhận nhiệm vụ cấp Email công ty |
| 2 | IT hoàn tất cấp Email công ty (theo UAT-ON-08); kiểm tra Việc cần làm của Security | Security chưa có nhiệm vụ cho Phần mềm kế toán vì Manager chưa duyệt |
| 3 | Bình phê duyệt Phần mềm kế toán, ghi lý do nghiệp vụ | Security nhận nhiệm vụ xét duyệt; IT chưa có nhiệm vụ cấp quyền này |
| 4 | Hải mở nhiệm vụ | Thấy quyết định và lý do nghiệp vụ của Bình |
| 5 | Hải phê duyệt | IT nhận nhiệm vụ cấp Phần mềm kế toán |

### UAT-ON-06 – Từ chối quyền không bắt buộc

**Vai trò:** Manager, HR · **Màn hình:** SCR-ON-03, SCR-ON-02 · **Tiền điều kiện:** Kho tài liệu chung đang chờ Bình duyệt.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình chọn Từ chối, để trống lý do, bấm Gửi | Quyết định không được lưu; báo cần nhập lý do |
| 2 | Nhập lý do "Chưa cần trong tháng đầu", bấm Gửi | Quyền kết thúc REJECTED; không có nhiệm vụ cấp quyền cho IT |
| 3 | HR mở chi tiết yêu cầu | Kho tài liệu chung hiển thị REJECTED kèm lý do và người từ chối |

### UAT-ON-07 – Từ chối quyền bắt buộc và điều chỉnh

**Vai trò:** Security, Manager, HR · **Màn hình:** SCR-ON-03, SCR-ON-02 · **Tiền điều kiện:** Bình đã duyệt Phần mềm kế toán ở mức Quản trị.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Hải từ chối với lý do "Chỉ cần quyền xem" | Quyền chuyển BLOCKED, không phải REJECTED; Bình nhận nhiệm vụ điều chỉnh |
| 2 | HR mở chi tiết yêu cầu | Thấy quyền BLOCKED, lý do, người cần xử lý; Kho tài liệu chung vẫn Chờ xử lý vì quyền này |
| 3 | Bình mở nhiệm vụ điều chỉnh, thử đổi phân loại sang không bắt buộc | Không đổi được |
| 4 | Bình đổi mức quyền sang Xem, nhập nội dung điều chỉnh, gửi lại | Quyền quay lại bước xét duyệt của Manager với mức Xem |

### UAT-ON-08 – Cấp quyền và dùng lại tài khoản

**Vai trò:** IT · **Màn hình:** SCR-ON-04 · **Tiền điều kiện:** Email công ty đã đủ phê duyệt; An chưa có tài khoản trên Microsoft 365.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng mở nhiệm vụ cấp Email công ty | Thấy các phê duyệt đã có; ELAMS báo chưa ghi nhận tài khoản nào của An trên hệ thống này |
| 2 | Chọn "Chưa có – đã tạo mới", nhập an.nguyen, chọn Thành công, đính kèm bằng chứng, gửi | Quyền chuyển COMPLETED; quyền tiếp theo bắt đầu |
| 3 | Giả lập thêm quyền thứ hai trên Microsoft 365 cho An, mở nhiệm vụ | ELAMS hiển thị tài khoản an.nguyen và chọn sẵn dùng lại; không có lựa chọn tạo mới |
| 4 | Hoàn tất cấp quyền thứ hai | Chỉ có một tài khoản của An trên Microsoft 365 được ghi nhận |

### UAT-ON-09 – Lỗi cấp quyền và khắc phục

**Vai trò:** IT, HR · **Màn hình:** SCR-ON-04, SCR-ON-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng chọn "Không xác định được", nhập lý do, gửi | Quyền chuyển BLOCKED kèm lý do; không có tài khoản mới nào được ghi nhận |
| 2 | Bấm Khắc phục và thử lại, chọn tài khoản, chọn Thất bại, nhập lý do, gửi | Quyền chuyển BLOCKED; HR thấy lý do thất bại trên chi tiết yêu cầu |
| 3 | Bấm Khắc phục và thử lại | Màn hình quay lại bước kiểm tra tài khoản trước khi cấp tiếp |

### UAT-ON-10 – Thu hồi quyền khi phê duyệt mất hiệu lực

**Vai trò:** IT · **Màn hình:** SCR-ON-04 · **Tiền điều kiện:** Dũng đã cấp Phần mềm kế toán; giả lập phê duyệt của Security không còn hiệu lực.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | ELAMS kiểm tra kết quả cấp quyền | Quyền chuyển BLOCKED; Dũng nhận yêu cầu thu hồi hoặc tạm ngừng kèm lý do |
| 2 | Dũng chọn Đã được cấp, Thu hồi, đính kèm bằng chứng, gửi | Kết quả thu hồi được lưu; quyền giữ BLOCKED |
| 3 | Kiểm tra nhiệm vụ của IT | Không có nhiệm vụ cấp lại cho tới khi có phê duyệt hợp lệ mới |

### UAT-ON-11 – Thiếu thiết bị và bàn giao

**Vai trò:** IT, HR · **Màn hình:** SCR-ON-05, SCR-ON-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng chọn Thiếu thiết bị, nhập lý do "Kho hết laptop cấu hình kế toán" | Nhiệm vụ chuyển Chờ thiết bị; HR thấy lý do trên chi tiết yêu cầu |
| 2 | Giả lập qua ngày dự kiến có thiết bị, không có thao tác của IT | Nhiệm vụ vẫn Chờ thiết bị |
| 3 | Dũng xác nhận đã có laptop thay thế | Nhiệm vụ quay lại bước kiểm tra và bàn giao |
| 4 | Nhập mã thiết bị, thời gian, tình trạng, mã biên bản nhưng không đính kèm biên bản, bấm Hoàn thành | Nhiệm vụ chưa hoàn thành; ELAMS chỉ ra biên bản còn thiếu |
| 5 | Đính kèm biên bản, bấm Hoàn thành | Nhiệm vụ hoàn thành; laptop gắn với An |

### UAT-ON-12 – Xác nhận hoàn tất onboarding

**Vai trò:** HR · **Màn hình:** SCR-ON-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Khi Phần mềm kế toán đang BLOCKED và các nhánh khác đã kết thúc, HR mở yêu cầu | Trạng thái Chờ xử lý điều kiện còn thiếu; thấy điều kiện chưa đạt và người đang giữ; không có nút Xác nhận hoàn tất |
| 2 | HR đóng rồi mở lại yêu cầu, không có dữ liệu nào thay đổi | Lịch sử không ghi lần kiểm tra điều kiện mới |
| 3 | Phần mềm kế toán chuyển COMPLETED (Email COMPLETED, Kho tài liệu REJECTED, laptop đã bàn giao) | Yêu cầu chuyển Chờ HR xác nhận; HR thấy tóm tắt kết quả từng quyền và thiết bị |
| 4 | HR bấm Xác nhận hoàn tất và xác nhận | Yêu cầu chuyển Hoàn tất; lịch sử ghi người xác nhận và thời điểm |

### UAT-ON-13 – Điều kiện thay đổi và lỗi khi xác nhận

**Vai trò:** HR · **Màn hình:** SCR-ON-02 · **Tiền điều kiện:** Yêu cầu ở Chờ HR xác nhận.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | HR mở hộp thoại xác nhận; giả lập phê duyệt một quyền hết hiệu lực; HR bấm Xác nhận | Yêu cầu không chuyển Hoàn tất; quay về Chờ xử lý điều kiện còn thiếu; HR được báo lý do |
| 2 | Đưa yêu cầu về Chờ HR xác nhận; giả lập lỗi hệ thống khi ghi; HR bấm Xác nhận | ELAMS báo lỗi, không báo thành công; trạng thái vẫn là Chờ HR xác nhận |

### UAT-ON-14 – Việc cần làm, lịch sử và phân quyền

**Vai trò:** Manager, IT, Security, HR · **Màn hình:** SCR-ON-03, SCR-ON-02 · **Tiền điều kiện:** Bình có nhiệm vụ xét duyệt Email công ty của An (hạn 26/11/2026) và của Châu (hạn 02/12/2026); yêu cầu của An đã hoàn tất cho các bước 3–5.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình mở Việc cần làm | Thấy đúng 2 nhiệm vụ, nhiệm vụ của An đứng trước |
| 2 | Khoa (IT không được giao) mở Việc cần làm | Không thấy nhiệm vụ nào của An |
| 3 | Hải mở thẻ Lịch sử thao tác của yêu cầu An | Thấy theo thời gian: tạo yêu cầu, từng quyết định kèm lý do, cấp quyền, bàn giao thiết bị, xác nhận hoàn tất |
| 4 | Hải tìm chức năng sửa hoặc xóa bản ghi lịch sử | Không có chức năng sửa hoặc xóa |
| 5 | HR mở chức năng lịch sử thao tác | Không truy cập được; vẫn xem được quyết định và lý do trên chi tiết yêu cầu |

### UAT-ON-15 – Đổi ngày bắt đầu (Should)

**Vai trò:** HR · **Màn hình:** SCR-ON-02 · **Tiền điều kiện:** Ngày bắt đầu 01/12/2026; Email công ty COMPLETED; nhiệm vụ cấp laptop chưa xong và đang Quá hạn.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | HR đổi ngày bắt đầu sang 08/12/2026, nhập lý do, lưu | Hạn nhiệm vụ cấp laptop được tính lại; dấu Quá hạn được gỡ |
| 2 | Kiểm tra Email công ty | Vẫn COMPLETED; không có quyền nào bị cấp lại hoặc thu hồi |
| 3 | Khi việc cập nhật hạn chưa xong và mọi nhánh khác đã đạt | Yêu cầu chưa chuyển Chờ HR xác nhận |

### UAT-ON-16 – Cảnh báo nhiệm vụ quá hạn (Should)

**Vai trò:** IT, Manager, HR · **Màn hình:** SCR-ON-03 · **Tiền điều kiện:** Giả lập thời gian hệ thống.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Nhiệm vụ cấp laptop hạn 28/11/2026, chưa xong; giả lập sang 29/11 | Nhiệm vụ mang dấu Quá hạn; Dũng và HR nhận thông báo |
| 2 | ELAMS chạy kiểm tra lại, hạn không đổi | Không gửi cảnh báo lần hai |
| 3 | Nhiệm vụ điều chỉnh của Bình (quyền BLOCKED) hạn 27/11/2026; giả lập sang 28/11 | Bình và HR nhận cảnh báo |
| 4 | Một nhiệm vụ đã hoàn thành trước hạn; giả lập qua hạn | Không có cảnh báo |
