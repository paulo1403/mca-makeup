# Marcela Cordero - Makeup Artist

Landing page profesional para Marcela Cordero, maquilladora especializada. Sistema completo de agendamiento de citas con notificaciones automáticas.

## ✨ Características Principales

- **Página web elegante** con portafolio de trabajos
- **Sistema de reservas** en tiempo real
- **Notificaciones push** para nuevas citas
- **Panel administrativo** para gestión de agenda
- **Diseño responsivo** optimizado para todos los dispositivos

## 🛠️ Tecnologías

- **Next.js** con TypeScript
- **Tailwind CSS** para estilos
- **PostgreSQL** con Prisma ORM
- **Web Push API** para notificaciones

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma migrate dev
npx prisma generate

# Ejecutar en desarrollo
npm run dev
```

## 📧 Configuración de Notificaciones

### Push Notifications
- Configuradas automáticamente con VAPID keys
- Funcionan en Android y desktop
- Limitadas en iOS (requiere navegador abierto)

### EmailJS (Respaldo)
```bash
# Variables necesarias en .env
NEXT_PUBLIC_EMAILJS_SERVICE_ID="tu_service_id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="tu_template_id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="tu_public_key"
NEXT_PUBLIC_ADMIN_EMAIL="tu_email@gmail.com"
```

## 📋 Uso Básico

1. **Clientes**: Visitan la web y reservan citas online
2. **Sistema**: Envía notificaciones push y email automático
3. **Administración**: Panel para gestionar citas y disponibilidad

## 🎨 Diseño

- Paleta profesional: Negro carbón, champagne dorado, rosa malva
- Fuentes elegantes: Playfair Display, Montserrat
- Totalmente responsivo para móvil y desktop

**Nota:** Los scripts de testing y documentación específica han sido removidos para mantener un repositorio limpio para producción.

## 🚀 Comenzar

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- PostgreSQL (o usar Prisma Postgres integrado)

### Instalación

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd mca-makeup
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mca_makeup"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# Push Notifications (VAPID Keys)
VAPID_PUBLIC_KEY="tu-clave-publica-vapid"
VAPID_PRIVATE_KEY="tu-clave-privada-vapid"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="tu-clave-publica-vapid"

# Admin Credentials (cambiar en producción)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="change-this-secure-password"
```

4. **Configurar la base de datos**
```bash
# Iniciar Prisma Postgres (si usas la versión integrada)
npx prisma dev

# O ejecutar migraciones (si usas tu propia BD)
npx prisma migrate dev --name init
```

5. **Generar el cliente de Prisma**
```bash
npx prisma generate
```

6. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── availability/         # API para verificar disponibilidad
│   │   └── book-appointment/     # API para agendar citas
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página principal
├── components/
│   ├── HeroSection.tsx          # Sección principal
│   ├── ServicesSection.tsx      # Servicios ofrecidos
│   ├── PortfolioSection.tsx     # Galería de trabajos
│   ├── TestimonialsSection.tsx  # Testimonios
│   ├── AboutSection.tsx         # Sobre la maquilladora
│   ├── ContactSection.tsx       # Formulario de contacto
│   └── Footer.tsx               # Pie de página
└── lib/
    └── prisma.ts                # Configuración de Prisma
```

## 🎯 Funcionalidades Principales

### Secciones de la Landing Page

1. **Hero Section**: Presentación principal con navegación y CTAs
2. **Services**: Catálogo de servicios con precios y características
3. **Portfolio**: Galería filtrable de trabajos realizados
4. **Testimonials**: Carrusel de testimonios de clientas
5. **About**: Información sobre la maquilladora y certificaciones
6. **Contact**: Formulario de agendamiento con validación en tiempo real

### Sistema de Agendamiento

- Verificación de disponibilidad en tiempo real
- Validación de formularios con React Hook Form y Zod
- Prevención de doble reserva
- Notificaciones por email (configurables)
- Horarios personalizables

### APIs Disponibles

- `GET /api/availability?date=YYYY-MM-DD`: Verificar horarios disponibles
- `POST /api/book-appointment`: Crear nueva cita

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter de código
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móvil**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## �️ Scripts Útiles

```bash
# Verificar configuración completa del sistema
node scripts/final-test.js

# Generar nuevas claves VAPID (si es necesario)
node scripts/generate-vapid-keys.js

# Verificar configuración de push notifications
node scripts/verify-push-setup.js

# Probar envío de notificaciones push
node scripts/test-push-notifications.js

# Resetear base de datos en producción
npx tsx scripts/production-reset.ts

# Ejecutar seed de datos de prueba
npx tsx scripts/seed-transport-costs.ts
```

## �🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de Entorno para Producción

Asegúrate de configurar todas las variables de entorno en tu plataforma de despliegue.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

Marcela Cordero - marcela@marcelamakeup.com

Proyecto: [https://github.com/username/mca-makeup](https://github.com/username/mca-makeup)

---

## 🔒 Seguridad

### Variables de Entorno
- **NUNCA** commits archivos `.env` con credenciales reales
- Cambia todas las contraseñas por defecto antes del despliegue
- Usa secretos seguros para `NEXTAUTH_SECRET` (mínimo 32 caracteres)
- Configura CORS apropiadamente para APIs

### Antes del Despliegue
- [ ] Cambiar todas las credenciales por defecto
- [ ] Revisar y configurar variables de entorno en producción
- [ ] Configurar dominio real en `NEXTAUTH_URL`
- [ ] Configurar email de producción
- [ ] Revisar permisos de base de datos

**Nota**: Reemplaza las imágenes placeholder, información de contacto y URLs con datos reales antes del despliegue en producción.
