# ĐẶC TẢ USE CASE – ACCESS REQUEST & APPROVAL

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [BRD Access Request](../brd/brd-access-request.md), [Business Rules Catalog](../business-rules/business-rules-catalog.md), [BPMN To-Be Access Request](../../03-process-models/to-be/access-request/to-be-access-request-approval.bpmn)

---

## 1. Sơ đồ Use Case

Nguồn sơ đồ: [access-request-use-case-diagram.drawio](access-request-use-case-diagram.drawio).

| Actor | Use case |
| --- | --- |
| Employee (người yêu cầu) | UC-AC-01, 02, 03 |
| Department Manager | UC-AC-03, 04, 07 |
| Security Approver | UC-AC-05, 07 |
| IT Staff | UC-AC-06, 07 |

Manager cũng là nhân viên nên dùng được UC-AC-01 đến 03 cho yêu cầu của chính mình. Khi đó cấp trên trực tiếp của Manager là người duyệt ở UC-AC-04 (BR-AC-06, giả định Q-35).

Xem lịch sử thao tác dùng chung chức năng của Onboarding (UC-ON-09); sẽ gộp thành use case dùng chung trong SRS.

## 2. Danh sách Use Case

| Mã | Tên | Actor chính | Ưu tiên | BREQ | BPMN | Mức đặc tả |
| --- | --- | --- | --- | --- | --- | --- |
| UC-AC-01 | Gửi yêu cầu cấp quyền | Employee | Must | 01 | R01 | Đầy đủ |
| UC-AC-02 | Bổ sung thông tin hoặc hủy yêu cầu | Employee | Must | 03 | R02, RG01, E_Cancel | Đầy đủ |
| UC-AC-03 | Theo dõi yêu cầu | Employee, Manager | Must | 07 | Toàn quy trình | Tóm tắt |
| UC-AC-04 | Xét duyệt yêu cầu cấp quyền | Manager | Must | 02, 04, 08 | M01, MG01, S01, SG01 | Đầy đủ |
| UC-AC-05 | Xét duyệt quyền nhạy cảm | Security | Must | 04, 08 | SE01, SG02 | Tóm tắt |
| UC-AC-06 | Cấp quyền và ghi kết quả | IT | Must | 05, 06 | I01, IG01, I02, S02 | Đầy đủ |
| UC-AC-07 | Nhận cảnh báo quá hạn | Manager, Security, IT | Should | 09 | – | Tóm tắt |

**Trạng thái yêu cầu:** Chờ Manager duyệt → (Chờ bổ sung) → (Chờ Security duyệt) → Chờ cấp quyền → Đã cấp. Kết thúc khác: Bị từ chối, Đã hủy. Chi tiết tại [design decisions](../design-decisions/access-request-to-be-design-decisions.md), mục 3.

---

## 3. Đặc tả đầy đủ

### 3.1. UC-AC-01 – Gửi yêu cầu cấp quyền

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | Employee |
| Trigger | Nhân viên cần quyền truy cập một hệ thống để làm việc. |
| Tiền điều kiện | Nhân viên đã đăng nhập. Danh mục quyền đã được cấu hình. |
| Hậu điều kiện thành công | Yêu cầu ở trạng thái Chờ Manager duyệt; người duyệt nhận nhiệm vụ có hạn xử lý; lịch sử ghi thao tác tạo. |
| Hậu điều kiện thất bại | Không có yêu cầu nào được tạo; dữ liệu đã nhập còn trên biểu mẫu. |
| Quy tắc | BR-AC-01, BR-AC-06, BR-AC-07, BR-GEN-01, BR-GEN-03 |

**Luồng chính:**

1. Nhân viên chọn tạo yêu cầu cấp quyền.
2. ELAMS hiển thị biểu mẫu, tự điền họ tên, phòng ban và Manager trực tiếp của nhân viên.
3. Nhân viên chọn quyền từ danh mục. ELAMS hiển thị hệ thống đích, mức nhạy cảm và cấp phê duyệt dự kiến.
4. Nhân viên chọn mức quyền, nhập lý do sử dụng; có thể nhập ngày cần có quyền và đính kèm tệp.
5. Nhân viên gửi yêu cầu.
6. ELAMS kiểm tra trường bắt buộc và yêu cầu trùng.
7. ELAMS lưu yêu cầu, xác định người duyệt và tạo nhiệm vụ xét duyệt.
8. ELAMS hiển thị mã yêu cầu và trạng thái Chờ Manager duyệt. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Người yêu cầu là Manager (bước 7):** người duyệt là cấp trên trực tiếp của Manager (BR-AC-06).
- **AF-02 – Nhân viên đã có quyền này (bước 6):** ELAMS cảnh báo nhân viên đã có quyền và hiển thị mức hiện tại. Nhân viên xác nhận gửi tiếp (ví dụ xin mức quyền khác) hoặc quay lại sửa (BR-AC-07).

