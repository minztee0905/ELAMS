# USER STORIES VÀ ACCEPTANCE CRITERIA – ACCESS REQUEST & APPROVAL

**Dự án:** ELAMS

**Phiên bản:** 0.1 – Bản nháp

**Ngày tạo:** 26/11/2026

**Người thực hiện:** Business Analyst

**Trạng thái:** Chờ review – Chưa được xác nhận bởi stakeholder thực tế

**Đầu vào:** [Đặc tả Use Case Access Request](../use-case-specifications/access-request-use-cases.md), [BRD Access Request](../brd/brd-access-request.md), [Business Rules Catalog](../business-rules/business-rules-catalog.md)

---

## 1. Quy ước

Giống [User Stories Onboarding](onboarding-user-stories.md): mẫu "Là… tôi muốn… để…", AC theo Given/When/Then, mã `US-AC-xx.AC-n`, story point tương đối do BA đề xuất.

**Dữ liệu ví dụ:**

| Người | Vai trò | Ghi chú |
| --- | --- | --- |
| Nguyễn Văn An | Employee, Kế toán viên, phòng Kế toán | Đã có tài khoản MISA mức Xem từ khi onboarding |
| Trần Thị Bình | Manager phòng Kế toán | Manager trực tiếp của An |
| Phan Văn Đức | Giám đốc Tài chính | Cấp trên trực tiếp của Bình |
| Võ Thanh Hải | Security Approver | |
| Phạm Quốc Dũng | IT Staff | |

| Quyền trong danh mục | Hệ thống | Nhạy cảm |
| --- | --- | --- |
| CRM nội bộ | CRM | Không |
| Phần mềm kế toán – mức Ghi | MISA | Có (dữ liệu tài chính) |

## 2. Tổng hợp

| Mã | Story | Vai trò | UC | BREQ | Ưu tiên | Điểm |
| --- | --- | --- | --- | --- | --- | --- |
| US-AC-01 | Gửi yêu cầu cấp quyền | Employee | UC-AC-01 | 01 | Must | 5 |
| US-AC-02 | Manager xin quyền cho chính mình | Manager | UC-AC-01 | 02 | Must | 2 |
| US-AC-03 | Phê duyệt yêu cầu cấp quyền | Manager | UC-AC-04 | 02, 04, 08 | Must | 3 |
| US-AC-04 | Từ chối hoặc yêu cầu bổ sung | Manager | UC-AC-04 | 02, 08 | Must | 3 |
| US-AC-05 | Bổ sung thông tin hoặc hủy yêu cầu | Employee | UC-AC-02 | 03 | Must | 3 |
| US-AC-06 | Xét duyệt quyền nhạy cảm | Security | UC-AC-05 | 04, 08 | Must | 3 |
| US-AC-07 | Cấp quyền với tài khoản đúng | IT | UC-AC-06 | 05, 06 | Must | 5 |
| US-AC-08 | Ghi nhận lỗi cấp quyền | IT | UC-AC-06 | 06 | Must | 3 |
| US-AC-09 | Theo dõi yêu cầu | Employee, Manager | UC-AC-03 | 07 | Must | 2 |
| US-AC-10 | Nhận cảnh báo quá hạn | Manager, Security, IT | UC-AC-07 | 09 | Should | 3 |

Tổng: 10 story, 32 điểm (Must 29, Should 3), 40 AC.

---

## 3. Chi tiết

### US-AC-01 – Gửi yêu cầu cấp quyền

