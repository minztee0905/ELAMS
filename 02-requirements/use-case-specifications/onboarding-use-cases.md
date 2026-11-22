# ĐẶC TẢ USE CASE – EMPLOYEE ONBOARDING

**Dự án:** ELAMS

**Phạm vi:** Lát cắt Onboarding

**Phiên bản:** 0.4 – Bản nháp

**Thay đổi bản 0.4:** UC-ON-05 EF-03 bổ sung thu hồi/tạm ngừng quyền đã cấp khi phê duyệt không còn hiệu lực (BR-ON-12); bỏ Employee khỏi danh sách actor vì không tương tác với ELAMS; UC-ON-01 làm rõ khởi tạo trọn gói hoặc không tạo gì.

**Thay đổi bản 0.3:** Bỏ use case mở rộng "Điều chỉnh quyền bị chặn" trên sơ đồ; nội dung là luồng thay thế AF-03 của UC-ON-03, UC-ON-04 tham chiếu tới luồng này. Sơ đồ không còn quan hệ `«extend»`. Các ghi chú trên sơ đồ đánh dấu rõ phần giả định (Q-30) và chưa xác định (Q-05).

**Thay đổi bản 0.2:** Bỏ actor Thời gian, điều kiện kích hoạt cảnh báo mô tả trong UC-ON-10 (mục 4.6); "Ghi nhận thiếu thiết bị" chuyển thành luồng thay thế của UC-ON-06; bổ sung actor theo phân quyền cho UC-ON-09 và UC-ON-10.

**Ngày tạo:** 22/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [BRD Onboarding](../brd/brd-onboarding.md), [Business Rules Catalog](../business-rules/business-rules-catalog.md), [BPMN To-Be Onboarding](../../03-process-models/to-be/onboarding/to-be-onboarding.bpmn)

---

## 1. Sơ đồ Use Case

Nguồn sơ đồ: [onboarding-use-case-diagram.drawio](onboarding-use-case-diagram.drawio) (draw.io).

| Actor | Loại | Use case |
| --- | --- | --- |
| HR Staff | Chính | UC-ON-01, 02, 07, 08, 10 |
| Department Manager | Chính | UC-ON-02, 03, 10 |
| Security Approver | Chính | UC-ON-04, 09, 10 |
| IT Staff | Chính | UC-ON-02, 05, 06, 10 |
| System Administrator | Chính | UC-ON-09 |

ELAMS không phải actor: các bước "ELAMS kiểm tra, phân loại, tạo nhiệm vụ" trong BPMN là hành vi của hệ thống bên trong use case. Thời gian cũng không được mô hình thành actor; UC-ON-10 do ELAMS tự kích hoạt theo hạn nhiệm vụ, actor liên kết là người nhận cảnh báo (mục 4.6).

**Phân quyền áp dụng cho sơ đồ** (giả định, chi tiết trong ma trận quyền ở SRS):

| Chức năng | Được phép | Nguồn |
| --- | --- | --- |
| Xem toàn bộ lịch sử thao tác (Audit Log) | Security Approver, System Administrator | Interview Notes OQ-008 → Q-30 (có giả định) |
| Xem quyết định và lý do trong yêu cầu của mình | HR, Manager, IT, Security theo phạm vi UC-ON-02 | Stakeholder Analysis 3.1, 3.3 |
| Nhận cảnh báo quá hạn | Người phụ trách nhiệm vụ (HR, Manager, Security, IT) và HR phụ trách yêu cầu | Stakeholder Analysis 3.1, BR-GEN-01 |
| Nhận escalation khi quá hạn kéo dài | Chưa xác định | Q-05 |

Employee (nhân viên mới) không phải actor vì không tương tác với ELAMS: việc ký biên bản nhận thiết bị diễn ra ngoài hệ thống và IT ghi nhận. Employee vẫn là bên liên quan trong [BRD](../brd/brd-onboarding.md), mục 5. Nếu sau này có ký điện tử trên ELAMS (Q-19), Employee sẽ trở thành actor của UC-ON-06.

## 2. Danh sách Use Case

