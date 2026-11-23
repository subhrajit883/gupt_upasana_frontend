import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    MessageCircle,
    X,
    RotateCcw,
    ChevronRight,
    Sparkles,
    Send,
    ExternalLink,
    Volume2,
} from "lucide-react";
import { chatbotConfig } from "../data/data";

const ChatBot = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial notification popover when user visits
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasInteracted) {
                setShowNotification(true);
            }
        }, 1200);

        return () => clearTimeout(timer);
    }, [hasInteracted]);

    // Initial greeting message when opened
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: "welcome-1",
                    sender: "bot",
                    title: chatbotConfig.greeting.title,
                    text: chatbotConfig.greeting.text,
                    prompt: chatbotConfig.greeting.prompt,
                    showOptions: true,
                    timestamp: new Date(),
                },
            ]);
        }
    }, [messages.length]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping, isOpen]);

    const handleOpenChat = () => {
        setIsOpen(true);
        setShowNotification(false);
        setHasInteracted(true);
    };

    const handleCloseChat = () => {
        setIsOpen(false);
    };

    const handleDismissNotification = (e) => {
        e.stopPropagation();
        setShowNotification(false);
        setHasInteracted(true);
    };

    const handleSelectOption = (option) => {
        // User message
        const userMsg = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: option.label,
            icon: option.icon,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        // Simulate thinking for authentic conversational feel
        setTimeout(() => {
            const botMsg = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: option.response,
                actionType: option.actionType,
                actionUrl: option.actionUrl,
                actionButtonText: option.actionButtonText,
                showOptions: false,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 500);
    };

    const handleReset = () => {
        setMessages([
            {
                id: `welcome-${Date.now()}`,
                sender: "bot",
                title: chatbotConfig.greeting.title,
                text: chatbotConfig.greeting.text,
                prompt: chatbotConfig.greeting.prompt,
                showOptions: true,
                timestamp: new Date(),
            },
        ]);
        setIsTyping(false);
    };

    const handleNavigate = (url) => {
        if (url) {
            navigate(url);
            // Optionally close on navigation on small screens
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        }
    };

    return (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 font-sans">
            {/* ═══════════════════════════════════════════════════════════════
                1. NOTIFICATION POPUP BADGE (Appears on first entrance)
            ═══════════════════════════════════════════════════════════════ */}
            {!isOpen && showNotification && (
                <div
                    onClick={handleOpenChat}
                    className="absolute bottom-20 right-0 w-80 sm:w-88 bg-gradient-to-br from-[#4a0a0d] via-[#661016] to-[#3a0609] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#e7c66b]/40 cursor-pointer animate-bounce-slight transition-all duration-300 hover:scale-[1.02] group"
                    style={{
                        animation: "chatNotificationFade 0.4s ease-out forwards",
                    }}
                >
                    {/* Speech bubble arrow pointer */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#661016] border-r-2 border-b-2 border-[#e7c66b]/40 transform rotate-45" />

                    <div className="flex items-start gap-3">
                        {/* Logo Thumbnail with gold ring */}
                        <div className="relative shrink-0">
                            <img
                                src={chatbotConfig.logoPath}
                                alt="Gupt Upasana"
                                className="w-11 h-11 rounded-full object-cover border-2 border-[#e7c66b] shadow-md bg-white/10"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#4a0a0d] rounded-full animate-pulse" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[#e7c66b] text-xs font-bold uppercase tracking-wider">
                                    {chatbotConfig.notification.title}
                                </span>
                            </div>
                            <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
                                {chatbotConfig.notification.message}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-[#e7c66b] font-semibold text-xs group-hover:translate-x-1 transition-transform">
                                <span>{chatbotConfig.notification.actionText}</span>
                                <ChevronRight size={14} />
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleDismissNotification}
                            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition shrink-0"
                            title="Dismiss"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                2. FLOATING CTA BUTTON (Always visible at bottom-right)
            ═══════════════════════════════════════════════════════════════ */}
            {!isOpen && (
                <button
                    onClick={handleOpenChat}
                    aria-label="Open Divine Assistant Chat"
                    className="group relative flex items-center justify-center w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#4a0a0d] via-[#7a1217] to-[#3a0609] border-2 border-[#e7c66b] shadow-2xl shadow-black/40 hover:scale-108 transition-all duration-300 active:scale-95 focus:outline-none"
                >
                    {/* Pulsing halo aura */}
                    <span className="absolute inset-0 rounded-full border-2 border-[#e7c66b] animate-ping opacity-25 pointer-events-none" />

                    {/* Logo Image */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                            src={chatbotConfig.logoPath}
                            alt="Gupt Upasana Bot"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>

                    {/* Notification indicator ping */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e7c66b] opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#e7c66b] border-2 border-[#4a0a0d] text-[9px] font-black text-[#4a0a0d] items-center justify-center">
                            1
                        </span>
                    </span>
                </button>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                3. CHAT WINDOW (Opens on click)
            ═══════════════════════════════════════════════════════════════ */}
            {isOpen && (
                <div
                    className="w-[calc(100vw-2rem)] sm:w-[390px] h-[550px] max-h-[85vh] bg-[#FFFDF9] rounded-3xl shadow-2xl border-2 border-[#e7c66b]/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        boxShadow: "0 25px 60px -15px rgba(74, 10, 13, 0.4)",
                    }}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-[#4a0a0d] via-[#661016] to-[#4a0a0d] text-white p-4 px-5 border-b-2 border-[#e7c66b]/30 flex items-center justify-between shrink-0">
                        {/* Background subtle Om */}
                        <div className="absolute right-12 top-0 bottom-0 flex items-center opacity-5 pointer-events-none">
                            <span className="text-6xl font-bold select-none text-[#e7c66b]">ॐ</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={chatbotConfig.logoPath}
                                    alt="Gupt Upasana"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#e7c66b] shadow-md bg-white/10"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#4a0a0d] rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#e7c66b] leading-tight flex items-center gap-1.5">
                                    <span>{chatbotConfig.botName}</span>
                                    <Sparkles size={13} className="text-[#e7c66b]" />
                                </h3>
                                <p className="text-[11px] text-white/70 flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                                    <span>{chatbotConfig.botSubtitle}</span>
                                </p>
                            </div>
                        </div>

                        {/* Top controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReset}
                                title="Restart Chat"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#e7c66b] flex items-center justify-center transition"
                            >
                                <RotateCcw size={15} />
                            </button>
                            <button
                                onClick={handleCloseChat}
                                title="Close"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#FFFDF9] to-[#FBF5EA]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${
                                    msg.sender === "user" ? "items-end" : "items-start"
                                }`}
                            >
                                {msg.sender === "bot" ? (
                                    /* ── Bot Message Bubble ── */
                                    <div className="flex items-start gap-2.5 max-w-[92%]">
                                        <img
                                            src={chatbotConfig.logoPath}
                                            alt="Bot"
                                            className="w-7 h-7 rounded-full object-cover border border-[#e7c66b] shrink-0 mt-0.5"
                                        />
                                        <div className="space-y-3">
                                            <div className="bg-white border border-[#e7c66b]/30 rounded-2xl rounded-tl-sm p-4 text-[#4a0a0d] shadow-sm text-xs sm:text-[13px] leading-relaxed">
                                                {msg.title && (
                                                    <p className="font-bold text-[#7a1217] mb-1.5 text-sm flex items-center gap-1">
                                                        {msg.title}
                                                    </p>
                                                )}
                                                <div className="whitespace-pre-line text-gray-700">
                                                    {msg.text}
                                                </div>

                                                {/* Redirect CTA Button if applicable */}
                                                {msg.actionUrl && (
                                                    <div className="mt-3 pt-3 border-t border-[#e7c66b]/20">
                                                        <button
                                                            onClick={() => handleNavigate(msg.actionUrl)}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4a0a0d] to-[#7a1217] text-[#e7c66b] font-bold text-xs hover:from-[#661016] hover:to-[#4a0a0d] transition shadow-md group"
                                                        >
                                                            <span>{msg.actionButtonText || "Proceed →"}</span>
                                                            <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Options list inside greeting */}
                                            {msg.showOptions && (
                                                <div className="space-y-2 pt-1">
                                                    {msg.prompt && (
                                                        <p className="text-[11px] font-bold text-[#7a1217]/70 uppercase tracking-wider px-1">
                                                            {msg.prompt}
                                                        </p>
                                                    )}
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {chatbotConfig.options.map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => handleSelectOption(opt)}
                                                                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e7c66b]/40 hover:border-[#7a1217] hover:bg-[#FFF8EA] text-left transition-all duration-200 group shadow-2xs hover:shadow-sm"
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="text-lg">{opt.icon}</span>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-[#4a0a0d] group-hover:text-[#7a1217]">
                                                                            {opt.label}
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-500 line-clamp-1">
                                                                            {opt.summary}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight
                                                                    size={15}
                                                                    className="text-[#e7c66b] group-hover:text-[#7a1217] group-hover:translate-x-1 transition-transform"
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* ── User Message Bubble ── */
                                    <div className="bg-gradient-to-r from-[#4a0a0d] to-[#7a1217] text-[#e7c66b] rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-[13px] font-semibold shadow-md max-w-[85%] flex items-center gap-2">
                                        {msg.icon && <span>{msg.icon}</span>}
                                        <span>{msg.text}</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-xs text-[#7a1217] font-medium p-2 bg-white/60 rounded-xl w-fit">
                                <img
                                    src={chatbotConfig.logoPath}
                                    alt="Bot"
                                    className="w-5 h-5 rounded-full object-cover border border-[#e7c66b]"
                                />
                                <span className="flex gap-1 items-center">
                                    <span>Preparing divine response</span>
                                    <span className="inline-flex gap-0.5">
                                        <span className="w-1 h-1 bg-[#7a1217] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1 h-1 bg-[#7a1217] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1 h-1 bg-[#7a1217] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </span>
                                </span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Action Pill Bar at Bottom */}
                    <div className="p-3 bg-white border-t border-[#e7c66b]/30 shrink-0 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#4a0a0d] font-bold px-1">
                            <span className="flex items-center gap-1">
                                <span>🪷</span>
                                <span>Quick Questions:</span>
                            </span>
                            <button
                                onClick={handleReset}
                                className="text-gray-400 hover:text-[#7a1217] transition text-[10px] font-normal underline"
                            >
                                Reset Chat
                            </button>
                        </div>

                        {/* Quick pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {chatbotConfig.options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSelectOption(opt)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FAF5EB] hover:bg-[#e7c66b]/20 border border-[#e7c66b]/50 text-[#4a0a0d] text-[11px] font-medium whitespace-nowrap transition"
                                >
                                    <span>{opt.icon}</span>
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Footer note */}
                        <div className="text-center pt-1 border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 leading-tight">
                                {chatbotConfig.footerNote}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
