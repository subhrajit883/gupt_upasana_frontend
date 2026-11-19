import { useLocation, useNavigate, Link } from "react-router-dom";

const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const DonationSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { donation, amount, packageName } = location.state || {};

    if (!donation) {
        // If accessed directly without state, redirect to donate
        return (
            <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4">
                <div className="text-center">
                    <span className="text-5xl mb-4 block">🙏</span>
                    <p className="text-gray-500 mb-4">No donation details found.</p>
                    <Link to="/donate" className="text-[#8B0000] font-bold hover:underline">← Back to Donate</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl border border-[#8B0000]/10 shadow-xl shadow-[#8B0000]/5 overflow-hidden text-center">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

                    <div className="px-8 py-12">
                        {/* Success icon */}
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <span className="text-5xl mb-4 block">🪔</span>
                        <h1 className="text-2xl font-black text-[#8B0000] mb-2">Seva Received!</h1>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Your offering has been accepted. May the divine blessings of Maa be always with you.
                        </p>

                        {/* Donation details */}
                        <div className="bg-[#FDF5E6] border border-[#FFD700]/30 rounded-xl p-5 mb-8 text-left space-y-3">
                            {packageName && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Package</span>
                                    <span className="font-bold text-[#5a0000] text-sm">{packageName}</span>
                                </div>
                            )}
                            {amount && (
                                <div className="flex justify-between items-center border-t border-[#FFD700]/20 pt-3">
                                    <span className="text-gray-500 text-sm">Amount Paid</span>
                                    <span className="font-black text-[#8B0000] text-lg">{formatINR(amount)}</span>
                                </div>
                            )}
                            {donation?.receiptNo && (
                                <div className="flex justify-between items-center border-t border-[#FFD700]/20 pt-3">
                                    <span className="text-gray-500 text-sm">Receipt No.</span>
                                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{donation.receiptNo}</span>
                                </div>
                            )}
                            {donation?.razorpayPaymentId && (
                                <div className="flex justify-between items-center border-t border-[#FFD700]/20 pt-3">
                                    <span className="text-gray-500 text-sm">Payment ID</span>
                                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded break-all">{donation.razorpayPaymentId}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/my-donations"
                                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-[#8B0000]/30 text-[#8B0000] hover:bg-[#8B0000]/5 transition-colors"
                            >
                                📋 My Donations
                            </Link>
                            <Link
                                to="/donate"
                                className="flex-1 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] transition-all duration-300 shadow-lg shadow-[#8B0000]/20"
                            >
                                🙏 Offer Again
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Shlokas / blessing */}
                <div className="text-center mt-6 text-gray-400 text-xs italic leading-relaxed">
                    "यज्ञो दानं तपश्चैव पावनानि मनीषिणाम्" — Bhagavad Gita 18.5
                </div>
            </div>
        </div>
    );
};

export default DonationSuccessPage;
