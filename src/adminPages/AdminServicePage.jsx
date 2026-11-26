import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    AlertCircle,
    CheckCircle2,
    Filter,
    ImagePlus,
    Layers,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { serviceUrl } from "../config/config";
import { handleAdminAuthError } from "./adminAuthGuard";
import fallbackImg from "../assets/fallback.jpeg";

const TOKEN_KEY = "admin_gupt";
const MAX_IMG_BYTES = 200 * 1024;
const categories = [
    { value: "regular_puja", label: "Regular Puja" },
    { value: "havan", label: "Havan / Yagya" },
    { value: "seva", label: "Seva" },
    { value: "special_puja", label: "Special / Festival Puja" },
];
const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "half_yearly", label: "Half-yearly" },
    { value: "yearly", label: "Yearly" },
];
const fieldClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20";
const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500";
const emptyForm = {
    serviceName: "",
    serviceCategory: "special_puja",
    serviceDescription: "",
    status: "published",
    active: true,
    serviceAmounts: [{ amount: "", label: "", frequency: "" }],
    serviceBenefits: [""],
    serviceRules: [""],
};

const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
}).format(Number(amount) || 0);

const requestPackages = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await axios.get(serviceUrl.adminAll, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.data?.success) throw new Error("Unable to fetch services.");
    return response.data.packages || [];
};

const AdminServicePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageError, setImageError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        return () => {
            if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const fetchPackages = useCallback(async () => {
        try {
            const items = await requestPackages();
            setError("");
            setPackages(items);
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            setError(err.response?.data?.message || err.message || "Unable to fetch services.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        let cancelled = false;
        requestPackages()
            .then((items) => {
                if (cancelled) return;
                setError("");
                setPackages(items);
            })
            .catch((err) => {
                if (cancelled) return;
                if (handleAdminAuthError(err, navigate)) return;
                setError(err.response?.data?.message || err.message || "Unable to fetch services.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [navigate]);

    const stats = useMemo(() => ({
        total: packages.length,
        published: packages.filter((item) => item.status === "published" && item.active).length,
        drafts: packages.filter((item) => item.status === "draft").length,
        categories: new Set(packages.map((item) => item.serviceCategory)).size,
    }), [packages]);

    const filteredPackages = useMemo(() => {
        const query = search.trim().toLowerCase();
        return packages.filter((item) => {
            const matchesSearch = !query
                || item.serviceName?.toLowerCase().includes(query)
                || item.serviceDescription?.toLowerCase().includes(query);
            const matchesCategory = categoryFilter === "all" || item.serviceCategory === categoryFilter;
            const matchesStatus = statusFilter === "all"
                || (statusFilter === "published" && item.status === "published" && item.active)
                || (statusFilter === "draft" && item.status === "draft")
                || (statusFilter === "archived" && item.status === "archived")
                || (statusFilter === "inactive" && !item.active);
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [packages, search, categoryFilter, statusFilter]);

    const setField = (name, value) => setForm((previous) => ({ ...previous, [name]: value }));
    const setArrayItem = (key, index, value, subKey) => setForm((previous) => {
        const next = [...previous[key]];
        next[index] = subKey ? { ...next[index], [subKey]: value } : value;
        return { ...previous, [key]: next };
    });
    const addArrayItem = (key, value) => setForm((previous) => ({
        ...previous,
        [key]: [...previous[key], value],
    }));
    const removeArrayItem = (key, index) => setForm((previous) => ({
        ...previous,
        [key]: previous[key].filter((_, itemIndex) => itemIndex !== index),
    }));

    const openCreate = () => {
        setEditing(null);
        setForm({
            ...emptyForm,
            serviceAmounts: [{ amount: "", label: "", frequency: "" }],
            serviceBenefits: [""],
            serviceRules: [""],
        });
        setImageFile(null);
        setImagePreview("");
        setImageError("");
        setFormError("");
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            serviceName: item.serviceName || "",
            serviceCategory: item.serviceCategory || "regular_puja",
            serviceDescription: item.serviceDescription || "",
            status: item.status || "draft",
            active: item.active !== false,
            serviceAmounts: item.serviceAmounts?.length
                ? item.serviceAmounts.map(({ amount, label, frequency }) => ({
                    amount: amount ?? "",
                    label: label || "",
                    frequency: frequency || "",
                }))
                : [{ amount: "", label: "", frequency: "" }],
            serviceBenefits: item.serviceBenefits?.length ? [...item.serviceBenefits] : [""],
            serviceRules: item.serviceRules?.length ? [...item.serviceRules] : [""],
        });
        setImageFile(null);
        setImagePreview(item.serviceImg?.url || "");
        setImageError("");
        setFormError("");
        setModalOpen(true);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setImageError("Select a PNG, JPG or WEBP image.");
            event.target.value = "";
            return;
        }
        if (file.size > MAX_IMG_BYTES) {
            setImageError("The image must be 200KB or smaller.");
            event.target.value = "";
            return;
        }
        setImageError("");
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const validateForm = () => {
        if (!form.serviceName.trim()) return "Service name is required.";
        const amounts = form.serviceAmounts.filter((item) => Number(item.amount) >= 1);
        if (!amounts.length) return "Add at least one amount option of ₹1 or more.";
        if (form.serviceAmounts.some((item) => item.amount && Number(item.amount) < 1)) {
            return "Each amount must be at least ₹1.";
        }
        if (form.serviceCategory === "regular_puja") {
            if (amounts.some((item) => !item.frequency)) return "Select a frequency for each regular puja amount.";
            const selectedFrequencies = amounts.map((item) => item.frequency);
            if (new Set(selectedFrequencies).size !== selectedFrequencies.length) {
                return "Each regular puja amount must have a different frequency.";
            }
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validation = validateForm();
        if (validation) {
            setFormError(validation);
            return;
        }
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setFormError("Admin session not found. Please sign in again.");
            navigate("/admin/login", { replace: true });
            return;
        }

        const payload = new FormData();
        payload.append("serviceName", form.serviceName.trim());
        payload.append("serviceCategory", form.serviceCategory);
        payload.append("serviceDescription", form.serviceDescription.trim());
        payload.append("status", form.status);
        payload.append("active", String(form.active));
        payload.append("serviceAmounts", JSON.stringify(form.serviceAmounts
            .filter((item) => Number(item.amount) >= 1)
            .map((item) => ({
                amount: Number(item.amount),
                ...(item.label.trim() && { label: item.label.trim() }),
                ...(form.serviceCategory === "regular_puja" && { frequency: item.frequency }),
            }))));
        payload.append("serviceBenefits", JSON.stringify(form.serviceBenefits.map((item) => item.trim()).filter(Boolean)));
        payload.append("serviceRules", JSON.stringify(form.serviceRules.map((item) => item.trim()).filter(Boolean)));
        if (imageFile) payload.append("serviceImg", imageFile);

        setSaving(true);
        setFormError("");
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editing) {
                await axios.patch(serviceUrl.update(editing._id), payload, config);
                toast.success("Service updated.");
            } else {
                await axios.post(serviceUrl.create, payload, config);
                toast.success("Service created.");
            }
            setModalOpen(false);
            await fetchPackages();
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            setFormError(err.response?.data?.message || "Unable to save this service.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            toast.error("Admin session not found. Please sign in again.");
            navigate("/admin/login", { replace: true });
            return;
        }
        setDeleting(true);
        try {
            await axios.delete(serviceUrl.delete(deleteTarget._id), {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Service deleted.");
            setDeleteTarget(null);
            await fetchPackages();
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            toast.error(err.response?.data?.message || "Unable to delete this service.");
        } finally {
            setDeleting(false);
        }
    };

    const closeModal = () => {
        if (!saving) setModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#faf8f3] p-4 sm:p-6 lg:p-8">
            <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#98701b]">Gupt Upasana Administration</p>
                    <h1 className="mt-1 text-2xl font-bold text-[#4a0a0d] sm:text-3xl">Service Packages</h1>
                    <p className="mt-1 text-sm text-gray-500">Create and manage puja, havan and seva offerings.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => { setLoading(true); setError(""); fetchPackages(); }} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#eee8dc] bg-white px-4 py-3 text-sm font-semibold text-[#4a0a0d] disabled:opacity-60">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#4a0a0d] px-4 py-3 text-sm font-semibold text-[#e7c66b]">
                        <Plus size={16} /> New Service
                    </button>
                </div>
            </header>

            <section className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[
                    ["All services", stats.total],
                    ["Published & active", stats.published],
                    ["Drafts", stats.drafts],
                    ["Categories used", stats.categories],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-[#eee8dc] bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="mt-2 text-2xl font-bold text-[#4a0a0d]">{value}</p>
                    </div>
                ))}
            </section>

            {error && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={19} /><span className="flex-1">{error}</span>
                    <button onClick={() => { setLoading(true); setError(""); fetchPackages(); }} className="font-semibold underline">Retry</button>
                </div>
            )}

            <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#eee8dc] bg-white p-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services..." className={`${fieldClass} pl-10`} />
                </div>
                <div className="relative">
                    <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={`${fieldClass} min-w-48 pl-9`}>
                        <option value="all">All categories</option>
                        {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                    </select>
                </div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={`${fieldClass} sm:w-48`}>
                    <option value="all">All statuses</option>
                    <option value="published">Published & active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                    <option value="inactive">Inactive</option>
                </select>
            </section>

            {loading ? (
                <div className="rounded-2xl border border-[#eee8dc] bg-white py-20 text-center text-sm text-gray-500">
                    <RefreshCw size={22} className="mx-auto mb-3 animate-spin text-[#98701b]" /> Loading services...
                </div>
            ) : filteredPackages.length === 0 ? (
                <div className="rounded-2xl border border-[#eee8dc] bg-white py-16 text-center">
                    <Sparkles size={30} className="mx-auto text-[#98701b]" />
                    <h2 className="mt-3 font-bold text-[#4a0a0d]">No services found</h2>
                    <p className="mt-1 text-sm text-gray-500">Create a service package or adjust your filters.</p>
                    {!packages.length && <button onClick={openCreate} className="mt-5 rounded-xl bg-[#4a0a0d] px-4 py-2.5 text-sm font-semibold text-[#e7c66b]">Create a service</button>}
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredPackages.map((item) => (
                        <article key={item._id} className="flex flex-col overflow-hidden rounded-2xl border border-[#eee8dc] bg-white shadow-sm">
                            <div className="h-1.5 bg-gradient-to-r from-[#4a0a0d] via-[#e7c66b] to-[#4a0a0d]" />
                            <div className="h-40 bg-[#fcfaf5]">
                                <img src={item.serviceImg?.url || fallbackImg} alt={item.serviceName} onError={(event) => { event.currentTarget.src = fallbackImg; }} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="font-bold text-[#4a0a0d]">{item.serviceName}</h2>
                                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${item.active ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                                        {item.active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#efdfae] bg-[#fbf2d9] px-2.5 py-1 text-xs font-semibold text-[#98701b]">
                                        <Layers size={12} /> {categories.find((category) => category.value === item.serviceCategory)?.label || item.serviceCategory}
                                    </span>
                                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold capitalize text-gray-600">{item.status}</span>
                                </div>
                                <p className="mt-3 line-clamp-2 text-sm text-gray-500">{item.serviceDescription || "No description provided."}</p>
                                <div className="mt-4 rounded-xl border border-[#f0ece4] bg-[#fcfaf5] p-3">
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Amounts</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.serviceAmounts?.map((amount) => (
                                            <span key={amount._id} className="rounded-lg border border-[#eee8dc] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4a0a0d]">
                                                {formatCurrency(amount.amount)}{amount.label ? ` · ${amount.label}` : ""}
                                                {amount.frequency ? ` · ${frequencies.find((frequency) => frequency.value === amount.frequency)?.label || amount.frequency}` : ""}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {item.serviceBenefits?.length > 0 && (
                                    <ul className="mt-4 space-y-1.5">
                                        {item.serviceBenefits.slice(0, 3).map((benefit, index) => <li key={`${benefit}-${index}`} className="flex gap-2 text-xs text-gray-600"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-600" />{benefit}</li>)}
                                    </ul>
                                )}
                                <div className="mt-auto flex justify-end gap-2 border-t border-[#f0ece4] pt-4">
                                    <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#fbf2d9] px-4 py-2.5 text-sm font-semibold text-[#4a0a0d]"><Pencil size={14} /> Edit</button>
                                    <button onClick={() => setDeleteTarget(item)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"><Trash2 size={14} /> Delete</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={closeModal}>
                    <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <header className="sticky top-0 z-10 flex items-center justify-between bg-[#4a0a0d] px-6 py-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#e7c66b]">{editing ? "Edit Service" : "New Service"}</p>
                                <h2 className="mt-1 text-lg font-bold text-white">{editing ? editing.serviceName : "Create Service Package"}</h2>
                            </div>
                            <button onClick={closeModal} disabled={saving} aria-label="Close form" className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-50"><X size={19} /></button>
                        </header>
                        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
                            <section className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Service name *</label>
                                    <input required value={form.serviceName} onChange={(event) => setField("serviceName", event.target.value)} className={fieldClass} placeholder="e.g. Maa Mahakali Puja" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Description</label>
                                    <textarea rows={3} value={form.serviceDescription} onChange={(event) => setField("serviceDescription", event.target.value)} className={`${fieldClass} resize-y`} placeholder="Describe this service..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select value={form.serviceCategory} onChange={(event) => setField("serviceCategory", event.target.value)} className={fieldClass}>
                                        {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Publication status</label>
                                    <select value={form.status} onChange={(event) => setField("status", event.target.value)} className={fieldClass}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700 sm:col-span-2">
                                    <input type="checkbox" checked={form.active} onChange={(event) => setField("active", event.target.checked)} className="h-4 w-4 accent-[#4a0a0d]" />
                                    Service is active and available to devotees
                                </label>
                            </section>

                            <section className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-4 sm:p-5">
                                <div className="mb-4 flex items-center gap-2"><ImagePlus size={17} className="text-[#98701b]" /><h3 className="text-sm font-bold text-[#4a0a0d]">Service image</h3><span className="text-xs text-gray-400">(max 200KB)</span></div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#e0d9c8] bg-white sm:w-40">
                                        {imagePreview ? <img src={imagePreview} alt="Service preview" className="h-full w-full object-cover" /> : <ImagePlus size={27} className="text-gray-300" />}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden" />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#4a0a0d] px-4 py-2.5 text-sm font-semibold text-[#e7c66b]"><Upload size={15} />{imagePreview ? "Change image" : "Upload image"}</button>
                                        <p className="mt-2 text-xs text-gray-400">PNG, JPG or WEBP. Existing image stays unless replaced.</p>
                                        {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-4 sm:p-5">
                                <h3 className="mb-4 text-sm font-bold text-[#4a0a0d]">Service amount options</h3>
                                <div className="space-y-3">
                                    {form.serviceAmounts.map((amount, index) => (
                                        <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1.2fr_1fr_auto]">
                                            <input type="number" min="1" step="1" value={amount.amount} onChange={(event) => setArrayItem("serviceAmounts", index, event.target.value, "amount")} placeholder="Amount (₹)" className={fieldClass} />
                                            <input value={amount.label} onChange={(event) => setArrayItem("serviceAmounts", index, event.target.value, "label")} placeholder="Label (optional)" className={fieldClass} />
                                            {form.serviceCategory === "regular_puja" ? (
                                                <select value={amount.frequency} onChange={(event) => setArrayItem("serviceAmounts", index, event.target.value, "frequency")} className={fieldClass}>
                                                    <option value="">Select frequency</option>
                                                    {frequencies.map((frequency) => <option key={frequency.value} value={frequency.value}>{frequency.label}</option>)}
                                                </select>
                                            ) : <div className="hidden sm:block" />}
                                            <button type="button" onClick={() => removeArrayItem("serviceAmounts", index)} disabled={form.serviceAmounts.length === 1} aria-label="Remove amount" className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 disabled:opacity-40"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addArrayItem("serviceAmounts", { amount: "", label: "", frequency: "" })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#98701b]"><Plus size={15} /> Add amount option</button>
                                </div>
                            </section>

                            {[
                                ["serviceBenefits", "Benefits", "Add benefit"],
                                ["serviceRules", "Rules", "Add rule"],
                            ].map(([key, title, addLabel]) => (
                                <section key={key} className="rounded-2xl border border-[#f0ece4] bg-[#fcfaf5] p-4 sm:p-5">
                                    <h3 className="mb-4 text-sm font-bold text-[#4a0a0d]">{title}</h3>
                                    <div className="space-y-3">
                                        {form[key].map((value, index) => (
                                            <div key={index} className="flex gap-3">
                                                <input value={value} onChange={(event) => setArrayItem(key, index, event.target.value)} placeholder={title === "Benefits" ? "e.g. Receive puja prasad" : "e.g. Booking is subject to confirmation"} className={fieldClass} />
                                                <button type="button" onClick={() => removeArrayItem(key, index)} disabled={form[key].length === 1} aria-label={`Remove ${title.toLowerCase()}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 disabled:opacity-40"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(key, "")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#98701b]"><Plus size={15} /> {addLabel}</button>
                                    </div>
                                </section>
                            ))}

                            {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
                            <footer className="flex justify-end gap-3">
                                <button type="button" onClick={closeModal} disabled={saving} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#4a0a0d] px-5 py-3 text-sm font-semibold text-[#e7c66b] disabled:opacity-60">
                                    {saving ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                    {saving ? "Saving..." : editing ? "Update service" : "Create service"}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <Trash2 size={27} className="mx-auto text-red-600" />
                        <h2 className="mt-3 font-bold text-[#4a0a0d]">Delete service?</h2>
                        <p className="mt-2 text-sm text-gray-500">This will permanently delete <strong>{deleteTarget.serviceName}</strong>.</p>
                        <div className="mt-6 flex justify-center gap-3">
                            <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">{deleting && <RefreshCw size={14} className="animate-spin" />}Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServicePage;
