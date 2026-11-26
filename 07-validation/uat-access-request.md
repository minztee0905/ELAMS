# KỊCH BẢN UAT – ACCESS REQUEST & APPROVAL

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Đã chuẩn bị, chưa thực hiện

**Nguồn:** [User Stories Access Request](../02-requirements/user-stories/access-request-user-stories.md), [Đặc tả màn hình](../06-ui-ux/access-request-screen-specifications.md), [RTM](../08-traceability/rtm-access-request.md)

---

## 1. Chuẩn bị

| Vai trò | Người thử |
| --- | --- |
| Employee | Nguyễn Văn An, Lê Minh Châu (phòng Kế toán); Trịnh Thu Mai (phòng Kinh doanh) |
| Department Manager | Trần Thị Bình (phòng Kế toán); Phan Văn Đức (Giám đốc Tài chính, cấp trên của Bình) |
| Security Approver | Võ Thanh Hải |
| IT Staff | Phạm Quốc Dũng |

**Dữ liệu cấu hình:**

- Danh mục quyền: CRM nội bộ (không nhạy cảm, mức Xem/Ghi); Phần mềm kế toán – MISA (nhạy cảm, mức Xem/Ghi).
- An đã có tài khoản MISA `an.nguyen` mức Xem; chưa có tài khoản CRM.
- Mai đã có một yêu cầu CRM nội bộ đang Chờ Manager duyệt.

Ngày thực hiện giả định 27/11/2026. Tiêu chí đạt giống [UAT Onboarding](uat-onboarding.md).

## 2. Tổng hợp

| Mã | Test case | Ưu tiên | BREQ | Acceptance Criteria | Kết quả |
| --- | --- | --- | --- | --- | --- |
| UAT-AC-01 | Gửi yêu cầu hợp lệ | Must | 01 | US-AC-01 AC-1, AC-3 | |
| UAT-AC-02 | Dữ liệu không hợp lệ, trùng, thiếu người duyệt | Must | 01 | US-AC-01 AC-2, AC-4, AC-6 | |
| UAT-AC-03 | Quyền nhạy cảm qua Manager và Security | Must | 01, 04, 07, 08 | US-AC-01 AC-5; US-AC-03 AC-1, AC-3, AC-4; US-AC-06 AC-1, AC-2, AC-4, AC-5; US-AC-09 AC-1 | |
| UAT-AC-04 | Duyệt quyền thường và cấp tài khoản mới | Must | 02, 05, 06 | US-AC-03 AC-2; US-AC-07 AC-3, AC-4 | |
| UAT-AC-05 | Dùng lại tài khoản sẵn có | Must | 05 | US-AC-07 AC-1, AC-2 | |
| UAT-AC-06 | Từ chối yêu cầu | Must | 02, 08 | US-AC-04 AC-1, AC-2; US-AC-06 AC-3; US-AC-09 AC-2 | |
| UAT-AC-07 | Yêu cầu bổ sung, gửi lại và hủy | Must | 03 | US-AC-04 AC-3; US-AC-05 AC-1 → AC-5 | |
| UAT-AC-08 | Lỗi cấp quyền | Must | 06 | US-AC-08 AC-1, AC-2, AC-3 | |
| UAT-AC-09 | Manager tự xin quyền và phạm vi xem | Must | 02, 07 | US-AC-02 AC-1, AC-2; US-AC-09 AC-3, AC-4 | |
| UAT-AC-10 | Cảnh báo quá hạn | Should | 09 | US-AC-10 AC-1 → AC-4 | |

10 test case phủ toàn bộ 40 AC. BQ-AC-01 kiểm ở UAT-AC-07, BQ-AC-02 ở UAT-AC-08, BQ-AC-03 (tiếng Việt) trong mọi test case.

---

## 3. Chi tiết

### UAT-AC-01 – Gửi yêu cầu hợp lệ

**Vai trò:** Employee · **Màn hình:** SCR-AC-01, SCR-AC-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | An mở Tạo yêu cầu quyền | Người duyệt hiển thị Trần Thị Bình |
| 2 | Chọn Phần mềm kế toán | Hiển thị hệ thống MISA, nhãn Nhạy cảm, cấp phê duyệt Manager → Security → IT |
| 3 | Đổi sang CRM nội bộ, mức Xem, nhập lý do, gửi | Thông báo đã gửi; yêu cầu ở Chờ Manager duyệt |
| 4 | Bình mở Việc cần làm | Có nhiệm vụ xét duyệt yêu cầu của An, có hạn xử lý |

