# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD) – EMPLOYEE ONBOARDING

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phạm vi tài liệu:** Lát cắt Onboarding (bước B của [roadmap](../../00-project-management/roadmap.md))

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 22/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

---

## Lịch sử phiên bản

| Phiên bản | Ngày | Nội dung | Người thực hiện |
| --- | --- | --- | --- |
| 0.1 | 22/11/2026 | Bản đầu tiên, phạm vi Onboarding | Business Analyst |

## 1. Tóm tắt

TechNova (khoảng 500 nhân viên) đang tiếp nhận nhân viên mới bằng email, Excel và tin nhắn. HR không biết nhiệm vụ nào chưa xong, IT nhận yêu cầu thiếu thông tin, quyền truy cập có thể được cấp khi chưa đủ phê duyệt, và việc xác nhận hoàn tất dựa vào đối chiếu thủ công.

ELAMS giải quyết vấn đề này bằng một quy trình onboarding tập trung: HR tạo một yêu cầu, hệ thống tạo nhiệm vụ cho từng bên với người phụ trách và hạn xử lý, từng quyền được phê duyệt theo đúng cấp trước khi IT cấp, thiết bị được ghi nhận bàn giao, và yêu cầu chỉ được đóng khi các điều kiện bắt buộc đã đạt.

Tài liệu gồm 13 yêu cầu nghiệp vụ (10 Must, 3 Should), liên kết tới 5 mục tiêu nghiệp vụ, 6 Gap và 16 quy tắc trong [Business Rules Catalog](../business-rules/business-rules-catalog.md).

## 2. Bối cảnh và vấn đề nghiệp vụ

### 2.1. Hiện trạng

Quy trình hiện tại (AS-01) được mô tả tại [As-Is Process Analysis](../../03-process-models/as-is-process-analysis.md), mục 3 và [BPMN As-Is Onboarding](../../03-process-models/as-is/onboarding/as-is-onboarding.bpmn). Tóm tắt: HR nhập Excel và gửi email cho Manager và IT; Manager gửi danh sách quyền qua email; IT tự kiểm tra phê duyệt, tạo tài khoản, chuẩn bị thiết bị rồi email lại cho HR; HR đối chiếu email và Excel để xác nhận hoàn tất.

### 2.2. Vấn đề

| ID | Vấn đề | Tác động | Bên chịu ảnh hưởng |
| --- | --- | --- | --- |
| PP-01 | Thông tin nhân viên mới gửi qua email và Excel | Thiếu hoặc sai dữ liệu; IT phải hỏi lại | HR, IT |
| PP-02 | Không có nơi theo dõi trạng thái tập trung | HR không biết nhiệm vụ nào chưa xong | HR, Manager |
| PP-03 | Phân công nhiệm vụ thủ công | Có thể bỏ sót trách nhiệm | HR, IT |
| PP-04 | Không có cảnh báo quá hạn | Nhân viên mới có thể thiếu tài khoản hoặc thiết bị vào ngày đầu | HR, Employee |
| PP-05 | Thay đổi thông tin phải gửi lại cho nhiều bên | Các bên làm theo thông tin khác nhau | HR, IT, Manager |
| PP-09 | Phân loại quyền nhạy cảm thủ công | Có thể bỏ sót bước phê duyệt Security | Security, IT |

Nguồn: [As-Is Process Analysis](../../03-process-models/as-is-process-analysis.md), mục 3.5 và 4.6.

## 3. Mục tiêu nghiệp vụ và chỉ số đo lường

