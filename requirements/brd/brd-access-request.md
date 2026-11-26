# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD) – ACCESS REQUEST & APPROVAL

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phạm vi tài liệu:** Quy trình yêu cầu và phê duyệt cấp quyền truy cập

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

---

## 1. Tóm tắt

Tại TechNova, nhân viên xin quyền truy cập hệ thống nội bộ bằng email gửi Manager. Manager tự đánh giá quyền có nhạy cảm hay không, các phê duyệt nằm rải rác trong nhiều email, và IT phải tự kiểm tra phê duyệt trước khi cấp quyền. Hậu quả: thiếu thông tin, bỏ sót bước duyệt của Security, khó truy vết ai đã duyệt gì.

ELAMS thay thế bằng một luồng có kiểm soát: nhân viên gửi yêu cầu trên biểu mẫu chuẩn, Manager xử lý trong Approval Inbox, hệ thống xác định cấp phê duyệt theo danh mục quyền, Security chỉ duyệt sau Manager, và IT chỉ nhận việc khi đã đủ phê duyệt.

Tài liệu gồm 9 yêu cầu nghiệp vụ (8 Must, 1 Should), liên kết tới 4 mục tiêu nghiệp vụ, 7 Gap và 11 quy tắc trong [Business Rules Catalog](../business-rules/business-rules-catalog.md).

## 2. Bối cảnh và vấn đề nghiệp vụ

### 2.1. Hiện trạng

Quy trình hiện tại (AS-02) được mô tả tại [As-Is Process Analysis](../../process-models/as-is-process-analysis.md), mục 4 và [BPMN As-Is Access Request](../../process-models/as-is/access-request/as-is-access-request-approval.bpmn). Tóm tắt: nhân viên hoặc Manager gửi email yêu cầu; Manager đánh giá và tự quyết định có cần Security duyệt không; yêu cầu được chuyển tiếp qua email tới Security rồi IT; IT tự kiểm tra các phê duyệt, cấp quyền và email báo kết quả.

### 2.2. Vấn đề

| ID | Vấn đề | Tác động | Bên chịu ảnh hưởng |
| --- | --- | --- | --- |
| PP-06 | Yêu cầu không có biểu mẫu chuẩn | Thiếu thông tin bắt buộc; IT và Manager phải hỏi lại | Employee, Manager, IT |
| PP-07 | Phê duyệt qua email khó theo dõi | Thất lạc quyết định; người yêu cầu không biết yêu cầu đang ở đâu | Employee, Manager |
| PP-08 | Không có danh sách yêu cầu chờ duyệt tập trung | Yêu cầu bị bỏ quên, xử lý chậm | Manager, Security |
| PP-09 | Phân loại quyền nhạy cảm thủ công | Có thể bỏ sót bước phê duyệt Security | Security, IT |
| PP-10 | Lịch sử phê duyệt phân tán | Khó truy vết trách nhiệm khi kiểm tra | Security |

Nguồn: [As-Is Process Analysis](../../process-models/as-is-process-analysis.md), mục 4.6.

## 3. Mục tiêu nghiệp vụ và chỉ số đo lường

| Mục tiêu | Nội dung (tóm tắt) | KPI | Mục tiêu đề xuất |
| --- | --- | --- | --- |
| BG-01 | Chuẩn hóa quy trình | Tỷ lệ yêu cầu gửi qua biểu mẫu ELAMS (đề xuất theo dõi) | 100% |
| BG-02 | Nâng cao hiệu quả xử lý | Thời gian từ khi gửi tới khi cấp quyền (đề xuất theo dõi, chưa có mục tiêu) | – |
| BG-03 | Tăng cường kiểm soát quyền truy cập | KPI-03: tỷ lệ yêu cầu cấp quyền được phê duyệt hợp lệ trước khi thực hiện | 100% |
| BG-05 | Minh bạch và giám sát | KPI-06: tỷ lệ quyết định phê duyệt có lịch sử truy vết | 100% |

