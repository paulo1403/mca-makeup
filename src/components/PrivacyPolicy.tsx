'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Navigation */}
          <div className="mb-8">
            <button 
              onClick={handleGoBack} 
              className="flex items-center gap-2 text-[color:var(--color-body)] hover:text-[color:var(--color-primary)] transition-colors duration-200 mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif text-[color:var(--color-heading)] mb-4">
              Políticas de Privacidad
            </h1>
            <p className="text-lg text-[color:var(--color-body)]">
              Última actualización: {new Date().toLocaleDateString('es-PE')}
            </p>
          </div>

          <div className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]/20 p-8 lg:p-12 space-y-8">
            
            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                1. Introducción
              </h2>
              <p className="text-[color:var(--color-body)] leading-relaxed mb-4">
                Marcela Cordero - Makeup Artist se compromete a proteger la privacidad y los datos 
                personales de nuestros clientes conforme a la Ley N° 29733 de Protección de Datos Personales del Perú.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                2. Información que Recopilamos
              </h2>
              <ul className="list-disc list-inside text-[color:var(--color-body)] space-y-2 ml-4">
                <li>Nombre completo y datos de contacto</li>
                <li>Dirección para servicios a domicilio</li>
                <li>Preferencias de estilo y tipo de piel</li>
                <li>Información sobre alergias a productos cosméticos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-[color:var(--color-heading)] mb-4">
                3. Sus Derechos
              </h2>
              <p className="text-[color:var(--color-body)] leading-relaxed mb-4">
                Usted tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus datos personales.
              </p>
              
              <div className="bg-[color:var(--color-primary)]/10 p-4 rounded-lg border border-[color:var(--color-primary)]/20">
                <p className="text-[color:var(--color-body)] text-sm">
                  <strong>Contacto:</strong> marcela@marcelamakeup.com
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
