"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, Star, Clock } from "lucide-react";
import Typography from "@/components/ui/Typography";
import { type DashboardStats } from "@/hooks/useDashboardStats";

interface DashboardHeroProps {
  userName?: string;
  stats?: DashboardStats;
}

export default function DashboardHero({ userName = "Marcela", stats }: DashboardHeroProps) {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Buenos días";
    if (currentHour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-10 -left-10 w-56 h-56 bg-[color:var(--color-primary)]/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-72 h-72 bg-[color:var(--color-accent)]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[color:var(--color-primary)]/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[color:var(--color-primary)]" />
          </div>
          <div>
            <Typography as="h1" variant="h2" className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] leading-tight">
              {getGreeting()}, {userName}
            </Typography>
            <Typography as="p" variant="small" className="text-[color:var(--color-muted)]">
              Aquí tienes un resumen de tu negocio
            </Typography>
          </div>
        </div>

        {/* Quick chips */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)]/30">
              <Calendar className="w-4 h-4 text-[color:var(--color-primary)]" />
              <div>
                <div className="text-sm font-semibold text-[color:var(--color-heading)]">{stats.todayAppointments}</div>
                <div className="text-xs text-[color:var(--color-muted)]">Hoy</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)]/30">
              <Clock className="w-4 h-4 text-[color:var(--color-primary)]" />
              <div>
                <div className="text-sm font-semibold text-[color:var(--color-heading)]">{stats.thisWeekAppointments}</div>
                <div className="text-xs text-[color:var(--color-muted)]">Esta semana</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)]/30">
              <Star className="w-4 h-4 text-[color:var(--color-primary)]" />
              <div>
                <div className="text-sm font-semibold text-[color:var(--color-heading)]">{stats.averageRating}</div>
                <div className="text-xs text-[color:var(--color-muted)]">Promedio</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)]/30">
              <Star className="w-4 h-4 text-[color:var(--color-primary)]" />
              <div>
                <div className="text-sm font-semibold text-[color:var(--color-heading)]">{stats.publicReviews}</div>
                <div className="text-xs text-[color:var(--color-muted)]">Reseñas públicas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}