import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { pujaUpdatesUrl } from "../config/config";
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getExistingSubscription,
  triggerImmediateNotification
} from "../utils/pushNotification";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
};

const PujaNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState("default");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  const panelRef = useRef(null);

  // Check subscription status & permission on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!isPushSupported()) {
        setPermission("unsupported");
        return;
      }
      setPermission(getNotificationPermission());
      const sub = await getExistingSubscription();
      setIsSubscribed(!!sub);
    };
    checkStatus();
  }, []);

  // Fetch puja updates from API
  const fetchUpdates = async () => {
    try {
      const res = await axios.get(pujaUpdatesUrl.get);
      if (res.data?.success) {
        const fetched = res.data.updates || [];
        setUpdates(fetched);

        // Calculate unseen count based on stored timestamp
        const lastSeen = localStorage.getItem("gu_last_seen_puja_time");
        if (lastSeen) {
          const count = fetched.filter(
            (u) => new Date(u.createdAt || u.publishedAt).getTime() > Number(lastSeen)
          ).length;
          setUnseenCount(count);
        } else {
          setUnseenCount(fetched.length);
        }
      }
    } catch (err) {
      console.error("Error fetching updates for notification panel:", err);
    }
  };

  useEffect(() => {
    fetchUpdates();
    // Refresh updates every 45 seconds
    const interval = setInterval(fetchUpdates, 45000);
    return () => clearInterval(interval);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Mark all updates as seen when panel opens
  const handleTogglePanel = () => {
    if (!isOpen) {
      localStorage.setItem("gu_last_seen_puja_time", Date.now().toString());
      setUnseenCount(0);
      fetchUpdates();
    }
    setIsOpen(!isOpen);
  };

  // Toggle Push Notifications (Subscribe / Unsubscribe)
  const handleToggleSubscription = async () => {
    if (!isPushSupported()) {
      toast.error("Push notifications are not supported by this browser.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      isSubscribed ? "Disabling push notifications…" : "Enabling push notifications…"
    );

    try {
      if (isSubscribed) {
        await unsubscribeFromPushNotifications();
        setIsSubscribed(false);
        setPermission(getNotificationPermission());
        toast.success("Push notifications disabled.", { id: toastId });
      } else {
        await subscribeToPushNotifications();
        setIsSubscribed(true);
        setPermission("granted");
        toast.success("🙏 Divine alerts enabled! You will now receive sacred puja updates.", {
          id: toastId,
          duration: 4000
        });

        // Trigger a friendly welcome notification
        await triggerImmediateNotification("🪔 Gupt Upasana Alerts Enabled", {
          body: "Jai Mata Di! You will receive live updates on sacred pujas and temple events."
        });
      }
    } catch (err) {
      console.error("Subscription error:", err);
      const msg = err.message || "Failed to update notification settings.";
      if (Notification.permission === "denied") {
        setPermission("denied");
        toast.error("Notification permission is blocked. Please allow notifications in browser settings.", {
          id: toastId,
          duration: 5000
        });
      } else {
        toast.error(msg, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  // Send a test push notification to verify delivery
  const handleSendTestPush = async () => {
    setTesting(true);
    try {
      // Direct local test notification
      await triggerImmediateNotification("🪔 Sacred Puja Alert: Test", {
        body: "Blessings from Gupt Upasana! Push notifications are active and working on your device.",
        icon: "/logo.png"
      });

      // Also call backend test-push API if subscription exists
      const sub = await getExistingSubscription();
      if (sub) {
        await axios
          .post(pujaUpdatesUrl.testPush, {
            endpoint: sub.endpoint,
            title: "🪔 Gupt Upasana Temple",
            message: "Sacred alert test: Push notification sent from server successfully!"
          })
          .catch(() => {});
      }

      toast.success("🔔 Test notification sent to your device!");
    } catch (err) {
      toast.error("Could not trigger test notification: " + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleTogglePanel}
        aria-label="View puja notifications"
        className="relative p-2 rounded-full text-[#e7c652] hover:bg-[#e7c652]/15 transition-all duration-200 flex items-center justify-center focus:outline-none"
      >
        <span className="text-xl">🔔</span>

        {/* Unseen Badge */}
        {unseenCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1a0a00] animate-bounce shadow-md">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#8B0000]/15 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-gray-800">
          {/* Header Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

          {/* Panel Header */}
          <div className="bg-[#1a0a00] px-5 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl text-[#FFD700]">🪔</span>
              <div>
                <h3 className="font-bold text-sm text-[#FFD700] leading-none">Puja Updates & Alerts</h3>
                <p className="text-[11px] text-white/60 mt-0.5">Live temple updates & sadhnas</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white text-lg p-1 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Push Notification Controls Bar */}
          <div className="bg-[#FDF5E6] border-b border-[#8B0000]/10 px-5 py-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-xs text-[#8B0000]">Device Push Alerts</p>
              <p className="text-[11px] text-gray-500">
                {permission === "denied"
                  ? "Blocked in browser settings"
                  : isSubscribed
                  ? "Active • Receiving alerts"
                  : "Enable to receive alerts"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isSubscribed && (
                <button
                  onClick={handleSendTestPush}
                  disabled={testing}
                  title="Send a test notification to your device"
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#8B0000]/10 text-[#8B0000] hover:bg-[#8B0000]/20 transition disabled:opacity-50"
                >
                  {testing ? "Sending…" : "Test Alert"}
                </button>
              )}

              {/* Toggle Switch */}
              <button
                onClick={handleToggleSubscription}
                disabled={loading || permission === "denied"}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSubscribed ? "bg-[#8B0000]" : "bg-gray-300"
                } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
                role="switch"
                aria-checked={isSubscribed}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isSubscribed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Blocked Permission Notice if denied */}
          {permission === "denied" && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-800 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span>
                Notifications are blocked. Please click the padlock icon in your browser URL bar to allow notifications for this site.
              </span>
            </div>
          )}

          {/* List of Puja Updates */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
            {updates.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-3xl block mb-2">🪔</span>
                <p className="text-xs">No updates available at the moment.</p>
                <p className="text-[11px] text-gray-400 mt-1">Stay tuned for upcoming temple pujas.</p>
              </div>
            ) : (
              updates.map((item) => (
                <div
                  key={item._id}
                  className="p-3 rounded-xl hover:bg-[#FDF5E6]/60 transition-colors flex flex-col gap-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-[#8B0000]/10 px-2 py-0.5 rounded-full">
                      {item.pujaName || "Temple Update"}
                    </span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {formatDate(item.scheduledAt || item.publishedAt || item.createdAt)}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-100 p-3 text-center">
            <p className="text-[11px] text-gray-500">
              Gupt Upasana Sacred Alerts • Powered by Web Push
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PujaNotificationBell;
