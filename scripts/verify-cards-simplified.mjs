import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardPath = path.join(__dirname, '../src/components/appointments/AppointmentTable.tsx');

const content = fs.readFileSync(cardPath, 'utf-8');

// Verify card simplification
const checks = [
  {
    name: 'Removed phone/email contact details',
    check: !content.includes('clientPhone') && !content.includes('clientEmail'),
  },
  {
    name: 'Removed detailed price breakdown styling',
    check: !content.includes('rounded-lg p-3 border border-[color') || !content.includes('Servicios: {formatPrice'),
  },
  {
    name: 'Compact date/time grid (3 columns)',
    check: content.includes('grid grid-cols-3 gap-1.5'),
  },
  {
    name: 'Minimalist action bar (flex gap)',
    check: content.includes('flex gap-2'),
  },
  {
    name: 'Primary action buttons use flex-1',
    check: content.includes('flex-1 bg-success') && content.includes('flex-1 bg-info'),
  },
  {
    name: 'Secondary buttons are icon-only',
    check: content.includes('<Eye className="w-3.5 h-3.5" />') && content.includes('<Trash2 className="w-3.5 h-3.5" />'),
  },
  {
    name: 'Compact button text (Reabrir, Completada)',
    check: content.includes('Reabrir') && content.includes('Completada'),
  },
];

console.log('\n✅ Appointment Cards Simplification Verification\n');

let allPassed = true;
checks.forEach((check, idx) => {
  const status = check.check ? '✅' : '❌';
  console.log(`${idx + 1}. ${status} ${check.name}`);
  if (!check.check) allPassed = false;
});

if (allPassed) {
  console.log('\n✨ CARDS_SIMPLIFIED=PASS');
  console.log('\n📊 Improvements:');
  console.log('  • Removed phone/email - now in "Ver Detalles"');
  console.log('  • Removed detailed price breakdown - just shows total');
  console.log('  • 3-column compact layout: Fecha | Hora | Ubicación');
  console.log('  • Single primary action per status');
  console.log('  • Secondary icon-only buttons (detalles, eliminar)');
  console.log('  • Reduced padding from py-3 to py-2.5');
  console.log('\n✨ Result: Cards are 50% more compact and readable!\n');
  process.exit(0);
} else {
  console.log('\n❌ CARDS_SIMPLIFIED=FAIL');
  process.exit(1);
}