| Mã | Tên | Actor chính | Ưu tiên | BREQ | BPMN | Mức đặc tả |
| --- | --- | --- | --- | --- | --- | --- |
| UC-ON-01 | Tạo yêu cầu onboarding | HR | Must | 01, 02, 03 | H01, S01, G01, H02, S03 | Đầy đủ (mục 4.1) |
| UC-ON-02 | Theo dõi tiến độ onboarding | HR, Manager, IT | Must | 04, 06 | Toàn quy trình | Tóm tắt (mục 5) |
| UC-ON-03 | Xét duyệt nhu cầu quyền | Manager | Must | 05, 06, 10 | Sub_Access: A01, AG01, A04 | Đầy đủ (mục 4.2) |
| UC-ON-04 | Xét duyệt quyền nhạy cảm | Security | Must | 05, 10 | Sub_Access: A05, AG02, A06, AG03 | Tóm tắt (mục 5) |
| UC-ON-05 | Cấp quyền và cập nhật kết quả | IT | Must | 05, 06, 07 | Sub_Access: AT, A09, A11, AG05, A14 | Đầy đủ (mục 4.3) |
| UC-ON-06 | Bàn giao và ghi nhận thiết bị (gồm luồng thiếu thiết bị) | IT | Must | 08 | Sub_Devices | Đầy đủ (mục 4.4) |
| UC-ON-07 | Xác nhận hoàn tất onboarding | HR | Must | 09 | S06, G02, H04, Wait_NewData, H03, S07 | Đầy đủ (mục 4.5) |
| UC-ON-08 | Thay đổi ngày bắt đầu | HR | Should | 11 | Sub_DateChange | Tóm tắt (mục 5) |
| UC-ON-09 | Xem lịch sử thao tác | Security, System Administrator | Must | 10 | – | Tóm tắt (mục 5) |
| UC-ON-10 | Nhận cảnh báo nhiệm vụ quá hạn | HR, Manager, Security, IT (người nhận) | Should | 12 | – | Đầy đủ (mục 4.6) |

BREQ-ON-13 (dashboard) được đặc tả cùng màn hình theo dõi ở bước wireframe, không tách use case riêng.

## 3. Trạng thái dùng chung

**Trạng thái yêu cầu onboarding** (đề xuất; sơ đồ State chi tiết thuộc bước E):

| Trạng thái | Vào trạng thái khi | BPMN |
| --- | --- | --- |
| Đang xử lý | Yêu cầu hợp lệ và đã tạo đủ nhiệm vụ bắt buộc | S03 |
| Chờ xử lý điều kiện còn thiếu | ELAMS kiểm tra và thấy chưa đủ điều kiện hoàn tất | G02 → H04 |
| Chờ HR xác nhận | ELAMS kiểm tra và thấy đủ điều kiện | G02 → H03 |
| Hoàn tất | HR xác nhận và ELAMS ghi nhận thành công | S07 |

**Trạng thái từng quyền:** COMPLETED, REJECTED, BLOCKED theo BR-ON-02; trước khi kết thúc, quyền ở trạng thái "Đang xử lý" hoặc "Chờ xử lý" (quyền phía sau trong danh sách, BR-ON-09).

---

## 4. Đặc tả đầy đủ

### 4.1. UC-ON-01 – Tạo yêu cầu onboarding

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | HR Staff |
| Bên liên quan | IT, Manager (nhận nhiệm vụ) |
| Mô tả | HR nhập thông tin nhân viên mới và gửi yêu cầu; ELAMS kiểm tra dữ liệu và tạo nhiệm vụ cho các bên. |
| Trigger | Nhân viên mới đã xác nhận nhận việc. |
| Tiền điều kiện | HR đã đăng nhập với vai trò HR. Danh mục quyền và mẫu nhiệm vụ đã được cấu hình. |
| Hậu điều kiện thành công | Yêu cầu ở trạng thái Đang xử lý; mọi nhiệm vụ bắt buộc đã được tạo, có người phụ trách và hạn; Manager nhận nhiệm vụ xét duyệt quyền đầu tiên; IT nhận nhiệm vụ cấp thiết bị; lịch sử ghi nhận thao tác tạo. |
| Hậu điều kiện thất bại | Không có yêu cầu hoặc nhiệm vụ nào được ghi nhận; dữ liệu HR đã nhập vẫn còn trên biểu mẫu để gửi lại. Yêu cầu và nhiệm vụ được tạo trọn gói hoặc không tạo gì. |
| BREQ / Quy tắc | BREQ-ON-01, 02, 03 / BR-GEN-01, BR-GEN-03, BR-ON-01, BR-ON-11 |

**Luồng chính:**

