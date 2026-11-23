import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { authUrl } from "../config/config";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");
        try {
            const res = await axios.post(authUrl.forgotPassword, { email });
            setStatus("success");
            setMessage(
                res.data?.message ||
                "A password reset link has been sent to your email. Please check your inbox."
            );
        } catch (err) {
            setStatus("error");
            setMessage(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-[#8B0000]/10 border border-[#8B0000]/10 overflow-hidden">

                    {/* Top accent bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

                    <div className="p-8 md:p-10">

                        {/* Icon & heading */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B0000]/8 mb-4">
                                <svg className="w-8 h-8 text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 11h4m-2-2v4" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-black text-[#5a0000] mb-1">Forgot Password?</h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Enter your registered email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Success state */}
                        {status === "success" ? (
                            <div className="text-center space-y-5">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 mb-1">Email Sent!</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-left">
                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">📋 Next Steps</p>
                                    <ul className="text-sm text-amber-800 space-y-1.5">
                                        <li className="flex items-start gap-2"><span>1.</span> Check your inbox for a reset email</li>
                                        <li className="flex items-start gap-2"><span>2.</span> Click the link in the email</li>
                                        <li className="flex items-start gap-2"><span>3.</span> Create a new secure password</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => { setStatus("idle"); setEmail(""); setMessage(""); }}
                                    className="text-[#8B0000] text-sm font-semibold hover:underline"
                                >
                                    ← Try a different email
                                </button>
                            </div>
                        ) : (
                            /* Form */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-[#8B0000]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            autoComplete="email"
                                            className="w-full pl-11 pr-4 py-3.5 bg-[#FBF3E0] border border-[#e9d9a8] rounded-2xl text-[#4a2c1a] placeholder-[#9c8a6a] outline-none transition-all focus:bg-white focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/15 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Error message */}
                                {status === "error" && (
                                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                                        <p className="text-red-600 text-sm">{message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full py-4 cursor-pointer rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-[#FFD700] hover:from-[#6b0000] hover:to-[#4a0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#8B0000]/25 flex items-center justify-center gap-2"
                                >
                                    {status === "loading" ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Sending Reset Link…
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Back to login */}
                        <p className="text-center mt-6 text-sm text-gray-500">
                            Remember your password?{" "}
                            <Link to="/auth" className="text-[#8B0000] font-bold hover:underline">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Branding */}
                <p className="text-center mt-5 text-xs text-gray-400">
                    Gupt Upasana · The Ancient Science of Tantra for Kaliyug
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
