# Case study: ELAMS – quản lý vòng đời nhân viên và quyền truy cập

**Loại dự án:** Phân tích nghiệp vụ cá nhân · **Doanh nghiệp:** TechNova (giả định, ~500 nhân viên) · **Vai trò:** Business Analyst · **Thời gian:** 11/2026

## Bối cảnh

TechNova tiếp nhận nhân viên mới, cấp quyền truy cập và xử lý nghỉ việc qua email, Excel và tin nhắn. Ba hậu quả lớn: HR không theo dõi được tiến độ; quyền nhạy cảm có thể được cấp khi chưa đủ phê duyệt; tài khoản của người đã nghỉ có thể vẫn hoạt động.

## Cách tiếp cận

1. **Khảo sát:** xác định stakeholder, giả lập phỏng vấn HR, Manager, IT, Security; đặt mục tiêu và 6 KPI (ví dụ KPI-04: 100% nhiệm vụ thu hồi quyền đúng hạn).
2. **Phân tích quy trình:** vẽ BPMN As-Is cho ba quy trình, rút ra 15 pain point và gap; thiết kế BPMN To-Be ở mức nghiệp vụ.
3. **Làm trọn một quy trình trước:** đi hết chuỗi cho Onboarding (business rules → BRD → use case → user story → wireframe → RTM → UAT) để có một bộ hồ sơ hoàn chỉnh, rồi dùng lại khung cho Access Request và Offboarding.
4. **Cấp hệ thống:** ERD logic, từ điển dữ liệu và SRS viết sau khi đủ ba quy trình, để mô hình dữ liệu và phân quyền nhất quán.
5. **Kiểm chứng bằng phần mềm:** hiện thực toàn bộ thiết kế thành ứng dụng web; mỗi kịch bản UAT có kiểm thử tự động tương ứng, nhờ đó phát hiện những chỗ tài liệu còn mơ hồ (ví dụ thế nào là "phê duyệt mất hiệu lực") và chốt thành giả định có ghi chép.
6. **Quản lý điều chưa biết:** mọi câu hỏi chưa có câu trả lời được ghi vào một nhật ký duy nhất với mã Q-xx và giả định rõ ràng, thay vì tự coi là đã chốt.

## Ba quyết định phân tích tiêu biểu

**1. Quyền bắt buộc bị từ chối thì "chặn", không "kết thúc"**

Nếu Manager từ chối một quyền bắt buộc (ví dụ email công ty) và hệ thống ghi REJECTED, onboarding có thể đóng trong khi nhân viên thiếu quyền để làm việc. Tôi tách hai trạng thái: REJECTED chỉ dành cho quyền không bắt buộc; quyền bắt buộc bị từ chối chuyển BLOCKED và sinh nhiệm vụ điều chỉnh cho Manager. Điều kiện hoàn tất kiểm tra từng quyền theo trạng thái này.

**2. Thu hồi quyền không có ngoại lệ, thu hồi thiết bị thì có**

Thiết bị có thể mất hoặc trả chậm, nên cần một lối ra có kiểm soát: Manager duyệt ngoại lệ, có lý do và bằng chứng, thiết bị vẫn được gắn nhãn để theo dõi. Quyền truy cập là kiểm soát bảo mật (KPI-04 = 100%), nên màn hình ghi kết quả thu hồi cố ý không có lựa chọn "đóng theo ngoại lệ"; tài khoản chưa thu hồi được phải xử lý tiếp và Security được cảnh báo khi quá hạn.

**3. Một "sổ quyền" nối ba quy trình**

Khi mô hình dữ liệu, tôi đặt bảng `access_grant` ở trung tâm: Onboarding và Access Request ghi vào mỗi khi cấp quyền, Offboarding đọc ra để lập danh sách thu hồi. Cùng với ràng buộc "một nhân viên, một tài khoản trên mỗi hệ thống", hệ thống vừa không tạo trùng tài khoản, vừa không bỏ sót quyền khi nhân viên nghỉ việc.

## Kết quả

| Sản phẩm | Số lượng |
| --- | --- |
| BPMN As-Is và To-Be | 6 sơ đồ |
| Quy tắc nghiệp vụ | 30 |
| Yêu cầu nghiệp vụ (3 BRD) | 33 |
| Use case / User story / Acceptance criteria | 27 / 38 / 144 |
| Màn hình có đặc tả và wireframe | 13 |
| SRS | 58 yêu cầu chức năng, 13 phi chức năng, 4 sơ đồ trạng thái |
| ERD logic | 23 bảng |
| Test case UAT | 40, phủ toàn bộ 144 AC |
| Ứng dụng web | 3 quy trình chạy được; 37 kiểm thử quy tắc nghiệp vụ và 5 kịch bản đầu-cuối tự động |

Mỗi yêu cầu nghiệp vụ truy vết được tới quy tắc, BPMN, use case, user story, màn hình, SRS và UAT ([ví dụ RTM Onboarding](traceability/rtm-onboarding.md)).

## Giới hạn

Doanh nghiệp, stakeholder và phỏng vấn là giả lập; tài liệu chưa được stakeholder thật xác nhận. Ứng dụng chạy trên máy, chưa tích hợp hệ thống đích. Các giả định được ghi rõ trong [nhật ký câu hỏi mở](discovery/open-questions-log.md).
