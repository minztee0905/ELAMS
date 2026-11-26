# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD) – EMPLOYEE OFFBOARDING

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phạm vi tài liệu:** Quy trình xử lý nhân viên nghỉ việc

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

---

## 1. Tóm tắt

Khi nhân viên nghỉ việc, HR hiện báo cho Manager và IT qua email. IT tự xác định tài khoản cần thu hồi, thiết bị được theo dõi riêng lẻ, và HR phải đối chiếu email, Excel, biên bản để xác nhận hoàn tất. Rủi ro lớn nhất là tài khoản của người đã nghỉ vẫn còn hoạt động, nhất là khi nghỉ đột xuất.

ELAMS giải quyết bằng một quy trình offboarding tập trung: HR tạo yêu cầu, hệ thống lập danh sách quyền và thiết bị cần thu hồi từ lịch sử cấp phát, ba nhánh bàn giao công việc, thu hồi quyền và thu hồi thiết bị chạy song song, quyền được thu hồi đúng thời điểm và không có ngoại lệ, và yêu cầu chỉ đóng khi mọi điều kiện đã đạt.

Tài liệu gồm 11 yêu cầu nghiệp vụ (9 Must, 2 Should), liên kết tới 5 mục tiêu nghiệp vụ, 8 Gap và 11 quy tắc trong [Business Rules Catalog](../business-rules/business-rules-catalog.md).

## 2. Bối cảnh và vấn đề nghiệp vụ

### 2.1. Hiện trạng

Quy trình hiện tại (AS-03) được mô tả tại [As-Is Process Analysis](../../03-process-models/as-is-process-analysis.md), mục 5 và [BPMN As-Is Offboarding](../../03-process-models/as-is/offboarding/as-is-offboarding.bpmn). Tóm tắt: HR ghi Excel và email cho Manager, IT; Manager tổ chức bàn giao; IT tự xác định tài khoản và thiết bị cần thu hồi; HR đối chiếu nhiều nguồn để xác nhận hoàn tất.

### 2.2. Vấn đề

| ID | Vấn đề | Tác động | Bên chịu ảnh hưởng |
| --- | --- | --- | --- |
| PP-11 | Thông tin nghỉ việc gửi thủ công | Thông báo chậm, thu hồi chậm | HR, IT |
| PP-12 | Không có danh sách nhiệm vụ thu hồi tập trung | Bỏ sót tài khoản | IT, Security |
| PP-13 | Khó xác minh trạng thái thiết bị | Thất lạc thiết bị | IT, HR |
| PP-14 | Thiếu giám sát nhiệm vụ quá hạn | Thu hồi quyền chậm | HR, Security |
| PP-15 | HR phải đối chiếu nhiều nguồn | Khó xác nhận hoàn tất | HR |

Nguồn: [As-Is Process Analysis](../../03-process-models/as-is-process-analysis.md), mục 5.5.

## 3. Mục tiêu nghiệp vụ và chỉ số đo lường

| Mục tiêu | Nội dung (tóm tắt) | KPI | Mục tiêu đề xuất |
| --- | --- | --- | --- |
| BG-01 | Chuẩn hóa quy trình | KPI-02: tỷ lệ nhiệm vụ offboarding hoàn thành đúng SLA | ≥ 98% |
| BG-02 | Nâng cao hiệu quả xử lý | KPI-02 | ≥ 98% |
| BG-03 | Tăng cường kiểm soát quyền truy cập | KPI-04: tỷ lệ nhiệm vụ thu hồi quyền hoàn thành đúng hạn | 100% |
| BG-04 | Quản lý thiết bị CNTT | KPI-05: tỷ lệ thiết bị được ghi nhận bàn giao hoặc thu hồi đầy đủ | ≥ 98% |
| BG-05 | Minh bạch và giám sát | KPI-06: tỷ lệ quyết định có lịch sử truy vết | 100% |

Định nghĩa KPI: [Business Goals, KPIs & Scope](../../01-discovery/business-goals-kpis-and-scope.md), mục 4.

## 4. Phạm vi

### 4.1. Trong phạm vi