| Mục tiêu | Nội dung (tóm tắt) | KPI | Mục tiêu đề xuất | Hiện trạng |
| --- | --- | --- | --- | --- |
| BG-01 | Chuẩn hóa quy trình vòng đời nhân viên | KPI-01: tỷ lệ nhiệm vụ onboarding hoàn thành đúng SLA | ≥ 95% | Chưa đo được (không có dữ liệu tập trung) |
| BG-02 | Nâng cao hiệu quả xử lý nhiệm vụ | KPI-01 | ≥ 95% | Như trên |
| BG-03 | Tăng cường kiểm soát quyền truy cập | KPI-03: tỷ lệ quyền được cấp có phê duyệt hợp lệ trước khi thực hiện | 100% | Chưa đo được |
| BG-04 | Quản lý thiết bị CNTT | KPI-05: tỷ lệ thiết bị được ghi nhận bàn giao đầy đủ | ≥ 98% | Chưa đo được |
| BG-05 | Minh bạch và giám sát | KPI-06: tỷ lệ quyết định phê duyệt có lịch sử truy vết | 100% | Chưa đo được |

Định nghĩa và công thức KPI: [Business Goals, KPIs & Scope](../../01-discovery/business-goals-kpis-and-scope.md), mục 4. Việc thiếu số liệu hiện trạng là một phát hiện: ELAMS cần tạo ra dữ liệu để đo các KPI này lần đầu.

## 4. Phạm vi

### 4.1. Trong phạm vi

| Chức năng | Mô tả | Ưu tiên |
| --- | --- | --- |
| F-01 | Tạo yêu cầu onboarding | Must |
| F-02 | Theo dõi onboarding | Must |
| F-06 | Phê duyệt nhiều cấp theo chính sách (cho từng quyền của nhân viên mới) | Must |
| F-07 | Phân công và cập nhật nhiệm vụ | Must |
| F-08 | Kiểm tra điều kiện hoàn tất quy trình | Must |
| F-09 | Ghi nhận bàn giao thiết bị | Must |
| F-10 | Phân quyền theo vai trò | Must |
| F-11 | Ghi lịch sử thao tác quan trọng | Must |
| F-12 | Dashboard theo dõi onboarding | Should |
| F-13 | Thông báo và cảnh báo quá hạn | Should |

### 4.2. Ngoài phạm vi

- Tuyển dụng, hợp đồng, lương, chấm công (Charter, mục 4.2).
- Tích hợp thật với Active Directory, Microsoft Entra ID hoặc hệ thống đích; IT thao tác trên hệ thống đích và ghi kết quả vào ELAMS (mô phỏng).
- Yêu cầu cấp quyền lẻ ngoài onboarding (thuộc Access Request, BRD riêng ở bước D).
- Hủy onboarding và cấp lại quyền sau khi đã kết thúc (chờ Q-16).
- Ủy quyền phê duyệt, escalation tự động (Could Have).

### 4.3. Phụ thuộc

- Danh mục quyền có phân loại nhạy cảm (Q-06, Q-07).
- Mẫu nhiệm vụ onboarding theo phòng ban hoặc chức danh (Q-17).
- Danh sách quyền bắt buộc theo vị trí (Q-08).

## 5. Các bên liên quan

| Bên liên quan | Vai trò trong Onboarding To-Be | Nhu cầu chính |
| --- | --- | --- |
| HR Staff | Khởi tạo, theo dõi, phối hợp xử lý điều kiện còn thiếu, xác nhận hoàn tất | Biết ngay nhiệm vụ nào chưa xong; không phải đối chiếu email |
| Department Manager | Xét duyệt nhu cầu quyền; điều chỉnh khi quyền bị chặn | Danh sách chờ duyệt rõ ràng; biết lý do bị chặn |
| Security Approver | Xét duyệt quyền nhạy cảm | Chỉ nhận yêu cầu đã được Manager duyệt; có lịch sử quyết định |
| IT Staff | Chuẩn bị tài khoản, cấp quyền, bàn giao thiết bị | Thông tin đầy đủ; biết chắc yêu cầu đã đủ phê duyệt |
| Employee (nhân viên mới) | Ký biên bản nhận thiết bị | Có đủ tài khoản và thiết bị từ ngày đầu |
| System Administrator | Quản lý vai trò, danh mục và mẫu nhiệm vụ | Cấu hình được mà không sửa quy trình |

**RACI cho các hoạt động chính:**

