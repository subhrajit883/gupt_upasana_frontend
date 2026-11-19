import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { pujaUpdatesUrl } from "../config/config";

const UpdatesHeader = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const trackRef = useRef(null);

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

    // Always render the bar — show placeholder while loading or on error
    const displayItems =
        updates.length > 0
            ? [...updates, ...updates, ...updates] // triple so scroll is seamless
            : loading
                ? [{ title: "Loading latest puja updates…" }]
                : [{ title: "Stay tuned for upcoming puja updates." }];

    return (
        <>
            <style>{`
                @keyframes ticker-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .ticker-animate {
                    animation: ticker-scroll 28s linear infinite;
                    will-change: transform;
                }
                .ticker-animate:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="bg-[#360202] text-[#e7c652] text-sm font-medium overflow-hidden relative border-b-2 border-[#e7c652]/30 shadow-md">
                {/* Fade edges */}
                <div className="absolute left-[120px] top-0 h-full w-10 bg-gradient-to-r from-[#6b0000] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#6b0000] to-transparent z-10 pointer-events-none" />

                {/* "LIVE UPDATES" badge */}
                <div className="absolute left-0 top-0 h-full z-20 flex items-center">
                    <div className="flex items-center gap-2 bg-[#e7c652] h-full px-4">
                        <span className="w-2 h-2 rounded-full bg-[#8B0000] animate-pulse flex-shrink-0" />
                        <span className="text-[#8B0000] font-black tracking-widest uppercase text-[10px] whitespace-nowrap">
                            🔔 Live Updates
                        </span>
                    </div>
                </div>

                {/* Scrolling ticker */}
                <div className="pl-[130px] py-2.5 overflow-hidden">
                    <div
                        ref={trackRef}
                        className="ticker-animate inline-flex gap-0 whitespace-nowrap"
                    >
                        {displayItems.map((item, idx) => (
                            <span key={idx} className="inline-flex items-center gap-3 pr-16">
                                <span className="text-[#e7c652]/50 text-xs">✦</span>
                                <span className="text-[#e7c652] font-medium">{item.title}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdatesHeader;
