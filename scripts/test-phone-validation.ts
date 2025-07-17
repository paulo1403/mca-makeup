import { z } from 'zod';

// Mismo esquema que usa la API
const phoneSchema = z.string()
  .min(8, 'Teléfono inválido')
  .refine((phone) => {
    // Remover espacios, guiones y símbolos para validar solo números
    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
    // Aceptar teléfonos peruanos: 9 dígitos o con código de país (11-12 dígitos)
    return cleanPhone.length >= 9 && cleanPhone.length <= 12 && /^\d+$/.test(cleanPhone);
  }, 'Formato de teléfono inválido. Ej: +51 999 209 880 o 999209880');

// Casos de prueba
const testCases = [
  '+51 999 209 880',    // ✅ Formato completo con código de país
  '999 209 880',        // ✅ Formato local con espacios
  '999209880',          // ✅ Formato local sin espacios
  '+51999209880',       // ✅ Formato completo sin espacios
  '51999209880',        // ✅ Con código sin +
  '99920988',           // ❌ Muy corto (8 dígitos)
  '9992098800',         // ✅ 10 dígitos
  '12345',              // ❌ Muy corto
  '+51 999 209 880 1',  // ❌ Muy largo
  'abc123456789',       // ❌ Contiene letras
  '',                   // ❌ Vacío
];

console.log('🧪 Pruebas de validación de teléfono:\n');

testCases.forEach((phone, index) => {
  try {
    phoneSchema.parse(phone);
    console.log(`✅ ${index + 1}. "${phone}" - VÁLIDO`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`❌ ${index + 1}. "${phone}" - INVÁLIDO: ${error.errors[0].message}`);
    }
  }
});

console.log('\n🎯 Formatos recomendados para usuarios:');
console.log('- +51 999 209 880 (con código de país)');
console.log('- 999 209 880 (formato local)');
console.log('- 999209880 (sin espacios)');
