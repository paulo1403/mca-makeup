// Script de prueba para verificar la funcionalidad del calendario
// Ejecutar en consola del navegador

console.log('🔍 Verificando funcionalidad del calendario...');

// 1. Verificar que react-big-calendar está cargado
if (typeof window !== 'undefined' && document.querySelector('.rbc-calendar')) {
  console.log('✅ Calendario renderizado correctamente');
} else {
  console.log('❌ Calendario no encontrado');
}

// 2. Verificar eventos
const events = document.querySelectorAll('.rbc-event');
console.log(`📅 Eventos encontrados: ${events.length}`);

// 3. Verificar botones de navegación
const navButtons = document.querySelectorAll('.rbc-btn-group button');
console.log(`🔄 Botones de navegación: ${navButtons.length}`);

// 4. Verificar responsividad
const isMobile = window.innerWidth < 768;
console.log(`📱 Vista móvil: ${isMobile ? 'Sí' : 'No'}`);

// 5. Verificar toolbar
const toolbar = document.querySelector('.rbc-toolbar');
if (toolbar) {
  console.log('✅ Toolbar encontrado');
} else {
  console.log('❌ Toolbar no encontrado');
}

// 6. Probar resize
window.addEventListener('resize', () => {
  console.log(`📏 Resize detectado: ${window.innerWidth}px`);
});

console.log('✨ Verificación completada');
