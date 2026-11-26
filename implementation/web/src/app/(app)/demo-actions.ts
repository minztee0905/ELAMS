"use server";

import { revalidatePath } from "next/cache";
import { parseDateTimeInput } from "@/lib/dates";
import { getNow, setSimulatedNow } from "@/server/clock";
import { runJobs } from "@/server/scheduler";
import { requireActor } from "@/server/session";

// Công cụ demo: giả lập thời gian và chạy ngay việc định kỳ (UAT "giả lập sang 29/11").
export async function setClock(formData: FormData) {
  await requireActor();
  const v = String(formData.get("at") ?? "");
  const reset = formData.get("reset");
  await setSimulatedNow(reset ? null : parseDateTimeInput(v));
  await runJobs(await getNow());
  revalidatePath("/", "layout");
}

export async function runJobsNow() {
  await requireActor();
  await runJobs(await getNow());
  revalidatePath("/", "layout");
}
