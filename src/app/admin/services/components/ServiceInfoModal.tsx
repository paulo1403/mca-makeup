"use client";

import { Info } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";

interface ServiceInfoModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ServiceInfoModal({ show, onClose }: ServiceInfoModalProps) {
  if (!show) return null;

  return (
    <Modal open={show} onClose={onClose} size="xl" ariaLabelledBy="service-info-title">
      <ModalHeader
        title={<span id="service-info-title">¿Cómo Funcionan las Combinaciones de Servicios?</span>}
        icon={<Info className="w-5 h-5 text-[var(--color-primary)]" />}
        onClose={onClose}
      />

      <ModalBody>
        {/* Contenido del modal */}
        <div className="space-y-6">
          {/* Combinaciones permitidas vs no permitidas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--status-confirmed-bg)] border border-[var(--status-confirmed-border)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--status-confirmed-text)] mb-3 flex items-center">
                <span className="w-4 h-4 bg-[var(--status-confirmed-text)] rounded-full mr-2" />✅
                Combinaciones Permitidas
              </h3>
              <ul className="text-sm text-[var(--status-confirmed-text)] space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Solo Maquillaje:</strong> Cualquier categoría (Novia, Social, Piel
                    Madura)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Maquillaje + Peinado:</strong> La combinación perfecta
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Máximo:</strong> 2 tipos de servicios diferentes
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--status-cancelled-bg)] border border-[var(--status-cancelled-border)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--status-cancelled-text)] mb-3 flex items-center">
                <span className="w-4 h-4 bg-[var(--status-cancelled-text)] rounded-full mr-2" />❌
                No Permitido
              </h3>
              <ul className="text-sm text-[var(--status-cancelled-text)] space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Solo Peinado:</strong> Debe incluir maquillaje
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Novia + Social:</strong> No se pueden mezclar
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>3+ categorías:</strong> Demasiadas opciones
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Estrategia de precios */}
          <div className="bg-[var(--status-pending-bg)] border border-[var(--status-pending-border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--status-pending-text)] mb-3 flex items-center">
              <span className="text-lg mr-2">💰</span>
              Estrategia de Peinados: Servicios Complementarios
            </h3>

            <div className="space-y-3">
              <p className="text-sm text-[var(--status-pending-text)]">
                Los peinados funcionan mejor como servicios complementarios de maquillaje. Establece
                precios accesibles para incentivar la combinación y aumentar el ticket promedio.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="text-sm text-[var(--status-pending-text)]">
                  <strong>Ejemplo:</strong> Maquillaje Social S/ 200 + Peinado S/ 80 (0min)
                </div>
                <div className="text-sm text-[var(--status-pending-text)]">
                  <strong>Beneficio:</strong> Incremento del valor percibido y mejor experiencia.
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="text-[var(--status-pending-text)] font-semibold">
                Consejos Comerciales:
              </h4>
              <ul className="text-sm text-[var(--status-pending-text)] list-disc list-inside">
                <li>• Precio añadido por peinado</li>
                <li>• Paquetes &quot;Glam&quot; vs &quot;Básico&quot;</li>
                <li>• Upselling con beneficios</li>
              </ul>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-[var(--status-pending-text)] font-semibold">
                Detalles Técnicos:
              </h4>
              <ul className="text-sm text-[var(--status-pending-text)] list-disc list-inside">
                <li>• Duración 0 = simultáneo, {">"} 0 = secuencial</li>
                <li>• Categorías apropiadas</li>
              </ul>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-[var(--status-pending-text)]">
                  🎨 Estrategias Avanzadas:
                </h4>
                <ul className="space-y-1 text-[var(--status-pending-text)]">
                  <li>• &quot;Maquillaje Social Premium&quot;</li>
                  <li>• &quot;Peinado de Gala&quot; (S/ 80, 0min)</li>
                  <li>• Paquetes por temporada</li>
                  <li>• Ofertas especiales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="md"
            className="min-w-[120px]"
          >
            Cerrar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
