#!/usr/bin/env node

/**
 * Script para probar EmailJS
 * Ejecutar con: node scripts/test-emailjs.js
 */

import dotenv from 'dotenv';
dotenv.config();

async function testEmailJS() {
  console.log('📧 Probando configuración de EmailJS...\n');

  // Verificar variables de entorno
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  console.log('🔍 Variables de entorno:');
  console.log(`   Service ID: ${serviceId ? '✅ Configurado' : '❌ Faltante'}`);
  console.log(`   Template ID: ${templateId ? '✅ Configurado' : '❌ Faltante'}`);
  console.log(`   Public Key: ${publicKey ? '✅ Configurado' : '❌ Faltante'}`);
  console.log(`   Admin Email: ${adminEmail ? '✅ Configurado' : '❌ Faltante'}`);

  if (!serviceId || !templateId || !publicKey) {
    console.log('\n❌ CONFIGURACIÓN INCOMPLETA');
    console.log('\n📋 PASOS PARA CONFIGURAR EMAILJS:');
    console.log('1. Ve a https://www.emailjs.com/');
    console.log('2. Crea una cuenta gratuita');
    console.log('3. Ve a Email Services y conecta tu email (Gmail, Outlook, etc.)');
    console.log('4. Ve a Email Templates y crea un template');
    console.log('5. Copia las credenciales a tu .env');
    console.log('\n🔧 EJEMPLO DE CONFIGURACIÓN:');
    console.log('NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_xxxxxxxx"');
    console.log('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_xxxxxxxx"');
    console.log('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="xxxxxxxxxxxxxxx"');
    console.log('NEXT_PUBLIC_ADMIN_EMAIL="marcelacordero.bookings@gmail.com"');
    return;
  }

  console.log('\n✅ CONFIGURACIÓN COMPLETA');
  console.log('\n📧 EmailJS está listo para funcionar como respaldo');
  console.log('   • Se activará automáticamente cuando fallen las push notifications');
  console.log('   • Funciona especialmente bien en iOS');
  console.log('   • No requiere configuración adicional');

  console.log('\n🎯 PRUEBA EL SISTEMA:');
  console.log('1. Ve a http://localhost:3000');
  console.log('2. Busca el componente "EmailJS - Sistema de Respaldo"');
  console.log('3. Haz clic en "Probar Email" para enviar un email de prueba');
  console.log('4. Revisa que llegue a: ' + adminEmail);
}

// Ejecutar la verificación
testEmailJS();
