import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const sourceImage = path.join(publicDir, 'brush.png');

// Configuración de iconos a generar
const iconSizes = [
  // Favicons
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  
  // Apple Touch Icons
  { name: 'apple-touch-icon.png', size: 180 },
  
  // Android Chrome Icons
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  
  // Additional sizes for better compatibility
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-384x384.png', size: 384 },
];

async function generateIcons() {
  console.log('🎨 Generando iconos desde brush.png...');
  
  // Verificar que existe el archivo fuente
  if (!fs.existsSync(sourceImage)) {
    console.error('❌ No se encontró brush.png en la carpeta public');
    return;
  }

  try {
    // Leer la imagen fuente
    const image = sharp(sourceImage);
    const metadata = await image.metadata();
    
    console.log(`📸 Imagen fuente: ${metadata.width}x${metadata.height}px`);
    
    // Generar cada tamaño
    for (const icon of iconSizes) {
      const outputPath = path.join(publicDir, icon.name);
      
      await image
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Fondo transparente
        })
        .png({ quality: 90 })
        .toFile(outputPath);
        
      console.log(`✅ Generado: ${icon.name} (${icon.size}x${icon.size}px)`);
    }
    
    // Generar favicon.ico
    await image
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    
    console.log('✅ Generado: favicon.ico');
    
    // Generar SVG para Safari pinned tab (simplificado)
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#D4AF37"/>
  <path d="M25 75 Q50 25 75 75" stroke="#1C1C1C" stroke-width="3" fill="none"/>
  <circle cx="35" cy="65" r="2" fill="#1C1C1C"/>
  <circle cx="50" cy="45" r="2" fill="#1C1C1C"/>
  <circle cx="65" cy="65" r="2" fill="#1C1C1C"/>
</svg>`;
    
    fs.writeFileSync(path.join(publicDir, 'safari-pinned-tab.svg'), svgContent);
    console.log('✅ Generado: safari-pinned-tab.svg');
    
    console.log('🎉 ¡Todos los iconos generados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
  }
}

generateIcons();
