import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { authUrl } from "../config/config";

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

// Password strength checker
const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColor = ["", "bg-red-500", "bg-orange-400", "bg-yellow-500", "bg-green-500", "bg-emerald-600"];

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");
    const [fieldErr, setFieldErr] = useState("");

    // Invalid token guard
    useEffect(() => {
        if (!token) setStatus("invalid");
    }, [token]);

    const strength = getStrength(form.password);

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setFieldErr("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) { setFieldErr("Password must be at least 6 characters."); return; }
        if (form.password !== form.confirmPassword) { setFieldErr("Passwords do not match."); return; }

        setStatus("loading");
        setMessage("");
        try {
            const res = await axios.post(`${authUrl.resetPassword}`, {
                newPassword: form.password,
                token: token
            });
            setStatus("success");
            setMessage(res.data?.message || "Your password has been reset successfully!");
            // Auto redirect to login after 3s
            setTimeout(() => navigate("/auth"), 3000);
        } catch (err) {
            setStatus("error");
            setMessage(err?.response?.data?.message || "Something went wrong. The link may have expired.");
        }
    };

    const inputClass =
        "w-full pl-11 pr-12 py-3.5 bg-[#FBF3E0] border border-[#e9d9a8] rounded-2xl text-[#4a2c1a] placeholder-[#9c8a6a] outline-none transition-all focus:bg-white focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/15 text-sm";

    return (
        <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-3xl shadow-xl shadow-[#8B0000]/10 border border-[#8B0000]/10 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

                    <div className="p-8 md:p-10">

                        {/* Invalid / no token */}
                        {status === "invalid" && (
                            <div className="text-center space-y-4 py-6">
                                <div className="text-5xl">🔗</div>
                                <h2 className="text-xl font-black text-[#5a0000]">Invalid Reset Link</h2>
                                <p className="text-gray-500 text-sm">This password reset link is invalid or has expired.</p>
                                <Link to="/forgot-password" className="inline-block bg-[#8B0000] text-[#FFD700] font-bold px-6 py-3 rounded-full text-sm hover:bg-[#6b0000] transition mt-2">
                                    Request a New Link
                                </Link>
                            </div>
                        )}

                        {/* Success */}
                        {status === "success" && (
                            <div className="text-center space-y-5 py-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-black text-gray-800 text-lg mb-1">Password Reset!</p>
                                    <p className="text-gray-500 text-sm">{message}</p>
                                </div>
                                <p className="text-xs text-gray-400">Redirecting to login in 3 seconds…</p>
                                <Link to="/auth" className="inline-block bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] font-bold px-7 py-3 rounded-full text-sm hover:from-[#6b0000] hover:to-[#4a0000] transition shadow-md">
                                    Go to Login Now →
                                </Link>
                            </div>
                        )}

                        {/* Form (idle / loading / error) */}
                        {(status === "idle" || status === "loading" || status === "error") && token && (
                            <>
                                {/* Heading */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B0000]/8 mb-4">
                                        <svg className="w-8 h-8 text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-black text-[#5a0000] mb-1">Set New Password</h1>
                                    <p className="text-gray-500 text-sm">Create a strong new password for your account.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New password */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-[#8B0000]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="password"
                                                type={showPw ? "text" : "password"}
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Minimum 6 characters"
                                                required
                                                autoComplete="new-password"
                                                className={inputClass}
                                            />
                                            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute inset-y-0 right-0 px-4 flex items-center text-[#8B0000]/60 hover:text-[#8B0000]">
                                                <EyeIcon visible={showPw} />
                                            </button>
                                        </div>

                                        {/* Strength bar */}
                                        {form.password && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-gray-200"}`} />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">{strengthLabel[strength]}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm password */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-[#8B0000]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="confirmPassword"
                                                type={showCpw ? "text" : "password"}
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repeat your new password"
                                                required
                                                autoComplete="new-password"
                                                className={inputClass}
                                            />
                                            <button type="button" onClick={() => setShowCpw((v) => !v)} className="absolute inset-y-0 right-0 px-4 flex items-center text-[#8B0000]/60 hover:text-[#8B0000]">
                                                <EyeIcon visible={showCpw} />
                                            </button>
                                        </div>
                                        {/* Match indicator */}
                                        {form.confirmPassword && (
                                            <p className={`text-xs mt-1.5 font-medium ${form.password === form.confirmPassword ? "text-green-600" : "text-red-500"}`}>
                                                {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Field error */}
                                    {fieldErr && (
                                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                                            <span className="text-red-500 flex-shrink-0">⚠️</span>
                                            <p className="text-red-600 text-sm">{fieldErr}</p>
                                        </div>
                                    )}

                                    {/* API error */}
                                    {status === "error" && (
                                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                                            <span className="text-red-500 flex-shrink-0">⚠️</span>
                                            <p className="text-red-600 text-sm">{message}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/25 flex items-center justify-center gap-2"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Resetting Password…
                                            </>
                                        ) : "🔒 Reset Password"}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Back link */}
                        {status !== "success" && (
                            <p className="text-center mt-6 text-sm text-gray-500">
                                <Link to="/auth" className="text-[#8B0000] font-bold hover:underline">
                                    ← Back to Login
                                </Link>
                            </p>
                        )}
                    </div>
                </div>

                <p className="text-center mt-5 text-xs text-gray-400">
                    🕉️ Gupt Upasana · The Ancient Science of Tantra for Kaliyug
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