| Hoạt động | HR | Manager | Security | IT | Employee |
| --- | --- | --- | --- | --- | --- |
| Tạo yêu cầu onboarding | A/R | C | – | I | – |
| Xét duyệt nhu cầu từng quyền | I | A/R | I | I | – |
| Xét duyệt quyền nhạy cảm | I | C | A/R | I | – |
| Chuẩn bị tài khoản và cấp quyền | I | I | I | A/R | – |
| Bàn giao thiết bị | I | – | – | A/R | R (ký biên bản) |
| Xác nhận hoàn tất onboarding | A/R | I | – | I | – |

Kế thừa từ [Stakeholder Analysis](../../01-discovery/stakeholder-analysis.md), mục 5, mở rộng cho To-Be. Employee ký biên bản là giả định (Q-19).

## 6. Quy trình To-Be

Sơ đồ: [to-be-onboarding.bpmn](../../03-process-models/to-be/onboarding/to-be-onboarding.bpmn). Giải thích thiết kế: [Onboarding design decisions](../design-decisions/onboarding-to-be-design-decisions.md).

**Luồng chính:**

1. HR nhập và gửi yêu cầu onboarding (H01). ELAMS kiểm tra dữ liệu (S01); không hợp lệ thì HR sửa và gửi lại (H02).
2. ELAMS lưu yêu cầu, tạo nhiệm vụ theo mẫu, gán người phụ trách và hạn (S03).
3. Hai nhánh song song:
   - **Phê duyệt và cấp từng quyền** (Sub_Access): Manager xét duyệt → ELAMS phân loại theo danh mục → Security xét duyệt nếu nhạy cảm → IT chuẩn bị tài khoản và cấp quyền → ELAMS kiểm tra kết quả. Các quyền được xử lý lần lượt.
   - **Cấp phát thiết bị** (Sub_Devices): IT kiểm tra thiết bị → bàn giao → nhân viên ký biên bản → IT ghi nhận → ELAMS kiểm tra thông tin bàn giao.
4. ELAMS kiểm tra điều kiện hoàn tất theo dữ liệu mới nhất (S06). Chưa đủ thì HR phối hợp xử lý (H04) và hệ thống chờ dữ liệu mới.
5. HR rà soát và xác nhận (H03); ELAMS cập nhật trạng thái Completed (S07).

**Luồng ngoại lệ:** quyền bắt buộc bị từ chối hoặc lỗi cấp quyền chuyển sang BLOCKED; thiếu thiết bị chuyển sang chờ; đổi ngày bắt đầu được xử lý song song (Sub_DateChange).

**Thay đổi so với hiện trạng:**

| Hiện trạng | To-Be | Gap |
| --- | --- | --- |
| HR nhập Excel và gửi email | HR tạo yêu cầu trên ELAMS | GAP-ON-01 |
| HR thông báo thủ công từng bộ phận | Nhiệm vụ tạo tự động theo mẫu | GAP-ON-02 |
| HR liên hệ IT để hỏi tiến độ | Các bên xem trạng thái trực tiếp | GAP-ON-03 |
| IT kiểm tra thông tin qua email | Biểu mẫu có trường bắt buộc và kiểm tra dữ liệu | GAP-ON-04 |
| IT ghi nhận thiết bị thủ công | Ghi nhận bàn giao kèm biên bản | GAP-ON-05 |
| HR tự đối chiếu để hoàn tất | Hệ thống kiểm tra điều kiện trước khi HR xác nhận | GAP-ON-06 |

## 7. Yêu cầu nghiệp vụ

Quy ước: mỗi yêu cầu mô tả điều doanh nghiệp cần đạt, không mô tả giải pháp kỹ thuật. Phát biểu quy tắc chi tiết xem cột "Quy tắc" trong [Business Rules Catalog](../business-rules/business-rules-catalog.md).

