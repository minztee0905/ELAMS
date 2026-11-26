# ĐẶC TẢ USE CASE – EMPLOYEE OFFBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [BRD Offboarding](../brd/brd-offboarding.md), [Business Rules Catalog](../business-rules/business-rules-catalog.md), [BPMN To-Be Offboarding](../../process-models/to-be/offboarding/to-be-offboarding.bpmn)

---

## 1. Sơ đồ Use Case

Nguồn sơ đồ: [offboarding-use-case-diagram.drawio](offboarding-use-case-diagram.drawio).

| Actor | Use case |
| --- | --- |
| HR Staff | UC-OFF-01, 02, 08, 09, 10 |
| Department Manager | UC-OFF-02, 03, 04 (cập nhật thay), 07, 10 |
| Employee (người nghỉ việc) | UC-OFF-04 |
| IT Staff | UC-OFF-02, 05, 06, 10 |
| Security Approver | UC-OFF-10 |

Employee chỉ cập nhật tiến độ bàn giao; việc trả thiết bị diễn ra ngoài hệ thống và IT ghi nhận (Q-44). Xem lịch sử thao tác dùng chung chức năng UC-ON-09.

## 2. Danh sách Use Case

| Mã | Tên | Actor chính | Ưu tiên | BREQ | BPMN | Mức đặc tả |
| --- | --- | --- | --- | --- | --- | --- |
| UC-OFF-01 | Tạo yêu cầu offboarding | HR | Must | 01, 02 | H01, S01 | Đầy đủ |
| UC-OFF-02 | Theo dõi tiến độ offboarding | HR, Manager, IT | Must | 08 | Toàn quy trình | Tóm tắt |
| UC-OFF-03 | Lập kế hoạch và xác nhận bàn giao | Manager | Must | 03 | W01, W03, WG01 | Đầy đủ |
| UC-OFF-04 | Cập nhật tiến độ bàn giao | Employee, Manager | Must | 03 | W02 | Tóm tắt |
| UC-OFF-05 | Thu hồi quyền truy cập | IT | Must | 04, 05, 09 | Sub_Revoke | Đầy đủ |
| UC-OFF-06 | Thu hồi thiết bị | IT | Must | 06 | D02, DG01, D03 | Đầy đủ |
| UC-OFF-07 | Duyệt ngoại lệ thiết bị | Manager | Must | 06, 09 | D04, DG02 | Tóm tắt |
| UC-OFF-08 | Xác nhận hoàn tất offboarding | HR | Must | 07 | S02, G01, H02, H03 | Đầy đủ |
| UC-OFF-09 | Đổi ngày nghỉ việc hoặc chuyển sang đột xuất | HR | Must | 04, 10 | Sub_DateChange, V_Urgent | Đầy đủ |
| UC-OFF-10 | Nhận cảnh báo quá hạn | HR, Manager, IT, Security | Should | 11 | – | Tóm tắt |

UC-OFF-09 là Must vì gồm việc chuyển sang đột xuất (BR-OFF-04, Must); phần đổi ngày là Should (BR-OFF-07).

**Trạng thái yêu cầu offboarding:** Đang xử lý → Chờ xử lý điều kiện còn thiếu hoặc Chờ HR xác nhận → Hoàn tất (giống Onboarding).

**Trạng thái từng mục thu hồi quyền:** Chờ đến thời điểm thu hồi → Đang thu hồi → Đã thu hồi / Đã vô hiệu hóa, hoặc Chưa thu hồi được (IT tiếp tục xử lý).

**Trạng thái từng thiết bị:** Chờ thu hồi → Đã thu hồi, hoặc Thiếu – chờ quyết định → Ngoại lệ – chưa thu hồi.

---

## 3. Đặc tả đầy đủ

### 3.1. UC-OFF-01 – Tạo yêu cầu offboarding

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | HR Staff |
| Trigger | HR đã xác nhận thông tin nghỉ việc. |
| Tiền điều kiện | Nhân viên đang làm việc, chưa có yêu cầu offboarding đang xử lý. |
| Hậu điều kiện thành công | Yêu cầu ở trạng thái Đang xử lý; danh sách quyền, thiết bị cần thu hồi và nhiệm vụ bàn giao đã tạo, mỗi nhiệm vụ có người phụ trách và hạn. |
| Hậu điều kiện thất bại | Không có yêu cầu hay nhiệm vụ nào được tạo (trọn gói như UC-ON-01). |
| Quy tắc | BR-OFF-01, BR-OFF-02, BR-OFF-03, BR-GEN-01, BR-GEN-03 |

