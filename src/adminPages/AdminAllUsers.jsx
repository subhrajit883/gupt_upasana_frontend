import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Users, Search, RefreshCw, Filter,
    ChevronLeft, ChevronRight, Mail, Phone,
    MapPin, Building2, User, ShieldCheck, ShieldOff,
    CalendarDays, AlertCircle
} from "lucide-react";
import { authUrl } from "../config/config";
import { handleAdminAuthError } from "./adminAuthGuard";

const TOKEN_KEY = "admin_gupt";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

const getInitials = (name = "") =>
    name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const getUserPhoto = (u) =>
    u?.UserImg?.url ||
    u?.userImg?.url ||
    (typeof u?.UserImg === "string" ? u.UserImg : null) ||
    (typeof u?.userImg === "string" ? u.userImg : null);

// ── Avatar colours by index ───────────────────────────────────────────────────
const avatarColors = [
    "bg-[#f8edf0] text-[#4a0a0d]",
    "bg-indigo-100 text-indigo-800",
    "bg-emerald-100 text-emerald-800",
    "bg-amber-100 text-amber-800",
    "bg-purple-100 text-purple-800",
    "bg-sky-100 text-sky-800",
];

// ── Type badge ────────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
    const isOrg = type === "organisation";
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${isOrg
            ? "bg-purple-50 text-purple-700 border-purple-200"
            : "bg-sky-50 text-sky-700 border-sky-200"
            }`}>
            {isOrg ? <Building2 size={12} /> : <User size={12} />}
            {isOrg ? "Organisation" : "Individual"}
        </span>
    );
};

// ── Active badge ──────────────────────────────────────────────────────────────
const ActiveBadge = ({ active }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${active
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-600 border-red-200"
        }`}>
        {active ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
        {active ? "Active" : "Inactive"}
    </span>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
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

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr className="animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
            </td>
        ))}
    </tr>
);

