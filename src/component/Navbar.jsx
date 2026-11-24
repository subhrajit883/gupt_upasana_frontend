import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PujaNotificationBell from "./PujaNotificationBell";

const UserIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const navLinks = [
    { label: "Home", path: "/" },
    // { label: "About", path: "/about" },
    // {
    //     label: "Pujas",
    //     path: "/pujas",
    //     dropdown: [
    //         { label: "Maa Mahakali", path: "/pujas/mahakali" },
    //         { label: "Mahakal Bhairav", path: "/pujas/bhairav" },
    //         { label: "Maa Baglamukhi", path: "/pujas/baglamukhi" },
    //     ],
    // },
    // { label: "Media", path: "/media" },
    // { label: "Contact", path: "/contact" },
];

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isLoggedIn, user, logout } = useAuth();

    const handleLogout = () => {
        setUserMenuOpen(false);
        setMenuOpen(false);
        localStorage.removeItem("gupt upasana");
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-[#6b0000] border-b border-[#e7c652]/20 sticky top-0 z-50 shadow-lg shadow-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#e7c652] flex items-center justify-center bg-[#e7c652]/10 group-hover:bg-[#e7c652]/20 transition">
                            <img src="/logo.png" alt="logo" className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[#e7c652] font-bold text-base md:text-lg leading-tight tracking-wide">
                                Gupt Upasana
                            </p>

                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navLinks.map((link) =>
                            link.dropdown ? (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onMouseLeave={() => setDropdownOpen(false)}
                                >
                                    <button className="flex items-center gap-1 px-3 py-2 rounded-md text-[#e7c652]/80 hover:text-[#e7c652] hover:bg-[#e7c652]/10 transition text-sm font-medium">
                                        {link.label}
                                        <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 bg-[#1a0a00] border border-[#e7c652]/20 rounded-lg shadow-xl shadow-black/50 overflow-hidden min-w-[180px] z-50">
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    to={item.path}
                                                    className="block px-4 py-2.5 text-sm text-[#e7c652]/80 hover:text-[#e7c652] hover:bg-[#e7c652]/10 transition border-b border-[#e7c652]/10 last:border-0"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.label}
                                    to={link.path}
                                    className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-md
    ${location.pathname === link.path
                                            ? "text-[#e7c652] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-[2px] after:bg-[#e7c652]"
                                            : "text-[#e7c652]/75 hover:text-[#e7c652] hover:bg-[#e7c652]/10"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        )}

                        <Link
                            to="/donate"
                            className="ml-4 flex items-center gap-2 bg-[#e7c652] text-[#8B0000] font-bold px-5 py-2 rounded-full hover:bg-yellow-400 transition shadow-md shadow-[#e7c652]/20 text-sm"
                        >
                            Donate
                        </Link>

                        {/* Puja Notification Bell */}
                        <div className="ml-2">
                            <PujaNotificationBell />
                        </div>

                        {isLoggedIn ? (
                            <div
                                className="relative ml-2"
                                onMouseEnter={() => setUserMenuOpen(true)}
                                onMouseLeave={() => setUserMenuOpen(false)}
                            >
                                <button
                                    type="button"
                                    className="flex items-center gap-2 bg-[#e7c652]/10 border border-[#e7c652]/30 rounded-full pl-1.5 pr-4 py-1.5 hover:bg-[#e7c652]/20 transition"
                                >
                                    <span className="w-7 h-7 rounded-full bg-[#e7c652] text-[#6b0000] flex items-center justify-center">
                                        <UserIcon className="w-4 h-4" />
                                    </span>
                                    <span className="text-[#e7c652] font-semibold text-sm max-w-[140px] truncate">
                                        {user?.name || "User"}
                                    </span>
                                    <svg className={`w-3 h-3 text-[#e7c652]/70 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full pt-2 w-52 z-50">
                                        <div className="bg-[#1a0a00] border border-[#e7c652]/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden py-1">
                                            <Link
                                                to="/my-profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e7c652]/80 hover:text-[#e7c652] hover:bg-[#e7c652]/10 transition"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                View Profile
                                            </Link>
                                            <Link
                                                to="/my-donations"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e7c652]/80 hover:text-[#e7c652] hover:bg-[#e7c652]/10 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                My Donations
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition border-t border-[#e7c652]/10"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="ml-2 px-5 py-2 rounded-full border border-[#e7c652]/40 text-[#e7c652] hover:bg-[#e7c652]/10 font-bold text-sm transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Notification Bell & Hamburger */}
                    <div className="flex items-center gap-2 md:hidden">
                        <PujaNotificationBell />
                        <button
                            className="text-[#e7c652] p-2 rounded-md hover:bg-[#e7c652]/10 transition"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-[#e7c652]/20 bg-[#1a0a00] px-4 py-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-300
    ${location.pathname === link.path
                                    ? "text-[#e7c652] border-l-[3px] border-[#e7c652] bg-[#e7c652]/10"
                                    : "text-[#e7c652]/75 hover:text-[#e7c652] hover:bg-[#e7c652]/10"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/donate"
                        onClick={() => setMenuOpen(false)}
                        className="block mt-2 text-center bg-[#e7c652] text-[#8B0000] font-bold px-4 py-2.5 rounded-full hover:bg-yellow-400 transition text-sm"
                    >
                        Donate
                    </Link>

                    {isLoggedIn ? (
                        <div className="mt-2 flex items-center gap-2 px-3 py-2.5 text-[#e7c652] font-semibold text-sm">
                            <span className="w-7 h-7 rounded-full bg-[#e7c652] text-[#6b0000] flex items-center justify-center">
                                <UserIcon className="w-4 h-4" />
                            </span>
                            <span className="max-w-[180px] truncate">{user?.name || "User"}</span>
                        </div>
                    ) : (
                        <Link
                            to="/auth"
                            onClick={() => setMenuOpen(false)}
                            className="block mt-2 text-center border border-[#e7c652]/40 text-[#e7c652] font-bold px-4 py-2.5 rounded-full hover:bg-[#e7c652]/10 transition text-sm"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

