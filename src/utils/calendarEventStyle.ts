import { CalendarEvent } from '@/utils/calendarEvents';
import { View } from 'react-big-calendar';

export function getEventStyleGetter(currentView: View) {
  return (event: CalendarEvent) => {
    let backgroundColor = '#D4AF37';
    let borderColor = '#D4AF37';
    if (currentView === 'agenda') {
      switch (event.resource.status) {
        case 'PENDING':
          backgroundColor = '#FEF3C7';
          borderColor = '#F59E0B';
          break;
        case 'CONFIRMED':
          backgroundColor = '#D1FAE5';
          borderColor = '#10B981';
          break;
        case 'COMPLETED':
          backgroundColor = '#DBEAFE';
          borderColor = '#3B82F6';
          break;
        case 'CANCELLED':
          backgroundColor = '#FEE2E2';
          borderColor = '#EF4444';
          break;
      }
      return {
        style: {
          backgroundColor,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: '8px',
          opacity: 1,
          color: '#374151',
          border: `1px solid ${borderColor}20`,
          display: 'block',
          padding: '8px 12px',
          margin: '2px 0',
        },
      };
    }
    switch (event.resource.status) {
      case 'PENDING':
        backgroundColor = '#F59E0B';
        break;
      case 'CONFIRMED':
        backgroundColor = '#10B981';
        break;
      case 'COMPLETED':
        backgroundColor = '#3B82F6';
        break;
      case 'CANCELLED':
        backgroundColor = '#EF4444';
        break;
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };
}
