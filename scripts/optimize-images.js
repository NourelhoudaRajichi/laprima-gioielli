const sharp = require("sharp");
const path  = require("path");
const fs    = require("fs");

const IMG_DIR = path.join(__dirname, "../public/img");

async function optimizeDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) { await optimizeDir(fullPath); continue; }

    const ext = path.extname(entry.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const origSize = fs.statSync(fullPath).size;
    const tmpPath  = fullPath + ".opt.tmp";

    try {
      if (ext === ".png") {
        await sharp(fullPath)
          .png({ compressionLevel: 9, effort: 10, palette: false })
          .toFile(tmpPath);
      } else {
        await sharp(fullPath)
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(tmpPath);
      }

      const newSize = fs.statSync(tmpPath).size;
      const pct     = ((1 - newSize / origSize) * 100).toFixed(1);

      if (newSize < origSize) {
        fs.renameSync(tmpPath, fullPath);
        console.log(
          `✓ ${entry.name.padEnd(55)} ${(origSize/1e6).toFixed(1).padStart(5)} MB → ${(newSize/1e6).toFixed(1).padStart(5)} MB  (-${pct}%)`
        );
      } else {
        fs.unlinkSync(tmpPath);
        console.log(`– ${entry.name.padEnd(55)} already optimal`);
      }
    } catch (e) {
      try { fs.unlinkSync(tmpPath); } catch {}
      console.error(`✗ ${entry.name}: ${e.message}`);
    }
  }
}

console.log("Optimizing images in public/img …\n");
optimizeDir(IMG_DIR).then(() => console.log("\nDone.")).catch(console.error);