| Mã | Yêu cầu | Bên yêu cầu | Nguồn | Quy tắc | Ưu tiên | Tiêu chí kiểm chứng (mức nghiệp vụ) |
| --- | --- | --- | --- | --- | --- | --- |
| BREQ-ON-01 | HR tạo được yêu cầu onboarding tập trung, chứa đủ thông tin để các bộ phận xử lý mà không phải hỏi lại. | HR | F-01, REQ-001, PP-01, GAP-ON-01 | – | Must | Yêu cầu có đủ các nhóm dữ liệu tại mục 9.1; không còn bước gửi email thông tin nhân viên. |
| BREQ-ON-02 | Dữ liệu yêu cầu được kiểm tra trước khi khởi tạo; dữ liệu không hợp lệ được trả lại cho HR kèm lý do. | IT, HR | GAP-ON-04 | – | Must | Yêu cầu thiếu trường bắt buộc hoặc ngày không hợp lệ không tạo nhiệm vụ nào. |
| BREQ-ON-03 | Khi yêu cầu được khởi tạo, mọi nhiệm vụ bắt buộc được tạo theo mẫu, mỗi nhiệm vụ có người phụ trách và hạn xử lý. | HR | F-07, PP-03, GAP-ON-02 | BR-GEN-01 | Must | Yêu cầu chỉ được coi là khởi tạo xong khi đủ nhiệm vụ bắt buộc; không có nhiệm vụ thiếu người phụ trách. |
| BREQ-ON-04 | HR, Manager và IT theo dõi được trạng thái của yêu cầu và từng nhiệm vụ tại một nơi. | HR, Manager | F-02, REQ-002, PP-02, GAP-ON-03 | BR-GEN-01 | Must | HR trả lời được "còn việc gì, ai đang giữ, hạn khi nào" mà không cần liên hệ bộ phận khác. |
| BREQ-ON-05 | Mỗi quyền của nhân viên mới được phê duyệt đúng cấp theo danh mục quyền trước khi IT cấp. | Security, IT | F-06, REQ-005, REQ-009, PP-09 | BR-AC-03, BR-AC-04, BR-ON-01 | Must | 100% quyền đã cấp có đủ phê duyệt bắt buộc trước thời điểm cấp (KPI-03). |
| BREQ-ON-06 | Kết quả được theo dõi riêng cho từng quyền; quyền bị chặn được hiển thị cùng lý do và người cần xử lý. | HR, IT | Thiết kế BA | BR-ON-02, BR-ON-09 | Must | Mỗi quyền có một trong ba trạng thái COMPLETED, REJECTED, BLOCKED; quyền BLOCKED có lý do. |
| BREQ-ON-07 | Không tạo trùng tài khoản cho cùng nhân viên trên cùng hệ thống đích. | IT, Security | REQ-005 | BR-ON-10 | Must | Gửi lại hoặc xử lý nhiều quyền trên cùng hệ thống chỉ dùng một tài khoản. |
| BREQ-ON-08 | Việc bàn giao thiết bị được ghi nhận kèm biên bản; trường hợp thiếu thiết bị được theo dõi đến khi có thiết bị. | IT | F-09, REQ-006, GAP-ON-05 | BR-ON-03 | Must | Truy được thiết bị nào giao cho ai, khi nào, tình trạng gì (KPI-05). |
| BREQ-ON-09 | Onboarding chỉ được đóng khi các điều kiện bắt buộc đạt theo dữ liệu mới nhất và HR đã xác nhận. | HR | F-08, GAP-ON-06 | BR-ON-06, BR-ON-07, BR-ON-08 | Must | Không có yêu cầu Completed nào còn quyền bắt buộc chưa COMPLETED hoặc thiết bị chưa bàn giao. |
| BREQ-ON-10 | Quyết định từ chối có lý do, và mọi thao tác quan trọng được lưu lịch sử để truy vết. | Security, Manager | F-11, REQ-007, REQ-010 | BR-GEN-02, BR-GEN-03 | Must | 100% quyết định phê duyệt/từ chối có người, kết quả, lý do, thời điểm (KPI-06). |
| BREQ-ON-11 | Khi ngày bắt đầu thay đổi, hạn của các nhiệm vụ chưa hoàn thành được cập nhật nhất quán cho mọi bên. | HR, IT | PP-05 | BR-ON-04, BR-ON-05 | Should | Sau khi đổi ngày, không còn nhiệm vụ chưa xong mang hạn theo ngày cũ. |
| BREQ-ON-12 | Người phụ trách và HR được cảnh báo khi nhiệm vụ sắp hoặc đã quá hạn. | HR | F-13, PP-04 | BR-GEN-01 | Should | Nhiệm vụ quá hạn được đánh dấu và người phụ trách được thông báo. |
| BREQ-ON-13 | Quản lý xem được tổng quan các yêu cầu onboarding theo trạng thái và nhiệm vụ quá hạn. | Manager, HR | F-12, BG-05 | – | Should | Có số liệu để tính KPI-01. |

