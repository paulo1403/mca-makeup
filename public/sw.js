self.addEventListener('push', function(event) {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: 'Notificación', body: 'Tienes una nueva notificación' };
  }

  const title = payload.title || 'Notificación';
  const options = {
    body: payload.body || '',
    data: payload.data || {},
    icon: '/icon-128x128.png',
    badge: '/icon-128x128.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const link = event.notification.data?.link || '/admin/appointments';
  event.waitUntil(clients.openWindow(link));
});
