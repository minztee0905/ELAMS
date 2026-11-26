# TỪ ĐIỂN DỮ LIỆU – ELAMS

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review

**Sơ đồ:** [elams-erd.drawio](elams-erd.drawio) – ERD logic, 4 trang theo nhóm chủ đề

---

## 1. Quy ước

- **Mức mô hình:** logic. Kiểu dữ liệu là kiểu chung (Số nguyên, Chuỗi, Ngày, Ngày giờ, Logic, Văn bản dài), chưa gắn với hệ quản trị cơ sở dữ liệu cụ thể.
- **Tên bảng và cột:** tiếng Anh, snake_case. Mọi bảng có khóa chính `*_id` tự tăng.
- **Bắt buộc:** Có = NOT NULL. **Khóa:** PK khóa chính, FK khóa ngoại, UQ duy nhất.
- **Ngày giờ** lưu theo giờ Việt Nam (UTC+7) (BQ-OFF-02).
- Giá trị liệt kê (enum) ghi ở mục 8.
- Cột kiểm toán chung `created_at`, `created_by`, `updated_at`, `updated_by` có ở mọi bảng nghiệp vụ, không liệt kê lại.

## 2. Tổ chức và người dùng

### department – Phòng ban

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| department_id | Số nguyên | Có | PK | |
| name | Chuỗi(100) | Có | UQ | Tên phòng ban |
| status | Enum | Có | | ACTIVE, INACTIVE |

### job_title – Chức danh

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| job_title_id | Số nguyên | Có | PK | |
| name | Chuỗi(100) | Có | UQ | Ví dụ: Kế toán viên |
| status | Enum | Có | | ACTIVE, INACTIVE |

### employee – Nhân viên

Có bản ghi từ khi tạo yêu cầu onboarding (trạng thái PRE_HIRE), trước khi có tài khoản đăng nhập.

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| employee_id | Số nguyên | Có | PK | |
| employee_code | Chuỗi(20) | Có | UQ | Mã nhân viên |
| full_name | Chuỗi(100) | Có | | |
| personal_email | Chuỗi(150) | Có | | Dùng nhận diện khi chặn onboarding trùng (Q-38) |
| department_id | Số nguyên | Có | FK → department | |
| job_title_id | Số nguyên | Có | FK → job_title | |
| manager_id | Số nguyên | Không | FK → employee | Manager trực tiếp; trống thì không gửi được yêu cầu quyền (UC-AC-01 EF-03) |
| status | Enum | Có | | PRE_HIRE, ACTIVE, OFFBOARDING, LEFT |
| start_date | Ngày | Có | | |
| last_working_date | Ngày | Không | | Có giá trị khi offboarding |

### app_user – Tài khoản đăng nhập ELAMS

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| user_id | Số nguyên | Có | PK | |
| employee_id | Số nguyên | Có | FK → employee, UQ | Mỗi nhân viên tối đa một tài khoản |
| username | Chuỗi(50) | Có | UQ | |
| role | Enum | Có | | EMPLOYEE, MANAGER, HR, IT, SECURITY, ADMIN. Một vai trò chính; mọi người dùng đều có quyền của EMPLOYEE |
| status | Enum | Có | | ACTIVE, DISABLED |

## 3. Danh mục

### target_system – Hệ thống đích

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| system_id | Số nguyên | Có | PK | |
| name | Chuỗi(100) | Có | UQ | Ví dụ: Microsoft 365, MISA, CRM |
| status | Enum | Có | | ACTIVE, INACTIVE |

### access_catalog – Danh mục quyền

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| access_id | Số nguyên | Có | PK | | |
| system_id | Số nguyên | Có | FK → target_system | | |
| name | Chuỗi(100) | Có | | UQ (system_id, name) | |
| access_levels | Chuỗi(200) | Có | | Các mức hợp lệ, ví dụ "Xem, Ghi, Quản trị" | |
| is_sensitive | Logic | Có | | Quyết định có cần Security duyệt | BR-AC-03 |
| status | Enum | Có | | ACTIVE, INACTIVE | |

### position_access_template – Mẫu quyền theo chức danh

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| template_id | Số nguyên | Có | PK | | |
| job_title_id | Số nguyên | Có | FK → job_title | UQ (job_title_id, access_id) | |
| access_id | Số nguyên | Có | FK → access_catalog | | |
| default_level | Chuỗi(50) | Có | | Thuộc access_levels | |
| is_mandatory | Logic | Có | | | BR-ON-01 |
| sequence_no | Số nguyên | Có | | Thứ tự xử lý mặc định | BR-ON-09 |

