# KỊCH BẢN UAT – EMPLOYEE OFFBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Đã chuẩn bị, chưa thực hiện

**Nguồn:** [User Stories Offboarding](../02-requirements/user-stories/offboarding-user-stories.md), [Đặc tả màn hình](../06-ui-ux/offboarding-screen-specifications.md), [RTM](../08-traceability/rtm-offboarding.md)

---

## 1. Chuẩn bị

| Vai trò | Người thử |
| --- | --- |
| HR Staff | Lê Thu Hà |
| Department Manager | Trần Thị Bình (phòng Kế toán); Hoàng Gia Huy (phòng Kinh doanh) |
| Employee nghỉ việc | Hoàng Văn Nam (Kế toán); Trịnh Thu Mai, Đỗ Quang Vinh (Kinh doanh) |
| Người nhận bàn giao | Lê Minh Châu |
| IT Staff | Phạm Quốc Dũng; Đỗ Minh Khoa (không được giao nhiệm vụ) |
| Security Approver | Võ Thanh Hải |

**Dữ liệu cấu hình:**

- Nam được cấp qua ELAMS: Email công ty (M365), Phần mềm kế toán – Ghi (MISA), CRM nội bộ – Xem; Laptop LT-2025-0188, Màn hình MN-2025-0042. Nam có VPN cấp ngoài ELAMS.
- Mai và Vinh mỗi người có Email công ty và một laptop cấp qua ELAMS.

Ngày tạo yêu cầu giả định 01/12/2026. Các test về thời điểm thu hồi và quá hạn dùng giả lập thời gian hệ thống. Tiêu chí đạt giống [UAT Onboarding](uat-onboarding.md).

## 2. Tổng hợp

| Mã | Test case | Ưu tiên | BREQ | Acceptance Criteria | Kết quả |
| --- | --- | --- | --- | --- | --- |
| UAT-OFF-01 | Tạo yêu cầu hợp lệ | Must | 01, 02, 08 | US-OFF-01 AC-1, AC-3; US-OFF-12 AC-1 | |
| UAT-OFF-02 | Dữ liệu không hợp lệ, trùng, ngày đã qua | Must | 01 | US-OFF-01 AC-2, AC-4, AC-5 | |
| UAT-OFF-03 | Nghỉ đột xuất | Must | 04 | US-OFF-02 AC-1, AC-2, AC-3 | |
| UAT-OFF-04 | Lập kế hoạch, cập nhật và xác nhận bàn giao | Must | 03 | US-OFF-03 AC-1, AC-2; US-OFF-04 AC-1, AC-2; US-OFF-05 AC-1, AC-2 | |
| UAT-OFF-05 | Manager cập nhật bàn giao thay | Must | 03 | US-OFF-04 AC-3 | |
| UAT-OFF-06 | Thu hồi quyền đúng thời điểm | Must | 04, 09 | US-OFF-06 AC-1 → AC-5 | |
| UAT-OFF-07 | Quyền chưa thu hồi được và quyền cấp ngoài ELAMS | Must | 02, 05 | US-OFF-07 AC-1, AC-2, AC-3 | |
| UAT-OFF-08 | Thu hồi thiết bị | Must | 06 | US-OFF-08 AC-1 → AC-4 | |
| UAT-OFF-09 | Thiếu thiết bị và duyệt ngoại lệ | Must | 06, 09 | US-OFF-09 AC-1 → AC-5 | |
| UAT-OFF-10 | Xác nhận hoàn tất offboarding | Must | 07 | US-OFF-10 AC-1 → AC-4 | |
| UAT-OFF-11 | Lỗi hệ thống không báo thành công | Must | 05, 07 | US-OFF-10 AC-5; BQ-OFF-01 | |
| UAT-OFF-12 | Phạm vi xem | Must | 08 | US-OFF-12 AC-2, AC-3 | |
| UAT-OFF-13 | Đổi ngày nghỉ việc | Should | 10 | US-OFF-11 AC-1 → AC-4; US-OFF-13 AC-4 | |
| UAT-OFF-14 | Cảnh báo quá hạn | Should | 11 | US-OFF-13 AC-1, AC-2, AC-3 | |

