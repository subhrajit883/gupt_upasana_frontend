import { useEffect, useState } from "react";
import axios from "axios";
import { authUrl } from "../config/config";
import { Link } from "react-router-dom";

// ── Info row component ────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4 border-b border-[#8B0000]/8 last:border-0">
        <div className="w-10 h-10 rounded-xl bg-[#8B0000]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[#8B0000] text-lg">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-gray-800 font-semibold text-sm break-words">{value || "—"}</p>
        </div>
    </div>
);

const Skeleton = () => (
    <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-2.5 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-100 rounded w-48" />
                </div>
            </div>
        ))}
    </div>
);

const typeMeta = {
    organisation: { label: "Organisation", color: "bg-purple-100 text-purple-800 border-purple-200", icon: "🏛️" },
    individual: { label: "Individual", color: "bg-blue-100 text-blue-800 border-blue-200", icon: "👤" },
};


const getInitials = (name = "") =>
    name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// ─────────────────────────────────────────────────────────────────────────────
const MyProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axios.get(authUrl.me, { withCredentials: true });
                if (res.data?.success) setUser(res.data.user);
                else setError("Could not load profile.");
            } catch (e) {
                setError(e?.response?.data?.message || "Failed to load profile. Please log in.");
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    const badge = typeMeta[user?.type] ?? { label: user?.type, color: "bg-gray-100 text-gray-700 border-gray-200", icon: "👤" };

    return (
        <div className="bg-[#FDF5E6] min-h-screen">

            {/* ── HERO BANNER ──────────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-[#1a0a00] via-[#5a0000] to-[#1a0a00] overflow-hidden">
                {/* Om watermark */}
                <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-[0.04] select-none pointer-events-none">
                    <span className="text-[16rem] font-black text-[#FFD700] leading-none">ॐ</span>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/25 rounded-full px-5 py-2 mb-5">
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        <span className="text-[#FFD700] text-xs tracking-[0.3em] uppercase font-semibold">My Account</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#FFD700] mb-2">
                        {loading ? "My Profile" : user?.name ?? "My Profile"}
                    </h1>
                    <p className="text-white/50 text-sm">Your personal devotee profile</p>
                </div>
                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                        <path d="M0,25 C480,55 960,0 1440,25 L1440,50 L0,50 Z" fill="#FDF5E6" />
                    </svg>
                </div>
            </div>

            {/* ── CONTENT ──────────────────────────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-6 -mt-10 pb-20">

                {/* Avatar card floating over wave */}
                {!loading && user && (
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B0000] to-[#4a0000] flex items-center justify-center shadow-xl shadow-[#8B0000]/30 border-4 border-[#FDF5E6] text-[#FFD700] text-3xl font-black">
                                {getInitials(user.name)}
                            </div>
                            <span className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full border-2 border-[#FDF5E6] flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                )}

                {/* Main card */}
                <div className="bg-white rounded-3xl border border-[#8B0000]/10 shadow-sm overflow-hidden">
                    {/* Card top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

                    <div className="p-6 md:p-8">

                        {/* Error */}
                        {error && (
                            <div className="text-center py-10 space-y-3">
                                <span className="text-5xl">⚠️</span>
                                <p className="text-red-600 font-semibold">{error}</p>
                                <Link to="/auth" className="inline-block mt-2 bg-[#8B0000] text-[#FFD700] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#6b0000] transition">
                                    Go to Login
                                </Link>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && <Skeleton />}

                        {/* Profile info */}
                        {!loading && !error && user && (
                            <>
                                {/* Type badge */}
                                {/* <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-[#5a0000] font-black text-lg">Profile Details</h2>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wide border rounded-full px-3 py-1 ${badge.color}`}>
                                        <span>{badge.icon}</span>
                                        {badge.label}
                                    </span>
                                </div> */}

                                {/* Info rows */}
                                <div className="divide-y divide-[#8B0000]/8">
                                    <InfoRow icon="👤" label="Full Name" value={user.name} />
                                    <InfoRow icon="✉️" label="Email Address" value={user.email} />
                                    <InfoRow icon="📱" label="Phone Number" value={user.phone} />
                                    <InfoRow icon="📍" label="Address" value={user.address} />
                                    <InfoRow icon="🏷️" label="Account Type" value={badge.label} />
                                </div>

                                {/* Actions */}
                                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                                    <Link
                                        to="/my-donations"
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] font-bold py-3.5 rounded-2xl hover:from-[#6b0000] hover:to-[#4a0000] transition-all duration-300 shadow-md shadow-[#8B0000]/20 text-sm"
                                    >
                                        🪔 My Donations
                                    </Link>
                                    <Link
                                        to="/donate"
                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-[#8B0000]/20 text-[#8B0000] font-bold py-3.5 rounded-2xl hover:bg-[#8B0000]/5 transition-all duration-300 text-sm"
                                    >
                                        ♥ Offer Seva
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Change password link */}
                {!loading && user && (
                    <p className="text-center mt-5 text-sm text-gray-500">
                        Want to update your password?{" "}
                        <Link to="/forgot-password" className="text-[#8B0000] font-semibold hover:underline">
                            Reset Password
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default MyProfilePage;
