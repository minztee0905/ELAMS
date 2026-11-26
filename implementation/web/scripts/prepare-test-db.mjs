import { execSync } from "node:child_process";
import { testEnv } from "./test-env.mjs";

const env = { ...process.env, ...testEnv() };
execSync("npx prisma migrate deploy", { stdio: "inherit", env });
