# Marcela Cordero - Makeup Artist

Página web profesional para Marcela Cordero, maquilladora especializada en servicios de belleza y eventos.

## ✨ Lo que incluye

### 🌟 Página Principal

- **Portafolio** de trabajos realizados
- **Servicios** con precios y descripciones
- **Testimonios** de clientas satisfechas
- **Información** sobre la maquilladora

### 📅 Sistema de Reservas

- Reserva de citas en línea
- Verificación de disponibilidad en tiempo real
- Confirmación automática por email
- Recordatorios de citas

### 👩‍💼 Panel de Administración

- Gestión de citas y agenda
- Administración de disponibilidad horaria
- Gestión de servicios y precios
- Panel de estadísticas

### 📱 Diseño Profesional

- Diseño elegante y moderno
- Optimizado para móviles y tablets
- Colores sofisticados (negro, dorado, rosa)
- Navegación intuitiva

## 🎯 Para quién es

- **Clientes**: Pueden ver el trabajo de Marcela y reservar citas fácilmente
- **Marcela**: Gestiona su agenda y citas desde cualquier lugar
- **Administradores**: Control total del negocio y servicios

---

_Sitio web creado para mostrar profesionalismo y facilitar la gestión de un negocio de maquillaje._

## 🚀 Migración a Diseño Minimalista

### 📋 Descripción

Esta migración tiene como objetivo simplificar el diseño de la web para lograr un estilo más minimalista, enfocado en la elegancia, la legibilidad y la funcionalidad. Se reducirán elementos decorativos, se simplificará la paleta de colores y se aumentará el espacio en blanco, manteniendo la profesionalidad del sitio.

**Nota importante**: Los cambios se aplican únicamente a la web principal (páginas públicas para clientes, como la página de inicio, servicios, portafolio, etc.). El panel de administración (`/admin`) queda sin modificaciones para mantener su funcionalidad y diseño intactos.

### 🎨 Cambios Principales

#### 1. **Paleta de Colores**

- Reducir a colores neutros: blanco, negro/gris oscuro, gris claro y un acento sutil.
- Eliminar gradientes y transiciones complejas.
- Archivo afectado: `src/styles/base.css` (actualizar variables CSS).

#### 2. **Elementos Decorativos**

- Remover partículas globales (`GlobalParticles`).
- Eliminar orbes animados, líneas SVG y gradientes en texto.
- Archivos afectados: `src/app/layout.tsx`, `src/components/HeroSection.tsx`.

#### 3. **Espacio en Blanco**

- Aumentar padding y márgenes en secciones.
- Usar layouts centrados con ancho máximo reducido.
- Archivos afectados: Componentes principales como `HeroSection.tsx`, `PortfolioSection.tsx`.

#### 4. **Tipografía y Contenido**

- Usar fuente sans-serif única (Plus Jakarta Sans).
- Simplificar títulos y eliminar badges decorativos.
- Archivos afectados: `src/components/HeroSection.tsx`, `src/components/NavBar.tsx`.

#### 5. **Navegación y Componentes**

- Simplificar navbar sin sombras o efectos.
- Reducir íconos y animaciones en secciones.
- Archivos afectados: `src/components/NavBar.tsx`, `src/components/PortfolioSection.tsx`, etc.

### 📝 Pasos de Implementación

1. **Preparación**

   - Crear una rama nueva: `git checkout -b feature/minimalist-design`
   - Hacer backup de archivos críticos (`src/styles/base.css`, `src/app/layout.tsx`)

2. **Cambios en Estilos**

   - Editar `src/styles/base.css` para simplificar variables de color.
   - Actualizar `tailwind.config.ts` si es necesario para colores minimalistas.

3. **Modificaciones en Componentes**

   - Remover `<GlobalParticles />` de `layout.tsx`.
   - Simplificar `HeroSection.tsx`: eliminar decoraciones y gradientes.
   - Revisar y ajustar otros componentes (Portfolio, Testimonials, etc.) para minimalismo.

4. **Pruebas**

   - Verificar responsividad en móviles.
   - Comprobar carga rápida (eliminar animaciones pesadas).
   - Validar accesibilidad y legibilidad.

5. **Despliegue**
   - Hacer commit: `git commit -m "feat: migrate to minimalist design"`
   - Merge a master y desplegar.

### ✅ Checklist de Cambios

- [x] Actualizar paleta de colores en `base.css`
- [x] Remover GlobalParticles de layout
- [x] Simplificar HeroSection (eliminar decoraciones)
- [x] Aumentar whitespace en secciones
- [x] Simplificar tipografía y navbar
- [x] Quitar animaciones de HeroSection
- [x] Quitar gradientes de página principal
- [x] Quitar gradientes de sección de servicios
- [ ] Probar en diferentes dispositivos
- [ ] Validar rendimiento
- [ ] Validar rendimiento

### 🎯 Beneficios Esperados

- Diseño más moderno y profesional.
- Mejor experiencia de usuario en dispositivos móviles.
- Carga más rápida al reducir elementos visuales.
- Mayor enfoque en el contenido y servicios.

### 📞 Contacto

Para preguntas sobre esta migración, contactar al equipo de desarrollo.
