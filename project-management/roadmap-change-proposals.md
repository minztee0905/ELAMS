# ĐỀ XUẤT ĐIỀU CHỈNH ROADMAP VÀ HỒ SƠ ELAMS

**Dự án:** Employee Lifecycle & Access Management System (ELAMS)

**Phiên bản:** 1.0

**Ngày tạo:** 21/11/2026

**Người đề xuất:** Trợ lý hỗ trợ phân tích

**Người duyệt:** Business Analyst (chủ dự án)

**Trạng thái:** Đã duyệt toàn bộ ngày 21/11/2026 – Đã áp dụng (xem mục 9)

---

## 1. Mục đích và cách duyệt

Tài liệu tổng hợp các đề xuất chỉnh sửa sau khi rà soát toàn bộ workspace và roadmap 24 Task. Mục tiêu của dự án dùng làm chuẩn đánh giá: **hoàn thiện một hồ sơ BA cho dự án nhỏ để đưa vào CV ứng tuyển Business Analyst Intern.**

Cách duyệt: với mỗi đề xuất, điền cột **Quyết định** bằng một trong các giá trị:

- **Duyệt** – áp dụng như đề xuất.
- **Duyệt có sửa** – áp dụng sau khi chỉnh theo ghi chú.
- **Không duyệt** – giữ nguyên hiện trạng.
- **Hoãn** – xem xét lại ở giai đoạn sau.

Chỉ những đề xuất được duyệt mới được thực hiện. Mọi thay đổi sẽ ghi rõ tài liệu bị tác động.

## 2. Tóm tắt đánh giá

| Nội dung | Đánh giá |
| --- | --- |
| Chủ đề dự án | Phù hợp cho CV BA Intern; giữ nguyên chủ đề. |
| Trình tự roadmap | Đúng vòng đời BA, không cần thay đổi thứ tự giai đoạn. |
| Điểm mạnh hiện có | Truy vết PP → BG → GAP → IMP; phân biệt rõ giả định và yêu cầu đã xác nhận. |
| Rủi ro chính | Task 08 đi quá sâu vào kỹ thuật; 24 Task có trọng số như nhau; làm theo chiều ngang nên chậm có sản phẩm hoàn chỉnh; Portfolio đặt cuối. |

## 3. Đề xuất về roadmap

| Mã | Đề xuất | Lý do | Tác động | Quyết định | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| RM-01 | Giữ BPMN To-Be ở **mức nghiệp vụ**: ai làm gì, điểm quyết định, ngoại lệ, vị trí hệ thống hỗ trợ. Chuyển nội dung kỹ thuật sang ghi chú triển khai riêng (xem chi tiết ở mục 3.1). | Nội dung Camunda job worker, retry/Incident, idempotency, revision thuộc vai trò architect/dev; khó bảo vệ khi phỏng vấn BA và làm Task 08 kéo dài. | Sửa [design decisions Onboarding To-Be](../requirements/design-decisions/onboarding-to-be-design-decisions.md); tạo ghi chú kỹ thuật mới. BPMN có thể giữ nguyên hoặc lược bớt nhãn kỹ thuật. | Duyệt | |
| RM-02 | Đặt giới hạn thời gian cho Task 08. Onboarding To-Be chốt ở bản hiện tại sau khi áp dụng RM-01; Access Request và Offboarding To-Be làm ở mức chi tiết thấp hơn Onboarding. | Hiện mới xong 1/3 quy trình To-Be; độ sâu như Onboarding cho cả ba quy trình tốn nhiều thời gian mà giá trị CV tăng ít. | Thay đổi phạm vi Task 08. | Duyệt | |
| RM-03 | Làm theo **lát cắt dọc**: hoàn thành toàn bộ chuỗi sản phẩm cho quy trình Onboarding trước (To-Be → Business Rules → BRD rút gọn → Use Case/User Story + AC → Wireframe → RTM → UAT), sau đó mới mở rộng sang hai quy trình còn lại. | Có một case study trọn vẹn để nộp CV sớm; quy trình sau làm nhanh hơn nhờ tái sử dụng khung. | Thay đổi thứ tự thực hiện Task 09–22 (xem mục 5). | Duyệt | |
| RM-04 | Phân mức ưu tiên sản phẩm bàn giao thành **Cốt lõi** và **Rút gọn** (xem mục 3.2). | Nhà tuyển dụng thường chỉ xem portfolio vài phút; không phải sản phẩm nào cũng cần cùng độ sâu. | Điều chỉnh danh sách sản phẩm tại [Project Charter](project-charter.md), mục 7. | Duyệt | |
| RM-05 | Bắt đầu Portfolio (Task 23–24) ngay sau khi xong lát cắt Onboarding: viết trang case study một trang và README dẫn tới 5–6 tài liệu tiêu biểu. | Đây là phần người xem thực sự đọc; không nên để cuối dự án. | Đưa Task 23–24 lên trước phần mở rộng. | Duyệt | |
| RM-06 | Xác định giai đoạn lập trình (frontend, backend, database, workflow) là **tùy chọn**, chỉ thực hiện sau khi portfolio BA đã có thể gửi đi. | Không bắt buộc với CV BA Intern; prototype Figma đủ chứng minh năng lực. Lập trình sớm dễ làm chậm phần BA. | Cập nhật ghi chú tại [README](../README.md) và [implementation](../implementation/). | Duyệt | |
| RM-07 | Ở Phase 5 – Validation, mời ít nhất một người thật (BA, mentor, bạn làm HR/IT) review vài tài liệu; ghi lại góp ý, cách xử lý và phiên bản thay đổi. | Toàn bộ stakeholder hiện là giả lập; một vòng review thật tạo câu chuyện phỏng vấn mạnh và bằng chứng làm việc với phản hồi. | Bổ sung sản phẩm "Review log" trong [validation](../validation/). | Duyệt | |
| RM-08 | (Tùy chọn) Viết bản tóm tắt case study bằng tiếng Anh. | Cần khi ứng tuyển công ty nước ngoài hoặc người tuyển dụng không đọc tiếng Việt. Tài liệu chi tiết vẫn giữ tiếng Việt. | Thêm một file tóm tắt ở Phase 6. | Duyệt | |

