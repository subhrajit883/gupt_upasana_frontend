import { Link } from "react-router-dom";

// ── Import local assets ───────────────────────────────────────────────────────
import heroBg from "../assets/homepage.jpeg";
import imgMahakali from "../assets/maakali.jpeg";
import imgBhairav from "../assets/mahadev bhairav.jpeg";
import imgBaglamukhi from "../assets/maa baglamukhi.jpeg";

// ── Featured Pujas data ───────────────────────────────────────────────────────
const featuredPujas = [
    {
        name: "Maa Mahakali",
        desc: "Invoke the divine power of Maa Mahakali for protection and transformation.",
        img: imgMahakali,
        path: "/pujas/mahakali",
        color: "from-[#1a0a00] to-[#3d0000]",
    },
    {
        name: "Mahakal Bhairav",
        desc: "Seek the blessings of Mahakal Bhairav for peace, strength and liberation.",
        img: imgBhairav,
        path: "/pujas/bhairav",
        color: "from-[#0a0a1a] to-[#1a0a2d]",
    },
    {
        name: "Maa Baglamukhi",
        desc: "Attain victory over negativity and empowerment with Maa Baglamukhi.",
        img: imgBaglamukhi,
        path: "/pujas/baglamukhi",
        color: "from-[#1a1000] to-[#3d2d00]",
    },
];

// ── Why Gupt Upasana ──────────────────────────────────────────────────────────
const reasons = [
    { icon: "📿", text: "Ancient Tantric Wisdom" },
    { icon: "🌿", text: "Spiritual Remedies for Life's Challenges" },
    { icon: "🔱", text: "Powerful Pujas & Sadhna" },
    { icon: "🧘", text: "Guidance from Experienced Sadhaks" },
];

