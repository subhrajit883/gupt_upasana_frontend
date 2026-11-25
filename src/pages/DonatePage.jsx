import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Heart,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    ChevronDown,
    Flame,
    Lock,
    ArrowRight,
    HelpCircle,
    Receipt,
} from "lucide-react";
import { donationUrl } from "../config/config";
import { useAuth } from "../context/AuthContext";
import { useRazorpay } from "../hooks/useRazorpay";
import fallback from "../assets/fallback.jpeg";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(n) || 0);

const FALLBACK_IMG = fallback;

const categoryBadge = {
    dynamic: {
        label: "Special Event",
        color: "bg-amber-500/10 text-amber-900 border-amber-300/60",
        badgeBg: "from-amber-600 to-amber-700",
    },
    static: {
        label: "Nitya Seva",
        color: "bg-emerald-500/10 text-emerald-900 border-emerald-300/60",
        badgeBg: "from-emerald-700 to-teal-800",
    },
};

// ── Skeleton Loader Card ──────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-[#e7c66b]/20 shadow-md overflow-hidden animate-pulse flex flex-col">
        <div className="h-52 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
        <div className="p-7 space-y-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
            </div>
            <div className="space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-full" />
                <div className="h-3.5 bg-gray-100 rounded w-4/5" />
            </div>
            <div className="h-24 bg-gray-50 rounded-2xl border border-gray-100" />
            <div className="mt-auto pt-4 space-y-3">
                <div className="h-12 bg-gray-100 rounded-xl" />
                <div className="h-13 bg-gray-200 rounded-2xl" />
            </div>
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
    const [showBenefits, setShowBenefits] = useState(false);

    const badge =
        categoryBadge[pkg.category] ?? {
            label: pkg.category || "Seva",
            color: "bg-gray-100 text-gray-700 border-gray-200",
            badgeBg: "from-[#4a0a0d] to-[#6b0000]",
        };

    const finalAmount = pkg.allowCustomAmount ? customAmt : selectedAmount;

    // Quick suggestion presets for custom amount
    const quickCustomPresets = [501, 1100, 2100, 5100];

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomAmt(val);
        const num = Number(val);
        if (!val) {
            setCustomErr("");
            return;
        }
        if (isNaN(num) || num <= 0) {
            setCustomErr("Please enter a valid amount.");
            return;
        }
        if (pkg.minAmt && num < pkg.minAmt) {
            setCustomErr(`Minimum seva amount is ${formatINR(pkg.minAmt)}.`);
            return;
        }
        if (pkg.maxAmt && num > pkg.maxAmt) {
            setCustomErr(`Maximum seva amount is ${formatINR(pkg.maxAmt)}.`);
            return;
        }
        setCustomErr("");
    };

    const handleSelectAmountObj = (amountObj) => {
        setSelectedAmountId(amountObj._id);
        setSelectedAmount(amountObj.amount);
    };

    const handleDonate = async () => {
        // Redirect to login if not signed in
        if (!isLoggedIn) {
            navigate("/auth", { state: { from: "/donate" } });
            return;
        }

        const amt = Number(finalAmount);
        if (!amt || amt <= 0) return;
        if (customErr) return;

        setPaying(true);
        const toastId = toast.loading("Preparing sacred donation order…");

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

            if (!orderRes.data?.success)
                throw new Error(orderRes.data?.message || "Order creation failed");

            const { donationId, razorpay: rzpConfig, donor } = orderRes.data;

            toast.loading("Connecting to secure payment gateway…", { id: toastId });

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
                theme: { color: "#4A0A0D" },
            });

            // 3. Verify payment on backend
            toast.loading("Verifying your seva transaction…", { id: toastId });

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

            if (!verifyRes.data?.success)
                throw new Error(verifyRes.data?.message || "Payment verification failed");

            toast.success("🙏 Sacred Seva Received! Jai Maa Kali!", { id: toastId });

            // 4. Navigate to success page
            navigate("/donate/success", {
                state: {
                    donation: verifyRes.data.donation,
                    amount: amt,
                    packageName: pkg.name,
                },
            });
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || "Payment could not be completed";
            if (msg.includes("dismissed")) {
                toast.error("Payment cancelled.", { id: toastId });
            } else {
                toast.error(msg, { id: toastId });
            }
        } finally {
            setPaying(false);
        }
    };

    const isDisabled =
        paying ||
        (pkg.allowCustomAmount
            ? !customAmt || !!customErr || Number(customAmt) <= 0
            : !selectedAmountId);

    // Selected amount label for display
    const selectedObj = !pkg.allowCustomAmount
        ? pkg.amounts?.find((a) => a._id === selectedAmountId)
        : null;

    return (
        <div className="group relative bg-white rounded-3xl border border-[#e7c66b]/35 shadow-lg shadow-[#4a0a0d]/5 hover:shadow-2xl hover:shadow-[#4a0a0d]/15 hover:border-[#e7c66b] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
            {/* Top radiant gold accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#4a0a0d] via-[#e7c66b] to-[#4a0a0d]" />

            {/* ── Package Image Header ── */}
            <div className="relative h-52 bg-[#1a0a00] overflow-hidden">
                <img
                    src={pkg.packageImg?.url || FALLBACK_IMG}
                    alt={pkg.name}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-[#e7c66b] border border-[#e7c66b]/40 rounded-full px-3 py-1 shadow-md">
                        <Flame size={12} className="text-[#e7c66b]" />
                        <span>{badge.label}</span>
                    </span>

                    {/* Date / Status Tag if dynamic */}
                    {pkg.category === "dynamic" && pkg.endDate && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#4a0a0d]/80 backdrop-blur-md text-white/90 border border-white/20 rounded-full px-2.5 py-1">
                            <Calendar size={11} className="text-[#e7c66b]" />
                            <span>Festival Seva</span>
                        </span>
                    )}
                </div>

                {/* Bottom title strip over image */}
                <div className="absolute bottom-4 left-5 right-5 z-10">
                    <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md font-serif leading-tight">
                        {pkg.name}
                    </h3>
                </div>
            </div>

            {/* ── Card Body ── */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
                {/* Description */}
                <div>
                    <p className="text-gray-600 text-sm leading-relaxed font-normal">
                        {pkg.description ||
                            "Contribute towards sacred worship, devotional offerings, and divine temple seva."}
                    </p>

                    {/* Benefits Accordion / Badge */}
                    {/* {pkg.benefits?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f0ece4]">
                            <button
                                type="button"
                                onClick={() => setShowBenefits(!showBenefits)}
                                className="flex items-center justify-between w-full text-left text-xs font-bold text-[#8B0000] hover:text-[#5a0000] transition"
                            >
                                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                                    <Sparkles size={13} className="text-[#c59a35]" />
                                    <span>Seva Benefits & Blessings ({pkg.benefits.length})</span>
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${showBenefits ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {showBenefits && (
                                <ul className="mt-3 space-y-2 bg-[#FAF5EB] p-3.5 rounded-2xl border border-[#e7c66b]/30 animate-in fade-in duration-200">
                                    {pkg.benefits.map((b, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-xs text-gray-700 leading-snug"
                                        >
                                            <CheckCircle2
                                                size={13}
                                                className="text-emerald-700 shrink-0 mt-0.5"
                                            />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )} */}
                </div>


                {/* ── Amount Selection Area ── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#4a0a0d]">
                            Select Seva Offering
                        </label>

                        {pkg.allowCustomAmount && (
                            <span className="text-[11px] text-[#8B0000] font-semibold bg-[#8B0000]/8 px-2 py-1 rounded-md">
                                Flexible Amount
                            </span>
                        )}
                    </div>

                    {pkg.allowCustomAmount ? (
                        <div className="space-y-2.5">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#8B0000]">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    min={pkg.minAmt ?? 1}
                                    max={pkg.maxAmt ?? undefined}
                                    placeholder={
                                        pkg.minAmt && pkg.maxAmt
                                            ? `Enter between ₹${pkg.minAmt} - ₹${pkg.maxAmt}`
                                            : pkg.minAmt
                                                ? `Minimum ₹${pkg.minAmt}`
                                                : "Enter offering amount"
                                    }
                                    value={customAmt}
                                    onChange={handleCustomChange}
                                    disabled={paying}
                                    className="w-full pl-10 pr-4 py-3.5 border border-[#e7c66b]/50 focus:border-[#8B0000] rounded-xl text-gray-900 font-semibold outline-none transition-all text-sm bg-[#FFFDF9] focus:ring-4 focus:ring-[#8B0000]/10"
                                />
                            </div>

                            {(pkg.minAmt || pkg.maxAmt) && !customErr && (
                                <p className="text-[11px] text-gray-400">
                                    {pkg.minAmt && `Minimum: ${formatINR(pkg.minAmt)}`}
                                    {pkg.minAmt && pkg.maxAmt && " • "}
                                    {pkg.maxAmt && `Maximum: ${formatINR(pkg.maxAmt)}`}
                                </p>
                            )}

                            {customErr && (
                                <p className="text-red-600 text-xs font-semibold">
                                    {customErr}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={selectedAmountId}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    const selected = pkg.amounts?.find(
                                        (a) => a._id === id
                                    );

                                    setSelectedAmountId(id);
                                    setSelectedAmount(selected?.amount ?? "");
                                }}
                                disabled={paying}
                                className="w-full appearance-none px-4 py-3.5 pr-11 border border-[#e7c66b]/50 rounded-xl bg-[#FFFDF9] text-[#4a0a0d] font-semibold text-sm outline-none cursor-pointer transition-all focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10"
                            >
                                <option value="" disabled>
                                    -- Select Donation Amount --
                                </option>

                                {pkg.amounts?.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.label || "Sacred Seva"} — {formatINR(a.amount)}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B0000] pointer-events-none"
                            />
                        </div>
                    )}

                    {/* Selected Seva Summary */}
                    {finalAmount && !customErr && (
                        <div className="flex items-center justify-between bg-[#FAF5EB] border border-[#e7c66b]/40 rounded-xl px-4 py-3">
                            <span className="text-xs font-semibold text-gray-700">
                                🪷 {selectedObj?.label || "Devotional Offering"}
                            </span>

                            <span className="text-base font-black text-[#4a0a0d]">
                                {formatINR(Number(finalAmount))}
                            </span>
                        </div>
                    )}

                    {/* Donate Button */}
                    <button
                        onClick={handleDonate}
                        disabled={isDisabled}
                        className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-gradient-to-r from-[#4a0a0d] to-[#721117] text-[#e7c66b] hover:from-[#661016] hover:to-[#4a0a0d] hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] border border-[#e7c66b]/40"
                            }`}
                    >
                        {paying ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#e7c66b]/30 border-t-[#e7c66b] rounded-full animate-spin" />
                                Connecting Gateway...
                            </>
                        ) : (
                            <>
                                🙏
                                <span>
                                    {!isLoggedIn
                                        ? "Sign In to Offer Seva"
                                        : `Offer Seva${finalAmount && !customErr
                                            ? ` · ${formatINR(Number(finalAmount))}`
                                            : ""
                                        }`}
                                </span>
                                <ArrowRight size={15} />
                            </>
                        )}
                    </button>
                </div>

                {/* Terms / Rules Note */}
                {pkg.rules?.length > 0 && (
                    <div className="pt-2 border-t border-dashed border-[#e7c66b]/30">
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <HelpCircle size={11} className="text-[#c59a35]" />
                            <span>{pkg.rules[0]}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Main Donate Page ──────────────────────────────────────────────────────────
const DonatePage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'static' | 'dynamic'
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

    // Filter packages according to selected tab
    const filteredPackages = packages.filter((pkg) => {
        if (activeTab === "all") return true;
        return pkg.category === activeTab;
    });

    return (
        <div className="bg-[#FAF6EE] min-h-screen text-gray-800">
            {/* ═══════════════════════════════════════════════════════════════
                HERO BANNER — Royal Temple Sanctum Aesthetic
            ═══════════════════════════════════════════════════════════════ */}
            <div className="relative bg-gradient-to-br from-[#1c0406] via-[#4a0a0d] to-[#1a0305] text-white overflow-hidden py-18 sm:py-24 border-b-4 border-[#e7c66b]">
                {/* Background Sacred Om Watermark */}
                <div className="absolute inset-0 flex items-center justify-end pr-10 sm:pr-24 opacity-4 pointer-events-none select-none">
                    <span className="text-[20rem] sm:text-[28rem] font-black text-[#e7c66b] leading-none">
                        ॐ
                    </span>
                </div>

                {/* Ambient Golden Auras */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e7c66b]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#e7c66b]/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Top Devotee Status Pill */}
                    {/* <div className="flex justify-center mb-6">
                        {isLoggedIn ? (
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-[#e7c66b]/40 rounded-full px-4 py-1.5 shadow-md">
                                <span className="text-xs text-[#e7c66b] font-bold">
                                    🙏 Pranam, {user?.name}
                                </span>
                                <span className="text-white/40">•</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/donate");
                                    }}
                                    className="text-white/60 hover:text-white text-xs underline transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-[#e7c66b]/15 backdrop-blur-md border border-[#e7c66b]/40 rounded-full px-4 py-1.5 shadow-md">
                                <span className="w-2 h-2 rounded-full bg-[#e7c66b] animate-pulse" />
                                <span className="text-[#e7c66b] text-xs uppercase tracking-[0.25em] font-bold">
                                    Gupt Upasana Sacred Seva
                                </span>
                            </div>
                        )}
                    </div> */}

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#e7c66b] font-serif leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] mb-4">
                        Offer Your Sacred Seva
                    </h1>

                    {/* Sacred Subtext */}
                    <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-8">
                        Your holy contribution directly sustains daily nitya pujas, consecrated
                        bhog, annadanam, and the timeless tantric upasana of Maa Mahakali, Mahakal
                        Bhairav, and Maa Baglamukhi.
                    </p>

                    {/* Mission Focus Chips */}
                    {/* <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        {[
                            { icon: "🛕", label: "Mandir Upkeep & Sanctum Care" },
                            { icon: "🪔", label: "Nitya Puja & Consecrated Bhog" },
                            { icon: "🍲", label: "Annadanam for Sadhaks" },
                            { icon: "🔥", label: "Vedic Hawan & Anushthan" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-[#e7c66b]/25 rounded-full px-4 py-2 text-white/90 shadow-sm"
                            >
                                <span>{item.icon}</span>
                                <span className="font-medium text-[#e7c66b]">{item.label}</span>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SEVA PACKAGES SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
                {/* Section Title & Sacred Divider */}
                <div className="text-center mb-10">

                    <h2 className="text-2xl sm:text-4xl font-black text-[#4a0a0d] font-serif">
                        Choose Your Seva Sankalpa
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                        Select a sanctified seva package below. Every offering invites divine grace
                        and protection into your life and family.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-3 mt-5">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#4a0a0d]/40" />
                        <span className="text-[#4a0a0d] text-2xl">🪷</span>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#4a0a0d]/40" />
                    </div>
                    {/* Filter Tabs */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {[
                            { key: "all", label: "All Seva Packages" },
                            { key: "static", label: "Nitya & General Seva" },
                            { key: "dynamic", label: "Special Event Seva" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${activeTab === tab.key
                                    ? "bg-[#4a0a0d] text-[#e7c66b] border-[#4a0a0d] shadow-md shadow-[#4a0a0d]/20 scale-102"
                                    : "bg-white text-gray-700 border-[#e7c66b]/40 hover:bg-[#FAF5EB]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center text-red-700 max-w-xl mx-auto mb-10 shadow-sm">
                        <span className="text-3xl mb-2 block">⚠️</span>
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredPackages.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#e7c66b]/30 p-10 max-w-lg mx-auto shadow-sm">
                        <span className="text-5xl mb-4 block">🙏</span>
                        <h3 className="text-lg font-bold text-[#4a0a0d]">
                            No Seva Packages in this category
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Please select another tab or check back soon for upcoming sacred events.
                        </p>
                        <button
                            onClick={() => setActiveTab("all")}
                            className="mt-5 px-6 py-2.5 rounded-full bg-[#4a0a0d] text-[#e7c66b] text-xs font-bold hover:bg-[#661016] transition"
                        >
                            View All Packages
                        </button>
                    </div>
                )}

                {/* ── Packages Grid ── */}
                {!loading && filteredPackages.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {filteredPackages.map((pkg) => (
                            <PackageCard key={pkg._id} pkg={pkg} />
                        ))}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                DEVOTIONAL TRUST & TRANSPARENCY STRIP
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-gradient-to-r from-[#4a0a0d]/5 via-[#e7c66b]/15 to-[#4a0a0d]/5 border-t-2 border-[#e7c66b]/30 py-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#8B0000]">
                            Sacred Assurance
                        </span>
                        <h3 className="text-2xl font-bold text-[#4a0a0d] font-serif mt-1">
                            Why Devotees Trust Gupt Upasana
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <ShieldCheck size={28} className="text-[#8B0000]" />,
                                title: "100% Encrypted & Secure",
                                desc: "Powered by Razorpay gateway with bank-grade 256-bit SSL encryption.",
                            },
                            {
                                icon: <Receipt size={28} className="text-[#8B0000]" />,
                                title: "Digital Seva Receipts",
                                desc: "Instant sanctified receipts generated directly in your devotee dashboard.",
                            },
                            {
                                icon: <Heart size={28} className="text-[#8B0000]" />,
                                title: "Direct Mandir Utilization",
                                desc: "Every rupee is dedicated to nitya bhog, sadhana anushthan, and annadanam.",
                            },
                        ].map((t) => (
                            <div
                                key={t.title}
                                className="bg-white rounded-3xl p-6 border border-[#e7c66b]/30 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#FAF5EB] border border-[#e7c66b]/40 flex items-center justify-center">
                                    {t.icon}
                                </div>
                                <h4 className="font-bold text-[#4a0a0d] text-base font-serif">
                                    {t.title}
                                </h4>
                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                    {t.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonatePage;
