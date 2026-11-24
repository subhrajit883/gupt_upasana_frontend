
import { useEffect, useState } from "react";
import axios from "axios";
import { pujaUpdatesUrl } from "../config/config";

const dummyDonations = [
    { name: "Ashis Pramanik", amount: 100 },
    { name: "Priya Chaturvedi", amount: 501 },
    { name: "Rahul Gupta", amount: 251 },

];

const UpdatesHeader = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const res = await axios.get(pujaUpdatesUrl.get);

                if (res.data?.success) {
                    setUpdates(res.data.updates || []);
                }
            } catch (err) {
                console.error("Failed to fetch puja updates:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    // Combine Puja Updates and Donation Notifications alternatively
    const pujaItems = updates.length > 0
        ? updates.map(item => ({
            type: "puja",
            title: item.title
        }))
        : loading
            ? [{ type: "puja", title: "Loading latest puja updates..." }]
            : [{ type: "puja", title: "Stay tuned for upcoming puja updates." }];

    const donationItems = dummyDonations.map(item => ({
        type: "donation",
        title: `${item.name} donated ₹${item.amount}`
    }));

    const combinedItems = [];

    const maxLength = Math.max(pujaItems.length, donationItems.length);

    for (let i = 0; i < maxLength; i++) {
        if (pujaItems[i]) combinedItems.push(pujaItems[i]);
        if (donationItems[i]) combinedItems.push(donationItems[i]);
    }

    const displayItems = [...combinedItems, ...combinedItems, ...combinedItems];

    return (
        <>
            <style>{`
                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }

                .ticker-animate {
                    animation: ticker-scroll 35s linear infinite;
                    will-change: transform;
                }

                .ticker-animate:hover {
                    animation-play-state: paused;
                }

                @media (prefers-reduced-motion: reduce) {
                    .ticker-animate {
                        animation: none;
                    }
                }
            `}</style>

            <div className="bg-[#360202] text-[#e7c652] text-sm font-medium overflow-hidden relative border-b-2 border-[#e7c652]/30 shadow-md">

                {/* Left Fade */}
                <div className="absolute left-[120px] top-0 h-full w-10 bg-gradient-to-r from-[#360202] to-transparent z-10 pointer-events-none" />

                {/* Right Fade */}
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#360202] to-transparent z-10 pointer-events-none" />

                {/* Live Updates Badge */}
                <div className="absolute left-0 top-0 h-full z-20 flex items-center">
                    <div className="flex items-center gap-2 bg-[#e7c652] h-full px-4">
                        <span className="w-2 h-2 rounded-full bg-[#8B0000] animate-pulse shrink-0" />

                        <span className="text-[#8B0000] font-black tracking-widest uppercase text-[10px] whitespace-nowrap">
                            🔔 Live Updates
                        </span>
                    </div>
                </div>

                {/* Scrolling Ticker */}
                <div className="pl-[130px] py-2.5 overflow-hidden">
                    <div className="ticker-animate inline-flex whitespace-nowrap">

                        {displayItems.map((item, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-3 pr-16"
                            >
                                {/* Animated Dot */}
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#e7c652]/40 animate-ping" />

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e7c652]" />
                                </span>

                                {/* Update Text */}
                                <span className="font-medium text-[#e7c652]">
                                    {item.type === "donation" ? (
                                        <>
                                            <span className="text-[#e7c652]">
                                                {item.title.split(" donated ")[0]}
                                            </span>

                                            <span className="text-[#e7c652]">
                                                {" "}donated{" "}
                                            </span>

                                            <span className=" text-[#e7c652]">
                                                {item.title.split(" donated ")[1]}
                                            </span>
                                        </>
                                    ) : (
                                        <span>{item.title}</span>
                                    )}
                                </span>
                            </span>
                        ))}

                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdatesHeader;
