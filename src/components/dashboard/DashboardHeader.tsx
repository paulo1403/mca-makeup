import { Sparkles } from 'lucide-react';

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
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[color:var(--color-primary)]" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--color-heading)]">
          Panel de Administración
        </h1>
      </div>
      <p className="text-sm sm:text-base text-[color:var(--color-muted)]">
        {getGreeting()}, {userName}. Aquí tienes un resumen de tu negocio.
      </p>
    </div>
  );
}
