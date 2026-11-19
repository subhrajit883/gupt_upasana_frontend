
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { authUrl } from "../config/config";

const inputClass =
    "w-full pl-11 pr-12 py-3.5 bg-[#FBF3E0] border border-[#e9d9a8] rounded-2xl text-[#4a2c1a] placeholder-[#9c8a6a] outline-none transition-all focus:bg-[#FFF8EA] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/15";

const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const res = await axios.post(
                authUrl.adminLogin,
                { email: form.email, password: form.password },
                { withCredentials: true }
            );

            const token = res.data.token;

            if (token) {
                localStorage.setItem("admin_gupt", token);
            }

            toast.success("Admin login successful!");
            navigate("/admin/donations", { replace: true });

        } catch (err) {
            setErr(err.response?.data?.message || "Admin login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5E6C8] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#FBF3E0] rounded-3xl shadow-2xl shadow-[#8B0000]/15 border border-[#e9d9a8] overflow-hidden">

                    <div className="px-7 pt-8 pb-6 text-center">
                        <h1 className="text-2xl font-black text-[#8B0000]">
                            Admin Login
                        </h1>
                        <p className="text-[#9c8a6a] text-sm mt-1">
                            Sign in to the admin dashboard
                        </p>
                    </div>

                    <div className="px-7 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-[#8B0000]/60"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>

                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Password with Show/Hide Button */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-[#8B0000]/60"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>

                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    className={inputClass}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8B0000]/60 hover:text-[#8B0000] transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye-off icon
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3l18 18M10.58 10.58a2 2 0 002.84 2.84M9.88 5.09A10.94 10.94 0 0112 4.75c5.23 0 9.27 3.52 10.5 7.25a11.9 11.9 0 01-4.17 5.28M6.61 6.61C4.2 7.96 2.42 9.93 1.5 12c1.23 3.73 5.27 7.25 10.5 7.25 1.1 0 2.15-.18 3.12-.51"
                                            />
                                        </svg>
                                    ) : (
                                        // Eye icon
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
                                            />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Error Message */}
                            {err && (
                                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                                    {err}
                                </p>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/25"
                            >
                                {loading ? "Signing In…" : "Admin Login"}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
