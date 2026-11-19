import { useCallback, useRef } from "react";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export const useRazorpay = () => {
    const scriptLoaded = useRef(false);

    const loadScript = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (scriptLoaded.current || window.Razorpay) {
                scriptLoaded.current = true;
                resolve(true);
                return;
            }
            const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
            if (existing) {
                existing.onload = () => { scriptLoaded.current = true; resolve(true); };
                existing.onerror = () => reject(new Error("Razorpay script load failed"));
                return;
            }
            const script = document.createElement("script");
            script.src = RAZORPAY_SCRIPT;
            script.async = true;
            script.onload = () => { scriptLoaded.current = true; resolve(true); };
            script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
            document.body.appendChild(script);
        });
    }, []);

    const openCheckout = useCallback(async (options) => {
        await loadScript();
        return new Promise((resolve, reject) => {
            const rzp = new window.Razorpay({
                ...options,
                handler: (response) => resolve(response),
                modal: {
                    ondismiss: () => reject(new Error("Payment dismissed by user")),
                    ...(options.modal || {}),
                },
            });
            rzp.on("payment.failed", (resp) => reject(new Error(resp.error?.description || "Payment failed")));
            rzp.open();
        });
    }, [loadScript]);

    return { openCheckout, loadScript };
};

export default useRazorpay;
