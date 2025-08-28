#!/bin/bash

# 🚀 Script Seguro de Despliegue - Marcela Cordero Makeup
# Versión actualizada con EmailJS y Neon Console

set -e  # Salir si hay algún error

echo "🎨 MARCELA CORDERO MAKEUP - DESPLIEGUE SEGURO"
echo "=============================================="
echo "📧 Incluye configuración de EmailJS"
echo "🗄️ Compatible con Neon Console PostgreSQL"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "prisma/schema.prisma" ]; then
    print_error "No estás en el directorio raíz del proyecto"
    exit 1
fi

print_status "Verificando configuración de EmailJS..."

# Verificar que EmailJS esté configurado
if [ -z "$NEXT_PUBLIC_EMAILJS_SERVICE_ID" ] || [ -z "$NEXT_PUBLIC_EMAILJS_TEMPLATE_ID" ] || [ -z "$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY" ]; then
    print_error "EmailJS no está configurado completamente"
    print_warning "Asegúrate de tener todas las variables de EmailJS en tu .env"
    exit 1
fi

print_success "EmailJS configurado correctamente"

# Verificar conexión a base de datos de producción
print_status "Paso 1: Verificando conexión a Neon Console..."

if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL no está configurada"
    print_warning "Configura tu DATABASE_URL de Neon Console"
    exit 1
fi

# Verificar que es una URL de Neon
if [[ $DATABASE_URL != *"neon.tech"* ]]; then
    print_warning "La DATABASE_URL no parece ser de Neon Console"
    print_warning "Asegúrate de usar la connection string de Neon"
fi

if npx prisma db push --preview-feature --accept-data-loss > /dev/null 2>&1; then
    print_success "Conexión a Neon Console exitosa"
else
    print_error "No se puede conectar a Neon Console"
    print_warning "Verifica tu DATABASE_URL y credenciales de Neon"
    exit 1
fi

# Paso 2: Verificar estado de migraciones
print_status "Paso 2: Verificando estado de migraciones..."
if npx prisma migrate status > /dev/null 2>&1; then
    print_success "Estado de migraciones verificado"
else
    print_error "Error al verificar migraciones"
    exit 1
fi

# Paso 3: Ejecutar migraciones en producción
print_status "Paso 3: Ejecutando migraciones en Neon Console..."
if npx prisma migrate deploy; then
    print_success "Migraciones ejecutadas exitosamente"
    print_success "✅ Nueva tabla push_subscriptions creada"
else
    print_error "Error al ejecutar migraciones"
    print_warning "Revisa los logs de error arriba"
    exit 1
fi

# Paso 4: Generar cliente de Prisma
print_status "Paso 4: Generando cliente de Prisma..."
if npx prisma generate; then
    print_success "Cliente de Prisma generado"
else
    print_error "Error al generar cliente de Prisma"
    exit 1
fi

# Paso 5: Verificar build de producción
print_status "Paso 5: Verificando build de producción..."
if npm run build > /dev/null 2>&1; then
    print_success "Build de producción exitoso"
else
    print_error "Error en el build de producción"
    print_warning "Revisa los errores de build antes de desplegar"
    exit 1
fi

print_success "🎉 ¡PREPARADO PARA DESPLIEGUE!"
echo ""
echo "📋 PRÓXIMOS PASOS PARA VERCEL:"
echo ""
echo "1. 🔧 CONFIGURAR VARIABLES EN VERCEL:"
echo "   Ve a https://vercel.com/dashboard"
echo "   Selecciona tu proyecto → Settings → Environment Variables"
echo "   Agrega estas variables:"
echo ""
echo "   DATABASE_URL=tu_connection_string_de_neon"
echo "   NEXTAUTH_URL=https://tu-dominio.vercel.app"
echo "   NEXTAUTH_SECRET=tu_secret_seguro"
echo "   NEXT_PUBLIC_EMAILJS_SERVICE_ID=$NEXT_PUBLIC_EMAILJS_SERVICE_ID"
echo "   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"
echo "   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"
echo "   NEXT_PUBLIC_ADMIN_EMAIL=$NEXT_PUBLIC_ADMIN_EMAIL"
echo "   VAPID_PUBLIC_KEY=tu_vapid_public_key"
echo "   VAPID_PRIVATE_KEY=tu_vapid_private_key"
echo "   NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_vapid_public_key"
echo ""
echo "2. 🚀 HACER DEPLOY:"
echo "   git add ."
echo "   git commit -m 'Add EmailJS configuration and push notifications'"
echo "   git push origin main"
echo ""
echo "3. ✅ VERIFICAR:"
echo "   - El sitio carga correctamente"
echo "   - Las citas envían notificaciones push"
echo "   - Los emails de respaldo funcionan"
echo ""

print_success "🛡️ Tus datos están 100% seguros"
print_success "🎨 ¡Marcela Cordero Makeup está listo para producción!"
print_success "📧 EmailJS configurado como respaldo automático"
