import React from "react";
import {
    Search, Filter, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, Send,
    CheckCircle2, Clock, XCircle, AlertCircle, Bell, RefreshCw
} from "lucide-react";

const formatDate = (date) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const PushStatusBadge = ({ status }) => {
    const styles = {
        sent: "bg-green-50 text-green-700 border-green-200",
        queued: "bg-blue-50 text-blue-700 border-blue-200",
        not_sent: "bg-gray-50 text-gray-500 border-gray-200",
        failed: "bg-red-50 text-red-700 border-red-200",
    };

    const labels = {
        sent: "Delivered",
        queued: "Queued",
        not_sent: "Not Sent",
        failed: "Failed",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${styles[status] || styles.not_sent}`}>
            {status === "sent" ? <CheckCircle2 size={12} /> : status === "failed" ? <XCircle size={12} /> : <Clock size={12} />}
            {labels[status] || status || "Not Sent"}
        </span>
    );
};

const PujaUpdatesTable = ({
    loading, error, updates, totalCount, allCount,
    search, onSearchChange, statusFilter, onStatusChange, pushFilter, onPushChange,
    currentPage, totalPages, onPageChange, itemsPerPage,
    onEdit, onDelete, onView, onSendPush, sendingPushId, onRetry
}) => {
    return (
        <div className="bg-white rounded-2xl border border-[#eee8dc] shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-5 sm:p-6 border-b border-[#f0ece4]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#4a0a0d]">All Puja Updates</h2>
                        <p className="text-xs text-gray-400 mt-1">Showing {totalCount} of {allCount} updates</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search title, message, puja..."
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20"
                            />
                        </div>

                        <div className="relative">
                            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => onStatusChange(e.target.value)}
                                className="w-full sm:w-36 pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <select
                            value={pushFilter}
                            onChange={(e) => onPushChange(e.target.value)}
                            className="w-full sm:w-36 px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] bg-white"
                        >
                            <option value="all">All Push Status</option>
                            <option value="sent">Push Sent</option>
                            <option value="not_sent">Not Sent</option>
                            <option value="queued">Queued</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error alert */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 p-4 flex items-center justify-between text-sm text-red-700">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                    <button onClick={onRetry} className="font-semibold underline">Retry</button>
                </div>
            )}

            {/* Table Content */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#e7c66b] border-t-[#4a0a0d] rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 mt-4">Loading puja updates...</p>
                </div>
            ) : updates.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#fbf2d9] flex items-center justify-center mx-auto mb-4">
                        <Bell size={28} className="text-[#98701b]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#4a0a0d]">No Puja Updates Found</h3>
                    <p className="text-sm text-gray-400 mt-2">Create a new update or adjust your filters.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#fcfaf5] text-xs uppercase tracking-wider text-gray-500 border-b border-[#f0ece4]">
                                <th className="px-5 py-4 font-semibold">Puja / Title</th>
                                <th className="px-5 py-4 font-semibold">Message Preview</th>
                                <th className="px-5 py-4 font-semibold">Schedule Date</th>
                                <th className="px-5 py-4 font-semibold">Status</th>
                                <th className="px-5 py-4 font-semibold">Push Alert</th>
                                <th className="px-5 py-4 font-semibold">Created</th>
                                <th className="px-5 py-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {updates.map((item) => (
                                <tr key={item._id} className="hover:bg-[#fdfbf6] transition-colors">
                                    <td className="px-5 py-4">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B0000]/10 text-[#8B0000] mb-1">
                                            {item.pujaName || "Temple Update"}
                                        </span>
                                        <p className="text-sm font-bold text-[#4a0a0d] max-w-xs truncate">{item.title}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-xs text-gray-500 max-w-sm line-clamp-2">{item.message}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-xs font-medium text-gray-700">{formatDate(item.scheduledAt)}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            item.published ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600"
                                        }`}>
                                            {item.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <PushStatusBadge status={item.pushStatus} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString("en-IN")}</p>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onSendPush(item)}
                                                disabled={sendingPushId === item._id}
                                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center disabled:opacity-50"
                                                title="Send Push Notification to User Devices"
                                            >
                                                {sendingPushId === item._id ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                                            </button>
                                            <button
                                                onClick={() => onView(item)}
                                                className="w-8 h-8 rounded-lg bg-[#fbf2d9] text-[#4a0a0d] hover:bg-[#e7c66b] transition flex items-center justify-center"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#4a0a0d] hover:text-[#e7c66b] transition flex items-center justify-center"
                                                title="Edit Update"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition flex items-center justify-center"
                                                title="Delete Update"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && updates.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-[#f0ece4]">
                    <p className="text-xs text-gray-500">
                        Showing <span className="font-semibold text-[#4a0a0d]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-semibold text-[#4a0a0d]">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{" "}
                        <span className="font-semibold text-[#4a0a0d]">{totalCount}</span> records
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => onPageChange((prev) => prev - 1)}
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-[#fbf2d9]"
                        >
                            <ChevronLeft size={17} />
                        </button>
                        <span className="text-sm font-semibold text-[#4a0a0d] px-3">{currentPage} / {totalPages}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange((prev) => prev + 1)}
                            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-[#fbf2d9]"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PujaUpdatesTable;