| Chức năng | Mô tả | Ưu tiên |
| --- | --- | --- |
| F-03 | Tạo yêu cầu offboarding | Must |
| F-04 | Theo dõi offboarding | Must |
| F-05 | Thu hồi quyền (trong offboarding) | Must |
| F-07 | Phân công và cập nhật nhiệm vụ | Must |
| F-08 | Kiểm tra điều kiện hoàn tất quy trình | Must |
| F-09 | Ghi nhận thu hồi thiết bị | Must |
| F-10 | Phân quyền theo vai trò | Must |
| F-11 | Ghi lịch sử thao tác quan trọng | Must |
| F-13 | Thông báo và cảnh báo quá hạn | Should |

### 4.2. Ngoài phạm vi

- Hủy offboarding khi nhân viên rút đơn nghỉ việc (Q-46).
- Bồi hoàn thiết bị và theo dõi sau ngoại lệ ngoài việc gắn nhãn (Q-34).
- Thanh toán lương, bảo hiểm, thủ tục hợp đồng (Charter, mục 4.2).
- Tích hợp thật với hệ thống đích; IT thu hồi trên hệ thống đích và ghi kết quả vào ELAMS (mô phỏng).

### 4.3. Phụ thuộc

- Lịch sử cấp quyền từ Onboarding và Access Request; lịch sử cấp thiết bị từ Onboarding (BR-OFF-02).
- Danh sách tài sản thiết bị theo mã (Q-28).

## 5. Các bên liên quan

| Bên liên quan | Vai trò trong Offboarding To-Be | Nhu cầu chính |
| --- | --- | --- |
| HR Staff | Tạo yêu cầu, theo dõi, đổi ngày hoặc chuyển đột xuất, xác nhận hoàn tất | Biết chắc mọi quyền và thiết bị đã thu hồi trước khi đóng |
| Department Manager | Lập kế hoạch và xác nhận bàn giao; duyệt ngoại lệ thiết bị | Công việc không bị gián đoạn khi nhân viên rời đi |
| Employee (người nghỉ việc) | Cập nhật tiến độ bàn giao công việc; trả thiết bị (ngoài hệ thống) | Biết cần bàn giao gì, cho ai, trước ngày nào |
| IT Staff | Thu hồi quyền, thu hồi thiết bị | Danh sách đầy đủ, biết rõ thời điểm phải thu hồi |
| Security Approver | Nhận cảnh báo khi thu hồi quyền quá hạn; xem lịch sử | Không còn tài khoản hoạt động của người đã nghỉ |

**RACI:**

| Hoạt động | HR | Manager | Employee | IT | Security |
| --- | --- | --- | --- | --- | --- |
| Tạo yêu cầu offboarding | A/R | I | I | I | – |
| Bàn giao công việc | I | A | R | – | – |
| Thu hồi quyền | I | – | – | A/R | I |
| Thu hồi thiết bị | I | C | R (trả thiết bị) | A/R | – |
| Duyệt ngoại lệ thiết bị | I | A/R | – | C | – |
| Xác nhận hoàn tất | A/R | I | – | I | – |

## 6. Quy trình To-Be

Sơ đồ: [to-be-offboarding.bpmn](../../03-process-models/to-be/offboarding/to-be-offboarding.bpmn). Giải thích thiết kế: [Offboarding design decisions](../design-decisions/offboarding-to-be-design-decisions.md).

**Luồng chính:**

1. HR tạo yêu cầu offboarding (H01). ELAMS lập danh sách quyền, thiết bị đã cấp và tạo nhiệm vụ (S01).
2. Ba nhánh song song:
   - **Bàn giao công việc** (Sub_Handover): Manager lập kế hoạch → nhân viên bàn giao và cập nhật tiến độ → Manager kiểm tra và xác nhận.
   - **Thu hồi quyền** (Sub_Revoke): chờ tới 18:00 ngày nghỉ việc, hoặc bắt đầu ngay nếu yêu cầu chuyển sang đột xuất → IT thu hồi từng tài khoản → ELAMS đối chiếu với danh sách; còn thiếu thì IT tiếp tục xử lý.
   - **Thu hồi thiết bị** (Sub_Devices): IT kiểm tra và ghi nhận thiết bị trả về; còn thiếu thì IT ghi lý do, bằng chứng và Manager quyết định tiếp tục thu hồi hoặc duyệt ngoại lệ.