### position_device_template – Mẫu thiết bị theo chức danh

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| template_id | Số nguyên | Có | PK | |
| job_title_id | Số nguyên | Có | FK → job_title | |
| device_type | Enum | Có | | LAPTOP, MONITOR, PHONE, OTHER |
| config_note | Chuỗi(200) | Không | | Ví dụ: cấu hình kế toán |

### device – Thiết bị (tài sản)

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| device_id | Số nguyên | Có | PK | | |
| asset_code | Chuỗi(30) | Có | UQ | Ví dụ: LT-2025-0188 | Q-28 |
| device_type | Enum | Có | | Như trên | |
| status | Enum | Có | | IN_STOCK, ASSIGNED, EXCEPTION_NOT_RETURNED, RETIRED | BR-OFF-06 |
| holder_employee_id | Số nguyên | Không | FK → employee | Có giá trị khi ASSIGNED hoặc EXCEPTION_NOT_RETURNED | |

## 4. Cấp phát (dùng chung)

### system_account – Tài khoản trên hệ thống đích

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| account_id | Số nguyên | Có | PK | | |
| employee_id | Số nguyên | Có | FK → employee | **UQ (employee_id, system_id)**: không tạo trùng tài khoản | BR-ON-10 |
| system_id | Số nguyên | Có | FK → target_system | | |
| account_identifier | Chuỗi(100) | Có | | Ví dụ: nam.hoang | |
| status | Enum | Có | | ACTIVE, DISABLED, REVOKED | |

### access_grant – Quyền đã cấp

Mỗi dòng là một quyền nhân viên đang hoặc đã có. Được tạo khi `onboarding_access_item` chuyển COMPLETED, khi `access_request` chuyển GRANTED, hoặc khi IT bổ sung quyền cấp ngoài ELAMS lúc offboarding.

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| grant_id | Số nguyên | Có | PK | | |
| employee_id | Số nguyên | Có | FK → employee | | |
| access_id | Số nguyên | Không | FK → access_catalog | Trống khi quyền cấp ngoài ELAMS không có trong danh mục | Q-45 |
| account_id | Số nguyên | Có | FK → system_account | | BR-ON-10 |
| access_level | Chuỗi(50) | Có | | | |
| source | Enum | Có | | ONBOARDING, ACCESS_REQUEST, MANUAL | BR-OFF-02 |
| granted_at | Ngày giờ | Có | | | |
| status | Enum | Có | | ACTIVE, SUSPENDED, REVOKED | BR-ON-12, BR-OFF-05 |

Dùng để: lập danh sách thu hồi khi offboarding (BR-OFF-02); cảnh báo "đã có quyền" khi gửi yêu cầu quyền (BR-AC-07).

## 5. Onboarding

### onboarding_request – Yêu cầu onboarding

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| onboarding_id | Số nguyên | Có | PK | | |
| request_code | Chuỗi(20) | Có | UQ | Ví dụ: ONB-2026-0012 | |
| employee_id | Số nguyên | Có | FK → employee | Tối đa một yêu cầu chưa COMPLETED cho mỗi nhân viên | BR-ON-11 |
| manager_id | Số nguyên | Có | FK → employee | | |
| hr_user_id | Số nguyên | Có | FK → app_user | HR phụ trách | |
| start_date | Ngày | Có | | Không trước ngày tạo | |
| status | Enum | Có | | IN_PROGRESS, PENDING_CONDITIONS, PENDING_HR_CONFIRMATION, COMPLETED | BR-ON-06 → 08 |
| note | Văn bản dài | Không | | | |

### onboarding_access_item – Quyền trong yêu cầu onboarding

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| item_id | Số nguyên | Có | PK | | |
| onboarding_id | Số nguyên | Có | FK → onboarding_request | UQ (onboarding_id, access_id) | |
| access_id | Số nguyên | Có | FK → access_catalog | | |
| access_level | Chuỗi(50) | Có | | | |
| is_mandatory | Logic | Có | | Không đổi từ true sang false | BR-ON-01 |
| sequence_no | Số nguyên | Có | | | BR-ON-09 |
| status | Enum | Có | | WAITING, IN_PROGRESS, COMPLETED, REJECTED, BLOCKED | BR-ON-02 |
| current_step | Enum | Không | | MANAGER_REVIEW, SECURITY_REVIEW, IT_PROVISION | |
| blocked_reason | Chuỗi(500) | Không | | Bắt buộc khi BLOCKED | BR-ON-02 |
| account_id | Số nguyên | Không | FK → system_account | Có giá trị khi COMPLETED | BR-ON-10 |
| evidence_ref | Chuỗi(300) | Không | | Bắt buộc khi COMPLETED | |

