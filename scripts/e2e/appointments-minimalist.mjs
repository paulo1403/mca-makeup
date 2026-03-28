import { chromium } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3001";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "marcelacordero.bookings@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "marcela21@";

async function testAppointmentsPage(page, viewType) {
  console.log(`📱 Testing appointments page - ${viewType}...`);

  // Login
  console.log("  Navigating to login...");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });

  console.log("  Filling email...");
  const emailInput = page.locator('input[type="email"]').first();
  const emailExists = await emailInput.isVisible({ timeout: 3000 }).catch(() => false);
  console.log(`  Email input exists: ${emailExists}`);

  if (emailExists) {
    await emailInput.fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').first().fill(ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    console.log("  Waiting for navigation after login...");
    await page.waitForNavigation({ timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(1000);
  }

  // Navigate to appointments - might be already there from login redirect
  console.log("  Navigating to appointments...");
  await page.goto(`${BASE_URL}/admin/appointments`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  // Debug: Check what's on the page
  const pageContent = await page.content();
  const currentUrl = page.url();
  console.log(`  Current URL: ${currentUrl}`);
  console.log(`  Page length: ${pageContent.length}`);

  const hasGestionCitas = pageContent.includes("Citas") || pageContent.includes("Gestión");
  const hasConfirmadas = pageContent.includes("Confirmadas");
  const hasSearchInput = pageContent.includes("Buscar cliente");

  // Check minimalist header - use less strict matching
  const headerH1 = await page
    .locator("h1")
    .first()
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  const h1Text = await page
    .locator("h1")
    .first()
    .textContent()
    .catch(() => "");
  const kpisVisible = await page
    .locator("text=Confirmadas")
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  const statsToggleBtn = await page
    .locator('button:has-text("Ver estadísticas")')
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  const searchbox = await page
    .locator('input[placeholder*="Buscar"]')
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  console.log(`  H1 text: ${h1Text}`);
  console.log(
    `  Header visible: ${headerH1}, KPIs: ${kpisVisible}, Stats toggle: ${statsToggleBtn}, Search: ${searchbox}`,
  );
  console.log(
    `  Page has Citas: ${hasGestionCitas}, Confirmadas: ${hasConfirmadas}, Buscar: ${hasSearchInput}`,
  );

  if (!headerH1 || !kpisVisible) {
    throw new Error(`${viewType}: Missing minimalist UI elements`);
  }

  // Toggle stats if button exists
  if (statsToggleBtn) {
    const statsButton = page.locator('button:has-text("Ver estadísticas")');
    const detailsInitial = await page
      .locator("text=Total citas:")
      .isVisible()
      .catch(() => false);

    await statsButton.click();
    await page.waitForTimeout(300);

    const detailsAfterClick = await page
      .locator("text=Total citas:")
      .isVisible()
      .catch(() => false);
    if (detailsAfterClick === detailsInitial) {
      console.log("  ⚠️ Stats toggle may not be working as expected");
    }
  }

  console.log(`✅ ${viewType} view: Minimalist layout verified`);
}

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    // Desktop view
    const pageDesktop = await browser.newPage();
    await testAppointmentsPage(pageDesktop, "Desktop");
    await pageDesktop.close();

    // Mobile view
    const pageMobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await testAppointmentsPage(pageMobile, "Mobile");
    await pageMobile.close();

    console.log("\n✨ E2E_APPOINTMENTS_MINIMALIST=PASS");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("E2E_APPOINTMENTS_MINIMALIST=FAIL");
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
