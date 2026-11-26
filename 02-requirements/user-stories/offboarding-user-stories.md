# USER STORIES VÀ ACCEPTANCE CRITERIA – EMPLOYEE OFFBOARDING

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [Đặc tả Use Case Offboarding](../use-case-specifications/offboarding-use-cases.md), [BRD Offboarding](../brd/brd-offboarding.md), [Business Rules Catalog](../business-rules/business-rules-catalog.md)

---

## 1. Quy ước

Giống [User Stories Onboarding](onboarding-user-stories.md). Mã `US-OFF-xx.AC-n`.

**Dữ liệu ví dụ:**

| Người | Vai trò |
| --- | --- |
| Hoàng Văn Nam | Employee nghỉ việc, Kế toán tổng hợp, phòng Kế toán; ngày làm việc cuối cùng 15/12/2026 |
| Lê Thu Hà | HR Staff |
| Trần Thị Bình | Manager phòng Kế toán |
| Lê Minh Châu | Nhân viên nhận bàn giao |
| Phạm Quốc Dũng | IT Staff |
| Võ Thanh Hải | Security Approver |

| Đã cấp cho Nam qua ELAMS | Chi tiết |
| --- | --- |
| Quyền | Email công ty (Microsoft 365, `nam.hoang`); Phần mềm kế toán – mức Ghi (MISA); CRM nội bộ – mức Xem |
| Thiết bị | Laptop LT-2025-0188; Màn hình MN-2025-0042 |
| Cấp ngoài ELAMS | VPN (IT bổ sung khi thu hồi) |

## 2. Tổng hợp

| Mã | Story | Vai trò | UC | BREQ | Ưu tiên | Điểm |
| --- | --- | --- | --- | --- | --- | --- |
| US-OFF-01 | Tạo yêu cầu offboarding | HR | UC-OFF-01 | 01, 02 | Must | 5 |
| US-OFF-02 | Xử lý nghỉ đột xuất | HR | UC-OFF-01, 09 | 04 | Must | 3 |
| US-OFF-03 | Lập kế hoạch bàn giao | Manager | UC-OFF-03 | 03 | Must | 2 |
| US-OFF-04 | Cập nhật tiến độ bàn giao | Employee, Manager | UC-OFF-04 | 03 | Must | 3 |
| US-OFF-05 | Xác nhận bàn giao | Manager | UC-OFF-03 | 03 | Must | 2 |
| US-OFF-06 | Thu hồi quyền đúng thời điểm | IT | UC-OFF-05 | 04, 09 | Must | 5 |
| US-OFF-07 | Thu hồi quyền không có ngoại lệ | Security, IT | UC-OFF-05 | 02, 05 | Must | 3 |
| US-OFF-08 | Thu hồi thiết bị | IT | UC-OFF-06 | 06 | Must | 3 |
| US-OFF-09 | Thiếu thiết bị và duyệt ngoại lệ | IT, Manager | UC-OFF-06, 07 | 06, 09 | Must | 5 |
| US-OFF-10 | Xác nhận hoàn tất offboarding | HR | UC-OFF-08 | 07 | Must | 5 |
| US-OFF-11 | Đổi ngày nghỉ việc | HR | UC-OFF-09 | 10 | Should | 3 |
| US-OFF-12 | Theo dõi tiến độ offboarding | HR, Manager, IT | UC-OFF-02 | 08 | Must | 2 |
| US-OFF-13 | Nhận cảnh báo quá hạn | HR, IT, Security | UC-OFF-10 | 11 | Should | 3 |

Tổng: 13 story, 44 điểm (Must 38, Should 6), 48 AC.

---

## 3. Chi tiết

### US-OFF-01 – Tạo yêu cầu offboarding

**Là** nhân viên HR, **tôi muốn** tạo yêu cầu offboarding và để hệ thống tự lập danh sách cần thu hồi **để** không bỏ sót tài khoản hay thiết bị nào.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nam đang làm việc | Hà chọn Nam trên biểu mẫu | Thấy Manager Bình, 3 quyền và 2 thiết bị đã cấp cho Nam qua ELAMS | BR-OFF-02 |
| AC-2 | Biểu mẫu thiếu lý do nghỉ việc | Hà gửi yêu cầu | Yêu cầu không được tạo; trường lý do được chỉ ra | BR-OFF-01 |
| AC-3 | Biểu mẫu đủ thông tin, ngày làm việc cuối cùng 15/12/2026, không đột xuất | Hà gửi yêu cầu | Yêu cầu Đang xử lý; Bình nhận nhiệm vụ bàn giao; Dũng nhận nhiệm vụ thu hồi quyền và thu hồi thiết bị; mỗi nhiệm vụ có hạn; thời điểm thu hồi quyền là 18:00 15/12/2026 | BR-OFF-03, BR-GEN-01 |
| AC-4 | Nam đã có yêu cầu offboarding đang xử lý | Hà tạo yêu cầu mới cho Nam | Yêu cầu không được tạo; ELAMS hiển thị yêu cầu hiện có | – |
| AC-5 | Hôm nay là 16/12/2026 | Hà nhập ngày làm việc cuối cùng 15/12/2026 | ELAMS cảnh báo ngày đã qua và đề xuất đánh dấu nghỉ đột xuất | BR-OFF-03 |

