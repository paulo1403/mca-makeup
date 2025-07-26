import React from 'react';
import { CalendarEvent } from '@/utils/calendarEvents';
import { getStatusColor, getStatusIcon, getStatusConfig } from '@/utils/calendarStatus';
import { format } from 'date-fns';

export const EventComponent: React.FC<{ event: CalendarEvent }> = ({ event }) => (
  <div className={`p-1 text-xs rounded border ${getStatusColor(event.resource.status)} hover:shadow-sm transition-shadow`}>
    <div className="flex items-center gap-1">
      <span className="text-xs">{getStatusIcon(event.resource.status)}</span>
      <div className="font-medium truncate flex-1">{event.resource.clientName}</div>
    </div>
    <div className="truncate text-[10px] md:text-xs opacity-90">{event.resource.service}</div>
    {event.resource.price > 0 && (
      <div className="text-[9px] md:text-[10px] font-semibold opacity-75">
        S/ {event.resource.price}
      </div>
    )}
  </div>
);

export const AgendaEventComponent: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const config = getStatusConfig(event.resource.status);
  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${config.bg} ${config.border} hover:shadow-sm`}>
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`}></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {event.resource.clientName}
            </p>
            <p className="text-xs text-gray-600 truncate mt-0.5">
              {event.resource.service}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
            <p className="text-sm font-semibold text-gray-900">
              S/ {event.resource.price}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