1. HR chọn tạo yêu cầu onboarding.
2. ELAMS hiển thị biểu mẫu gồm các nhóm dữ liệu tại BRD mục 9.1.
3. HR nhập thông tin nhân viên mới, ngày bắt đầu, Manager phụ trách.
4. ELAMS đề xuất danh sách quyền và thiết bị theo chức danh, phòng ban; mỗi quyền đã đánh dấu bắt buộc hoặc không bắt buộc.
5. HR rà soát danh sách và gửi yêu cầu.
6. ELAMS kiểm tra trường bắt buộc, ngày bắt đầu và phòng ban/chức danh.
7. ELAMS lưu yêu cầu, tạo nhiệm vụ theo mẫu, gán người phụ trách và hạn.
8. ELAMS hiển thị mã yêu cầu và danh sách nhiệm vụ đã tạo. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Không có mẫu cho chức danh (bước 4):** ELAMS không đề xuất danh sách; HR nhập danh sách quyền và thiết bị thủ công, phải chọn bắt buộc hoặc không bắt buộc cho từng quyền. Quay lại bước 5.
- **AF-02 – HR sửa danh sách đề xuất (bước 5):** HR thêm hoặc bỏ quyền, thiết bị. HR không được đổi một quyền mẫu từ bắt buộc sang không bắt buộc (BR-ON-01; thẩm quyền chờ Q-08).

**Luồng ngoại lệ:**

- **EF-01 – Dữ liệu không hợp lệ (bước 6):** ELAMS chỉ ra từng trường lỗi và lý do; không tạo yêu cầu. HR sửa và gửi lại từ bước 5 (H02).
- **EF-02 – Không tạo đủ nhiệm vụ bắt buộc (bước 7):** ELAMS không ghi nhận yêu cầu và không giữ nhiệm vụ nào đã tạo dở; thông báo khởi tạo chưa thành công. Dữ liệu đã nhập vẫn còn trên biểu mẫu; HR gửi lại từ bước 5. Lần gửi lại không tạo trùng yêu cầu hoặc nhiệm vụ (BQ-ON-01). Cơ chế bảo đảm trọn gói thuộc SRS (SRS-ON-03).
- **EF-03 – Nhân viên đã có yêu cầu onboarding đang xử lý:** ELAMS cảnh báo và hiển thị yêu cầu hiện có; HR không tạo được yêu cầu thứ hai cho cùng người (BR-ON-11).

**Câu hỏi mở:** Q-17 (mẫu nhiệm vụ), Q-20 (người khởi tạo, có giả định).

### 4.2. UC-ON-03 – Xét duyệt nhu cầu quyền

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | Department Manager |
| Bên liên quan | Security (bước sau nếu quyền nhạy cảm), IT, HR |
| Mô tả | Manager xét duyệt nhu cầu của một quyền trong yêu cầu onboarding; ELAMS xác định bước tiếp theo theo quyết định và danh mục quyền. |
| Trigger | Đến lượt một quyền trong danh sách (BR-ON-09). |
| Tiền điều kiện | Quyền ở trạng thái Đang xử lý; Manager là quản lý trực tiếp ghi trong yêu cầu. |
| Hậu điều kiện thành công | Quyết định được lưu với người, kết quả, lý do (nếu từ chối) và thời điểm; quyền chuyển sang bước phù hợp. |
| BREQ / Quy tắc | BREQ-ON-05, 06, 10 / BR-ON-01, BR-ON-02, BR-AC-03, BR-GEN-02, BR-GEN-03 |

**Luồng chính:**

1. Manager mở nhiệm vụ xét duyệt trong danh sách việc cần làm.
2. ELAMS hiển thị thông tin nhân viên mới, quyền, hệ thống đích, bắt buộc hay không và cấp phê duyệt dự kiến.
3. Manager chọn Phê duyệt.
4. ELAMS phân loại quyền theo danh mục (A05).
5. Quyền không nhạy cảm: ELAMS tạo nhiệm vụ chuẩn bị tài khoản cho IT (UC-ON-05). Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Quyền nhạy cảm (bước 5):** ELAMS tạo nhiệm vụ xét duyệt cho Security (UC-ON-04). Use case kết thúc.
- **AF-02 – Từ chối quyền không bắt buộc (bước 3):** Manager chọn Từ chối và nhập lý do. ELAMS kết thúc quyền với REJECTED; quyền tiếp theo trong danh sách bắt đầu.
- **AF-03 – Từ chối quyền bắt buộc (bước 3):** Manager chọn Từ chối và nhập lý do. ELAMS chuyển quyền sang BLOCKED và tạo nhiệm vụ điều chỉnh cho Manager. Luồng này cũng được dùng khi Security từ chối một quyền bắt buộc ở UC-ON-04. Manager điều chỉnh nhu cầu (ví dụ đổi mức quyền) và gửi lại; quay về bước 2 (A04 → A01). Các quyền phía sau tiếp tục chờ.

