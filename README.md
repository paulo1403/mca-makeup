# Marcela Cordero - Makeup Artist Landing Page

Una landing page profesional y sistema de agendamiento de citas para Marcela Cordero, maquilladora profesional. Construida con Next.js, TypeScript, Tailwind CSS, Prisma y PostgreSQL.

## ✨ Características

- **Landing Page Elegante**: Diseño moderno y responsivo con paleta de colores profesional
- **Sistema de Agendamiento**: Reserva de citas en tiempo real con verificación de disponibilidad
- **Portafolio Interactivo**: Galería filtrable de trabajos realizados
- **Panel de Administración**: Gestión completa de citas y disponibilidad (próximamente)
- **Base de Datos**: PostgreSQL con Prisma ORM para manejo de datos
- **API Routes**: Backend completo con Next.js API Routes
- **Responsive Design**: Optimizado para móvil, tablet y desktop

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS con fuentes personalizadas (Playfair Display, Allura, Montserrat)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js (para panel admin)
- **Formularios**: React Hook Form con validación Zod
- **Despliegue**: Vercel (recomendado)

## 🎨 Paleta de Colores

- **Primary Dark**: #1C1C1C (Carbón Sofisticado)
- **Light Contrast**: #FFFFFF (Blanco Puro)
- **Primary Accent**: #D4AF37 (Champagne Cálido)
- **Secondary Accent**: #B06579 (Rosa Malva Profundo)
- **Neutral**: #5A5A5A (Gris Pizarra)

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

# Email Configuration (opcional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@domain.com"
EMAIL_SERVER_PASSWORD="your-app-specific-password"
EMAIL_FROM="noreply@yourdomain.com"

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

Push notifications
------------------

This project now supports Web Push for admin notifications. High level:

- Generate VAPID keys (example using web-push):
    - npm i -g web-push
    - web-push generate-vapid-keys
- Set env vars: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` (mailto:...)
- In the admin panel include the `src/components/admin/PushSubscribe.tsx` component and ask admin to enable notifications.
- Subscriptions are stored in the `push_subscriptions` table (Prisma). When a new appointment or status change occurs a DB `Notification` is created and a web-push is sent to subscriptions.

If you want to keep emails as fallback, you can keep `RESEND_API_KEY` configured; otherwise remove email env vars and they'll not be used.

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

## 🚀 Despliegue

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
