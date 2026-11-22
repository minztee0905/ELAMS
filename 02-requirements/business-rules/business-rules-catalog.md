# BUSINESS RULES CATALOG

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Doanh nghiệp:** TechNova (Giả định)

**Phiên bản:** 0.3 – Bản nháp

**Ngày tạo:** 22/11/2026

**Thay đổi bản 0.3:** Thêm BR-ON-12 (phát sinh khi review UC-ON-05).

**Thay đổi bản 0.2:** Thêm BR-ON-11 (phát sinh khi đặc tả UC-ON-01).

**Người thực hiện:** Business Analyst

**Trạng thái:** Đề xuất – Chưa được xác nhận bởi stakeholder thực tế

---

## 1. Mục đích và phạm vi

Tài liệu là nguồn duy nhất cho phát biểu của các quy tắc nghiệp vụ ELAMS (Task 09). BRD, use case, acceptance criteria và kịch bản UAT tham chiếu quy tắc bằng mã trong tài liệu này, không chép lại nội dung.

Phạm vi gồm ba quy trình To-Be đã được duyệt ngày 22/11/2026 và các quy tắc dùng chung:

| Nhóm | Phạm vi | Sơ đồ | Giải thích thiết kế |
| --- | --- | --- | --- |
| BR-GEN | Dùng chung cho mọi quy trình | – | – |
| BR-ON | Employee Onboarding (TB-ON-01) | [to-be-onboarding.bpmn](../../03-process-models/to-be/onboarding/to-be-onboarding.bpmn) | [Onboarding design decisions](../design-decisions/onboarding-to-be-design-decisions.md) |
| BR-AC | Access Request & Approval (TB-AC-01) | [to-be-access-request-approval.bpmn](../../03-process-models/to-be/access-request/to-be-access-request-approval.bpmn) | [Access Request design decisions](../design-decisions/access-request-to-be-design-decisions.md) |
| BR-OFF | Employee Offboarding (TB-OFF-01) | [to-be-offboarding.bpmn](../../03-process-models/to-be/offboarding/to-be-offboarding.bpmn) | [Offboarding design decisions](../design-decisions/offboarding-to-be-design-decisions.md) |

Catalog chỉ chứa quy tắc nghiệp vụ. Cơ chế thực thi (retry, idempotency, đồng bộ lịch) nằm tại [09-implementation](../../09-implementation/workflow/onboarding-technical-notes.md); yêu cầu chức năng và phi chức năng sẽ nằm trong BRD/SRS.

## 2. Quy ước

**Mã quy tắc:** `BR-<nhóm>-<số>`. Mã đã cấp không đổi và không dùng lại; quy tắc bị loại được giữ ở mục 8 với trạng thái Đã loại.

**Loại quy tắc:**

| Loại | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| Ràng buộc | Điều phải đúng hoặc không được xảy ra | Không cấp quyền khi chưa đủ phê duyệt |
| Điều kiện kích hoạt | Khi điều kiện xảy ra thì hệ thống hoặc người dùng phải hành động | Chuyển sang đột xuất thì thu hồi quyền ngay |
| Suy diễn | Giá trị hoặc kết quả được tính từ dữ liệu khác | Cấp phê duyệt suy ra từ danh mục quyền |
| Định nghĩa | Ý nghĩa thống nhất của một thuật ngữ hoặc trạng thái | COMPLETED, REJECTED, BLOCKED |
| Phân quyền | Ai được hoặc không được thực hiện thao tác | Người yêu cầu không tự phê duyệt |

**Nguồn:**

- **REQ-xxx:** yêu cầu sơ bộ trong [Interview Notes](../../01-discovery/interview-notes.md) (phỏng vấn giả lập).
- **GAP-xx-xx:** khoảng cách trong [Gap Analysis](../../03-process-models/pain-point-and-gap-analysis.md).
- **Thiết kế BA:** BA đề xuất khi thiết kế To-Be, chưa có nguồn stakeholder.

**Ưu tiên:** MoSCoW, kế thừa mức ưu tiên của Gap tương ứng (Gap Analysis, mục 8).

**Trạng thái:**

- **Có cơ sở:** có nguồn REQ từ phỏng vấn giả lập.
- **Đề xuất:** chỉ có nguồn Gap hoặc thiết kế BA.
- **Chờ xác nhận:** phụ thuộc câu hỏi đang mở trong [Open Questions Log](../../01-discovery/open-questions-log.md).

