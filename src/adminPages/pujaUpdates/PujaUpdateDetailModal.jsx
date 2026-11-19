import React from "react";
import { XCircle, Send, RefreshCw } from "lucide-react";

const formatDate = (date) => (date ? new Date(date).toLocaleString("en-IN") : "N/A");

const PujaUpdateDetailModal = ({ update, onClose, onSendPush, sendingPushId }) => {
    const details = [
        ["Puja Name", update.pujaName || "General Temple Update"],
        ["Notification Title", update.title],
        ["Publish Status", update.published ? "Published (Live)" : "Draft (Hidden)"],
        ["Push Status", update.pushStatus || "not_sent"],
        ["Scheduled Date", formatDate(update.scheduledAt)],
        ["Published Date", formatDate(update.publishedAt)],
        ["Created At", formatDate(update.createdAt)],
        ["Updated At", formatDate(update.updatedAt)],
        ["Total Push Delivered", update.pushPayload?.sentCount != null ? String(update.pushPayload.sentCount) : "0"],
        ["Subscribers Count", update.pushPayload?.totalSubscribers != null ? String(update.pushPayload.totalSubscribers) : "0"],
    ];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[#4a0a0d] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-[#e7c66b] text-xs uppercase tracking-widest font-semibold">
                            Puja Update Details
                        </p>
                        <h3 className="text-white text-lg font-bold mt-1">
                            {update.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                    >
                        <XCircle size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Full Message Box */}
                    <div className="p-4 rounded-xl bg-[#fcfaf5] border border-[#f0ece4]">
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                            Full Message Content
                        </p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {update.message}
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {details.map(([label, value]) => (
                            <div key={label} className="p-4 rounded-xl bg-[#fcfaf5] border border-[#f0ece4]">
                                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                    {label}
                                </p>
                                <p className="text-sm font-semibold text-[#4a0a0d] mt-1 break-all">
                                    {value || "N/A"}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Push error if any */}
                    {update.pushError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                            <span className="font-bold">Push Error: </span> {update.pushError}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            onClick={() => onSendPush(update)}
                            disabled={sendingPushId === update._id}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {sendingPushId === update._id ? (
                                <>
                                    <RefreshCw size={15} className="animate-spin" />
                                    Broadcasting...
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    Send Push Notification
                                </>
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116]"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PujaUpdateDetailModal;