**Phân quyền theo vai trò (F-10, Must)** là yêu cầu xuyên suốt, được chi tiết trong ma trận quyền ở SRS: mỗi vai trò chỉ thấy và xử lý nhiệm vụ của mình; người yêu cầu không tự phê duyệt (BR-AC-06).

## 8. Ràng buộc chất lượng ở mức nghiệp vụ

Các mục dưới đây sẽ được chuyển thành yêu cầu phi chức năng có số đo trong SRS.

| Mã | Ràng buộc | Lý do nghiệp vụ |
| --- | --- | --- |
| BQ-ON-01 | Gửi lại hoặc thử lại không tạo trùng yêu cầu, nhiệm vụ, tài khoản hoặc lịch sử hoàn tất. | Dữ liệu trùng làm sai KPI và gây rủi ro bảo mật |
| BQ-ON-02 | Lỗi hệ thống không được báo là thành công và không được làm yêu cầu tự chuyển Completed. | HR phải tin được trạng thái hiển thị |
| BQ-ON-03 | Giao diện và thông báo bằng tiếng Việt. | Người dùng là nhân viên TechNova |
| BQ-ON-04 | Lịch sử thao tác không sửa hoặc xóa được từ chức năng nghiệp vụ. | Phục vụ kiểm tra trách nhiệm (BR-GEN-03) |

## 9. Dữ liệu nghiệp vụ chính

### 9.1. Yêu cầu onboarding

| Nhóm dữ liệu | Nội dung | Bắt buộc |
| --- | --- | --- |
| Nhân viên mới | Họ tên, email cá nhân để liên hệ, chức danh, phòng ban | Có |
| Thời gian | Ngày bắt đầu làm việc | Có |
| Quản lý trực tiếp | Manager phụ trách | Có |
| Danh sách quyền | Từng quyền, hệ thống đích, bắt buộc hay không bắt buộc | Có (có thể đề xuất theo mẫu vị trí, Q-08) |
| Danh sách thiết bị | Loại thiết bị cần cấp | Có |
| Ghi chú | Yêu cầu đặc biệt | Không |

Danh sách trường là đề xuất; sẽ chốt khi làm SRS và wireframe.

### 9.2. Các đối tượng khác

| Đối tượng | Dữ liệu cần theo dõi |
| --- | --- |
| Nhiệm vụ | Loại, người phụ trách, hạn, trạng thái, kết quả |
| Mục quyền | Quyền, cấp phê duyệt, các quyết định, trạng thái COMPLETED/REJECTED/BLOCKED, tài khoản sử dụng |
| Bàn giao thiết bị | Mã thiết bị, người nhận, thời gian, tình trạng, mã biên bản, người giao, người ghi nhận (SRS-ON-01) |
| Lịch sử | Người thực hiện, thao tác, đối tượng, kết quả, lý do, thời điểm |

Mô hình dữ liệu chi tiết thuộc ERD ở bước E.

## 10. Giả định và ràng buộc

**Giả định:**

