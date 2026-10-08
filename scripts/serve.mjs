#!/usr/bin/env node
/**
 * Start Next on the port in `PORT`, read from the environment or from the
 * `.env*` files.
 *
 * `next dev` honours `PORT` only from the shell: it binds the server before it
 * loads `.env` files, so a `PORT` there is silently ignored. This loads those
 * files first, with Next's own loader and the same precedence (`.env.local`
 * over `.env`), then hands the port over explicitly. A `PORT` already in the
 * shell still wins, because the loader never overrides what is set.
 *
 *   node scripts/serve.mjs dev     # npm run dev
 *   node scripts/serve.mjs start   # npm run start
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

const DEFAULT_PORT = "5174";

const [command = "dev", ...rest] = process.argv.slice(2);
loadEnvConfig(process.cwd(), command === "dev");

const port = process.env.PORT || DEFAULT_PORT;
if (!/^\d+$/.test(port)) {
  console.error(`PORT must be a number, got "${port}"`);
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), command, "--port", port, ...rest],
  { stdio: "inherit" },
);

// Pass Ctrl+C and termination through, and exit as the server does.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