**Luồng chính:**

1. HR chọn tạo yêu cầu offboarding và chọn nhân viên.
2. ELAMS hiển thị phòng ban, Manager và danh sách quyền, thiết bị đã cấp cho nhân viên qua ELAMS.
3. HR nhập ngày làm việc cuối cùng, lý do nghỉ việc, chọn nghỉ đột xuất hay không.
4. HR gửi yêu cầu.
5. ELAMS kiểm tra trường bắt buộc.
6. ELAMS lưu yêu cầu và tạo nhiệm vụ: bàn giao cho Manager, thu hồi quyền và thu hồi thiết bị cho IT. Thời điểm thu hồi quyền là 18:00 ngày làm việc cuối cùng.
7. ELAMS hiển thị mã yêu cầu và các nhiệm vụ đã tạo. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Nghỉ đột xuất (bước 3):** thời điểm thu hồi là ngay khi tạo; hạn thu hồi là 4 giờ (BR-OFF-03).
- **AF-02 – Không có quyền hoặc thiết bị nào đã cấp qua ELAMS (bước 2):** ELAMS báo danh sách trống. Nhiệm vụ thu hồi vẫn được tạo để IT rà soát và bổ sung (Q-45).

**Luồng ngoại lệ:**

- **EF-01 – Thiếu trường bắt buộc (bước 5):** ELAMS chỉ ra trường lỗi; không tạo yêu cầu (BR-OFF-01).
- **EF-02 – Nhân viên đã có yêu cầu offboarding đang xử lý:** ELAMS hiển thị yêu cầu hiện có; không tạo yêu cầu thứ hai.
- **EF-03 – Ngày làm việc cuối cùng đã qua:** ELAMS cảnh báo và đề xuất đánh dấu nghỉ đột xuất; HR quyết định.

### 3.2. UC-OFF-03 – Lập kế hoạch và xác nhận bàn giao

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | Department Manager |
| Trigger | Nhiệm vụ bàn giao được tạo ở UC-OFF-01. |
| Hậu điều kiện thành công | Bàn giao được Manager xác nhận đầy đủ; nhánh bàn giao kết thúc. |
| Quy tắc | BR-OFF-08, BR-GEN-03 |

**Luồng chính:**

1. Manager mở nhiệm vụ bàn giao.
2. Manager lập kế hoạch: từng hạng mục công việc, người nhận bàn giao, hạn (W01).
3. ELAMS thông báo nhân viên nghỉ việc và người nhận bàn giao.
4. Nhân viên cập nhật tiến độ từng hạng mục (UC-OFF-04).
5. Manager kiểm tra kết quả và xác nhận bàn giao đầy đủ (W03). Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Bàn giao chưa đầy đủ (bước 5):** Manager ghi hạng mục còn thiếu và lý do; hạng mục quay lại trạng thái đang bàn giao (WG01 → W02).
- **AF-02 – Nhân viên không thể cập nhật (bước 4):** nghỉ đột xuất hoặc tài khoản đã bị thu hồi; Manager cập nhật thay (Q-44).

### 3.3. UC-OFF-05 – Thu hồi quyền truy cập

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | IT Staff |
| Trigger | Đến thời điểm thu hồi (18:00 ngày làm việc cuối cùng) hoặc yêu cầu được chuyển sang đột xuất. |
| Tiền điều kiện | Danh sách quyền cần thu hồi đã được lập (UC-OFF-01). |
| Hậu điều kiện thành công | Mọi mục ở trạng thái Đã thu hồi hoặc Đã vô hiệu hóa, có bằng chứng; nhánh thu hồi quyền kết thúc. |
| Quy tắc | BR-OFF-03, BR-OFF-04, BR-OFF-05, BR-GEN-03 |

**Luồng chính:**

