import { execSync } from "node:child_process";
import path from "node:path";

const cache = new Map<string, string | null>();

export function getLastUpdated(filePath: string): string | null {
  if (cache.has(filePath)) return cache.get(filePath) ?? null;
  try {
    const rel = path.relative(process.cwd(), filePath);
    const output = execSync(`git log -1 --format=%cI -- "${rel}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const value = output || null;
    cache.set(filePath, value);
    return value;
  } catch {
    cache.set(filePath, null);
    return null;
  }
}