**Là** nhân viên, **tôi muốn** gửi yêu cầu cấp quyền trên một biểu mẫu chuẩn **để** không phải email qua lại và biết ngay ai sẽ duyệt.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | An mở biểu mẫu | An chọn quyền Phần mềm kế toán – mức Ghi | ELAMS hiển thị hệ thống MISA, nhãn Nhạy cảm và cấp phê duyệt dự kiến Manager → Security → IT | BR-AC-03 |
| AC-2 | An chọn quyền CRM nội bộ nhưng để trống lý do sử dụng | An gửi yêu cầu | Yêu cầu không được tạo; trường lý do được chỉ ra | BR-AC-01 |
| AC-3 | Biểu mẫu đủ thông tin | An gửi yêu cầu CRM nội bộ | Yêu cầu ở trạng thái Chờ Manager duyệt; Bình nhận nhiệm vụ xét duyệt có hạn xử lý | BR-GEN-01 |
| AC-4 | An đang có yêu cầu CRM nội bộ ở trạng thái Chờ Manager duyệt | An gửi thêm một yêu cầu CRM nội bộ | Yêu cầu không được tạo; ELAMS hiển thị mã yêu cầu hiện có | BR-AC-07 |
| AC-5 | An đã có quyền MISA mức Xem | An gửi yêu cầu MISA mức Ghi | ELAMS cảnh báo An đã có quyền MISA mức Xem; An xác nhận thì yêu cầu được tạo | BR-AC-07 |
| AC-6 | Một nhân viên chưa có Manager trong cơ cấu tổ chức | Nhân viên đó gửi yêu cầu | Yêu cầu không được tạo; ELAMS báo liên hệ HR | – |

### US-AC-02 – Manager xin quyền cho chính mình

**Là** Manager, **tôi muốn** yêu cầu của tôi được cấp trên duyệt **để** không ai tự duyệt quyền cho chính mình.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Bình là Manager, cấp trên trực tiếp là Đức | Bình gửi yêu cầu CRM nội bộ | Đức nhận nhiệm vụ xét duyệt; Bình không có nhiệm vụ xét duyệt cho yêu cầu này | BR-AC-06 |
| AC-2 | Như AC-1 | Bình mở yêu cầu của mình | Không có nút Phê duyệt, Từ chối hay Yêu cầu bổ sung | BR-AC-06 |

### US-AC-03 – Phê duyệt yêu cầu cấp quyền

**Là** Manager, **tôi muốn** thấy đủ thông tin và phê duyệt yêu cầu trong một nơi **để** quyết định nhanh và đúng.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu MISA mức Ghi của An chờ Bình duyệt | Bình mở yêu cầu | Thấy quyền, hệ thống, mức quyền, lý do, nhãn Nhạy cảm, cấp phê duyệt dự kiến và quyền MISA mức Xem hiện có của An | BR-AC-03 |
| AC-2 | Yêu cầu CRM nội bộ (không nhạy cảm) chờ Bình duyệt | Bình phê duyệt | Yêu cầu chuyển Chờ cấp quyền; IT nhận nhiệm vụ cấp quyền | BR-AC-04 |
| AC-3 | Yêu cầu MISA mức Ghi (nhạy cảm) chờ Bình duyệt | Bình phê duyệt | Yêu cầu chuyển Chờ Security duyệt; Hải nhận nhiệm vụ; IT chưa có nhiệm vụ | BR-AC-03, BR-AC-04 |
| AC-4 | Bất kỳ yêu cầu nào | Bình phê duyệt | Lịch sử lưu người duyệt, kết quả và thời điểm | BR-GEN-03 |

### US-AC-04 – Từ chối hoặc yêu cầu bổ sung

**Là** Manager, **tôi muốn** từ chối hoặc yêu cầu bổ sung kèm lý do **để** người yêu cầu biết vì sao và cần làm gì.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu CRM nội bộ chờ Bình duyệt | Bình từ chối với lý do "Công việc hiện tại không cần CRM" | Yêu cầu chuyển Bị từ chối; An nhận thông báo kèm lý do | BR-GEN-02 |
| AC-2 | Như AC-1 | Bình từ chối hoặc yêu cầu bổ sung mà không nhập lý do | Quyết định không được lưu | BR-GEN-02, BR-AC-02 |
| AC-3 | Như AC-1 | Bình yêu cầu bổ sung "Ghi rõ khách hàng cần theo dõi" | Yêu cầu chuyển Chờ bổ sung; An nhận thông báo kèm nội dung cần bổ sung | BR-AC-02 |

