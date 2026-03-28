import { chromium, devices } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@marcelacorderomakeup.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  const token = `E2E-MANUAL-${Date.now()}`;
  let createdAppointmentId = null;

  try {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "domcontentloaded" });

    await page.locator("#email").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Iniciar Sesi.n/i }).click();

    await page.waitForURL(/\/admin(\/)?$/, { timeout: 20000 });

    await page.goto(`${BASE_URL}/admin/appointments`, { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Registrar ingreso manual" }).click();

    await page.locator('label:has-text("Nombre") input').first().fill("Marcela Test E2E");
    await page.locator('label:has-text("Telefono") input').first().fill("999999999");
    await page.locator('label:has-text("Email") input').first().fill("e2e.manual@example.com");
    await page.locator('label:has-text("Servicio") input').first().fill(token);
    await page.locator('label:has-text("Horario") input').first().fill("10:00 - 12:00");
    await page.locator('label:has-text("Estado") select').selectOption("COMPLETED");
    await page.locator('label:has-text("Servicios (S/)") input').fill("520");
    await page.locator('label:has-text("Movilidad (S/)") input').fill("40");
    await page.locator('label:has-text("Nocturno (S/)") input').fill("0");
    await page.locator('label:has-text("Total manual (S/)") input').fill("560");
    await page.locator('label:has-text("Notas") textarea').fill("Prueba E2E flujo manual");

    await page.getByRole("button", { name: "Registrar ingreso", exact: true }).click();

    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Completadas" }).click();
    await page.getByPlaceholder("Buscar citas...").fill(token);

    const serviceCell = page.getByText(token).first();
    await serviceCell.waitFor({ timeout: 15000 });

    const response = await page.request.get(
      `${BASE_URL}/api/admin/appointments?search=${encodeURIComponent(token)}&page=1&limit=10`,
    );
    const payload = await response.json();
    const records = payload?.data?.appointments || [];

    if (records.length === 0) {
      throw new Error("No se encontro el registro manual via API tras crearlo");
    }

    createdAppointmentId = records[0].id;

    const createdPrice = Number(records[0].totalPrice || 0);
    if (createdPrice !== 560) {
      throw new Error(`Total inesperado. Esperado 560, recibido ${createdPrice}`);
    }

    console.log("E2E_RESULT=PASS");
    console.log(`E2E_CREATED_ID=${createdAppointmentId}`);
    console.log(`E2E_TOKEN=${token}`);
  } finally {
    try {
      if (createdAppointmentId) {
        await page.request.delete(
          `${BASE_URL}/api/admin/appointments?id=${encodeURIComponent(createdAppointmentId)}`,
        );
        console.log(`E2E_CLEANUP=deleted:${createdAppointmentId}`);
      }
    } catch (cleanupError) {
      console.error("E2E_CLEANUP_ERROR", cleanupError);
    }

    await context.close();
    await browser.close();
  }
};

run().catch((error) => {
  console.error("E2E_RESULT=FAIL");
  console.error(error);
  process.exit(1);
});
