import { useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { pujaUpdatesUrl } from "../config/config";
import {
  registerServiceWorker,
  triggerImmediateNotification,
  getNotificationPermission
} from "../utils/pushNotification";
import PujaPushNotificationPrompt from "./PujaPushNotificationPrompt";

const PujaUpdatesNotifier = () => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Register service worker in the background
    registerServiceWorker();

    const checkForNewUpdates = async () => {
      try {
        const res = await axios.get(pujaUpdatesUrl.get);
        if (!res.data?.success || !res.data?.updates?.length) return;

        const latestUpdate = res.data.updates[0];
        const lastSeenId = localStorage.getItem("gu_latest_seen_update_id");

        if (isInitialMount.current) {
          isInitialMount.current = false;
          // Store the latest ID on first run so we only alert for FUTURE new updates
          if (!lastSeenId && latestUpdate?._id) {
            localStorage.setItem("gu_latest_seen_update_id", latestUpdate._id);
          }
          return;
        }

        // If a new update arrived that is different from the stored ID
        if (latestUpdate && latestUpdate._id !== lastSeenId) {
          localStorage.setItem("gu_latest_seen_update_id", latestUpdate._id);

          // 1. Show in-app banner toast
          toast(
            (t) => (
              <div
                onClick={() => toast.dismiss(t.id)}
                className="cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🪔</span>
                  <span className="font-bold text-xs uppercase text-[#8B0000]">
                    {latestUpdate.pujaName || "New Puja Update"}
                  </span>
                </div>
                <p className="font-bold text-sm text-gray-900">{latestUpdate.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{latestUpdate.message}</p>
              </div>
            ),
            {
              duration: 7000,
              position: "top-right",
              style: {
                border: "2px solid #8B0000",
                background: "#FDF5E6",
                padding: "14px"
              }
            }
          );

          // 2. Trigger native OS / browser notification if permission is granted
          if (getNotificationPermission() === "granted") {
            await triggerImmediateNotification(latestUpdate.title, {
              body: latestUpdate.message,
              icon: "/logo.png",
              badge: "/logo.png",
              data: { updateId: latestUpdate._id, url: "/" }
            });
          }
        }
      } catch (err) {
        console.error("PujaUpdatesNotifier polling error:", err);
      }
    };

    // Initial check
    checkForNewUpdates();

    // Poll for new puja updates every 45 seconds
    const interval = setInterval(checkForNewUpdates, 45000);
    return () => clearInterval(interval);
  }, []);

  return <PujaPushNotificationPrompt />;
};

export default PujaUpdatesNotifier;
