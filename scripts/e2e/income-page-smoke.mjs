import { chromium, devices } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@marcelacorderomakeup.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  page.on("pageerror", (err) => {
    console.error(`E2E_PAGEERROR=${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`E2E_CONSOLE_ERROR=${msg.text()}`);
    }
  });

  try {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });

    await page.locator("#email").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Iniciar Sesi.n/i }).click();

    await page.waitForURL(/\/admin(\/)?$/, { timeout: 20000 });

    await page.goto(`${BASE_URL}/admin/income`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);

    if (!page.url().includes("/admin/income")) {
      throw new Error(`Navigation to income failed, current URL: ${page.url()}`);
    }

    await page.waitForTimeout(2000);
    const bodyText = await page.locator("body").innerText();

    if (!/ingresos/i.test(bodyText) || !/tendencia mensual/i.test(bodyText)) {
      throw new Error(`Income page content missing expected text. URL=${page.url()}`);
    }

    const detailsBtn = page.getByRole("button", { name: /ver detalle/i });
    await detailsBtn.click();
    await page.waitForTimeout(600);

    const expandedText = await page.locator("body").innerText();
    if (!/total historico/i.test(expandedText)) {
      throw new Error("Detail section did not expand correctly");
    }

    await detailsBtn.click();

    console.log("E2E_INCOME_PAGE=PASS");
  } finally {
    await context.close();
    await browser.close();
  }
};

run().catch((error) => {
  console.error("E2E_INCOME_PAGE=FAIL");
  console.error(error);
  process.exit(1);
});
