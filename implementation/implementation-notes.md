# Ghi chú triển khai – ELAMS

Ứng dụng web chạy được, xây từ SRS, ERD, đặc tả màn hình và UAT của dự án. Mã nguồn nằm ở [web/](web/).

## 1. Công nghệ

| Phần | Công nghệ |
| --- | --- |
| Web, API | Next.js 16 (App Router, Server Actions), TypeScript |
| Cơ sở dữ liệu | PostgreSQL 16, Prisma |
| Giao diện | Tailwind CSS, theo wireframe Figma |
| Kiểm thử | Vitest (quy tắc nghiệp vụ), Playwright (đầu-cuối trên trình duyệt) |

## 2. Chạy trên máy

Cần Node.js 20 trở lên và PostgreSQL 16.

```bash
cd implementation/web
npm install
cp .env.example .env          # sửa USER trong DATABASE_URL
createdb elams && createdb elams_test
npm run db:migrate            # tạo 23 bảng và ràng buộc
npm run db:demo               # dữ liệu mẫu theo nhân vật UAT
npm run dev                   # http://localhost:3000
```

Đăng nhập demo: chọn một người dùng mẫu (Hà – HR, Bình – Manager, Dũng – IT, Hải – Security, Mai – Employee, Quản trị viên – Admin…). Khung **Đồng hồ demo** ở thanh bên cho phép giả lập thời gian, ví dụ chuyển sang 18:00 ngày nghỉ việc để thấy thu hồi quyền tự kích hoạt.

| Lệnh | Việc |
| --- | --- |
| `npm run db:seed` | Xóa dữ liệu, tạo lại dữ liệu mẫu cơ bản |
| `npm run db:demo` | Như trên, thêm một onboarding bị chặn và một offboarding đột xuất |
| `npm test` | 37 kiểm thử quy tắc nghiệp vụ (cần chạy `npm run db:test:prepare` một lần) |
| `npm run test:e2e` | 5 kịch bản trên trình duyệt (cần `npx playwright install chromium`) |

## 3. Cấu trúc mã

| Thư mục | Nội dung |
| --- | --- |
| `prisma/schema.prisma`, `migrations/` | Mô hình vật lý từ [từ điển dữ liệu](../data-models/data-dictionary.md); ràng buộc SRS mục 6 viết bằng SQL (CHECK, unique một phần, trigger chỉ thêm mới cho `audit_log`) |
| `src/server/` | Logic nghiệp vụ, không phụ thuộc giao diện: `onboarding.ts`, `access-request.ts`, `offboarding.ts`, `ledger.ts` (sổ quyền), `tasks.ts`, `scheduler.ts`, `authz.ts` (ma trận phân quyền) |
| `src/app/(app)/` | Màn hình theo mã SCR: `tasks` (SCR-ON-03, 04, 05, SCR-OFF-03, 04, 05), `onboarding` (SCR-ON-01, 02), `access-requests` (SCR-AC-01 → 03), `offboarding` (SCR-OFF-01, 02), `audit`, `admin` |
| `tests/` | Kiểm thử Vitest, mỗi nhóm đặt tên theo mã UAT |
| `e2e/` | Kịch bản Playwright cho ba quy trình |

## 4. Truy vết yêu cầu → mã