REJECTED chỉ hợp lệ khi `is_mandatory` = false (CHECK, BR-ON-01).

### onboarding_device_item – Thiết bị trong yêu cầu onboarding

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| item_id | Số nguyên | Có | PK | | |
| onboarding_id | Số nguyên | Có | FK → onboarding_request | | |
| device_type | Enum | Có | | | |
| config_note | Chuỗi(200) | Không | | | |
| device_id | Số nguyên | Không | FK → device | Có giá trị khi HANDED_OVER | |
| status | Enum | Có | | PREPARING, WAITING_DEVICE, HANDED_OVER | BR-ON-03 |
| waiting_reason | Chuỗi(300) | Không | | Bắt buộc khi WAITING_DEVICE | BR-ON-03 |
| handed_over_at | Ngày giờ | Không | | Bắt buộc khi HANDED_OVER | |
| device_condition | Enum | Không | | NEW, USED_GOOD, USED_NOTED | |
| handover_record_code | Chuỗi(30) | Không | | Bắt buộc khi HANDED_OVER | |
| handover_record_file | Chuỗi(300) | Không | | Đường dẫn tệp biên bản; bắt buộc khi HANDED_OVER | |
| handed_by | Số nguyên | Không | FK → app_user | IT bàn giao | |

## 6. Access Request

### access_request – Yêu cầu cấp quyền

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| request_id | Số nguyên | Có | PK | | |
| request_code | Chuỗi(20) | Có | UQ | Ví dụ: AR-2026-0031 | |
| requester_id | Số nguyên | Có | FK → employee | | Q-41 |
| access_id | Số nguyên | Có | FK → access_catalog | Một quyền mỗi yêu cầu. Không có hai yêu cầu chưa kết thúc cùng (requester_id, access_id) | Q-42, BR-AC-07 |
| access_level | Chuỗi(50) | Có | | | |
| reason | Văn bản dài | Có | | | BR-AC-01 |
| needed_by | Ngày | Không | | | |
| attachment | Chuỗi(300) | Không | | | |
| approver_id | Số nguyên | Có | FK → employee | Manager trực tiếp, hoặc cấp trên nếu người yêu cầu là Manager; khác requester_id | BR-AC-06 |
| status | Enum | Có | | PENDING_MANAGER, NEED_INFO, PENDING_SECURITY, PENDING_PROVISION, GRANTED, REJECTED, CANCELLED | |
| account_id | Số nguyên | Không | FK → system_account | Có giá trị khi GRANTED | BR-ON-10 |
| evidence_ref | Chuỗi(300) | Không | | Bắt buộc khi GRANTED | BR-AC-05 |

### approval_decision – Quyết định phê duyệt

Dùng chung cho quyết định của Manager và Security ở Onboarding và Access Request. Không sửa hoặc xóa.

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| decision_id | Số nguyên | Có | PK | | |
| onboarding_item_id | Số nguyên | Không | FK → onboarding_access_item | Đúng một trong hai cột có giá trị (CHECK) | |
| access_request_id | Số nguyên | Không | FK → access_request | | |
| decided_by | Số nguyên | Có | FK → app_user | Khác người yêu cầu | BR-AC-06 |
| approver_role | Enum | Có | | MANAGER, SECURITY | BR-AC-03 |
| decision | Enum | Có | | APPROVE, REJECT, REQUEST_INFO. REQUEST_INFO chỉ khi approver_role = MANAGER và thuộc access_request | Q-36 |
| reason | Văn bản dài | Không | | Bắt buộc khi REJECT hoặc REQUEST_INFO | BR-GEN-02 |
| decided_at | Ngày giờ | Có | | | BR-GEN-03 |

## 7. Offboarding