KPI-03 và KPI-06 định nghĩa tại [Business Goals, KPIs & Scope](../../discovery/business-goals-kpis-and-scope.md), mục 4. Hai chỉ số của BG-01 và BG-02 là đề xuất mới, chưa có trong danh mục KPI.

## 4. Phạm vi

### 4.1. Trong phạm vi

| Chức năng | Mô tả | Ưu tiên |
| --- | --- | --- |
| F-05 | Yêu cầu cấp quyền (chỉ phần cấp; thu hồi ngoài phạm vi) | Must |
| F-06 | Phê duyệt nhiều cấp theo chính sách | Must |
| F-10 | Phân quyền theo vai trò | Must |
| F-11 | Ghi lịch sử thao tác quan trọng | Must |
| F-13 | Thông báo và cảnh báo quá hạn | Should |

### 4.2. Ngoài phạm vi

- Thu hồi quyền lẻ theo yêu cầu. Thu hồi quyền chỉ được xử lý trong Offboarding.
- Quyền tạm thời có ngày hết hạn (Q-14), ủy quyền phê duyệt (Q-13), escalation tự động: Could Have.
- Yêu cầu quyền thay cho người khác (giả định Q-41).
- Màn hình quản lý danh mục quyền (thuộc System Administrator).
- Tích hợp thật với hệ thống đích; IT thao tác trên hệ thống đích và ghi kết quả vào ELAMS (mô phỏng).

### 4.3. Phụ thuộc

- Danh mục quyền có phân loại nhạy cảm (Q-06, Q-07). Dùng chung với Onboarding.
- Cơ cấu tổ chức để xác định Manager trực tiếp của người yêu cầu và cấp trên của Manager (BR-AC-06).

## 5. Các bên liên quan

| Bên liên quan | Vai trò trong Access Request To-Be | Nhu cầu chính |
| --- | --- | --- |
| Employee (người yêu cầu) | Gửi yêu cầu, bổ sung thông tin hoặc hủy, nhận kết quả | Gửi nhanh, biết yêu cầu đang ở bước nào |
| Department Manager | Xét duyệt yêu cầu của nhân viên mình quản lý | Danh sách chờ duyệt rõ ràng, đủ thông tin để quyết định |
| Security Approver | Xét duyệt quyền nhạy cảm | Chỉ nhận yêu cầu đã được Manager duyệt; có lịch sử quyết định |
| IT Staff | Chuẩn bị tài khoản, cấp quyền, ghi kết quả | Biết chắc yêu cầu đã đủ phê duyệt |
| System Administrator | Quản lý danh mục quyền theo đề xuất của Security | Cập nhật danh mục mà không sửa quy trình |

**RACI:**

| Hoạt động | Employee | Manager | Security | IT |
| --- | --- | --- | --- | --- |
| Gửi yêu cầu cấp quyền | A/R | I | – | – |
| Xét duyệt yêu cầu | I | A/R | I | – |
| Bổ sung thông tin hoặc hủy | A/R | I | – | – |
| Xét duyệt quyền nhạy cảm | I | I | A/R | – |
| Cấp quyền và ghi kết quả | I | I | I | A/R |

## 6. Quy trình To-Be

Sơ đồ: [to-be-access-request-approval.bpmn](../../process-models/to-be/access-request/to-be-access-request-approval.bpmn). Giải thích thiết kế: [Access Request design decisions](../design-decisions/access-request-to-be-design-decisions.md).

**Luồng chính:**

1. Nhân viên tạo yêu cầu cấp quyền trên biểu mẫu (R01).
2. Manager xét duyệt trong Approval Inbox (M01): phê duyệt, từ chối hoặc yêu cầu bổ sung.
3. ELAMS xác định cấp phê duyệt theo danh mục quyền (S01). Quyền nhạy cảm chuyển Security xét duyệt (SE01).
4. Khi đủ phê duyệt, IT chuẩn bị tài khoản và cấp quyền trên hệ thống đích (I01). Lỗi thì IT khắc phục (I02).
5. ELAMS đóng yêu cầu và thông báo kết quả cho người yêu cầu (S02).

