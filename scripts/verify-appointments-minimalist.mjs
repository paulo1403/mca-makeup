import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appointmentsPagePath = path.join(__dirname, "../src/app/admin/appointments/page.tsx");

const content = fs.readFileSync(appointmentsPagePath, "utf-8");

// Verify minimalist design elements are in code
const checks = [
  {
    name: 'Has simplified title "Citas"',
    check: content.includes(">Citas<"),
  },
  {
    name: 'Has "Ingreso manual" button',
    check: content.includes("Ingreso manual"),
  },
  {
    name: "Has compact KPIs grid",
    check: content.includes("grid grid-cols-3 gap-2 mb-3"),
  },
  {
    name: "Has collapsible statistics button",
    check: content.includes("Ver estadísticas"),
  },
  {
    name: "Has ChevronDown icon for toggle",
    check: content.includes("ChevronDown"),
  },
  {
    name: "Has minimal search input",
    check: content.includes("Buscar cliente"),
  },
  {
    name: "Has showStats state management",
    check: content.includes("showStats") && content.includes("setShowStats"),
  },
  {
    name: "Stats content behind collapsible",
    check:
      content.includes("{showStats &&") &&
      content.includes("border-t border-[color:var(--color-border)]"),
  },
  {
    name: "Mobile-optimized spacing",
    check: content.includes("py-3") && content.includes("px-4") && content.includes("space-y-3"),
  },
];

console.log("\n✅ Appointments Page Minimalist Verification\n");

let allPassed = true;
checks.forEach((check, idx) => {
  const status = check.check ? "✅" : "❌";
  console.log(`${idx + 1}. ${status} ${check.name}`);
  if (!check.check) allPassed = false;
});

if (allPassed) {
  console.log("\n✨ E2E_STRUCTURE_VERIFICATION=PASS");
  process.exit(0);
} else {
  console.log("\n❌ E2E_STRUCTURE_VERIFICATION=FAIL");
  process.exit(1);
}