**Luồng ngoại lệ:**

- **EF-01 – Thiếu trường bắt buộc (bước 6):** ELAMS chỉ ra từng trường lỗi; không tạo yêu cầu (BR-AC-01).
- **EF-02 – Đang có yêu cầu chưa kết thúc cho cùng quyền (bước 6):** ELAMS không tạo yêu cầu và hiển thị mã yêu cầu hiện có (BR-AC-07).
- **EF-03 – Không xác định được người duyệt (bước 7):** nhân viên chưa có Manager trong cơ cấu tổ chức. ELAMS không tạo yêu cầu và báo nhân viên liên hệ HR.

### 3.2. UC-AC-02 – Bổ sung thông tin hoặc hủy yêu cầu

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | Employee |
| Trigger | Manager yêu cầu bổ sung thông tin (UC-AC-04 AF-02). |
| Tiền điều kiện | Yêu cầu ở trạng thái Chờ bổ sung; người dùng là người yêu cầu. |
| Hậu điều kiện thành công | Gửi lại: yêu cầu quay về Chờ Manager duyệt, giữ nguyên mã và lịch sử. Hủy: yêu cầu ở trạng thái Đã hủy. |
| Quy tắc | BR-AC-01, BR-AC-02, BR-GEN-03 |

**Luồng chính:**

1. Nhân viên mở yêu cầu đang Chờ bổ sung.
2. ELAMS hiển thị nội dung yêu cầu và lý do Manager yêu cầu bổ sung.
3. Nhân viên sửa mức quyền, lý do sử dụng hoặc tệp đính kèm. Quyền đã chọn không đổi được; muốn quyền khác thì hủy và gửi yêu cầu mới.
4. Nhân viên gửi lại.
5. ELAMS kiểm tra trường bắt buộc, chuyển yêu cầu về Chờ Manager duyệt và tạo lại nhiệm vụ xét duyệt cho người duyệt. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Hủy yêu cầu (bước 3):** nhân viên chọn hủy và xác nhận. ELAMS chuyển yêu cầu sang Đã hủy và thông báo Manager.

**Luồng ngoại lệ:**

- **EF-01 – Thiếu trường bắt buộc (bước 5):** ELAMS chỉ ra trường lỗi; yêu cầu giữ Chờ bổ sung.

Yêu cầu Chờ bổ sung không tự hủy theo thời gian (BR-AC-02, Q-12).

### 3.3. UC-AC-04 – Xét duyệt yêu cầu cấp quyền

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | Department Manager (người duyệt được xác định ở UC-AC-01) |
| Trigger | Có yêu cầu ở trạng thái Chờ Manager duyệt giao cho Manager. |
| Tiền điều kiện | Người duyệt không phải người yêu cầu (BR-AC-06). |
| Hậu điều kiện thành công | Quyết định được lưu với người, kết quả, lý do (nếu có) và thời điểm; yêu cầu chuyển sang trạng thái tương ứng. |
| Quy tắc | BR-AC-02, BR-AC-03, BR-AC-04, BR-AC-06, BR-GEN-02, BR-GEN-03 |

**Luồng chính:**

1. Manager mở yêu cầu trong Approval Inbox.
2. ELAMS hiển thị người yêu cầu, quyền, hệ thống đích, mức quyền, lý do sử dụng, mức nhạy cảm, cấp phê duyệt dự kiến và quyền hiện có của người yêu cầu trên hệ thống đó.
3. Manager chọn Phê duyệt.
4. ELAMS xác định cấp phê duyệt theo danh mục quyền (S01).
5. Quyền không nhạy cảm: ELAMS chuyển yêu cầu sang Chờ cấp quyền và tạo nhiệm vụ cấp quyền cho IT (UC-AC-06). Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Quyền nhạy cảm (bước 5):** ELAMS chuyển yêu cầu sang Chờ Security duyệt và tạo nhiệm vụ cho Security (UC-AC-05).
- **AF-02 – Yêu cầu bổ sung (bước 3):** Manager nhập nội dung cần bổ sung. ELAMS chuyển yêu cầu sang Chờ bổ sung và thông báo người yêu cầu (UC-AC-02).
- **AF-03 – Từ chối (bước 3):** Manager nhập lý do. ELAMS chuyển yêu cầu sang Bị từ chối và thông báo người yêu cầu kèm lý do.

