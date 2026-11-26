// Nhãn hiển thị (data-dictionary mục 9, đặc tả màn hình mục 2.3). Luôn có chữ, màu chỉ là tín hiệu phụ (NFR-13).

export type Tone = "blue" | "orange" | "purple" | "green" | "gray" | "grayOutline" | "red" | "redOutline";

export const ROLE_LABEL: Record<string, string> = {
  EMPLOYEE: "Employee",
  MANAGER: "Department Manager",
  HR: "HR Staff",
  IT: "IT Staff",
  SECURITY: "Security Approver",
  ADMIN: "System Administrator",
};

export const CASE_STATUS: Record<string, [string, Tone]> = {
  IN_PROGRESS: ["Đang xử lý", "blue"],
  PENDING_CONDITIONS: ["Chờ xử lý điều kiện còn thiếu", "orange"],
  PENDING_HR_CONFIRMATION: ["Chờ HR xác nhận", "purple"],
  COMPLETED: ["Hoàn tất", "green"],
};

export const ON_ACCESS_STATUS: Record<string, [string, Tone]> = {
  WAITING: ["Chờ xử lý", "grayOutline"],
  IN_PROGRESS: ["Đang xử lý", "blue"],
  COMPLETED: ["COMPLETED", "green"],
  REJECTED: ["REJECTED", "gray"],
  BLOCKED: ["BLOCKED", "red"],
};

export const STEP_LABEL: Record<string, string> = {
  MANAGER_REVIEW: "Manager duyệt",
  SECURITY_REVIEW: "Security duyệt",
  IT_PROVISION: "IT cấp quyền",
};

export const ON_DEVICE_STATUS: Record<string, [string, Tone]> = {
  PREPARING: ["Đang chuẩn bị", "blue"],
  WAITING_DEVICE: ["Chờ thiết bị", "orange"],
  HANDED_OVER: ["Đã bàn giao", "green"],
};

export const AR_STATUS: Record<string, [string, Tone]> = {
  PENDING_MANAGER: ["Chờ Manager duyệt", "blue"],
  NEED_INFO: ["Chờ bổ sung", "orange"],
  PENDING_SECURITY: ["Chờ Security duyệt", "blue"],
  PENDING_PROVISION: ["Chờ cấp quyền", "blue"],
  GRANTED: ["Đã cấp", "green"],
  REJECTED: ["Bị từ chối", "red"],
  CANCELLED: ["Đã hủy", "gray"],
};

export const REVOCATION_STATUS: Record<string, [string, Tone]> = {
  WAITING: ["Chờ đến thời điểm thu hồi", "grayOutline"],
  IN_PROGRESS: ["Đang thu hồi", "blue"],
  REVOKED: ["Đã thu hồi", "green"],
  DISABLED: ["Đã vô hiệu hóa", "green"],
  NOT_REVOKED: ["Chưa thu hồi được", "red"],
};

export const DEVICE_RETURN_STATUS: Record<string, [string, Tone]> = {
  WAITING: ["Chờ thu hồi", "blue"],
  RETURNED: ["Đã thu hồi", "green"],
  MISSING_PENDING_DECISION: ["Thiếu – chờ quyết định", "orange"],
  EXCEPTION_NOT_RETURNED: ["Ngoại lệ – chưa thu hồi", "purple"],
};

export const HANDOVER_STATUS: Record<string, [string, Tone]> = {
  NOT_HANDED_OVER: ["Chưa bàn giao", "grayOutline"],
  HANDED_OVER: ["Đã bàn giao", "green"],
  NOT_MET: ["Chưa đạt", "red"],
};

export const TASK_STATUS: Record<string, [string, Tone]> = {
  OPEN: ["Đang chờ xử lý", "blue"],
  WAITING: ["Đang chờ", "orange"],
  DONE: ["Hoàn thành", "green"],
  CANCELLED: ["Đã hủy", "gray"],
};

export const LEAVE_REASON: Record<string, string> = { VOLUNTARY: "Tự nguyện", TERMINATION: "Chấm dứt hợp đồng", OTHER: "Khác" };
export const DEVICE_TYPE: Record<string, string> = { LAPTOP: "Laptop", MONITOR: "Màn hình", PHONE: "Điện thoại", OTHER: "Thiết bị khác" };
export const HANDOVER_CONDITION: Record<string, string> = { NEW: "Mới", USED_GOOD: "Đã qua sử dụng – tốt", USED_NOTED: "Đã qua sử dụng – có lưu ý" };
export const RETURN_CONDITION: Record<string, string> = { GOOD: "Tốt", MINOR_DAMAGE: "Hư hỏng nhẹ", MAJOR_DAMAGE: "Hư hỏng nặng" };
export const EMPLOYEE_STATUS: Record<string, string> = { PRE_HIRE: "Chưa nhận việc", ACTIVE: "Đang làm việc", OFFBOARDING: "Đang nghỉ việc", LEFT: "Đã nghỉ việc" };

export const ACTION_LABEL: Record<string, string> = {
  CREATE_REQUEST: "Tạo yêu cầu",
  APPROVE: "Phê duyệt",
  REJECT: "Từ chối",
  REQUEST_INFO: "Yêu cầu bổ sung",
  RESUBMIT: "Gửi lại",
  CANCEL: "Hủy yêu cầu",
  ADJUST_ACCESS: "Điều chỉnh quyền",
  GRANT: "Cấp quyền",
  RETRY_PROVISION: "Khắc phục và thử lại",
  REVOKE: "Thu hồi quyền",
  SUSPEND: "Tạm ngừng quyền",
  DISABLE: "Vô hiệu hóa tài khoản",
  ADD_MANUAL_REVOCATION: "Bổ sung quyền ngoài ELAMS",
  START_REVOCATION: "Bắt đầu thu hồi",
  HANDOVER_DEVICE: "Bàn giao thiết bị",
  DEVICE_MISSING: "Ghi nhận thiếu thiết bị",
  DEVICE_AVAILABLE: "Xác nhận có thiết bị",
  RETURN_DEVICE: "Thu hồi thiết bị",
  APPROVE_EXCEPTION: "Duyệt ngoại lệ thiết bị",
  CONTINUE_RECOVERY: "Yêu cầu tiếp tục thu hồi",
  SAVE_HANDOVER_PLAN: "Lưu kế hoạch bàn giao",
  HANDOVER_DONE: "Đánh dấu đã bàn giao",
  HANDOVER_NOT_MET: "Đánh dấu chưa đạt",
  CONFIRM_HANDOVER: "Xác nhận bàn giao đầy đủ",
  CONFIRM_COMPLETION: "Xác nhận hoàn tất",
  CHANGE_START_DATE: "Đổi ngày bắt đầu",
  CHANGE_LAST_DAY: "Đổi ngày nghỉ việc",
  MARK_URGENT: "Chuyển sang đột xuất",
  STATUS_CHANGE: "Đổi trạng thái",
  SEND_OVERDUE_ALERT: "Gửi cảnh báo quá hạn",
  UNAUTHORIZED_ACCESS: "Truy cập trái phép",
  ADMIN_UPDATE: "Quản trị danh mục",
  LOGIN: "Đăng nhập",
};