### 3.1. Chi tiết RM-01 – Nội dung đề xuất tách khỏi tài liệu BA

Nội dung trong [design decisions Onboarding To-Be](../requirements/design-decisions/onboarding-to-be-design-decisions.md) đề xuất chuyển sang ghi chú triển khai (ví dụ `implementation/workflow/onboarding-technical-notes.md`). Nội dung được chuyển, không bị xóa:

| Nội dung | Đề xuất |
| --- | --- |
| BR-ON-01 đến BR-ON-07, BR-ON-09, BR-ON-10 (phần nghiệp vụ) | Giữ lại, làm đầu vào cho Business Rules Catalog (Task 09). |
| BR-ON-08 | Giữ ý nghiệp vụ "HR xác nhận rồi mới đóng; điều kiện thay đổi thì quay về chờ". Chuyển phần Boundary Error, retry, Incident sang ghi chú kỹ thuật. |
| Đoạn "Đối với lỗi kỹ thuật, worker báo fail job…" và các liên kết Camunda | Chuyển sang ghi chú kỹ thuật. |
| Đoạn về idempotency, kiểm soát đồng thời giữa các quy trình độc lập | Giữ một câu ở mức yêu cầu ("không tạo trùng tài khoản cho cùng nhân viên/hệ thống đích"); chi tiết chuyển sang ghi chú kỹ thuật. |
| SRS-ON-01, SRS-ON-04 | Giữ lại, làm đầu vào cho SRS ở mức yêu cầu. |
| SRS-ON-02, SRS-ON-03, SRS-ON-05, SRS-ON-06, SRS-ON-07 | Chuyển sang ghi chú kỹ thuật; nếu cần, để lại một dòng yêu cầu phi chức năng tương ứng trong SRS. |

### 3.2. Chi tiết RM-04 – Mức ưu tiên sản phẩm bàn giao

