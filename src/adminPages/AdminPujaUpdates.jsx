import React from "react";
import { Plus, RefreshCw, Bell } from "lucide-react";
import { usePujaUpdates } from "./pujaUpdates/usePujaUpdates";
import PujaUpdatesStats from "./pujaUpdates/PujaUpdatesStats";
import PujaUpdatesTable from "./pujaUpdates/PujaUpdatesTable";
import PujaUpdateFormModal from "./pujaUpdates/PujaUpdateFormModal";
import PujaUpdateDeleteModal from "./pujaUpdates/PujaUpdateDeleteModal";
import PujaUpdateDetailModal from "./pujaUpdates/PujaUpdateDetailModal";

const AdminPujaUpdates = () => {
    const {
        loading, error, stats, paginatedUpdates, filteredUpdates,
        currentPage, totalPages, setCurrentPage, itemsPerPage,
        search, setSearch, statusFilter, setStatusFilter, pushFilter, setPushFilter,
        modalOpen, setModalOpen, editing, openCreate, openEdit,
        form, setForm, saving, handleSubmit,
        deleteTarget, setDeleteTarget, deleting, handleDelete,
        viewTarget, setViewTarget,
        sendingPushId, handleSendPush, fetchUpdates,
    } = usePujaUpdates();

    return (
        <div className="min-h-screen bg-[#faf8f3] p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                {/* <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#4a0a0d] flex items-center justify-center">
                            <Bell size={20} className="text-[#e7c66b]" />
                        </div>
                        <span className="text-xs font-bold tracking-[2px] uppercase text-[#9c7b36]">
                            Gupt Upasana Administration
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#4a0a0d]">Puja Updates & Push Alerts</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage announcements and broadcast push alerts to devotee devices.</p>
                </div> */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUpdates} disabled={loading}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#eee8dc] text-[#4a0a0d] font-semibold text-sm hover:bg-[#fbf2d9] transition disabled:opacity-60"
                    >
                        <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#4a0a0d] text-[#e7c66b] font-semibold text-sm hover:bg-[#641116] transition shadow-sm"
                    >
                        <Plus size={17} /> New Update
                    </button>
                </div>
            </div>

            <PujaUpdatesStats stats={stats} />

            <PujaUpdatesTable
                loading={loading} error={error} updates={paginatedUpdates}
                totalCount={filteredUpdates.length} allCount={stats.total}
                search={search} onSearchChange={setSearch}
                statusFilter={statusFilter} onStatusChange={setStatusFilter}
                pushFilter={pushFilter} onPushChange={setPushFilter}
                currentPage={currentPage} totalPages={totalPages}
                onPageChange={setCurrentPage} itemsPerPage={itemsPerPage}
                onEdit={openEdit} onDelete={setDeleteTarget}
                onView={setViewTarget} onSendPush={handleSendPush}
                sendingPushId={sendingPushId} onRetry={fetchUpdates}
            />

            {modalOpen && (
                <PujaUpdateFormModal
                    editing={editing} form={form} setForm={setForm}
                    saving={saving} onSubmit={handleSubmit} onClose={() => setModalOpen(false)}
                />
            )}
            {deleteTarget && (
                <PujaUpdateDeleteModal
                    target={deleteTarget} deleting={deleting}
                    onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}
                />
            )}
            {viewTarget && (
                <PujaUpdateDetailModal
                    update={viewTarget} onClose={() => setViewTarget(null)}
                    onSendPush={handleSendPush} sendingPushId={sendingPushId}
                />
            )}
        </div>
    );
};

export default AdminPujaUpdates;
