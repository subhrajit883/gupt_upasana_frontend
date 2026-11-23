import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    IndianRupee,
    Package,
    Bell,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    User,
} from "lucide-react";

const TOKEN_KEY = "admin_gupt";

const navItems = [
    { label: "Donation", to: "/admin/donations", icon: IndianRupee },
    { label: "Donation Package", to: "/admin/donation-packages", icon: Package },
    { label: "Puja Updates", to: "/admin/puja-updates", icon: Bell },
    { label: "All Users", to: "/admin/all-users", icon: User },
];

const AdminSidebar = ({ open, onClose, onOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        toast.success("Logged out successfully");
        navigate("/admin/login", { replace: true });
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
            ? "bg-[#e7c66b] text-[#4a0a0d] shadow-sm shadow-black/20"
            : "text-[#e7c66b]/80 hover:bg-[#e7c66b]/10 hover:text-[#e7c66b]"
        }`;

    return (
        <>
            {/* Overlay when sidebar is open on mobile */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden print:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Toggle Button */}
            <button
                type="button"
                onClick={open ? onClose : onOpen}
                className={`fixed top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7c66b]/30 bg-[#4a0a0d] text-[#e7c66b] shadow-lg transition-all duration-300 hover:bg-[#5c1217] print:hidden ${open ? "left-[264px] md:left-[264px]" : "left-3"
                    }`}
                aria-label={open ? "Close admin sidebar" : "Open admin sidebar"}
                title={open ? "Close sidebar" : "Open sidebar"}
            >
                {open ? (
                    <PanelLeftClose size={20} />
                ) : (
                    <PanelLeftOpen size={20} />
                )}
            </button>

            {/* Fixed Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-dvh w-64 flex-col overflow-hidden border-r border-[#e7c66b]/15 bg-[#4a0a0d] transition-transform duration-300 ease-in-out print:hidden ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo Section */}
                <div className="flex shrink-0 items-center justify-between px-5 py-5 border-b border-[#e7c66b]/15">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="flex items-center gap-3 group"
                        title="Go to home"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#e7c66b] bg-[#e7c66b]/10 transition group-hover:bg-[#e7c66b]/20">
                            <img
                                src="/logo.png"
                                alt="logo"
                                className="h-8 w-8 object-contain"
                            />
                        </div>

                        <div className="leading-tight">
                            <p className="text-sm font-bold text-[#e7c66b]">
                                Gupt Upasana
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-[#e7c66b]/50">
                                Admin Panel
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation - Non Scrollable */}
                <nav className="flex-1 overflow-hidden px-3 py-5">
                    <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#e7c66b]/40">
                        Manage
                    </p>

                    <div className="space-y-1.5">
                        {navItems.map(({ label, to, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={onClose}
                                className={linkClass}
                            >
                                <Icon size={19} />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Logout - Fixed at Bottom */}
                <div className="shrink-0 border-t border-[#e7c66b]/15 px-3 py-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#e7c66b]/80 transition hover:bg-red-500/15 hover:text-red-300"
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;