"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EasterEgg from "@/components/ui/EasterEgg";

const TABS = [
  { href: "/admin/finance/historial", label: "Historial" },
  { href: "/admin/finance/crear", label: "Crear" },
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-(--color-heading)">Finanzas</h1>
          <EasterEgg>
            <Heart className="h-5 w-5 text-(--color-muted) hover:text-red-400 transition-colors" />
          </EasterEgg>
        </div>
      </div>

      <div className="flex gap-1 border-b border-[color:var(--color-border)]/20">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              pathname === tab.href
                ? "border-(--color-primary) text-(--color-heading)"
                : "border-transparent text-(--color-muted) hover:text-(--color-body)"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