3. ELAMS kiểm tra điều kiện hoàn tất (S02). Chưa đủ thì HR phối hợp xử lý (H02).
4. HR rà soát và xác nhận hoàn tất (H03).

**Song song:** đổi ngày nghỉ việc (Sub_DateChange) tính lại hạn và thời điểm thu hồi mà không dừng các nhánh đang chạy.

**Thay đổi so với hiện trạng:**

| Hiện trạng | To-Be | Gap |
| --- | --- | --- |
| HR ghi Excel và gửi email | Yêu cầu offboarding trên ELAMS | GAP-OFF-01 |
| IT tự xác định tài khoản cần thu hồi | Danh sách lập từ lịch sử cấp quyền, ELAMS đối chiếu kết quả | GAP-OFF-02 |
| Thiết bị theo dõi riêng lẻ | Đối chiếu với thiết bị đã cấp | GAP-OFF-03 |
| HR đối chiếu nhiều nguồn | ELAMS kiểm tra điều kiện trước khi HR xác nhận | GAP-OFF-04 |
| Ngoại lệ trao đổi thủ công | Lý do, bằng chứng, Manager duyệt | GAP-OFF-05 |
| Đổi ngày qua email | Tính lại hạn và thời điểm thu hồi | GAP-OFF-06 |
| Nghỉ đột xuất báo qua email | Đánh dấu đột xuất, thu hồi ngay | GAP-OFF-07 |
| Không biết nhiệm vụ nào quá hạn | Hạn và cảnh báo quá hạn | GAP-OFF-08 |

## 7. Yêu cầu nghiệp vụ

| Mã | Yêu cầu | Bên yêu cầu | Nguồn | Quy tắc | Ưu tiên | Tiêu chí kiểm chứng (mức nghiệp vụ) |
| --- | --- | --- | --- | --- | --- | --- |
| BREQ-OFF-01 | HR tạo được yêu cầu offboarding đủ thông tin, gồm việc nghỉ có đột xuất hay không. | HR, IT | F-03, PP-11, GAP-OFF-01 | BR-OFF-01 | Must | Không còn thông báo nghỉ việc qua email; mọi yêu cầu có nhân viên, ngày nghỉ việc, lý do, cờ đột xuất. |
| BREQ-OFF-02 | Danh sách quyền và thiết bị cần thu hồi được lập tự động từ lịch sử cấp phát; mỗi mục có nhiệm vụ, người phụ trách và hạn. | IT, Security | PP-12, GAP-OFF-02, GAP-OFF-03 | BR-OFF-02, BR-GEN-01 | Must | Mọi quyền và thiết bị đã cấp qua ELAMS đều có trong danh sách thu hồi. |
| BREQ-OFF-03 | Bàn giao công việc được lập kế hoạch, cập nhật tiến độ và được Manager xác nhận. | Manager | REQ-003 | BR-OFF-08 | Must | Không có offboarding hoàn tất mà thiếu xác nhận bàn giao của Manager. |
| BREQ-OFF-04 | Quyền được thu hồi đúng thời điểm: 18:00 ngày nghỉ việc, hoặc trong 4 giờ khi nghỉ đột xuất (kể cả khi chuyển sang đột xuất giữa chừng). | Security | KPI-04, GAP-OFF-02, GAP-OFF-07 | BR-OFF-03, BR-OFF-04 | Must | 100% nhiệm vụ thu hồi quyền hoàn thành đúng hạn (KPI-04). |
| BREQ-OFF-05 | Thu hồi quyền không có ngoại lệ: tài khoản chưa thu hồi được phải tiếp tục xử lý tới khi xong. | Security | GAP-OFF-04, KPI-04 | BR-OFF-05 | Must | Không có offboarding hoàn tất còn quyền chưa thu hồi hoặc vô hiệu hóa. |
| BREQ-OFF-06 | Thiết bị được thu hồi và ghi nhận; thiết bị còn thiếu chỉ được đóng theo ngoại lệ có lý do, bằng chứng và Manager duyệt, và vẫn được đánh dấu để theo dõi. | IT, HR | F-09, PP-13, GAP-OFF-03, GAP-OFF-05 | BR-OFF-06 | Must | Truy được từng thiết bị đã thu hồi hay đóng theo ngoại lệ, ai duyệt (KPI-05). |
| BREQ-OFF-07 | Offboarding chỉ được đóng khi các điều kiện bắt buộc đạt theo dữ liệu mới nhất và HR đã xác nhận. | HR | F-08, REQ-003, PP-15, GAP-OFF-04 | BR-OFF-08 | Must | Không có yêu cầu hoàn tất nào thiếu một trong ba điều kiện: quyền thu hồi đủ, bàn giao xác nhận, thiết bị thu hồi hoặc có ngoại lệ. |
| BREQ-OFF-08 | HR, Manager và IT theo dõi trạng thái yêu cầu và từng nhiệm vụ tại một nơi. | HR | F-04, PP-15 | BR-GEN-01 | Must | HR trả lời được "còn việc gì, ai giữ, hạn khi nào" mà không cần hỏi bộ phận khác. |
| BREQ-OFF-09 | Kết quả thu hồi, quyết định ngoại lệ và các thao tác quan trọng được lưu lịch sử. | Security | F-11, REQ-010, GAP-OFF-05 | BR-GEN-02, BR-GEN-03 | Must | 100% quyết định ngoại lệ có người, lý do, bằng chứng, thời điểm (KPI-06). |
| BREQ-OFF-10 | Khi ngày nghỉ việc thay đổi, hạn nhiệm vụ chưa hoàn thành và thời điểm thu hồi quyền được tính lại. | HR, IT | GAP-OFF-06 | BR-OFF-07 | Should | Sau khi đổi ngày, không còn nhiệm vụ chưa xong mang hạn theo ngày cũ. |
| BREQ-OFF-11 | Người phụ trách và HR được cảnh báo khi nhiệm vụ quá hạn; Security được cảnh báo khi thu hồi quyền quá hạn. | HR, Security | F-13, PP-14, GAP-OFF-08 | BR-GEN-01, BR-OFF-05 | Should | Nhiệm vụ quá hạn được đánh dấu và người liên quan được thông báo. |