**Luồng ngoại lệ:** Manager yêu cầu bổ sung → người yêu cầu gửi lại hoặc hủy (R02); Manager hoặc Security từ chối → yêu cầu kết thúc có lý do.

**Trạng thái yêu cầu:** Chờ Manager duyệt, Chờ bổ sung, Chờ Security duyệt, Chờ cấp quyền, Đã cấp, Bị từ chối, Đã hủy. Chi tiết tại [design decisions](../design-decisions/access-request-to-be-design-decisions.md), mục 3.

**Thay đổi so với hiện trạng:**

| Hiện trạng | To-Be | Gap |
| --- | --- | --- |
| Gửi email, không có biểu mẫu | Biểu mẫu có trường bắt buộc | GAP-AC-01 |
| Manager duyệt qua email | Approval Inbox | GAP-AC-02 |
| Phân loại nhạy cảm thủ công | Cấp phê duyệt suy ra từ danh mục quyền | GAP-AC-03 |
| Phê duyệt Security qua email | Security chỉ nhận sau khi Manager duyệt | GAP-AC-04 |
| IT tự xác minh phê duyệt | IT chỉ nhận việc khi đủ phê duyệt | GAP-AC-05 |
| Quyết định rải rác trong email | Lịch sử quyết định trên ELAMS | GAP-AC-06 |
| Bổ sung thông tin qua email | Trạng thái Chờ bổ sung, gửi lại hoặc hủy | GAP-AC-07 |

## 7. Yêu cầu nghiệp vụ

| Mã | Yêu cầu | Bên yêu cầu | Nguồn | Quy tắc | Ưu tiên | Tiêu chí kiểm chứng (mức nghiệp vụ) |
| --- | --- | --- | --- | --- | --- | --- |
| BREQ-AC-01 | Nhân viên gửi được yêu cầu cấp quyền trên biểu mẫu chuẩn, đủ thông tin để duyệt và cấp mà không phải hỏi lại. | IT, Manager | F-05, REQ-004, PP-06, GAP-AC-01 | BR-AC-01, BR-AC-07 | Must | Không còn yêu cầu nào thiếu hệ thống, quyền hoặc lý do sử dụng; không có hai yêu cầu đang xử lý cho cùng quyền của cùng người. |
| BREQ-AC-02 | Manager xử lý mọi yêu cầu chờ duyệt tại một nơi, với ba lựa chọn: phê duyệt, từ chối, yêu cầu bổ sung. | Manager | F-06, PP-07, PP-08, GAP-AC-02 | BR-AC-02, BR-AC-06 | Must | Manager không cần mở email để biết yêu cầu nào đang chờ mình; không ai tự duyệt yêu cầu của chính mình. |
| BREQ-AC-03 | Khi được yêu cầu bổ sung, người yêu cầu gửi lại thông tin hoặc hủy yêu cầu; yêu cầu không tự hủy khi chưa phản hồi. | Employee, Manager | GAP-AC-07 | BR-AC-02 | Must | Yêu cầu Chờ bổ sung chỉ kết thúc khi người yêu cầu hủy; gửi lại vẫn giữ nguyên yêu cầu ban đầu. |
| BREQ-AC-04 | Cấp phê duyệt được xác định theo danh mục quyền; quyền nhạy cảm cần Security duyệt sau Manager. | Security | F-06, REQ-009, PP-09, GAP-AC-03, GAP-AC-04 | BR-AC-03 | Must | 100% quyền nhạy cảm được cấp có phê duyệt của cả Manager và Security. |
| BREQ-AC-05 | IT chỉ nhận nhiệm vụ cấp quyền khi yêu cầu đã đủ phê duyệt, và dùng lại tài khoản sẵn có của người yêu cầu trên hệ thống đích. | Security, IT | REQ-005, GAP-AC-05 | BR-AC-04, BR-ON-10 | Must | Không có quyền nào được cấp trước thời điểm đủ phê duyệt (KPI-03); không tạo trùng tài khoản. |
| BREQ-AC-06 | Yêu cầu chỉ kết thúc ở Đã cấp khi IT ghi nhận cấp quyền thành công; lỗi cấp quyền được theo dõi tới khi khắc phục. | Employee, IT | GAP-AC-06 | BR-AC-05 | Must | Không có yêu cầu Đã cấp nào thiếu kết quả cấp quyền của IT. |
| BREQ-AC-07 | Người yêu cầu và các bên liên quan theo dõi được trạng thái yêu cầu và được thông báo khi yêu cầu kết thúc. | Employee | PP-07, PP-08 | BR-GEN-01 | Must | Người yêu cầu biết yêu cầu đang ở bước nào, ai đang giữ, mà không cần hỏi Manager hoặc IT. |
| BREQ-AC-08 | Quyết định từ chối hoặc yêu cầu bổ sung có lý do, và mọi quyết định được lưu lịch sử. | Security, Manager | F-11, REQ-007, REQ-010, PP-10, GAP-AC-06 | BR-GEN-02, BR-GEN-03 | Must | 100% quyết định có người, kết quả, lý do (khi cần), thời điểm (KPI-06). |
| BREQ-AC-09 | Người đang giữ yêu cầu được cảnh báo khi yêu cầu chờ duyệt hoặc chờ cấp quá hạn. | Employee, Manager | F-13 | BR-GEN-01 | Should | Yêu cầu quá hạn được đánh dấu và người đang giữ được thông báo. |

