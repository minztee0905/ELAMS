# Yêu cầu ELAMS

Lưu các tài liệu mô tả mục tiêu, hành vi hệ thống và điều kiện chấp nhận.

| Đầu ra dự kiến | Nội dung |
| --- | --- |
| BRD | Bài toán, mục tiêu, stakeholder, phạm vi và yêu cầu nghiệp vụ |
| SRS | Yêu cầu chức năng, phi chức năng, dữ liệu và giao tiếp bên ngoài |
| Business rules | Quy tắc nghiệp vụ, điều kiện áp dụng, ngoại lệ và nguồn |
| Danh sách và đặc tả use case | Actor, trigger, điều kiện trước/sau, luồng chính, thay thế và ngoại lệ |
| User story và acceptance criteria | Nhu cầu theo vai trò, giá trị và tiêu chí chấp nhận có thể kiểm chứng |
| Ma trận quyền | Vai trò, tài nguyên hoặc thao tác, phạm vi dữ liệu và điều kiện truy cập |

Mỗi yêu cầu có mã ổn định, nguồn và trạng thái. Tham chiếu quy tắc bằng mã thay vì chép lặp nội dung. BRD mô tả nhu cầu nghiệp vụ; SRS chi tiết hóa hành vi cần đáp ứng và liên kết về BRD.

## Vị trí tài liệu

| Thư mục | Nội dung |
| --- | --- |
| [brd](brd/) | Tài liệu yêu cầu nghiệp vụ |
| [srs](srs/) | Đặc tả yêu cầu phần mềm |
| [business-rules](business-rules/) | Danh mục quy tắc nghiệp vụ |
| [use-case-specifications](use-case-specifications/) | Đặc tả use case |
| [user-stories](user-stories/) | User story và acceptance criteria |
| [design-decisions](design-decisions/) | Các đề xuất và quyết định thiết kế cần truy vết |

Tài liệu hiện có: [BRD Onboarding](brd/brd-onboarding.md) (13 yêu cầu nghiệp vụ); [BRD Access Request](brd/brd-access-request.md) (9 yêu cầu nghiệp vụ); [BRD Offboarding](brd/brd-offboarding.md) (11 yêu cầu nghiệp vụ); [Use Case Onboarding](use-case-specifications/onboarding-use-cases.md) (10 use case, sơ đồ draw.io); [Use Case Access Request](use-case-specifications/access-request-use-cases.md) (7 use case, sơ đồ draw.io); [Use Case Offboarding](use-case-specifications/offboarding-use-cases.md) (10 use case, sơ đồ draw.io); [User Stories Onboarding](user-stories/onboarding-user-stories.md) (15 story, 56 AC); [User Stories Access Request](user-stories/access-request-user-stories.md) (10 story, 40 AC); [User Stories Offboarding](user-stories/offboarding-user-stories.md) (13 story, 48 AC); [Business Rules Catalog](business-rules/business-rules-catalog.md) (30 quy tắc, 3 quy trình); quy tắc và quyết định thiết kế cho [Onboarding To-Be](design-decisions/onboarding-to-be-design-decisions.md), [Access Request To-Be](design-decisions/access-request-to-be-design-decisions.md) và [Offboarding To-Be](design-decisions/offboarding-to-be-design-decisions.md). Các thư mục chưa có nội dung được giữ bằng `.gitkeep`; việc tạo cấu trúc không đồng nghĩa đã có BRD, SRS hoặc Business Rules được duyệt.