| Mức | Sản phẩm | Mức độ đề xuất |
| --- | --- | --- |
| Cốt lõi | BPMN As-Is/To-Be | Đầy đủ cho 3 quy trình (To-Be của Access Request và Offboarding ở mức nghiệp vụ) |
| Cốt lõi | Business Rules Catalog | Đầy đủ cho phạm vi MVP |
| Cốt lõi | BRD | Bản rút gọn, khoảng 8–12 trang |
| Cốt lõi | Use Case Diagram và đặc tả Use Case | Sơ đồ tổng thể; 4–6 đặc tả cho các use case chính |
| Cốt lõi | User Stories và Acceptance Criteria | Theo các module Must |
| Cốt lõi | Wireframe/Prototype Figma | Các luồng chính của lát cắt Onboarding và Approval Inbox |
| Cốt lõi | RTM | Liên kết BG → REQ → Use Case/Story → Màn hình → UAT |
| Rút gọn | SRS | Tập trung yêu cầu chức năng và phi chức năng chính |
| Rút gọn | ERD | Mức khái niệm/logic, kèm data dictionary ngắn |
| Rút gọn | Activity, Sequence, State Diagram | Mỗi loại 1 sơ đồ tiêu biểu (ví dụ State của Access Item: COMPLETED/REJECTED/BLOCKED) |
| Rút gọn | UAT Test Cases | Khoảng 10–15 test case cho các luồng chính và ngoại lệ quan trọng |

## 4. Đề xuất về tài liệu hiện có

| Mã | Đề xuất | Hiện trạng | Tác động | Quyết định | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| DOC-01 | Gộp tất cả câu hỏi mở vào một **Open Questions Log** duy nhất (đề xuất `discovery/open-questions-log.md`), đánh mã mới thống nhất, ghi nguồn, stakeholder cần xác nhận, trạng thái và bảng đối chiếu mã cũ → mã mới. | Mã trùng nhưng khác nội dung: OQ-001…008 ở [business-goals-kpis-and-scope.md](../discovery/business-goals-kpis-and-scope.md) khác OQ-001…008 ở [interview-notes.md](../discovery/interview-notes.md). Ngoài ra có OQ-009…015 ở [as-is-process-analysis.md](../process-models/as-is-process-analysis.md), GA-01…08 ở [pain-point-and-gap-analysis.md](../process-models/pain-point-and-gap-analysis.md) và các câu hỏi chưa đánh mã ở design decisions Onboarding To-Be. Một số câu trùng ý (ví dụ cách tính SLA, phân loại quyền nhạy cảm). | Tạo file mới; các tài liệu nguồn giữ bảng nhưng thêm ghi chú dẫn sang log hoặc cập nhật mã. | Duyệt | |
| DOC-02 | Xuất lại các PNG Onboarding To-Be từ Camunda Modeler sau khi chốt BPMN. | Tài liệu design decisions đã ghi nhận PNG xuất trước bản sửa hiện hành. | 4 file PNG trong [to-be/onboarding](../process-models/to-be/onboarding/). Việc xuất do BA thực hiện trên Camunda Modeler. | Duyệt | |
| DOC-03 | Thay tham chiếu "Task xx" bằng tên và liên kết tài liệu cụ thể. | [requirement-elicitation.md](../discovery/requirement-elicitation.md) dòng 221 (Task 03); [as-is-process-analysis.md](../process-models/as-is-process-analysis.md) dòng 28 (Task 03) và 329 (Task 06); [pain-point-and-gap-analysis.md](../process-models/pain-point-and-gap-analysis.md) dòng 309 (Task 08); design decisions Onboarding To-Be dòng 79 (Task 09). Người đọc ngoài dự án không biết các số Task này. | Sửa 5 vị trí. | Duyệt | |
| DOC-04 | (Tùy chọn) Khởi tạo Git cho workspace và đưa lên GitHub khi portfolio sẵn sàng. | Workspace chưa là Git repository. | Có lịch sử phiên bản và đường link portfolio. Không ảnh hưởng nội dung tài liệu. | Duyệt | |
| DOC-05 | Thêm bảng roadmap và trạng thái Task vào [README](../README.md) hoặc một file roadmap riêng trong `project-management/`. | Roadmap 24 Task hiện chưa được lưu trong workspace. | Tạo hoặc sửa 1 file. | Duyệt | |

## 5. Roadmap đề xuất sau điều chỉnh

Áp dụng nếu RM-01 đến RM-06 được duyệt. Số Task trong ngoặc là số Task tương ứng trong roadmap gốc.

