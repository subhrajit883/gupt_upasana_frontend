import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Calendar,
    Clock,
    Sparkles,
    Building2,
    User,
    CheckCircle2,
    AlertCircle,
    Info,
    Lock,
    MapPin,
    Phone,
    RefreshCw,
    Send,
    ShieldAlert,
    FileText,
    ArrowRight
} from "lucide-react";
import { bookVisitUrl } from "../config/config";
import { useAuth } from "../context/AuthContext";

const TOKEN_KEY = "gupt upasana";

// ── Quick suggestions for Reason for Visit ────────────────────────────────────
const QUICK_REASONS = [
    "Seeking blessings and participating in the special puja.",
    "Devotional Darshan & Pranaam to Boro Maa",
    "Family Welfare, Health and Navagraha Shanti",
    "Corporate & Business Obstacle Removal Havan",
    "Maa Baglamukhi / Tantra Puja Consultation",
    "Special Birthday / Anniversary Thanksgiving Puja"
];

// ── Status Badge Styler ───────────────────────────────────────────────────────
const StatusBadge = ({ status = "pending" }) => {
    const s = String(status).toLowerCase();
    if (s === "approved" || s === "confirmed") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 size={13} /> Confirmed
            </span>
        );
    }
    if (s === "completed") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                🪷 Completed
            </span>
        );
    }
    if (s === "cancelled" || s === "rejected") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <ShieldAlert size={13} /> Cancelled
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock size={13} /> Pending Review
        </span>
    );
};

// ── Format Helper ─────────────────────────────────────────────────────────────
const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    try {
        const d = new Date(isoString);
        return d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    } catch {
        return isoString;
    }
};

const BookVisitPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const token = localStorage.getItem(TOKEN_KEY);

    // Active tab: "book" or "my-visits"
    const [activeTab, setActiveTab] = useState("book");

    // Form states
    const [formData, setFormData] = useState({
        type: "individual",
        visitDate: "",
        reasonForVisit: "Seeking blessings and participating in the special puja.",
        sankalp: "",
        companyName: "",
        authorisedContact: "",
        designation: "",
        message: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    // Enquiries list states
    const [enquiries, setEnquiries] = useState([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(false);
    const [enquiriesError, setEnquiriesError] = useState(null);

    // Pre-populate with logged in user's profile info if available
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                companyName: user.companyName || prev.companyName,
                authorisedContact: prev.authorisedContact || user.name || "",
                sankalp: prev.sankalp || user.sankalp || ""
            }));
        }
    }, [user]);

    // Fetch user's bookings from bookVisitUrl.getbyUser
    const fetchUserEnquiries = useCallback(async () => {
        const currentToken = localStorage.getItem(TOKEN_KEY);
        if (!currentToken) {
            setEnquiries([]);
            return;
        }

        setLoadingEnquiries(true);
        setEnquiriesError(null);
        try {
            const res = await axios.get(bookVisitUrl.getbyUser, {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                },
                withCredentials: true
            });

            if (res.data?.success) {
                setEnquiries(res.data.enquiries || []);
            } else {
                setEnquiriesError(res.data?.message || "Failed to load visit requests.");
            }
        } catch (err) {
            console.error("Error fetching enquiries:", err);
            setEnquiriesError(err.response?.data?.message || "Could not retrieve your visits.");
        } finally {
            setLoadingEnquiries(false);
        }
    }, []);

    // Load enquiries on mount or when token becomes available
    useEffect(() => {
        if (token) {
            fetchUserEnquiries();
        }
    }, [token, fetchUserEnquiries]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Minimum date-time for datetime-local picker (current local time)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        const currentToken = localStorage.getItem(TOKEN_KEY);
        if (!currentToken) {
            setSubmitError("Please login, to visit the mandir.");
            return;
        }

        if (!formData.visitDate) {
            setSubmitError("Please choose your desired visit date and time.");
            return;
        }

        if (formData.type === "organisation" && !formData.companyName.trim()) {
            setSubmitError("Please enter your Company / Organisation Name.");
            return;
        }

        // Prepare payload
        const payload = {
            message: formData.message.trim() || "I would like to know more about the upcoming puja arrangements and donation opportunities.",
            visitDate: new Date(formData.visitDate).toISOString(),
            type: formData.type,
            companyName: formData.type === "organisation" ? formData.companyName.trim() : (formData.companyName.trim() || undefined),
            authorisedContact: formData.authorisedContact.trim() || (user?.name || "Devotee"),
            designation: formData.type === "organisation" ? formData.designation.trim() : (formData.designation.trim() || undefined),
            sankalp: formData.sankalp.trim() || undefined,
            reasonForVisit: formData.reasonForVisit.trim()
        };

        setSubmitting(true);
        try {
            const res = await axios.post(bookVisitUrl.create, payload, {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                },
                withCredentials: true
            });

            if (res.data?.success) {
                setSubmitSuccess({
                    message: res.data.message || "Your visit request has been successfully registered!",
                    data: res.data.visit || res.data.enquiry || payload
                });

                // Reset optional fields
                setFormData((prev) => ({
                    ...prev,
                    visitDate: "",
                    message: ""
                }));

                // Refresh user enquiries
                fetchUserEnquiries();
            } else {
                setSubmitError(res.data?.message || "Failed to submit visit request. Please try again.");
            }
        } catch (err) {
            console.error("Booking error:", err);
            setSubmitError(
                err.response?.data?.message || "Server error while submitting your visit request. Please check your connection."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#fcf9f2] min-h-screen text-gray-800 pb-20">

            {/* ── HERO BANNER ──────────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-[#1a0507] via-[#52090e] to-[#240306] overflow-hidden text-white">
                {/* Sacred Watermark */}
                <div className="absolute inset-0 flex items-center justify-end pr-10 opacity-[0.04] pointer-events-none select-none">
                    <span className="text-[18rem] font-bold text-[#FFD700]">ॐ</span>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/25 rounded-full px-5 py-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                        <span className="text-[#FFD700] text-xs tracking-[0.25em] uppercase font-bold">
                            Devotee Darshan & Puja Registration
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD700] font-serif mb-4 leading-tight">
                        Book a Visit to Gupt Upasana Mandir
                    </h1>

                    <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Experience the sacred presence of Salt Lake Boro Maa, Mahakal Bhairav, and Maa Baglamukhi. Schedule your darshan, family sankalpa, or corporate puja arrangements.
                    </p>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center items-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("book");
                                setSubmitSuccess(null);
                            }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "book"
                                ? "bg-[#FFD700] text-[#4a0a0d] shadow-lg shadow-[#FFD700]/20 scale-105"
                                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                                }`}
                        >
                            <Calendar size={16} />
                            Schedule New Visit
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("my-visits");
                                if (token) fetchUserEnquiries();
                            }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 relative ${activeTab === "my-visits"
                                ? "bg-[#FFD700] text-[#4a0a0d] shadow-lg shadow-[#FFD700]/20 scale-105"
                                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                                }`}
                        >
                            <Clock size={16} />
                            My Scheduled Visits
                            {enquiries.length > 0 && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-[#8B0000] text-[#FFD700] text-xs font-black flex items-center justify-center border border-[#FFD700]/40">
                                    {enquiries.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
                    <svg viewBox="0 0 1440 45" preserveAspectRatio="none" className="w-full h-8 md:h-12">
                        <path d="M0,20 C480,45 960,0 1440,20 L1440,45 L0,45 Z" fill="#fcf9f2" />
                    </svg>
                </div>
            </div>

            {/* ── MAIN CONTAINER ───────────────────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">

                {/* ── NOT LOGGED IN ALERT (prominently highlighted) ──────────── */}
                {!token && (
                    <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#4a0a0d] via-[#6e0c12] to-[#4a0a0d] p-6 sm:p-7 text-white shadow-xl border-2 border-[#e7c652]/60 flex flex-col sm:flex-row items-center justify-between gap-5 animate-pulse-subtle">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#e7c652]/20 border border-[#e7c652]/40 flex items-center justify-center text-[#e7c652] shrink-0 mt-0.5">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#FFD700] flex items-center gap-2">
                                    <span>🛕</span> Please login, to visit the mandir.
                                </h3>
                                <p className="text-white/80 text-xs sm:text-sm mt-1 leading-relaxed">
                                    To schedule a visit or submit a prayer enquiry for Gupt Upasana Mandir, please sign in with your devotee account.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/auth"
                            className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-[#e7c652] to-[#d4af37] text-[#4a0a0d] font-black text-sm tracking-wide shadow-md hover:brightness-110 transition active:scale-95 flex items-center gap-2"
                        >
                            <User size={16} />
                            Login to Mandir
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}

                {/* Logged in devotee banner */}
                {token && user && (
                    <div className="mb-6 rounded-2xl bg-white border border-[#8B0000]/10 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center font-bold">
                                {user.name?.[0] || "D"}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">
                                    Logged in as <span className="text-[#8B0000]">{user.name}</span>
                                </p>
                                <p className="text-xs text-gray-500">{user.email} • {user.type || "Devotee"}</p>
                            </div>
                        </div>
                        {/* <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={12} /> Account Verified
                            </span>
                        </div> */}
                    </div>
                )}

                {/* ── TAB 1: SCHEDULE A VISIT FORM ────────────────────────── */}
                {activeTab === "book" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Form Column (2 Cols) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* SUCCESS MODAL / BANNER */}
                            {submitSuccess && (
                                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 text-emerald-900 shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-200/80 flex items-center justify-center text-emerald-800 shrink-0">
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-emerald-900">
                                                Visit Request Registered!
                                            </h3>
                                            <p className="text-sm text-emerald-800 mt-1">
                                                {submitSuccess.message}
                                            </p>

                                            <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-emerald-200 space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 font-semibold">Visit Schedule:</span>
                                                    <span className="font-bold text-gray-800">
                                                        {formatDateTime(submitSuccess.data.visitDate)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 font-semibold">Purpose:</span>
                                                    <span className="font-bold text-gray-800">
                                                        {submitSuccess.data.reasonForVisit}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 font-semibold">Status:</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                                        Pending Confirmation
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab("my-visits")}
                                                    className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
                                                >
                                                    View in My Scheduled Visits →
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSubmitSuccess(null)}
                                                    className="px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100/50 transition"
                                                >
                                                    Book Another Visit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MAIN FORM CARD */}
                            <div className="bg-white rounded-3xl border border-[#8B0000]/10 shadow-lg overflow-hidden">
                                <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

                                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                                    {/* Error Banner */}
                                    {submitError && (
                                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
                                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                                            <div>
                                                <p className="font-bold">Cannot proceed with visit registration</p>
                                                <p className="text-xs text-rose-700 mt-0.5">{submitError}</p>
                                                {!token && (
                                                    <Link to="/auth" className="inline-block mt-2 font-bold underline text-xs">
                                                        Click here to Login →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 1. Visit Type Selector */}
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">
                                            1. Select Visit Category <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, type: "individual" }))}
                                                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 ${formData.type === "individual"
                                                    ? "border-[#8B0000] bg-[#8B0000]/5 text-[#8B0000] shadow-sm"
                                                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.type === "individual" ? "bg-[#8B0000] text-[#FFD700]" : "bg-gray-100 text-gray-500"}`}>
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">Individual / Family</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Devotee Darshan</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, type: "organisation" }))}
                                                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 ${formData.type === "organisation"
                                                    ? "border-[#8B0000] bg-[#8B0000]/5 text-[#8B0000] shadow-sm"
                                                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.type === "organisation" ? "bg-[#8B0000] text-[#FFD700]" : "bg-gray-100 text-gray-500"}`}>
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">Corporate / Org</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Company Seva</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2. Organisation Specific Fields */}
                                    {formData.type === "organisation" && (
                                        <div className="p-5 rounded-2xl bg-[#fcfaf5] border border-[#e7c66b]/30 space-y-4 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9c7b36]">
                                                <Building2 size={15} /> Organisation Details
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                                        Company / Organisation Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="companyName"
                                                        value={formData.companyName}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g. ABC Technologies Pvt. Ltd."
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm bg-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                                        Authorised Contact Person
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="authorisedContact"
                                                        value={formData.authorisedContact}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g. Rahul Sharma"
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm bg-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                                        Designation / Role
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="designation"
                                                        value={formData.designation}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g. Managing Director"
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Visit Date & Time */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                                2. Preferred Date & Time <span className="text-red-500">*</span>
                                            </label>
                                            <span className="text-[11px] text-gray-400">IST (Indian Standard Time)</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="datetime-local"
                                                name="visitDate"
                                                min={getMinDateTime()}
                                                value={formData.visitDate}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm text-gray-800 bg-white"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                            <Clock size={12} className="text-[#8B0000]" />
                                            Temple Darshan Hours: Morning 8:00 AM – 12:30 PM &amp; Evening 4:30 PM – 9:00 PM
                                        </p>
                                    </div>

                                    {/* 4. Reason for Visit */}
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                                            3. Reason / Purpose of Visit <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="reasonForVisit"
                                            value={formData.reasonForVisit}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Seeking blessings and participating in the special puja."
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm bg-white mb-2"
                                        />

                                        {/* Quick Suggestion Chips */}
                                        {/* <div className="flex flex-wrap gap-1.5">
                                            {QUICK_REASONS.map((r) => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({ ...prev, reasonForVisit: r }))}
                                                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${formData.reasonForVisit === r
                                                        ? "bg-[#8B0000] text-[#FFD700] border-[#8B0000] font-bold"
                                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div> */}
                                    </div>

                                    {/* 5. Sacred Sankalp / Prayer Wish */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <span>🪷</span> 4. Sacred Devotee Sankalp (Optional)
                                            </label>
                                            <span className="text-[11px] text-[#9c7b36] font-semibold">Will be whispered during puja</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="sankalp"
                                            value={formData.sankalp}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Family prosperity, good health, and peace"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm bg-white"
                                        />
                                    </div>

                                    {/* 6. Message / Special Puja Arrangements */}
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                                            5. Special Arrangements / Devotee Message
                                        </label>
                                        <textarea
                                            rows={3}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="I would like to know more about the upcoming puja arrangements and donation opportunities."
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] text-sm bg-white"
                                        />
                                    </div>

                                    {/* 7. Action Button */}
                                    <div className="pt-2">
                                        {token ? (
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#a81016] to-[#8B0000] text-[#FFD700] font-black text-base shadow-xl shadow-[#8B0000]/25 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <RefreshCw size={18} className="animate-spin" />
                                                        Registering Mandir Visit...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={18} />
                                                        Submit Mandir Visit Request
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gray-200 text-gray-500 font-bold text-sm cursor-not-allowed border border-gray-300"
                                                >
                                                    <Lock size={16} />
                                                    Please login, to visit the mandir.
                                                </button>
                                                <Link
                                                    to="/auth"
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#8B0000] to-[#5a0000] text-[#FFD700] font-bold text-sm hover:brightness-110 transition shadow-md"
                                                >
                                                    <User size={16} />
                                                    Go to Login to Submit Data →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Info (1 Col) */}
                        <div className="space-y-6">

                            {/* Temple Darshan Guidelines */}
                            <div className="bg-white rounded-3xl p-6 border border-[#8B0000]/10 shadow-sm">
                                <h3 className="font-bold text-[#8B0000] text-base mb-4 flex items-center gap-2">
                                    <span className="text-xl">🛕</span> Temple Visit Guidelines
                                </h3>
                                <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#8B0000] font-bold mt-0.5">•</span>
                                        <span>
                                            Public Boro Maa darshan is open to devotees according to temple timings.
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-[#8B0000] font-bold mt-0.5">•</span>
                                        <span>
                                            Access to the Gupt Mandir and restricted deities or specialised rituals remains subject to temple protocols. No mandatory donation is required for public darshan.
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-[#8B0000] font-bold mt-0.5">•</span>
                                        <span>
                                            For information concerning puja, sankalpa, and devotional offerings, please contact Gupt Upasana through email.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Mandir Location */}
                            <div className="bg-gradient-to-br from-[#4a0a0d] to-[#250305] text-white rounded-3xl p-6 shadow-md border border-[#e7c652]/30">
                                <h3 className="font-bold text-[#FFD700] text-base mb-3 flex items-center gap-2">
                                    <MapPin size={18} /> Mandir Location
                                </h3>
                                <p className="text-xs text-white/90 leading-relaxed mb-4">
                                    <strong>Gupt Upasana Mandir</strong> (Salt Lake Boro Maa)
                                    <br />
                                    BC 160, Sector 1, Salt Lake,
                                    <br />
                                    Kolkata – 700064, West Bengal, India.
                                </p>
                                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Phone size={13} className="text-[#FFD700]" />
                                        <a href="tel:+919674933763" className="hover:text-[#FFD700] transition">
                                            +91 9674933763
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Info size={13} className="text-[#FFD700]" />
                                        <span>Nearest Landmark: Salt Lake Tank No. 2</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Link to Offer Seva */}
                            <div className="bg-[#fdfaf3] border border-[#e7c652]/50 rounded-3xl p-6 text-center">
                                {/* <span className="text-3xl block mb-2">🪔</span> */}
                                <h4 className="font-bold text-gray-800 text-sm">Wish to offer seva before visiting?</h4>
                                <p className="text-xs text-gray-500 mt-1 mb-4">
                                    Contribute towards daily puja, bhog distribution, and sacred havan offerings.
                                </p>
                                <Link
                                    to="/donate"
                                    className="inline-block w-full py-2.5 px-4 rounded-xl bg-[#8B0000] text-[#FFD700] font-bold text-xs hover:bg-[#6e0c12] transition shadow-sm"
                                >
                                    Offer Seva / Donation →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: MY SCHEDULED VISITS ────────────────────────── */}
                {activeTab === "my-visits" && (
                    <div className="space-y-6">

                        {/* Top bar */}
                        <div className="bg-white rounded-2xl p-5 border border-[#8B0000]/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-[#5a0000]">My Mandir Visit Enquiries</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Track the status of your submitted darshan, special puja, and mandir visit appointments.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {token && (
                                    <button
                                        type="button"
                                        onClick={fetchUserEnquiries}
                                        disabled={loadingEnquiries}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
                                    >
                                        <RefreshCw size={13} className={loadingEnquiries ? "animate-spin" : ""} />
                                        Refresh
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("book")}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B0000] text-[#FFD700] font-bold text-xs hover:bg-[#6b0000] transition shadow-sm"
                                >
                                    + Schedule New Visit
                                </button>
                            </div>
                        </div>

                        {/* Not logged in inside My Visits */}
                        {!token && (
                            <div className="bg-white rounded-3xl p-12 text-center border border-[#8B0000]/10 shadow-sm space-y-4 max-w-lg mx-auto">
                                <div className="w-16 h-16 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center mx-auto text-2xl">
                                    <Lock size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Please login, to visit the mandir.
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Sign in to view your previous visit bookings, scheduled puja requests, and enquiry statuses.
                                </p>
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B0000] text-[#FFD700] font-bold text-sm hover:bg-[#6b0000] transition shadow-md"
                                >
                                    <User size={16} />
                                    Login with Devotee Account
                                </Link>
                            </div>
                        )}

                        {/* Loading State */}
                        {token && loadingEnquiries && (
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error state */}
                        {token && !loadingEnquiries && enquiriesError && (
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 space-y-2">
                                <AlertCircle size={28} className="mx-auto text-rose-600" />
                                <p className="font-bold">{enquiriesError}</p>
                                <button
                                    onClick={fetchUserEnquiries}
                                    className="mt-2 px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Empty state */}
                        {token && !loadingEnquiries && !enquiriesError && enquiries.length === 0 && (
                            <div className="bg-white rounded-3xl p-12 text-center border border-[#8B0000]/10 shadow-sm space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[#8B0000]/8 text-[#8B0000] flex items-center justify-center mx-auto text-2xl">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">No Scheduled Visits Yet</h3>
                                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                                    You have not submitted any mandir visit enquiries yet. Choose your preferred date and time to seek the blessings of Salt Lake Boro Maa.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("book")}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8B0000] text-[#FFD700] font-bold text-xs hover:bg-[#6b0000] transition shadow"
                                >
                                    Schedule Your First Visit Now
                                </button>
                            </div>
                        )}

                        {/* List of Enquiries */}
                        {token && !loadingEnquiries && enquiries.length > 0 && (
                            <div className="space-y-4">
                                {enquiries.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-3xl p-6 border border-[#8B0000]/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-[#8B0000]/8 text-[#8B0000] flex items-center justify-center shrink-0">
                                                    {item.type === "organisation" ? <Building2 size={20} /> : <User size={20} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                            {item.type === "organisation" ? "Individual Visit" : "Corporate Visit"}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-gray-400">
                                                            #{item._id?.slice(-8)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-bold text-[#4a0a0d] mt-0.5">
                                                        {item.reasonForVisit || "Mandir Darshan"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <StatusBadge status={item.visitStatus} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2 text-gray-700">
                                                    <Calendar size={14} className="text-[#8B0000] shrink-0" />
                                                    <span className="text-gray-500">Visit Scheduled For:</span>
                                                    <strong className="text-gray-900 font-bold">
                                                        {formatDateTime(item.visitDate)}
                                                    </strong>
                                                </p>

                                                {item.companyName && (
                                                    <p className="flex items-center gap-2 text-gray-700">
                                                        <Building2 size={14} className="text-[#8B0000] shrink-0" />
                                                        <span className="text-gray-500">Company:</span>
                                                        <strong className="text-gray-900">{item.companyName}</strong>
                                                        {item.designation && <span className="text-gray-400">({item.designation})</span>}
                                                    </p>
                                                )}

                                                {item.authorisedContact && (
                                                    <p className="flex items-center gap-2 text-gray-700">
                                                        <User size={14} className="text-[#8B0000] shrink-0" />
                                                        <span className="text-gray-500">Contact Person:</span>
                                                        <strong className="text-gray-900">{item.authorisedContact}</strong>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2 text-gray-500">
                                                    <Clock size={14} className="text-gray-400 shrink-0" />
                                                    <span>Enquiry Registered:</span>
                                                    <span className="text-gray-700">{formatDateTime(item.createdAt)}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Sankalp Box */}
                                        {item.sankalp && (
                                            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#8B0000]/5 via-[#FFD700]/10 to-[#8B0000]/5 border border-[#8B0000]/10 text-xs">
                                                <p className="font-bold text-[#8B0000] flex items-center gap-1.5 mb-1">
                                                    <span>🪷</span> Devotee Sankalp Intention
                                                </p>
                                                <p className="text-gray-800 italic pl-5">
                                                    "{item.sankalp}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Devotee Message */}
                                        {item.message && (
                                            <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <span className="font-semibold text-gray-700">Note: </span>
                                                {item.message}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookVisitPage;
