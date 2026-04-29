import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "data", "visits.json");

function read() {
  try {
    if (!existsSync(FILE)) return { melissa: [], vip: [] };
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return { melissa: [], vip: [] };
  }
}

function write(data) {
  try {
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
    writeFileSync(FILE, JSON.stringify(data), "utf8");
  } catch {}
}

export function logVisit(page, ref, country = null) {
  const data = read();
  if (!data[page]) data[page] = [];
  data[page].push({ ts: new Date().toISOString(), ref: ref || null, country: country || null });
  write(data);
}

export function getVisits() {
  return read();
}
