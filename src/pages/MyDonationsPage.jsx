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
        <div className="min-h-screen bg-[#FDF5E6]">
            {/* Header banner */}
            <div className="bg-gradient-to-br from-[#1a0a00] via-[#5a0000] to-[#1a0a00] py-12 px-6 text-center">
                <span className="text-4xl mb-3 block">📿</span>
                <h1 className="text-3xl font-black text-[#FFD700]">My Donations</h1>
                <p className="text-white/60 text-sm mt-2">Your seva history with Gupt Upasana</p>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10">
                {/* Summary strip */}
                {!loading && donations.length > 0 && (
                    <div className="bg-white border border-[#8B0000]/10 rounded-2xl p-5 mb-8 flex flex-wrap gap-6 justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Seva</p>
                            <p className="text-2xl font-black text-[#8B0000]">{formatINR(totalPaid)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Donations</p>
                            <p className="text-2xl font-black text-[#8B0000]">{donations.length}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Successful</p>
                            <p className="text-2xl font-black text-green-600">{donations.filter((d) => d.paymentStatus === "paid").length}</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-600 mb-6">
                        <span className="text-3xl mb-2 block">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && donations.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-5xl mb-4 block">🙏</span>
                        <p className="text-gray-400 mb-6">You haven't made any donations yet.</p>
                        <Link to="/donate" className="inline-block bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] font-black px-8 py-3 rounded-full text-sm shadow-lg shadow-[#8B0000]/20 hover:from-[#6b0000] hover:to-[#4a0000] transition-all">
                            🪔 Offer Your First Seva
                        </Link>
                    </div>
                )}

                {/* Donation cards */}
                {!loading && donations.length > 0 && (
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div key={d._id} className="bg-white rounded-xl border border-[#8B0000]/10 shadow-sm hover:shadow-md transition-shadow p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <p className="font-bold text-[#5a0000] text-base">
                                            {d.packageNameSnapshot || d.purpose || "General Donation"}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-0.5">{formatDate(d.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <p className="font-black text-[#8B0000] text-lg">{formatINR(d.amount)}</p>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest border rounded-full px-2.5 py-0.5 ${statusStyles[d.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                                            {statusIcons[d.paymentStatus]} {d.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                {d.receiptNo && (
                                    <p className="text-xs text-gray-400">
                                        Receipt: <span className="font-mono text-gray-600">{d.receiptNo}</span>
                                    </p>
                                )}
                                {d.razorpayPaymentId && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Payment ID: <span className="font-mono text-gray-600">{d.razorpayPaymentId}</span>
                                    </p>
                                )}
                                {d.failureReason && (
                                    <p className="text-xs text-red-500 mt-1">Reason: {d.failureReason}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {!loading && donations.length > 0 && (
                    <div className="text-center mt-10">
                        <Link to="/donate" className="inline-block bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] font-black px-8 py-3.5 rounded-full text-sm shadow-lg shadow-[#8B0000]/20 hover:from-[#6b0000] hover:to-[#4a0000] transition-all duration-300">
                            🙏 Make Another Donation
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDonationsPage;