### US-OFF-02 – Xử lý nghỉ đột xuất

**Là** nhân viên HR, **tôi muốn** đánh dấu nghỉ đột xuất **để** quyền được thu hồi ngay, không chờ đến ngày nghỉ việc.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Hà tạo yêu cầu cho Nam lúc 10:00 10/12/2026 | Hà chọn nghỉ đột xuất và gửi | Nhiệm vụ thu hồi quyền bắt đầu ngay, hạn 14:00 10/12/2026 | BR-OFF-03 |
| AC-2 | Yêu cầu đang chờ thu hồi lúc 18:00 15/12/2026 | Hà chuyển sang đột xuất lúc 10:00 10/12/2026 | Thu hồi bắt đầu ngay, hạn 14:00 10/12/2026; Dũng và Bình được thông báo | BR-OFF-04 |
| AC-3 | Như AC-2 | Hà chuyển sang đột xuất mà không nhập lý do | Thay đổi không được lưu | BR-GEN-02 |

### US-OFF-03 – Lập kế hoạch bàn giao

**Là** Manager, **tôi muốn** lập kế hoạch bàn giao trên ELAMS **để** biết rõ việc gì giao cho ai và trước ngày nào.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Bình có nhiệm vụ bàn giao của Nam | Bình lập 2 hạng mục "Sổ cái tháng 12" và "Hồ sơ thuế quý 4", người nhận Châu, hạn 15/12/2026 | Kế hoạch được lưu; Nam và Châu được thông báo | BR-GEN-01 |
| AC-2 | Như AC-1 | Bình lưu một hạng mục chưa có người nhận | Hạng mục không được lưu | – |

### US-OFF-04 – Cập nhật tiến độ bàn giao

**Là** nhân viên nghỉ việc, **tôi muốn** cập nhật tiến độ từng hạng mục bàn giao **để** Manager biết tôi đã bàn giao tới đâu.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nam có 2 hạng mục bàn giao | Nam đánh dấu "Sổ cái tháng 12" đã bàn giao | Bình thấy hạng mục đã bàn giao và thời điểm cập nhật | BR-GEN-03 |
| AC-2 | Nam đăng nhập | Nam mở ELAMS | Chỉ thấy nhiệm vụ bàn giao của mình; không thấy nhiệm vụ thu hồi quyền hay thiết bị | – (giả định Q-44) |
| AC-3 | Nam nghỉ đột xuất, tài khoản đã bị thu hồi | Bình cập nhật tiến độ thay | Tiến độ được lưu; lịch sử ghi Bình cập nhật thay Nam | BR-GEN-03 |

### US-OFF-05 – Xác nhận bàn giao

**Là** Manager, **tôi muốn** xác nhận bàn giao đầy đủ hoặc yêu cầu bổ sung **để** công việc không bị bỏ dở khi nhân viên rời đi.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Cả 2 hạng mục đã bàn giao | Bình xác nhận bàn giao đầy đủ | Nhánh bàn giao kết thúc; lịch sử ghi người xác nhận và thời điểm | BR-OFF-08 |
| AC-2 | "Hồ sơ thuế quý 4" còn thiếu chứng từ | Bình ghi hạng mục chưa đạt và lý do | Hạng mục quay lại đang bàn giao; Nam được thông báo kèm lý do | BR-GEN-02 |

### US-OFF-06 – Thu hồi quyền đúng thời điểm

**Là** nhân viên IT, **tôi muốn** nhận nhiệm vụ thu hồi đúng lúc và ghi kết quả từng tài khoản **để** không có tài khoản nào còn hoạt động sau khi nhân viên nghỉ.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Thời điểm thu hồi 18:00 15/12/2026 | Lúc 17:00 15/12/2026 | Nhiệm vụ thu hồi quyền ở trạng thái Chờ đến thời điểm thu hồi | BR-OFF-03 |
| AC-2 | Như AC-1 | Đến 18:00 15/12/2026 | Nhiệm vụ chuyển Đang thu hồi; Dũng được thông báo | BR-OFF-03 |
| AC-3 | Nhiệm vụ Đang thu hồi | Dũng vô hiệu hóa `nam.hoang` trên Microsoft 365 và ghi kết quả kèm bằng chứng | Mục Email công ty chuyển Đã vô hiệu hóa | BR-OFF-05, BR-GEN-03 |
| AC-4 | Như AC-3 | Dũng ghi kết quả không có bằng chứng | Kết quả không được lưu | BR-OFF-05 |
| AC-5 | Mọi mục đã thu hồi hoặc vô hiệu hóa | ELAMS đối chiếu | Nhánh thu hồi quyền kết thúc | BR-OFF-05 |