### UAT-AC-02 – Dữ liệu không hợp lệ, trùng, thiếu người duyệt

**Vai trò:** Employee · **Màn hình:** SCR-AC-01

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Châu chọn CRM nội bộ, để trống lý do, gửi | Không tạo yêu cầu; trường lý do báo lỗi |
| 2 | Mai gửi thêm một yêu cầu CRM nội bộ | Không tạo yêu cầu; hiển thị mã yêu cầu đang chờ của Mai |
| 3 | Admin gỡ Manager của Châu khỏi cơ cấu tổ chức; Châu mở biểu mẫu và gửi yêu cầu hợp lệ | Không tạo yêu cầu; báo liên hệ HR |

### UAT-AC-03 – Quyền nhạy cảm qua Manager và Security

**Vai trò:** Employee, Manager, Security · **Màn hình:** SCR-AC-01, SCR-ON-03, SCR-AC-02, SCR-AC-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | An chọn Phần mềm kế toán mức Ghi | Cảnh báo An đã có quyền mức Xem; An xác nhận và gửi được |
| 2 | Hải mở Việc cần làm | Không có nhiệm vụ cho yêu cầu này |
| 3 | Bình mở yêu cầu | Thấy quyền, mức Ghi, lý do, nhãn Nhạy cảm, cấp phê duyệt và quyền MISA mức Xem hiện có của An |
| 4 | Bình phê duyệt | Yêu cầu chuyển Chờ Security duyệt; Hải nhận nhiệm vụ; IT chưa có nhiệm vụ |
| 5 | An mở danh sách yêu cầu của mình | Yêu cầu ở Chờ Security duyệt, người đang giữ là Hải, có hạn |
| 6 | Hải mở nhiệm vụ | Thấy quyết định của Bình; chỉ có hai lựa chọn Phê duyệt và Từ chối |
| 7 | Hải phê duyệt | Yêu cầu chuyển Chờ cấp quyền; Dũng nhận nhiệm vụ |
| 8 | An mở chi tiết yêu cầu | Tiến trình ghi người duyệt, kết quả, thời điểm của Bình và Hải |

### UAT-AC-04 – Duyệt quyền thường và cấp tài khoản mới

**Vai trò:** Manager, IT, Employee · **Màn hình:** SCR-ON-03, SCR-ON-04 · **Tiền điều kiện:** Yêu cầu CRM nội bộ của An từ UAT-AC-01.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình phê duyệt | Yêu cầu chuyển Chờ cấp quyền; Dũng nhận nhiệm vụ |
| 2 | Dũng chọn "Chưa có – đã tạo mới", nhập `an.nguyen`, chọn Thành công, không đính kèm bằng chứng, gửi | Kết quả không được lưu; báo thiếu bằng chứng |
| 3 | Đính kèm bằng chứng, gửi | Yêu cầu chuyển Đã cấp; An nhận thông báo |

### UAT-AC-05 – Dùng lại tài khoản sẵn có

**Vai trò:** IT · **Màn hình:** SCR-ON-04 · **Tiền điều kiện:** Yêu cầu MISA mức Ghi từ UAT-AC-03.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng mở nhiệm vụ | Thấy phê duyệt của Bình và Hải; thấy tài khoản MISA `an.nguyen` đã ghi nhận |
| 2 | Xem mục Tài khoản | Chọn sẵn dùng lại `an.nguyen`; không có lựa chọn tạo mới |
| 3 | Ghi kết quả thành công kèm bằng chứng | Yêu cầu Đã cấp; An vẫn chỉ có một tài khoản MISA |

### UAT-AC-06 – Từ chối yêu cầu

