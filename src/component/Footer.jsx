
import { Link } from "react-router-dom";
import {
    MapPin,
    Mail,
    ArrowUpRight,
    Heart,
    Instagram,
    Facebook,
    Youtube,
} from "lucide-react";

const Footer = () => {
    const quickLinks = [
        { label: "Home", to: "/" },
        { label: "About Us", to: "/about" },
        { label: "Pujas", to: "/pujas" },
        { label: "Media", to: "/media" },
        { label: "Blog", to: "/blog" },
        { label: "Contact", to: "/contact" },
    ];

    return (
        <footer className="relative overflow-hidden bg-[#2d080b] text-[#f7f1e3]">

            {/* Decorative Background */}
            <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#e7c66b]/5 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#e7c66b]/5 blur-3xl" />

            {/* Top Decorative Line */}
            <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#e7c66b] to-transparent" />

            {/* Main Footer */}
            <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14 sm:px-8 lg:pt-16">

                {/* Brand + CTA */}
                <div className="mb-12 flex flex-col items-center justify-between gap-7 border-b border-[#e7c66b]/15 pb-10 text-center md:flex-row md:text-left">

                    <div className="flex flex-col items-center gap-4 sm:flex-row md:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#e7c66b]/50 bg-[#e7c66b]/10 p-2 shadow-lg shadow-black/20">
                            <img
                                src="/logo.png"
                                alt="Gupt Upasana Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black tracking-wide text-[#e7c66b]">
                                Gupt Upasana
                            </h2>
                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f7f1e3]/50">
                                Ancient Tantra Science
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <div className="text-center sm:text-right">
                            <p className="text-sm font-semibold text-[#e7c66b]">
                                Walk the path of devotion
                            </p>
                            <p className="mt-1 text-xs text-[#f7f1e3]/50">
                                Every offering begins with faith.
                            </p>
                        </div>

                        <Link
                            to="/donate"
                            className="group inline-flex items-center gap-2 rounded-full bg-[#e7c66b] px-7 py-3 text-sm font-extrabold text-[#4a0a0d] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#f3d98c]"
                        >
                            <Heart size={16} />
                            Offer Your Seva
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </Link>
                    </div>
                </div>

                {/* Footer Columns */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">

                    {/* About Brand */}
                    <div>
                        <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e7c66b]">
                            About Gupt Upasana
                        </h3>

                        <p className="max-w-sm text-sm leading-7 text-[#f7f1e3]/65">
                            Immerse yourself in the sacred spiritual discipline
                            of Mantra, Yantra, Tantra, Dhyana, Japa and Upasana.
                            Discover the path of devotion, spirituality and
                            ancient wisdom with Gupt Upasana.
                        </p>

                        {/* Social Links */}
                        <div className="mt-7 flex items-center gap-3">
                            {[
                                { label: "Instagram", icon: Instagram, href: "#" },
                                { label: "Facebook", icon: Facebook, href: "#" },
                                { label: "YouTube", icon: Youtube, href: "#" },
                            ].map(({ label, icon: Icon, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7c66b]/25 bg-white/[0.03] text-[#e7c66b] transition-all duration-300 hover:-translate-y-1 hover:border-[#e7c66b] hover:bg-[#e7c66b] hover:text-[#4a0a0d]"
                                >
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e7c66b]">
                            Explore
                        </h3>

                        <ul className="grid grid-cols-2 gap-x-4 gap-y-4">
                            {quickLinks.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        to={item.to}
                                        className="group inline-flex items-center gap-2 text-sm text-[#f7f1e3]/65 transition-colors duration-300 hover:text-[#e7c66b]"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#e7c66b]/40 transition-all group-hover:bg-[#e7c66b] group-hover:scale-125" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e7c66b]">
                            Get In Touch
                        </h3>

                        <div className="space-y-5">

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7c66b]/20 bg-[#e7c66b]/10 text-[#e7c66b]">
                                    <MapPin size={18} />
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-bold text-[#e7c66b]">
                                        Our Address
                                    </p>
                                    <p className="text-sm leading-6 text-[#f7f1e3]/65">
                                        BC 160, BC Block, Sector 1,
                                        Bidhannagar, Kolkata,
                                        West Bengal 700064
                                    </p>
                                </div>
                            </div>


                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7c66b]/20 bg-[#e7c66b]/10 text-[#e7c66b]">
                                    <Mail size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="mb-1 text-xs font-bold text-[#e7c66b]">
                                        Contact Number
                                    </p>
                                    <a
                                        href="mailto:guptupasana@gmail.com"
                                        className="break-all text-sm text-[#f7f1e3]/65 transition-colors hover:text-[#e7c66b]"
                                    >
                                        guptupasana@gmail.com
                                    </a>
                                </div>
                            </div>


                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7c66b]/20 bg-[#e7c66b]/10 text-[#e7c66b]">
                                    <Mail size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="mb-1 text-xs font-bold text-[#e7c66b]">
                                        Email Us
                                    </p>
                                    <a
                                        href="mailto:guptupasana@gmail.com"
                                        className="break-all text-sm text-[#f7f1e3]/65 transition-colors hover:text-[#e7c66b]"
                                    >
                                        guptupasana@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-14 border-t border-[#e7c66b]/15 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

                        <p className="text-xs text-[#f7f1e3]/45">
                            © {new Date().getFullYear()}{" "}
                            <span className="font-bold text-[#e7c66b]">
                                Gupt Upasana
                            </span>
                            . All rights reserved.
                        </p>

                        <p className="text-[11px] font-medium tracking-wide text-[#f7f1e3]/40">
                            The Ancient Science of Tantra for Kaliyug
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