### offboarding_request – Yêu cầu offboarding

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| offboarding_id | Số nguyên | Có | PK | | |
| request_code | Chuỗi(20) | Có | UQ | Ví dụ: OFF-2026-0007 | |
| employee_id | Số nguyên | Có | FK → employee | Tối đa một yêu cầu chưa COMPLETED cho mỗi nhân viên | |
| hr_user_id | Số nguyên | Có | FK → app_user | | |
| last_working_date | Ngày | Có | | | BR-OFF-01 |
| leave_reason | Enum | Có | | VOLUNTARY, TERMINATION, OTHER | BR-OFF-01 |
| is_urgent | Logic | Có | | | BR-OFF-03, 04 |
| revoke_at | Ngày giờ | Có | | 18:00 last_working_date; hoặc thời điểm đánh dấu đột xuất | BR-OFF-03 |
| revoke_due_at | Ngày giờ | Có | | Đột xuất: revoke_at + 4 giờ; thường: chờ Q-01 | Q-26 |
| handover_confirmed_at | Ngày giờ | Không | | Thời điểm Manager xác nhận bàn giao đầy đủ | BR-OFF-08 |
| status | Enum | Có | | IN_PROGRESS, PENDING_CONDITIONS, PENDING_HR_CONFIRMATION, COMPLETED | BR-OFF-08 |
| note | Văn bản dài | Không | | | |

### handover_item – Hạng mục bàn giao công việc

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| item_id | Số nguyên | Có | PK | |
| offboarding_id | Số nguyên | Có | FK → offboarding_request | |
| title | Chuỗi(200) | Có | | |
| receiver_id | Số nguyên | Có | FK → employee | Người nhận bàn giao |
| due_date | Ngày | Có | | |
| status | Enum | Có | | NOT_HANDED_OVER, HANDED_OVER, NOT_MET |
| not_met_reason | Chuỗi(500) | Không | | Bắt buộc khi NOT_MET |
| updated_by | Số nguyên | Không | FK → app_user | Người cập nhật gần nhất; có thể là Manager cập nhật thay (Q-44) |


### revocation_item – Mục thu hồi quyền

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| item_id | Số nguyên | Có | PK | | |
| offboarding_id | Số nguyên | Có | FK → offboarding_request | | |
| grant_id | Số nguyên | Không | FK → access_grant, UQ | Trống khi IT bổ sung quyền cấp ngoài ELAMS | Q-45 |
| system_id | Số nguyên | Có | FK → target_system | | |
| account_id | Số nguyên | Không | FK → system_account | | |
| access_name | Chuỗi(100) | Có | | Lấy từ danh mục hoặc IT nhập | |
| source | Enum | Có | | ELAMS, MANUAL | BR-OFF-02 |
| status | Enum | Có | | WAITING, IN_PROGRESS, REVOKED, DISABLED, NOT_REVOKED | BR-OFF-05 |
| evidence_ref | Chuỗi(300) | Không | | Bắt buộc khi REVOKED hoặc DISABLED | |
| failure_reason | Chuỗi(500) | Không | | Bắt buộc khi NOT_REVOKED | |
| processed_at | Ngày giờ | Không | | | |

Không có trạng thái ngoại lệ (BR-OFF-05).

### device_return_item – Mục thu hồi thiết bị

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| item_id | Số nguyên | Có | PK | | |
| offboarding_id | Số nguyên | Có | FK → offboarding_request | | |
| device_id | Số nguyên | Có | FK → device | | |
| status | Enum | Có | | WAITING, RETURNED, MISSING_PENDING_DECISION, EXCEPTION_NOT_RETURNED | BR-OFF-06 |
| returned_at | Ngày giờ | Không | | Bắt buộc khi RETURNED | |
| device_condition | Enum | Không | | GOOD, MINOR_DAMAGE, MAJOR_DAMAGE; bắt buộc khi RETURNED | |
| missing_reason | Chuỗi(500) | Không | | Bắt buộc khi thiếu | |
| evidence_ref | Chuỗi(300) | Không | | Bắt buộc khi thiếu | |
| exception_by | Số nguyên | Không | FK → app_user | Manager duyệt ngoại lệ | Q-23 |
| exception_reason | Chuỗi(500) | Không | | Bắt buộc khi EXCEPTION_NOT_RETURNED | BR-GEN-02 |
| exception_at | Ngày giờ | Không | | | |

## 8. Dùng chung

