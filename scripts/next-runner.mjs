import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
const wasmDir = path.join(rootDir, "node_modules", "@next", "swc-wasm-nodejs");
const args = process.argv.slice(2);
const command = args[0];
const nextDir = path.join(rootDir, ".next");
const requiredBuildManifest = path.join(nextDir, "routes-manifest.json");

const env = { ...process.env };

function hasPartialNextBuild() {
  if (!fs.existsSync(nextDir)) {
    return false;
  }

  const entries = fs.readdirSync(nextDir);

  return entries.length > 0 && !fs.existsSync(requiredBuildManifest);
}

function resetPartialNextBuild() {
  fs.rmSync(nextDir, { recursive: true, force: true });
}

if ((command === "dev" || command === "build" || command === "typegen") && hasPartialNextBuild()) {
  console.warn("Detected an incomplete .next build cache. Resetting it before continuing.");
  resetPartialNextBuild();
}

if (command === "start" && !fs.existsSync(requiredBuildManifest)) {
  console.error("Missing .next/routes-manifest.json. Run `npm run build` before `npm run start`.");
  process.exit(1);
}

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
