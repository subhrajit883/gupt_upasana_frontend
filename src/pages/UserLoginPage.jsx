import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ── Tab: Login ────────────────────────────────────────────────────────────────
const LoginForm = ({ onSuccess }) => {
    const { login, loading } = useAuth();
    const [form, setForm] = useState({ identifier: "", password: "" });
    const [err, setErr] = useState("");

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        const result = await login(form.identifier, form.password);
        if (result.success) {
            toast.success(`Welcome back, ${result.user.name}! 🙏`);
            onSuccess();
        } else {
            setErr(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Phone / Email
                </label>
                <input
                    name="identifier"
                    type="text"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder="Enter your phone or email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#8B0000] rounded-xl text-gray-800 outline-none transition-colors text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Password
                </label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#8B0000] rounded-xl text-gray-800 outline-none transition-colors text-sm"
                />
            </div>
            {err && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{err}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/20"
            >
                {loading ? "Signing In…" : "🙏 Sign In"}
            </button>
        </form>
    );
};

// ── Tab: Register ─────────────────────────────────────────────────────────────
const RegisterForm = ({ onSuccess }) => {
    const { register: registerUser, loading } = useAuth();
    const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", address: "" });
    const [err, setErr] = useState("");

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        if (form.password.length < 6) { setErr("Password must be at least 6 characters"); return; }
        const result = await registerUser(form);
        if (result.success) {
            toast.success(`Welcome, ${result.user.name}! 🙏`);
            onSuccess();
        } else {
            setErr(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Your full name", required: true },
                { label: "Phone Number", name: "phone", type: "tel", placeholder: "10-digit mobile number", required: true },
                { label: "Email (optional)", name: "email", type: "email", placeholder: "your@email.com", required: false },
                { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters", required: true },
                { label: "Address (optional)", name: "address", type: "text", placeholder: "Your address", required: false },
            ].map((field) => (
                <div key={field.name}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        {field.label}
                    </label>
                    <input
                        name={field.name}
                        type={field.type}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#8B0000] rounded-xl text-gray-800 outline-none transition-colors text-sm"
                    />
                </div>
            ))}
            {err && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{err}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/20"
            >
                {loading ? "Creating Account…" : "🪔 Create Account"}
            </button>
        </form>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const UserLoginPage = () => {
    const [tab, setTab] = useState("login");
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    // Where to redirect after login — default to /donate
    const from = location.state?.from || "/donate";

    if (isLoggedIn) {
        navigate(from, { replace: true });
        return null;
    }

    const handleSuccess = () => navigate(from, { replace: true });

    return (
        <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <span className="text-5xl mb-3 block">🪔</span>
                    <h1 className="text-2xl font-black text-[#8B0000]">Gupt Upasana</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to offer your seva</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-[#8B0000]/10 shadow-xl shadow-[#8B0000]/5 overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {[
                            { key: "login", label: "Sign In" },
                            { key: "register", label: "Register" },
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex-1 py-3.5 text-sm font-bold tracking-wide transition-colors ${tab === t.key
                                    ? "text-[#8B0000] border-b-2 border-[#8B0000] bg-[#8B0000]/3"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-7">
                        {tab === "login"
                            ? <LoginForm onSuccess={handleSuccess} />
                            : <RegisterForm onSuccess={handleSuccess} />
                        }
                    </div>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <button onClick={() => navigate(-1)} className="text-gray-400 text-sm hover:text-[#8B0000] transition-colors">
                        ← Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;
