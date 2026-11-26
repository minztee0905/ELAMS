# ĐẶC TẢ MÀN HÌNH (WIREFRAME SPECIFICATION) – EMPLOYEE ONBOARDING

**Dự án:** ELAMS

**Phạm vi:** Lát cắt Onboarding – 5 màn hình chính

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [Đặc tả Use Case Onboarding](../02-requirements/use-case-specifications/onboarding-use-cases.md), [User Stories và AC](../02-requirements/user-stories/onboarding-user-stories.md), [BRD Onboarding](../02-requirements/brd/brd-onboarding.md) mục 9, [Business Rules Catalog](../02-requirements/business-rules/business-rules-catalog.md)

**Thiết kế:** [Figma](https://www.figma.com/design/sxQaybHEwuvCMIBTmxwuxE/ELAMS)

---

## 1. Mục đích và phạm vi

Tài liệu mô tả nội dung, dữ liệu, thao tác, kiểm tra hợp lệ và các trạng thái của từng màn hình Onboarding để vẽ wireframe trên Figma. Đây là đặc tả mức nghiệp vụ: mô tả màn hình **hiển thị gì và cho phép làm gì**, không quy định màu sắc chi tiết, font hay công nghệ.

| Mã | Màn hình | Use case | User story | Vai trò sử dụng |
| --- | --- | --- | --- | --- |
| SCR-ON-01 | Tạo yêu cầu onboarding | UC-ON-01 | US-ON-01, 02 | HR |
| SCR-ON-02 | Chi tiết và tiến độ yêu cầu (gồm hộp thoại Đổi ngày bắt đầu, Xác nhận hoàn tất, thẻ Lịch sử thao tác) | UC-ON-02, 07, 08, 09 | US-ON-03, 12, 13, 14 | HR, Manager, IT, Security, System Admin |
| SCR-ON-03 | Việc cần làm (Approval Inbox) và bảng xét duyệt | UC-ON-02, 03, 04, 10 | US-ON-04, 05, 06, 07, 15 | Manager, Security, IT, HR |
| SCR-ON-04 | Xử lý nhiệm vụ cấp quyền | UC-ON-05 | US-ON-08, 09 | IT |
| SCR-ON-05 | Bàn giao và ghi nhận thiết bị | UC-ON-06 | US-ON-10, 11 | IT |

**Ngoài phạm vi bản này:**

- Danh sách toàn bộ yêu cầu onboarding và Dashboard (BREQ-ON-13, Should). Trong bản này HR mở SCR-ON-02 từ thông báo, từ SCR-ON-03 hoặc bằng mã yêu cầu. Danh sách và Dashboard sẽ đặc tả ở bản sau.
- Màn hình cấu hình danh mục quyền, mẫu nhiệm vụ, người dùng và vai trò (thuộc System Administrator, bước E).
- Đăng nhập, hồ sơ người dùng.

## 2. Quy ước chung

### 2.1. Khung ứng dụng

Mọi màn hình dùng chung một khung:

```
+--------------------------------------------------------------------------+
| ELAMS                                   [chuông thông báo (3)]  Lê Thu Hà |
|                                                                  HR Staff |
+----------------+---------------------------------------------------------+
| Việc cần làm (5)| Breadcrumb: Onboarding > ...                            |
| Onboarding      |                                                         |
|  + Tạo yêu cầu  |   NỘI DUNG MÀN HÌNH                                     |
|                 |                                                         |
+----------------+---------------------------------------------------------+
```

- Menu bên trái chỉ hiển thị mục mà vai trò được dùng. "+ Tạo yêu cầu" chỉ hiển thị với HR.
- Số trong "Việc cần làm (5)" là số nhiệm vụ chưa kết thúc của người dùng.
- Chuông thông báo hiển thị thông báo trong ứng dụng (nhiệm vụ mới, quá hạn). Kênh thông báo khác (email) thuộc SRS.

### 2.2. Định dạng và nhập liệu

| Quy ước | Nội dung |
| --- | --- |
| Ngày | dd/mm/yyyy, ví dụ 01/12/2026 |
| Ngày giờ | dd/mm/yyyy HH:mm, ví dụ 25/11/2026 14:30 |
| Trường bắt buộc | Dấu `*` sau nhãn |
| Trường chỉ đọc | Hiển thị dạng văn bản, không có khung nhập |
| Kiểm tra hợp lệ | Kiểm tra định dạng khi rời khỏi trường; kiểm tra toàn bộ khi bấm nút gửi. Lỗi hiển thị ngay dưới trường và tóm tắt ở đầu biểu mẫu kèm liên kết tới trường lỗi |
| Nút chính | Mỗi màn hình có tối đa một nút chính (nổi bật). Nút không được phép dùng thì **ẩn**, không chỉ làm mờ, trừ khi ghi rõ khác |
| Thao tác không hoàn tác được | Có hộp thoại xác nhận nêu rõ hệ quả |
| Tệp đính kèm | PDF, JPG, PNG; tối đa 10 MB mỗi tệp (đề xuất, chốt ở SRS) |

### 2.3. Nhãn trạng thái

Nhãn trạng thái luôn có **chữ**, màu chỉ là tín hiệu phụ (người mù màu vẫn đọc được).

| Đối tượng | Nhãn | Màu gợi ý | Nguồn |
| --- | --- | --- | --- |
| Yêu cầu | Đang xử lý | Xanh dương | UC mục 3 |
| Yêu cầu | Chờ xử lý điều kiện còn thiếu | Cam | BR-ON-07 |
| Yêu cầu | Chờ HR xác nhận | Tím | BR-ON-06 |
| Yêu cầu | Hoàn tất | Xanh lá | BR-ON-08 |
| Quyền | Chờ xử lý | Xám viền | BR-ON-09 |
| Quyền | Đang xử lý – [bước hiện tại] | Xanh dương | – |
| Quyền | COMPLETED | Xanh lá | BR-ON-02 |
| Quyền | REJECTED | Xám đặc | BR-ON-02 |
| Quyền | BLOCKED | Đỏ | BR-ON-02 |
| Thiết bị | Đang chuẩn bị / Chờ thiết bị / Đã bàn giao | Xanh dương / Cam / Xanh lá | BR-ON-03 |
| Nhiệm vụ | Quá hạn N ngày | Viền đỏ, đặt cạnh nhãn trạng thái | BR-GEN-01 |
| Nhiệm vụ | Sắp đến hạn (Should, ngưỡng chờ Q-01) | Viền cam | UC-ON-10 AF-01 |

"Quá hạn" là **dấu đánh kèm**, không thay thế trạng thái. Ví dụ: `BLOCKED` `Quá hạn 2 ngày`.

### 2.4. Danh mục thông báo

| Mã | Loại | Nội dung | Dùng ở |
| --- | --- | --- | --- |
| MSG-01 | Lỗi | Vui lòng nhập [tên trường]. | Mọi biểu mẫu |
| MSG-02 | Lỗi | Ngày bắt đầu không được trước ngày hôm nay. | SCR-ON-01, 02 |
| MSG-03 | Cảnh báo | Nhân viên này đã có yêu cầu onboarding đang xử lý: [mã yêu cầu]. Không thể tạo yêu cầu thứ hai. [Mở yêu cầu hiện có] | SCR-ON-01 |
| MSG-04 | Lỗi | Quyền này là bắt buộc theo mẫu vị trí. Không thể đổi sang không bắt buộc. | SCR-ON-01, 03 |
| MSG-05 | Lỗi | Khởi tạo yêu cầu chưa thành công. Chưa có yêu cầu hay nhiệm vụ nào được tạo. Dữ liệu bạn đã nhập vẫn được giữ, vui lòng gửi lại. | SCR-ON-01 |
| MSG-06 | Thành công | Đã tạo yêu cầu [mã yêu cầu] và [n] nhiệm vụ. | SCR-ON-01 |
| MSG-07 | Lỗi | Vui lòng nhập lý do từ chối. | SCR-ON-03 |
| MSG-08 | Thành công | Đã lưu quyết định. [Kết quả: bước tiếp theo] | SCR-ON-03 |
| MSG-09 | Lỗi | Vui lòng đính kèm bằng chứng cấp quyền. | SCR-ON-04 |
| MSG-10 | Cảnh báo | Phê duyệt của quyền này không còn hiệu lực: [lý do]. Kiểm tra hệ thống đích; nếu quyền đã được cấp, hãy thu hồi hoặc tạm ngừng và ghi kết quả. | SCR-ON-04 |
| MSG-11 | Lỗi | Thông tin bàn giao chưa đủ: [danh sách mục còn thiếu]. Nhiệm vụ chưa hoàn thành. | SCR-ON-05 |
| MSG-12 | Lỗi | Điều kiện hoàn tất đã thay đổi: [lý do]. Yêu cầu chưa được đóng và đã chuyển về Chờ xử lý điều kiện còn thiếu. | SCR-ON-02 |
| MSG-13 | Lỗi | Không thể ghi nhận do lỗi hệ thống. Trạng thái yêu cầu chưa thay đổi, vui lòng thử lại sau. | SCR-ON-02 và mọi thao tác ghi |
| MSG-14 | Thông tin | Đang cập nhật hạn nhiệm vụ theo ngày bắt đầu mới. Yêu cầu chưa thể chuyển sang Chờ HR xác nhận cho tới khi cập nhật xong. | SCR-ON-02 |
| MSG-15 | Lỗi | Bạn không có quyền truy cập chức năng này. | Mọi màn hình |

Nội dung thông báo là đề xuất của BA; câu chữ cuối cùng có thể chỉnh khi thiết kế UI.

### 2.5. Ma trận truy cập màn hình

| Màn hình / Phần | HR | Manager | Security | IT | System Admin |
| --- | --- | --- | --- | --- | --- |
| SCR-ON-01 Tạo yêu cầu | Dùng | – | – | – | – |
| SCR-ON-02 Chi tiết yêu cầu | Xem, đổi ngày, xác nhận hoàn tất (yêu cầu mình phụ trách) | Xem (yêu cầu có nhân viên thuộc mình quản lý) | Xem (yêu cầu có nhiệm vụ của mình) | Xem (yêu cầu có nhiệm vụ của mình) | Xem |
| SCR-ON-02 thẻ Lịch sử thao tác | – | – | Xem | – | Xem |
| SCR-ON-03 Việc cần làm | Nhiệm vụ của mình | Nhiệm vụ của mình | Nhiệm vụ của mình | Nhiệm vụ của mình | – |
| SCR-ON-04 Cấp quyền | – | – | – | Người được giao | – |
| SCR-ON-05 Thiết bị | – | – | – | Người được giao | – |

Phạm vi xem SCR-ON-02 của Manager và IT là giả định (Q-33). Quyền xem lịch sử thao tác là giả định (Q-30). Truy cập ngoài phạm vi hiển thị MSG-15.

---

## 3. SCR-ON-01 – Tạo yêu cầu onboarding

| Thuộc tính | Nội dung |
| --- | --- |
| Mục đích | HR nhập thông tin nhân viên mới, rà soát danh sách quyền và thiết bị đề xuất, gửi yêu cầu |
| Vai trò | HR Staff |
| Điểm vào | Menu "+ Tạo yêu cầu" |
| Điểm ra | Trạng thái thành công → nút "Xem chi tiết yêu cầu" mở SCR-ON-02 |
| Use case / Quy tắc | UC-ON-01 / BR-GEN-01, BR-ON-01, BR-ON-09, BR-ON-11, BR-AC-03 |

### 3.1. Bố cục

```
Onboarding > Tạo yêu cầu onboarding
+--------------------------------------------------------------------------+
| [Tóm tắt lỗi – chỉ hiện khi có lỗi]                                       |
|                                                                          |
| A. THÔNG TIN NHÂN VIÊN MỚI                                                |
|  Họ và tên *        [Nguyễn Văn An             ]                         |
|  Email cá nhân *    [an.nguyen@gmail.com       ]                         |
|  Phòng ban *        [Kế toán            v]                               |
|  Chức danh *        [Kế toán viên       v]  (i) Đổi chức danh sẽ tải lại |
|                                                 danh sách đề xuất        |
| B. THỜI GIAN VÀ QUẢN LÝ                                                   |
|  Ngày bắt đầu *     [01/12/2026  📅]                                      |
|  Manager trực tiếp *[Trần Thị Bình      v]                               |
|                                                                          |
| C. DANH SÁCH QUYỀN  (xử lý lần lượt theo thứ tự)     [+ Thêm quyền]      |
|  +---+---------------------+------------+--------+-----------+------+---+ |
|  | # | Quyền               | Hệ thống   | Mức    | Phân loại*| Nhạy | ↑↓| |
|  +---+---------------------+------------+--------+-----------+------+---+ |
|  | 1 | Email công ty       | Microsoft  | Người  | Bắt buộc  |      | ↓ | |
|  |   |  [Mẫu]              | 365        | dùng   | 🔒        |      |   | |
|  | 2 | Phần mềm kế toán    | MISA       | Xem    | Bắt buộc  | Nhạy | ↑↓| |
|  |   |  [Mẫu]              |            |        | 🔒        | cảm  |   | |
|  | 3 | Kho tài liệu chung  | SharePoint | Đọc    |(•)Không BB|      | ↑ | |
|  |   |  [Mẫu]              |            |        |           |      | 🗑 | |
|  +---+---------------------+------------+--------+-----------+------+---+ |
|                                                                          |
| D. THIẾT BỊ                                          [+ Thêm thiết bị]   |
|  | Loại thiết bị *     | Ghi chú cấu hình             |    |              |
|  | Laptop  [Mẫu]       | [                           ]| 🗑 |              |
|                                                                          |
| E. GHI CHÚ                                                                |
|  [Yêu cầu đặc biệt (không bắt buộc)                                    ] |
|                                                                          |
|                                         [Hủy]   [ Gửi yêu cầu ]          |
+--------------------------------------------------------------------------+
```

### 3.2. Trường dữ liệu

| # | Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ / Hành vi | Nguồn |
| --- | --- | --- | --- | --- | --- |
| A1 | Họ và tên | Văn bản, 2–100 ký tự | Có | Không chỉ gồm khoảng trắng | BRD 9.1 |
| A2 | Email cá nhân | Email | Có | Đúng định dạng email. Dùng để nhận diện nhân viên khi kiểm tra trùng yêu cầu (giả định, Q-38) | BRD 9.1, BR-ON-11 |
| A3 | Phòng ban | Danh sách chọn từ danh mục | Có | Chỉ phòng ban đang hoạt động | BRD 9.1 |
| A4 | Chức danh | Danh sách chọn, lọc theo phòng ban | Có | Khi chọn hoặc đổi: tải mẫu quyền và thiết bị của chức danh vào mục C, D. Nếu mục C, D đã có chỉnh sửa, hỏi xác nhận trước khi thay | UC-ON-01 bước 4 |
| B1 | Ngày bắt đầu | Ngày | Có | Không trước ngày hôm nay (MSG-02). Khoảng cách tối thiểu so với hôm nay chờ Q-03 | US-ON-01 AC-2, AC-3 |
| B2 | Manager trực tiếp | Danh sách chọn, có tìm kiếm | Có | Chỉ người dùng có vai trò Manager và đang hoạt động. Gợi ý mặc định: trưởng phòng ban đã chọn (đề xuất) | BRD 9.1 |
| C1 | Quyền | Chọn từ danh mục quyền | Có, tối thiểu 1 dòng | Không trùng quyền trong cùng yêu cầu | BRD 9.1 |
| C2 | Hệ thống đích | Chỉ đọc | – | Tự điền từ danh mục quyền | Danh mục quyền |
| C3 | Mức quyền | Danh sách chọn các mức của quyền đó | Có | Mặc định theo mẫu | US-ON-06 |
| C4 | Phân loại | Lựa chọn Bắt buộc / Không bắt buộc | Có | Quyền mẫu bắt buộc: hiển thị "Bắt buộc" kèm biểu tượng khóa, không đổi được (MSG-04). Quyền thêm thủ công: HR phải chọn, không có giá trị mặc định | BR-ON-01, US-ON-01 AC-5 |
| C5 | Nhạy cảm | Chỉ đọc | – | Hiển thị nhãn "Nhạy cảm" nếu danh mục đánh dấu. HR không chỉnh được | BR-AC-03 |
| C6 | Nguồn | Chỉ đọc | – | Nhãn [Mẫu] hoặc [Thêm thủ công] | UC-ON-01 AF-01, AF-02 |
| C7 | Thứ tự (↑↓) | Nút di chuyển | – | Thứ tự trên bảng là thứ tự xử lý (BR-ON-09). Mặc định theo mẫu | BR-ON-09 |
| C8 | Xóa (🗑) | Nút | – | Chỉ hiện ở quyền không bắt buộc và quyền thêm thủ công. Quyền mẫu bắt buộc không xóa được (giả định, Q-39) | BR-ON-01 |
| D1 | Loại thiết bị | Chọn từ danh mục thiết bị | Có, tối thiểu 1 dòng | – | BRD 9.1 |
| D2 | Ghi chú cấu hình | Văn bản, tối đa 200 ký tự | Không | – | – |
| E1 | Ghi chú | Văn bản nhiều dòng, tối đa 500 ký tự | Không | – | BRD 9.1 |

### 3.3. Hành động

| Nút | Hiển thị khi | Kết quả |
| --- | --- | --- |
| + Thêm quyền | Luôn | Thêm một dòng trống cuối bảng C, nguồn "Thêm thủ công" |
| + Thêm thiết bị | Luôn | Thêm một dòng trống cuối bảng D |
| Hủy | Luôn | Nếu đã nhập dữ liệu: hộp thoại "Bỏ dữ liệu đã nhập?" [Tiếp tục nhập] [Bỏ]. Không lưu nháp (ngoài phạm vi) |
| Gửi yêu cầu | Luôn | Kiểm tra toàn bộ biểu mẫu → kiểm tra trùng yêu cầu → tạo yêu cầu và nhiệm vụ trọn gói. Trong khi xử lý: nút chuyển "Đang gửi…" và bị khóa để tránh gửi hai lần |

### 3.4. Trạng thái màn hình

| Trạng thái | Hiển thị | AC |
| --- | --- | --- |
| Mặc định | Biểu mẫu trống; mục C, D trống với dòng hướng dẫn "Chọn chức danh để tải danh sách đề xuất" | – |
| Đã tải mẫu | Mục C, D có dữ liệu mẫu, mỗi quyền có phân loại | US-ON-01 AC-1 |
| Không có mẫu | Thông tin: "Chức danh này chưa có mẫu. Vui lòng thêm quyền và thiết bị thủ công, chọn phân loại cho từng quyền." | UC-ON-01 AF-01 |
| Lỗi dữ liệu | Tóm tắt lỗi ở đầu; từng trường lỗi viền đỏ với MSG-01, MSG-02, MSG-04 | US-ON-01 AC-2, AC-3, AC-5 |
| Trùng yêu cầu | Khung cảnh báo MSG-03 ở đầu biểu mẫu kèm liên kết mở yêu cầu hiện có; không tạo yêu cầu | US-ON-01 AC-4 |
| Khởi tạo thất bại | Khung lỗi MSG-05; mọi dữ liệu đã nhập giữ nguyên; nút "Gửi yêu cầu" dùng lại được. Gửi lại không tạo trùng | US-ON-02 AC-3, AC-4 |
| Thành công | Thay biểu mẫu bằng trang kết quả (mục 3.5) | US-ON-02 AC-1, AC-2 |

### 3.5. Trang kết quả sau khi gửi thành công

```
+--------------------------------------------------------------------------+
| ✓ Đã tạo yêu cầu ONB-2026-0012 và 2 nhiệm vụ.                             |
|   Nguyễn Văn An – Kế toán viên – Bắt đầu 01/12/2026      [Đang xử lý]    |
|                                                                          |
|  Nhiệm vụ đã tạo                                                         |
|  | Nhiệm vụ                         | Người phụ trách | Hạn        |      |
|  | Xét duyệt quyền: Email công ty   | Trần Thị Bình   | 26/11/2026 |      |
|  | Cấp thiết bị: Laptop             | Nhóm IT         | 28/11/2026 |      |
|  Quyền chờ xử lý theo thứ tự: Phần mềm kế toán, Kho tài liệu chung       |
|                                                                          |
|                     [Tạo yêu cầu khác]   [ Xem chi tiết yêu cầu ]        |
+--------------------------------------------------------------------------+
```

Chỉ quyền đầu tiên có nhiệm vụ xét duyệt; các quyền sau hiển thị là "chờ xử lý theo thứ tự" (US-ON-02 AC-2). Số nhiệm vụ và hạn trong ví dụ là minh họa; mẫu nhiệm vụ chờ Q-17.

---

## 4. SCR-ON-02 – Chi tiết và tiến độ yêu cầu

| Thuộc tính | Nội dung |
| --- | --- |
| Mục đích | Một nơi để xem trạng thái yêu cầu, từng quyền, thiết bị, nhiệm vụ, người đang giữ và hạn; HR đổi ngày bắt đầu và xác nhận hoàn tất |
| Vai trò | Xem theo ma trận mục 2.5. Thao tác chỉ dành cho HR phụ trách yêu cầu |
| Điểm vào | Trang kết quả SCR-ON-01; liên kết mã yêu cầu ở SCR-ON-03; thông báo |
| Use case / Quy tắc | UC-ON-02, 07, 08, 09 / BR-GEN-01, 02, 03, BR-ON-02, 04–09 |

### 4.1. Bố cục

```
Onboarding > ONB-2026-0012
+--------------------------------------------------------------------------+
| ONB-2026-0012  Nguyễn Văn An                 [Chờ xử lý điều kiện còn thiếu]
| Kế toán viên · Kế toán · Bắt đầu 01/12/2026                              |
| Manager: Trần Thị Bình · HR phụ trách: Lê Thu Hà · Tạo 24/11/2026        |
|                                              [Đổi ngày bắt đầu]          |
+--------------------------------------------------------------------------+
| [KHUNG TRẠNG THÁI – nội dung theo trạng thái yêu cầu, mục 4.3]            |
|  ⚠ Chưa đủ điều kiện hoàn tất:                                            |
|   • Phần mềm kế toán: BLOCKED – Security từ chối mức quản trị.            |
|     Đang chờ: Trần Thị Bình (điều chỉnh), hạn 27/11/2026  Quá hạn 1 ngày  |
|   • Thiết bị Laptop: Chờ thiết bị – Kho hết laptop cấu hình kế toán.      |
|     Đang chờ: Phạm Quốc Dũng (IT)                                         |
+--------------------------------------------------------------------------+
| Tiến độ:  Quyền 1/3 xong · Thiết bị 0/1 · Nhiệm vụ quá hạn: 1             |
+--------------------------------------------------------------------------+
| [ Quyền ] [ Thiết bị ] [ Nhiệm vụ ] [ Lịch sử thao tác ]*                 |
|                                                                          |
|  # | Quyền            | Hệ thống | Mức | Phân loại | Trạng thái  | Đang giữ / Hạn
|  1 | Email công ty    | M365     | ND  | Bắt buộc  | COMPLETED   | –      |
|  2 | Phần mềm kế toán | MISA     | Xem | Bắt buộc  | BLOCKED     | T.T.Bình
|    | Nhạy cảm         |          |     |           | Quá hạn 1 ng| 27/11  |
|    |  ▸ Lý do: Security từ chối mức quản trị – "Chỉ cần quyền xem"       |
|  3 | Kho tài liệu     | SharePt  | Đọc | Không BB  | Chờ xử lý   | Chờ quyền #2
|                                                                          |
|  ▾ Mở rộng dòng: lịch sử quyết định của quyền                            |
|    25/11 09:10  Trần Thị Bình   Phê duyệt (mức Quản trị)                 |
|    25/11 15:40  Võ Thanh Hải    Từ chối – "Chỉ cần quyền xem"            |
+--------------------------------------------------------------------------+
 * Thẻ "Lịch sử thao tác" chỉ hiển thị với Security Approver và System Administrator.
```

### 4.2. Dữ liệu hiển thị

**Phần đầu:**

| Trường | Ghi chú |
| --- | --- |
| Mã yêu cầu, họ tên, chức danh, phòng ban | – |
| Ngày bắt đầu | Nếu đã đổi: hiển thị ngày hiện hành, kèm chú thích "đã đổi từ 01/12/2026" |
| Manager, HR phụ trách, ngày tạo | – |
| Nhãn trạng thái yêu cầu | Theo mục 2.3 |
| Dòng tiến độ | Số quyền đã kết thúc (COMPLETED hoặc REJECTED) / tổng; thiết bị đã bàn giao / tổng; số nhiệm vụ quá hạn |

**Thẻ Quyền** (theo thứ tự xử lý):

| Cột | Ghi chú | AC |
| --- | --- | --- |
| #, Quyền, Hệ thống, Mức, Phân loại, Nhạy cảm | Chỉ đọc | – |
| Trạng thái | Chờ xử lý / Đang xử lý – [bước: Manager duyệt, Security duyệt, IT cấp quyền] / COMPLETED / REJECTED / BLOCKED; kèm dấu Quá hạn nếu có | US-ON-03 AC-1 |
| Đang giữ / Hạn | Người phụ trách bước hiện tại và hạn. Quyền chờ: "Chờ quyền #n" | US-ON-03 AC-2 |
| Lý do (dòng phụ) | Với BLOCKED: lý do và người cần xử lý. Với REJECTED: lý do và người từ chối | US-ON-03 AC-2, AC-3; US-ON-09 AC-2 |
| Mở rộng dòng | Lịch sử quyết định của quyền: thời điểm, người, kết quả, lý do. Với COMPLETED: tài khoản đã dùng, liên kết bằng chứng | BR-GEN-02 |

**Thẻ Thiết bị:** loại thiết bị, trạng thái (Đang chuẩn bị / Chờ thiết bị / Đã bàn giao), lý do chờ (nếu có), mã thiết bị, thời gian bàn giao, mã biên bản, liên kết biên bản, người giao (US-ON-11 AC-1).

**Thẻ Nhiệm vụ:** mọi nhiệm vụ của yêu cầu: loại, đối tượng (quyền/thiết bị), người phụ trách, hạn hiện hành, trạng thái, dấu Quá hạn. Sắp xếp mặc định: chưa kết thúc trước, theo hạn tăng dần.

**Thẻ Lịch sử thao tác** (UC-ON-09, chỉ Security và System Admin):

| Cột | Ghi chú |
| --- | --- |
| Thời điểm, Người thực hiện, Vai trò, Thao tác, Đối tượng, Kết quả, Lý do | Theo BRD 9.2 |
| Bộ lọc | Loại thao tác, người thực hiện, khoảng thời gian |
| Thứ tự | Mới nhất trước, có nút đổi thứ tự |

Thẻ này **không có** nút sửa, xóa hay chọn nhiều dòng (US-ON-13 AC-2). Vai trò khác không thấy thẻ; mở trực tiếp đường dẫn sẽ nhận MSG-15 (US-ON-13 AC-3).

### 4.3. Khung trạng thái theo trạng thái yêu cầu

| Trạng thái yêu cầu | Nội dung khung | Nút cho HR phụ trách | AC |
| --- | --- | --- | --- |
| Đang xử lý | Không hiển thị khung (chỉ dòng tiến độ) | Đổi ngày bắt đầu | US-ON-03 AC-1 |
| Chờ xử lý điều kiện còn thiếu | Danh sách điều kiện chưa đạt, mỗi dòng: đối tượng, lý do, người đang giữ, hạn, dấu Quá hạn | Đổi ngày bắt đầu. **Không có** nút Xác nhận hoàn tất | US-ON-12 AC-3 |
| Chờ HR xác nhận | Tóm tắt kết quả: từng quyền (COMPLETED/REJECTED kèm lý do), thiết bị đã bàn giao | **Xác nhận hoàn tất** (nút chính), Đổi ngày bắt đầu | US-ON-12 AC-1 |
| Hoàn tất | "Đã hoàn tất ngày [ngày] bởi [HR]" | Không có nút | US-ON-12 AC-2 |
| Đang cập nhật hạn sau đổi ngày | Thông tin MSG-14 | Không có nút Xác nhận hoàn tất | US-ON-14 AC-3 |

Mở xem màn hình **không** kích hoạt kiểm tra lại điều kiện hoàn tất; chỉ dữ liệu mới làm khung trạng thái thay đổi (US-ON-12 AC-4, BR-ON-07).

### 4.4. Hộp thoại Xác nhận hoàn tất

```
+------------------------------------------------------+
| Xác nhận hoàn tất onboarding – ONB-2026-0012          |
|                                                      |
| Nguyễn Văn An · Bắt đầu 01/12/2026                    |
|  ✓ Email công ty         COMPLETED                   |
|  ✓ Phần mềm kế toán      COMPLETED                   |
|  – Kho tài liệu chung    REJECTED – "Chưa cần ..."    |
|  ✓ Laptop                Đã bàn giao 30/11/2026       |
|                                                      |
| Sau khi xác nhận, yêu cầu chuyển sang Hoàn tất và    |
| không thể mở lại.                                    |
|                          [Quay lại]  [ Xác nhận ]    |
+------------------------------------------------------+
```

| Kết quả khi bấm Xác nhận | Hiển thị | AC |
| --- | --- | --- |
| Thành công | Đóng hộp thoại; nhãn chuyển Hoàn tất; khung trạng thái "Đã hoàn tất…" | US-ON-12 AC-2 |
| Điều kiện thay đổi ngay trước khi ghi nhận | Hộp thoại hiển thị MSG-12; sau khi đóng, màn hình ở trạng thái Chờ xử lý điều kiện còn thiếu | US-ON-12 AC-5 |
| Lỗi hệ thống | MSG-13; trạng thái giữ Chờ HR xác nhận | UC-ON-07 EF-02 |

### 4.5. Hộp thoại Đổi ngày bắt đầu (Should)

| Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ |
| --- | --- | --- | --- |
| Ngày bắt đầu hiện hành | Chỉ đọc | – | – |
| Ngày bắt đầu mới | Ngày | Có | Khác ngày hiện hành; không trước hôm nay (MSG-02); chính sách khác chờ Q-03 |
| Lý do thay đổi | Văn bản, tối đa 300 ký tự | Có | MSG-01 |
| Nhiệm vụ bị ảnh hưởng (xem trước) | Bảng chỉ đọc: nhiệm vụ chưa hoàn thành, hạn cũ → hạn mới | – | Nhiệm vụ đã hoàn thành và quyền đã COMPLETED **không** có trong bảng (BR-ON-04) |

Ghi chú cố định trong hộp thoại: "Đổi ngày không cấp lại hay thu hồi quyền đã cấp" (US-ON-14 AC-2).

Nút: [Hủy] [Lưu thay đổi]. Sau khi lưu: thông báo thành công; dấu Quá hạn được gỡ ở nhiệm vụ có hạn mới sau hôm nay (US-ON-15 AC-5); khi việc cập nhật chưa xong, hiển thị MSG-14 (US-ON-14 AC-1, AC-3).

Nút "Đổi ngày bắt đầu" hiển thị với HR phụ trách khi yêu cầu chưa Hoàn tất (giả định: cho phép cả khi Chờ HR xác nhận vì sự kiện đổi ngày có hiệu lực suốt quy trình).

---

## 5. SCR-ON-03 – Việc cần làm (Approval Inbox)

| Thuộc tính | Nội dung |
| --- | --- |
| Mục đích | Mỗi người thấy đúng các nhiệm vụ được giao cho mình, ưu tiên theo hạn; Manager và Security xét duyệt ngay trên bảng bên phải |
| Vai trò | Manager, Security, IT, HR (mỗi người chỉ thấy nhiệm vụ của mình) |
| Điểm vào | Menu "Việc cần làm"; thông báo |
| Điểm ra | Nhiệm vụ IT → SCR-ON-04 hoặc SCR-ON-05; nhiệm vụ HR Xác nhận hoàn tất → SCR-ON-02; mã yêu cầu → SCR-ON-02 |
| Use case / Quy tắc | UC-ON-02, 03, 04, 10 / BR-GEN-01, 02, BR-AC-03, 04, BR-ON-01, 02, 09 |

### 5.1. Bố cục (Manager đang mở một nhiệm vụ xét duyệt)

```
Việc cần làm
+-------------------------------------------+------------------------------+
| [Tất cả 2] [Xét duyệt 2] [Điều chỉnh 0]   | XÉT DUYỆT NHU CẦU QUYỀN       |
| [ ] Chỉ quá hạn      Tìm: [tên, mã     ]  | Hạn 26/11/2026   [Quá hạn ...]|
+-------------------------------------------+                              |
| ▶ Xét duyệt quyền · Email công ty         | Nhân viên mới                |
|   Nguyễn Văn An · ONB-2026-0012           |  Nguyễn Văn An – Kế toán viên|
|   Hạn 26/11/2026        [Đang chờ bạn]    |  Kế toán · Bắt đầu 01/12/2026|
+-------------------------------------------+  Yêu cầu: ONB-2026-0012 ↗    |
|   Xét duyệt quyền · Email công ty         |                              |
|   Lê Minh Châu · ONB-2026-0013            | Quyền                        |
|   Hạn 02/12/2026        [Đang chờ bạn]    |  Email công ty (#1/3)        |
+-------------------------------------------+  Hệ thống: Microsoft 365     |
|                                           |  Mức: Người dùng             |
|                                           |  Phân loại: Bắt buộc 🔒      |
|                                           |  Nhạy cảm: Không             |
|                                           |  Cấp phê duyệt: Manager → IT |
|                                           |                              |
|                                           | Quyết định *                 |
|                                           |  ( ) Phê duyệt  ( ) Từ chối  |
|                                           | Lý do nghiệp vụ / Lý do từ chối
|                                           |  [                         ] |
|                                           | [ℹ hệ quả của quyết định]    |
|                                           |            [ Gửi quyết định ]|
+-------------------------------------------+------------------------------+
```

### 5.2. Danh sách nhiệm vụ

| Thành phần | Mô tả | AC |
| --- | --- | --- |
| Bộ lọc nhanh | Theo loại nhiệm vụ, chỉ hiện loại vai trò có: Manager (Xét duyệt, Điều chỉnh), Security (Xét duyệt quyền nhạy cảm), IT (Cấp quyền, Quyền bị chặn, Thiết bị), HR (Xác nhận hoàn tất, nhiệm vụ HR khác). Số đếm cạnh mỗi bộ lọc | – |
| Chỉ quá hạn | Ô chọn lọc nhiệm vụ có dấu Quá hạn | US-ON-15 AC-1 |
| Tìm kiếm | Theo tên nhân viên mới hoặc mã yêu cầu | – |
| Mỗi dòng | Loại nhiệm vụ · đối tượng (quyền/thiết bị); tên nhân viên mới · mã yêu cầu; hạn hiện hành; nhãn trạng thái; dấu Quá hạn N ngày hoặc Sắp đến hạn | US-ON-04 AC-1 |
| Sắp xếp | Mặc định theo hạn tăng dần; quá hạn lên đầu | US-ON-04 AC-1 |
| Phạm vi | Chỉ nhiệm vụ đang giao cho người đăng nhập; nhiệm vụ đã kết thúc không hiển thị | US-ON-04 AC-2; US-ON-07 AC-4; US-ON-08 AC-4 |
| Trạng thái trống | "Bạn không có việc cần làm." | – |

Nhiệm vụ đang chờ (quyền BLOCKED cần điều chỉnh, thiết bị chờ hàng) vẫn hiển thị và vẫn mang dấu Quá hạn khi quá hạn (US-ON-15 AC-3). Nhiệm vụ đã hoàn thành không bao giờ mang dấu Quá hạn (US-ON-15 AC-2). Thông báo quá hạn gửi một lần cho mỗi hạn hiện hành (US-ON-15 AC-4) là hành vi hệ thống, kiểm tra qua chuông thông báo.

### 5.3. Bảng xét duyệt (Manager: UC-ON-03; Security: UC-ON-04)

| # | Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ / Hành vi | AC |
| --- | --- | --- | --- | --- | --- |
| R1 | Thông tin nhân viên mới, mã yêu cầu | Chỉ đọc | – | Mã yêu cầu là liên kết tới SCR-ON-02 | UC-ON-03 bước 2 |
| R2 | Quyền, vị trí (#n/tổng), hệ thống, mức, phân loại, nhạy cảm | Chỉ đọc | – | Phân loại và nhạy cảm lấy từ yêu cầu và danh mục; người duyệt không đổi được | BR-AC-03, BR-ON-01 |
| R3 | Cấp phê duyệt | Chỉ đọc | – | Chuỗi bước: "Manager → IT" hoặc "Manager → Security → IT"; bước hiện tại tô đậm | BR-AC-03 |
| R4 | Quyết định của Manager | Chỉ đọc | – | **Chỉ hiện với Security**: người duyệt, thời điểm, lý do nghiệp vụ (hoặc "Không có ghi chú") | US-ON-07 AC-1 |
| R5 | Quyết định | Lựa chọn Phê duyệt / Từ chối | Có | Chưa chọn thì không gửi được | – |
| R6 | Lý do | Văn bản nhiều dòng, tối đa 500 ký tự | Có khi Từ chối | Từ chối mà trống: MSG-07, không lưu quyết định. Khi Phê duyệt, nhãn đổi thành "Lý do nghiệp vụ (không bắt buộc)" (Q-40) | US-ON-05 AC-4; BR-GEN-02 |
| R7 | Khung hệ quả | Thông tin, đổi theo lựa chọn | – | Xem bảng dưới | US-ON-05 AC-3, AC-5 |

**Nội dung khung hệ quả (R7):**

| Lựa chọn | Quyền | Nội dung hiển thị trước khi gửi |
| --- | --- | --- |
| Phê duyệt | Không nhạy cảm | "IT sẽ nhận nhiệm vụ cấp quyền." |
| Phê duyệt | Nhạy cảm, người duyệt là Manager | "Quyền nhạy cảm: Security Approver sẽ xét duyệt tiếp. IT chưa nhận nhiệm vụ." |
| Từ chối | Không bắt buộc | "Quyền sẽ kết thúc với REJECTED và không được cấp. Quyền tiếp theo trong danh sách sẽ bắt đầu." |
| Từ chối | Bắt buộc | "Quyền bắt buộc không thể kết thúc bằng từ chối. Quyền sẽ chuyển BLOCKED và Manager [tên] nhận nhiệm vụ điều chỉnh. Các quyền phía sau tiếp tục chờ." |

**Hành động:** [Gửi quyết định] (nút chính). Hộp thoại xác nhận chỉ khi Từ chối. Thành công: MSG-08 kèm bước tiếp theo, nhiệm vụ rời danh sách, bảng phải chuyển sang nhiệm vụ kế tiếp (US-ON-05 AC-1, AC-2, AC-3, AC-5; US-ON-07 AC-2, AC-3).

### 5.4. Bảng điều chỉnh quyền bị chặn (Manager, UC-ON-03 AF-03)

```
| ĐIỀU CHỈNH QUYỀN BỊ CHẶN                Hạn 27/11/2026 [Quá hạn 1 ngày] |
| Phần mềm kế toán (#2/3) · MISA · Bắt buộc 🔒 · Nhạy cảm   [BLOCKED]     |
| Bị chặn bởi: Võ Thanh Hải (Security) · 25/11/2026 15:40                 |
| Lý do: "Kế toán viên chỉ cần quyền xem, không cần quyền quản trị."      |
|                                                                         |
| Mức quyền *          [Quản trị  v]  → chọn mức mới                      |
| Phân loại            Bắt buộc 🔒 (không thay đổi được)                   |
| Nội dung điều chỉnh *[                                               ]  |
| ℹ Sau khi gửi lại, quyền quay về bước xét duyệt của Manager với nội dung |
|   mới, rồi đi tiếp theo cấp phê duyệt của danh mục.                      |
|                                                    [ Gửi lại ]          |
```

| Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ | AC |
| --- | --- | --- | --- | --- |
| Lý do bị chặn, người chặn, thời điểm | Chỉ đọc | – | – | BR-GEN-02 |
| Mức quyền | Danh sách chọn | Có | Mặc định là mức đang bị chặn | US-ON-06 AC-1 |
| Phân loại | Chỉ đọc, có khóa | – | Không đổi sang không bắt buộc (MSG-04 nếu cố thay đổi qua thao tác khác) | US-ON-06 AC-3 |
| Nội dung điều chỉnh | Văn bản, tối đa 500 ký tự | Có | MSG-01 | – |

Sau khi gửi lại, nhiệm vụ xét duyệt mới xuất hiện ở danh sách của Manager với nội dung đã điều chỉnh (US-ON-06 AC-1). Khi chưa gửi lại, quyền phía sau vẫn Chờ xử lý (US-ON-06 AC-2, hiển thị ở SCR-ON-02).

---

## 6. SCR-ON-04 – Xử lý nhiệm vụ cấp quyền

| Thuộc tính | Nội dung |
| --- | --- |
| Mục đích | IT kiểm tra tài khoản đúng nhân viên trên hệ thống đích, cấp quyền đã duyệt, ghi kết quả kèm bằng chứng; xử lý khi bị chặn hoặc khi phải thu hồi |
| Vai trò | IT Staff được giao nhiệm vụ |
| Điểm vào | SCR-ON-03, bộ lọc Cấp quyền hoặc Quyền bị chặn |
| Điểm ra | Gửi kết quả → quay lại SCR-ON-03 |
| Use case / Quy tắc | UC-ON-05 / BR-AC-04, BR-ON-02, BR-ON-09, BR-ON-10, BR-ON-12 |

Nhiệm vụ cấp quyền chỉ tồn tại khi quyền đã đủ mọi phê duyệt bắt buộc, nên màn hình không có trạng thái "chưa đủ phê duyệt" (US-ON-08 AC-4).

### 6.1. Bố cục

```
Việc cần làm > Cấp quyền · Phần mềm kế toán · Nguyễn Văn An
+--------------------------------------------------------------------------+
| [KHUNG CẢNH BÁO – chỉ khi BLOCKED hoặc phải thu hồi, mục 6.4]             |
+--------------------------------------------------------------------------+
| 1. THÔNG TIN QUYỀN                                     Hạn 29/11/2026    |
|  Nhân viên: Nguyễn Văn An · Kế toán viên · ONB-2026-0012 ↗               |
|  Quyền: Phần mềm kế toán (#2/3) · Hệ thống: MISA · Mức: Xem              |
|  Bắt buộc · Nhạy cảm                                                     |
|  Phê duyệt đã có:                                                        |
|   ✓ Trần Thị Bình (Manager)   26/11/2026 10:05                           |
|   ✓ Võ Thanh Hải (Security)   26/11/2026 16:20                           |
+--------------------------------------------------------------------------+
| 2. TÀI KHOẢN TRÊN HỆ THỐNG ĐÍCH *                                        |
|  ELAMS chưa ghi nhận tài khoản nào của nhân viên này trên MISA.          |
|  ( ) Đã có tài khoản trên MISA – dùng lại                                 |
|  ( ) Chưa có – tôi đã tạo tài khoản mới                                   |
|  ( ) Không xác định được nhân viên đã có tài khoản hay chưa              |
|  Định danh tài khoản *  [an.nguyen                ]                      |
+--------------------------------------------------------------------------+
| 3. KẾT QUẢ CẤP QUYỀN *                                                   |
|  ( ) Thành công     ( ) Thất bại                                         |
|  Bằng chứng *        [Tải tệp lên]  hoặc  Mã ticket [            ]       |
|  Ghi chú             [                                              ]    |
|                                                   [ Gửi kết quả ]        |
+--------------------------------------------------------------------------+
```

### 6.2. Trường dữ liệu

| # | Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ / Hành vi | AC |
| --- | --- | --- | --- | --- | --- |
| P1 | Thông tin quyền, phê duyệt đã có | Chỉ đọc | – | Liệt kê từng phê duyệt: người, vai trò, thời điểm | US-ON-08 AC-1 |
| P2 | Tình trạng tài khoản | Lựa chọn 3 giá trị | Có | Xem mục 6.3 | BR-ON-10 |
| P3 | Định danh tài khoản | Văn bản | Có khi P2 là "Đã có" hoặc "Chưa có – đã tạo mới" | Ẩn khi P2 là "Không xác định được" | US-ON-08 AC-2 |
| P4 | Lý do không xác định được | Văn bản, tối đa 500 ký tự | Có khi P2 là "Không xác định được" | Khi chọn giá trị này, mục 3 bị ẩn; nút đổi thành [Gửi – chuyển BLOCKED] | US-ON-09 AC-1 |
| P5 | Kết quả cấp quyền | Lựa chọn Thành công / Thất bại | Có | – | – |
| P6 | Bằng chứng | Tệp hoặc mã ticket (ít nhất một) | Có khi Thành công | MSG-09 | US-ON-08 AC-2 |
| P7 | Lý do thất bại | Văn bản, tối đa 500 ký tự | Có khi Thất bại | MSG-01 | US-ON-09 AC-2 |
| P8 | Ghi chú | Văn bản, tối đa 500 ký tự | Không | – | – |

### 6.3. Hành vi mục Tài khoản (BR-ON-10)

| Tình huống | Hiển thị | AC |
| --- | --- | --- |
| ELAMS chưa ghi nhận tài khoản của nhân viên trên hệ thống đích | 3 lựa chọn như bố cục; không chọn sẵn | US-ON-08 AC-2 |
| ELAMS đã ghi nhận tài khoản (tạo khi xử lý quyền trước trên cùng hệ thống) | "Tài khoản đã ghi nhận: **an.nguyen** (tạo khi cấp quyền [tên quyền] ngày [ngày])". Chọn sẵn "Dùng lại tài khoản này", định danh chỉ đọc. Lựa chọn "Tạo mới" bị ẩn | US-ON-08 AC-3 |
| IT chọn "Không xác định được" | Ghi chú: "Không được tạo tài khoản mới khi chưa xác định được." Mục 3 ẩn | US-ON-09 AC-1 |

### 6.4. Trạng thái màn hình

| Trạng thái | Khung cảnh báo và hành vi | Nút | AC |
| --- | --- | --- | --- |
| Mới | Không có khung cảnh báo | Gửi kết quả | US-ON-08 AC-1 |
| Gửi thành công và ELAMS xác nhận | Thông báo "Quyền đã COMPLETED. Quyền tiếp theo đã bắt đầu."; quay lại SCR-ON-03 | – | US-ON-08 AC-2 |
| BLOCKED do không xác định tài khoản hoặc cấp thất bại | Khung đỏ: lý do, thời điểm. Mục 2, 3 chỉ đọc với dữ liệu lần trước | **Khắc phục và thử lại** → mở lại mục 2 (kiểm tra tài khoản lại từ đầu) | US-ON-09 AC-2, AC-3 |
| BLOCKED do kết quả không hợp lệ hoặc phê duyệt không còn hiệu lực | Khung đỏ MSG-10. Mục 3 thay bằng mục "Thu hồi / tạm ngừng" (bảng dưới) | Gửi kết quả thu hồi | US-ON-09 AC-4 |
| Đã ghi kết quả thu hồi, chờ phê duyệt hợp lệ mới | Khung cam: "Quyền giữ BLOCKED. Chỉ cấp lại sau khi có phê duyệt hợp lệ mới." Toàn bộ màn hình chỉ đọc | Không có nút | US-ON-09 AC-5 |
| Lỗi hệ thống khi gửi | MSG-13; dữ liệu đã nhập giữ nguyên | Gửi kết quả | – |

**Mục Thu hồi / tạm ngừng** (BR-ON-12):

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| Tình trạng quyền trên hệ thống đích | Lựa chọn: Đã được cấp / Chưa được cấp | Có | – |
| Hành động đã thực hiện | Lựa chọn: Thu hồi / Tạm ngừng | Có khi "Đã được cấp" | – |
| Bằng chứng | Tệp hoặc mã ticket | Có | MSG-09 |
| Ghi chú | Văn bản | Không | – |

Thế nào là "phê duyệt không còn hiệu lực" chờ Q-37; màn hình chỉ hiển thị lý do do ELAMS cung cấp.

---

## 7. SCR-ON-05 – Bàn giao và ghi nhận thiết bị

| Thuộc tính | Nội dung |
| --- | --- |
| Mục đích | IT ghi nhận thiếu thiết bị khi kho chưa có, hoặc ghi nhận bàn giao kèm biên bản đã ký |
| Vai trò | IT Staff được giao nhiệm vụ |
| Điểm vào | SCR-ON-03, bộ lọc Thiết bị |
| Use case / Quy tắc | UC-ON-06 / BR-ON-03, BR-GEN-03 |

Giả định: mỗi yêu cầu có một nhiệm vụ thiết bị, gồm các dòng thiết bị ở SCR-ON-01 mục D. Nhiệm vụ hoàn thành khi mọi dòng đã bàn giao. Nếu có dòng đang thiếu, nhiệm vụ ở trạng thái Chờ thiết bị.

### 7.1. Bố cục

```
Việc cần làm > Cấp thiết bị · Nguyễn Văn An
+--------------------------------------------------------------------------+
| Nguyễn Văn An · Kế toán viên · Bắt đầu 01/12/2026 · ONB-2026-0012 ↗      |
| Hạn 28/11/2026                                   [Đang chuẩn bị]         |
| Ghi chú của HR: "Cần cài sẵn phần mềm kế toán"                           |
+--------------------------------------------------------------------------+
| THIẾT BỊ CẦN CẤP                                                         |
|  1. Laptop (cấu hình kế toán)                          [Đang chuẩn bị]   |
|                                                                          |
|   Tình trạng kho *   ( ) Có thiết bị phù hợp    ( ) Thiếu thiết bị       |
|                                                                          |
|   --- khi "Có thiết bị phù hợp" ---                                      |
|   Mã thiết bị *         [LT-2026-0457     ]                              |
|   Thời gian bàn giao *  [30/11/2026 09:00 📅]                            |
|   Tình trạng thiết bị * [Mới            v]                               |
|   Mã biên bản *         [BB-0912          ]                              |
|   Biên bản đã ký *      [Tải tệp lên]  bien-ban-BB-0912.pdf ✕            |
|   Người giao            Phạm Quốc Dũng (bạn)                             |
|   Người nhận            Nguyễn Văn An                                    |
|                                                                          |
|   --- khi "Thiếu thiết bị" ---                                           |
|   Lý do chờ *           [Kho hết laptop cấu hình kế toán             ]   |
|   Dự kiến có thiết bị   [05/12/2026 📅]                                   |
|                                                                          |
|                    [Ghi nhận thiếu thiết bị]  [ Hoàn thành bàn giao ]    |
+--------------------------------------------------------------------------+
```

### 7.2. Trường dữ liệu

| # | Trường | Kiểu | Bắt buộc | Kiểm tra hợp lệ / Hành vi | AC |
| --- | --- | --- | --- | --- | --- |
| D1 | Tình trạng kho | Lựa chọn Có thiết bị phù hợp / Thiếu thiết bị | Có | Hiện nhóm trường tương ứng | UC-ON-06 bước 1, AF-01 |
| D2 | Mã thiết bị | Văn bản (hoặc chọn từ kho, chờ Q-28) | Có khi bàn giao | Không trùng thiết bị đang gắn với người khác (đề xuất) | US-ON-10 AC-1 |
| D3 | Thời gian bàn giao | Ngày giờ | Có khi bàn giao | Không sau thời điểm hiện tại | US-ON-10 AC-1 |
| D4 | Tình trạng thiết bị | Danh sách chọn: Mới / Đã qua sử dụng – tốt / Đã qua sử dụng – có lưu ý | Có khi bàn giao | Chọn "có lưu ý" thì bắt buộc nhập mô tả | US-ON-10 AC-1 |
| D5 | Mã biên bản | Văn bản | Có khi bàn giao | – | US-ON-10 AC-1 |
| D6 | Biên bản đã ký | Tệp PDF/JPG/PNG | Có khi bàn giao | Thiếu tệp: MSG-11, nhiệm vụ chưa hoàn thành | US-ON-10 AC-2 |
| D7 | Người giao | Chỉ đọc | – | Người đăng nhập | BRD 9.2 |
| D8 | Người nhận | Chỉ đọc | – | Nhân viên mới của yêu cầu | BRD 9.2 |
| D9 | Lý do chờ | Văn bản, tối đa 300 ký tự | Có khi thiếu thiết bị | MSG-01 | US-ON-11 AC-1 |
| D10 | Dự kiến có thiết bị | Ngày | Không | Không trước hôm nay | – |

### 7.3. Hành động và trạng thái

| Nút / Trạng thái | Hiển thị khi | Kết quả | AC |
| --- | --- | --- | --- |
| Ghi nhận thiếu thiết bị | D1 = Thiếu thiết bị | Dòng thiết bị và nhiệm vụ chuyển Chờ thiết bị; HR thấy lý do ở SCR-ON-02 thẻ Thiết bị | US-ON-11 AC-1 |
| Trạng thái Chờ thiết bị | Sau khi ghi nhận thiếu | Khung cam: lý do chờ, ngày ghi nhận, ngày dự kiến. Các trường bàn giao ẩn. Nhiệm vụ không tự chuyển trạng thái theo thời gian hay theo ngày dự kiến | US-ON-11 AC-2 |
| Đã có thiết bị phù hợp hoặc thay thế | Ở trạng thái Chờ thiết bị | Hộp thoại: lựa chọn Thiết bị như yêu cầu / Thiết bị thay thế (nhập mô tả, bắt buộc). Sau khi xác nhận, dòng quay về Đang chuẩn bị và mở lại D1 | US-ON-11 AC-3 |
| Hoàn thành bàn giao | D1 = Có thiết bị phù hợp | Kiểm tra D2–D6; đủ thì dòng chuyển Đã bàn giao; khi mọi dòng đã bàn giao, nhiệm vụ hoàn thành và quay về SCR-ON-03 | US-ON-10 AC-1 |
| Thiếu thông tin bàn giao | Khi bấm Hoàn thành bàn giao | MSG-11 liệt kê mục còn thiếu; nhiệm vụ chưa hoàn thành; dữ liệu đã nhập giữ nguyên | US-ON-10 AC-2 |
| Đã bàn giao | Nhiệm vụ hoàn thành | Toàn bộ màn hình chỉ đọc; tệp biên bản xem được | – |

---

## 8. Độ phủ Acceptance Criteria

| User story | AC | Màn hình | Ghi chú |
| --- | --- | --- | --- |
| US-ON-01 | AC-1 → AC-5 | SCR-ON-01 | – |
| US-ON-02 | AC-1, AC-2 | SCR-ON-01 (trang kết quả), SCR-ON-02 | – |
| US-ON-02 | AC-3, AC-4 | SCR-ON-01 (khởi tạo thất bại) | Tính trọn gói và không tạo trùng do hệ thống bảo đảm (SRS-ON-03); UAT kiểm qua màn hình |
| US-ON-03 | AC-1 → AC-3 | SCR-ON-02 thẻ Quyền | – |
| US-ON-04 | AC-1, AC-2 | SCR-ON-03 danh sách | – |
| US-ON-05 | AC-1 → AC-5 | SCR-ON-03 bảng xét duyệt | – |
| US-ON-06 | AC-1, AC-3 | SCR-ON-03 bảng điều chỉnh | – |
| US-ON-06 | AC-2 | SCR-ON-02 thẻ Quyền | – |
| US-ON-07 | AC-1 → AC-3 | SCR-ON-03 bảng xét duyệt (Security) | – |
| US-ON-07 | AC-4 | SCR-ON-03 danh sách (không có nhiệm vụ) | – |
| US-ON-08 | AC-1 → AC-3 | SCR-ON-04 | – |
| US-ON-08 | AC-4 | SCR-ON-03 danh sách (không có nhiệm vụ) | – |
| US-ON-09 | AC-1 → AC-5 | SCR-ON-04; AC-2 phần HR thấy lý do ở SCR-ON-02 | – |
| US-ON-10 | AC-1, AC-2 | SCR-ON-05 | – |
| US-ON-11 | AC-1 → AC-3 | SCR-ON-05; AC-1 phần HR thấy lý do ở SCR-ON-02 | – |
| US-ON-12 | AC-1 → AC-3, AC-5 | SCR-ON-02 khung trạng thái và hộp thoại Xác nhận hoàn tất | – |
| US-ON-12 | AC-4 | SCR-ON-02 | Hành vi hệ thống: mở xem không kích hoạt kiểm tra lại |
| US-ON-13 | AC-1 → AC-3 | SCR-ON-02 thẻ Lịch sử thao tác | – |
| US-ON-14 | AC-1 → AC-3 | SCR-ON-02 hộp thoại Đổi ngày bắt đầu, MSG-14 | Should |
| US-ON-15 | AC-1 → AC-5 | SCR-ON-03 dấu Quá hạn, chuông thông báo; AC-5 qua SCR-ON-02 | Should. AC-4 (không gửi lần hai) là hành vi hệ thống |

Cả 56 AC đều gắn với ít nhất một màn hình. Bảng này là đầu vào cho cột Màn hình trong RTM.

## 9. Thiết kế Figma

[ELAMS – Figma](https://www.figma.com/design/sxQaybHEwuvCMIBTmxwuxE/ELAMS)

## 10. Giả định và câu hỏi mở

| Mã | Nội dung | Ảnh hưởng | Trạng thái |
| --- | --- | --- | --- |
| Q-38 | Nhận diện "cùng một nhân viên" khi kiểm tra trùng yêu cầu bằng gì (email cá nhân, số CCCD, mã ứng viên)? | SCR-ON-01 kiểm tra trùng, BR-ON-11 | Có giả định: email cá nhân |
| Q-39 | HR có được xóa một quyền bắt buộc theo mẫu khỏi yêu cầu không? | SCR-ON-01 nút xóa, BR-ON-01 | Có giả định: không được xóa |
| Q-40 | Manager có phải ghi lý do nghiệp vụ khi phê duyệt quyền nhạy cảm để Security tham khảo không? | SCR-ON-03 trường R6, US-ON-07 AC-1 | Có giả định: không bắt buộc |
| Q-01 | Ngưỡng "Sắp đến hạn" | SCR-ON-03 nhãn Sắp đến hạn | Mở |
| Q-03 | Chính sách ngày bắt đầu tối thiểu và cách tính hạn mới | SCR-ON-01 B1, SCR-ON-02 hộp thoại đổi ngày | Mở |
| Q-17 | Mẫu nhiệm vụ khi khởi tạo | SCR-ON-01 trang kết quả | Mở |
| Q-28 | Thiết bị quản lý theo danh mục hay từng tài sản | SCR-ON-05 trường mã thiết bị | Mở |
| Q-30 | Vai trò xem lịch sử thao tác | SCR-ON-02 thẻ Lịch sử | Có giả định |
| Q-33 | Phạm vi xem yêu cầu của Manager, IT | Ma trận mục 2.5 | Mở |
| Q-37 | Khi nào phê duyệt không còn hiệu lực | SCR-ON-04 khung thu hồi | Mở |

Q-38, Q-39 và Q-40 phát sinh khi đặc tả màn hình và đã được thêm vào [Nhật ký câu hỏi mở](../01-discovery/open-questions-log.md).

## 11. Lịch sử thay đổi

| Phiên bản | Ngày | Nội dung |
| --- | --- | --- |
| 0.1 | 26/11/2026 | Bản đầu |
