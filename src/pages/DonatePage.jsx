import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { donationUrl } from "../config/config";
import { useAuth } from "../context/AuthContext";
import { useRazorpay } from "../hooks/useRazorpay";
import fallback from "../assets/fallback.jpeg";
// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const categoryBadge = {
    dynamic: { label: "Special Event", color: "bg-amber-100 text-amber-800 border-amber-200" },
    static: { label: "General Seva", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

const FALLBACK_IMG = fallback



// ── Skeleton loader card ──────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-2 bg-gray-200 w-full" />
        <div className="h-44 bg-gray-100 w-full" />
        <div className="p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-10 bg-gray-100 rounded-xl" />
            <div className="h-11 bg-gray-200 rounded-xl" />
        </div>
    </div>
);

// ── Single Package Card ───────────────────────────────────────────────────────
const PackageCard = ({ pkg }) => {
    const navigate = useNavigate();
    const { isLoggedIn, user, authHeader } = useAuth();
    const { openCheckout } = useRazorpay();

    const [selectedAmountId, setSelectedAmountId] = useState(
        !pkg.allowCustomAmount ? (pkg.amounts?.[0]?._id ?? "") : ""
    );
    const [selectedAmount, setSelectedAmount] = useState(
        !pkg.allowCustomAmount ? (pkg.amounts?.[0]?.amount ?? "") : ""
    );
    const [customAmt, setCustomAmt] = useState("");
    const [customErr, setCustomErr] = useState("");
    const [paying, setPaying] = useState(false);

    const badge = categoryBadge[pkg.category] ?? { label: pkg.category, color: "bg-gray-100 text-gray-700 border-gray-200" };
    const finalAmount = pkg.allowCustomAmount ? customAmt : selectedAmount;

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomAmt(val);
        const num = Number(val);
        if (!val) { setCustomErr(""); return; }
        if (isNaN(num) || num <= 0) { setCustomErr("Enter a valid amount."); return; }
        if (pkg.minAmt && num < pkg.minAmt) { setCustomErr(`Minimum amount is ${formatINR(pkg.minAmt)}.`); return; }
        if (pkg.maxAmt && num > pkg.maxAmt) { setCustomErr(`Maximum amount is ${formatINR(pkg.maxAmt)}.`); return; }
        setCustomErr("");
    };

    const handleSelectChange = (e) => {
        const id = e.target.value;
        setSelectedAmountId(id);
        const opt = pkg.amounts.find((a) => a._id === id);
        setSelectedAmount(opt?.amount ?? "");
    };

    const handleDonate = async () => {
        // Redirect to login if not signed in
        if (!isLoggedIn) {
            navigate("/user/login", { state: { from: "/donate" } });
            return;
        }

        const amt = Number(finalAmount);
        if (!amt || amt <= 0) return;
        if (customErr) return;

        setPaying(true);
        const toastId = toast.loading("Creating your donation order…");

        try {
            // 1. Create order on backend
            const orderPayload = {
                packageId: pkg._id,
                amount: amt,
                amountOptionId: !pkg.allowCustomAmount ? selectedAmountId : undefined,
                purpose: pkg.name,
            };

            const orderRes = await axios.post(donationUrl.createOrder, orderPayload, {
                headers: authHeader,
                withCredentials: true,
            });

            if (!orderRes.data?.success) throw new Error(orderRes.data?.message || "Order creation failed");

            const { donationId, razorpay: rzpConfig, donor } = orderRes.data;

            toast.loading("Opening payment gateway…", { id: toastId });

            // 2. Open Razorpay checkout
            const paymentResponse = await openCheckout({
                key: rzpConfig.keyId,
                amount: rzpConfig.amount,
                currency: rzpConfig.currency,
                order_id: rzpConfig.orderId,
                name: "Gupt Upasana Temple",
                description: pkg.name,
                image: "/logo.png",
                prefill: {
                    name: donor?.name || user?.name || "",
                    email: donor?.email || user?.email || "",
                    contact: donor?.contact || user?.phone || "",
                },
                notes: { packageName: pkg.name },
                theme: { color: "#8B0000" },
            });

            // 3. Verify payment on backend
            toast.loading("Verifying payment…", { id: toastId });

            const verifyRes = await axios.post(
                donationUrl.verifyPayment,
                {
                    donationId,
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                },
                { headers: authHeader, withCredentials: true }
            );

            if (!verifyRes.data?.success) throw new Error(verifyRes.data?.message || "Payment verification failed");

            toast.success("🙏 Seva offered! Jai Maa!", { id: toastId });

            // 4. Navigate to success page
            navigate("/donate/success", {
                state: {
                    donation: verifyRes.data.donation,
                    amount: amt,
                    packageName: pkg.name,
                },
            });

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Payment could not be completed";
            if (msg.includes("dismissed")) {
                toast.error("Payment cancelled.", { id: toastId });
            } else {
                toast.error(msg, { id: toastId });
            }
        } finally {
            setPaying(false);
        }
    };

    const isDisabled = paying || (pkg.allowCustomAmount ? !customAmt || !!customErr : !selectedAmountId);

    return (
        <div className="group bg-white rounded-2xl border border-[#8B0000]/10 shadow-sm hover:shadow-xl hover:shadow-[#8B0000]/10 transition-all duration-400 overflow-hidden flex flex-col">

            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

            {/* Package image */}
            <div className="relative h-44 bg-[#FDF5E6] overflow-hidden">
                <img
                    src={pkg.packageImg?.url || FALLBACK_IMG}
                    alt={pkg.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 inline-block text-[10px] font-bold tracking-widest uppercase border rounded-full px-2.5 py-0.5 backdrop-blur-sm ${badge.color}`}>
                    {badge.label}
                </span>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-[#5a0000] font-black text-xl leading-tight group-hover:text-[#8B0000] transition-colors">
                            {pkg.name}
                        </h3>
                    </div>
                    <span className="text-3xl flex-shrink-0 mt-1">🪔</span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">{pkg.description}</p>

                {/* Benefits */}
                {pkg.benefits?.length > 0 && (
                    <div className="bg-[#FDF5E6] border border-[#FFD700]/30 rounded-xl p-4">
                        <p className="text-[#8B0000] font-bold text-xs uppercase tracking-widest mb-2.5">
                            ✦ Seva Benefits
                        </p>
                        <ul className="space-y-1.5">
                            {pkg.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-[#FFD700] text-base leading-none flex-shrink-0 mt-0.5">•</span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Amount selector */}
                <div className="mt-auto space-y-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Select Seva Amount
                    </label>

                    {pkg.allowCustomAmount ? (
                        /* Custom amount input */
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B0000] font-bold text-base">₹</span>
                            <input
                                type="number"
                                min={pkg.minAmt ?? 1}
                                max={pkg.maxAmt ?? undefined}
                                placeholder={
                                    pkg.minAmt && pkg.maxAmt
                                        ? `${pkg.minAmt} – ${pkg.maxAmt}`
                                        : pkg.minAmt
                                            ? `Min ₹${pkg.minAmt}`
                                            : "Enter amount"
                                }
                                value={customAmt}
                                onChange={handleCustomChange}
                                disabled={paying}
                                className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 focus:border-[#8B0000] rounded-xl text-gray-800 font-semibold outline-none transition-colors text-sm disabled:opacity-50"
                            />
                            {(pkg.minAmt || pkg.maxAmt) && (
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">
                                    {pkg.minAmt && `Min: ${formatINR(pkg.minAmt)}`}
                                    {pkg.minAmt && pkg.maxAmt && "  •  "}
                                    {pkg.maxAmt && `Max: ${formatINR(pkg.maxAmt)}`}
                                </p>
                            )}
                            {customErr && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{customErr}</p>
                            )}
                        </div>
                    ) : (
                        /* Dropdown of preset amounts */
                        <div className="relative">
                            <select
                                value={selectedAmountId}
                                onChange={handleSelectChange}
                                disabled={paying}
                                className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 focus:border-[#8B0000] rounded-xl text-gray-800 font-semibold outline-none transition-colors text-sm bg-white cursor-pointer disabled:opacity-50"
                            >
                                <option value="" disabled>-- Choose amount --</option>
                                {pkg.amounts.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.label} — {formatINR(a.amount)}
                                    </option>
                                ))}
                            </select>
                            {/* Custom chevron */}
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B0000]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Selected amount preview */}
                    {finalAmount && !customErr && (
                        <div className="flex items-center justify-between bg-[#8B0000]/5 border border-[#8B0000]/15 rounded-xl px-4 py-2.5">
                            <span className="text-[#8B0000] text-xs font-semibold">Your Seva</span>
                            <span className="text-[#8B0000] font-black text-base">{formatINR(Number(finalAmount))}</span>
                        </div>
                    )}

                    {/* Donate button */}
                    <button
                        onClick={handleDonate}
                        disabled={isDisabled}
                        className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] shadow-lg shadow-[#8B0000]/20 hover:shadow-xl hover:shadow-[#8B0000]/30 hover:-translate-y-0.5"
                            }`}
                    >
                        {paying ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Processing…</span>
                            </>
                        ) : (
                            <>
                                <span>🙏</span>
                                <span>
                                    {!isLoggedIn
                                        ? "Sign In to Donate"
                                        : `Offer Seva${finalAmount && !customErr ? ` · ${formatINR(Number(finalAmount))}` : ""}`}
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Rules */}
                {pkg.rules?.length > 0 && (
                    <div className="border-t border-dashed border-gray-200 pt-3 mt-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            📋 Terms & Conditions
                        </p>
                        <ul className="space-y-1">
                            {pkg.rules.map((r, i) => (
                                <li key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                                    <span className="flex-shrink-0 mt-0.5">•</span>
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const DonatePage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await axios.get(donationUrl.packages);
                if (res.data?.success) {
                    setPackages(res.data.packages.filter((p) => p.active));
                }
            } catch (e) {
                console.error(e);
                setError("Could not load donation packages. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetch_();
    }, []);

    return (
        <div className="bg-[#FDF5E6] min-h-screen">

            {/* ── HERO BANNER ───────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-[#1a0a00] via-[#5a0000] to-[#1a0a00] overflow-hidden">
                {/* Background Om watermark */}
                <div className="absolute inset-0 flex items-center justify-end pr-20 opacity-[0.04] select-none pointer-events-none">
                    <span className="text-[20rem] font-black text-[#FFD700] leading-none">ॐ</span>
                </div>
                {/* Decorative rings */}
                <div className="absolute top-6 left-6 w-32 h-32 rounded-full border border-[#FFD700]/10" />
                <div className="absolute bottom-4 right-40 w-20 h-20 rounded-full border border-[#FFD700]/10" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">

                    {/* Auth strip */}
                    {/* <div className="flex justify-end mb-4">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                                <span className="text-[#FFD700] text-xs font-semibold">🙏 {user?.name}</span>
                                <button
                                    onClick={() => { logout(); navigate("/donate"); }}
                                    className="text-white/50 hover:text-white text-xs transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/user/login", { state: { from: "/donate" } })}
                                className="bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#FFD700]/20 transition-colors"
                            >
                                Sign In / Register
                            </button>
                        )}
                    </div> */}

                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/25 rounded-full px-5 py-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        <span className="text-[#FFD700] text-xs tracking-[0.3em] uppercase font-medium">
                            Gupt Upasana Temple
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl  text-[#FFD700] font-medium leading-tight mb-4">
                        Offer Your Seva
                    </h1>
                    <p className="text-white/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
                        Your contribution supports sacred temple activities, daily pujas, and the spiritual mission of Gupt Upasana. Every offering, big or small, is a divine act of devotion.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-center">
                        {[
                            { icon: "🛕", label: "Temple Maintenance" },
                            { icon: "🪔", label: "Daily Pujas" },
                            { icon: "📿", label: "Spiritual Activities" },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-2 bg-[#FFD700]/8 border border-[#FFD700]/15 rounded-full px-5 py-2">
                                <span>{s.icon}</span>
                                <span className="text-[#FFD700]/80 text-sm font-medium">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wave bottom */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10 md:h-14">
                        <path d="M0,25 C480,55 960,0 1440,25 L1440,50 L0,50 Z" fill="#FDF5E6" />
                    </svg>
                </div>
            </div>

            {/* ── PACKAGES GRID ─────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Section heading */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8B0000]/50" />
                        <span className="text-[#8B0000] text-2xl">🪷</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B0000]/50" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#8B0000]">Choose Your Seva</h2>
                    <p className="text-gray-500 text-sm mt-2">Select a package that resonates with your devotion</p>
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 mb-10">
                        <span className="text-3xl mb-2 block">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Package cards */}
                {!loading && !error && packages.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <span className="text-5xl mb-4 block">🙏</span>
                        <p>No donation packages available at the moment.</p>
                    </div>
                )}

                {!loading && packages.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg._id} pkg={pkg} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── TRUST FOOTER STRIP ────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-[#8B0000]/8 via-[#FFD700]/10 to-[#8B0000]/8 border-t border-[#8B0000]/10 py-10 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: "🔒", title: "Secure Payments", desc: "All transactions are encrypted via Razorpay." },
                        // { icon: "🧾", title: "Tax Benefits", desc: "Donations may be eligible for tax deductions." },
                        { icon: "🙏", title: "Divine Blessings", desc: "Every offering invites divine grace into your life." },
                    ].map((t) => (
                        <div key={t.title} className="flex flex-col items-center gap-2">
                            <span className="text-3xl">{t.icon}</span>
                            <p className="font-bold text-[#8B0000] text-sm">{t.title}</p>
                            <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonatePage;
