import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Import local assets ───────────────────────────────────────────────────────
import carousel1 from "../assets/carousel/gupt1.jpg";
import carousel2 from "../assets/carousel/gupt2.jpg";
import carousel3 from "../assets/carousel/gupt3.jpg";
import heroBg from "../assets/homepage.jpeg";
import imgMahakali from "../assets/maakali.jpeg";
import imgBhairav from "../assets/mahadev bhairav.jpeg";
import imgBaglamukhi from "../assets/maa baglamukhi.jpeg";
import templeImg from "../assets/templephoto.jpeg";

const carouselImages = [
    { src: carousel1, alt: "Gupt Upasana Temple Darshan 1" },
    { src: carousel2, alt: "Gupt Upasana Temple Darshan 2" },
    { src: carousel3, alt: "Gupt Upasana Temple Darshan 3" },
];
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

        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#8B0000] tracking-tight">{children}</h2>
        <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-px w-10 bg-[#8B0000]/30" />
            <span className="text-[#8B0000] text-2xl">🪷</span>
            <div className="h-px w-10 bg-[#8B0000]/30" />
        </div>
    </div>
);

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Infinite auto-scroll for carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    return (
        <div className="bg-[#efe6d2]">

            {/* hero section */}
            <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0f0500]">

                {/* Background Carousel Images */}
                {carouselImages.map((item, index) => (
                    <img
                        key={index}
                        src={item.src}
                        alt={item.alt}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentSlide
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105 pointer-events-none"
                            }`}
                        loading={index === 0 ? "eager" : "lazy"}
                    />
                ))}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0500] via-[#0f0500]/55 to-[#0f0500]/70 pointer-events-none" />

                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0500]/75 via-transparent to-[#0f0500]/75 pointer-events-none" />

                {/* Golden Glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e7c652]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Subtle Om Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
                    <span className="text-[24rem] font-bold text-[#e7c652]">
                        ॐ
                    </span>
                </div>

                {/* Foreground Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 flex flex-col items-start justify-center text-left">

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#f7f1e3] tracking-wide font-serif leading-[1.2] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] max-w-4xl">
                        Gupt Upasana — The Ancient Science of Tantra for Kaliyug
                    </h1>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-start gap-5 mt-10">

                        {/* Plan Your Visit */}
                        <Link
                            to="/contact"
                            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full overflow-hidden border border-[#e7c652]/70 bg-[#4a0a0d]/70 text-[#f7f1e3] font-bold text-sm sm:text-base tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 hover:border-[#e7c652] hover:shadow-[0_0_25px_rgba(231,198,82,0.3)] hover:-translate-y-1"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-[#e7c652]/0 via-[#e7c652]/15 to-[#e7c652]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            {/* <span className="relative text-xl">🛕</span> */}
                            <span className="relative">Plan Your Visit</span>
                            <span className="relative text-[#e7c652] transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>

                        {/* Donate */}
                        <Link
                            to="/donate"
                            className="group relative inline-flex items-center justify-center gap-3 px-9 sm:px-11 py-4 rounded-full overflow-hidden bg-gradient-to-r from-[#e7c652] via-[#f7e4a0] to-[#e7c652] text-[#4a0a0d] font-black text-sm sm:text-base tracking-wide border border-[#f7e4a0] shadow-[0_8px_30px_rgba(231,198,82,0.25)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(231,198,82,0.5)] hover:-translate-y-1 hover:scale-105"
                        >
                            <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            {/* <span className="relative text-xl">🪔</span> */}
                            <span className="relative">Donate Now</span>
                            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>

                    </div>
                </div>

                {/* Previous Slide Button */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous temple image"
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-[#e7c652]/50 hover:border-[#e7c652] text-[#e7c652] flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg hover:scale-110 active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Next Slide Button */}
                <button
                    onClick={nextSlide}
                    aria-label="Next temple image"
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 border border-[#e7c652]/50 hover:border-[#e7c652] text-[#e7c652] flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Carousel Dot Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                    {carouselImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`transition-all duration-300 rounded-full ${idx === currentSlide
                                ? "w-8 h-2.5 bg-[#e7c652] shadow-md shadow-[#e7c652]/50"
                                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/75"
                                }`}
                        />
                    ))}
                </div>

            </section>

            {/* about section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <SectionHeading>A Rare Convergence of Divine Powers in One Temple</SectionHeading>

                <div className="flex flex-col gap-10">

                    {/* Puja 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 ">
                        <div className="w-full md:w-2/5 h-96 md:h-[600px] overflow-hidden shrink-0 mx-20 rounded-2xl">
                            <img
                                src={templeImg}
                                alt="Puja"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-[#8B0000] font-bold text-2xl mb-4">
                                Gupt Upasana Mahakal–Mahakali Mandir
                            </h3>
                            <p className="text-gray-800 leading-8 mb-6">
                                India is home to countless Shakti Peethas, Shiva temples, Hanuman shrines and centres dedicated to the Mahavidyas. Yet the presence of Dashamukhi Mahakali, Ekadashamukhi Hanuman, a ritual-consecrated Ashtadhatu Maa Baglamukhi, the Ashta Bhairavas and the fierce form of Maa Pratyangira within one sacred complex represents an exceptionally uncommon spiritual configuration.

                                Located in Salt Lake, Kolkata, Gupt Upasana Mahakal–Mahakali Mandir, established in 1998, is not merely a place where several deities have been installed. It is envisioned as an integrated field of Shakta, Shaiva, Bhairava and Hanuman worship.

                                The temple brings together diverse streams of sacred worship within a single spiritual environment, reflecting the interconnected nature of Shakti, Shiva, Bhairava and Hanuman upasana.
                            </p>
                            {/* <Link
                                to="/puja"
                                className="inline-flex items-center gap-2 text-[#8B0000] font-semibold text-sm px-5 py-2.5 border border-[#8B0000] rounded-full transition-all duration-300 hover:bg-[#8B0000] hover:text-white hover:shadow-md"
                            >
                                Know More →
                            </Link> */}
                        </div>
                    </div>

                </div>
            </section>

            {/* donate section */}

            {/* ═══════════════════════════════════════════════════════
    DONATION INVITATION SECTION
═══════════════════════════════════════════════════════ */}
            <section className="px-6 py-16 md:py-24 bg-[#f7f1e3]">

                <div className="max-w-7xl mx-auto">

                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4a0a0d] via-[#650b10] to-[#8B0000] shadow-2xl">

                        {/* Decorative Background */}
                        {/* <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
                            <span className="text-[22rem] font-black text-[#e7c652]">ॐ</span>
                        </div> */}

                        {/* <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-[#e7c652]/10" />
                        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full border border-[#e7c652]/10" /> */}

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10 p-7 sm:p-10 lg:p-14">

                            {/* Left Image */}
                            <div className="relative group">
                                <div className="absolute -inset-2 border border-[#e7c652]/40 rounded-2xl transition-transform duration-500 group-hover:rotate-1" />

                                <img
                                    src={templeImg}
                                    alt="Gupt Upasana Temple"
                                    className="relative w-full h-72 sm:h-96 object-cover object-top rounded-xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                                />

                                {/* Image Label */}
                                {/* <div className="absolute bottom-4 left-4 right-4 bg-[#4a0a0d]/80 backdrop-blur-md border border-[#e7c652]/30 rounded-xl px-5 py-3">
                                    <p className="text-[#e7c652] text-xs tracking-[3px] font-semibold uppercase">
                                        Gupt Upasana
                                    </p>
                                    <p className="text-[#f7f1e3] font-serif text-lg mt-1">
                                        A Sacred Offering of Devotion
                                    </p>
                                </div> */}
                            </div>

                            {/* Right Content */}
                            <div className="text-center md:text-left">

                                <span className="inline-block text-[#e7c652] text-xs sm:text-sm font-bold tracking-[3px] uppercase border border-[#e7c652]/40 rounded-full px-5 py-2 mb-6">
                                    Support Gupt Upasana
                                </span>

                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-[#f7f1e3] leading-tight mb-6">
                                    Your Seva, <br />
                                    <span className="text-[#e7c652]">
                                        A Sacred Contribution
                                    </span>
                                </h2>

                                <p className="text-[#f7f1e3]/80 text-sm sm:text-base leading-8 mb-5">
                                    Every offering is an expression of faith and devotion.
                                    Your contribution helps support the daily activities,
                                    spiritual practices and maintenance of Gupt Upasana Temple.
                                </p>

                                <p className="text-[#f7f1e3]/70 text-sm leading-7 mb-8">
                                    Come forward and be a part of our spiritual journey.
                                    Offer your seva with श्रद्धा and devotion.
                                </p>

                                {/* Donation Button */}
                                <Link
                                    to="/donate"
                                    className="group relative inline-flex items-center justify-center gap-3 px-9 sm:px-11 py-4 rounded-full overflow-hidden bg-gradient-to-r from-[#e7c652] via-[#f7e4a0] to-[#e7c652] text-[#4a0a0d] font-black text-sm sm:text-base tracking-wide border border-[#f7e4a0] shadow-[0_8px_30px_rgba(231,198,82,0.25)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(231,198,82,0.45)] hover:-translate-y-1 hover:scale-105"
                                >
                                    <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    <span className="relative">Offer Your Seva</span>
                                    <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>

                                <p className="text-[#f7f1e3]/50 text-xs mt-5 tracking-wide">
                                    Every contribution is voluntary and deeply appreciated.
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 pb-20 px-6 max-w-7xl mx-auto mt-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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


        </div>
    );
};

export default HomePage;
