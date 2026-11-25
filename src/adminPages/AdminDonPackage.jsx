import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Package, Plus, Pencil, Trash2, RefreshCw, X, Search, Filter, CheckCircle2, XCircle, AlertCircle, IndianRupee, CalendarDays, Sparkles, ListChecks, Gift, Layers, ImagePlus, Upload,
} from "lucide-react";
import { donationUrl } from "../config/config";
import { handleAdminAuthError } from "./adminAuthGuard";
import fallbackImg from "../assets/fallback.jpeg";

const TOKEN_KEY = "admin_gupt";
const MAX_IMG_BYTES = 200 * 1024;

const fieldClass =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20 bg-white text-gray-800";

const labelClass =
    "block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2";

const emptyForm = {
    name: "",
    description: "",
    category: "static",
    allowCustomAmount: false,
    minAmt: "",
    maxAmt: "",
    amounts: [{ amount: "", label: "" }],
    benefits: [""],
    rules: [""],
    startDate: "",
    endDate: "",
    active: true,
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "N/A";

const toDatetimeLocal = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminDonPackage = () => {
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageError, setImageError] = useState("");
    const fileInputRef = useRef(null);

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchPackages = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get(donationUrl.packages);

            if (res.data.success) {
                setPackages(res.data.packages || []);
            } else {
                setError("Unable to fetch packages.");
            }
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            setError(
                err.response?.data?.message ||
                "Something went wrong while fetching packages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // ── Statistics ───────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const active = packages.filter((p) => p.active);
        const custom = packages.filter((p) => p.allowCustomAmount);
        const staticCount = packages.filter((p) => p.category === "static").length;
        const dynamicCount = packages.filter((p) => p.category === "dynamic").length;

        return {
            total: packages.length,
            active: active.length,
            static: staticCount,
            dynamic: dynamicCount,
            custom: custom.length,
        };
    }, [packages]);

    // ── Search + filter ──────────────────────────────────────────────────────
    const filteredPackages = useMemo(() => {
        const text = search.toLowerCase();
        return packages.filter((p) => {
            const matchesSearch =
                p.name?.toLowerCase().includes(text) ||
                p.description?.toLowerCase().includes(text);
            const matchesCategory =
                categoryFilter === "all" || p.category === categoryFilter;
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && p.active) ||
                (statusFilter === "inactive" && !p.active);
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [packages, search, categoryFilter, statusFilter]);

    // ── Form helpers ─────────────────────────────────────────────────────────
    const setField = (name, value) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    const setArrayItem = (key, index, value, subKey) =>
        setForm((prev) => {
            const next = [...prev[key]];
            next[index] = subKey ? { ...next[index], [subKey]: value } : value;
            return { ...prev, [key]: next };
        });

    const addArrayItem = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: [...prev[key], value] }));

    const removeArrayItem = (key, index) =>
        setForm((prev) => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index),
        }));

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Only image files (PNG, JPG, WEBP) are allowed.");
            return;
        }
        if (file.size > MAX_IMG_BYTES) {
            setImageError("Image must be 200KB or smaller.");
            return;
        }

        if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        setImageError("");
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(editing?.packageImg?.url || "");
        setImageError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm, amounts: [{ amount: "", label: "" }], benefits: [""], rules: [""] });
        setFormError("");
        setImageFile(null);
        setImagePreview("");
        setImageError("");
        setModalOpen(true);
    };

    const openEdit = (pkg) => {
        setEditing(pkg);
        setForm({
            name: pkg.name || "",
            description: pkg.description || "",
            category: pkg.category || "static",
            allowCustomAmount: !!pkg.allowCustomAmount,
            minAmt: pkg.minAmt ?? "",
            maxAmt: pkg.maxAmt ?? "",
            amounts:
                pkg.amounts?.length
                    ? pkg.amounts.map((a) => ({ amount: a.amount ?? "", label: a.label || "" }))
                    : [{ amount: "", label: "" }],
            benefits: pkg.benefits?.length ? [...pkg.benefits] : [""],
            rules: pkg.rules?.length ? [...pkg.rules] : [""],
            startDate: pkg.startDate ? toDatetimeLocal(pkg.startDate) : "",
            endDate: pkg.endDate ? toDatetimeLocal(pkg.endDate) : "",
            active: pkg.active !== false,
        });
        setFormError("");
        setImageFile(null);
        setImagePreview(pkg.packageImg?.url || "");
        setImageError("");
        setModalOpen(true);
    };

    const validateForm = () => {
        if (!form.name.trim()) return "Package name is required.";

        // Amount configuration is independent of the package category
        if (form.allowCustomAmount) {
            if (!form.minAmt || !form.maxAmt)
                return "Please provide both minimum and maximum amounts.";
            if (Number(form.minAmt) < 1)
                return "Minimum amount must be at least ₹1.";
            if (Number(form.maxAmt) < Number(form.minAmt))
                return "Maximum amount must be greater than the minimum amount.";
        } else if (!form.amounts.some((a) => Number(a.amount) > 0)) {
            return "Add at least one amount option.";
        }

        // Category only controls the availability dates
        if (form.category === "dynamic") {
            if (!form.startDate || !form.endDate)
                return "Dynamic packages require a start and end date.";
            if (new Date(form.startDate) >= new Date(form.endDate))
                return "Start date must be before the end date.";
        }

        return "";
    };

    const buildPayload = () => {
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            active: form.active,
            benefits: form.benefits.map((b) => b.trim()).filter(Boolean),
            rules: form.rules.map((r) => r.trim()).filter(Boolean),
            allowCustomAmount: form.allowCustomAmount,
        };

        // Amount configuration is independent of the package category
        if (form.allowCustomAmount) {
            payload.minAmt = Number(form.minAmt);
            payload.maxAmt = Number(form.maxAmt);
            payload.amounts = [];
        } else {
            payload.amounts = form.amounts
                .filter((a) => Number(a.amount) > 0)
                .map((a) => ({
                    amount: Number(a.amount),
                    label: a.label.trim() || undefined,
                }));
        }

        // Dates only apply to dynamic packages
        if (form.category === "dynamic") {
            payload.startDate = form.startDate || null;
            payload.endDate = form.endDate || null;
        }

        return payload;
    };

    // The API accepts multipart/form-data (required for the package image),
    // so the payload is sent as form fields.
    const buildFormData = () => {
        const payload = buildPayload();
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("description", payload.description);
        formData.append("category", payload.category);
        formData.append("active", String(payload.active));
        formData.append("allowCustomAmount", String(payload.allowCustomAmount));
        formData.append("benefits", JSON.stringify(payload.benefits));
        formData.append("rules", JSON.stringify(payload.rules));

        if (payload.allowCustomAmount) {
            formData.append("minAmt", String(payload.minAmt));
            formData.append("maxAmt", String(payload.maxAmt));
            formData.append("amounts", JSON.stringify([]));
        } else {
            formData.append("amounts", JSON.stringify(payload.amounts));
        }

        if (payload.category === "dynamic") {
            formData.append("startDate", payload.startDate);
            formData.append("endDate", payload.endDate);
        }

        if (imageFile) formData.append("packageImg", imageFile);

        return formData;
    };

    // ── Create / Update ──────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateForm();
        if (validation) {
            setFormError(validation);
            return;
        }

        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setFormError("Admin session not found. Please login again.");
            navigate("/admin/login", { replace: true });
            return;
        }

        setSaving(true);
        setFormError("");

        try {
            const formData = buildFormData();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editing) {
                await axios.patch(`${donationUrl.packages}/${editing._id}`, formData, config);
                toast.success("Package updated successfully");
            } else {
                await axios.post(donationUrl.packages, formData, config);
                toast.success("Package created successfully");
            }

            setModalOpen(false);
            fetchPackages();
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            setFormError(err.response?.data?.message || "Unable to save package.");
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            toast.error("Admin session not found. Please login again.");
            navigate("/admin/login", { replace: true });
            return;
        }

        setDeleting(true);
        try {
            await axios.delete(`${donationUrl.packages}/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Package deleted successfully");
            setDeleteTarget(null);
            fetchPackages();
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            toast.error(err.response?.data?.message || "Unable to delete package.");
        } finally {
            setDeleting(false);
        }
    };

    // ── Small UI pieces ──────────────────────────────────────────────────────
    const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
        <div className="bg-white rounded-2xl border border-[#eee8dc] p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-[#4a0a0d] mt-2">{value}</h3>
                    <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );

    const CategoryBadge = ({ category }) => (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${category === "dynamic"
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-[#fbf2d9] text-[#98701b] border-[#efdfae]"
                }`}
        >
            <Layers size={13} />
            {category || "static"}
        </span>
    );

    const ActiveBadge = ({ active }) => (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${active
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
        >
            {active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {active ? "Active" : "Inactive"}
        </span>
    );

    return (
        <div className="min-h-screen bg-[#faf8f3] p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                {/* <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#4a0a0d] flex items-center justify-center">
                            <Package size={20} className="text-[#e7c66b]" />
                        </div>
                        <span className="text-xs font-bold tracking-[2px] uppercase text-[#9c7b36]">
                            Gupt Upasana Administration
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#4a0a0d]">
                        Donation Packages
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create, edit and manage the donation packages offered to devotees.
                    </p>
                </div> */}

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchPackages}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#eee8dc] text-[#4a0a0d] font-semibold text-sm hover:bg-[#fbf2d9] transition disabled:opacity-60"
                    >
                        <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>

                    <button
                        onClick={openCreate}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116] transition shadow-sm"
                    >
                        <Plus size={17} />
                        New Package
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Packages"
                    value={stats.total}
                    subtitle="All donation packages"
                    icon={Package}
                    color="bg-[#f8edf0] text-[#4a0a0d]"
                />
                <StatCard
                    title="Active"
                    value={stats.active}
                    subtitle="Currently visible to devotees"
                    icon={CheckCircle2}
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Dynamic"
                    value={` ${stats.dynamic}`}
                    subtitle="Dynamic packages"
                    icon={Layers}
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    title="Custom Amount"
                    value={stats.custom}
                    subtitle="Packages with flexible amounts"
                    icon={IndianRupee}
                    color="bg-[#fbf2d9] text-[#98701b]"
                />
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="text-red-600 shrink-0" size={20} />
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                    <button
                        onClick={fetchPackages}
                        className="text-sm font-semibold text-red-700 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-[#eee8dc] shadow-sm p-5 sm:p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#4a0a0d]">All Packages</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Showing {filteredPackages.length} of {packages.length} packages
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search package name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20"
                            />
                        </div>

                        <div className="relative">
                            <Filter
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full sm:w-40 pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                            >
                                <option value="all">All Categories</option>
                                <option value="static">Static</option>
                                <option value="dynamic">Dynamic</option>
                            </select>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-40 px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-[#eee8dc] py-20 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#e7c66b] border-t-[#4a0a0d] rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 mt-4">Loading packages...</p>
                </div>
            ) : filteredPackages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#eee8dc] py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#fbf2d9] flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-[#98701b]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#4a0a0d]">No Packages Found</h3>
                    <p className="text-sm text-gray-400 mt-2">
                        {search || categoryFilter !== "all" || statusFilter !== "all"
                            ? "Try changing your search or filters."
                            : "Create your first donation package to get started."}
                    </p>
                    {!search && categoryFilter === "all" && statusFilter === "all" && (
                        <button
                            onClick={openCreate}
                            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116]"
                        >
                            <Plus size={16} />
                            New Package
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="bg-white rounded-2xl border border-[#eee8dc] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-[#4a0a0d] via-[#e7c66b] to-[#4a0a0d]" />

                            <div className="relative h-40 bg-[#fcfaf5] overflow-hidden">
                                <img
                                    src={pkg.packageImg?.url || fallbackImg}
                                    alt={pkg.name}
                                    onError={(e) => { e.currentTarget.src = fallbackImg; }}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-bold text-[#4a0a0d] leading-snug">
                                        {pkg.name}
                                    </h3>
                                    <ActiveBadge active={pkg.active} />
                                </div>

                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                    <CategoryBadge category={pkg.category} />
                                    {pkg.allowCustomAmount && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#efdfae] bg-[#fffaf0] text-xs font-semibold text-[#98701b]">
                                            <Sparkles size={13} />
                                            Custom Amount
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                                    {pkg.description || "No description provided."}
                                </p>

                                {/* Amount info */}
                                <div className="mt-4 p-3 rounded-xl bg-[#fcfaf5] border border-[#f0ece4] space-y-2">
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                        Contribution
                                    </p>

                                    {pkg.allowCustomAmount ? (
                                        <p className="text-sm font-semibold text-[#4a0a0d]">
                                            {formatCurrency(pkg.minAmt)} – {formatCurrency(pkg.maxAmt)}
                                            <span className="ml-2 text-xs font-medium text-gray-400">
                                                (custom amount)
                                            </span>
                                        </p>
                                    ) : pkg.amounts?.length ? (
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.amounts.slice(0, 4).map((a, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 rounded-lg bg-white border border-[#eee8dc] text-xs font-semibold text-[#4a0a0d]"
                                                >
                                                    {formatCurrency(a.amount)}
                                                </span>
                                            ))}
                                            {pkg.amounts.length > 4 && (
                                                <span className="px-2.5 py-1 text-xs font-semibold text-gray-400">
                                                    +{pkg.amounts.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">Not configured</p>
                                    )}

                                    {pkg.category === "dynamic" && (
                                        <p className="text-sm font-semibold text-[#4a0a0d] flex items-center gap-2 pt-2 border-t border-[#f0ece4]">
                                            <CalendarDays size={15} className="text-[#98701b]" />
                                            {formatDate(pkg.startDate)} – {formatDate(pkg.endDate)}
                                        </p>
                                    )}
                                </div>

                                {/* Benefits preview */}
                                {pkg.benefits?.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                                            <Gift size={13} />
                                            Benefits
                                        </p>
                                        <ul className="space-y-1.5">
                                            {pkg.benefits.slice(0, 3).map((b, i) => (
                                                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                    <CheckCircle2 size={13} className="text-green-600 mt-0.5 shrink-0" />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-auto pt-4 border-t border-[#f0ece4] flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => openEdit(pkg)}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#fbf2d9] text-[#4a0a0d] font-semibold text-sm hover:bg-[#e7c66b] transition"
                                    >
                                        <Pencil size={15} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(pkg)}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition"
                                    >
                                        <Trash2 size={15} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => !saving && setModalOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#4a0a0d] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                {/* <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                    {editing ? (
                                        <Pencil size={18} className="text-[#e7c66b]" />
                                    ) : (
                                        <Plus size={18} className="text-[#e7c66b]" />
                                    )}
                                </div> */}
                                <div>
                                    <p className="text-[#e7c66b] text-xs uppercase tracking-widest font-semibold">
                                        {editing ? "Edit Package" : "New Package"}
                                    </p>
                                    <h3 className="text-white text-lg font-bold mt-0.5">
                                        {editing ? editing.name : "Create Donation Package"}
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setModalOpen(false)}
                                disabled={saving}
                                className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Package Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setField("name", e.target.value)}
                                        placeholder="e.g. Annadan Seva"
                                        required
                                        className={fieldClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setField("description", e.target.value)}
                                        placeholder="Describe what this package supports..."
                                        rows={3}
                                        className={`${fieldClass} resize-y`}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setField("category", e.target.value)}
                                        className={fieldClass}
                                    >
                                        <option value="static">Static</option>
                                        <option value="dynamic">Dynamic</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setField("active", !form.active)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition ${form.active
                                            ? "bg-green-50 border-green-200 text-green-700"
                                            : "bg-gray-50 border-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {form.active ? "Active" : "Inactive"}
                                        <span
                                            className={`relative w-11 h-6 rounded-full transition ${form.active ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.active ? "left-[22px]" : "left-0.5"
                                                    }`}
                                            />
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Package image */}
                            <div className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <ImagePlus size={16} className="text-[#98701b]" />
                                    <h4 className="text-sm font-bold text-[#4a0a0d]">Package Image</h4>
                                    <span className="text-xs text-gray-400 font-medium">(max 200KB)</span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-40 h-32 shrink-0 rounded-xl border border-dashed border-[#e0d9c8] bg-white overflow-hidden flex items-center justify-center">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Package preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                                <ImagePlus size={28} />
                                                <span className="text-xs font-medium">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116] transition"
                                            >
                                                <Upload size={15} />
                                                {imagePreview ? "Change Image" : "Upload Image"}
                                            </button>
                                            {imagePreview && (
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition"
                                                >
                                                    <X size={15} />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3">
                                            PNG, JPG or WEBP. Recommended square image, up to 200KB.
                                        </p>
                                        {imageError && (
                                            <p className="text-xs text-red-600 mt-2">{imageError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contribution options - independent of category */}
                            <div className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <IndianRupee size={16} className="text-[#98701b]" />
                                    <h4 className="text-sm font-bold text-[#4a0a0d]">
                                        Contribution Options
                                    </h4>
                                </div>

                                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.allowCustomAmount}
                                        onChange={(e) => setField("allowCustomAmount", e.target.checked)}
                                        className="w-4 h-4 accent-[#4a0a0d]"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">
                                        Allow custom amount (contributors can enter their own amount)
                                    </span>
                                </label>

                                {form.allowCustomAmount ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Minimum Amount (₹)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={form.minAmt}
                                                onChange={(e) => setField("minAmt", e.target.value)}
                                                placeholder="101"
                                                className={fieldClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Maximum Amount (₹)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={form.maxAmt}
                                                onChange={(e) => setField("maxAmt", e.target.value)}
                                                placeholder="51000"
                                                className={fieldClass}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className={labelClass}>Fixed Amount Options</label>
                                        {form.amounts.map((option, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={option.amount}
                                                    onChange={(e) =>
                                                        setArrayItem("amounts", index, e.target.value, "amount")
                                                    }
                                                    placeholder="Amount (₹)"
                                                    className={`${fieldClass} sm:max-w-[160px]`}
                                                />
                                                <input
                                                    type="text"
                                                    value={option.label}
                                                    onChange={(e) =>
                                                        setArrayItem("amounts", index, e.target.value, "label")
                                                    }
                                                    placeholder="Label (optional)"
                                                    className={fieldClass}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem("amounts", index)}
                                                    disabled={form.amounts.length === 1}
                                                    className="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center disabled:opacity-40"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem("amounts", { amount: "", label: "" })}
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#98701b] hover:text-[#4a0a0d]"
                                        >
                                            <Plus size={15} />
                                            Add amount option
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic package options */}
                            {form.category === "dynamic" && (
                                <div className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays size={16} className="text-[#98701b]" />
                                        <h4 className="text-sm font-bold text-[#4a0a0d]">
                                            Availability Window
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Start Date &amp; Time</label>
                                            <input
                                                type="datetime-local"
                                                value={form.startDate}
                                                onChange={(e) => setField("startDate", e.target.value)}
                                                className={fieldClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>End Date &amp; Time</label>
                                            <input
                                                type="datetime-local"
                                                value={form.endDate}
                                                onChange={(e) => setField("endDate", e.target.value)}
                                                className={fieldClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            <div className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Gift size={16} className="text-[#98701b]" />
                                    <h4 className="text-sm font-bold text-[#4a0a0d]">Benefits</h4>
                                </div>
                                <div className="space-y-3">
                                    {form.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) =>
                                                    setArrayItem("benefits", index, e.target.value)
                                                }
                                                placeholder="e.g. Support food distribution"
                                                className={fieldClass}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem("benefits", index)}
                                                disabled={form.benefits.length === 1}
                                                className="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center disabled:opacity-40"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem("benefits", "")}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#98701b] hover:text-[#4a0a0d]"
                                    >
                                        <Plus size={15} />
                                        Add benefit
                                    </button>
                                </div>
                            </div>

                            {/* Rules */}
                            <div className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <ListChecks size={16} className="text-[#98701b]" />
                                    <h4 className="text-sm font-bold text-[#4a0a0d]">Rules</h4>
                                </div>
                                <div className="space-y-3">
                                    {form.rules.map((rule, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={rule}
                                                onChange={(e) =>
                                                    setArrayItem("rules", index, e.target.value)
                                                }
                                                placeholder="e.g. Minimum contribution is ₹101."
                                                className={fieldClass}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem("rules", index)}
                                                disabled={form.rules.length === 1}
                                                className="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center disabled:opacity-40"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem("rules", "")}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#98701b] hover:text-[#4a0a0d]"
                                    >
                                        <Plus size={15} />
                                        Add rule
                                    </button>
                                </div>
                            </div>

                            {/* Form error */}
                            {formError && (
                                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    {formError}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116] transition disabled:opacity-60 flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            {editing ? "Update Package" : "Create Package"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => !deleting && setDeleteTarget(null)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 text-center">
                            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={26} className="text-red-600" />
                            </div>

                            <h3 className="text-lg font-bold text-[#4a0a0d]">
                                Delete Package
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-[#4a0a0d]">
                                    {deleteTarget.name}
                                </span>
                                ? This action cannot be undone.
                            </p>

                            <div className="flex items-center justify-center gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition disabled:opacity-60 flex items-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDonPackage;