**Phân quyền (F-10, Must):** chi tiết trong ma trận quyền ở SRS. Nhân viên nghỉ việc chỉ thấy nhiệm vụ bàn giao của mình (Q-44).

## 8. Ràng buộc chất lượng ở mức nghiệp vụ

| Mã | Ràng buộc | Lý do nghiệp vụ |
| --- | --- | --- |
| BQ-OFF-01 | Lỗi hệ thống không được báo là đã thu hồi quyền hoặc đã hoàn tất offboarding. | Một quyền bị báo nhầm là đã thu hồi là lỗ hổng bảo mật |
| BQ-OFF-02 | Thời điểm thu hồi tính theo giờ Việt Nam (UTC+7), thống nhất cho mọi bên. | Thời hạn thu hồi tính theo giờ |
| BQ-OFF-03 | Giao diện và thông báo bằng tiếng Việt. | Người dùng là nhân viên TechNova |

## 9. Dữ liệu nghiệp vụ chính

### 9.1. Yêu cầu offboarding

| Nhóm dữ liệu | Nội dung | Bắt buộc |
| --- | --- | --- |
| Nhân viên | Chọn từ danh sách nhân viên đang làm việc; phòng ban và Manager lấy tự động | Có |
| Ngày làm việc cuối cùng | Ngày nghỉ việc | Có |
| Lý do nghỉ việc | Tự nguyện, chấm dứt hợp đồng, khác | Có |
| Nghỉ đột xuất | Có hoặc không | Có |
| Ghi chú | Thông tin bổ sung | Không |

### 9.2. Các đối tượng khác

| Đối tượng | Dữ liệu cần theo dõi |
| --- | --- |
| Mục thu hồi quyền | Quyền, hệ thống đích, tài khoản, nguồn (ELAMS hoặc IT bổ sung), kết quả (đã thu hồi, đã vô hiệu hóa, chưa thu hồi được), thời điểm, bằng chứng |
| Mục thu hồi thiết bị | Mã tài sản, tình trạng khi trả, thời điểm, người nhận; hoặc lý do thiếu, bằng chứng, quyết định ngoại lệ |
| Bàn giao công việc | Hạng mục, người nhận bàn giao, tiến độ, xác nhận của Manager |
| Nhiệm vụ, lịch sử | Như Onboarding |

## 10. Giả định và ràng buộc

**Giả định:**

