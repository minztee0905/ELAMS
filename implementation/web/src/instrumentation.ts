// Chạy việc định kỳ mỗi phút khi máy chủ Node khởi động (NFR-06: trong vòng 5 phút).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.VITEST) return;
  const { runJobs } = await import("./server/scheduler");
  const { getNow } = await import("./server/clock");
  const tick = async () => {
    try {
      await runJobs(await getNow());
    } catch (e) {
      console.error("[scheduler]", e);
    }
  };
  setInterval(tick, 60_000);
  setTimeout(tick, 5_000);
}
