import React from "react";
import { X, CheckCircle2, RefreshCw } from "lucide-react";

const fieldClass = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e7c66b] focus:ring-2 focus:ring-[#e7c66b]/20 bg-white text-gray-800";
const labelClass = "block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2";

const PujaUpdateFormModal = ({ editing, form, setForm, saving, onSubmit, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !saving && onClose()}
        >
            <div
                className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[#4a0a0d] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-[#e7c66b] text-xs uppercase tracking-widest font-semibold">
                            {editing ? "Edit Puja Update" : "New Puja Update"}
                        </p>
                        <h3 className="text-white text-lg font-bold mt-0.5">
                            {editing ? editing.title : "Create Sacred Puja Announcement"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    <div>
                        <label className={labelClass}>Puja Name / Occasion</label>
                        <input
                            type="text"
                            value={form.pujaName}
                            onChange={(e) => setForm({ ...form, pujaName: e.target.value })}
                            placeholder="e.g. Durga Puja 2026, Maha Shivratri, Daily Aarti"
                            className={fieldClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Notification Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. Maa Durga Puja 2026 – Grand Celebration"
                            required
                            className={fieldClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Message Content / Push Payload *</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Provide details about the puja, timings, and rituals..."
                            rows={4}
                            required
                            className={`${fieldClass} resize-y`}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Scheduled Date &amp; Time (Optional)</label>
                            <input
                                type="datetime-local"
                                value={form.scheduledAt}
                                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Publish Immediately?</label>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, published: !form.published })}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition ${
                                    form.published
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-gray-50 border-gray-200 text-gray-500"
                                }`}
                            >
                                <span>{form.published ? "Published (Live on site)" : "Draft (Hidden)"}</span>
                                <span className={`relative w-11 h-6 rounded-full transition ${form.published ? "bg-green-500" : "bg-gray-300"}`}>
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                                        form.published ? "left-[22px]" : "left-0.5"
                                    }`} />
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece4]">
                        <button
                            type="button"
                            onClick={onClose}
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
                                    {editing ? "Update Announcement" : "Create Announcement"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PujaUpdateFormModal;
