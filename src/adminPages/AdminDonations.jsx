
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Search,
    RefreshCw,
    IndianRupee,
    Users,
    Wallet,
    Clock,
    CheckCircle2,
    XCircle,
    Receipt,
    CalendarDays,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    HandHeart,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { donationUrl } from "../config/config";
import { handleAdminAuthError } from "./adminAuthGuard";

const AdminDonations = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [receiptFilter, setReceiptFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDonation, setSelectedDonation] = useState(null);

    const itemsPerPage = 8;

    // Fetch all donations
    const fetchDonations = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("admin_gupt");

            if (!token) {
                setError("Please login first.");
                navigate("/admin/login", { replace: true });
                setDonations([]);
                return;
            }

            const res = await axios.get(donationUrl.adminGetAll, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.success) {
                setDonations(res.data.donations || []);
            } else {
                setError("Unable to fetch donations.");
            }
        } catch (err) {
            console.error("Fetch donations error:", err);
            if (handleAdminAuthError(err, navigate)) return;
            setError(
                err.response?.data?.message ||
                "Something went wrong while fetching donations."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Donor information fallback
    const getDonor = (donation) => {
        return donation.donor || donation.donorSnapshot || {};
    };

    // Currency formatter
    const formatCurrency = (amount, currency = "INR") => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Date formatter
    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Dashboard statistics
    const stats = useMemo(() => {
        const paid = donations.filter(
            (item) => item.paymentStatus === "paid"
        );

        const pending = donations.filter(
            (item) => item.paymentStatus === "pending"
        );

        const failed = donations.filter(
            (item) => item.paymentStatus === "failed"
        );

        const totalCollected = paid.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const pendingAmount = pending.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        return {
            total: donations.length,
            paid: paid.length,
            pending: pending.length,
            failed: failed.length,
            totalCollected,
            pendingAmount,
        };
    }, [donations]);

    // Search and filter
    const filteredDonations = useMemo(() => {
        return donations.filter((donation) => {
            const donor = getDonor(donation);

            const searchText = search.toLowerCase();

            const matchesSearch =
                donor.name?.toLowerCase().includes(searchText) ||
                donor.email?.toLowerCase().includes(searchText) ||
                donor.phone?.includes(searchText) ||
                donation.receiptNo?.toLowerCase().includes(searchText) ||
                donation.packageNameSnapshot?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                donation.paymentStatus === statusFilter;

            const matchesReceipt =
                receiptFilter === "all" ||
                (receiptFilter === "generated" && donation.receiptGenerated) ||
                (receiptFilter === "not-generated" && !donation.receiptGenerated);

            return matchesSearch && matchesStatus && matchesReceipt;
        });
    }, [donations, search, statusFilter, receiptFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

    const paginatedDonations = filteredDonations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, receiptFilter]);

    // Payment status badge
    const StatusBadge = ({ status }) => {
        const styles = {
            paid: "bg-green-50 text-green-700 border-green-200",
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            failed: "bg-red-50 text-red-700 border-red-200",
            refunded: "bg-blue-50 text-blue-700 border-blue-200",
        };

        const icons = {
            paid: <CheckCircle2 size={13} />,
            pending: <Clock size={13} />,
            failed: <XCircle size={13} />,
            refunded: <RefreshCw size={13} />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${styles[status] || "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
            >
                {icons[status] || <AlertCircle size={13} />}
                {status || "Unknown"}
            </span>
        );
    };

    // Statistics card
    const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
        <div className="bg-white rounded-2xl border border-[#eee8dc] p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h3 className="text-2xl font-bold text-[#4a0a0d] mt-2">
                        {value}
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                        {subtitle}
                    </p>
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#faf8f3] p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                {/* <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#4a0a0d] flex items-center justify-center">
                            <HandHeart size={20} className="text-[#e7c66b]" />
                        </div>

                        <span className="text-xs font-bold tracking-[2px] uppercase text-[#9c7b36]">
                            Gupt Upasana Administration
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#4a0a0d]">
                        Donation Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage, monitor and track all temple donations.
                    </p>
                </div> */}

                <button
                    onClick={fetchDonations}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116] transition disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh Donations
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

                <StatCard
                    title="Total Donations"
                    value={stats.total}
                    subtitle="All donation records"
                    icon={Users}
                    color="bg-[#f8edf0] text-[#4a0a0d]"
                />

                <StatCard
                    title="Total Collected"
                    value={formatCurrency(stats.totalCollected)}
                    subtitle="Successfully paid donations"
                    icon={Wallet}
                    color="bg-[#fbf2d9] text-[#98701b]"
                />

                {/* <StatCard
                    title="Pending Amount"
                    value={formatCurrency(stats.pendingAmount)}
                    subtitle={`${stats.pending} pending donations`}
                    icon={Clock}
                    color="bg-orange-50 text-orange-600"
                /> */}

                <StatCard
                    title="Successful Payments"
                    value={stats.paid}
                    subtitle={`${stats.failed} failed payments`}
                    icon={TrendingUp}
                    color="bg-green-50 text-green-600"
                />

            </div>

            {/* Decorative summary banner */}
            {/* <div className="relative overflow-hidden rounded-2xl bg-[#4a0a0d] p-5 sm:p-7 mb-7">
                <div className="absolute -right-8 -top-12 w-48 h-48 rounded-full border-[25px] border-white/5" />
                <div className="absolute right-28 -bottom-20 w-48 h-48 rounded-full border-[20px] border-[#e7c66b]/10" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-[#e7c66b] text-xs font-semibold uppercase tracking-[2px]">
                            Temple Donation Overview
                        </p>

                        <h2 className="text-white text-xl sm:text-2xl font-bold mt-2">
                            Every Contribution Makes a Difference
                        </h2>

                        <p className="text-white/60 text-sm mt-2">
                            Keep track of every offering made towards the temple.
                        </p>
                    </div>

                    <div className="bg-white/10 border border-[#e7c66b]/30 rounded-2xl px-6 py-4 min-w-[150px]">
                        <p className="text-white/60 text-xs">
                            Total Contributions
                        </p>

                        <p className="text-[#e7c66b] text-3xl font-bold mt-1">
                            {stats.total}
                        </p>
                    </div>
                </div>
            </div> */}

            {/* Error State
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="text-red-600 shrink-0" size={20} />

                    <p className="text-sm text-red-700 flex-1">
                        {error}
                    </p>

                    <button
                        onClick={fetchDonations}
                        className="text-sm font-semibold text-red-700 underline"
                    >
                        Retry
                    </button>
                </div>
            )}
 */}
            {/* Donations Table Section */}
            <div className="bg-white rounded-2xl border border-[#eee8dc] shadow-sm overflow-hidden">

                {/* Table Header */}
                <div className="p-5 sm:p-6 border-b border-[#f0ece4]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-bold text-[#4a0a0d]">
                                All Donations
                            </h2>

                            <p className="text-xs text-gray-400 mt-1">
                                Showing {filteredDonations.length} of {donations.length} donations
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">

                            {/* Search */}
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search donor, phone"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20"
                                />
                            </div>

                            {/* Payment Filter */}
                            <div className="relative">
                                <Filter
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full sm:w-40 pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            {/* Receipt Filter */}
                            {/* <select
                                value={receiptFilter}
                                onChange={(e) => setReceiptFilter(e.target.value)}
                                className="w-full sm:w-40 px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                            >
                                <option value="all">All Receipts</option>
                                <option value="generated">Generated</option>
                                <option value="not-generated">Not Generated</option>
                            </select> */}

                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-[#e7c66b] border-t-[#4a0a0d] rounded-full animate-spin" />

                        <p className="text-sm text-gray-500 mt-4">
                            Loading donation records...
                        </p>
                    </div>
                ) : paginatedDonations.length === 0 ? (

                    /* Empty State */
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#fbf2d9] flex items-center justify-center mx-auto mb-4">
                            <HandHeart size={28} className="text-[#98701b]" />
                        </div>

                        <h3 className="text-lg font-bold text-[#4a0a0d]">
                            No Donations Found
                        </h3>

                        <p className="text-sm text-gray-400 mt-2">
                            {search || statusFilter !== "all" || receiptFilter !== "all"
                                ? "Try changing your search or filters."
                                : "Donation records will appear here once available."}
                        </p>
                    </div>

                ) : (

                    /* Table */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1050px]">

                            <thead>
                                <tr className="bg-[#fcfaf5] text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-5 py-4 font-semibold">Donor</th>
                                    {/* <th className="px-5 py-4 font-semibold">Receipt No.</th> */}
                                    <th className="px-5 py-4 font-semibold">Package</th>
                                    <th className="px-5 py-4 font-semibold">Amount</th>
                                    <th className="px-5 py-4 font-semibold">Payment</th>
                                    {/* <th className="px-5 py-4 font-semibold">Receipt</th> */}
                                    <th className="px-5 py-4 font-semibold">Date</th>
                                    <th className="px-5 py-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {paginatedDonations.map((donation) => {
                                    const donor = getDonor(donation);

                                    return (
                                        <tr
                                            key={donation._id}
                                            className="hover:bg-[#fdfbf6] transition-colors"
                                        >
                                            {/* Donor */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* <div className="w-10 h-10 rounded-full bg-[#f8edf0] text-[#4a0a0d] flex items-center justify-center font-bold text-sm shrink-0">
                                                        {donor.name?.charAt(0)?.toUpperCase() || "D"}
                                                    </div> */}

                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {donation.anonymous ? "Anonymous Donor" : donor.name || "Unknown"}
                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {donation.anonymous ? "Private donor" : donor.phone || "No phone"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Receipt Number */}
                                            {/* <td className="px-5 py-4">
                                                <p className="text-xs font-semibold text-[#4a0a0d]">
                                                    {donation.receiptNo || "Not assigned"}
                                                </p>
                                            </td> */}

                                            {/* Package */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {donation.packageNameSnapshot || donation.purpose || "General Donation"}
                                                </p>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-bold text-[#4a0a0d]">
                                                    {formatCurrency(donation.amount, donation.currency)}
                                                </p>
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge status={donation.paymentStatus} />
                                            </td>

                                            {/* Receipt Status */}
                                            {/* <td className="px-5 py-4">
                                                {donation.receiptGenerated ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                                        <CheckCircle2 size={14} />
                                                        Generated
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                                                        <Clock size={14} />
                                                        Pending
                                                    </span>
                                                )}
                                            </td> */}

                                            {/* Date */}
                                            <td className="px-5 py-4">
                                                <p className="text-xs font-medium text-gray-700">
                                                    {formatDate(donation.createdAt)}
                                                </p>
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => setSelectedDonation(donation)}
                                                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-[#fbf2d9] text-[#4a0a0d] hover:bg-[#e7c66b] transition"
                                                    title="View donation details"
                                                >
                                                    <Eye size={17} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredDonations.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-[#f0ece4]">

                        <p className="text-xs text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-[#4a0a0d]">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>
                            {" "}to{" "}
                            <span className="font-semibold text-[#4a0a0d]">
                                {Math.min(currentPage * itemsPerPage, filteredDonations.length)}
                            </span>
                            {" "}of{" "}
                            <span className="font-semibold text-[#4a0a0d]">
                                {filteredDonations.length}
                            </span>
                            {" "}records
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-[#fbf2d9]"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            <span className="text-sm font-semibold text-[#4a0a0d] px-3">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-[#fbf2d9]"
                            >
                                <ChevronRight size={17} />
                            </button>

                        </div>
                    </div>
                )}

            </div>

            {/* Donation Details Modal */}
            {selectedDonation && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedDonation(null)}
                >
                    <div
                        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="bg-[#4a0a0d] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                            <div>
                                <p className="text-[#e7c66b] text-xs uppercase tracking-widest font-semibold">
                                    Donation Details
                                </p>

                                <h3 className="text-white text-lg font-bold mt-1">
                                    {selectedDonation.receiptNo || "Donation Record"}
                                </h3>
                            </div>

                            <button
                                onClick={() => setSelectedDonation(null)}
                                className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        {(() => {
                            const donor = getDonor(selectedDonation);

                            const details = [
                                ["Donor Name", selectedDonation.anonymous ? "Anonymous Donor" : donor.name],
                                ["Email", selectedDonation.anonymous ? "Private" : donor.email],
                                ["Phone", selectedDonation.anonymous ? "Private" : donor.phone],
                                ["Address", selectedDonation.anonymous ? "Private" : donor.address],
                                ["Donor Type", donor.type],
                                ["Package", selectedDonation.packageNameSnapshot],
                                ["Purpose", selectedDonation.purpose],
                                ["Amount", formatCurrency(selectedDonation.amount, selectedDonation.currency)],
                                ["Payment Method", selectedDonation.paymentMethod],
                                ["Payment Status", selectedDonation.paymentStatus],
                                // ["Receipt Status", selectedDonation.receiptGenerated ? "Generated" : "Not Generated"],
                                ["Created At", formatDate(selectedDonation.createdAt)],
                                ["Payment Captured At", formatDate(selectedDonation.paymentCapturedAt)],
                                ["Razorpay Order ID", selectedDonation.razorpayOrderId],
                                ["Razorpay Payment ID", selectedDonation.razorpayPaymentId],
                            ];

                            return (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        {details.map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="p-4 rounded-xl bg-[#fcfaf5] border border-[#f0ece4]"
                                            >
                                                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                                    {label}
                                                </p>

                                                <p className="text-sm font-semibold text-[#4a0a0d] mt-2 break-all">
                                                    {value || "N/A"}
                                                </p>
                                            </div>
                                        ))}

                                    </div>

                                    <div className="mt-5 flex justify-end">
                                        <button
                                            onClick={() => setSelectedDonation(null)}
                                            className="px-6 py-2.5 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116]"
                                        >
                                            Close Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDonations;
