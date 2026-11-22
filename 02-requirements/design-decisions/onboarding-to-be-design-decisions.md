# Quy tắc và yêu cầu cần hoàn thiện cho Onboarding To-Be

**Dự án:** ELAMS

**Phiên bản:** 0.6 – Bản nháp

**Trạng thái:** Đề xuất thiết kế từ phản hồi review của BA, chưa phải chính sách được phê duyệt.

**Sơ đồ liên quan:** [Onboarding To-Be](../../03-process-models/to-be/onboarding/to-be-onboarding.bpmn).

**Thay đổi bản 0.6 (22/11/2026):** Phát biểu quy tắc chuyển sang [Business Rules Catalog](../business-rules/business-rules-catalog.md); bảng quy tắc ở đây chỉ giữ tên ngắn và vị trí BPMN.

**Thay đổi so với bản 0.4:** BPMN Onboarding To-Be được rút gọn ở mức nghiệp vụ (xem mục "Phiên bản BPMN" cuối tài liệu); cột "Vị trí trong BPMN" đã cập nhật theo mã phần tử mới. Ngoài ra: giữ nội dung ở mức nghiệp vụ; chuyển các quyết định về cơ chế thực thi (worker, retry, Incident, idempotency, revision, đồng bộ lịch) sang [ghi chú kỹ thuật Onboarding](../../09-implementation/workflow/onboarding-technical-notes.md) theo đề xuất RM-01. Câu hỏi mở chuyển sang [Open Questions Log](../../01-discovery/open-questions-log.md).

## Quy tắc nghiệp vụ

Phát biểu chính thức, loại, nguồn, trạng thái và câu hỏi mở của từng quy tắc nằm tại [Business Rules Catalog](../business-rules/business-rules-catalog.md). Bảng dưới đây chỉ ghi tên ngắn và vị trí trong BPMN.

| Mã | Tên ngắn | Vị trí trong BPMN |
| --- | --- | --- |
| BR-ON-01 | Phân loại bắt buộc/không bắt buộc và điều kiện REJECTED | AG01, AG03, A03, AG_Optional, A_EndRejected |
| BR-ON-02 | Định nghĩa COMPLETED, REJECTED, BLOCKED | Sub_Access, A04, A14, A_End, A_EndRejected |
| BR-ON-03 | Thiếu thiết bị: chờ đến khi IT xác nhận có thiết bị | D02, D04, D01 |
| BR-ON-04 | Đổi ngày bắt đầu: tính lại hạn nhiệm vụ chưa xong | C02 |
| BR-ON-05 | Đổi ngày chỉ hoàn tất khi hạn và nhắc việc đã cập nhật | C04, C_End |
| BR-ON-06 | Kiểm tra lại điều kiện hoàn tất trước khi đóng | AND_Join, S06 |
| BR-ON-07 | Chờ dữ liệu mới rồi mới kiểm tra lại | G02, H04, Wait_NewData, S06 |
| BR-ON-08 | Chỉ Completed sau khi HR xác nhận | H03, S07 |
| BR-ON-09 | Xử lý quyền lần lượt theo thứ tự | Sub_Access (Sequential Multi-instance) |
| BR-ON-10 | Dùng lại hoặc tạo tài khoản, không tạo trùng | AT, A09, A11 |

Không được tự chuyển một quyền từ bắt buộc sang tùy chọn để vượt qua điều kiện đóng. Thẩm quyền phân loại và điều chỉnh danh sách quyền đang chờ xác nhận (Q-08).

## Ý nghĩa trạng thái của từng quyền

| Trạng thái | Quyền đó đã kết thúc chưa | Điều kiện và ảnh hưởng |
| --- | --- | --- |
| COMPLETED | Có | Quyền đã được cấp, kết quả và bằng chứng hợp lệ. |
| REJECTED | Có, chỉ với quyền đã xác nhận không bắt buộc | Có quyết định từ chối hợp lệ; quyền không được cấp. Onboarding chỉ được đóng nếu tất cả quyền bắt buộc và các điều kiện khác đều hoàn tất. |
| BLOCKED | Chưa | Quyền đang chờ Manager điều chỉnh nhu cầu (A04) hoặc IT khắc phục lỗi cấp quyền (A14). Không được coi là đã xử lý xong. |

Quyền bắt buộc bị từ chối có quyết định phê duyệt là **từ chối**, nhưng trạng thái xử lý là **BLOCKED** để chờ điều chỉnh. Quyền chưa xác định được tính bắt buộc cũng bị chặn. Đây là sự phân biệt giữa quyết định phê duyệt và trạng thái công việc.

Ví dụ: nhân viên cần email công ty, hệ thống kế toán và kho tài liệu. Mỗi quyền được xử lý riêng theo thứ tự danh sách. Nếu quyền kế toán đứng trước và đang chờ Security hoặc BLOCKED, quyền kho tài liệu phía sau phải chờ. Đây là hệ quả của lựa chọn xử lý tuần tự (xem Q-09).

## Điểm chờ và luồng đóng onboarding

Luồng đóng: **S06 kiểm tra điều kiện → G02 → H03 HR rà soát và xác nhận → S07 cập nhật Completed → Kết thúc**.

Khi chưa đủ điều kiện: **G02 → H04 HR phối hợp xử lý (yêu cầu ở trạng thái chờ) → Wait_NewData chờ dữ liệu mới → S06 kiểm tra lại**. Nếu HR hoàn thành H04 mà chưa có dữ liệu nào được cập nhật, quy trình tiếp tục chờ.