Toàn bộ catalog là giả lập; không quy tắc nào được coi là chính sách đã phê duyệt.

## 3. Tổng hợp

| Nhóm | Số quy tắc | Must | Should | Có cơ sở | Đề xuất | Chờ xác nhận |
| --- | --- | --- | --- | --- | --- | --- |
| BR-GEN | 3 | 3 | 0 | 2 | 0 | 1 |
| BR-ON | 12 | 10 | 2 | 2 | 4 | 6 |
| BR-AC | 6 | 6 | 0 | 3 | 2 | 1 |
| BR-OFF | 8 | 7 | 1 | 1 | 1 | 6 |
| **Tổng** | **29** | **26** | **3** | **8** | **7** | **14** |

Gần một nửa số quy tắc (14/29) đang chờ xác nhận. Đây là danh sách ưu tiên khi có buổi review với stakeholder (RM-07).

---

## 4. BR-GEN – Quy tắc dùng chung

| Mã | Quy tắc | Loại | Nguồn | Áp dụng tại | Chủ sở hữu chính sách | Ưu tiên | Trạng thái | Câu hỏi mở |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-GEN-01 | Mỗi nhiệm vụ do quy trình tạo ra phải có người phụ trách, hạn xử lý và trạng thái. Nhiệm vụ quá hạn được đánh dấu quá hạn. | Ràng buộc | REQ-002, GAP-ON-02, GAP-ON-03, GAP-OFF-02, GAP-OFF-08 | ON: S03; OFF: S01 | HR | Must | Chờ xác nhận | Q-01, Q-02, Q-21 |
| BR-GEN-02 | Quyết định từ chối, yêu cầu bổ sung hoặc duyệt ngoại lệ phải có lý do. Lý do được hiển thị cho bên bị ảnh hưởng. | Ràng buộc | REQ-007 | ON: A01, A06; AC: M01, SE01; OFF: D04 | Manager, Security Approver | Must | Có cơ sở | – |
| BR-GEN-03 | Thao tác nghiệp vụ quan trọng (tạo yêu cầu, phê duyệt, từ chối, cập nhật trạng thái, cấp/thu hồi quyền, cấp/thu hồi thiết bị) được ghi lịch sử gồm người thực hiện, thao tác, kết quả, lý do nếu có và thời điểm. Lịch sử không sửa hoặc xóa được từ chức năng nghiệp vụ. | Ràng buộc | REQ-010, GAP-AC-06, KPI-06 | Mọi quy trình | Security Approver | Must | Có cơ sở | Q-29, Q-30 (đã có giả định) |

## 5. BR-ON – Employee Onboarding

