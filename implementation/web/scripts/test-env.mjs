// Database kiểm thử: cùng máy chủ với .env, tên database thêm hậu tố _test.
import { readFileSync } from "node:fs";

export function testEnv() {
  const env = Object.fromEntries(
    readFileSync(".env", "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
      }),
  );
  return { DATABASE_URL: env.DATABASE_URL.replace(/\/([^/?]+)(\?|$)/, "/$1_test$2"), SESSION_SECRET: "test-secret" };
}
