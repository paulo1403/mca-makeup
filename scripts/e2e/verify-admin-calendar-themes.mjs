import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
import "dotenv/config";

const BASE_URL = "http://localhost:3001/admin/calendar";
const OUT_DIR = path.join(process.cwd(), "test-results", "admin-calendar-theme-check");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@marcelacorderomakeup.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

mkdirSync(OUT_DIR, { recursive: true });

function luminance(rgb) {
  const [r, g, b] = rgb
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runForTheme(browser, colorScheme) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme,
  });

  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  let loginSucceeded = true;
  let loginDiagnostic = "";

  if (page.url().includes("/admin/login")) {
    await page.fill("#email", ADMIN_EMAIL);
    await page.fill("#password", ADMIN_PASSWORD);
    await page.getByRole("button", { name: /iniciar sesi[oó]n/i }).click();

    try {
      await page.waitForURL("**/admin/calendar", { timeout: 15000 });
    } catch {
      loginSucceeded = false;
      const diag = await page.evaluate(() => {
        const bodyText = document.body?.innerText || "";
        const likelyError = bodyText
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean)
          .find((x) => /credenciales|error|bloqueado|intentos|sesi[oó]n/i.test(x));

        return {
          url: location.href,
          likelyError: likelyError || "Sin mensaje de error visible",
        };
      });

      loginDiagnostic = `${diag.url} | ${diag.likelyError}`;
      await page.screenshot({ path: path.join(OUT_DIR, `admin-login-failure-${colorScheme}.png`), fullPage: true });
    }
  }

  // Wait for UI to settle; avoids false negatives on hydration.
  await page.waitForTimeout(1200);

  const state = await page.evaluate(() => {
    const bodyText = document.body?.innerText || "";
    const title = document.querySelector("h1")?.textContent?.trim() || "";

    const monthCells = Array.from(document.querySelectorAll("[class*='grid'] > div, td, [role='gridcell']"));
    const hasCalendarLikeContent = /calendario|agenda|citas|appointments/i.test(bodyText) || monthCells.length > 20;

    function parseRgb(str) {
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!m) return null;
      return [Number(m[1]), Number(m[2]), Number(m[3])];
    }

    const sampled = [];
    const candidates = Array.from(document.querySelectorAll("main *, [data-slot='card'], .card, button, p, span, h1, h2, h3")).slice(0, 1200);

    for (const el of candidates) {
      const cs = window.getComputedStyle(el);
      if (!cs) continue;

      const fg = parseRgb(cs.color);
      const bg = parseRgb(cs.backgroundColor);

      const rect = el.getBoundingClientRect();
      if (!fg || !bg || rect.width < 8 || rect.height < 8) continue;

      const text = (el.textContent || "").trim();
      if (!text) continue;

      sampled.push({
        tag: el.tagName,
        text: text.slice(0, 60),
        fg,
        bg,
      });

      if (sampled.length >= 250) break;
    }

    return {
      url: location.href,
      title,
      hasCalendarLikeContent,
      sampled,
    };
  });

  const checks = state.sampled.map((s) => {
    const ratio = contrastRatio(s.fg, s.bg);
    return { ...s, ratio };
  });

  const lowContrast = checks.filter((x) => x.ratio < 3);

  const screenshotPath = path.join(OUT_DIR, `admin-calendar-${colorScheme}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await context.close();

  return {
    colorScheme,
    url: state.url,
    loginSucceeded,
    loginDiagnostic,
    title: state.title,
    hasCalendarLikeContent: state.hasCalendarLikeContent,
    sampledCount: checks.length,
    lowContrastCount: lowContrast.length,
    lowContrastExamples: lowContrast.slice(0, 8),
    screenshotPath,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    const light = await runForTheme(browser, "light");
    const dark = await runForTheme(browser, "dark");

    console.log(JSON.stringify({ light, dark }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