**Phân quyền (F-10, Must):** nhân viên chỉ thấy yêu cầu của mình; Manager thấy yêu cầu của nhân viên mình quản lý; Security và IT thấy yêu cầu có nhiệm vụ của mình. Chi tiết trong ma trận quyền ở SRS.

**Ghi chú:** BR-ON-10 (không tạo trùng tài khoản) hiện nằm trong nhóm Onboarding nhưng áp dụng cho mọi lần cấp quyền. Sẽ cân nhắc chuyển thành quy tắc dùng chung khi làm SRS.

## 8. Ràng buộc chất lượng ở mức nghiệp vụ

| Mã | Ràng buộc | Lý do nghiệp vụ |
| --- | --- | --- |
| BQ-AC-01 | Gửi lại sau khi bổ sung không tạo yêu cầu mới; mã yêu cầu và lịch sử được giữ nguyên. | Truy vết đầy đủ một yêu cầu từ đầu tới cuối |
| BQ-AC-02 | Lỗi hệ thống không được báo là đã cấp quyền. | Người yêu cầu và Security phải tin được trạng thái |
| BQ-AC-03 | Giao diện và thông báo bằng tiếng Việt. | Người dùng là nhân viên TechNova |

## 9. Dữ liệu nghiệp vụ chính

### 9.1. Yêu cầu cấp quyền

| Nhóm dữ liệu | Nội dung | Bắt buộc |
| --- | --- | --- |
| Người yêu cầu | Lấy tự động từ tài khoản đăng nhập: họ tên, phòng ban, Manager trực tiếp | Có (tự động) |
| Quyền | Một quyền chọn từ danh mục; hệ thống đích và mức nhạy cảm lấy từ danh mục | Có |
| Mức quyền | Mức truy cập cần cấp (ví dụ: xem, ghi, quản trị) | Có |
| Lý do sử dụng | Công việc cần quyền này | Có |
| Ngày cần có quyền | Ngày người yêu cầu cần bắt đầu dùng | Không |
| Tệp đính kèm | Tài liệu hỗ trợ | Không |

Mỗi yêu cầu chứa một quyền (giả định Q-42).

### 9.2. Các đối tượng khác

| Đối tượng | Dữ liệu cần theo dõi |
| --- | --- |
| Quyết định phê duyệt | Người quyết định, vai trò, kết quả (phê duyệt / từ chối / yêu cầu bổ sung), lý do, thời điểm |
| Nhiệm vụ cấp quyền | Người phụ trách, hạn, tài khoản sử dụng, kết quả, bằng chứng |
| Lịch sử | Người thực hiện, thao tác, kết quả, lý do, thời điểm |

## 10. Giả định và ràng buộc

**Giả định:**