**Luồng ngoại lệ:**

- **EF-01 – Thiếu lý do khi từ chối:** ELAMS không lưu quyết định (BR-GEN-02).
- **EF-02 – Quyền chưa có phân loại bắt buộc/không bắt buộc:** ELAMS không cho kết thúc REJECTED; quyền chuyển BLOCKED đến khi được phân loại (BR-ON-01).

**Câu hỏi mở:** Q-08, Q-09, Q-10, Q-11.

### 4.3. UC-ON-05 – Cấp quyền và cập nhật kết quả

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | IT Staff |
| Mô tả | IT chuẩn bị tài khoản cho nhân viên mới trên hệ thống đích, cấp quyền đã được duyệt và cập nhật kết quả; ELAMS kiểm tra kết quả. |
| Trigger | Quyền đã đủ mọi phê duyệt bắt buộc. |
| Tiền điều kiện | Nhiệm vụ cấp quyền chỉ tồn tại khi đủ phê duyệt (BR-AC-04). |
| Hậu điều kiện thành công | Quyền ở trạng thái COMPLETED với tài khoản đã dùng và bằng chứng; quyền tiếp theo bắt đầu. |
| BREQ / Quy tắc | BREQ-ON-05, 06, 07 / BR-AC-04, BR-ON-02, BR-ON-10, BR-ON-12 |

**Luồng chính:**

1. IT mở nhiệm vụ cấp quyền.
2. ELAMS hiển thị quyền, hệ thống đích, các phê duyệt đã có và tài khoản đã ghi nhận cho nhân viên này trên hệ thống đó (nếu có).
3. IT kiểm tra tài khoản trên hệ thống đích: đã có thì chọn dùng lại; chưa có thì tạo mới và nhập định danh tài khoản.
4. IT cấp quyền trên hệ thống đích và cập nhật kết quả thành công kèm bằng chứng.
5. ELAMS kiểm tra kết quả và hiệu lực phê duyệt (A11).
6. ELAMS chuyển quyền sang COMPLETED. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Tài khoản đã được tạo cho quyền trước cùng hệ thống (bước 2):** ELAMS hiển thị tài khoản đó; IT dùng lại, không tạo mới (BR-ON-10).

**Luồng ngoại lệ:**

- **EF-01 – Không xác định được tài khoản đã tồn tại hay chưa (bước 3):** IT không được tạo mới; cập nhật kết quả "chưa xác định". Quyền chuyển BLOCKED (A14).
- **EF-02 – Cấp quyền thất bại (bước 4):** IT cập nhật kết quả thất bại và lý do. Quyền chuyển BLOCKED; sau khi khắc phục, IT quay lại bước 3.
- **EF-03 – Kết quả không hợp lệ hoặc phê duyệt không còn hiệu lực (bước 5):** ELAMS chuyển quyền BLOCKED kèm lý do và yêu cầu IT xử lý. IT kiểm tra hệ thống đích: nếu quyền đã được cấp trong khi phê duyệt không còn hiệu lực, IT thu hồi hoặc tạm ngừng quyền đó và ghi kết quả kèm bằng chứng (BR-ON-12). Quyền giữ BLOCKED cho tới khi có phê duyệt hợp lệ trở lại; khi đó IT quay lại bước 3. Thế nào là phê duyệt không còn hiệu lực chờ Q-37.

### 4.4. UC-ON-06 – Bàn giao và ghi nhận thiết bị

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | IT Staff |
| Bên liên quan ngoài hệ thống | Employee (nhân viên mới) ký biên bản nhận thiết bị; IT ghi nhận vào ELAMS |
| Mô tả | IT chuẩn bị, bàn giao thiết bị cho nhân viên mới và ghi nhận bàn giao kèm biên bản. |
| Trigger | Nhiệm vụ cấp thiết bị được tạo ở UC-ON-01. |
| Hậu điều kiện thành công | Nhiệm vụ thiết bị hoàn thành; dữ liệu bàn giao đầy đủ theo BRD mục 9.2. |
| BREQ / Quy tắc | BREQ-ON-08 / BR-ON-03, BR-GEN-03 |

**Luồng chính:**

