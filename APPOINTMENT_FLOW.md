# Sistema de Gestión de Citas - Marcela Cordero Makeup

## 📋 Flujo Completo de Gestión de Citas

### 1. **Solicitud de Cita (Cliente)**
- Los clientes completan el formulario de booking en la página principal
- El sistema valida disponibilidad en tiempo real
- Se crea una cita con estado "PENDING"
- Se envía notificación automática a Marcela por email

### 2. **Notificación a Marcela**
- Email automático cuando llega una nueva solicitud
- Centro de notificaciones en el admin panel
- Badges con número de citas pendientes

### 3. **Gestión por Marcela (Admin Panel)**

#### Dashboard Principal (`/admin`)
- **Estadísticas en tiempo real:**
  - Total de citas
  - Citas pendientes (requieren acción)
  - Citas confirmadas
  - Citas completadas y canceladas
  - Actividad del mes actual

- **Vista rápida de citas recientes**
- **Accesos rápidos a funciones principales**

#### Gestión de Citas (`/admin/appointments`)
- **Lista completa con filtros:**
  - Por estado (Pendiente, Confirmada, Completada, Cancelada)
  - Búsqueda por cliente, email o servicio
  - Paginación para grandes volúmenes

- **Acciones disponibles:**
  - ✅ **Confirmar cita** → Envía email de confirmación al cliente
  - ❌ **Cancelar cita** → Envía email de cancelación al cliente
  - ✔️ **Marcar como completada**
  - 👁️ **Ver detalles completos** (modal con toda la información)
  - 🗑️ **Eliminar cita**

#### Centro de Notificaciones
- **Notificaciones en tiempo real** de citas pendientes
- **Indicadores visuales** para notificaciones no leídas
- **Enlaces directos** a las citas que requieren atención

### 4. **Comunicación Automática por Email**

#### Para el Cliente:
- **Cita Confirmada:** Email elegante con detalles de la cita
- **Cita Cancelada:** Email de disculpa con opción de reprogramar

#### Para Marcela:
- **Nueva Solicitud:** Email con todos los detalles del cliente y la cita solicitada

### 5. **Estados de las Citas**

```
PENDING    → Recién solicitada, requiere acción de Marcela
    ↓
CONFIRMED  → Marcela confirmó la cita, cliente notificado
    ↓
COMPLETED  → Servicio realizado
    
CANCELLED  → Cita cancelada por Marcela, cliente notificado
```

## 🛠️ Funcionalidades Técnicas Implementadas

### APIs Creadas/Mejoradas:
- `GET /api/admin/appointments` - Lista citas con filtros y paginación
- `PUT /api/admin/appointments` - Actualiza estado y envía emails
- `DELETE /api/admin/appointments` - Elimina citas
- `GET /api/admin/stats` - Estadísticas del dashboard
- `GET /api/admin/notifications` - Centro de notificaciones
- `POST /api/book-appointment` - Mejorado con notificaciones

### Componentes Nuevos:
- **Dashboard mejorado** con estadísticas en tiempo real
- **Lista de citas** completamente funcional con acciones
- **Centro de notificaciones** con actualizaciones automáticas
- **Modal de detalles** para ver información completa de citas
- **Sistema de emails** con templates profesionales

### Sistema de Emails:
- **Configuración con nodemailer** (Gmail SMTP)
- **Templates HTML profesionales** para cada tipo de email
- **Manejo de errores** sin afectar operaciones principales
- **Variables de entorno** para configuración flexible

## 📧 Configuración de Email

Para activar las notificaciones por email, configura en `.env`:

```env
# Email Configuration
EMAIL_FROM="admin@marcelamakeup.com"
EMAIL_PASSWORD="tu_app_password_de_gmail"
ADMIN_EMAIL="admin@marcelamakeup.com"
```

**Nota:** Para Gmail, necesitas crear una "App Password" en lugar de usar tu contraseña normal.

## 🚀 Próximos Pasos Sugeridos

1. **Configurar email real** con el servicio preferido
2. **Añadir recordatorios automáticos** 24h antes de la cita
3. **Sistema de reprogramación** desde el cliente
4. **Calendario visual** para mejor gestión de horarios
5. **Reportes y analytics** más detallados
6. **Sistema de reviews** post-servicio

## 💡 Cómo Usar el Sistema

### Para Marcela:
1. **Ingresa al admin:** `/admin`
2. **Ve el dashboard** con resumen de actividad
3. **Revisa notificaciones** (campanita) para citas pendientes
4. **Ve a "Gestionar Citas"** para ver lista completa
5. **Confirma o cancela** citas según tu disponibilidad
6. **Marca como completadas** después del servicio

### Flujo Típico:
1. Cliente solicita cita → Estado: PENDING
2. Marcela recibe email + notificación en admin
3. Marcela revisa detalles y confirma → Estado: CONFIRMED
4. Cliente recibe email de confirmación
5. Después del servicio → Estado: COMPLETED

El sistema está diseñado para ser intuitivo y eficiente, minimizando el trabajo manual y maximizando la comunicación profesional con los clientes.