- Mọi nhân viên có tài khoản ELAMS được gửi yêu cầu, chỉ cho chính mình (Q-41).
- Mỗi yêu cầu chứa một quyền (Q-42).
- Không gửi yêu cầu mới khi đang có yêu cầu chưa kết thúc cho cùng quyền; đã có quyền thì cảnh báo nhưng vẫn cho gửi (Q-43, BR-AC-07).
- Manager xin quyền cho chính mình thì cấp trên trực tiếp của Manager duyệt (Q-35).
- Yêu cầu không sửa được sau khi gửi; chỉ sửa hoặc hủy khi ở trạng thái Chờ bổ sung (Q-12).
- Security chỉ duyệt hoặc từ chối, không yêu cầu bổ sung (Q-36).
- Quyền dữ liệu tài chính và quyền quản trị hệ thống là quyền nhạy cảm (Q-06); System Administrator cập nhật danh mục theo đề xuất của Security (Q-07).

**Ràng buộc:**

- Dự án cá nhân; thao tác trên hệ thống đích được mô phỏng.
- Dùng chung danh mục quyền, Approval Inbox và vai trò người dùng với Onboarding.

## 11. Rủi ro

| Rủi ro | Ảnh hưởng | Biện pháp |
| --- | --- | --- |
| Danh mục quyền nhạy cảm chưa được chốt (Q-06) | Phê duyệt sai cấp, ảnh hưởng KPI-03 | Dùng giả định hiện tại; ưu tiên hỏi Security khi review |
| Nhân viên vẫn xin quyền qua email hoặc tin nhắn | Yêu cầu nằm ngoài hệ thống, KPI sai | Quy định IT chỉ cấp quyền theo yêu cầu trên ELAMS |
| Manager tồn đọng nhiều yêu cầu | Nhân viên chờ lâu | Cảnh báo quá hạn (BREQ-AC-09); cân nhắc ủy quyền phê duyệt ở giai đoạn sau (Q-13) |
| Yêu cầu Chờ bổ sung bị bỏ quên vì không tự hủy | Danh sách yêu cầu tồn đọng | Hiển thị số ngày chờ bổ sung; chờ chính sách tự hủy (Q-12) |

## 12. Câu hỏi mở liên quan

Theo dõi tại [Open Questions Log](../../discovery/open-questions-log.md):

| Câu hỏi | Ảnh hưởng tới |
| --- | --- |
| Q-01, Q-05 – Cách tính SLA, người nhận cảnh báo | BREQ-AC-09 |
| Q-06, Q-07 – Danh mục quyền nhạy cảm | BREQ-AC-04 |
| Q-12, Q-36 – Sửa yêu cầu, Security yêu cầu bổ sung | BREQ-AC-02, BREQ-AC-03 |
| Q-13, Q-14 – Ủy quyền, quyền tạm thời | Phạm vi (mục 4.2) |
| Q-33 – Phạm vi xem của Manager | Phân quyền |
| Q-35, Q-41, Q-42, Q-43 – Người duyệt thay, người yêu cầu, số quyền, yêu cầu trùng | BREQ-AC-01, BREQ-AC-02 |

## 13. Truy vết

| Mục tiêu | Yêu cầu nghiệp vụ | Phần tử BPMN To-Be |
| --- | --- | --- |
| BG-01 | BREQ-AC-01, BREQ-AC-03 | R01, R02, RG01, E_Cancel |
| BG-02 | BREQ-AC-02, BREQ-AC-07, BREQ-AC-09 | M01, MG01, S02 |
| BG-03 | BREQ-AC-04, BREQ-AC-05, BREQ-AC-06 | S01, SG01, SE01, SG02, I01, IG01, I02 |
| BG-05 | BREQ-AC-08 | M01, SE01, toàn quy trình |

## 14. Phê duyệt

| Vai trò | Người phê duyệt | Ngày | Kết quả |
| --- | --- | --- | --- |
| Project Sponsor | | | |
| Department Manager (Process Owner) | | | |
| Security Approver | | | |
| IT Lead | | | |