| Bước | Nội dung | Task gốc liên quan | Kết quả cuối bước |
| --- | --- | --- | --- |
| A | Chốt Onboarding To-Be ở mức nghiệp vụ; tách ghi chú kỹ thuật; gộp Open Questions Log | 08, DOC-01 | BPMN Onboarding To-Be ổn định |
| B | Lát cắt Onboarding: Business Rules → BRD rút gọn → Use Case + User Stories/AC → Wireframe → RTM → UAT | 09, 10, 11–16 (phần Onboarding), 17–18, 19–22 (phần Onboarding) | Một bộ hồ sơ hoàn chỉnh cho một quy trình |
| C | Viết case study, README portfolio; **bắt đầu nộp CV** | 23–24 | Portfolio có thể gửi đi |
| D | Mở rộng sang Access Request và Offboarding (To-Be mức nghiệp vụ, tái sử dụng khung từ bước B) | 08, 09–22 (phần còn lại) | Hồ sơ phủ 3 quy trình |
| E | Hoàn thiện SRS, ERD, sơ đồ bổ sung; review với người thật | 11–16, 19–22 | Hồ sơ đầy đủ, có bằng chứng review |
| F | (Tùy chọn) Lập trình MVP | Ngoài roadmap BA | Bản demo phần mềm |

## 6. Đề xuất về cách trình bày trên CV

| Mã | Đề xuất | Quyết định | Ghi chú |
| --- | --- | --- | --- |
| CV-01 | Ghi ELAMS là **dự án BA cá nhân, doanh nghiệp giả định**; không trình bày như dự án thật cho công ty thật. | Duyệt | |
| CV-02 | Viết bullet theo kết quả và kỹ năng, không liệt kê tên tài liệu. Chỉ đưa vào CV những sản phẩm đã thực sự hoàn thành. | Duyệt | |
| CV-03 | Chuẩn bị giải thích được lý do của các quyết định nghiệp vụ chính (ví dụ vì sao Security duyệt sau Manager, vì sao chặn đóng offboarding khi thiếu thiết bị). | Duyệt | |

Mẫu bullet tham khảo (bullet 2 và 3 chỉ dùng khi đã có sản phẩm tương ứng):

> **ELAMS – Employee Lifecycle & Access Management** *(Dự án BA cá nhân, doanh nghiệp giả định)*
>
> - Phân tích 3 quy trình Onboarding, Offboarding, Access Approval với 6 nhóm stakeholder; xác định 15 pain point và 21 gap.
> - Mô hình hóa BPMN As-Is/To-Be, xây dựng Business Rules, User Stories kèm Acceptance Criteria và ma trận truy vết.
> - Thiết kế wireframe/prototype Figma cho các luồng chính.
> - Link: [portfolio/case study]

## 7. Nội dung giữ nguyên

- Chủ đề dự án và doanh nghiệp giả định TechNova.
- Trình tự các giai đoạn của roadmap.
- Cách ghi trạng thái "giả định / chưa xác nhận" trong tài liệu.
- Ngôn ngữ chính là tiếng Việt, giữ thuật ngữ tiếng Anh khi cần.
- Nội dung As-Is, Gap Analysis và Discovery (ngoài DOC-01 và DOC-03).

## 8. Bước tiếp theo sau khi duyệt

1. Cập nhật cột Quyết định trong tài liệu này.
2. Thực hiện các đề xuất được duyệt theo thứ tự: DOC-03 → DOC-01 → RM-01 → DOC-05; các đề xuất về roadmap áp dụng khi lập kế hoạch Task tiếp theo.
3. Ghi lại thay đổi vào phiên bản tài liệu tương ứng.

## 9. Kết quả thực hiện (21/11/2026)

