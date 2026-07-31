"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 2,
});

const surfaceCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none";

type SummaryData = {
  totals: {
    incomeAllTime: number;
    incomeThisMonth: number;
    incomeThisYear: number;
    expenseAllTime: number;
    expenseThisMonth: number;
    netAllTime: number;
    netThisMonth: number;
  };
  monthly: Array<{ month: string; label: string; income: number; expense: number; count: number }>;
  recent: Array<{
    entryDate: string;
    type: string;
    amount: number;
    category: string;
    note?: string | null;
    source?: string | null;
  }>;
};

function KpiCard({
  title,
  value,
  icon,
  color,
}: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className={surfaceCardClass}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[color:var(--color-muted)]">{title}</p>
            <p className={`mt-1 text-lg font-semibold ${color}`}>{currency.format(value)}</p>
          </div>
          <div className={`rounded-xl p-2 ${color.replace("text-", "bg-")}/10`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

const fetchSummary = async () => {
  const res = await fetch("/api/admin/finance/summary");
  if (!res.ok) throw new Error("Error al cargar resumen");
  const json = await res.json();
  return json.data as SummaryData;
};

export default function ResumenPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["finance-summary"],
    queryFn: fetchSummary,
  });

  const maxVal = useMemo(() => {
    if (!data?.monthly) return 1;
    return Math.max(...data.monthly.flatMap((m) => [m.income, m.expense]), 1);
  }, [data]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard
              title="Ingresos este mes"
              value={data.totals.incomeThisMonth}
              icon={<TrendingUp className="h-5 w-5" />}
              color="text-emerald-500"
            />
            <KpiCard
              title="Gastos este mes"
              value={data.totals.expenseThisMonth}
              icon={<TrendingDown className="h-5 w-5" />}
              color="text-red-500"
            />
            <KpiCard
              title="Neto este mes"
              value={data.totals.netThisMonth}
              icon={<DollarSign className="h-5 w-5" />}
              color={
                data.totals.netThisMonth >= 0 ? "text-emerald-500" : "text-red-500"
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard
              title="Ingresos totales"
              value={data.totals.incomeAllTime}
              icon={<ArrowUpRight className="h-5 w-5" />}
              color="text-emerald-500"
            />
            <KpiCard
              title="Gastos totales"
              value={data.totals.expenseAllTime}
              icon={<ArrowDownRight className="h-5 w-5" />}
              color="text-red-500"
            />
            <KpiCard
              title="Neto total"
              value={data.totals.netAllTime}
              icon={<DollarSign className="h-5 w-5" />}
              color={data.totals.netAllTime >= 0 ? "text-emerald-500" : "text-red-500"}
            />
          </div>

          {/* Monthly chart */}
          <Card className={surfaceCardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[color:var(--color-heading)]">
                Últimos 6 meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {data.monthly.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex flex-col items-center justify-end h-32">
                      <div
                        className="w-full max-w-[32px] rounded-t bg-emerald-500/70"
                        style={{ height: `${(m.income / maxVal) * 100}%` }}
                      />
                      <div
                        className="w-full max-w-[32px] rounded-t bg-red-500/70 mt-0.5"
                        style={{ height: `${(m.expense / maxVal) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[color:var(--color-muted)]">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs text-[color:var(--color-muted)]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-emerald-500/70" /> Ingresos
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-red-500/70" /> Gastos
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent entries */}
          <Card className={surfaceCardClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[color:var(--color-heading)]">
                Últimos movimientos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border)]/60 text-xs uppercase tracking-wider text-[color:var(--color-muted)]">
                      <th className="pl-6 py-2 text-left font-medium">Fecha</th>
                      <th className="py-2 text-left font-medium">Tipo</th>
                      <th className="py-2 text-left font-medium">Categoría</th>
                      <th className="py-2 text-right font-medium">Monto</th>
                      <th className="pr-6 py-2 text-left font-medium">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((e, i) => (
                      <tr
                        key={i}
                        className="border-b border-[color:var(--color-border)]/40 last:border-0 hover:bg-[color:var(--color-surface-elevated)]"
                      >
                        <td className="pl-6 py-2 text-[color:var(--color-body)]">
                          {new Date(e.entryDate).toLocaleDateString("es-PE")}
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium ${
                              e.type === "INCOME"
                                ? "text-emerald-500"
                                : "text-red-500"
                            }`}
                          >
                            {e.type === "INCOME" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {e.type === "INCOME" ? "Ingreso" : "Gasto"}
                          </span>
                        </td>
                        <td className="py-2 text-[color:var(--color-body)]">{e.category}</td>
                        <td className="py-2 text-right tabular-nums font-medium text-[color:var(--color-heading)]">
                          {currency.format(e.amount)}
                        </td>
                        <td className="pr-6 py-2 text-[color:var(--color-muted)] max-w-[200px] truncate">
                          {e.note || "—"}
                        </td>
                      </tr>
                    ))}
                    {data.recent.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-[color:var(--color-muted)]"
                        >
                          Aún no hay movimientos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-[color:var(--color-muted)]">Error al cargar resumen</p>
      )}
    </div>
  );
}