14 test case phủ toàn bộ 48 AC và BQ-OFF-01. BQ-OFF-02 (giờ Việt Nam) kiểm ở UAT-OFF-03 và 06; BQ-OFF-03 (tiếng Việt) trong mọi test case.

---

## 3. Chi tiết

### UAT-OFF-01 – Tạo yêu cầu hợp lệ

**Vai trò:** HR · **Màn hình:** SCR-OFF-01, SCR-OFF-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Hà mở Tạo yêu cầu offboarding, chọn Nam | Thấy Manager Bình, 3 quyền và 2 thiết bị trong mục "Sẽ thu hồi" |
| 2 | Nhập ngày cuối 15/12/2026, lý do Tự nguyện, không đột xuất, gửi | Yêu cầu Đang xử lý; thời điểm thu hồi quyền 18:00 15/12/2026 |
| 3 | Kiểm tra nhiệm vụ | Bình có nhiệm vụ bàn giao; Dũng có nhiệm vụ thu hồi quyền và thu hồi thiết bị; mỗi nhiệm vụ có hạn |
| 4 | Hà mở chi tiết yêu cầu | Thấy ba nhánh, từng mục, người giữ, hạn và thời điểm thu hồi |

### UAT-OFF-02 – Dữ liệu không hợp lệ, trùng, ngày đã qua

**Vai trò:** HR · **Màn hình:** SCR-OFF-01

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Hà chọn Vinh, để trống lý do nghỉ việc, gửi | Không tạo yêu cầu; trường lý do báo lỗi |
| 2 | Hà tạo thêm một yêu cầu cho Nam (đã có từ UAT-OFF-01) | Không tạo yêu cầu; hiển thị OFF-2026-0007 |
| 3 | Giả lập hôm nay 16/12/2026; Hà chọn Vinh, nhập ngày cuối 15/12/2026 | Cảnh báo ngày đã qua, đề xuất đánh dấu nghỉ đột xuất |

### UAT-OFF-03 – Nghỉ đột xuất

**Vai trò:** HR, IT, Manager · **Màn hình:** SCR-OFF-01, SCR-OFF-02, SCR-OFF-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Lúc 10:00 10/12/2026, Hà tạo yêu cầu cho Mai, chọn nghỉ đột xuất | Thu hồi quyền bắt đầu ngay, hạn 14:00 10/12/2026 |
| 2 | Vinh có yêu cầu ngày cuối 20/12/2026; lúc 11:00 10/12/2026 Hà chọn Chuyển sang đột xuất, để trống lý do | Không lưu thay đổi |
| 3 | Hà nhập lý do, xác nhận | Thu hồi bắt đầu ngay, hạn 15:00 10/12/2026; Dũng và Huy được thông báo; nhiệm vụ đứng đầu Việc cần làm của Dũng với nhãn Đột xuất |

### UAT-OFF-04 – Lập kế hoạch, cập nhật và xác nhận bàn giao

**Vai trò:** Manager, Employee · **Màn hình:** SCR-OFF-05, SCR-ON-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình thêm hạng mục "Sổ cái tháng 12" không chọn người nhận, lưu | Hạng mục không được lưu |
| 2 | Bình lập 2 hạng mục, người nhận Châu, hạn 15/12/2026, lưu | Kế hoạch được lưu; Nam và Châu được thông báo |
| 3 | Nam đăng nhập | Chỉ thấy nhiệm vụ cập nhật bàn giao; không có mục Offboarding, không thấy nhiệm vụ thu hồi |
| 4 | Nam đánh dấu cả 2 hạng mục Đã bàn giao | Bình thấy trạng thái và thời điểm cập nhật |
| 5 | Bình đánh dấu "Hồ sơ thuế quý 4" Chưa đạt, lý do "Thiếu chứng từ tháng 10" | Hạng mục quay lại đang bàn giao; Nam nhận thông báo kèm lý do |
| 6 | Nam cập nhật lại; Bình xác nhận bàn giao đầy đủ | Nhánh bàn giao kết thúc; lịch sử ghi người xác nhận và thời điểm |

