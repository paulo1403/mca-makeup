import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const BASE = "https://marcelacorderomakeup.my.canva.site";
const SITE = "marcelacorderomakeup.my.canva.site";
const PAGES = ["", "/2", "/3", "/4", "/5"];
const OUT = "/tmp/canva-assets";
const ALIAS = "quipu";
const BUCKET = "mca-makeup";
const PREFIX = "canva-import";

const ALLOWED_EXT = /\.(jpe?g|png|webp|gif|avif|mp4|mov)(\?|$)/i;
const isMedia = (u) =>
  /^https:\/\//.test(u) &&
  (u.includes(`${SITE}/_assets`) || /canva\.(com|site)/i.test(u)) &&
  ALLOWED_EXT.test(u);

mkdirSync(OUT, { recursive: true });

function collect(urls, page, label) {
  return page
    .evaluate(() => {
      const found = [];
      document.querySelectorAll("img").forEach((img) => {
        const c = [];
        if (img.src) c.push(img.src);
        if (img.srcset) img.srcset.split(",").forEach((p) => {
          const u = p.trim().split(/\s+/)[0];
          if (u) c.push(u);
        });
        if (img.getAttribute("data-src")) c.push(img.getAttribute("data-src"));
        found.push(...c);
      });
      document.querySelectorAll("video").forEach((v) => {
        v.querySelectorAll("source").forEach((s) => s.src && found.push(s.src));
        if (v.src) found.push(v.src);
      });
      for (const el of document.querySelectorAll("*")) {
        const bg = getComputedStyle(el).backgroundImage;
        const m = bg.match(/url\(["']?(.*?)["']?\)/);
        if (m && /^https?:/.test(m[1])) found.push(m[1]);
      }
      return found;
    })
    .then((arr) => {
      arr.forEach((u) => {
        if (isMedia(u)) {
          const key = u.split("?")[0];
          urls.set(key, { original: u, label });
        }
      });
    });
}

async function download(url, dest) {
  try {
    execSync(`curl -fsSL "${url}" -o "${dest}" --max-time 30`);
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const urls = new Map();

  for (const p of PAGES) {
    const url = BASE + p;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    } catch (e) {
      console.log(`skip ${url}: ${e.message}`);
      continue;
    }
    await page.waitForTimeout(2000);
    await collect(urls, page, p || "/");
    for (let i = 0; i < 25; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(500);
      if (i % 3 === 0) await collect(urls, page, p || "/");
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await collect(urls, page, p || "/");
    console.log(`page ${url}: ${urls.size} unique so far`);
  }

  await browser.close();

  const entries = [...urls.entries()];
  console.log(`Total unique media: ${entries.length}`);

  const manifest = [];
  let ok = 0;
  for (let i = 0; i < entries.length; i++) {
    const [key, { original, label }] = entries[i];
    const ext = (key.match(/\.(jpe?g|png|webp|gif|avif|mp4|mov)/i) || [0, "jpg"])[1].toLowerCase();
    const name = `${String(i).padStart(3, "0")}.${ext}`;
    const dest = `${OUT}/${name}`;
    if (!(await download(original, dest))) {
      console.log(`  dl fail ${name}`);
      continue;
    }
    const minioKey = `${PREFIX}/${name}`;
    try {
      execSync(`/usr/local/bin/mc cp "${dest}" ${ALIAS}/${BUCKET}/${minioKey}`);
    } catch {
      console.log(`  upload fail ${name}`);
      continue;
    }
    ok++;
    manifest.push({
      index: i,
      page: label,
      originalUrl: original,
      minioKey,
      mediaUrl: `/media/${minioKey}`,
      type: /\.(mp4|mov)(\?|$)/i.test(original) ? "video" : "image",
    });
  }

  writeFileSync("/tmp/canva-manifest.json", JSON.stringify(manifest, null, 2));
  console.log(`Imported ${ok}/${entries.length} files to mca-makeup/${PREFIX}/`);
  console.log("Manifest: /tmp/canva-manifest.json");
})();
