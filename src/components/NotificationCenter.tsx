'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'system';
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
  // Añadido: referencia directa a la cita
  appointmentId?: string;
  appointment?: { id: string };
}

export default function NotificationCenter() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1800000); // 30 minutos
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      const result = await response.json();

      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notificationId, read: true }),
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[color:var(--color-surface)] rounded-lg"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[color:var(--color-primary)] text-[color:var(--on-accent-contrast)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[color:var(--color-surface)] rounded-xl shadow-lg border border-[color:var(--color-border)] z-50">
          <div className="p-3 border-b border-[color:var(--color-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[color:var(--color-primary)]" />
                <span className="text-sm font-semibold text-[color:var(--color-heading)]">Notificaciones</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-[color:var(--color-selected)] text-[color:var(--color-heading)]">{unreadCount} nuevas</span>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-[color:var(--color-muted)] mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[color:var(--color-muted)] text-sm mb-4">No hay citas pendientes</p>
                <Link
                  href="/admin/appointments"
                  onClick={() => setShowDropdown(false)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[color:var(--on-accent-contrast)] bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-[color:var(--color-surface)]"
                >
                  Ver todas las citas
                </Link>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)] ${
                    !notification.read ? 'bg-[color:var(--color-selected)]' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      !notification.read ? 'bg-[color:var(--color-primary)]' : 'bg-[color:var(--color-border)]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[color:var(--color-heading)] truncate">
                          {notification.title}
                        </p>
                        <span className="text-xs text-[color:var(--color-muted)]">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-[color:var(--color-body)] mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {notification.link && (
                          <button
                            onClick={async () => {
                              markAsRead(notification.id);
                              setShowDropdown(false);
                              const targetId = notification.appointmentId || notification.appointment?.id;
                              const url = targetId
                                ? `${notification.link}?highlightId=${targetId}&showDetail=true`
                                : `${notification.link}`;
                              await router.push(url);
                            }}
                            className="text-xs text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] font-medium"
                          >
                            Ver detalles
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)]"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-[color:var(--color-border)]">
              <Link
                href="/admin/appointments?filter=PENDING"
                onClick={() => setShowDropdown(false)}
                className="text-sm text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] font-medium"
              >
                Ver todas las citas pendientes →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
