import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
const dirs = ["public/images/databases","public/images/screenshots","public/images/features","public/images/docs"];
let totalPng = 0, totalWebp = 0, done = [];
for (const dir of dirs) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".png")) continue;
    const png = join(dir, f);
    const webp = png.replace(/\.png$/, ".webp");
    if (existsSync(webp)) continue;
    await sharp(png).webp({ quality: 80, effort: 5 }).toFile(webp);
    const p = statSync(png).size, w = statSync(webp).size;
    totalPng += p; totalWebp += w;
    done.push(`${webp.padEnd(48)} ${(p/1024).toFixed(0)}K -> ${(w/1024).toFixed(0)}K`);
  }
}
console.log(done.join("\n"));
console.log(`\nTOTAL: ${(totalPng/1024/1024).toFixed(2)}MB PNG -> ${(totalWebp/1024/1024).toFixed(2)}MB WebP (-${(100-100*totalWebp/totalPng).toFixed(0)}%)`);
