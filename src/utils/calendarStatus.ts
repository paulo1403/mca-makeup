export function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
    case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusIcon(status: string) {
  switch (status) {
    case 'PENDING': return '⏳';
    case 'CONFIRMED': return '✅';
    case 'COMPLETED': return '✨';
    case 'CANCELLED': return '❌';
    default: return '📅';
  }
}

export function getStatusConfig(status: string) {
  const configs = {
    PENDING: { dot: 'bg-amber-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    CONFIRMED: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    COMPLETED: { dot: 'bg-blue-400', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    CANCELLED: { dot: 'bg-rose-400', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' }
  };
  return configs[status as keyof typeof configs] || {
    dot: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700'
  };
}

export function getStatusBadge(status: string) {
  const statusConfig = {
    PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Completada', className: 'bg-blue-100 text-blue-800' },
    CANCELLED: { label: 'Cancelada', className: 'bg-red-100 text-red-800' }
  };
  const config = statusConfig[status as keyof typeof statusConfig];
  return config ? { label: config.label, className: config.className } : { label: 'Desconocido', className: 'bg-gray-100 text-gray-800' };
}
