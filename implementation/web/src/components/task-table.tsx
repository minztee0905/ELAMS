import type { TaskType } from "@prisma/client";
import { fmtDateTime } from "@/lib/dates";
import { TASK_STATUS } from "@/lib/labels";
import { TASK_LABEL, overdueLabel } from "@/server/tasks";
import { OverdueBadge, StatusBadge, Table, Td } from "./ui";

export function TaskTable({
  tasks,
  now,
}: {
  tasks: { id: number; taskType: TaskType; title: string; status: "OPEN" | "WAITING" | "DONE" | "CANCELLED"; dueAt: Date | null; assignee: { employee: { fullName: string } } }[];
  now: Date;
}) {
  const sorted = [...tasks].sort((a, b) => {
    const ao = a.status === "OPEN" || a.status === "WAITING" ? 0 : 1;
    const bo = b.status === "OPEN" || b.status === "WAITING" ? 0 : 1;
    if (ao !== bo) return ao - bo;
    return (a.dueAt?.getTime() ?? Infinity) - (b.dueAt?.getTime() ?? Infinity);
  });
  return (
    <Table head={["Loại", "Đối tượng", "Người phụ trách", "Hạn", "Trạng thái"]}>
      {sorted.map((t) => (
        <tr key={t.id}>
          <Td>{TASK_LABEL[t.taskType]}</Td>
          <Td>{t.title}</Td>
          <Td>{t.assignee.employee.fullName}</Td>
          <Td>{fmtDateTime(t.dueAt)}</Td>
          <Td>
            <div className="flex gap-1">
              <StatusBadge map={TASK_STATUS} value={t.status} />
              <OverdueBadge label={overdueLabel(t, now)} />
            </div>
          </Td>
        </tr>
      ))}
    </Table>
  );
}