| Mã | Quy tắc | Loại | Nguồn | Vị trí BPMN | Chủ sở hữu chính sách | Ưu tiên | Trạng thái | Câu hỏi mở |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-ON-01 | Mỗi quyền trong yêu cầu onboarding phải được xác nhận là bắt buộc hoặc không bắt buộc. Chỉ quyền không bắt buộc bị từ chối hợp lệ mới được kết thúc với REJECTED. Thiếu phân loại hoặc thiếu thẩm quyền không được coi là từ chối. Không được chuyển quyền từ bắt buộc sang không bắt buộc để vượt qua điều kiện đóng. | Ràng buộc | GAP-AC-03, thiết kế BA | Sub_Access: AG01, AG03, A03, AG_Optional | Manager, Security Approver | Must | Chờ xác nhận | Q-08 |
| BR-ON-02 | Trạng thái của từng quyền: **COMPLETED** – đã cấp, kết quả hợp lệ; **REJECTED** – quyền không bắt buộc bị từ chối hợp lệ, không cấp; **BLOCKED** – chưa thể hoàn tất, đang chờ điều chỉnh, chưa được tính là đã xử lý xong. | Định nghĩa | Thiết kế BA | Sub_Access: A04, A14, A_End, A_EndRejected | IT | Must | Chờ xác nhận | Q-10, Q-11 |
| BR-ON-03 | Khi thiếu thiết bị, nhiệm vụ thiết bị giữ trạng thái chờ. Chỉ kiểm tra lại khi IT xác nhận đã có thiết bị phù hợp hoặc thiết bị thay thế. | Điều kiện kích hoạt | REQ-006, GAP-ON-05 | Sub_Devices: D02, D04, D01 | IT | Must | Có cơ sở | – |
| BR-ON-04 | Khi đổi ngày bắt đầu, hạn mới chỉ được tính cho nhiệm vụ chưa hoàn thành, theo chính sách đã xác nhận. Nhiệm vụ đã hoàn thành không tự mở lại. Không tự cấp lại hay thu hồi quyền chỉ vì đổi ngày. | Suy diễn | Thiết kế BA | Sub_DateChange: C02 | HR | Should | Chờ xác nhận | Q-03 |
| BR-ON-05 | Thay đổi ngày bắt đầu chỉ được coi là hoàn tất khi hạn nhiệm vụ và nhắc việc liên quan đã cập nhật theo ngày mới, hoặc đã xác nhận không có mục nào bị ảnh hưởng. Khi chưa cập nhật xong, không được đóng onboarding. | Ràng buộc | Thiết kế BA | Sub_DateChange: C04, C_End | HR | Should | Đề xuất | – |
| BR-ON-06 | Trước khi đóng, ELAMS kiểm tra lại theo dữ liệu mới nhất: từng nhiệm vụ bắt buộc, kết quả từng quyền, bàn giao thiết bị và hiệu lực phê duyệt. Việc các nhánh song song cùng kết thúc chưa chứng minh onboarding thành công. HR xác nhận không bỏ qua được các kiểm tra này. | Ràng buộc | GAP-ON-06 | AND_Join, S06 | HR | Must | Đề xuất | – |
| BR-ON-07 | Khi chưa đủ điều kiện đóng, yêu cầu ở trạng thái chờ. Hệ thống chỉ kiểm tra lại khi dữ liệu liên quan được cập nhật sau lần kiểm tra trước; xem dữ liệu hoặc ghi lịch sử không được tính là cập nhật. | Điều kiện kích hoạt | GAP-ON-06, thiết kế BA | G02, H04, Wait_NewData, S06 | HR | Must | Đề xuất | – |
| BR-ON-08 | Onboarding chỉ chuyển Completed sau khi HR xác nhận. Nếu điều kiện hoàn tất thay đổi ngay trước khi ghi nhận, yêu cầu quay về trạng thái chờ thay vì đóng. HR không chịu trách nhiệm xử lý lỗi hệ thống. | Ràng buộc | REQ-001, GAP-ON-06 | H03, S07 | HR | Must | Chờ xác nhận | Q-18 (đã có giả định) |
| BR-ON-09 | Các quyền được xử lý lần lượt theo thứ tự danh sách. Quyền sau chỉ bắt đầu khi quyền trước đã COMPLETED hoặc REJECTED; quyền đang BLOCKED giữ các quyền sau ở trạng thái chờ. | Ràng buộc | Thiết kế BA | Sub_Access (Sequential Multi-instance) | Manager, IT | Must | Chờ xác nhận | Q-09 (đã có giả định) |
| BR-ON-10 | Sau khi đủ phê duyệt, IT kiểm tra tài khoản của đúng nhân viên trên hệ thống đích: đã có thì dùng lại, chưa có thì tạo mới. Không kiểm tra được không có nghĩa là chưa có tài khoản. Không tạo trùng tài khoản cho cùng nhân viên trên cùng hệ thống. | Ràng buộc | REQ-005, thiết kế BA | Sub_Access: AT, A09, A11 | IT | Must | Có cơ sở | – |
| BR-ON-11 | Mỗi nhân viên chỉ có tối đa một yêu cầu onboarding đang xử lý. Tạo yêu cầu mới cho người đã có yêu cầu đang xử lý bị từ chối và hệ thống chỉ ra yêu cầu hiện có. | Ràng buộc | BQ-ON-01, thiết kế BA (phát sinh khi đặc tả UC-ON-01) | H01, S01 | HR | Must | Đề xuất | – |
| BR-ON-12 | Quyền đã được cấp trên hệ thống đích mà phê duyệt không còn hiệu lực phải được thu hồi hoặc tạm ngừng, ghi kết quả kèm bằng chứng. Quyền giữ BLOCKED và chỉ được cấp lại khi có phê duyệt hợp lệ mới. | Điều kiện kích hoạt | KPI-03, BR-AC-04, thiết kế BA (phát sinh khi review UC-ON-05) | Sub_Access: A11, AG05, A14 | Security Approver | Must | Chờ xác nhận | Q-37 |