1. IT mở nhiệm vụ cấp thiết bị và kiểm tra thiết bị phù hợp trong kho.
2. IT chuẩn bị và bàn giao thiết bị cho nhân viên mới.
3. Nhân viên mới ký biên bản nhận thiết bị.
4. IT ghi nhận bàn giao: mã thiết bị, thời gian, tình trạng, mã biên bản và đính kèm biên bản.
5. ELAMS kiểm tra thông tin bàn giao đầy đủ và hoàn thành nhiệm vụ. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Thiếu thiết bị (bước 1):** IT ghi nhận thiếu thiết bị và lý do chờ. Nhiệm vụ ở trạng thái chờ. Khi có thiết bị phù hợp hoặc thay thế, IT xác nhận và quay lại bước 1 (BR-ON-03).

**Luồng ngoại lệ:**

- **EF-01 – Thiếu thông tin hoặc biên bản (bước 5):** ELAMS chỉ ra thông tin còn thiếu; nhiệm vụ chưa hoàn thành. IT bổ sung từ bước 4.

Thiếu thiết bị là một trạng thái chờ của chính nhiệm vụ thiết bị, cùng actor và không có mục tiêu riêng, nên được mô tả là luồng thay thế thay vì use case riêng.

**Câu hỏi mở:** Q-19 (nhân viên ký biên bản), Q-28 (quản lý thiết bị theo danh mục hay từng tài sản).

### 4.5. UC-ON-07 – Xác nhận hoàn tất onboarding

| Thuộc tính | Nội dung |
| --- | --- |
| Actor chính | HR Staff |
| Mô tả | ELAMS kiểm tra điều kiện hoàn tất; HR rà soát và xác nhận đóng onboarding. |
| Trigger | Nhánh quyền và nhánh thiết bị đều kết thúc, hoặc có dữ liệu mới khi yêu cầu đang chờ. |
| Hậu điều kiện thành công | Yêu cầu ở trạng thái Hoàn tất; lịch sử ghi người xác nhận và thời điểm. |
| BREQ / Quy tắc | BREQ-ON-09 / BR-ON-06, BR-ON-07, BR-ON-08 |

**Luồng chính:**

1. ELAMS kiểm tra điều kiện theo dữ liệu mới nhất: mọi quyền bắt buộc COMPLETED; mọi quyền không bắt buộc COMPLETED hoặc REJECTED; nhiệm vụ thiết bị hoàn thành; phê duyệt còn hiệu lực.
2. Đủ điều kiện: yêu cầu chuyển Chờ HR xác nhận; HR nhận nhiệm vụ.
3. HR xem tóm tắt kết quả từng quyền, thiết bị và các quyết định từ chối.
4. HR xác nhận hoàn tất.
5. ELAMS chuyển yêu cầu sang Hoàn tất và ghi lịch sử. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Chưa đủ điều kiện (bước 2):** yêu cầu chuyển Chờ xử lý điều kiện còn thiếu; ELAMS hiển thị điều kiện nào chưa đạt và ai đang giữ. HR phối hợp với bên liên quan (H04). Khi dữ liệu liên quan được cập nhật, quay lại bước 1. Nếu chưa có cập nhật mới, ELAMS không kiểm tra lại (BR-ON-07).

**Luồng ngoại lệ:**

- **EF-01 – Điều kiện thay đổi ngay trước khi ghi nhận (bước 5):** ELAMS không đóng; yêu cầu quay về Chờ xử lý điều kiện còn thiếu và thông báo cho HR (BR-ON-08).
- **EF-02 – Lỗi hệ thống khi ghi nhận (bước 5):** ELAMS không báo thành công; trạng thái giữ nguyên Chờ HR xác nhận (BQ-ON-02).

**Câu hỏi mở:** Q-18 (có giả định).

### 4.6. UC-ON-10 – Nhận cảnh báo nhiệm vụ quá hạn (Should)

| Thuộc tính | Nội dung |
| --- | --- |
| Actor (người nhận) | Người phụ trách nhiệm vụ: HR, Manager, Security Approver hoặc IT; và HR phụ trách yêu cầu onboarding |
| Mô tả | ELAMS tự phát hiện nhiệm vụ quá hạn, đánh dấu và thông báo cho người liên quan. Không có actor khởi động. |
| Trigger | Điều kiện kích hoạt (bên dưới) được thỏa. |
| Tiền điều kiện | Nhiệm vụ có hạn xử lý theo BR-GEN-01. |
| Hậu điều kiện | Nhiệm vụ mang dấu Quá hạn; người nhận có thông báo; lịch sử ghi lần cảnh báo. |
| BREQ / Quy tắc | BREQ-ON-12 / BR-GEN-01, BR-GEN-03 |

