/**
 * Converts large PNG files (>2 MB) to JPEG, then updates all code references.
 * Run once: node scripts/convert-large-pngs.js
 */
const sharp = require("sharp");
const path  = require("path");
const fs    = require("fs");
const { execSync } = require("child_process");

const IMG_DIR  = path.join(__dirname, "../public/img");
const ROOT_DIR = path.join(__dirname, "..");
const CODE_EXTS = [".js", ".jsx", ".ts", ".tsx", ".css", ".md"];
const SIZE_THRESHOLD = 2 * 1024 * 1024; // 2 MB

async function run() {
  const converted = []; // { oldName, newName }

  // 1 — convert large PNGs
  function scanDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { scanDir(full); continue; }
      if (path.extname(entry.name).toLowerCase() !== ".png") continue;
      if (fs.statSync(full).size < SIZE_THRESHOLD) continue;

      converted.push({ oldPath: full, oldName: entry.name });
    }
  }
  scanDir(IMG_DIR);

  for (const item of converted) {
    const jpgName = path.basename(item.oldPath, ".png") + ".jpg";
    const jpgPath = path.join(path.dirname(item.oldPath), jpgName);
    const origMB  = (fs.statSync(item.oldPath).size / 1e6).toFixed(1);

    await sharp(item.oldPath)
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(jpgPath);

    const newMB = (fs.statSync(jpgPath).size / 1e6).toFixed(1);
    const pct   = ((1 - fs.statSync(jpgPath).size / fs.statSync(item.oldPath).size) * 100).toFixed(1);

    fs.unlinkSync(item.oldPath);
    item.newName = jpgName;
    item.jpgPath = jpgPath;
    console.log(`✓ ${item.oldName} → ${jpgName}  (${origMB} MB → ${newMB} MB, -${pct}%)`);
  }

  if (converted.length === 0) {
    console.log("No large PNGs found.");
    return;
  }

  // 2 — update code references
  console.log("\nUpdating code references…");

  function walkCode(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
        walkCode(full);
        continue;
      }
      if (!CODE_EXTS.includes(path.extname(entry.name).toLowerCase())) continue;

      let src = fs.readFileSync(full, "utf8");
      let changed = false;
      for (const item of converted) {
        const oldRef = item.oldName;           // e.g. LaPrimaGioielli_SS26_1056_VELLUTO.jpg
        const newRef = item.newName;           // e.g. LaPrimaGioielli_SS26_1056_VELLUTO.jpg
        if (src.includes(oldRef)) {
          src = src.split(oldRef).join(newRef);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, src, "utf8");
        console.log(`  updated: ${path.relative(ROOT_DIR, full)}`);
      }
    }
  }
  walkCode(ROOT_DIR);

  console.log("\nDone. Commit the changes.");
}

run().catch(console.error);