| Mã | Kết quả | Tài liệu |
| --- | --- | --- |
| DOC-03 | Đã thay 5 tham chiếu "Task xx" bằng tên và liên kết tài liệu. | requirement-elicitation.md, as-is-process-analysis.md, pain-point-and-gap-analysis.md, onboarding-to-be-design-decisions.md |
| DOC-01 | Đã tạo Open Questions Log với 33 câu hỏi `Q-01`…`Q-33` và bảng đối chiếu mã cũ. Các tài liệu nguồn giữ bảng cũ và có ghi chú dẫn sang log. | [open-questions-log.md](../discovery/open-questions-log.md) |
| RM-01 | Design decisions nâng lên bản 0.5, giữ mức nghiệp vụ. Nội dung kỹ thuật chuyển nguyên ý sang ghi chú kỹ thuật. File BPMN giữ nguyên. | [onboarding-to-be-design-decisions.md](../requirements/design-decisions/onboarding-to-be-design-decisions.md), [onboarding-technical-notes.md](../implementation/workflow/onboarding-technical-notes.md) |
| DOC-05, RM-02, RM-03, RM-05, RM-08 | Đã tạo roadmap 1.1 gồm bảng 24 Task gốc và thứ tự thực hiện A–F. | [roadmap.md](roadmap.md) |
| RM-04 | Đã bổ sung mức Cốt lõi/Rút gọn cho sản phẩm bàn giao. | [project-charter.md](project-charter.md), mục 7 |
| RM-06 | Đã ghi giai đoạn lập trình là tùy chọn. | [README](../README.md), [implementation](../implementation/) |
| RM-07 | Đã tạo mẫu Review Log. | [review-log.md](../validation/review-log.md) |
| DOC-04 | Đã khởi tạo Git và thêm `.gitignore`; chưa tạo commit, chưa đưa lên GitHub. | `.gitignore` |
| DOC-02 | **Chưa thực hiện** – PNG cũ đã xoá; BA xuất lại bằng Camunda Modeler sau khi rà soát BPMN (xem mục 10). | [process-models](../process-models/) |
| CV-01–CV-03 | Áp dụng khi viết CV và case study ở bước C của roadmap. | – |

## 10. Bổ sung: rút gọn BPMN (21/11/2026)

Sau khi rà soát độ phức tạp của bốn sơ đồ BPMN, BA yêu cầu rút gọn ba sơ đồ, sau đó chuẩn hóa thêm As-Is Access Request để bốn sơ đồ đồng bộ.

| Mã | Nội dung | Kết quả | Tài liệu |
| --- | --- | --- | --- |
| BPMN-01 | Rút gọn To-Be Onboarding về mức nghiệp vụ, trọng tâm là Sub_Access | Đã thực hiện: 50 → 27 task, 18 → 12 gateway; Sub_Access 22 → 9 task | [to-be-onboarding.bpmn](../process-models/to-be/onboarding/to-be-onboarding.bpmn), [design decisions 0.5](../requirements/design-decisions/onboarding-to-be-design-decisions.md) |
| BPMN-02 | Làm lại As-Is Offboarding đúng hiện trạng thủ công; chuyển kiểm soát mới sang To-Be | Đã thực hiện: 35 → 23 task, 11 → 8 gateway (tính cả sơ đồ con) | [as-is-offboarding.bpmn](../process-models/as-is/offboarding/as-is-offboarding.bpmn) |
| BPMN-03 | Tối ưu As-Is Onboarding: thu phần phê duyệt quyền thành Call Activity tham chiếu AS-02 | Đã thực hiện: 26 → 19 task + 1 Call Activity; bỏ lane Security; luồng chính còn 3 gateway | [as-is-onboarding.bpmn](../process-models/as-is/onboarding/as-is-onboarding.bpmn) |
| BPMN-04 | Chuẩn hóa As-Is Access Request theo cùng cách trình bày | Đã thực hiện: giữ nguyên logic; gộp hai bước "Chuyển yêu cầu đã duyệt đến IT" và gateway hội tụ vào bước IT nhận email và kiểm tra phê duyệt (19 → 17 task, 8 → 7 gateway) | [as-is-access-request-approval.bpmn](../process-models/as-is/access-request/as-is-access-request-approval.bpmn) |
| BPMN-05 | Tạo To-Be Access Request ở mức nghiệp vụ (đưa phần BPMN của bước D lên sớm theo yêu cầu của BA) | Đã thực hiện: 8 task, 5 gateway, 20 luồng; thống nhất logic với Sub_Access của Onboarding | [to-be-access-request-approval.bpmn](../process-models/to-be/access-request/to-be-access-request-approval.bpmn), [design decisions](../requirements/design-decisions/access-request-to-be-design-decisions.md) |
| BPMN-06 | Tạo To-Be Offboarding ở mức nghiệp vụ | Đã thực hiện: 17 task, 8 gateway, 43 luồng; 3 nhánh con và event subprocess đổi ngày | [to-be-offboarding.bpmn](../process-models/to-be/offboarding/to-be-offboarding.bpmn), [design decisions](../requirements/design-decisions/offboarding-to-be-design-decisions.md) |

Bản trước khi rút gọn có trong lịch sử Git. Toàn bộ PNG đã được xoá theo yêu cầu của BA; BA sẽ xuất lại.