## 6. BR-AC – Access Request & Approval

| Mã | Quy tắc | Loại | Nguồn | Vị trí BPMN | Chủ sở hữu chính sách | Ưu tiên | Trạng thái | Câu hỏi mở |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-AC-01 | Yêu cầu cấp quyền chỉ được gửi khi có đủ: hệ thống, quyền cần cấp, lý do sử dụng. | Ràng buộc | REQ-004, GAP-AC-01 | R01 | IT | Must | Có cơ sở | – |
| BR-AC-02 | Manager từ chối hoặc yêu cầu bổ sung, Security từ chối: áp dụng BR-GEN-02. Yêu cầu đang chờ bổ sung không tự hủy khi người yêu cầu không phản hồi, trừ khi có chính sách được duyệt. | Ràng buộc | REQ-007, GAP-AC-07 | M01, SE01, R02 | Manager | Must | Có cơ sở | Q-12 |
| BR-AC-03 | Mức nhạy cảm của quyền và cấp phê duyệt cần thiết được suy ra từ danh mục quyền, không do người duyệt tự xác định. Quyền nhạy cảm cần Manager duyệt trước, Security duyệt sau. Giả định: quyền dữ liệu tài chính và quyền quản trị hệ thống là nhạy cảm. | Suy diễn | REQ-009, GAP-AC-03, GAP-AC-04 | S01, SG01, SE01 | Security Approver | Must | Chờ xác nhận | Q-06, Q-07 |
| BR-AC-04 | IT chỉ nhận nhiệm vụ cấp quyền khi yêu cầu đã đủ mọi phê duyệt bắt buộc. Không cấp quyền trước khi được duyệt. | Ràng buộc | REQ-005, GAP-AC-05, KPI-03 | I01 | Security Approver | Must | Có cơ sở | Q-15 (đã có giả định) |
| BR-AC-05 | Yêu cầu chỉ đóng ở trạng thái Đã cấp khi kết quả cấp quyền đã được IT ghi nhận thành công. Lỗi cấp quyền giữ yêu cầu ở trạng thái Chờ cấp quyền. | Ràng buộc | GAP-AC-06 | IG01, I02, S02 | IT | Must | Đề xuất | – |
| BR-AC-06 | Người yêu cầu không được tự phê duyệt yêu cầu của chính mình. | Phân quyền | Thiết kế BA | M01 | Manager, Security Approver | Must | Đề xuất | Q-35 |

## 7. BR-OFF – Employee Offboarding

