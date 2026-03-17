import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
const wasmDir = path.join(rootDir, "node_modules", "@next", "swc-wasm-nodejs");
const args = process.argv.slice(2);

const env = { ...process.env };

// This Windows environment cannot load Next's native SWC binary, so we
// automatically fall back to the installed WASM compiler when it exists.
if (process.platform === "win32" && fs.existsSync(wasmDir)) {
  env.NEXT_TEST_WASM ??= "1";
  env.NEXT_TEST_WASM_DIR ??= wasmDir;
}

const child = spawn(process.execPath, [nextBin, ...args], {
  cwd: rootDir,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
