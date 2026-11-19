import React from "react";
import { Trash2, RefreshCw } from "lucide-react";

const PujaUpdateDeleteModal = ({ target, deleting, onConfirm, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !deleting && onClose()}
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
                        Delete Puja Update
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[#4a0a0d]">
                            "{target?.title}"
                        </span>
                        ? Devotees will no longer see this alert and this action cannot be undone.
                    </p>

                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleting}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
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
    );
};

export default PujaUpdateDeleteModal;
