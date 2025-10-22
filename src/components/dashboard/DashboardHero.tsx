"use client";

import Typography from "@/components/ui/Typography";
import type { DashboardStats } from "@/hooks/useDashboardStats";
import { motion } from "framer-motion";
import { Calendar, Clock, Sparkles, Star } from "lucide-react";

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
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-72 h-72 bg-[color:var(--color-accent)]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[color:var(--color-primary)]/12 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[color:var(--color-primary)]" />
          </div>
          <div>
            <Typography
              as="h1"
              variant="h2"
              className="text-base sm:text-lg md:text-xl font-medium text-[color:var(--color-heading)] leading-tight"
            >
              {getGreeting()}, {userName}
            </Typography>
            <Typography
              as="p"
              variant="small"
              className="text-xs sm:text-sm text-[color:var(--color-muted)]"
            >
              Aquí tienes un resumen de tu negocio
            </Typography>
          </div>
        </div>

        {/* Quick chips */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              {
                icon: <Calendar className="w-4 h-4 text-[color:var(--color-primary)]" />,
                value: stats.todayAppointments,
                label: "Hoy",
              },
              {
                icon: <Clock className="w-4 h-4 text-[color:var(--color-primary)]" />,
                value: stats.thisWeekAppointments,
                label: "Esta semana",
              },
              {
                icon: <Star className="w-4 h-4 text-[color:var(--color-primary)]" />,
                value: stats.averageRating,
                label: "Promedio",
              },
              {
                icon: <Star className="w-4 h-4 text-[color:var(--color-primary)]" />,
                value: stats.publicReviews,
                label: "Reseñas públicas",
              },
            ].map((chip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)]/20"
              >
                <div className="w-8 h-8 rounded-md bg-[color:var(--color-surface)] flex items-center justify-center text-[color:var(--color-primary)]">
                  {chip.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[color:var(--color-heading)]">
                    {chip.value}
                  </div>
                  <div className="text-xs text-[color:var(--color-muted)]">{chip.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