Cơ chế thực thi của điểm chờ và cách xử lý lỗi kỹ thuật khi đóng được mô tả tại [ghi chú kỹ thuật](../../09-implementation/workflow/onboarding-technical-notes.md).

## Kiểm tra tài khoản trước khi cấp quyền

Luồng: **AT – IT chuẩn bị tài khoản (dùng lại tài khoản đã có hoặc tạo mới) → A09 – IT cấp quyền và cập nhật kết quả → A11 – ELAMS kiểm tra kết quả và hiệu lực phê duyệt**. Bước cấp quyền chỉ đến được sau khi đủ phê duyệt bắt buộc.

Các bước thao tác trên hệ thống đích do IT thực hiện và được mô phỏng trong phạm vi dự án. ELAMS không tự kiểm tra hoặc tạo tài khoản bên ngoài. Tạo tài khoản thất bại, không rõ kết quả hoặc phê duyệt hết hiệu lực dẫn tới BLOCKED (A14); sau khi khắc phục, luồng quay lại AT để kiểm tra lại tài khoản trước khi tạo tiếp. Quyền REJECTED không đi tới bước cấp quyền.

Yêu cầu nghiệp vụ: hệ thống không được tạo trùng tài khoản cho cùng một nhân viên trên cùng hệ thống đích, kể cả khi có nhiều yêu cầu cùng lúc hoặc người dùng gửi lại.

## Nội dung cần đặc tả trong SRS

Các mã dưới đây là hạng mục cần phân tích tiếp, chưa phải SRS hoàn chỉnh.

| Mã | Nội dung cần đặc tả | Ví dụ cần kiểm chứng khi xây dựng acceptance criteria |
| --- | --- | --- |
| SRS-ON-01 | Dữ liệu bàn giao thiết bị gồm mã thiết bị, người nhận, thời gian bàn giao, tình trạng thiết bị, mã biên bản hoặc bằng chứng, người giao và người ghi nhận. Xác định trường bắt buộc, miền giá trị và quyền sửa. | Thiếu bằng chứng bắt buộc thì chưa được hoàn tất nhiệm vụ; có thể truy vết người nhận, tình trạng và lịch sử cấp phát. |
| SRS-ON-04 | Phân biệt lỗi hệ thống với trường hợp dữ liệu không hợp lệ hoặc thiếu điều kiện nghiệp vụ; định nghĩa thông báo cho người dùng và ghi lịch sử. | Không đọc được trạng thái thì không mặc định đủ điều kiện; lỗi lưu không báo thành công; thử đóng lại sau lỗi vẫn phải kiểm tra điều kiện mới nhất. |
| SRS-ON-02, 03, 05, 06, 07 | Chuyển sang [ghi chú kỹ thuật](../../09-implementation/workflow/onboarding-technical-notes.md). Yêu cầu nghiệp vụ còn lại trong SRS: (1) đổi ngày phải cập nhật đúng hạn và nhắc việc liên quan; (2) gửi lại hoặc thử lại không tạo trùng hồ sơ, nhiệm vụ, tài khoản hay lịch sử hoàn tất; (3) yêu cầu chỉ được coi là khởi tạo xong khi đã tạo đủ nhiệm vụ bắt buộc. | Đưa vào nhóm yêu cầu phi chức năng của SRS. |

## Câu hỏi cần xác nhận

Theo dõi tại [Open Questions Log](../../01-discovery/open-questions-log.md):

- Q-08 – Thẩm quyền xác định và thay đổi danh sách quyền bắt buộc theo vị trí.
- Q-09 – Thứ tự xử lý quyền; cấp một phần quyền khi quyền khác đang chờ.
- Q-10 – Chấp nhận kết quả nhóm REJECTED khi mọi quyền bị từ chối đều không bắt buộc.
- Q-11 – Cách hiển thị BLOCKED ở cấp onboarding và điều kiện tiếp tục.
- Q-03 – Hạn nhiệm vụ phụ thuộc ngày bắt đầu và nhiệm vụ chịu tác động khi đổi ngày.
- Q-16 – Hủy onboarding hoặc cấp lại quyền sau khi quyền đã kết thúc.

## Nguồn và bản hiện hành

Nguồn: phản hồi review của BA trong cuộc trao đổi dự án; [Gap Analysis](../../03-process-models/pain-point-and-gap-analysis.md), GAP-ON-01 đến GAP-ON-06 và các GAP-AC liên quan.

## Phiên bản BPMN

File BPMN tổng thể là nguồn sơ đồ hiện hành. Ngày 21/11/2026, sơ đồ được rút gọn từ 50 task và 18 gateway xuống 27 task và 12 gateway (tính cả ba nhánh con). Nhánh Sub_Access giảm từ 22 xuống 9 task:

- Bỏ các bước "ELAMS ghi nhận/lưu" đứng sau mỗi thao tác của người dùng (A02, A07, AT_RecordCheck, AT_RecordNew, D03, D10, S05, S08, S_AccessResult); việc ghi nhận được hiểu là một phần của thao tác trên hệ thống.
- Gộp 8 phần tử kiểm tra/tạo tài khoản thành một bước AT; gộp A09 và A10 thành A09; gộp A_Blocked và A13 vào hai bước xử lý BLOCKED là A04 và A14; bỏ A08 vì cấu trúc luồng đã bảo đảm chỉ cấp quyền sau khi đủ phê duyệt.
- Bỏ Boundary Error và các bước kỹ thuật; cơ chế này được mô tả tại ghi chú kỹ thuật.

Bản trước khi rút gọn được lưu tại `99-archive/process-models-before-simplification/`. PNG cũ đã được xoá; cần xuất lại từ Camunda Modeler.