| Mã | Quy tắc | Loại | Nguồn | Vị trí BPMN | Chủ sở hữu chính sách | Ưu tiên | Trạng thái | Câu hỏi mở |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-OFF-01 | Yêu cầu offboarding phải có: nhân viên, ngày nghỉ việc, lý do, nghỉ việc đột xuất hay không. | Ràng buộc | GAP-OFF-01 | H01 | HR | Must | Đề xuất | – |
| BR-OFF-02 | Danh sách quyền và thiết bị cần thu hồi được lập từ lịch sử cấp quyền và cấp phát thiết bị của nhân viên. Mỗi mục thu hồi tạo nhiệm vụ theo BR-GEN-01. | Suy diễn | GAP-OFF-02, GAP-OFF-03 | S01 | IT | Must | Chờ xác nhận | Q-28 |
| BR-OFF-03 | Quyền được thu hồi tại thời điểm tính theo ngày nghỉ việc hiện hành. Yêu cầu được đánh dấu đột xuất khi tạo thì thu hồi ngay. | Điều kiện kích hoạt | GAP-OFF-02, KPI-04 | Sub_Revoke: V_Timer, V01 | Security Approver | Must | Chờ xác nhận | Q-25 |
| BR-OFF-04 | Khi yêu cầu được chuyển sang đột xuất trong lúc quy trình đang chạy, việc thu hồi quyền bắt đầu ngay, không chờ ngày nghỉ việc, và có hạn xử lý ngắn hơn. | Điều kiện kích hoạt | GAP-OFF-07 | Sub_Revoke: V_Urgent, V01 | Security Approver | Must | Chờ xác nhận | Q-26 |
| BR-OFF-05 | Thu hồi quyền không có ngoại lệ được duyệt: mọi quyền trong danh sách phải ở trạng thái đã thu hồi hoặc đã vô hiệu hóa. Tài khoản chưa thu hồi được phải tiếp tục xử lý và báo Security nếu quá hạn. | Ràng buộc | GAP-OFF-04, KPI-04 | Sub_Revoke: V02, VG01, V03 | Security Approver | Must | Chờ xác nhận | Q-27 |
| BR-OFF-06 | Thiết bị chưa hoàn trả chỉ được đóng theo ngoại lệ khi có lý do, bằng chứng và quyết định duyệt của người có thẩm quyền (giả định: Manager). Thiết bị đóng theo ngoại lệ vẫn được theo dõi riêng. | Ràng buộc | GAP-OFF-05, KPI-05 | Sub_Devices: D03, D04, DG02 | HR, Manager | Must | Chờ xác nhận | Q-22 (đã có giả định), Q-23, Q-34 |
| BR-OFF-07 | Khi đổi ngày nghỉ việc, hạn nhiệm vụ chưa hoàn thành và thời điểm thu hồi quyền được tính lại. Nhiệm vụ đã hoàn thành không mở lại; quyền đã thu hồi không được cấp lại chỉ vì đổi ngày. | Suy diễn | GAP-OFF-06 | Sub_DateChange: C02 | HR | Should | Chờ xác nhận | Q-04 |
| BR-OFF-08 | Offboarding chỉ được đóng khi: mọi quyền đã thu hồi; Manager đã xác nhận bàn giao; mọi thiết bị đã thu hồi hoặc có ngoại lệ được duyệt. HR xác nhận không thay thế được các kiểm tra này. | Ràng buộc | REQ-003, GAP-OFF-04 | S02, G01, H03 | HR | Must | Có cơ sở | Q-24 (đã có giả định) |

---

## 8. Quy tắc đã loại hoặc chuyển đi

| Nội dung | Xử lý | Lý do |
| --- | --- | --- |
| Phần kỹ thuật của BR-ON-08 (Boundary Error, retry, Incident khi đóng onboarding) | Chuyển sang [ghi chú kỹ thuật](../../09-implementation/workflow/onboarding-technical-notes.md), mục 2 | Cơ chế thực thi, không phải quy tắc nghiệp vụ (RM-01) |
| Phần kỹ thuật của BR-ON-07 (revision dữ liệu, conditional event) | Chuyển sang ghi chú kỹ thuật, mục 3 | Như trên |
| Ủy quyền phê duyệt (REQ-008) | Chưa lập quy tắc | Could Have; chờ Q-13 |

## 9. Ma trận quy tắc theo câu hỏi mở

Khi một câu hỏi được trả lời, cập nhật các quy tắc tương ứng:

| Câu hỏi | Quy tắc bị ảnh hưởng |
| --- | --- |
| Q-01, Q-02, Q-21 | BR-GEN-01 |
| Q-03 | BR-ON-04 |
| Q-04 | BR-OFF-07 |
| Q-06, Q-07 | BR-AC-03, BR-ON-01 |
| Q-08 | BR-ON-01 |
| Q-09 | BR-ON-09 |
| Q-10, Q-11 | BR-ON-02 |
| Q-12 | BR-AC-02 |
| Q-15 | BR-AC-04 |
| Q-18 | BR-ON-08 |
| Q-22, Q-23, Q-34 | BR-OFF-06 |
| Q-24 | BR-OFF-08 |
| Q-25 | BR-OFF-03 |
| Q-26 | BR-OFF-04 |
| Q-27 | BR-OFF-05 |
| Q-28 | BR-OFF-02 |
| Q-29, Q-30 | BR-GEN-03 |
| Q-35 | BR-AC-06 |
| Q-37 | BR-ON-12 |

## 10. Cách cập nhật

- Thêm quy tắc mới bằng mã tiếp theo trong nhóm; không đánh lại số.
- Câu hỏi được trả lời thì cập nhật Trạng thái, ghi nguồn và ngày; đồng thời cập nhật [Open Questions Log](../../01-discovery/open-questions-log.md).
- Thay đổi phát biểu quy tắc thì kiểm tra lại BPMN, use case và acceptance criteria có tham chiếu mã đó.
- Các tài liệu design decisions giữ phần giải thích thiết kế và trỏ về catalog cho phát biểu chính thức.