// ── Detail modal ──────────────────────────────────────────────────────────────
const UserDetailModal = ({ user, colorClass, onClose }) => {
    if (!user) return null;
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#4a0a0d] px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-[#e7c66b] text-xs uppercase tracking-widest font-semibold">User Details</p>
                        <h3 className="text-white text-lg font-bold mt-0.5">{user.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Avatar + badges */}
                <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 overflow-hidden ${colorClass}`}>
                        {getUserPhoto(user) ? (
                            <img
                                src={getUserPhoto(user)}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            getInitials(user.name)
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 flex-wrap">
                            <TypeBadge type={user.type} />
                            <ActiveBadge active={user.isActive} />
                        </div>
                        <p className="text-xs text-gray-400">ID: <span className="font-mono text-gray-600">{user._id}</span></p>
                    </div>
                </div>

                {/* Info rows */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: <Mail size={15} />, label: "Email", value: user.email },
                        { icon: <Phone size={15} />, label: "Phone", value: user.phone },
                        { icon: <MapPin size={15} />, label: "Address", value: user.address },
                        ...(user.companyName
                            ? [{ icon: <Building2 size={15} />, label: "Company / Org", value: user.companyName }]
                            : []),
                        { icon: <CalendarDays size={15} />, label: "Joined", value: formatDate(user.createdAt) },
                        { icon: <CalendarDays size={15} />, label: "Last Updated", value: formatDate(user.updatedAt) },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="p-4 rounded-xl bg-[#fcfaf5] border border-[#f0ece4]">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5 mb-2">
                                <span className="text-[#9c7b36]">{icon}</span> {label}
                            </p>
                            <p className="text-sm font-semibold text-[#4a0a0d] break-words">{value || "N/A"}</p>
                        </div>
                    ))}

                    {/* Sankalp Card if available */}
                    {user.sankalp && (
                        <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-[#fdf8f0] via-[#fffbf3] to-[#fdf8f0] border border-[#e7c66b]/40">
                            <p className="text-[11px] uppercase tracking-wider text-[#9c7b36] font-bold flex items-center gap-1.5 mb-1.5">
                                <span>🪷</span> Sacred Devotee Sankalp
                            </p>
                            <p className="text-sm font-semibold text-[#4a0a0d] italic break-words">
                                "{user.sankalp}"
                            </p>
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116] transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
const AdminAllUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const ITEMS_PER_PAGE = 10;

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                navigate("/admin/login", { replace: true });
                return;
            }
            const res = await axios.get(authUrl.allUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data?.success) {
                setUsers(res.data.users || []);
            } else {
                setError("Unable to fetch users.");
            }
        } catch (err) {
            if (handleAdminAuthError(err, navigate)) return;
            setError(err.response?.data?.message || "Something went wrong while fetching users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter((u) => u.isActive).length,
        inactive: users.filter((u) => !u.isActive).length,
        organisations: users.filter((u) => u.type === "organisation").length,
        individuals: users.filter((u) => u.type === "individual").length,
    }), [users]);

    // ── Filter + search ───────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter((u) => {
            const matchSearch =
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.phone?.includes(q) ||
                u.address?.toLowerCase().includes(q);
            const matchType = typeFilter === "all" || u.type === typeFilter;
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && u.isActive) ||
                (statusFilter === "inactive" && !u.isActive);
            return matchSearch && matchType && matchStatus;
        });
    }, [users, search, typeFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [search, typeFilter, statusFilter]);

    return (
        <div className="min-h-screen bg-[#faf8f3] p-4 sm:p-6 lg:p-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                {/* <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#4a0a0d] flex items-center justify-center">
                            <Users size={20} className="text-[#e7c66b]" />
                        </div>
                        <span className="text-xs font-bold tracking-[2px] uppercase text-[#9c7b36]">
                            Gupt Upasana Administration
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#4a0a0d]">All Devotees</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage all registered devotee accounts.</p>
                </div> */}

                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#eee8dc] text-[#4a0a0d] font-semibold text-sm hover:bg-[#fbf2d9] transition disabled:opacity-60"
                >
                    <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                <StatCard title="Total Devotees" value={stats.total} subtitle="All registered accounts" icon={Users} color="bg-[#f8edf0] text-[#4a0a0d]" />
                {/* <StatCard title="Active"          value={stats.active}        subtitle="Currently active accounts"     icon={ShieldCheck} color="bg-green-50 text-green-600" /> */}
                <StatCard title="Organisations" value={stats.organisations} subtitle="Organisation-type accounts" icon={Building2} color="bg-purple-50 text-purple-600" />
                <StatCard title="Individuals" value={stats.individuals} subtitle="Individual devotee accounts" icon={User} color="bg-sky-50 text-sky-600" />
            </div>

            {/* ── Error ─────────────────────────────────────────────────────── */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                    <button onClick={fetchUsers} className="text-sm font-semibold text-red-700 underline">Retry</button>
                </div>
            )}

            {/* ── Table card ────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#eee8dc] shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 sm:p-6 border-b border-[#f0ece4]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-[#4a0a0d]">Devotee List</h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Showing {filtered.length} of {users.length} devotees
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search name, email, phone…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20"
                                />
                            </div>

                            {/* Type filter */}
                            <div className="relative">
                                <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full sm:w-40 pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                                >
                                    <option value="all">All Types</option>
                                    <option value="organisation">Organisation</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>

                            {/* Status filter */}
                            {/* <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-36 px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select> */}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-[#fcfaf5] text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-5 py-4 font-semibold">Devotee</th>
                                <th className="px-5 py-4 font-semibold">Contact</th>
                                <th className="px-5 py-4 font-semibold">Address</th>
                                <th className="px-5 py-4 font-semibold">Type</th>
                                {/* <th className="px-5 py-4 font-semibold">Status</th> */}
                                <th className="px-5 py-4 font-semibold">Joined</th>
                                <th className="px-5 py-4 font-semibold text-center">Details</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="w-16 h-16 rounded-full bg-[#fbf2d9] flex items-center justify-center mx-auto mb-4">
                                            <Users size={28} className="text-[#98701b]" />
                                        </div>
                                        <p className="font-bold text-[#4a0a0d]">No Devotees Found</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {search || typeFilter !== "all" || statusFilter !== "all"
                                                ? "Try adjusting your search or filters."
                                                : "No registered devotees yet."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((user, idx) => {
                                    const colorClass = avatarColors[idx % avatarColors.length];
                                    return (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-[#fdfbf6] transition-colors"
                                        >
                                            {/* Devotee */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden ${colorClass}`}>
                                                        {getUserPhoto(user) ? (
                                                            <img
                                                                src={getUserPhoto(user)}
                                                                alt={user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            getInitials(user.name)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                        {user.companyName ? (
                                                            <p className="text-xs text-[#9c7b36] font-medium flex items-center gap-1 mt-0.5">
                                                                <Building2 size={11} className="shrink-0" />
                                                                <span className="truncate max-w-[130px]">{user.companyName}</span>
                                                            </p>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                                {user._id.slice(-8)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-gray-700 flex items-center gap-1.5">
                                                    <Mail size={13} className="text-gray-400 shrink-0" />
                                                    {user.email}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                                    <Phone size={12} className="text-gray-400 shrink-0" />
                                                    {user.phone}
                                                </p>
                                            </td>

                                            {/* Address */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-gray-600 flex items-start gap-1.5 max-w-[180px]">
                                                    <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{user.address || "—"}</span>
                                                </p>
                                            </td>

                                            {/* Type */}
                                            <td className="px-5 py-4">
                                                <TypeBadge type={user.type} />
                                            </td>

                                            {/* Status */}
                                            {/* <td className="px-5 py-4">
                                                <ActiveBadge active={user.isActive} />
                                            </td> */}

                                            {/* Joined */}
                                            <td className="px-5 py-4">
                                                <p className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                                                    <CalendarDays size={13} className="text-gray-400" />
                                                    {formatDate(user.createdAt)}
                                                </p>
                                            </td>

                                            {/* Details button */}
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => setSelectedUser({ user, colorClass })}
                                                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-[#fbf2d9] text-[#4a0a0d] hover:bg-[#e7c66b] transition"
                                                    title="View details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filtered.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-[#f0ece4]">
                        <p className="text-xs text-gray-500">
                            Showing <span className="font-semibold text-[#4a0a0d]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                            {" "}to{" "}
                            <span className="font-semibold text-[#4a0a0d]">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span>
                            {" "}of{" "}
                            <span className="font-semibold text-[#4a0a0d]">{filtered.length}</span> devotees
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-[#fbf2d9] transition"
                            >
                                <ChevronLeft size={17} />
                            </button>
                            <span className="text-sm font-semibold text-[#4a0a0d] px-3">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-[#fbf2d9] transition"
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Detail modal ──────────────────────────────────────────────── */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser.user}
                    colorClass={selectedUser.colorClass}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default AdminAllUsers;
