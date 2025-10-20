import { Sparkles } from 'lucide-react';
import Typography from '@/components/ui/Typography';

interface DashboardHeaderProps {
  userName?: string;
}

export default function DashboardHeader({ userName = 'Marcela' }: DashboardHeaderProps) {
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return 'Buenos días';
    if (currentHour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="bg-[color:var(--color-surface-elevated)]/75 border border-[color:var(--color-border)]/40 rounded-lg p-3 sm:p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-md bg-[color:var(--color-primary)]/12 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[color:var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <Typography as="h2" variant="h4" className="text-sm sm:text-base font-semibold text-[color:var(--color-heading)] truncate">
                Panel de Administración
              </Typography>
              <p className="mt-0.5 text-xs sm:text-sm text-[color:var(--color-muted)] truncate">
                {getGreeting()}, {userName}. Aquí tienes un resumen de tu negocio.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: small KPIs / actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 px-2 py-1 text-xs text-[color:var(--color-heading)]">
              Hoy —
            </div>
            <div className="rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 px-2 py-1 text-xs text-[color:var(--color-heading)]">
              Pend. —
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-[color:var(--color-primary)] text-white text-sm font-medium hover:opacity-95 focus-ring shadow"
          >
            Ver reportes
          </button>
        </div>
      </div>
    </div>
  );
}
