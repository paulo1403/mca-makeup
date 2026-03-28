"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useIncomeStats } from "@/hooks/useIncomeStats";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 2,
});

function KpiCard({ title, value, subtitle }: { title: string; value: number; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:p-5 shadow-sm">
      <p className="text-xs sm:text-sm text-[color:var(--color-muted)]">{title}</p>
      <p className="mt-1 text-lg sm:text-2xl font-semibold text-[color:var(--color-heading)]">
        {currency.format(value || 0)}
      </p>
      {subtitle && <p className="mt-1 text-xs text-[color:var(--color-muted)]">{subtitle}</p>}
    </div>
  );
}

export default function IncomePage() {
  const [showDetails, setShowDetails] = useState(false);
  const { data, isLoading, error } = useIncomeStats();

  const momentum = useMemo(() => {
    if (!data || data.monthly.length < 2) return null;
    const prev = data.monthly[data.monthly.length - 2];
    const curr = data.monthly[data.monthly.length - 1];
    const delta = (curr?.total || 0) - (prev?.total || 0);
    const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
    return { delta, direction };
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-sm text-[color:var(--color-muted)]">Cargando ingresos...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
        <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
          Error al cargar ingresos
        </h2>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">
          {error instanceof Error ? error.message : "No se pudieron cargar los datos"}
        </p>
      </div>
    );
  }

  const maxTotal = Math.max(...data.monthly.map((m) => m.total), 1);
  const currentMonth = data.monthly[data.monthly.length - 1];

  return (
    <div className="space-y-5 sm:space-y-6">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--color-heading)]">
          Ingresos
        </h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">
          Vista rapida para tomar decisiones sin ruido.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <KpiCard
          title="Este mes"
          value={data.totals.thisMonth}
          subtitle={currentMonth ? `${currentMonth.completedCount} citas completadas` : undefined}
        />
        <KpiCard
          title="Manual (este mes)"
          value={data.totals.manualThisMonth}
          subtitle="Servicios privados"
        />
        <KpiCard
          title="Web (este mes)"
          value={data.totals.webThisMonth}
          subtitle="Reservas online"
        />
      </section>

      <section className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-heading)]">
            Tendencia mensual
          </h2>
          <span className="text-xs text-[color:var(--color-muted)]">Ultimos 6 meses</span>
        </div>

        {momentum && (
          <div className="mb-4 text-xs sm:text-sm text-[color:var(--color-muted)]">
            {momentum.direction === "up" && (
              <span>
                Este mes va <strong className="text-[color:var(--color-success)]">arriba</strong>{" "}
                por {currency.format(momentum.delta)}
              </span>
            )}
            {momentum.direction === "down" && (
              <span>
                Este mes va <strong className="text-[color:var(--color-danger)]">abajo</strong> por{" "}
                {currency.format(Math.abs(momentum.delta))}
              </span>
            )}
            {momentum.direction === "flat" && <span>Este mes va igual que el anterior</span>}
          </div>
        )}

        <div className="space-y-3">
          {data.monthly.map((item) => {
            const width = Math.max(6, Math.round((item.total / maxTotal) * 100));
            return (
              <div key={item.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-[color:var(--color-heading)]">
                    {item.label}
                  </span>
                  <span className="text-[color:var(--color-muted)]">
                    {currency.format(item.total)}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[color:var(--color-surface-elevated)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[color:var(--color-primary)]"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-[11px] sm:text-xs text-[color:var(--color-muted)]">
                  <span>Manual {currency.format(item.manual)}</span>
                  <span>Web {currency.format(item.web)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left"
          aria-expanded={showDetails}
        >
          <span className="text-sm sm:text-base font-semibold text-[color:var(--color-heading)]">
            Ver detalle
          </span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4 text-[color:var(--color-muted)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[color:var(--color-muted)]" />
          )}
        </button>

        {showDetails && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-[color:var(--color-border)] space-y-4">
            <div className="pt-3 space-y-1 text-sm text-[color:var(--color-muted)]">
              <p>
                Total historico:{" "}
                <strong className="text-[color:var(--color-heading)]">
                  {currency.format(data.totals.allTime)}
                </strong>
              </p>
              <p>
                Manual historico:{" "}
                <strong className="text-[color:var(--color-heading)]">
                  {currency.format(data.totals.manualAllTime)}
                </strong>
              </p>
              <p>
                Web historico:{" "}
                <strong className="text-[color:var(--color-heading)]">
                  {currency.format(data.totals.webAllTime)}
                </strong>
              </p>
              <p>
                Mejor mes manual:{" "}
                <strong className="text-[color:var(--color-heading)]">
                  {data.insights.topManualMonth?.label || "-"}
                </strong>
              </p>
              <p>
                Mejor mes web:{" "}
                <strong className="text-[color:var(--color-heading)]">
                  {data.insights.topWebMonth?.label || "-"}
                </strong>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[color:var(--color-heading)] mb-2">
                Ultimos manuales
              </h3>
              <div className="space-y-2">
                {data.recentManual.length === 0 ? (
                  <p className="text-sm text-[color:var(--color-muted)]">
                    Aun no hay registros manuales.
                  </p>
                ) : (
                  data.recentManual.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-[color:var(--color-heading)] truncate">
                          {item.clientName}
                        </p>
                        <p className="text-sm font-semibold text-[color:var(--color-success)]">
                          {currency.format(item.totalPrice || 0)}
                        </p>
                      </div>
                      <p className="text-xs text-[color:var(--color-muted)]">
                        {item.serviceType || "Servicio"} ·{" "}
                        {new Date(item.appointmentDate).toLocaleDateString("es-PE")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
