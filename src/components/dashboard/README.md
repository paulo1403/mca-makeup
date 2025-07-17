# Dashboard Components

Este directorio contiene todos los componentes atomizados del dashboard administrativo de MCA Makeup.

## Estructura de Componentes

### 📊 **StatsGrid.tsx**
Muestra las estadísticas principales en tarjetas:
- Total de citas
- Citas pendientes  
- Citas confirmadas
- Citas del mes actual

**Props:**
- `stats: DashboardStats` - Objeto con todas las estadísticas

### ⚡ **QuickActions.tsx**
Acciones rápidas para navegar a diferentes secciones:
- Gestionar Citas
- Configurar Disponibilidad  
- Configuración/Cambio de contraseña

**Características:**
- Responsive design
- Hover effects
- Touch-friendly targets (44px min)

### 📋 **RecentAppointments.tsx**
Lista de las citas más recientes con información resumida:
- Nombre del cliente
- Tipo de servicio
- Fecha y hora
- Estado de la cita

**Props:**
- `appointments: RecentAppointment[]` - Array de citas recientes
- `isLoading?: boolean` - Estado de carga

### 📈 **StatusSummary.tsx**
Resumen visual de estados de citas:
- Pendientes
- Confirmadas
- Completadas
- Canceladas

**Props:**
- `stats: DashboardStats` - Estadísticas del dashboard

### 🏷️ **DashboardHeader.tsx**
Header del dashboard con saludo personalizado:
- Saludo basado en hora del día
- Nombre de usuario
- Icono de marca

**Props:**
- `userName?: string` - Nombre del usuario (default: "Marcela")

### ⏳ **LoadingSpinner.tsx**
Componente de carga reutilizable:
- Diferentes tamaños (sm, md, lg)
- Animación suave
- Colores de marca

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Tamaño del spinner
- `className?: string` - Clases CSS adicionales

### ❌ **ErrorState.tsx**
Estado de error con opción de reintento:
- Mensaje personalizable
- Botón de reintentar
- Diseño consistente

**Props:**
- `title?: string` - Título del error
- `message?: string` - Mensaje de error
- `onRetry?: () => void` - Función de reintento

## Hooks Personalizados

### 📊 **useDashboardStats.ts**
Hook para obtener estadísticas del dashboard:
- React Query para cache y refresh automático
- Actualización cada 5 minutos
- Manejo de errores

### 📅 **useRecentAppointments.ts**
Hook para citas recientes:
- Actualización cada 2 minutos
- Límite configurable de resultados
- Cache inteligente

### 📱 **useMediaQuery.ts**
Hooks para detección de dispositivos:
- `useIsMobile()` - Detecta pantallas < 768px
- `useIsSmallMobile()` - Detecta pantallas < 640px

## Utilidades

### 🛠️ **dashboardUtils.ts**
Funciones de utilidad para el dashboard:
- `formatDate()` - Formateo de fechas en español
- `formatTime()` - Formateo de horas
- `formatDateTime()` - Combinación de fecha y hora
- `getStatusColor()` - Colores por estado de cita
- `getStatusText()` - Texto en español por estado
- `getClientInitials()` - Iniciales del cliente

## Optimizaciones Mobile

### 🎨 **dashboard.css**
Estilos específicos para mejorar la experiencia mobile:
- Targets de toque de 44px mínimo
- Scrollbars personalizados
- Animaciones de skeleton
- Safe area padding para iPhone
- Transiciones suaves

### 📱 **Características Mobile**
- **Responsive Design**: Breakpoints en 640px y 768px
- **Touch Targets**: Botones y links con mínimo 44px
- **Gestos**: Hover effects solo en dispositivos con hover
- **Performance**: Lazy loading y memoización
- **Accesibilidad**: Focus rings y contraste adecuado

## Tecnologías Utilizadas

- **React Query**: Cache y sincronización de datos
- **Lucide React**: Iconografía consistente
- **Tailwind CSS**: Estilos utilitarios responsive
- **TypeScript**: Tipado fuerte para mejor DX

## Mejores Prácticas Implementadas

1. **Componentización**: Cada función en su propio componente
2. **Hooks Personalizados**: Lógica reutilizable extraída
3. **TypeScript**: Interfaces claras y tipado completo
4. **Performance**: Memoización y lazy loading
5. **Accesibilidad**: ARIA labels y navegación por teclado
6. **Mobile-First**: Diseño responsive desde mobile
7. **Error Handling**: Estados de error y loading consistentes

## Uso Recomendado

```tsx
// En el componente principal
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
// ... otros imports

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorState onRetry={refetch} />;
  
  return (
    <div>
      <DashboardHeader />
      {stats && <StatsGrid stats={stats} />}
      {/* ... otros componentes */}
    </div>
  );
}
```