### task – Nhiệm vụ

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc | Quy tắc |
| --- | --- | --- | --- | --- | --- |
| task_id | Số nguyên | Có | PK | | |
| task_type | Enum | Có | | Xem mục 9 | |
| object_type | Enum | Có | | Loại đối tượng nghiệp vụ, ví dụ ONBOARDING_ACCESS_ITEM, ACCESS_REQUEST, REVOCATION_ITEM | |
| object_id | Số nguyên | Có | | Khóa chính của đối tượng đó | |
| assignee_id | Số nguyên | Có | FK → app_user | | BR-GEN-01 |
| due_at | Ngày giờ | Không | | Trống với nhiệm vụ không có hạn (ví dụ Chờ bổ sung) | BR-GEN-01 |
| status | Enum | Có | | OPEN, WAITING, DONE, CANCELLED | |
| overdue_alerted_for | Ngày giờ | Không | | Hạn đã được cảnh báo; khác due_at thì được cảnh báo lại | UC-ON-10 |

### notification – Thông báo

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| notification_id | Số nguyên | Có | PK | |
| recipient_id | Số nguyên | Có | FK → app_user | |
| task_id | Số nguyên | Không | FK → task | |
| message | Chuỗi(500) | Có | | |
| is_read | Logic | Có | | |
| send_status | Enum | Có | | SENT, FAILED (gửi lại khi FAILED – UC-ON-10 EF-01) |
| created_at | Ngày giờ | Có | | |

### audit_log – Lịch sử thao tác

Chỉ thêm mới; không có chức năng sửa hoặc xóa (BR-GEN-03, BQ-ON-04).

| Cột | Kiểu | Bắt buộc | Khóa | Mô tả / Ràng buộc |
| --- | --- | --- | --- | --- |
| log_id | Số nguyên | Có | PK | |
| actor_id | Số nguyên | Không | FK → app_user | Trống khi ELAMS tự thực hiện (ví dụ gửi cảnh báo) |
| action | Chuỗi(50) | Có | | Ví dụ: CREATE_REQUEST, APPROVE, REJECT, GRANT, REVOKE, HANDOVER_DEVICE, CONFIRM_COMPLETION |
| object_type | Enum | Có | | Như task.object_type |
| object_id | Số nguyên | Có | | |
| result | Chuỗi(50) | Có | | SUCCESS, FAILED |
| reason | Văn bản dài | Không | | |
| created_at | Ngày giờ | Có | | |

**Liên kết đa hình (`object_type`, `object_id`):** `task` và `audit_log` gắn với nhiều loại đối tượng. Dùng một cặp cột thay vì tám khóa ngoại. Đổi lại, cơ sở dữ liệu không tự kiểm tra tính toàn vẹn; ứng dụng phải kiểm tra khi ghi.

## 9. Giá trị liệt kê chính

| Enum | Giá trị | Nhãn hiển thị |
| --- | --- | --- |
| onboarding_request.status | IN_PROGRESS · PENDING_CONDITIONS · PENDING_HR_CONFIRMATION · COMPLETED | Đang xử lý · Chờ xử lý điều kiện còn thiếu · Chờ HR xác nhận · Hoàn tất |
| onboarding_access_item.status | WAITING · IN_PROGRESS · COMPLETED · REJECTED · BLOCKED | Chờ xử lý · Đang xử lý · COMPLETED · REJECTED · BLOCKED |
| access_request.status | PENDING_MANAGER · NEED_INFO · PENDING_SECURITY · PENDING_PROVISION · GRANTED · REJECTED · CANCELLED | Chờ Manager duyệt · Chờ bổ sung · Chờ Security duyệt · Chờ cấp quyền · Đã cấp · Bị từ chối · Đã hủy |
| revocation_item.status | WAITING · IN_PROGRESS · REVOKED · DISABLED · NOT_REVOKED | Chờ đến thời điểm thu hồi · Đang thu hồi · Đã thu hồi · Đã vô hiệu hóa · Chưa thu hồi được |
| device_return_item.status | WAITING · RETURNED · MISSING_PENDING_DECISION · EXCEPTION_NOT_RETURNED | Chờ thu hồi · Đã thu hồi · Thiếu – chờ quyết định · Ngoại lệ – chưa thu hồi |
| task.task_type | ON_ACCESS_REVIEW · ON_ACCESS_ADJUST · SECURITY_REVIEW · PROVISION · ON_DEVICE · ON_CONFIRM · AR_REVIEW · AR_NEED_INFO · OFF_HANDOVER · OFF_HANDOVER_UPDATE · OFF_REVOKE · OFF_DEVICE · OFF_DEVICE_EXCEPTION · OFF_CONFIRM | Theo loại nhiệm vụ ở màn hình Việc cần làm |