### US-OFF-07 – Thu hồi quyền không có ngoại lệ

**Là** Security Approver, **tôi muốn** mọi quyền phải được thu hồi, không có lối tắt đóng theo ngoại lệ **để** đạt KPI-04 = 100%.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Dũng chưa thu hồi được MISA vì hệ thống đang bảo trì | Dũng ghi "chưa thu hồi được" và lý do | Mục MISA giữ chưa xong; không có lựa chọn đóng theo ngoại lệ | BR-OFF-05 |
| AC-2 | Như AC-1 | ELAMS đối chiếu | Nhánh thu hồi quyền chưa kết thúc | BR-OFF-05 |
| AC-3 | Nam có VPN được cấp ngoài ELAMS | Dũng bổ sung VPN vào danh sách | VPN trở thành một mục thu hồi, phải xử lý như các mục khác | BR-OFF-02 |

### US-OFF-08 – Thu hồi thiết bị

**Là** nhân viên IT, **tôi muốn** ghi nhận thu hồi từng thiết bị theo mã tài sản **để** truy được thiết bị nào đã về kho.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nhiệm vụ thu hồi thiết bị của Nam | Dũng mở nhiệm vụ | Thấy LT-2025-0188 và MN-2025-0042 | BR-OFF-02 |
| AC-2 | Nam trả laptop | Dũng ghi thời điểm, tình trạng "Tốt" | LT-2025-0188 chuyển Đã thu hồi | BR-GEN-03 |
| AC-3 | Như AC-2 | Dũng ghi thu hồi mà không chọn tình trạng | Ghi nhận không được lưu | – |
| AC-4 | Cả hai thiết bị Đã thu hồi | – | Nhánh thu hồi thiết bị kết thúc | BR-OFF-08 |

### US-OFF-09 – Thiếu thiết bị và duyệt ngoại lệ

**Là** nhân viên IT và Manager, **tôi muốn** xử lý thiết bị còn thiếu có lý do và người duyệt **để** không đóng offboarding một cách mơ hồ.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nam chưa trả màn hình MN-2025-0042 đang để tại nhà | Dũng ghi thiếu thiết bị, lý do và biên bản ghi nhận thiếu | Thiết bị chuyển Thiếu – chờ quyết định; Bình nhận nhiệm vụ quyết định | BR-OFF-06 |
| AC-2 | Như AC-1 | Bình duyệt ngoại lệ với lý do | Thiết bị chuyển Ngoại lệ – chưa thu hồi; Hà được thông báo | BR-OFF-06, BR-GEN-02 |
| AC-3 | Như AC-1 | Bình duyệt ngoại lệ không nhập lý do | Quyết định không được lưu | BR-GEN-02 |
| AC-4 | Như AC-1 | Bình chọn tiếp tục thu hồi | Thiết bị quay lại Chờ thu hồi; Dũng tiếp tục xử lý | BR-OFF-06 |
| AC-5 | MN-2025-0042 đã duyệt ngoại lệ | Dũng mở danh sách thiết bị | MN-2025-0042 hiển thị nhãn "Ngoại lệ – chưa thu hồi" | BR-OFF-06 |

### US-OFF-10 – Xác nhận hoàn tất offboarding

**Là** nhân viên HR, **tôi muốn** chỉ đóng offboarding khi mọi điều kiện đã đạt **để** không có tài khoản hay thiết bị nào bị bỏ quên.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Mục MISA chưa thu hồi được; các nhánh khác đã xong | ELAMS kiểm tra điều kiện | Yêu cầu Chờ xử lý điều kiện còn thiếu; Hà thấy MISA và người đang giữ; không có nút xác nhận hoàn tất | BR-OFF-08 |
| AC-2 | Quyền đã thu hồi hết; bàn giao chưa được Bình xác nhận | ELAMS kiểm tra điều kiện | Yêu cầu chưa chuyển Chờ HR xác nhận | BR-OFF-08 |
| AC-3 | Quyền thu hồi hết, bàn giao xác nhận, laptop đã thu hồi, màn hình theo ngoại lệ | ELAMS kiểm tra điều kiện | Yêu cầu Chờ HR xác nhận; Hà thấy tóm tắt, gồm màn hình theo ngoại lệ và người duyệt | BR-OFF-08 |
| AC-4 | Như AC-3 | Hà xác nhận hoàn tất | Yêu cầu Hoàn tất; lịch sử ghi người xác nhận và thời điểm | BR-GEN-03 |
| AC-5 | Như AC-3 | Lỗi hệ thống khi ghi nhận | ELAMS không báo thành công; yêu cầu giữ Chờ HR xác nhận | – (BQ-OFF-01) |