// ── Decorative section heading ────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
    <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#8B0000]/50" />
            <span className="text-[#8B0000] text-2xl">🪷</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#8B0000]/50" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#8B0000] tracking-tight">{children}</h2>
        <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-px w-10 bg-[#8B0000]/30" />
            <span className="text-[#8B0000]/40 text-xs tracking-[0.4em] uppercase">✦ ✦ ✦</span>
            <div className="h-px w-10 bg-[#8B0000]/30" />
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const HomePage = () => {
    return (
        <div className="bg-[#d8c88d]">

            {/* ═══════════════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">

                {/* Background image */}
                <img
                    src={heroBg}
                    alt="Gupt Upasana Hero"
                    className="absolute inset-0 w-full h-full object-cover "
                    loading="eager"

                />

                {/* Multi-layer overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0500]/62 via-[#1a0800]/55 to-[#0f0500]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0500]/60 via-transparent to-[#0f0500]/20" />

                {/* Decorative radial glow */}
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e7c652]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
                    <div className="max-w-2xl">

                        {/* Badge */}
                        {/* <div className="inline-flex items-center gap-2 bg-[#e7c652]/10 backdrop-blur-sm border border-[#e7c652]/25 rounded-full px-5 py-2 mb-7">
                            <span className="w-2 h-2 rounded-full bg-[#e7c652] animate-pulse" />
                            <span className="text-[#e7c652] text-xs tracking-[0.3em] uppercase font-semibold">
                                Sacred Ancient Wisdom
                            </span>
                        </div> */}

                        {/* Title */}
                        <h1 className="text-4xl sm:text-3xl lg:text-4xl font-black text-[#e7c652] leading-[1.05] mb-4 drop-shadow-2xl">
                            Gupt<br />Upasana
                        </h1>

                        {/* Sub-title */}
                        <p className="text-xl md:text-2xl text-[#e7c652]/80 italic font-light mb-5 leading-snug">
                            The Ancient Science of Tantra for Kaliyug
                        </p>

                        {/* Gold divider */}
                        {/* <div className="flex items-center gap-3 mb-6">
                            <div className="h-[2px] w-16 bg-gradient-to-r from-[#e7c652] to-transparent rounded-full" />
                            <span className="text-[#e7c652]/50">🪷</span>
                            <div className="h-[2px] w-8 bg-[#e7c652]/20 rounded-full" />
                        </div> */}

                        {/* Description */}
                        <p className="text-[#e7c652]/75 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                            Immerse yourself in the sacred spiritual discipline of{" "}
                            <span className="text-[#e7c652] font-semibold">
                                Mantra, Yantra, Tantra, Dhyana, Japa and Upasana.
                            </span>
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/donate"
                                className="group flex items-center gap-2 bg-[#e7c652] text-[#5a0000] font-black px-8 py-3.5 rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-xl shadow-[#e7c652]/20 text-sm tracking-wide"
                            >

                                <span>Donate</span>
                                {/* <span className="group-hover:translate-x-1 transition-transform duration-200">→</span> */}
                            </Link>
                            <Link
                                to="/about"
                                className="flex items-center gap-2 border-2 border-[#e7c652]/40 text-[#e7c652] font-semibold px-8 py-3.5 rounded-full hover:bg-[#e7c652]/10 hover:border-[#e7c652]/70 transition-all duration-300 backdrop-blur-sm text-sm"
                            >
                                Know More
                            </Link>
                        </div>

                        {/* Stats strip */}
                        <div className="mt-14 flex flex-wrap gap-6">
                            {[
                                { label: "Years of Legacy", value: "25+" },
                                { label: "Sacred Pujas", value: "50+" },
                                { label: "Devoted Sadhaks", value: "10K+" },
                            ].map((s) => (
                                <div key={s.label} className="text-center pr-6 border-r border-[#e7c652]/20 last:border-0">
                                    <p className="text-[#e7c652] text-2xl font-black">{s.value}</p>
                                    <p className="text-[#e7c652]/50 text-xs tracking-wider uppercase mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-16 md:h-20">
                        <path
                            d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 L1440,70 L0,70 Z"
                            fill="#e7c652"
                        />
                    </svg>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                FEATURED PUJAS
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <SectionHeading>Our Featured Pujas</SectionHeading>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredPujas.map((puja) => (
                        <div
                            key={puja.name}
                            className="group bg-white border border-[#8B0000]/10 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#8B0000]/15 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={puja.img}
                                    alt={puja.name}
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient overlay on image */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${puja.color} opacity-50 group-hover:opacity-30 transition-opacity duration-500`} />
                                {/* Gold shimmer line at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e7c652] to-transparent opacity-80" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-[#8B0000] font-bold text-xl mb-2 group-hover:text-[#6b0000] transition-colors">
                                    {puja.name}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-5">{puja.desc}</p>
                                <Link
                                    to={puja.path}
                                    className="inline-flex items-center gap-1.5 text-[#8B0000] font-semibold text-sm border border-[#8B0000]/30 rounded-full px-4 py-1.5 hover:bg-[#8B0000] hover:text-[#e7c652] hover:border-[#8B0000] transition-all duration-300"
                                >
                                    Know More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                INFO GRID: Why | Visitors | Address
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-6 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Why Gupt Upasana */}
                    <div className="bg-gradient-to-br from-[#8B0000] to-[#5a0000] rounded-2xl p-7 text-white shadow-lg">
                        <h3 className="font-bold text-[#e7c652] text-lg mb-5 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#e7c652]/10 flex items-center justify-center">🔱</span>
                            Why Gupt Upasana?
                        </h3>
                        <ul className="space-y-3.5">
                            {reasons.map((r) => (
                                <li key={r.text} className="flex items-center gap-3 text-sm text-white/90">
                                    <span className="w-7 h-7 rounded-full bg-[#e7c652]/10 flex items-center justify-center text-base flex-shrink-0">
                                        {r.icon}
                                    </span>
                                    <span>{r.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Visitors Guideline */}
                    <div className="bg-white border border-[#8B0000]/10 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-[#8B0000] text-lg mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center">🛕</span>
                            Visitors Guideline
                        </h3>
                        <div className="flex gap-4 items-start">
                            <span className="text-5xl opacity-15 select-none flex-shrink-0">🛕</span>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Public darshan of Mahakal and Mahakali is{" "}
                                <strong className="text-[#8B0000]">available in the open section</strong>.
                                The inner mandir is restricted for general visitors.
                            </p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white border border-[#8B0000]/10 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-[#8B0000] text-lg mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center">📍</span>
                            Our Address
                        </h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <span className="text-[#8B0000] text-base mt-0.5 flex-shrink-0">📍</span>
                                <span className="leading-relaxed">
                                    BC 160, BC Block, Sector 1,<br />
                                    Bidhannagar, Kolkata,<br />
                                    West Bengal 700064
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-[#8B0000] text-base flex-shrink-0">✉️</span>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-0.5">Email Us</p>
                                    <a
                                        href="mailto:guptupasana@gmail.com"
                                        className="text-[#8B0000] hover:underline break-all"
                                    >
                                        guptupasana@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                CALL TO ACTION BANNER
            ═══════════════════════════════════════════════════════════════ */}
            <section className="py-6 pb-20 px-6">
                <div className="max-w-4xl mx-auto relative bg-gradient-to-br from-[#8B0000] via-[#6b0000] to-[#4a0000] rounded-3xl p-12 text-center shadow-2xl overflow-hidden">
                    {/* Background Om watermark */}
                    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.04]">
                        <span className="text-[22rem] font-black text-[#e7c652] leading-none">ॐ</span>
                    </div>
                    {/* Decorative rings */}
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-full border border-[#e7c652]/10" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border border-[#e7c652]/10" />

                    <div className="relative z-10">
                        <span className="text-5xl mb-5 block">🪔</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#e7c652] mb-4 leading-tight">
                            Begin Your Spiritual Journey
                        </h2>
                        <p className="text-white/65 text-base md:text-lg leading-relaxed mb-9 max-w-xl mx-auto">
                            Take the first step towards divine connection. Explore our sacred pujas and sadhnas guided by experienced practitioners.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/pujas"
                                className="bg-[#e7c652] text-[#5a0000] font-black px-9 py-3.5 rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-lg shadow-[#e7c652]/20 text-sm tracking-wide"
                            >
                                🕉️ Explore Pujas
                            </Link>
                            <Link
                                to="/contact"
                                className="border-2 border-[#e7c652]/40 text-[#e7c652] font-semibold px-9 py-3.5 rounded-full hover:bg-[#e7c652]/10 hover:border-[#e7c652]/60 transition-all duration-300 text-sm"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
