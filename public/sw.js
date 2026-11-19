// Service Worker for Gupt Upasana Push Notifications
const CACHE_NAME = "gupt-upasana-sw-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Listen for incoming Web Push events from the server
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "Gupt Upasana - Puja Update", body: event.data.text() };
    }
  }

  const title = data.title || "🪔 Gupt Upasana - Sacred Puja Alert";
  const options = {
    body: data.body || data.message || "New sacred puja update and blessings available.",
    icon: data.icon || "/logo.png",
    badge: data.badge || "/logo.png",
    image: data.image || undefined,
    vibrate: [300, 100, 300, 100, 300],
    tag: data.data?.updateId ? `puja-update-${data.data.updateId}` : `puja-${Date.now()}`,
    renotify: true,
    requireInteraction: true, // Keep notification visible on screen until user clicks/dismisses
    silent: false,
    data: {
      url: data.url || "/",
      updateId: data.data?.updateId || null,
      timestamp: Date.now()
    },
    actions: [
      { action: "explore", title: "🙏 View Update" },
      { action: "close", title: "Dismiss" }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((err) => {
      console.error("[SW] showNotification error:", err);
    })
  );
});

// Handle clicking on the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle subscription change/refresh
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        return fetch("/api/puja-updates/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription })
        });
      })
      .catch((err) => console.error("[SW] pushsubscriptionchange error:", err))
  );
});
