"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const surfaceCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 2,
});

const fetchServices = async () => {
  const res = await fetch("/api/admin/services");
  if (!res.ok) throw new Error("Error al cargar servicios");
  const data = await res.json();
  return data.services as Array<{
    id: string;
    name: string;
    price: number;
    cost: number | null;
    images?: Array<{ url: string; isPrimary?: boolean }>;
  }>;
};

export default function MargenPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services-margin"],
    queryFn: fetchServices,
    enabled: status !== "loading" && !!session,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/admin/login");
  }, [session, status, router]);

  const rows = (services ?? [])
    .map((s) => {
      const cost = s.cost ?? 0;
      const margin = s.price - cost;
      const pct = s.price > 0 ? (margin / s.price) * 100 : 0;
      return { ...s, cost, margin, pct };
    })
    .sort((a, b) => b.margin - a.margin);

  const totals = rows.reduce(
    (acc, r) => {
      acc.price += r.price;
      acc.cost += r.cost;
      return acc;
    },
    { price: 0, cost: 0 },
  );
  const totalMargin = totals.price - totals.cost;
  const totalPct = totals.price > 0 ? (totalMargin / totals.price) * 100 : 0;

  return (
    <Card className={surfaceCardClass}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[color:var(--color-primary)]" />
          <CardTitle className="text-sm font-semibold text-[color:var(--color-heading)]">
            Margen por servicio
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)]/60 text-xs uppercase tracking-wider text-[color:var(--color-muted)]">
                  <th className="pl-6 py-2 text-left font-medium">Servicio</th>
                  <th className="py-2 text-right font-medium">Precio</th>
                  <th className="py-2 text-right font-medium">Costo</th>
                  <th className="py-2 text-right font-medium">Margen S/</th>
                  <th className="pr-6 py-2 text-right font-medium">Margen %</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const img = r.images?.find((i) => i.isPrimary)?.url || r.images?.[0]?.url;
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[color:var(--color-border)]/40 last:border-0 hover:bg-[color:var(--color-surface-elevated)]"
                    >
                      <td className="pl-6 py-3">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img} alt="" className="h-9 w-9 rounded-lg object-cover" />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-[color:var(--color-surface-elevated)]" />
                          )}
                          <span className="font-medium text-[color:var(--color-heading)]">
                            {r.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right tabular-nums text-[color:var(--color-heading)]">
                        {currency.format(r.price)}
                      </td>
                      <td className="py-3 text-right tabular-nums text-[color:var(--color-muted)]">
                        {r.cost > 0 ? currency.format(r.cost) : "—"}
                      </td>
                      <td className="py-3 text-right tabular-nums font-medium text-[color:var(--color-heading)]">
                        {currency.format(r.margin)}
                      </td>
                      <td className="pr-6 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            r.pct >= 0 ? "text-emerald-500" : "text-[color:var(--status-cancelled-text)]"
                          }`}
                        >
                          {r.pct >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {r.pct.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)]">
                  <td className="pl-6 py-3 font-semibold text-[color:var(--color-heading)]">Total</td>
                  <td className="py-3 text-right tabular-nums font-semibold text-[color:var(--color-heading)]">
                    {currency.format(totals.price)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[color:var(--color-heading)]">
                    {currency.format(totals.cost)}
                  </td>
                  <td className="py-3 text-right tabular-nums font-semibold text-[color:var(--color-heading)]">
                    {currency.format(totalMargin)}
                  </td>
                  <td className="pr-6 py-3 text-right">
                    <span className="font-semibold text-emerald-500">{totalPct.toFixed(0)}%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