### UAT-OFF-05 – Manager cập nhật bàn giao thay

**Vai trò:** Manager · **Màn hình:** SCR-OFF-05 · **Tiền điều kiện:** Yêu cầu đột xuất của Mai từ UAT-OFF-03, tài khoản của Mai đã bị thu hồi.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Huy mở nhiệm vụ bàn giao của Mai | Thấy nút "Cập nhật thay nhân viên" |
| 2 | Huy đánh dấu hạng mục Đã bàn giao | Tiến độ được lưu; lịch sử ghi Huy cập nhật thay Mai |

### UAT-OFF-06 – Thu hồi quyền đúng thời điểm

**Vai trò:** IT · **Màn hình:** SCR-OFF-03 · **Tiền điều kiện:** Yêu cầu của Nam từ UAT-OFF-01.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Giả lập 17:00 15/12/2026; Dũng mở nhiệm vụ | Trạng thái Chờ đến thời điểm thu hồi; không có nút Ghi kết quả |
| 2 | Giả lập 18:00 15/12/2026 | Nhiệm vụ chuyển Đang thu hồi; Dũng được thông báo |
| 3 | Dũng ghi Email công ty Đã vô hiệu hóa, không đính kèm bằng chứng | Kết quả không được lưu |
| 4 | Đính kèm bằng chứng, lưu | Mục Email công ty Đã vô hiệu hóa |
| 5 | Ghi CRM nội bộ và MISA Đã thu hồi kèm bằng chứng | ELAMS đối chiếu; nhánh thu hồi quyền kết thúc |

### UAT-OFF-07 – Quyền chưa thu hồi được và quyền cấp ngoài ELAMS

**Vai trò:** IT · **Màn hình:** SCR-OFF-03 · **Tiền điều kiện:** Như UAT-OFF-06 sau bước 4.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng bổ sung VPN (hệ thống VPN, tài khoản `nam.hoang`) | VPN là một mục mới, nguồn "IT bổ sung" |
| 2 | Dũng mở Ghi kết quả cho MISA | Chỉ có Đã thu hồi, Đã vô hiệu hóa, Chưa thu hồi được; không có lựa chọn ngoại lệ |
| 3 | Ghi MISA Chưa thu hồi được, lý do "Hệ thống đang bảo trì" | Mục MISA giữ chưa xong |
| 4 | Ghi CRM và VPN Đã thu hồi kèm bằng chứng | Nhánh thu hồi quyền chưa kết thúc vì còn MISA |

### UAT-OFF-08 – Thu hồi thiết bị

**Vai trò:** IT · **Màn hình:** SCR-OFF-04

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng mở nhiệm vụ thu hồi thiết bị của Vinh | Thấy laptop của Vinh theo mã tài sản |
| 2 | Ghi nhận thu hồi không chọn tình trạng | Không được lưu |
| 3 | Chọn tình trạng Tốt, lưu | Laptop Đã thu hồi; nhánh thu hồi thiết bị kết thúc |

### UAT-OFF-09 – Thiếu thiết bị và duyệt ngoại lệ

**Vai trò:** IT, Manager, HR · **Màn hình:** SCR-OFF-04, SCR-ON-03, SCR-OFF-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng ghi thu hồi LT-2025-0188 của Nam; ghi MN-2025-0042 thiếu, lý do "Nhân viên chưa bàn giao màn hình đang sử dụng tại nhà", đính kèm biên bản | Laptop Đã thu hồi; màn hình Thiếu – chờ quyết định; Bình nhận nhiệm vụ |
| 2 | Bình chọn Tiếp tục thu hồi | Màn hình quay lại Chờ thu hồi; Dũng tiếp tục xử lý |
| 3 | Dũng ghi thiếu lần nữa; Bình chọn Duyệt ngoại lệ, để trống lý do | Quyết định không được lưu |
| 4 | Bình nhập lý do, duyệt | Màn hình Ngoại lệ – chưa thu hồi; Hà được thông báo |
| 5 | Dũng và Hà mở danh sách thiết bị | MN-2025-0042 hiển thị nhãn "Ngoại lệ – chưa thu hồi", người duyệt và lý do |

