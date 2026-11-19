import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#0f0500] text-[#e7c652]/80 border-t border-[#e7c652]/20">

            {/* Top CTA Bar */}
            {/* <div className="bg-[#8B0000] py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[#e7c652] font-bold text-base tracking-wide">
                        🪔 Offer Your Seva
                    </span>
                    <Link
                        to="/donate"
                        className="flex items-center gap-2 bg-[#e7c652] text-[#8B0000] font-bold px-6 py-2.5 rounded-full hover:bg-yellow-400 transition shadow-md"
                    >
                        ♥ Donate Now
                    </Link>
                
                    <div className="hidden sm:flex items-center gap-3 text-[#e7c652]/60 text-xl">
                        <span>❀</span>
                        <span>🪷</span>
                        <span>❀</span>
                    </div>
      
                    <div className="flex items-center gap-4">
                        {[
                            { icon: "▶", label: "YouTube", href: "#" },
                            { icon: "f", label: "Facebook", href: "#" },
                            { icon: "📷", label: "Instagram", href: "#" },
                            { icon: "𝕏", label: "Twitter/X", href: "#" },
                        ].map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="w-9 h-9 rounded-full border border-[#e7c652]/40 flex items-center justify-center text-[#e7c652] hover:bg-[#e7c652] hover:text-[#8B0000] transition text-sm font-bold"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                    <span className="text-[#e7c652] font-bold text-sm text-right hidden lg:block">
                        Gupt Upasana<br />
                        <span className="font-normal text-xs text-[#e7c652]/60">Together in Devotion</span>
                    </span>
                </div>
            </div> */}

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full border-2 border-[#e7c652]/60 flex items-center justify-center bg-[#e7c652]/5">
                            <span className="text-lg">🕉️</span>
                        </div>
                        <div>
                            <p className="text-[#e7c652] font-bold leading-tight">Gupt Upasana</p>
                            <p className="text-[#e7c652]/50 text-[10px] tracking-widest uppercase">Ancient Tantra Science</p>
                        </div>
                    </div>
                    <p className="text-[#e7c652]/60 text-sm leading-relaxed">
                        Immerse yourself in the sacred spiritual discipline of Mantra, Yantra, Tantra, Dhyana, Japa and Upasana.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-[#e7c652] font-bold mb-4 uppercase tracking-widest text-xs border-b border-[#e7c652]/20 pb-2">Quick Links</h4>
                    <ul className="space-y-2">
                        {["Home", "About", "Pujas", "Media", "Blog", "Contact"].map((item) => (
                            <li key={item}>
                                <Link
                                    to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                                    className="text-sm text-[#e7c652]/60 hover:text-[#e7c652] transition flex items-center gap-2"
                                >
                                    <span className="text-[#e7c652]/30 text-xs">›</span> {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Featured Pujas */}
                <div>
                    <h4 className="text-[#e7c652] font-bold mb-4 uppercase tracking-widest text-xs border-b border-[#e7c652]/20 pb-2">Featured Pujas</h4>
                    <ul className="space-y-2">
                        {["Maa Mahakali", "Mahakal Bhairav", "Maa Baglamukhi", "Durga Puja", "Nav Durga"].map((item) => (
                            <li key={item}>
                                <Link
                                    to="/pujas"
                                    className="text-sm text-[#e7c652]/60 hover:text-[#e7c652] transition flex items-center gap-2"
                                >
                                    <span className="text-[#e7c652]/30 text-xs">›</span> {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Address & Contact */}
                <div>
                    <h4 className="text-[#e7c652] font-bold mb-4 uppercase tracking-widest text-xs border-b border-[#e7c652]/20 pb-2">Our Address</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2 text-[#e7c652]/60">
                            <span className="mt-0.5">📍</span>
                            <span>BC 160, BC Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#e7c652]/60">
                            <span>✉️</span>
                            <a href="mailto:guptupasana@gmail.com" className="hover:text-[#e7c652] transition break-all">
                                guptupasana@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#e7c652]/10 py-4 px-6 text-center text-[#e7c652]/40 text-xs">
                © {new Date().getFullYear()} Gupt Upasana. All rights reserved. &nbsp;|&nbsp; The Ancient Science of Tantra for Kaliyug
            </div>
        </footer>
    );
};

export default Footer;