### US-AC-05 – Bổ sung thông tin hoặc hủy yêu cầu

**Là** nhân viên, **tôi muốn** bổ sung thông tin hoặc hủy yêu cầu khi Manager hỏi lại **để** yêu cầu tiếp tục được xử lý hoặc kết thúc rõ ràng.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu CRM nội bộ của An ở trạng thái Chờ bổ sung | An mở yêu cầu | Thấy nội dung Bình yêu cầu bổ sung | BR-GEN-02 |
| AC-2 | Như AC-1 | An sửa lý do sử dụng và gửi lại | Yêu cầu quay về Chờ Manager duyệt với cùng mã yêu cầu; lịch sử giữ lần yêu cầu bổ sung trước | BR-AC-02, BR-GEN-03 |
| AC-3 | Như AC-1 | An cố đổi quyền sang một quyền khác | ELAMS không cho đổi quyền | – |
| AC-4 | Như AC-1 | An hủy yêu cầu | Yêu cầu chuyển Đã hủy; Bình được thông báo | BR-AC-02 |
| AC-5 | Như AC-1 | An không phản hồi sau 30 ngày | Yêu cầu vẫn ở Chờ bổ sung, không tự hủy | BR-AC-02 |

### US-AC-06 – Xét duyệt quyền nhạy cảm

**Là** Security Approver, **tôi muốn** chỉ xét duyệt quyền nhạy cảm đã được Manager duyệt **để** kiểm soát quyền rủi ro cao mà không xử lý yêu cầu chưa qua Manager.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Bình đã phê duyệt yêu cầu MISA mức Ghi | Hải mở nhiệm vụ | Thấy quyết định của Bình và lý do sử dụng của An | BR-AC-03 |
| AC-2 | Như AC-1 | Hải phê duyệt | Yêu cầu chuyển Chờ cấp quyền; IT nhận nhiệm vụ | BR-AC-04 |
| AC-3 | Như AC-1 | Hải từ chối với lý do | Yêu cầu chuyển Bị từ chối; An nhận thông báo kèm lý do | BR-GEN-02 |
| AC-4 | Như AC-1 | Hải xem các lựa chọn | Chỉ có Phê duyệt và Từ chối, không có Yêu cầu bổ sung | – (giả định Q-36) |
| AC-5 | Yêu cầu MISA mức Ghi đang Chờ Manager duyệt | – | Hải không có nhiệm vụ cho yêu cầu này | BR-AC-03 |

### US-AC-07 – Cấp quyền với tài khoản đúng

**Là** nhân viên IT, **tôi muốn** biết yêu cầu đã đủ phê duyệt và người yêu cầu đã có tài khoản hay chưa **để** cấp đúng quyền, không tạo trùng tài khoản.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Yêu cầu MISA mức Ghi đã đủ phê duyệt của Bình và Hải | Dũng mở nhiệm vụ | Thấy hai phê duyệt và tài khoản MISA đã ghi nhận của An | BR-AC-04, BR-ON-10 |
| AC-2 | Như AC-1 | Dũng xử lý | ELAMS chọn sẵn dùng lại tài khoản đã ghi nhận; không có lựa chọn tạo tài khoản mới | BR-ON-10 |
| AC-3 | Yêu cầu CRM nội bộ đã đủ phê duyệt; An chưa có tài khoản CRM | Dũng tạo tài khoản, cấp quyền, ghi kết quả thành công kèm bằng chứng | Yêu cầu chuyển Đã cấp; An nhận thông báo | BR-AC-05 |
| AC-4 | Như AC-3 | Dũng ghi kết quả thành công nhưng không có bằng chứng | Kết quả không được lưu | BR-AC-05 |

### US-AC-08 – Ghi nhận lỗi cấp quyền