### UAT-OFF-10 – Xác nhận hoàn tất offboarding

**Vai trò:** HR · **Màn hình:** SCR-OFF-02 · **Tiền điều kiện:** Yêu cầu của Nam sau UAT-OFF-04, 07, 09.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | MISA còn Chưa thu hồi được; Hà mở yêu cầu | Chờ xử lý điều kiện còn thiếu; thấy MISA và Dũng đang giữ; không có nút Xác nhận hoàn tất |
| 2 | Với yêu cầu của Vinh: quyền đã thu hồi hết, laptop đã thu hồi, Huy chưa xác nhận bàn giao; Hà mở yêu cầu | Yêu cầu chưa chuyển Chờ HR xác nhận; điều kiện còn thiếu là bàn giao |
| 3 | Quay lại yêu cầu của Nam: Dũng thu hồi được MISA | Yêu cầu Chờ HR xác nhận; tóm tắt có màn hình theo ngoại lệ và người duyệt |
| 4 | Hà xác nhận hoàn tất | Yêu cầu Hoàn tất; lịch sử ghi người xác nhận và thời điểm |

### UAT-OFF-11 – Lỗi hệ thống không báo thành công

**Vai trò:** IT, HR · **Màn hình:** SCR-OFF-03, SCR-OFF-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Giả lập lỗi hệ thống khi Dũng ghi Email công ty của Vinh Đã vô hiệu hóa | ELAMS báo lỗi; mục vẫn Đang thu hồi |
| 2 | Yêu cầu của Vinh ở Chờ HR xác nhận; giả lập lỗi khi Hà xác nhận | ELAMS báo lỗi; yêu cầu giữ Chờ HR xác nhận |

### UAT-OFF-12 – Phạm vi xem

**Vai trò:** Manager, IT · **Màn hình:** SCR-OFF-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình mở danh sách offboarding | Thấy yêu cầu của Nam; không thấy của Mai, Vinh |
| 2 | Khoa tìm yêu cầu của Nam | Không thấy |

### UAT-OFF-13 – Đổi ngày nghỉ việc (Should)

**Vai trò:** HR · **Màn hình:** SCR-OFF-02 · **Tiền điều kiện:** Tạo lại một yêu cầu cho Vinh, ngày cuối 15/12/2026; laptop đã thu hồi; nhiệm vụ bàn giao đang Quá hạn (giả lập hạn cũ đã qua).

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Hà đổi ngày sang 22/12/2026 kèm lý do | Hạn bàn giao 22/12/2026; thời điểm thu hồi 18:00 22/12/2026; dấu Quá hạn được gỡ |
| 2 | Kiểm tra laptop | Vẫn Đã thu hồi, không mở lại |
| 3 | Giả lập hôm nay 16/12/2026; Hà đổi sang 14/12/2026 | Không lưu; đề xuất chuyển sang đột xuất |
| 4 | Với yêu cầu đột xuất của Mai đã thu hồi quyền, Hà đổi ngày nghỉ việc | Không quyền nào được cấp lại |

### UAT-OFF-14 – Cảnh báo quá hạn (Should)

**Vai trò:** IT, HR, Security · **Màn hình:** SCR-ON-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Nhiệm vụ thu hồi thiết bị của Nam hạn 15/12/2026 chưa xong; giả lập 16/12 | Nhiệm vụ Quá hạn; Dũng và Hà nhận cảnh báo |
| 2 | Mục MISA chưa thu hồi khi quá hạn thu hồi | Dũng, Hà và Hải nhận cảnh báo |
| 3 | ELAMS kiểm tra lại, hạn không đổi | Không gửi cảnh báo lần hai |
