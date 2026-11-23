import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPushNotifications,
  triggerImmediateNotification
} from "../utils/pushNotification";

const PujaPushNotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if browser supports push and permission is default (undecided)
    if (!isPushSupported()) return;

    const isDismissed = sessionStorage.getItem("gu_push_prompt_dismissed");
    const isSubscribed = localStorage.getItem("gu_push_subscribed");
    const permission = getNotificationPermission();

    if (!isDismissed && !isSubscribed && permission === "default") {
      // Delay showing by 3 seconds for smooth page presentation
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    const toastId = toast.loading("Enabling puja notifications…");
    try {
      await subscribeToPushNotifications();
      setShow(false);
      toast.success("🙏 Divine alerts enabled! You will now receive sacred puja updates.", {
        id: toastId,
        duration: 4000
      });

      // Send local welcome notification
      await triggerImmediateNotification("🪔 Gupt Upasana Alerts Enabled", {
        body: "Jai Mata Di! You will receive live updates on sacred pujas and temple events."
      });
    } catch (err) {
      console.error(err);
      if (Notification.permission === "denied") {
        toast.error("Notification permission was denied.", { id: toastId });
      } else {
        toast.error(err.message || "Failed to enable notifications.", { id: toastId });
      }
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("gu_push_prompt_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full mx-auto p-4 sm:p-0 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1a0a00] border-2 border-[#e7c652]/40 rounded-2xl shadow-2xl p-5 text-white relative overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e7c652]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top gold bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B0000] via-[#e7c652] to-[#8B0000]" />

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#e7c652]/15 border border-[#e7c652]/30 flex items-center justify-center flex-shrink-0 text-xl mt-0.5">
            🔔
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#e7c652]">Sacred Puja Alerts</h4>
              <button
                onClick={handleDismiss}
                className="text-white/40 hover:text-white text-sm p-1 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/75 mt-1.5 leading-relaxed">
              Receive instant push notifications for live puja updates, special celebrations, and temple rituals directly on your device.
            </p>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleEnable}
                disabled={loading}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#e7c652] to-[#ffd700] text-[#1a0a00] font-black text-xs hover:shadow-lg hover:shadow-[#e7c652]/20 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {/* <span>🙏</span> */}
                <span>{loading ? "Enabling…" : "Allow Alerts"}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="py-2 px-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 font-semibold text-xs transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PujaPushNotificationPrompt;