| Yêu cầu | Thực hiện |
| --- | --- |
| FR-GEN-01, NFR-01 | `proxy.ts`: bắt buộc đăng nhập, phiên trượt 30 phút; tài khoản DISABLED không đăng nhập được |
| FR-GEN-02, NFR-02 | `authz.ts` kiểm tra ở máy chủ; truy cập ngoài phạm vi hiển thị MSG-15 và ghi `UNAUTHORIZED_ACCESS` |
| FR-GEN-03 → 07 | `tasks.ts`, `scheduler.ts`: sắp xếp đột xuất → quá hạn → hạn; cảnh báo một lần cho mỗi hạn; nhắc sắp đến hạn |
| FR-GEN-09, 10 | `audit.ts`; trigger DB chặn sửa, xóa lịch sử |
| FR-GEN-12 | `settings.ts › nextCode`: mã ONB-/AR-/OFF- theo năm, cấp trong giao dịch |
| FR-GEN-14, 15 | `ledger.ts`: ghi sổ quyền khi cấp; một tài khoản mỗi hệ thống (UQ ở DB) |
| FR-ON-05, NFR-03, 04 | `tx.ts › inTx` (trọn gói) và `submission_key` (gửi lại không tạo trùng) |
| FR-ON-06 → 12 | `onboarding.ts`: xử lý lần lượt, BLOCKED cho quyền bắt buộc, điều chỉnh, kiểm tra phê duyệt còn hiệu lực |
| FR-ON-15, 16 | `evaluateOnboarding` chỉ chạy khi có dữ liệu mới (`data_rev`); `confirmOnboarding` khóa dòng và kiểm tra lại trước khi ghi |
| FR-AC-01 → 10 | `access-request.ts` |
| FR-OFF-03, 04 | Danh sách thu hồi lập từ sổ quyền; nhiệm vụ thu hồi chờ tới 18:00 ngày cuối, `scheduler.ts` kích hoạt |
| FR-OFF-06, 08 | Không có trạng thái ngoại lệ cho quyền; nhánh chỉ kết thúc khi mọi mục đã thu hồi hoặc vô hiệu hóa |
| FR-OFF-13 | Hoàn tất: nhân viên LEFT, tài khoản ELAMS DISABLED |

## 5. Giả định khi triển khai

Các câu hỏi còn mở trong [nhật ký câu hỏi](../discovery/open-questions-log.md) được chốt tạm như sau, cấu hình ở `src/server/settings.ts`:

| Câu hỏi | Giả định |
| --- | --- |
| Q-01, Q-03, Q-17 (hạn nhiệm vụ) | Xét duyệt, điều chỉnh: ngày tạo + 2. Cấp quyền: ngày bắt đầu − 2. Thiết bị: ngày bắt đầu − 3. Sắp đến hạn: trước 24 giờ. Lấy theo các mốc trong UAT |
| Q-01 (hạn thu hồi thường) | Thời điểm thu hồi + 4 giờ, bằng đột xuất |
| Q-37 (phê duyệt mất hiệu lực) | Khi quyền bị ngừng sử dụng, mức quyền đổi sau khi duyệt, hoặc quyền được đánh dấu nhạy cảm mà chưa có Security duyệt |
| Phân công IT, Security | Người mặc định theo cấu hình (Dũng, Hải); Khoa không nhận nhiệm vụ, đúng tiền điều kiện UAT |
| Email | Ghi thông báo trong ứng dụng; email được in ra log máy chủ (chưa có máy chủ email) |

Ngoài các cột trong từ điển dữ liệu, mô hình vật lý thêm một số cột kỹ thuật: `submission_key` (chống gửi trùng), `data_rev` và `conditions_checked_rev` (BR-ON-07), `approval_round` (các lần duyệt sau khi điều chỉnh), `case_code` và `title` trên `task`; cùng bảng `system_setting` cho cấu hình và đồng hồ demo.

## 6. Kiểm thử

- **Vitest, 37 test:** mỗi `describe` mang mã UAT (UAT-ON-01 → 16, UAT-AC-01 → 10, UAT-OFF-01 → 14), gọi trực tiếp logic nghiệp vụ trên database `elams_test`.
- **Playwright, 5 kịch bản:** đi hết Onboarding, Access Request, Offboarding qua giao diện với nhiều vai trò, gồm tải tệp, hộp thoại xác nhận, lỗi kiểm tra dữ liệu và phân quyền.

## 7. Giới hạn

- Chưa tích hợp hệ thống đích (đúng phạm vi SRS phát hành 1) và máy chủ email.
- Đăng nhập là chọn người dùng mẫu, không có mật khẩu.
- Chưa có dashboard KPI (BREQ-ON-13, ngoài phạm vi).
