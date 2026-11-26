// NFR-05: phân biệt lỗi dữ liệu (người dùng sửa được) và lỗi hệ thống (thử lại sau).

export type FieldErrors = Record<string, string>;

export class BusinessError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: FieldErrors = {},
    public readonly code?: string,
    public readonly link?: { href: string; label: string },
  ) {
    super(message);
    this.name = "BusinessError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = MSG.FORBIDDEN) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export const MSG = {
  REQUIRED: (field: string) => `Vui lòng nhập ${field}.`, // MSG-01
  START_DATE_PAST: "Ngày bắt đầu không được trước ngày hôm nay.", // MSG-02
  ONB_DUPLICATE: (code: string) =>
    `Nhân viên này đã có yêu cầu onboarding đang xử lý: ${code}. Không thể tạo yêu cầu thứ hai.`, // MSG-03
  MANDATORY_LOCKED: "Quyền này là bắt buộc theo mẫu vị trí. Không thể đổi sang không bắt buộc.", // MSG-04
  ONB_CREATE_FAILED:
    "Khởi tạo yêu cầu chưa thành công. Chưa có yêu cầu hay nhiệm vụ nào được tạo. Dữ liệu bạn đã nhập vẫn được giữ, vui lòng gửi lại.", // MSG-05
  REJECT_REASON: "Vui lòng nhập lý do từ chối.", // MSG-07
  EVIDENCE_REQUIRED: "Vui lòng đính kèm bằng chứng cấp quyền.", // MSG-09
  APPROVAL_INVALID: (reason: string) =>
    `Phê duyệt của quyền này không còn hiệu lực: ${reason}. Kiểm tra hệ thống đích; nếu quyền đã được cấp, hãy thu hồi hoặc tạm ngừng và ghi kết quả.`, // MSG-10
  HANDOVER_INCOMPLETE: (items: string[]) =>
    `Thông tin bàn giao chưa đủ: ${items.join(", ")}. Nhiệm vụ chưa hoàn thành.`, // MSG-11
  CONDITIONS_CHANGED: (reason: string) =>
    `Điều kiện hoàn tất đã thay đổi: ${reason}. Yêu cầu chưa được đóng và đã chuyển về Chờ xử lý điều kiện còn thiếu.`, // MSG-12
  SYSTEM_ERROR: "Không thể ghi nhận do lỗi hệ thống. Trạng thái yêu cầu chưa thay đổi, vui lòng thử lại sau.", // MSG-13
  FORBIDDEN: "Bạn không có quyền truy cập chức năng này.", // MSG-15
  AR_DUPLICATE: (code: string) =>
    `Bạn đang có yêu cầu ${code} cho quyền này chưa kết thúc. Không thể gửi yêu cầu mới.`, // MSG-16
  AR_HAS_ACCESS: (name: string, level: string) =>
    `Bạn đã có quyền ${name} mức ${level}. Chỉ gửi nếu bạn cần mức quyền khác.`, // MSG-17
  AR_NO_APPROVER:
    "Chưa xác định được người duyệt vì bạn chưa có Manager trong cơ cấu tổ chức. Vui lòng liên hệ HR.", // MSG-18
  LAST_DAY_PAST:
    "Ngày làm việc cuối cùng đã qua. Quyền của nhân viên có thể vẫn đang hoạt động. Bạn có muốn đánh dấu nghỉ đột xuất để thu hồi ngay?", // MSG-22
  OFF_DUPLICATE: (code: string) => `Nhân viên này đã có yêu cầu offboarding đang xử lý: ${code}.`, // MSG-23
  REVOKE_EVIDENCE: "Vui lòng đính kèm bằng chứng thu hồi.", // MSG-25
} as const;