- HR tạo yêu cầu và xác nhận hoàn tất (Q-20, Q-24).
- Nhân viên nghỉ việc chỉ cập nhật tiến độ bàn giao; nghỉ đột xuất hoặc đã bị thu hồi tài khoản thì Manager cập nhật thay (Q-44).
- Thu hồi quyền lúc 18:00 ngày nghỉ việc; nghỉ đột xuất thì trong 4 giờ (Q-25, Q-26).
- Không thu hồi được đúng hạn: IT tiếp tục xử lý, Security được cảnh báo (Q-27).
- Manager duyệt ngoại lệ thiết bị (Q-23); thiết bị theo ngoại lệ gắn nhãn "Ngoại lệ – chưa thu hồi" (Q-34).
- Thiết bị quản lý theo từng tài sản (Q-28).
- Danh sách thu hồi lấy từ quyền đã cấp qua ELAMS; IT bổ sung quyền cấp ngoài ELAMS (Q-45).
- Đổi ngày: hạn mới bằng ngày nghỉ việc mới; việc đã xong không mở lại (Q-04).

**Ràng buộc:**

- Dự án cá nhân; thao tác trên hệ thống đích được mô phỏng.
- Dùng chung danh mục quyền, lịch sử cấp phát, Việc cần làm và vai trò với Onboarding và Access Request.

## 11. Rủi ro

| Rủi ro | Ảnh hưởng | Biện pháp |
| --- | --- | --- |
| Quyền cấp ngoài ELAMS không có trong danh sách thu hồi | Tài khoản còn hoạt động sau khi nghỉ | IT rà soát và bổ sung tay; Security đối chiếu khi review định kỳ |
| HR tạo yêu cầu muộn hơn ngày nghỉ việc | Không kịp thu hồi đúng hạn | Cảnh báo khi ngày nghỉ việc sát hoặc đã qua; cho phép đánh dấu đột xuất |
| Thiết bị đóng theo ngoại lệ bị lãng quên | Thất lạc tài sản, sai KPI-05 | Nhãn "Ngoại lệ – chưa thu hồi" trong danh sách thiết bị |
| Nhân viên nghỉ đột xuất không thể bàn giao | Gián đoạn công việc | Manager cập nhật bàn giao thay |

## 12. Câu hỏi mở liên quan

Theo dõi tại [Open Questions Log](../../01-discovery/open-questions-log.md):

| Câu hỏi | Ảnh hưởng tới |
| --- | --- |
| Q-01, Q-05 – Cách tính SLA, người nhận escalation | BREQ-OFF-11 |
| Q-04 – Tính lại hạn khi đổi ngày | BREQ-OFF-10 |
| Q-22, Q-23, Q-34 – Điều kiện đóng, ngoại lệ thiết bị | BREQ-OFF-06, BREQ-OFF-07 |
| Q-25, Q-26, Q-27 – Thời điểm, thời hạn và trách nhiệm thu hồi | BREQ-OFF-04, BREQ-OFF-05 |
| Q-28, Q-45 – Thiết bị theo tài sản, nguồn danh sách thu hồi | BREQ-OFF-02 |
| Q-44, Q-46 – Nhân viên nghỉ việc dùng ELAMS, hủy offboarding | Phạm vi, phân quyền |

## 13. Truy vết

| Mục tiêu | Yêu cầu nghiệp vụ | Phần tử BPMN To-Be |
| --- | --- | --- |
| BG-01 | BREQ-OFF-01, BREQ-OFF-07 | H01, S02, G01, H02, H03 |
| BG-02 | BREQ-OFF-03, BREQ-OFF-08, BREQ-OFF-10, BREQ-OFF-11 | Sub_Handover, Sub_DateChange |
| BG-03 | BREQ-OFF-02, BREQ-OFF-04, BREQ-OFF-05 | S01, Sub_Revoke |
| BG-04 | BREQ-OFF-06 | Sub_Devices |
| BG-05 | BREQ-OFF-09 | D04, V02, toàn quy trình |

## 14. Phê duyệt

| Vai trò | Người phê duyệt | Ngày | Kết quả |
| --- | --- | --- | --- |
| Project Sponsor | | | |
| HR Lead (Process Owner) | | | |
| IT Lead | | | |
| Security Approver | | | |