**Điều kiện kích hoạt cảnh báo quá hạn** (phải thỏa đồng thời):

1. Thời điểm hiện tại đã vượt hạn xử lý hiện hành của nhiệm vụ. Hạn hiện hành là hạn sau lần thay đổi gần nhất (UC-ON-08), không phải hạn ban đầu.
2. Nhiệm vụ chưa ở trạng thái kết thúc (hoàn thành hoặc đã hủy). Nhiệm vụ đang chờ, bao gồm quyền BLOCKED và nhiệm vụ thiết bị chờ thiết bị, vẫn được cảnh báo vì vẫn có người phải xử lý.
3. Chưa có cảnh báo quá hạn nào được gửi cho nhiệm vụ với hạn hiện hành này.

**Luồng chính:**

1. ELAMS phát hiện một nhiệm vụ thỏa điều kiện kích hoạt.
2. ELAMS đánh dấu nhiệm vụ Quá hạn trên danh sách việc cần làm và trên yêu cầu onboarding.
3. ELAMS gửi thông báo cho người phụ trách nhiệm vụ và HR phụ trách yêu cầu, gồm: nhiệm vụ, nhân viên mới, hạn, số ngày quá hạn.
4. ELAMS ghi lịch sử lần cảnh báo. Use case kết thúc.

**Luồng thay thế:**

- **AF-01 – Nhắc trước hạn:** khi nhiệm vụ còn trong ngưỡng sắp đến hạn, ELAMS gửi nhắc cho người phụ trách (không gửi HR). Ngưỡng chưa xác định (Q-01).
- **AF-02 – Hạn được dời:** nếu hạn mới nằm sau thời điểm hiện tại, dấu Quá hạn được gỡ; điều kiện 3 được tính lại theo hạn mới.
- **AF-03 – Người phụ trách là HR:** chỉ gửi một thông báo.

**Luồng ngoại lệ:**

- **EF-01 – Gửi thông báo thất bại:** dấu Quá hạn vẫn được giữ trên hệ thống; lần gửi thất bại được ghi lịch sử để gửi lại.

**Câu hỏi mở:** Q-01 (cách tính SLA, ngưỡng nhắc trước hạn), Q-05 (nhắc lại theo chu kỳ và escalation).

---

## 5. Đặc tả tóm tắt

| Mã | Mô tả | Luồng chính | Ngoại lệ chính | Quy tắc |
| --- | --- | --- | --- | --- |
| UC-ON-02 – Theo dõi tiến độ | HR, Manager, IT xem trạng thái yêu cầu và nhiệm vụ trong phạm vi vai trò. | Chọn yêu cầu → xem trạng thái, nhiệm vụ, người giữ, hạn, quyền BLOCKED và lý do. | Người dùng không thấy yêu cầu ngoài phạm vi (Q-33). | BR-GEN-01, BR-ON-02 |
| UC-ON-04 – Xét duyệt quyền nhạy cảm | Security xét duyệt quyền đã được Manager phê duyệt và được danh mục đánh dấu nhạy cảm. | Mở nhiệm vụ → xem quyết định của Manager → Phê duyệt → ELAMS tạo nhiệm vụ cấp quyền cho IT. | Từ chối quyền không bắt buộc: REJECTED (như AF-02 của UC-ON-03). Từ chối quyền bắt buộc: BLOCKED, Manager điều chỉnh theo AF-03 của UC-ON-03. | BR-AC-03, BR-ON-01, BR-GEN-02 |
| UC-ON-08 – Thay đổi ngày bắt đầu | HR đổi ngày bắt đầu khi yêu cầu đang xử lý; không làm gián đoạn các nhánh đang chạy. | Nhập ngày mới và lý do → ELAMS kiểm tra chính sách, xác định nhiệm vụ chưa xong bị ảnh hưởng → cập nhật hạn và nhắc việc. | Thay đổi không hợp lệ: giữ dữ liệu hiện hành. Chưa cập nhật xong hạn: không cho đóng onboarding. | BR-ON-04, BR-ON-05 |
| UC-ON-09 – Xem lịch sử thao tác | Security Approver hoặc System Administrator xem toàn bộ lịch sử của một yêu cầu để truy vết. | Chọn yêu cầu → xem danh sách thao tác theo thời gian. | Vai trò khác không truy cập được chức năng này (HR, Manager xem quyết định qua UC-ON-02). Không có chức năng sửa hoặc xóa lịch sử. | BR-GEN-03 |