**Là** nhân viên IT, **tôi muốn** ghi nhận khi cấp quyền thất bại hoặc chưa xác định được tài khoản **để** yêu cầu không bị coi là đã cấp khi chưa xong.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Dũng không xác định được An đã có tài khoản CRM hay chưa | Dũng ghi kết quả "chưa xác định" kèm lý do | Yêu cầu giữ Chờ cấp quyền; không có tài khoản mới nào được ghi nhận | BR-ON-10 |
| AC-2 | Cấp quyền CRM thất bại | Dũng ghi thất bại và lý do | Yêu cầu giữ Chờ cấp quyền, không chuyển Đã cấp; An thấy yêu cầu đang được IT xử lý | BR-AC-05 |
| AC-3 | Như AC-2 | Dũng khắc phục và xử lý lại | ELAMS đưa Dũng về bước kiểm tra tài khoản trước khi cấp | BR-ON-10 |

### US-AC-09 – Theo dõi yêu cầu

**Là** nhân viên hoặc Manager, **tôi muốn** xem yêu cầu đang ở bước nào **để** không phải hỏi qua email.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | An có yêu cầu MISA mức Ghi đang Chờ Security duyệt | An mở danh sách yêu cầu của mình | Thấy trạng thái, người đang giữ (Hải) và hạn | BR-GEN-01 |
| AC-2 | Yêu cầu CRM nội bộ của An bị từ chối | An mở yêu cầu | Thấy người từ chối, lý do và thời điểm | BR-GEN-02 |
| AC-3 | Bình là Manager phòng Kế toán | Bình mở danh sách yêu cầu | Thấy yêu cầu của nhân viên phòng Kế toán; không thấy yêu cầu của phòng khác | – (giả định Q-33) |
| AC-4 | Một nhân viên phòng Kế toán không phải Manager | Người đó tìm yêu cầu của An | Không thấy yêu cầu của An | – |

### US-AC-10 – Nhận cảnh báo quá hạn (Should)

**Là** người xét duyệt hoặc người cấp quyền, **tôi muốn** được báo khi nhiệm vụ của tôi quá hạn **để** người yêu cầu không phải chờ lâu.

| AC | Given | When | Then | Quy tắc |
| --- | --- | --- | --- | --- |
| AC-1 | Nhiệm vụ xét duyệt CRM nội bộ của Bình hạn 30/11/2026, chưa xử lý | Qua hạn | Nhiệm vụ được đánh dấu Quá hạn; Bình nhận cảnh báo | BR-GEN-01 |
| AC-2 | Đã gửi cảnh báo cho nhiệm vụ trên | ELAMS kiểm tra lại, hạn không đổi | Không gửi cảnh báo lần hai | BR-GEN-01 |
| AC-3 | Yêu cầu của An đang Chờ bổ sung 10 ngày | ELAMS kiểm tra quá hạn | Không gửi cảnh báo; danh sách hiển thị "Chờ bổ sung 10 ngày" | BR-AC-02 |
| AC-4 | Dũng đã cấp quyền trước hạn | Đến hạn | Không có cảnh báo | BR-GEN-01 |

**Giả định:** cách tính SLA và người nhận escalation chờ Q-01, Q-05.

---

## 4. Độ phủ

| Quy tắc | Story kiểm chứng |
| --- | --- |
| BR-AC-01 | US-AC-01 |
| BR-AC-02 | US-AC-04, 05, 10 |
| BR-AC-03 | US-AC-01, 03, 06 |
| BR-AC-04 | US-AC-03, 06, 07 |
| BR-AC-05 | US-AC-07, 08 |
| BR-AC-06 | US-AC-02 |
| BR-AC-07 | US-AC-01 |
| BR-GEN-01 | US-AC-01, 09, 10 |
| BR-GEN-02 | US-AC-04, 05, 06, 09 |
| BR-GEN-03 | US-AC-03, 05 |
| BR-ON-10 | US-AC-07, 08 |

Mọi quy tắc BR-AC đều có ít nhất một AC kiểm chứng.
