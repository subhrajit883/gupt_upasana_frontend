import axios from "axios";
import { pujaUpdatesUrl } from "../config/config";

// Convert base64 VAPID public key to Uint8Array for PushManager subscription
export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if browser supports Web Push notifications and Service Worker
export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Get current notification permission: 'default', 'granted', or 'denied'
export function getNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

// Register service worker if not already registered
export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await reg.update().catch(() => {});
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.error("Failed to register Service Worker for push notifications:", err);
    return null;
  }
}

// Get existing push subscription from PushManager
export async function getExistingSubscription() {
  if (!isPushSupported()) return null;
  try {
    const reg = await registerServiceWorker();
    if (!reg) return null;
    return await reg.pushManager.getSubscription();
  } catch (err) {
    console.error("Error checking existing push subscription:", err);
    return null;
  }
}

// Fetch VAPID public key from backend API or environment fallback
export async function fetchVapidPublicKey() {
  try {
    const res = await axios.get(pujaUpdatesUrl.vapidKey);
    if (res.data?.success && res.data?.publicKey) {
      return res.data.publicKey;
    }
  } catch (err) {
    console.warn("Could not fetch VAPID key from backend, using fallback:", err.message);
  }
  return (
    import.meta.env.VITE_VAPID_PUBLIC_KEY ||
    "BCm4nw7WW2tttpYyHfY6GHjWS5jbRWopdWyR2zt1mxgngpNFRCs_qsq592172-80t_ca40up_21FirYqNBXdBzI"
  );
}

// Subscribe user device to push notifications
export async function subscribeToPushNotifications() {
  if (!isPushSupported()) {
    throw new Error("Push notifications are not supported on this browser.");
  }

  // Request browser permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const reg = await registerServiceWorker();
  if (!reg) {
    throw new Error("Service Worker is not ready.");
  }

  const vapidKey = await fetchVapidPublicKey();
  if (!vapidKey) {
    throw new Error("Push notification server public key is unavailable.");
  }

  const applicationServerKey = urlBase64ToUint8Array(vapidKey);

  // Subscribe using PushManager
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  });

  // Send subscription to backend
  await axios.post(pujaUpdatesUrl.subscribe, {
    subscription: subscription.toJSON(),
    userAgent: navigator.userAgent
  });

  localStorage.setItem("gu_push_subscribed", "true");
  return subscription;
}

// Unsubscribe user device from push notifications
export async function unsubscribeFromPushNotifications() {
  if (!isPushSupported()) return true;

  try {
    const reg = await registerServiceWorker();
    if (reg) {
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        // Notify backend to remove subscription
        await axios.post(pujaUpdatesUrl.unsubscribe, { endpoint: sub.endpoint }).catch(() => {});
        await sub.unsubscribe();
      }
    }
    localStorage.removeItem("gu_push_subscribed");
    return true;
  } catch (err) {
    console.error("Failed to unsubscribe from push notifications:", err);
    throw err;
  }
}

// Trigger an immediate notification (native or ServiceWorker)
export async function triggerImmediateNotification(title, options = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const defaultOptions = {
    body: "Sacred blessings from Gupt Upasana Temple.",
    icon: "/logo.png",
    badge: "/logo.png",
    ...options
  };

  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg && "showNotification" in reg) {
      return await reg.showNotification(title, defaultOptions);
    }
  } catch {
    // fallback to window.Notification
  }

  try {
    return new Notification(title, defaultOptions);
  } catch (err) {
    console.warn("Could not display notification:", err);
  }
}