1. Đến thời điểm thu hồi, ELAMS chuyển nhiệm vụ sang Đang thu hồi và thông báo IT.
2. IT mở nhiệm vụ; ELAMS hiển thị từng quyền, hệ thống đích, tài khoản và hạn.
3. Với từng mục, IT thu hồi hoặc vô hiệu hóa tài khoản trên hệ thống đích và ghi kết quả kèm bằng chứng (V01).
4. ELAMS đối chiếu kết quả với danh sách (V02).
5. Mọi mục đã thu hồi hoặc vô hiệu hóa: nhánh thu hồi quyền kết thúc. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Chuyển sang đột xuất trước thời điểm thu hồi (bước 1):** nhiệm vụ bắt đầu ngay, hạn 4 giờ (BR-OFF-04, UC-OFF-09).
- **AF-02 – IT bổ sung quyền cấp ngoài ELAMS (bước 2):** IT thêm mục vào danh sách với quyền, hệ thống, tài khoản; mục được xử lý như các mục khác (Q-45).

**Luồng ngoại lệ:**

- **EF-01 – Chưa thu hồi được một tài khoản (bước 3):** IT ghi kết quả "chưa thu hồi được" và lý do. Mục giữ trạng thái chưa xong, IT tiếp tục xử lý (V03). Không có lựa chọn đóng theo ngoại lệ (BR-OFF-05).
- **EF-02 – Quá hạn thu hồi:** ELAMS cảnh báo IT, HR và Security (UC-OFF-10).

### 3.4. UC-OFF-06 – Thu hồi thiết bị

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | IT Staff |
| Bên liên quan ngoài hệ thống | Employee trả thiết bị |
| Trigger | Nhiệm vụ thu hồi thiết bị được tạo ở UC-OFF-01. |
| Hậu điều kiện thành công | Mọi thiết bị ở trạng thái Đã thu hồi hoặc Ngoại lệ – chưa thu hồi (đã được duyệt). |
| Quy tắc | BR-OFF-02, BR-OFF-06, BR-GEN-03 |

**Luồng chính:**

1. IT mở nhiệm vụ; ELAMS hiển thị thiết bị đã cấp cho nhân viên theo mã tài sản.
2. Nhân viên trả thiết bị; IT kiểm tra tình trạng.
3. IT ghi nhận thu hồi từng thiết bị: thời điểm, tình trạng, ghi chú (D02).
4. Đủ mọi thiết bị: nhánh thu hồi thiết bị kết thúc. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Thiếu thiết bị (bước 4):** IT ghi thiết bị còn thiếu, lý do và bằng chứng (D03). Thiết bị chuyển Thiếu – chờ quyết định; Manager nhận nhiệm vụ quyết định (UC-OFF-07).
- **AF-02 – Manager quyết định tiếp tục thu hồi:** thiết bị quay lại Chờ thu hồi; IT tiếp tục từ bước 2.

**Luồng ngoại lệ:**

- **EF-01 – Thiếu thông tin ghi nhận (bước 3):** ELAMS chỉ ra thông tin còn thiếu; thiết bị chưa chuyển Đã thu hồi.

### 3.5. UC-OFF-08 – Xác nhận hoàn tất offboarding

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | HR Staff |
| Trigger | Ba nhánh bàn giao, thu hồi quyền, thu hồi thiết bị đều kết thúc, hoặc có dữ liệu mới khi yêu cầu đang chờ. |
| Hậu điều kiện thành công | Yêu cầu ở trạng thái Hoàn tất; lịch sử ghi người xác nhận và thời điểm. |
| Quy tắc | BR-OFF-08, BR-GEN-03 |

**Luồng chính:**

1. ELAMS kiểm tra điều kiện theo dữ liệu mới nhất: mọi quyền đã thu hồi hoặc vô hiệu hóa; Manager đã xác nhận bàn giao; mọi thiết bị đã thu hồi hoặc có ngoại lệ đã duyệt (S02).
2. Đủ điều kiện: yêu cầu chuyển Chờ HR xác nhận; HR nhận nhiệm vụ.
3. HR xem tóm tắt: quyền đã thu hồi, bàn giao, thiết bị (kể cả thiết bị theo ngoại lệ).
4. HR xác nhận hoàn tất.
5. ELAMS chuyển yêu cầu sang Hoàn tất. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Chưa đủ điều kiện (bước 2):** yêu cầu chuyển Chờ xử lý điều kiện còn thiếu; ELAMS hiển thị điều kiện chưa đạt và người đang giữ. HR phối hợp xử lý (H02). Kiểm tra lại khi có dữ liệu mới.

