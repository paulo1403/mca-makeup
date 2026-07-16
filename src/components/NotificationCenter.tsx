"use client";

import { Bell, CalendarClock, CheckCheck, Info, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Notification {
  id: string;
  type: "appointment" | "system";
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
  appointmentId?: string;
  appointment?: { id: string };
}

const ICON_MAP = {
  appointment: CalendarClock,
  system: Bell,
} as const;

const ICON_COLOR = {
  appointment: "text-[color:var(--color-primary)]",
  system: "text-[color:var(--color-muted)]",
} as const;

const ICON_BG = {
  appointment: "bg-[color:var(--color-primary)]/10",
  system: "bg-[color:var(--color-surface-elevated)]",
} as const;

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export default function NotificationCenter() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications");
      const result = await response.json();
      if (result.success) setNotifications(result.data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1800000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!showDropdown) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDropdown(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showDropdown]);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch {
      // silent
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    setMarkingAll(true);
    try {
      await Promise.all(unread.map((n) => markAsRead(n.id)));
    } finally {
      setMarkingAll(false);
    }
  };

  const navigateTo = async (notification: Notification) => {
    await markAsRead(notification.id);
    setShowDropdown(false);
    if (!notification.link) return;
    const targetId = notification.appointmentId || notification.appointment?.id;
    const url = targetId
      ? `${notification.link}?highlightId=${targetId}&showDetail=true`
      : notification.link;
    await router.push(url);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] rounded-lg transition-colors hover:bg-[color:var(--color-surface-elevated)]"
        aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 bg-[color:var(--color-danger)] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-[color:var(--color-surface)] rounded-xl shadow-xl border border-[color:var(--color-border)] z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)]/50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[color:var(--color-primary)]" />
                <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                  Notificaciones
                </span>
                {hasUnread && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[color:var(--color-primary)] text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {hasUnread && (
                  <button
                    onClick={markAllAsRead}
                    disabled={markingAll}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] rounded-md hover:bg-[color:var(--color-surface)] transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    {markingAll ? "..." : "Todas"}
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] rounded-md hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="max-h-[22rem] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--color-surface-elevated)] flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-5 h-5 text-[color:var(--color-muted)]" />
                  </div>
                  <p className="text-sm text-[color:var(--color-muted)] mb-4">
                    Todo al día
                  </p>
                  <Link
                    href="/admin/appointments"
                    onClick={() => setShowDropdown(false)}
                    className="text-xs text-[color:var(--color-primary)] hover:underline font-medium"
                  >
                    Ir a citas →
                  </Link>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = ICON_MAP[notification.type] || Bell;
                  const iconColor = ICON_COLOR[notification.type];
                  const iconBg = ICON_BG[notification.type];

                  return (
                    <button
                      key={notification.id}
                      onClick={() => notification.link && navigateTo(notification)}
                      className={`w-full text-left px-4 py-3 border-b border-[color:var(--color-border)]/60 last:border-b-0 transition-colors hover:bg-[color:var(--color-surface-elevated)]/50 ${
                        !notification.read
                          ? "bg-[color:var(--color-primary)]/[0.04]"
                          : ""
                      } ${notification.link ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm truncate ${
                              !notification.read
                                ? "font-semibold text-[color:var(--color-heading)]"
                                : "font-medium text-[color:var(--color-body)]"
                            }`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-[color:var(--color-muted)] shrink-0 tabular-nums">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-[color:var(--color-muted)] mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            {notification.link && (
                              <span className="text-[11px] text-[color:var(--color-primary)] font-medium">
                                Ver detalles
                              </span>
                            )}
                            {!notification.read && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-[11px] text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)]"
                              >
                                Marcar leída
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)]/30">
                <Link
                  href="/admin/appointments"
                  onClick={() => setShowDropdown(false)}
                  className="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] transition-colors"
                >
                  Panel de citas →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
