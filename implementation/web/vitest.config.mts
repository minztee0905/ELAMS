import { defineConfig } from "vitest/config";
import path from "node:path";
import { testEnv } from "./scripts/test-env.mjs";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    env: testEnv(),
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
