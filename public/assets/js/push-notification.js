self.addEventListener('push', function(event) {
  const data = event.data.json().data;
  const notification = event.data.json().notification;
  const title = notification.title;
  const body = notification.body;

  const options = {
    body,
    dir: 'rtl',
    data,
    badge: '/assets/icons/monochrome_icon.png',
    icon: '/assets/icons/android-chrome-192x192.png',
  };

  if (Object.prototype.hasOwnProperty.call(data,'interaction') && data.interaction) {
    options.requireInteraction = true;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );

});

self.addEventListener('notificationclick', function(event) {
  if (Object.prototype.hasOwnProperty.call(event.notification.data,'link')) {
    self.clients.openWindow(event.notification.data.link)
  }
  event.notification.close();
});
