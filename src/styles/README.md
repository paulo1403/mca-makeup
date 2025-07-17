# Estructura de Estilos - MCA Makeup

Esta nueva estructura organiza todos los estilos CSS de manera modular y mantenible.

## 📁 Estructura de Directorios

```
src/styles/
├── index.css              # Archivo principal que importa todos los módulos
├── base.css               # Variables CSS, tipografía base y configuración
├── dashboard.css          # Estilos específicos del dashboard
├── components/            # Estilos por componente
│   ├── buttons.css        # Botones primarios y secundarios
│   ├── forms.css          # Formularios, inputs y radio buttons
│   ├── datepicker.css     # React DatePicker customizado
│   └── about-section.css  # Estilos específicos del AboutSection
└── utils/                 # Utilidades y helpers
    ├── colors.css         # Clases de colores y gradientes
    ├── animations.css     # Animaciones y transiciones
    └── scrollbar.css      # Scrollbar personalizado
```

## 🎯 Propósito de Cada Archivo

### **base.css**
- Variables CSS principales
- Configuración del body y html
- Tipografía base (Playfair, Allura, Montserrat)
- Smooth scroll behavior

### **components/buttons.css**
- `.btn-primary` y `.btn-secondary`
- Efectos hover y animaciones de brillo
- Estados de foco para accesibilidad

### **components/forms.css**
- Estilos para inputs, textareas y selects
- Radio buttons customizados
- Placeholders y estados de foco

### **components/datepicker.css**
- React DatePicker completamente customizado
- Tema consistente con la marca
- Formato peruano y selector de hora

### **components/about-section.css**
- Estilos específicos para la sección personal
- Gradientes y colores forzados

### **utils/colors.css**
- Clases utilitarias de colores (.text-accent, .bg-primary-dark, etc.)
- Gradientes especiales (.hero-gradient)
- Clases de fuerza (.force-white-text)

### **utils/animations.css**
- Todas las animaciones CSS (float, shimmer, pulse-glow, etc.)
- Efectos de hover para cards
- Skeleton loaders
- Soporte para reduced motion

### **utils/scrollbar.css**
- Scrollbar personalizado con colores de marca

## 🚀 Cómo Usar

### Importar todo (recomendado)
```css
@import "../styles/index.css";
```

### Importar módulos específicos
```css
@import "../styles/components/buttons.css";
@import "../styles/utils/animations.css";
```

### En componentes React
```tsx
// Para estilos específicos de componente
import './ComponentName.module.css';

// O usar clases globales
<button className="btn-primary">Mi Botón</button>
```

## 📱 Beneficios de esta Estructura

1. **Mantenibilidad**: Cada archivo tiene una responsabilidad específica
2. **Reutilización**: Los estilos están organizados por función
3. **Performance**: Solo importar lo que necesitas
4. **Escalabilidad**: Fácil agregar nuevos componentes
5. **Debugging**: Fácil encontrar y modificar estilos específicos
6. **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos

## 🔧 Convenciones

### Nomenclatura de Archivos
- **kebab-case** para nombres de archivos CSS
- **componente.css** para estilos de componentes específicos
- **utilidad.css** para clases helper y utilidades

### Nomenclatura de Clases
- **BEM** para componentes complejos
- **Utilidades** con prefijos descriptivos (.text-, .bg-, .animate-)
- **Estados** con sufijos (.btn-primary:hover, .card-hover)

### Organización Interna
1. Variables CSS al inicio
2. Elementos base
3. Clases utilitarias
4. Estados y modificadores
5. Media queries al final

## 🎨 Variables Disponibles

```css
--primary-dark: #1C1C1C       /* Negro sofisticado */
--primary-accent: #D4AF37     /* Dorado champagne */
--secondary-accent: #B06579   /* Rosa mauve */
--neutral: #5A5A5A           /* Gris pizarra */
--light-contrast: #FFFFFF     /* Blanco puro */
```

## 📋 Checklist para Nuevos Componentes

- [ ] ¿Los estilos son específicos del componente?
- [ ] ¿Usan las variables CSS existentes?
- [ ] ¿Incluyen estados hover/focus?
- [ ] ¿Son responsive?
- [ ] ¿Respetan reduced motion?
- [ ] ¿Están documentados?

## 🔄 Migración Gradual

Esta estructura permite migrar gradualmente:

1. **Fase 1**: Estilos base y utilidades ✅
2. **Fase 2**: Componentes principales ✅
3. **Fase 3**: Componentes específicos (próximo)
4. **Fase 4**: Optimización y refinamiento

## 📖 Próximos Pasos

1. Crear estilos para componentes faltantes
2. Implementar CSS Modules para componentes específicos
3. Agregar dark mode support
4. Optimizar para mejor performance
5. Documentar más patrones de diseño
