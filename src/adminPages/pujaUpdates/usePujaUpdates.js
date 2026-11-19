import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { pujaUpdatesUrl } from "../../config/config";

const TOKEN_KEY = "admin_gupt";

export const emptyPujaForm = {
    title: "",
    message: "",
    pujaName: "",
    scheduledAt: "",
    published: false,
};

export const toDatetimeLocal = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const usePujaUpdates = () => {
    const navigate = useNavigate();

    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pushFilter, setPushFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyPujaForm);
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [viewTarget, setViewTarget] = useState(null);
    const [sendingPushId, setSendingPushId] = useState(null);

    const getAuthHeader = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            navigate("/admin/login", { replace: true });
            throw new Error("Admin login required");
        }
        return { Authorization: `Bearer ${token}` };
    };

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            setError("");
            const headers = getAuthHeader();

            let res;
            try {
                res = await axios.get(pujaUpdatesUrl.adminGetAll, { headers });
            } catch {
                res = await axios.get(`${pujaUpdatesUrl.get}?all=true`, { headers });
            }

            if (res.data?.success) {
                setUpdates(res.data.updates || []);
            } else {
                setError("Unable to fetch updates.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load puja updates.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpdates();
    }, []);

    const stats = useMemo(() => {
        const published = updates.filter((u) => u.published);
        const scheduled = updates.filter((u) => u.scheduledAt && new Date(u.scheduledAt) > new Date());
        const pushSent = updates.filter((u) => u.pushStatus === "sent");
        return {
            total: updates.length,
            published: published.length,
            draft: updates.length - published.length,
            scheduled: scheduled.length,
            pushSent: pushSent.length,
        };
    }, [updates]);

    const filteredUpdates = useMemo(() => {
        const text = search.toLowerCase();
        return updates.filter((u) => {
            const matchesSearch =
                u.title?.toLowerCase().includes(text) ||
                u.message?.toLowerCase().includes(text) ||
                u.pujaName?.toLowerCase().includes(text);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "published" && u.published) ||
                (statusFilter === "draft" && !u.published);

            const matchesPush =
                pushFilter === "all" ||
                u.pushStatus === pushFilter;

            return matchesSearch && matchesStatus && matchesPush;
        });
    }, [updates, search, statusFilter, pushFilter]);

    const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage) || 1;
    const paginatedUpdates = filteredUpdates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, pushFilter]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyPujaForm);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            title: item.title || "",
            message: item.message || "",
            pujaName: item.pujaName || "",
            scheduledAt: item.scheduledAt ? toDatetimeLocal(item.scheduledAt) : "",
            published: !!item.published,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) {
            toast.error("Title and message are required.");
            return;
        }

        setSaving(true);
        try {
            const headers = getAuthHeader();
            const payload = {
                title: form.title.trim(),
                message: form.message.trim(),
                pujaName: form.pujaName.trim() || undefined,
                scheduledAt: form.scheduledAt || null,
                published: form.published,
            };

            if (editing) {
                await axios.patch(pujaUpdatesUrl.update(editing._id), payload, { headers });
                toast.success("Puja update saved successfully");
            } else {
                await axios.post(pujaUpdatesUrl.create, payload, { headers });
                toast.success("Puja update created successfully");
            }

            setModalOpen(false);
            fetchUpdates();
        } catch (err) {
            toast.error(err.response?.data?.message || "Unable to save update.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const headers = getAuthHeader();
            await axios.delete(pujaUpdatesUrl.delete(deleteTarget._id), { headers });
            toast.success("Puja update deleted successfully");
            setDeleteTarget(null);
            fetchUpdates();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete update.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSendPush = async (update) => {
        setSendingPushId(update._id);
        const toastId = toast.loading(`Sending push notifications for "${update.title}"…`);
        try {
            const headers = getAuthHeader();
            const res = await axios.post(pujaUpdatesUrl.sendPush(update._id), {}, { headers });
            toast.success(res.data?.message || "Push notification broadcasted successfully!", { id: toastId });
            fetchUpdates();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send push notification.", { id: toastId });
        } finally {
            setSendingPushId(null);
        }
    };

    return {
        updates, loading, error, stats, filteredUpdates, paginatedUpdates,
        currentPage, totalPages, setCurrentPage, itemsPerPage,
        search, setSearch, statusFilter, setStatusFilter, pushFilter, setPushFilter,
        modalOpen, setModalOpen, editing, openCreate, openEdit,
        form, setForm, saving, handleSubmit,
        deleteTarget, setDeleteTarget, deleting, handleDelete,
        viewTarget, setViewTarget,
        sendingPushId, handleSendPush, fetchUpdates,
    };
};