**Luồng ngoại lệ:**

- **EF-01 – Điều kiện thay đổi hoặc lỗi hệ thống khi ghi nhận (bước 5):** ELAMS không đóng và không báo thành công; trạng thái quay về hoặc giữ nguyên trạng thái chờ (BQ-OFF-01).

### 3.6. UC-OFF-09 – Đổi ngày nghỉ việc hoặc chuyển sang đột xuất

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | HR Staff |
| Trigger | HR nhận thông tin thay đổi ngày nghỉ việc, hoặc nhân viên phải nghỉ ngay. |
| Tiền điều kiện | Yêu cầu chưa Hoàn tất. |
| Hậu điều kiện thành công | Hạn nhiệm vụ chưa xong và thời điểm thu hồi được tính lại; các nhánh đang chạy không bị dừng. |
| Quy tắc | BR-OFF-04, BR-OFF-07, BR-GEN-03 |

**Luồng chính (đổi ngày):**

1. HR chọn đổi ngày nghỉ việc, nhập ngày mới và lý do (C01).
2. ELAMS hiển thị nhiệm vụ chưa xong bị ảnh hưởng: hạn cũ và hạn mới.
3. HR xác nhận.
4. ELAMS cập nhật hạn bàn giao, hạn thu hồi thiết bị bằng ngày mới và thời điểm thu hồi quyền là 18:00 ngày mới (C02). Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Chuyển sang đột xuất:** HR chọn chuyển sang đột xuất và nhập lý do. ELAMS bắt đầu thu hồi quyền ngay, hạn 4 giờ (V_Urgent); thông báo IT và Manager.

**Luồng ngoại lệ:**

- **EF-01 – Quyền đã thu hồi:** quyền đã thu hồi không được cấp lại vì đổi ngày; nhiệm vụ đã xong không mở lại (BR-OFF-07).
- **EF-02 – Ngày mới không hợp lệ:** ngày mới trùng ngày hiện hành hoặc đã qua; ELAMS không lưu và đề xuất chuyển đột xuất nếu ngày đã qua.

---

## 4. Đặc tả tóm tắt

| Mã | Mô tả | Luồng chính | Ngoại lệ chính | Quy tắc |
| --- | --- | --- | --- | --- |
| UC-OFF-02 – Theo dõi tiến độ | HR, Manager, IT xem trạng thái yêu cầu và ba nhánh trong phạm vi vai trò. | Chọn yêu cầu → xem từng nhánh, mục chưa xong, người giữ, hạn, thời điểm thu hồi. | Người dùng không thấy yêu cầu ngoài phạm vi (Q-33). | BR-GEN-01 |
| UC-OFF-04 – Cập nhật tiến độ bàn giao | Nhân viên nghỉ việc cập nhật tiến độ từng hạng mục bàn giao. | Mở nhiệm vụ → cập nhật trạng thái, ghi chú từng hạng mục → gửi cho Manager kiểm tra. | Nghỉ đột xuất hoặc tài khoản đã bị thu hồi: Manager cập nhật thay (Q-44). | BR-GEN-03 |
| UC-OFF-07 – Duyệt ngoại lệ thiết bị | Manager quyết định với thiết bị còn thiếu. | Xem lý do, bằng chứng của IT → Duyệt ngoại lệ (nhập lý do) → thiết bị chuyển Ngoại lệ – chưa thu hồi; HR được thông báo. | Thiếu lý do: không lưu quyết định (BR-GEN-02). Chọn tiếp tục thu hồi: thiết bị quay lại Chờ thu hồi. | BR-OFF-06, BR-GEN-02 |
| UC-OFF-10 – Nhận cảnh báo quá hạn | ELAMS cảnh báo nhiệm vụ quá hạn. | Điều kiện như UC-ON-10 → đánh dấu Quá hạn, thông báo người phụ trách và HR. Thu hồi quyền quá hạn thì thông báo thêm Security. | Escalation chờ Q-05. | BR-GEN-01, BR-OFF-05 |