**Vai trò:** Manager, Security, Employee · **Màn hình:** SCR-ON-03, SCR-AC-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Châu gửi yêu cầu CRM nội bộ; Bình chọn Từ chối, để trống lý do, gửi | Quyết định không được lưu |
| 2 | Bình nhập lý do "Công việc hiện tại không cần CRM", gửi | Yêu cầu Bị từ chối; Châu nhận thông báo kèm lý do |
| 3 | Châu mở chi tiết yêu cầu | Thấy người từ chối, lý do, thời điểm |
| 4 | Châu gửi yêu cầu MISA mức Ghi; Bình phê duyệt; Hải từ chối kèm lý do | Yêu cầu Bị từ chối; Châu nhận thông báo kèm lý do của Hải |

### UAT-AC-07 – Yêu cầu bổ sung, gửi lại và hủy

**Vai trò:** Manager, Employee · **Màn hình:** SCR-ON-03, SCR-AC-03, SCR-AC-02

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | An gửi yêu cầu CRM nội bộ mức Ghi; Bình yêu cầu bổ sung "Ghi rõ khách hàng cần theo dõi" | Yêu cầu chuyển Chờ bổ sung; An nhận thông báo kèm nội dung |
| 2 | An mở yêu cầu | Thấy nội dung Bình yêu cầu bổ sung; trường Quyền bị khóa |
| 3 | Giả lập qua 30 ngày không phản hồi | Yêu cầu vẫn Chờ bổ sung; danh sách hiển thị số ngày chờ |
| 4 | An sửa lý do, gửi lại | Yêu cầu về Chờ Manager duyệt, cùng mã; tiến trình còn lần yêu cầu bổ sung trước |
| 5 | Bình yêu cầu bổ sung lần nữa; An chọn Hủy yêu cầu và xác nhận | Yêu cầu chuyển Đã hủy; Bình được thông báo |

### UAT-AC-08 – Lỗi cấp quyền

**Vai trò:** IT, Employee · **Màn hình:** SCR-ON-04, SCR-AC-03 · **Tiền điều kiện:** Yêu cầu CRM nội bộ của Châu đã đủ phê duyệt.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Dũng chọn "Không xác định được", nhập lý do, gửi | Yêu cầu giữ Chờ cấp quyền; không có tài khoản mới nào được ghi nhận |
| 2 | Dũng bấm Xử lý lại | Màn hình về mục Tài khoản |
| 3 | Dũng chọn tài khoản, ghi Thất bại kèm lý do | Yêu cầu giữ Chờ cấp quyền, không chuyển Đã cấp |
| 4 | Châu mở chi tiết yêu cầu | Thấy "IT đang xử lý", không thấy Đã cấp |
| 5 | Giả lập lỗi hệ thống khi Dũng gửi kết quả thành công | ELAMS báo lỗi; yêu cầu không chuyển Đã cấp |

### UAT-AC-09 – Manager tự xin quyền và phạm vi xem

**Vai trò:** Manager, Employee · **Màn hình:** SCR-AC-01, SCR-AC-02, SCR-AC-03, SCR-ON-03

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Bình mở Tạo yêu cầu quyền | Người duyệt hiển thị Phan Văn Đức |
| 2 | Bình gửi yêu cầu CRM nội bộ | Đức nhận nhiệm vụ xét duyệt; Việc cần làm của Bình không có nhiệm vụ này |
| 3 | Bình mở chi tiết yêu cầu của mình | Không có nút quyết định nào |
| 4 | Bình mở thẻ Phòng ban | Thấy yêu cầu của An, Châu; không thấy yêu cầu của Mai |
| 5 | Châu tìm yêu cầu của An | Không thấy |

### UAT-AC-10 – Cảnh báo quá hạn (Should)

**Vai trò:** Manager, IT · **Màn hình:** SCR-ON-03, SCR-AC-02 · **Tiền điều kiện:** Giả lập thời gian hệ thống.

| # | Bước | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Nhiệm vụ xét duyệt của Bình hạn 30/11/2026, chưa xử lý; giả lập sang 01/12 | Nhiệm vụ mang dấu Quá hạn; Bình nhận cảnh báo |
| 2 | ELAMS kiểm tra lại, hạn không đổi | Không gửi cảnh báo lần hai |
| 3 | Yêu cầu của An đang Chờ bổ sung 10 ngày | Không có cảnh báo; danh sách hiển thị "Chờ bổ sung 10 ngày" |
| 4 | Dũng hoàn tất cấp quyền trước hạn; giả lập qua hạn | Không có cảnh báo |
