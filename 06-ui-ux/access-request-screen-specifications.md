# ĐẶC TẢ MÀN HÌNH – ACCESS REQUEST & APPROVAL

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [Use Case Access Request](../02-requirements/use-case-specifications/access-request-use-cases.md), [User Stories Access Request](../02-requirements/user-stories/access-request-user-stories.md)

**Thiết kế:** [Figma](https://www.figma.com/design/sxQaybHEwuvCMIBTmxwuxE/ELAMS)

---

## 1. Phạm vi

Khung ứng dụng, định dạng, nhãn trạng thái và thông báo chung dùng theo [Đặc tả màn hình Onboarding](onboarding-screen-specifications.md), mục 2. Tài liệu này chỉ mô tả phần mới.

| Mã | Màn hình | Use case | Vai trò |
| --- | --- | --- | --- |
| SCR-AC-01 | Tạo yêu cầu cấp quyền | UC-AC-01 | Mọi nhân viên |
| SCR-AC-02 | Danh sách yêu cầu quyền | UC-AC-03 | Mọi nhân viên; Manager có thêm thẻ Phòng ban |
| SCR-AC-03 | Chi tiết yêu cầu cấp quyền (gồm bổ sung và hủy) | UC-AC-02, 03 | Người yêu cầu, người duyệt, IT, Security, Admin |
| SCR-ON-03 (mở rộng) | Việc cần làm: thêm nhiệm vụ xét duyệt yêu cầu quyền | UC-AC-04, 05, 07 | Manager, Security, IT |
| SCR-ON-04 (dùng chung) | Xử lý nhiệm vụ cấp quyền | UC-AC-06 | IT |

**Menu bổ sung:** nhóm "Quyền truy cập" gồm "Yêu cầu quyền" (SCR-AC-02) và "+ Tạo yêu cầu quyền" (SCR-AC-01), hiển thị với mọi vai trò.

**Nhãn trạng thái yêu cầu:**

| Nhãn | Màu gợi ý |
| --- | --- |
| Chờ Manager duyệt, Chờ Security duyệt, Chờ cấp quyền | Xanh dương |
| Chờ bổ sung | Cam |
| Đã cấp | Xanh lá |
| Bị từ chối | Đỏ |
| Đã hủy | Xám |

**Thông báo bổ sung** (tiếp nối MSG-01 → 15 của Onboarding):

| Mã | Loại | Nội dung |
| --- | --- | --- |
| MSG-16 | Lỗi | Bạn đang có yêu cầu [mã] cho quyền này chưa kết thúc. Không thể gửi yêu cầu mới. [Mở yêu cầu] |
| MSG-17 | Cảnh báo | Bạn đã có quyền [tên quyền] mức [mức hiện tại]. Chỉ gửi nếu bạn cần mức quyền khác. |
| MSG-18 | Lỗi | Chưa xác định được người duyệt vì bạn chưa có Manager trong cơ cấu tổ chức. Vui lòng liên hệ HR. |
| MSG-19 | Thành công | Đã gửi yêu cầu [mã]. Người duyệt: [tên]. |
| MSG-20 | Thông tin | Yêu cầu đã được gửi lại và chuyển về Chờ Manager duyệt. |
| MSG-21 | Cảnh báo | Hủy yêu cầu [mã]? Yêu cầu đã hủy không mở lại được. |

## 2. SCR-AC-01 – Tạo yêu cầu cấp quyền

**Mục đích:** nhân viên gửi yêu cầu cho một quyền, biết trước ai duyệt và qua mấy cấp. **Quy tắc:** BR-AC-01, 03, 06, 07.

```
Quyền truy cập > Tạo yêu cầu cấp quyền
+--------------------------------------------------------------------------+
| NGƯỜI YÊU CẦU                                                             |
|  Nguyễn Văn An · Kế toán viên · Phòng Kế toán                            |
|  Người duyệt: Trần Thị Bình (Manager trực tiếp)                          |
+--------------------------------------------------------------------------+
| QUYỀN CẦN CẤP                                                             |
|  Quyền *            [Phần mềm kế toán                     v] (tìm kiếm)  |
|  +--------------------------------------------------------------------+  |
|  | Hệ thống: MISA   [Nhạy cảm]                                        |  |
|  | Cấp phê duyệt: Manager → Security → IT                             |  |
|  +--------------------------------------------------------------------+  |
|  ⚠ Bạn đã có quyền Phần mềm kế toán mức Xem. Chỉ gửi nếu cần mức khác.  |
|  Mức quyền *        [Ghi                v]                               |
|  Lý do sử dụng *    [Lập phiếu chi cho bộ phận công nợ từ tháng 12   ]   |
|  Ngày cần có quyền  [01/12/2026 📅]                                       |
|  Tệp đính kèm       [Tải tệp lên]                                         |
|                                            [Hủy]   [ Gửi yêu cầu ]       |
+--------------------------------------------------------------------------+
```

| Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ / Hành vi | AC |
| --- | --- | --- | --- | --- |
| Người yêu cầu, phòng ban | Chỉ đọc | – | Lấy từ tài khoản đăng nhập | – |
| Người duyệt | Chỉ đọc | – | Manager trực tiếp; nếu người yêu cầu là Manager thì là cấp trên trực tiếp. Không xác định được: hiển thị MSG-18, ẩn nút Gửi | US-AC-02 AC-1; US-AC-01 AC-6 |
| Quyền | Danh sách chọn có tìm kiếm | Có | Chỉ quyền đang hoạt động trong danh mục. Chọn xong hiển thị khung hệ thống, nhãn Nhạy cảm, cấp phê duyệt | US-AC-01 AC-1 |
| Cảnh báo quyền hiện có | Thông tin | – | Hiện MSG-17 khi người yêu cầu đã có quyền này | US-AC-01 AC-5 |
| Mức quyền | Danh sách chọn theo quyền | Có | – | – |
| Lý do sử dụng | Văn bản, tối đa 500 ký tự | Có | MSG-01 | US-AC-01 AC-2 |
| Ngày cần có quyền | Ngày | Không | Không trước hôm nay | – |
| Tệp đính kèm | Tệp | Không | Theo quy ước chung | – |

| Trạng thái | Hiển thị | AC |
| --- | --- | --- |
| Chưa chọn quyền | Khung thông tin quyền ẩn | – |
| Lỗi dữ liệu | Lỗi dưới trường và tóm tắt ở đầu | US-AC-01 AC-2 |
| Trùng yêu cầu | MSG-16 ở đầu biểu mẫu, không tạo yêu cầu | US-AC-01 AC-4 |
| Gửi thành công | MSG-19, chuyển sang SCR-AC-03 của yêu cầu vừa tạo, trạng thái Chờ Manager duyệt | US-AC-01 AC-3 |

## 3. SCR-AC-02 – Danh sách yêu cầu quyền

**Mục đích:** nhân viên xem yêu cầu của mình; Manager xem thêm yêu cầu của nhân viên mình quản lý.

```
Quyền truy cập > Yêu cầu quyền                       [+ Tạo yêu cầu quyền]
+--------------------------------------------------------------------------+
| [Của tôi (2)] [Phòng ban (5)]*   Trạng thái [Tất cả v]  Tìm [         ]  |
+--------------------------------------------------------------------------+
| Mã           | Quyền            | Mức | Gửi ngày   | Trạng thái        | Đang chờ        |
| AR-2026-0032 | Phần mềm kế toán | Ghi | 27/11/2026 | Chờ Security duyệt| Võ Thanh Hải · hạn 02/12 |
| AR-2026-0031 | CRM nội bộ       | Xem | 27/11/2026 | Chờ bổ sung       | Bạn · 10 ngày    |
+--------------------------------------------------------------------------+
 * Thẻ Phòng ban chỉ hiển thị với Manager; có thêm cột Người yêu cầu.
```

| Thành phần | Mô tả | AC |
| --- | --- | --- |
| Thẻ Của tôi | Yêu cầu do người đăng nhập gửi | US-AC-09 AC-1 |
| Thẻ Phòng ban | Chỉ Manager; yêu cầu của nhân viên mình quản lý, không có phòng khác | US-AC-09 AC-3 |
| Cột Đang chờ | Người đang giữ và hạn. Với Chờ bổ sung: "Bạn · N ngày", không có hạn và không có dấu Quá hạn | US-AC-10 AC-3 |
| Phạm vi | Nhân viên khác không thấy yêu cầu không thuộc phạm vi của mình | US-AC-09 AC-4 |
| Sắp xếp | Mới gửi trước; yêu cầu chưa kết thúc lên đầu | – |
| Bấm một dòng | Mở SCR-AC-03 | – |
| Trống | "Bạn chưa có yêu cầu quyền nào." kèm nút Tạo yêu cầu | – |

## 4. SCR-AC-03 – Chi tiết yêu cầu cấp quyền

**Mục đích:** xem toàn bộ yêu cầu và tiến trình duyệt; người yêu cầu bổ sung hoặc hủy khi được yêu cầu bổ sung.

```
Quyền truy cập > AR-2026-0031
+--------------------------------------------------------------------------+
| AR-2026-0031  CRM nội bộ · mức Xem                        [Chờ bổ sung]  |
| Người yêu cầu: Nguyễn Văn An · Kế toán · Gửi 27/11/2026                  |
+--------------------------------------------------------------------------+
| ⚠ Trần Thị Bình yêu cầu bổ sung (28/11/2026 09:30):                      |
|   "Ghi rõ khách hàng cần theo dõi"                                       |
+--------------------------------------------------------------------------+
| THÔNG TIN YÊU CẦU                         | TIẾN TRÌNH                   |
|  Quyền       CRM nội bộ 🔒                 |  ✓ Gửi yêu cầu  27/11 14:05  |
|  Hệ thống    CRM · Không nhạy cảm          |    Nguyễn Văn An             |
|  Mức quyền * [Xem          v]              |  ⚠ Manager      28/11 09:30  |
|  Lý do *     [Theo dõi công nợ khách hàng  |    Trần Thị Bình             |
|               nhóm A, B                  ] |    Yêu cầu bổ sung           |
|  Ngày cần    01/12/2026                    |  ○ IT cấp quyền              |
|  Tệp         –  [Tải tệp lên]              |                              |
|                                            |                              |
|               [Hủy yêu cầu]  [ Gửi lại ]   |                              |
+--------------------------------------------------------------------------+
```

**Thông tin yêu cầu:** chỉ đọc, trừ khi trạng thái là Chờ bổ sung và người xem là người yêu cầu. Khi đó mức quyền, lý do và tệp được sửa; quyền luôn khóa.

**Tiến trình:** các bước theo cấp phê duyệt của quyền (có bước Security nếu nhạy cảm). Mỗi bước đã xảy ra hiển thị người, thời điểm, kết quả và lý do. Một yêu cầu có thể có nhiều lần qua bước Manager nếu đã bổ sung; mọi lần đều được giữ.

**Khung trạng thái và nút theo trạng thái:**

| Trạng thái | Khung | Nút (chỉ người yêu cầu) | AC |
| --- | --- | --- | --- |
| Chờ Manager duyệt, Chờ Security duyệt | "Đang chờ [tên], hạn [ngày]" | – | US-AC-09 AC-1 |
| Chờ bổ sung | Nội dung yêu cầu bổ sung, người, thời điểm | Gửi lại, Hủy yêu cầu | US-AC-05 AC-1 |
| Chờ cấp quyền | "IT đang xử lý". Lỗi cấp quyền của IT không hiển thị chi tiết cho người yêu cầu | – | US-AC-08 AC-2 |
| Đã cấp | Tài khoản sử dụng và thời điểm cấp | – | US-AC-07 AC-3 |
| Bị từ chối | Người từ chối, lý do, thời điểm | – | US-AC-09 AC-2; US-AC-04 AC-1 |
| Đã hủy | Thời điểm hủy | – | US-AC-05 AC-4 |

| Hành động | Kết quả | AC |
| --- | --- | --- |
| Gửi lại | Kiểm tra trường bắt buộc; MSG-20; trạng thái về Chờ Manager duyệt, cùng mã; tiến trình thêm lần duyệt mới | US-AC-05 AC-2 |
| Thử đổi quyền | Trường quyền khóa, không chọn được | US-AC-05 AC-3 |
| Hủy yêu cầu | Hộp thoại MSG-21; xác nhận thì chuyển Đã hủy | US-AC-05 AC-4 |

**Người xem không phải người yêu cầu:** người duyệt thấy nút "Mở trong Việc cần làm" khi đang có nhiệm vụ với yêu cầu này. Không có nút quyết định trên màn hình này, nên người yêu cầu không bao giờ thấy nút duyệt yêu cầu của mình (US-AC-02 AC-2). Thẻ Lịch sử thao tác cho Security và Admin như SCR-ON-02.

## 5. SCR-ON-03 mở rộng – Xét duyệt yêu cầu quyền trong Việc cần làm

**Danh sách nhiệm vụ** thêm ba loại: "Xét duyệt yêu cầu quyền" (Manager), "Xét duyệt quyền nhạy cảm – yêu cầu quyền" (Security), "Cấp quyền – yêu cầu quyền" (IT). Mỗi dòng ghi mã AR, quyền, người yêu cầu, hạn. Quy tắc sắp xếp và dấu Quá hạn giữ nguyên (US-AC-10 AC-1, AC-2, AC-4). Security chỉ có nhiệm vụ sau khi Manager đã duyệt (US-AC-06 AC-5).

**Bảng xét duyệt yêu cầu quyền (Manager):**

| Trường | Ghi chú | AC |
| --- | --- | --- |
| Người yêu cầu, phòng ban, mã yêu cầu | Mã là liên kết tới SCR-AC-03 | – |
| Quyền, hệ thống, mức quyền, nhãn Nhạy cảm, cấp phê duyệt | Chỉ đọc | US-AC-03 AC-1 |
| Lý do sử dụng, ngày cần, tệp | Chỉ đọc | US-AC-03 AC-1 |
| Quyền hiện có của người yêu cầu trên hệ thống này | Ví dụ "Đang có: Phần mềm kế toán mức Xem" | US-AC-03 AC-1 |
| Quyết định * | Phê duyệt / Yêu cầu bổ sung / Từ chối | – |
| Lý do hoặc nội dung cần bổ sung | Bắt buộc khi Từ chối hoặc Yêu cầu bổ sung; thiếu thì MSG-07, không lưu | US-AC-04 AC-2 |

**Khung hệ quả:**

| Lựa chọn | Nội dung |
| --- | --- |
| Phê duyệt, không nhạy cảm | "IT sẽ nhận nhiệm vụ cấp quyền." (US-AC-03 AC-2) |
| Phê duyệt, nhạy cảm | "Security Approver sẽ xét duyệt tiếp. IT chưa nhận nhiệm vụ." (US-AC-03 AC-3) |
| Yêu cầu bổ sung | "Yêu cầu chuyển Chờ bổ sung; [người yêu cầu] nhận nội dung cần bổ sung." (US-AC-04 AC-3) |
| Từ chối | "Yêu cầu kết thúc; [người yêu cầu] nhận lý do từ chối." (US-AC-04 AC-1) |

**Bảng xét duyệt của Security:** như trên, thêm quyết định của Manager (người, thời điểm) ở đầu bảng (US-AC-06 AC-1). Chỉ có hai lựa chọn Phê duyệt và Từ chối (US-AC-06 AC-2, AC-3, AC-4).

## 6. SCR-ON-04 dùng chung – Cấp quyền cho yêu cầu quyền

IT dùng cùng màn hình Xử lý nhiệm vụ cấp quyền của Onboarding (US-AC-07 AC-1 → AC-4; US-AC-08 AC-1, AC-3). Khác biệt:

| Phần | Onboarding | Yêu cầu quyền |
| --- | --- | --- |
| Thông tin quyền | Có phân loại bắt buộc, vị trí #n/tổng | Không có hai thông tin này; có lý do sử dụng của người yêu cầu |
| Cấp thất bại hoặc không xác định tài khoản | Quyền chuyển BLOCKED | Yêu cầu giữ Chờ cấp quyền; khung cam "Lần xử lý trước: [kết quả] – [lý do]", nút Xử lý lại đưa về mục Tài khoản (US-AC-08 AC-1, AC-2, AC-3) |
| Thu hồi khi phê duyệt mất hiệu lực | Có (BR-ON-12) | Không áp dụng |
| Gửi kết quả thành công | Quyền COMPLETED, quyền tiếp theo bắt đầu | Yêu cầu chuyển Đã cấp, người yêu cầu được thông báo |

## 7. Độ phủ Acceptance Criteria

| User story | AC | Màn hình |
| --- | --- | --- |
| US-AC-01 | AC-1 → AC-6 | SCR-AC-01 |
| US-AC-02 | AC-1 | SCR-AC-01, SCR-ON-03 |
| US-AC-02 | AC-2 | SCR-AC-03 |
| US-AC-03 | AC-1 → AC-3 | SCR-ON-03 mở rộng |
| US-AC-03 | AC-4 | SCR-AC-03 (tiến trình) |
| US-AC-04 | AC-1 → AC-3 | SCR-ON-03 mở rộng; kết quả hiển thị ở SCR-AC-03 |
| US-AC-05 | AC-1 → AC-4 | SCR-AC-03 |
| US-AC-05 | AC-5 | SCR-AC-02 (Chờ bổ sung N ngày) |
| US-AC-06 | AC-1 → AC-5 | SCR-ON-03 mở rộng |
| US-AC-07 | AC-1 → AC-4 | SCR-ON-04 dùng chung |
| US-AC-08 | AC-1, AC-3 | SCR-ON-04 dùng chung |
| US-AC-08 | AC-2 | SCR-ON-04; người yêu cầu thấy ở SCR-AC-03 |
| US-AC-09 | AC-1 → AC-4 | SCR-AC-02, SCR-AC-03 |
| US-AC-10 | AC-1, AC-2, AC-4 | SCR-ON-03 |
| US-AC-10 | AC-3 | SCR-AC-02 |

Cả 40 AC đều gắn với ít nhất một màn hình.

## 8. Frame đề xuất cho Figma

| Màn hình | Frame |
| --- | --- |
| SCR-AC-01 | Đã chọn quyền nhạy cảm, có cảnh báo quyền hiện có |
| SCR-AC-02 | Thẻ Của tôi |
| SCR-AC-03 | Chờ bổ sung (người yêu cầu đang sửa) · Bị từ chối |
| SCR-ON-03 | Manager chọn Yêu cầu bổ sung |