- HR là người khởi tạo onboarding (Q-20, có giả định).
- Quyền dữ liệu tài chính và quyền quản trị hệ thống là quyền nhạy cảm (Q-06, có giả định).
- IT không cấp quyền trước khi được phê duyệt (Q-15, có giả định).
- Nhân viên mới ký biên bản nhận thiết bị (Q-19, có giả định).
- Các quyền được xử lý lần lượt theo thứ tự danh sách (Q-09, có giả định).

**Ràng buộc:**

- Dự án cá nhân; thao tác trên hệ thống đích được mô phỏng.
- Không tích hợp thật với hệ thống quản lý tài khoản doanh nghiệp.
- Thiết kế giao diện trên Figma.

## 11. Rủi ro

| Rủi ro | Ảnh hưởng | Biện pháp |
| --- | --- | --- |
| Danh mục quyền nhạy cảm chưa được chốt (Q-06, Q-07) | Phê duyệt sai cấp, ảnh hưởng KPI-03 | Dùng giả định hiện tại; ưu tiên hỏi Security trong buổi review đầu tiên |
| Xử lý quyền tuần tự làm chậm onboarding khi một quyền bị chặn (Q-09) | Nhân viên mới thiếu quyền vào ngày đầu | Hiển thị rõ quyền đang chặn và người cần xử lý (BREQ-ON-06); xem lại nếu stakeholder muốn xử lý song song |
| Mẫu nhiệm vụ chưa được xác định (Q-17) | Thiếu nhiệm vụ bắt buộc khi khởi tạo | Bắt đầu với mẫu tối thiểu: tài khoản, quyền, thiết bị |
| Người dùng tiếp tục trao đổi qua email song song | Dữ liệu trên ELAMS không đầy đủ, KPI sai | Quy định ELAMS là nguồn trạng thái chính thức |

## 12. Câu hỏi mở liên quan Onboarding

Theo dõi tại [Open Questions Log](../../01-discovery/open-questions-log.md):

| Câu hỏi | Ảnh hưởng tới |
| --- | --- |
| Q-01, Q-02, Q-21 – Cách tính SLA, ai đổi hạn, ai đổi người phụ trách | BREQ-ON-03, BREQ-ON-12 |
| Q-03 – Hạn nhiệm vụ phụ thuộc ngày bắt đầu | BREQ-ON-11 |
| Q-06, Q-07, Q-08 – Danh mục quyền và quyền bắt buộc | BREQ-ON-05, BREQ-ON-06 |
| Q-09, Q-10, Q-11 – Thứ tự xử lý, REJECTED, hiển thị BLOCKED | BREQ-ON-06 |
| Q-16 – Hủy onboarding, cấp lại quyền | Phạm vi (mục 4.2) |
| Q-17 – Mẫu nhiệm vụ | BREQ-ON-03 |
| Q-18 – Thời điểm hoàn tất | BREQ-ON-09 |

## 13. Truy vết

Bảng dưới là đầu vào cho RTM ở cuối bước B.

| Mục tiêu | Yêu cầu nghiệp vụ | Phần tử BPMN To-Be |
| --- | --- | --- |
| BG-01 | BREQ-ON-01, BREQ-ON-02, BREQ-ON-09 | H01, S01, G01, H02, S06, G02, H03, S07 |
| BG-02 | BREQ-ON-03, BREQ-ON-04, BREQ-ON-11, BREQ-ON-12 | S03, H04, Sub_DateChange |
| BG-03 | BREQ-ON-05, BREQ-ON-06, BREQ-ON-07 | Sub_Access |
| BG-04 | BREQ-ON-08 | Sub_Devices |
| BG-05 | BREQ-ON-10, BREQ-ON-13 | Toàn quy trình |

## 14. Phê duyệt

Dự án giả lập nên chưa có chữ ký thật. Bảng được giữ để thể hiện bước sign-off trong thực tế; kết quả review với người thật ghi tại [Review Log](../../07-validation/review-log.md).

| Vai trò | Người phê duyệt | Ngày | Kết quả |
| --- | --- | --- | --- |
| Project Sponsor | | | |
| HR Lead (Process Owner) | | | |
| IT Lead | | | |
| Security Approver | | | |
