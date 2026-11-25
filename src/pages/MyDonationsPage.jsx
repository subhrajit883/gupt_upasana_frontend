import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { donationUrl } from "../config/config";

const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const statusStyles = {
    paid: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    created: "bg-blue-100 text-blue-700 border-blue-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    refunded: "bg-purple-100 text-purple-700 border-purple-200",
};

const statusIcons = { paid: "✅", pending: "⏳", created: "🔄", failed: "❌", refunded: "↩️" };

const SkeletonRow = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse flex flex-col gap-3">
        <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
);

const MyDonationsPage = () => {
    const { isLoggedIn, authHeader } = useAuth();
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/user/login", { state: { from: "/my-donations" } });
            return;
        }
        const fetchDonations = async () => {
            try {
                const res = await axios.get(donationUrl.my, { headers: authHeader, withCredentials: true });
                if (res.data?.success) setDonations(res.data.donations);
            } catch (e) {
                setError(e.response?.data?.message || "Could not load your donations.");
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [isLoggedIn, authHeader, navigate]);

    const totalPaid = donations.filter((d) => d.paymentStatus === "paid").reduce((s, d) => s + d.amount, 0);

    return (

        <div className="min-h-screen bg-[#faf6ed]">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-[#4a0a0d] px-5 py-14 text-center sm:py-16">
                {/* Decorative elements */}
                {/* <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full border border-[#e7c66b]/10" /> */}
                {/* <div className="absolute -right-16 -bottom-24 h-72 w-72 rounded-full border border-[#e7c66b]/10" />
                <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#e7c66b]/5 blur-3xl" /> */}

                <div className="relative z-10 mx-auto max-w-2xl">
                    {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e7c66b]/30 bg-[#e7c66b]/10 px-4 py-2">
                        <span className="text-[#e7c66b]">✦</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e7c66b]">
                            Your Sacred Journey
                        </span>
                        <span className="text-[#e7c66b]">✦</span>
                    </div> */}

                    <h1 className="text-3xl font-black font-medium  text-[#e7c66b] sm:text-4xl md:text-5xl">
                        My Donations
                    </h1>

                    <div className="mx-auto my-5 flex items-center justify-center gap-3">
                        <span className="h-px w-12 bg-[#e7c66b]/40" />
                        <span className="text-xl text-[#e7c66b]">❖</span>
                        <span className="h-px w-12 bg-[#e7c66b]/40" />
                    </div>

                    <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                        Every offering is an expression of faith.
                        <br className="hidden sm:block" />
                        View your seva history with Gupt Upasana.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12">

                {/* Summary */}
                {!loading && donations.length > 0 && (
                    <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="relative overflow-hidden rounded-2xl border border-[#e7c66b]/40 bg-white p-5 shadow-[0_5px_25px_rgba(74,10,13,0.05)]">
                            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full " />
                            <div className="relative">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a0a0d]/5 text-xl">
                                    ₹
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                    Total Seva
                                </p>
                                <p className="mt-1 text-2xl font-medium font-black text-[#4a0a0d]">
                                    {formatINR(totalPaid)}
                                </p>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-[#e7c66b]/40 bg-white p-5 shadow-[0_5px_25px_rgba(74,10,13,0.05)]">
                            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full " />
                            <div className="relative">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a0a0d]/5 text-[#4a0a0d]">
                                    <span className="text-xl">🙏</span>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                    Total Donations
                                </p>
                                <p className="mt-1 text-2xl font-medium font-black text-[#4a0a0d]">
                                    {donations.length}
                                </p>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white p-5 shadow-[0_5px_25px_rgba(74,10,13,0.05)]">
                            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full " />
                            <div className="relative">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a0a0d]/5">
                                    <span className="text-xl">✓</span>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                    Successful
                                </p>
                                <p className="mt-1 text-2xl font-medium font-black text-green-700">
                                    {donations.filter((d) => d.paymentStatus === "paid").length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Heading */}
                {!loading && donations.length > 0 && (
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-[#4a0a0d]">
                                Your Seva History
                            </h2>
                            <p className="mt-1 text-xs text-gray-400">
                                A record of your contributions
                            </p>
                        </div>
                        {/* <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#e7c66b]/50 bg-white sm:flex">
                            <span className="text-lg">🪔</span>
                        </div> */}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-600">
                        <span className="mb-2 block text-2xl">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && donations.length === 0 && (
                    <div className="rounded-3xl border border-[#e7c66b]/40 bg-white px-6 py-16 text-center shadow-sm">
                        {/* <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf6ed] text-4xl">
                            🙏
                        </div> */}
                        <h2 className="text-2xl font-extrabold text-[#4a0a0d]">
                            Begin Your Seva Journey
                        </h2>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
                            You haven't made any donations yet. Your first offering can be the beginning of a beautiful journey of devotion.
                        </p>
                        <Link
                            to="/donate"
                            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#4a0a0d] px-8 py-3.5 text-sm font-bold text-[#e7c66b] shadow-lg shadow-[#4a0a0d]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#641319]"
                        >
                            {/* <span>🪔</span> */}
                            Offer Your First Seva
                            <span>→</span>
                        </Link>
                    </div>
                )}

                {/* Donation Cards */}
                {!loading && donations.length > 0 && (
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div
                                key={d._id}
                                className="group relative overflow-hidden rounded-2xl border border-[#e7c66b]/35 bg-white p-5 shadow-[0_4px_20px_rgba(74,10,13,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e7c66b]/70 hover:shadow-[0_10px_30px_rgba(74,10,13,0.09)] sm:p-6"
                            >
                                {/* Decorative side line */}
                                <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#e7c66b] opacity-70 transition-opacity group-hover:opacity-100" />

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start gap-3">
                                            {/* <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faf6ed] text-xl">
                                                🪔
                                            </div> */}
                                            <div className="min-w-0">
                                                <h3 className="break-words text-base font-bold text-[#4a0a0d] sm:text-lg">
                                                    {d.packageNameSnapshot || d.purpose || "General Donation"}
                                                </h3>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {formatDate(d.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                                        <p className="text-xl font-black font-medium tracking-tight text-[#4a0a0d] sm:text-2xl">
                                            {formatINR(d.amount)}
                                        </p>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${statusStyles[d.paymentStatus] ||
                                                "border-gray-200 bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {statusIcons[d.paymentStatus]}
                                            {d.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                {(d.receiptNo || d.razorpayPaymentId || d.failureReason) && (
                                    <div className="mt-5 border-t border-dashed border-[#e7c66b]/40 pt-4">
                                        <div className="grid gap-1 sm:grid-cols-1">
                                            {/* {d.receiptNo && (
                                                <div className="rounded-xl bg-[#faf6ed] px-3 py-2.5">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                                        Receipt Number
                                                    </p>
                                                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#4a0a0d]">
                                                        {d.receiptNo}
                                                    </p>
                                                </div>
                                            )} */}

                                            {d.razorpayPaymentId && (
                                                <div className="rounded-xl bg-[#faf6ed] px-3 py-2.5">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                                        Payment ID
                                                    </p>
                                                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#4a0a0d]">
                                                        {d.razorpayPaymentId}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {d.failureReason && (
                                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                                                <span className="font-bold">Payment reason:</span>{" "}
                                                {d.failureReason}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {!loading && donations.length > 0 && (
                    <div className="mt-10 overflow-hidden rounded-3xl bg-[#4a0a0d] px-6 py-9 text-center shadow-xl shadow-[#4a0a0d]/10 sm:px-10">
                        <div className="mb-3 text-3xl">🙏</div>
                        <h3 className="text-xl font-extrabold text-[#e7c66b] sm:text-2xl">
                            Continue Your Seva Journey
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/60">
                            Your generosity helps support sacred offerings and temple activities.
                        </p>
                        <Link
                            to="/donate"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e7c66b] px-8 py-3.5 text-sm font-extrabold text-[#4a0a0d] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f1d98c]"
                        >
                            Make Another Donation
                            <span>→</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>

    );
};

export default MyDonationsPage;
