
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ================= FIELD ICONS =================

const FieldIcon = ({ name }) => {
    const common = "w-5 h-5 text-[#8B0000]/60";

    switch (name) {
        case "name":
            return (
                <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );

        case "email":
            return (
                <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );

        case "address":
            return (
                <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            );

        case "phone":
            return (
                <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11 11 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            );

        case "password":
            return (
                <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            );

        case "type":
            return (
                <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );

        default:
            return null;
    }
};

// ================= INPUT STYLING =================

const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-[#FBF3E0] border border-[#e9d9a8] rounded-2xl text-[#4a2c1a] placeholder-[#9c8a6a] outline-none transition-all focus:bg-[#FFF8EA] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/15";

// ================= PASSWORD VISIBILITY ICON =================

const EyeIcon = ({ visible }) => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        {visible ? (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A9.8 9.8 0 0112 5c6 0 9.5 7 9.5 7a15.8 15.8 0 01-3.1 3.8M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 7 9.5 7c1.1 0 2.1-.2 3-.6" />
            </>
        )}
    </svg>
);

// ================= REGISTER FORM =================

const RegisterForm = ({ onSuccess }) => {
    const { register: registerUser, loading } = useAuth();
    const [form, setForm] = useState({
        name: "", email: "", address: "", phone: "", password: "",
        confirmPassword: "", type: "individual",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [err, setErr] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        if (form.phone.length !== 10) {
            setErr("Please enter a valid 10-digit mobile number.");
            return;
        }
        if (form.password.length < 6) {
            setErr("Password must be at least 6 characters.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setErr("Password and confirm password do not match.");
            return;
        }
        const { confirmPassword, ...registrationData } = form;
        const result = await registerUser(registrationData);
        if (result.success) {
            toast.success(`Welcome, ${result.user.name}! 🙏`);
            onSuccess();
        } else {
            setErr(result.message || "Unable to create your account.");
        }
    };

    const passwordClass = `${inputClass} pr-12`;
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="name" /></div>
                <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" required autoComplete="name" className={inputClass} />
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="email" /></div>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="enter your email" required autoComplete="email" className={inputClass} />
            </div>
            <div className="relative">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none"><FieldIcon name="address" /></div>
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Enter your complete address" required rows={4} autoComplete="street-address" className={`${inputClass} min-h-28 resize-y`} />
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="phone" /></div>
                <input name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" required autoComplete="tel" className={inputClass} />
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="password" /></div>
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Password (minimum 6 characters)" required minLength={6} autoComplete="new-password" className={passwordClass} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 px-4 flex items-center text-[#8B0000]/70 hover:text-[#8B0000]"><EyeIcon visible={showPassword} /></button>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="password" /></div>
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" required minLength={6} autoComplete="new-password" className={passwordClass} />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} aria-pressed={showConfirmPassword} className="absolute inset-y-0 right-0 px-4 flex items-center text-[#8B0000]/70 hover:text-[#8B0000]"><EyeIcon visible={showConfirmPassword} /></button>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="type" /></div>
                <select name="type" value={form.type} onChange={handleChange} className={`${inputClass} appearance-none pr-10`}>
                    <option value="organisation">Organisation</option>
                    <option value="individual">Individual</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#8B0000]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
            {err && <p role="alert" className="cursor-pointer text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{err}</p>}
            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/25">
                {loading ? "Creating Account…" : "Register Now"}
            </button>
        </form>
    );
};

// ================= LOGIN FORM =================

const LoginForm = ({ onSuccess }) => {
    const { login, loading } = useAuth();
    const [form, setForm] = useState({ identifier: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
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
            setErr(result.message || "Unable to sign in.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="email" /></div>
                <input name="identifier" type="text" value={form.identifier} onChange={handleChange} placeholder="Email or Phone" required autoComplete="username" className={inputClass} />
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><FieldIcon name="password" /></div>
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Password" required autoComplete="current-password" className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 px-4 flex items-center text-[#8B0000]/70 hover:text-[#8B0000]"><EyeIcon visible={showPassword} /></button>
            </div>
            {err && <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{err}</p>}
            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/25">
                {loading ? "Signing In…" : "Login"}
            </button>
        </form>
    );
};

// ================= AUTH PAGE =================

const AuthPage = () => {
    const [tab, setTab] = useState("register");

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const from = "/donate";

    useEffect(() => {
        if (isLoggedIn) {
            navigate(from, { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (isLoggedIn) return null;

    const handleSuccess = () => {
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#f5eee2] flex items-center justify-center px-4 py-12">

            <div className="w-full max-w-xl">

                <div className="bg-[#f5eee2] rounded-3xl shadow-2xl shadow-[#8B0000]/15 border border-[#e9d9a8] overflow-hidden">

                    {/* Tabs */}

                    <div className="flex border-b border-[#e9d9a8]">

                        {[
                            { key: "register", label: "Register" },
                            { key: "login", label: "Login" },
                        ].map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setTab(t.key)}
                                className={`flex-1 py-5 text-xl font-bold tracking-wide transition-all ${
                                    tab === t.key
                                        ? "text-[#8B0000] border-b-4 border-[#8B0000] bg-[#8B0000]/5"
                                        : "text-[#9c8a6a] hover:text-[#6b5a3a]"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}

                    </div>

                    {/* Form */}

                    <div className="p-7 sm:p-9">

                        {tab === "register" ? (
                            <RegisterForm onSuccess={handleSuccess} />
                        ) : (
                            <LoginForm onSuccess={handleSuccess} />
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AuthPage;