### US-OFF-11 – Đổi ngày nghỉ việc (Should)

**Là** nhân viên HR, **tôi muốn** đổi ngày nghỉ việc một lần và để hệ thống tự tính lại **để** không phải báo lại từng bộ phận.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Ngày làm việc cuối cùng 15/12/2026; chưa nhánh nào xong | Hà đổi sang 22/12/2026 kèm lý do | Hạn bàn giao và thu hồi thiết bị thành 22/12/2026; thời điểm thu hồi quyền thành 18:00 22/12/2026 | BR-OFF-07 |
| AC-2 | Laptop đã thu hồi | Hà đổi ngày | Laptop giữ Đã thu hồi, không mở lại nhiệm vụ | BR-OFF-07 |
| AC-3 | Hôm nay 16/12/2026 | Hà đổi sang 14/12/2026 | Thay đổi không được lưu; ELAMS đề xuất chuyển sang đột xuất | – |
| AC-4 | Quyền đã thu hồi do nghỉ đột xuất | Hà đổi ngày nghỉ việc | Không quyền nào được cấp lại | BR-OFF-07 |

### US-OFF-12 – Theo dõi tiến độ offboarding

**Là** HR, Manager hoặc IT, **tôi muốn** xem tiến độ ba nhánh tại một nơi **để** biết còn việc gì và ai đang giữ.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu của Nam đang xử lý | Hà mở yêu cầu | Thấy ba nhánh bàn giao, thu hồi quyền, thu hồi thiết bị với từng mục chưa xong, người giữ, hạn, thời điểm thu hồi | BR-GEN-01 |
| AC-2 | Bình là Manager phòng Kế toán | Bình mở danh sách offboarding | Thấy yêu cầu của Nam; không thấy yêu cầu của phòng khác | – (giả định Q-33) |
| AC-3 | Một nhân viên IT không được giao nhiệm vụ nào của Nam | Người đó tìm yêu cầu của Nam | Không thấy | – |

### US-OFF-13 – Nhận cảnh báo quá hạn (Should)

**Là** người phụ trách, HR hoặc Security, **tôi muốn** được báo khi nhiệm vụ offboarding quá hạn **để** xử lý trước khi rủi ro xảy ra.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nhiệm vụ thu hồi thiết bị hạn 15/12/2026, chưa xong | Qua hạn | Nhiệm vụ đánh dấu Quá hạn; Dũng và Hà nhận cảnh báo | BR-GEN-01 |
| AC-2 | Mục MISA chưa thu hồi khi quá hạn thu hồi | Qua hạn | Dũng, Hà và Hải nhận cảnh báo | BR-OFF-05 |
| AC-3 | Đã cảnh báo nhiệm vụ trên | ELAMS kiểm tra lại, hạn không đổi | Không gửi cảnh báo lần hai | BR-GEN-01 |
| AC-4 | Nhiệm vụ đang Quá hạn | Hà đổi ngày nghỉ việc, hạn mới sau hôm nay | Dấu Quá hạn được gỡ | BR-GEN-01, BR-OFF-07 |

**Giả định:** hạn xử lý của từng nhiệm vụ thu hồi thường chờ Q-01; hạn thu hồi khẩn là 4 giờ (Q-26).

---

## 4. Độ phủ

| Quy tắc | Story kiểm chứng |
| --- | --- |
| BR-OFF-01 | US-OFF-01 |
| BR-OFF-02 | US-OFF-01, 07, 08 |
| BR-OFF-03 | US-OFF-01, 02, 06 |
| BR-OFF-04 | US-OFF-02 |
| BR-OFF-05 | US-OFF-06, 07, 13 |
| BR-OFF-06 | US-OFF-09 |
| BR-OFF-07 | US-OFF-11, 13 |
| BR-OFF-08 | US-OFF-05, 08, 10 |
| BR-GEN-01 | US-OFF-01, 03, 12, 13 |
| BR-GEN-02 | US-OFF-02, 05, 09 |
| BR-GEN-03 | US-OFF-04, 06, 08, 10 |

Mọi quy tắc BR-OFF đều có ít nhất một AC kiểm chứng.
