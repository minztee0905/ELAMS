# ĐẶC TẢ MÀN HÌNH – EMPLOYEE OFFBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [Use Case Offboarding](../02-requirements/use-case-specifications/offboarding-use-cases.md), [User Stories Offboarding](../02-requirements/user-stories/offboarding-user-stories.md)

**Thiết kế:** [Figma](https://www.figma.com/design/sxQaybHEwuvCMIBTmxwuxE/ELAMS)

---

## 1. Phạm vi

Quy ước chung theo [Đặc tả màn hình Onboarding](onboarding-screen-specifications.md), mục 2.

| Mã | Màn hình | Use case | Vai trò |
| --- | --- | --- | --- |
| SCR-OFF-01 | Tạo yêu cầu offboarding | UC-OFF-01 | HR |
| SCR-OFF-02 | Danh sách và chi tiết yêu cầu offboarding (gồm đổi ngày, chuyển đột xuất, xác nhận hoàn tất) | UC-OFF-02, 08, 09 | HR, Manager, IT, Security, Admin |
| SCR-OFF-03 | Thu hồi quyền truy cập | UC-OFF-05 | IT |
| SCR-OFF-04 | Thu hồi thiết bị | UC-OFF-06 | IT |
| SCR-OFF-05 | Bàn giao công việc | UC-OFF-03, 04 | Manager, Employee nghỉ việc |
| SCR-ON-03 (mở rộng) | Việc cần làm: thêm nhiệm vụ offboarding và bảng duyệt ngoại lệ thiết bị | UC-OFF-07, 10 | Mọi vai trò |

**Menu:** nhóm "Offboarding" gồm "Yêu cầu offboarding" và "+ Tạo yêu cầu" (chỉ HR). Nhân viên nghỉ việc chỉ thấy "Việc cần làm" (Q-44).

**Nhãn trạng thái bổ sung:**

| Đối tượng | Nhãn | Màu gợi ý |
| --- | --- | --- |
| Yêu cầu | Đột xuất (đặt cạnh nhãn trạng thái) | Viền đỏ |
| Mục thu hồi quyền | Chờ đến thời điểm thu hồi / Đang thu hồi / Đã thu hồi / Đã vô hiệu hóa / Chưa thu hồi được | Xám viền / Xanh dương / Xanh lá / Xanh lá / Đỏ |
| Thiết bị | Chờ thu hồi / Đã thu hồi / Thiếu – chờ quyết định / Ngoại lệ – chưa thu hồi | Xanh dương / Xanh lá / Cam / Tím |
| Hạng mục bàn giao | Chưa bàn giao / Đã bàn giao / Chưa đạt | Xám viền / Xanh lá / Đỏ |

**Thông báo bổ sung:**

| Mã | Loại | Nội dung |
| --- | --- | --- |
| MSG-22 | Cảnh báo | Ngày làm việc cuối cùng đã qua. Quyền của nhân viên có thể vẫn đang hoạt động. Bạn có muốn đánh dấu nghỉ đột xuất để thu hồi ngay? |
| MSG-23 | Lỗi | Nhân viên này đã có yêu cầu offboarding đang xử lý: [mã]. [Mở yêu cầu] |
| MSG-24 | Cảnh báo | Chuyển sang đột xuất sẽ bắt đầu thu hồi quyền ngay, hạn 4 giờ. IT và Manager được thông báo. Không thể hoàn tác. |
| MSG-25 | Lỗi | Vui lòng đính kèm bằng chứng thu hồi. |
| MSG-26 | Thông tin | Thu hồi quyền không có ngoại lệ. Tài khoản chưa thu hồi được cần tiếp tục xử lý. |

## 2. SCR-OFF-01 – Tạo yêu cầu offboarding

```
Offboarding > Tạo yêu cầu offboarding
+--------------------------------------------------------------------------+
| NHÂN VIÊN                                                                 |
|  Nhân viên *   [Hoàng Văn Nam – Kế toán tổng hợp            v] (tìm)     |
|  Phòng ban: Kế toán · Manager: Trần Thị Bình                              |
+--------------------------------------------------------------------------+
| THÔNG TIN NGHỈ VIỆC                                                       |
|  Ngày làm việc cuối cùng * [15/12/2026 📅]                                |
|  Lý do nghỉ việc *         [Tự nguyện                 v]                 |
|  Nghỉ đột xuất *           (•) Không   ( ) Có                            |
|  Thời điểm thu hồi quyền:  18:00 15/12/2026                              |
|  Ghi chú                   [                                         ]   |
+--------------------------------------------------------------------------+
| SẼ THU HỒI (từ lịch sử cấp phát trên ELAMS)                               |
|  Quyền:    Email công ty (M365, nam.hoang) · Phần mềm kế toán – Ghi      |
|            (MISA) · CRM nội bộ – Xem                                     |
|  Thiết bị: LT-2025-0188 Laptop · MN-2025-0042 Màn hình                   |
|  ℹ IT bổ sung quyền cấp ngoài ELAMS khi thu hồi.                         |
|                                             [Hủy]  [ Gửi yêu cầu ]       |
+--------------------------------------------------------------------------+
```

| Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ / Hành vi | AC |
| --- | --- | --- | --- | --- |
| Nhân viên | Danh sách chọn có tìm kiếm | Có | Chỉ nhân viên đang làm việc. Chọn xong hiển thị phòng ban, Manager và mục "Sẽ thu hồi". Đã có yêu cầu đang xử lý: MSG-23 | US-OFF-01 AC-1, AC-4 |
| Ngày làm việc cuối cùng | Ngày | Có | Ngày đã qua: MSG-22 kèm nút "Đánh dấu đột xuất" | US-OFF-01 AC-5 |
| Lý do nghỉ việc | Danh sách: Tự nguyện, Chấm dứt hợp đồng, Khác | Có | MSG-01 | US-OFF-01 AC-2 |
| Nghỉ đột xuất | Có / Không | Có | Chọn Có: dòng thời điểm thu hồi đổi thành "Ngay khi gửi · hạn 4 giờ" | US-OFF-02 AC-1 |
| Thời điểm thu hồi quyền | Chỉ đọc | – | 18:00 ngày làm việc cuối cùng | US-OFF-01 AC-3 |
| Ghi chú | Văn bản, tối đa 500 ký tự | Không | – | – |
| Sẽ thu hồi | Chỉ đọc | – | Danh sách trống: "Chưa có quyền hay thiết bị nào cấp qua ELAMS. IT sẽ rà soát." | – |

**Gửi thành công:** chuyển sang SCR-OFF-02 của yêu cầu vừa tạo, hiển thị các nhiệm vụ đã tạo (US-OFF-01 AC-3).

## 3. SCR-OFF-02 – Danh sách và chi tiết yêu cầu offboarding

### 3.1. Danh sách

Cột: mã, nhân viên, phòng ban, ngày làm việc cuối cùng, nhãn Đột xuất, trạng thái, tiến độ ba nhánh (ví dụ "Bàn giao 1/2 · Quyền 2/4 · Thiết bị 1/2"), số nhiệm vụ quá hạn. Phạm vi xem theo ma trận của Onboarding: Manager thấy yêu cầu của nhân viên mình quản lý; IT và Security thấy yêu cầu có nhiệm vụ của mình (US-OFF-12 AC-2, AC-3).

### 3.2. Chi tiết

```
Offboarding > OFF-2026-0007
+--------------------------------------------------------------------------+
| OFF-2026-0007  Hoàng Văn Nam                [Chờ xử lý điều kiện còn thiếu]
| Kế toán tổng hợp · Kế toán · Ngày cuối 15/12/2026 · Tự nguyện            |
| Thu hồi quyền: 18:00 15/12/2026                                           |
|                         [Đổi ngày nghỉ việc] [Chuyển sang đột xuất]       |
+--------------------------------------------------------------------------+
| ⚠ Chưa đủ điều kiện hoàn tất:                                            |
|   • Phần mềm kế toán (MISA): Chưa thu hồi được – "Hệ thống đang bảo trì" |
|     Đang chờ: Phạm Quốc Dũng (IT)                     [Quá hạn 1 ngày]    |
+--------------------------------------------------------------------------+
| Tiến độ: Bàn giao 2/2 ✓ · Quyền 3/4 · Thiết bị 2/2 (1 ngoại lệ)          |
+--------------------------------------------------------------------------+
| [ Bàn giao ] [ Thu hồi quyền ] [ Thu hồi thiết bị ] [ Nhiệm vụ ] [ Lịch sử ]*
|  # | Quyền            | Hệ thống | Tài khoản  | Nguồn      | Trạng thái        |
|  1 | Email công ty    | M365     | nam.hoang  | ELAMS      | Đã vô hiệu hóa    |
|  2 | Phần mềm kế toán | MISA     | nam.hoang  | ELAMS      | Chưa thu hồi được |
|  3 | CRM nội bộ       | CRM      | nam.hoang  | ELAMS      | Đã thu hồi        |
|  4 | VPN              | VPN      | nam.hoang  | IT bổ sung | Đã thu hồi        |
+--------------------------------------------------------------------------+
```

| Thẻ | Nội dung | AC |
| --- | --- | --- |
| Bàn giao | Hạng mục, người nhận, hạn, trạng thái; xác nhận của Manager | US-OFF-12 AC-1 |
| Thu hồi quyền | Như bố cục; mở rộng dòng để xem thời điểm, người thực hiện, bằng chứng, lý do | US-OFF-12 AC-1 |
| Thu hồi thiết bị | Mã tài sản, loại, trạng thái; thiết bị ngoại lệ ghi người duyệt và lý do | US-OFF-09 AC-5 |
| Nhiệm vụ | Như SCR-ON-02 | – |
| Lịch sử | Chỉ Security, Admin; như SCR-ON-02 | – |

**Khung trạng thái và nút (HR phụ trách):**

| Trạng thái | Khung | Nút | AC |
| --- | --- | --- | --- |
| Đang xử lý | Không có khung | Đổi ngày, Chuyển sang đột xuất | – |
| Chờ xử lý điều kiện còn thiếu | Điều kiện chưa đạt, người đang giữ, dấu Quá hạn. Bàn giao chưa xác nhận cũng là một điều kiện | Đổi ngày, Chuyển sang đột xuất. Không có Xác nhận hoàn tất | US-OFF-10 AC-1, AC-2 |
| Chờ HR xác nhận | Tóm tắt ba nhánh, gồm thiết bị theo ngoại lệ và người duyệt | **Xác nhận hoàn tất** | US-OFF-10 AC-3 |
| Hoàn tất | "Đã hoàn tất ngày… bởi…" | – | US-OFF-10 AC-4 |

Nút "Chuyển sang đột xuất" ẩn khi yêu cầu đã là đột xuất hoặc thu hồi quyền đã bắt đầu (đã qua thời điểm thu hồi).

### 3.3. Hộp thoại

| Hộp thoại | Trường | Hành vi | AC |
| --- | --- | --- | --- |
| Chuyển sang đột xuất | Lý do * | Hiển thị MSG-24. Thiếu lý do: không lưu. Xác nhận: thu hồi bắt đầu ngay, hạn hiển thị cụ thể (ví dụ 14:00 10/12/2026) | US-OFF-02 AC-2, AC-3 |
| Đổi ngày nghỉ việc | Ngày mới *, Lý do * | Xem trước nhiệm vụ chưa xong: hạn cũ → hạn mới; thời điểm thu hồi mới. Mục đã xong không có trong bảng. Ngày mới đã qua: không lưu, hiển thị MSG-22 | US-OFF-11 AC-1 → AC-4; US-OFF-13 AC-4 |
| Xác nhận hoàn tất | – | Như SCR-ON-02; lỗi hệ thống hiển thị MSG-13, giữ Chờ HR xác nhận | US-OFF-10 AC-4, AC-5 |

## 4. SCR-OFF-03 – Thu hồi quyền truy cập

```
Việc cần làm > Thu hồi quyền · Hoàng Văn Nam
+--------------------------------------------------------------------------+
| OFF-2026-0007 · Hoàng Văn Nam · Kế toán                                   |
| Thời điểm thu hồi 18:00 15/12/2026 · Hạn [theo SLA]      [Đang thu hồi]   |
| ℹ Thu hồi quyền không có ngoại lệ. Tài khoản chưa thu hồi được cần tiếp  |
|   tục xử lý.                                                             |
+--------------------------------------------------------------------------+
|  # | Quyền            | Hệ thống | Tài khoản | Trạng thái       |          |
|  1 | Email công ty    | M365     | nam.hoang | Đã vô hiệu hóa   | Xem      |
|  2 | Phần mềm kế toán | MISA     | nam.hoang | Đang thu hồi     | [Ghi kết quả] |
|  3 | CRM nội bộ       | CRM      | nam.hoang | Đang thu hồi     | [Ghi kết quả] |
|                                  [+ Bổ sung quyền cấp ngoài ELAMS]       |
+--------------------------------------------------------------------------+
```

**Trước thời điểm thu hồi:** nhiệm vụ ở Chờ đến thời điểm thu hồi; bảng chỉ đọc, các nút Ghi kết quả ẩn, hiển thị "Bắt đầu lúc 18:00 15/12/2026" (US-OFF-06 AC-1, AC-2).

**Hộp thoại Ghi kết quả:**

| Trường | Kiểu | Bắt buộc | Ghi chú | AC |
| --- | --- | --- | --- | --- |
| Kết quả | Đã thu hồi / Đã vô hiệu hóa / Chưa thu hồi được | Có | **Không có** lựa chọn đóng theo ngoại lệ | US-OFF-06 AC-3; US-OFF-07 AC-1 |
| Bằng chứng | Tệp hoặc mã ticket | Có khi Đã thu hồi hoặc Đã vô hiệu hóa | MSG-25 | US-OFF-06 AC-4 |
| Lý do | Văn bản | Có khi Chưa thu hồi được | MSG-01 | US-OFF-07 AC-1 |

Mục "Chưa thu hồi được" có nút "Ghi kết quả" để xử lý lại. Nhiệm vụ chỉ kết thúc khi mọi mục là Đã thu hồi hoặc Đã vô hiệu hóa (US-OFF-06 AC-5; US-OFF-07 AC-2).

**Bổ sung quyền cấp ngoài ELAMS:** quyền (văn bản), hệ thống *, tài khoản *, ghi chú. Mục mới có nguồn "IT bổ sung" và xử lý như các mục khác (US-OFF-07 AC-3).

## 5. SCR-OFF-04 – Thu hồi thiết bị

```
Việc cần làm > Thu hồi thiết bị · Hoàng Văn Nam
+--------------------------------------------------------------------------+
| OFF-2026-0007 · Hoàng Văn Nam · Ngày cuối 15/12/2026 · Hạn 15/12/2026     |
+--------------------------------------------------------------------------+
|  Mã tài sản   | Loại      | Trạng thái              |                    |
|  LT-2025-0188 | Laptop    | Đã thu hồi · Tốt        | Xem                |
|  MN-2025-0042 | Màn hình  | Thiếu – chờ quyết định  | Chờ Trần Thị Bình  |
+--------------------------------------------------------------------------+
```

| Hành động | Trường | Kết quả | AC |
| --- | --- | --- | --- |
| Ghi nhận thu hồi | Thời điểm *, Tình trạng * (Tốt / Hư hỏng nhẹ / Hư hỏng nặng), Ghi chú | Thiết bị Đã thu hồi. Thiếu tình trạng: không lưu | US-OFF-08 AC-2, AC-3 |
| Ghi nhận thiếu | Lý do *, Bằng chứng * | Thiết bị Thiếu – chờ quyết định; Manager nhận nhiệm vụ | US-OFF-09 AC-1 |
| Sau quyết định của Manager | – | Ngoại lệ – chưa thu hồi (ghi người duyệt, lý do) hoặc quay lại Chờ thu hồi | US-OFF-09 AC-4, AC-5 |

Mở nhiệm vụ hiển thị mọi thiết bị đã cấp theo mã tài sản (US-OFF-08 AC-1). Nhiệm vụ kết thúc khi mọi thiết bị là Đã thu hồi hoặc Ngoại lệ – chưa thu hồi (US-OFF-08 AC-4).

## 6. SCR-OFF-05 – Bàn giao công việc

```
Việc cần làm > Bàn giao công việc · Hoàng Văn Nam
+--------------------------------------------------------------------------+
| OFF-2026-0007 · Hoàng Văn Nam · Ngày cuối 15/12/2026                      |
+--------------------------------------------------------------------------+
| Hạng mục *           | Người nhận *  | Hạn *      | Trạng thái     |       |
| Sổ cái tháng 12      | Lê Minh Châu  | 15/12/2026 | Đã bàn giao    |       |
| Hồ sơ thuế quý 4     | Lê Minh Châu  | 15/12/2026 | Chưa đạt       |       |
|   Lý do: "Thiếu chứng từ tháng 10" – Trần Thị Bình                       |
| [+ Thêm hạng mục]                                                        |
|                     [Lưu kế hoạch]   [ Xác nhận bàn giao đầy đủ ]        |
+--------------------------------------------------------------------------+
```

| Vai trò | Được làm | AC |
| --- | --- | --- |
| Manager | Thêm, sửa hạng mục (thiếu người nhận: không lưu); đánh dấu hạng mục Chưa đạt kèm lý do; Xác nhận bàn giao đầy đủ (chỉ hiện khi mọi hạng mục Đã bàn giao) | US-OFF-03 AC-1, AC-2; US-OFF-05 AC-1, AC-2 |
| Nhân viên nghỉ việc | Đánh dấu hạng mục Đã bàn giao, thêm ghi chú. Không sửa kế hoạch | US-OFF-04 AC-1 |
| Manager khi nhân viên không thể cập nhật | Nút "Cập nhật thay nhân viên" hiện khi yêu cầu đột xuất hoặc tài khoản nhân viên đã bị thu hồi; lịch sử ghi "Bình cập nhật thay Nam" | US-OFF-04 AC-3 |

Nhân viên nghỉ việc mở màn hình này từ Việc cần làm; menu của họ không có mục Offboarding nên không thấy nhiệm vụ thu hồi (US-OFF-04 AC-2).

## 7. SCR-ON-03 mở rộng – Nhiệm vụ offboarding trong Việc cần làm

**Loại nhiệm vụ mới:** Bàn giao công việc (Manager, mở SCR-OFF-05) · Cập nhật bàn giao (Employee, mở SCR-OFF-05) · Thu hồi quyền, Thu hồi thiết bị (IT, mở SCR-OFF-03, 04) · Duyệt ngoại lệ thiết bị (Manager, bảng bên phải) · Xác nhận hoàn tất offboarding (HR, mở SCR-OFF-02). Nhiệm vụ của yêu cầu đột xuất mang nhãn Đột xuất và đứng đầu danh sách.

**Bảng duyệt ngoại lệ thiết bị (Manager):**

| Trường | Ghi chú | AC |
| --- | --- | --- |
| Nhân viên, mã yêu cầu, thiết bị (mã tài sản, loại) | Chỉ đọc | – |
| Lý do thiếu và bằng chứng của IT | Chỉ đọc; xem được tệp | US-OFF-09 AC-1 |
| Quyết định * | Duyệt ngoại lệ / Tiếp tục thu hồi | – |
| Lý do | Bắt buộc khi Duyệt ngoại lệ; thiếu thì không lưu | US-OFF-09 AC-3 |
| Khung hệ quả | Duyệt ngoại lệ: "Thiết bị chuyển Ngoại lệ – chưa thu hồi và vẫn được theo dõi. HR được thông báo." Tiếp tục: "IT tiếp tục thu hồi thiết bị." | US-OFF-09 AC-2, AC-4 |

**Cảnh báo quá hạn:** giữ nguyên quy tắc của Onboarding. Mục thu hồi quyền quá hạn còn gửi cho Security (US-OFF-13 AC-1 → AC-3).

## 8. Độ phủ Acceptance Criteria

| User story | AC | Màn hình |
| --- | --- | --- |
| US-OFF-01 | AC-1 → AC-5 | SCR-OFF-01 |
| US-OFF-02 | AC-1 | SCR-OFF-01 |
| US-OFF-02 | AC-2, AC-3 | SCR-OFF-02 (hộp thoại Chuyển sang đột xuất) |
| US-OFF-03 | AC-1, AC-2 | SCR-OFF-05 |
| US-OFF-04 | AC-1, AC-3 | SCR-OFF-05 |
| US-OFF-04 | AC-2 | SCR-OFF-05, SCR-ON-03 (menu và Việc cần làm của nhân viên) |
| US-OFF-05 | AC-1, AC-2 | SCR-OFF-05 |
| US-OFF-06 | AC-1 → AC-5 | SCR-OFF-03 |
| US-OFF-07 | AC-1 → AC-3 | SCR-OFF-03 |
| US-OFF-08 | AC-1 → AC-4 | SCR-OFF-04 |
| US-OFF-09 | AC-1, AC-5 | SCR-OFF-04, SCR-OFF-02 |
| US-OFF-09 | AC-2 → AC-4 | SCR-ON-03 mở rộng |
| US-OFF-10 | AC-1 → AC-5 | SCR-OFF-02 |
| US-OFF-11 | AC-1 → AC-4 | SCR-OFF-02 (hộp thoại Đổi ngày) |
| US-OFF-12 | AC-1 → AC-3 | SCR-OFF-02 |
| US-OFF-13 | AC-1 → AC-3 | SCR-ON-03 |
| US-OFF-13 | AC-4 | SCR-OFF-02 (hộp thoại Đổi ngày) |

Cả 48 AC đều gắn với ít nhất một màn hình.

## 9. Frame đề xuất cho Figma

| Màn hình | Frame |
| --- | --- |
| SCR-OFF-01 | Đã chọn nhân viên, không đột xuất |
| SCR-OFF-02 | Chờ xử lý điều kiện còn thiếu (thẻ Thu hồi quyền) · Hộp thoại Chuyển sang đột xuất |
| SCR-OFF-03 | Đang thu hồi, hộp thoại Ghi kết quả "Chưa thu hồi được" |
| SCR-OFF-04 | Một thiết bị đã thu hồi, một thiết bị thiếu |
| SCR-OFF-05 | Manager xem kế hoạch, một hạng mục Chưa đạt |
| SCR-ON-03 | Manager duyệt ngoại lệ thiết bị |