**Luồng ngoại lệ:**

- **EF-01 – Thiếu lý do khi từ chối hoặc yêu cầu bổ sung:** ELAMS không lưu quyết định (BR-GEN-02).

### 3.4. UC-AC-06 – Cấp quyền và ghi kết quả

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | IT Staff |
| Trigger | Yêu cầu đã đủ mọi phê duyệt bắt buộc. |
| Tiền điều kiện | Nhiệm vụ cấp quyền chỉ tồn tại khi đủ phê duyệt (BR-AC-04). |
| Hậu điều kiện thành công | Yêu cầu ở trạng thái Đã cấp với tài khoản đã dùng và bằng chứng; người yêu cầu được thông báo. |
| Quy tắc | BR-AC-04, BR-AC-05, BR-ON-10, BR-GEN-03 |

**Luồng chính:**

1. IT mở nhiệm vụ cấp quyền.
2. ELAMS hiển thị quyền, hệ thống đích, mức quyền, các phê duyệt đã có và tài khoản đã ghi nhận của người yêu cầu trên hệ thống đó (nếu có).
3. IT kiểm tra tài khoản trên hệ thống đích: đã có thì dùng lại; chưa có thì tạo mới và nhập định danh tài khoản.
4. IT cấp quyền và ghi kết quả thành công kèm bằng chứng.
5. ELAMS chuyển yêu cầu sang Đã cấp và thông báo người yêu cầu (S02). Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Đã có tài khoản được ghi nhận (bước 2):** ELAMS hiển thị tài khoản đó; IT dùng lại, không tạo mới (BR-ON-10).

**Luồng ngoại lệ:**

- **EF-01 – Không xác định được tài khoản đã tồn tại hay chưa (bước 3):** IT không tạo mới; ghi kết quả "chưa xác định" kèm lý do. Yêu cầu giữ Chờ cấp quyền.
- **EF-02 – Cấp quyền thất bại (bước 4):** IT ghi kết quả thất bại và lý do. Yêu cầu giữ Chờ cấp quyền (BR-AC-05); sau khi khắc phục, IT quay lại bước 3 (I02).

---

## 4. Đặc tả tóm tắt

| Mã | Mô tả | Luồng chính | Ngoại lệ chính | Quy tắc |
| --- | --- | --- | --- | --- |
| UC-AC-03 – Theo dõi yêu cầu | Nhân viên xem yêu cầu của mình; Manager xem yêu cầu của nhân viên mình quản lý. | Chọn yêu cầu → xem trạng thái, người đang giữ, hạn, các quyết định và lý do. ELAMS thông báo người yêu cầu khi yêu cầu chuyển Chờ bổ sung, Đã cấp hoặc Bị từ chối. | Người dùng không thấy yêu cầu ngoài phạm vi (Q-33). | BR-GEN-01, BR-GEN-02 |
| UC-AC-05 – Xét duyệt quyền nhạy cảm | Security xét duyệt yêu cầu đã được Manager phê duyệt và được danh mục đánh dấu nhạy cảm. | Mở nhiệm vụ → xem quyết định của Manager → Phê duyệt → yêu cầu chuyển Chờ cấp quyền, IT nhận nhiệm vụ. | Từ chối phải có lý do: yêu cầu chuyển Bị từ chối, người yêu cầu được thông báo. Security không yêu cầu bổ sung (Q-36). | BR-AC-03, BR-AC-04, BR-GEN-02 |
| UC-AC-07 – Nhận cảnh báo quá hạn | ELAMS cảnh báo người đang giữ nhiệm vụ xét duyệt hoặc cấp quyền khi quá hạn. | Điều kiện kích hoạt như UC-ON-10: quá hạn hiện hành, nhiệm vụ chưa kết thúc, chưa cảnh báo cho hạn này → đánh dấu Quá hạn, thông báo người phụ trách. | Yêu cầu Chờ bổ sung không có hạn nên không cảnh báo; danh sách hiển thị số ngày chờ. Escalation chờ Q-05. | BR-GEN-01 |
