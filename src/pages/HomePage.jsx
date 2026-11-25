import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Locate, Mail, Phone, Calendar, Clock, Sparkles, Building2, User } from "lucide-react";

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
    // { icon: "📿", text: "Ancient Tantric Wisdom" },
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
                            to="/book-visit"
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

                            {/* Heading */}
                            <div className="mb-6">
                                {/* <span className="inline-block text-[#8B0000] text-xs font-bold tracking-[0.25em] uppercase mb-3">
                                    A Sacred Spiritual Destination
                                </span> */}

                                <h3 className="text-[#8B0000] font-bold text-2xl sm:text-3xl leading-snug">
                                    Gupt Upasana Mandir
                                </h3>

                                <div className="w-16 lg:w-56 h-1 mt-4 rounded-full bg-gradient-to-r from-[#C49A45] via-[#C49A45]/70 to-transparent"></div>
                            </div>

                            {/* Description */}
                            <div className="space-y-5 text-gray-700 text-[15px] leading-8">

                                <p>
                                    Located in the heart of Salt Lake, Kolkata,{" "}
                                    <strong className="text-[#1f1d1d]">Gupt Upasana Mandir</strong>,
                                    popularly known as <strong className="text-[#1f1d1d]">Salt Lake Boro Maa</strong>,
                                    is a sacred spiritual destination with a heritage of approximately
                                    40 years. Revered by local residents and visited by devotees seeking
                                    the blessings of the Divine Mother, the temple brings together
                                    traditional Vedic and Tantric worship, devotion and compassionate service.
                                </p>

                                <p>
                                    Unlike seasonal Kali Puja celebrations,{" "}
                                    <strong className="text-[#1f1d1d]">Salt Lake Boro Maa resides here throughout the year. </strong>
                                    Devotees come with faith to pray for family welfare, prosperity,
                                    courage, peace of mind and the fulfilment of their heartfelt wishes.
                                    Discover the divine presence of{" "}
                                    <strong className="text-[#1f1d1d]">Mahakal and Mahakali</strong>,
                                    and enquire about worship of Maa Baglamukhi, Maa Pratyangira,
                                    11 Mukhi Hanuman and Ashta Bhairav.
                                </p>

                                <p>
                                    Whether you wish to visit Maa, arrange a personalised havan,
                                    offer flowers or bhog, support business-related spiritual rituals,
                                    feed people in need or help community dogs, Gupt Upasana welcomes
                                    your participation. Every voluntary offering is received with gratitude.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* donate section */}
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

                                {/* <span className="inline-block text-[#e7c652] text-xs sm:text-sm font-bold tracking-[3px] uppercase border border-[#e7c652]/40 rounded-full px-5 py-2 mb-6">
                                    Support Gupt Upasana
                                </span> */}

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

                                {/* <p className="text-[#f7f1e3]/50 text-xs mt-5 tracking-wide">
                                    Every contribution is voluntary and deeply appreciated.
                                </p> */}

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* book visit section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-[#8B0000] text-xs font-bold tracking-[0.25em] uppercase mb-2">
                        Darshan & Puja Enquiries
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#5a0000] font-serif">
                        Book a Sacred Visit to Mandir
                    </h2>
                    <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-[#C49A45] via-[#8B0000] to-[#C49A45]" />
                    <p className="mt-4 max-w-2xl mx-auto text-gray-700 text-sm sm:text-base leading-relaxed">
                        Whether visiting for serene devotional darshan of Salt Lake Boro Maa, conducting sacred personal sankalpa, or scheduling corporate havan offerings — we warmly invite you to plan your visit.
                    </p>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                
                    <div className="bg-white rounded-3xl p-7 border border-[#8B0000]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/8 text-[#8B0000] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#8B0000] group-hover:text-[#FFD700] transition-colors">
                                <User className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[#5a0000] mb-3">Individual & Family Darshan</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Come with your family for holy darshan, archana, and prayers. Open to all devotees seeking peace of mind, family welfare, and health blessings.
                            </p>
                            <ul className="space-y-2 text-xs text-gray-500 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Daily Boro Maa Darshan
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Flowers & Bhog Offerings
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Pranaam & Holy Charanamrita
                                </li>
                            </ul>
                        </div>
                        <Link
                            to="/book-visit"
                            className="w-full text-center py-2.5 px-4 rounded-xl border border-[#8B0000]/20 text-[#8B0000] font-bold text-sm hover:bg-[#8B0000] hover:text-[#FFD700] transition"
                        >
                            Schedule Devotee Visit →
                        </Link>
                    </div>

            
                    <div className="bg-white rounded-3xl p-7 border-2 border-[#e7c652]/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-[#e7c652] to-[#f7e4a0] text-[#4a0a0d] text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                            Popular for Companies
                        </div>
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-[#e7c652]/20 text-[#8B0000] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#8B0000] group-hover:text-[#FFD700] transition-colors">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[#5a0000] mb-3">Corporate & Organisation Seva</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Specially structured for corporate directors, business leaders, and institutions wishing to seek prosperity and hurdle-free business ventures.
                            </p>
                            <ul className="space-y-2 text-xs text-gray-500 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Institution / Company Registration
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Dedicated Contact Representative
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Special Arrangement & Puja Timings
                                </li>
                            </ul>
                        </div>
                        <Link
                            to="/book-visit"
                            className="w-full text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#5a0000] text-[#FFD700] font-bold text-sm hover:from-[#5a0000] hover:to-[#4a0a0d] shadow transition"
                        >
                            Book Corporate Visit →
                        </Link>
                    </div>

     
                    <div className="bg-white rounded-3xl p-7 border border-[#8B0000]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/8 text-[#8B0000] flex items-center justify-center mb-5 group-hover:bg-[#8B0000] group-hover:text-[#FFD700] transition-colors">
                                <svg
                                    viewBox="0 0 100 100"
                                    className="w-9 h-9"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="Hindu Om symbol"
                                    role="img"
                                >
                                    <text
                                        x="50"
                                        y="76"
                                        textAnchor="middle"
                                        fontSize="78"
                                        fontFamily="Noto Serif Devanagari, serif"
                                        fontWeight="600"
                                    >
                                        ॐ
                                    </text>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#5a0000] mb-3">Sankalp & Special Pujas</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Enquire about specialised tantric & vedic pujas, including Maa Baglamukhi, Maa Pratyangira, 11 Mukhi Hanuman, and Mahakal Bhairav rituals.
                            </p>
                            <ul className="space-y-2 text-xs text-gray-500 mb-6">
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Personalised Sacred Sankalpa
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Special Havan & Tantra Rituals
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[#8B0000]">✓</span> Personal Guidance from Temple Sevaks
                                </li>
                            </ul>
                        </div>
                        <Link
                            to="/book-visit"
                            className="w-full text-center py-2.5 px-4 rounded-xl border border-[#8B0000]/20 text-[#8B0000] font-bold text-sm hover:bg-[#8B0000] hover:text-[#FFD700] transition"
                        >
                            Enquire for Special Puja →
                        </Link>
                    </div>
                </div> */}

                {/* Direct CTA Banner */}
                <div className="rounded-3xl bg-gradient-to-r from-[#4a0a0d] via-[#650b10] to-[#4a0a0d] p-8 sm:p-10 border border-[#e7c652]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7c652]/15 text-[#e7c652] text-xs font-bold uppercase tracking-wider mb-2">
                            <Calendar size={13} /> Advance Booking Available
                        </div> */}
                        <h3 className="text-2xl sm:text-3xl font-black text-[#FFD700] font-serif">
                            Plan Your Sacred Mandir Darshan
                        </h3>
                        <p className="text-white/80 text-sm mt-1 max-w-xl">
                            Register your appointment in advance to ensure dedicated seva assistance and smooth entry during holy puja hours.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <Link
                            to="/book-visit"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#e7c652] to-[#d4af37] text-[#4a0a0d] font-black text-sm tracking-wide shadow-lg hover:brightness-110 transition-all hover:scale-105"
                        >
                            <Calendar size={16} />
                            Book a Visit Now
                        </Link>
                        {/* <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white/90 hover:text-white hover:bg-white/10 font-bold text-sm transition"
                        >
                            Contact Temple
                        </Link> */}
                    </div>
                </div>
            </section>

            {/* visitors guideline and contact section */}
            <section className="py-6 pb-20 px-6 max-w-7xl mx-auto mt-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Visitors Guideline */}
                    <div className="bg-white border border-[#8B0000]/10 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-[#8B0000] text-lg mb-4 flex items-center gap-2">
                            {/* <span className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center">🛕</span> */}
                            Visitors Guideline
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <span className="text-[#8B0000] mt-0.5">•</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Public Boro Maa darshan is open to devotees according to temple timings.
                                </p>
                            </div>

                            <div className="flex gap-3 items-start">
                                <span className="text-[#8B0000] mt-0.5">•</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Access to the Gupt Mandir and restricted deities or specialised rituals remains subject to temple protocols. No mandatory donation is required for public darshan.
                                </p>
                            </div>

                            <div className="flex gap-3 items-start">
                                <span className="text-[#8B0000] mt-0.5">•</span>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    For information concerning puja, sankalpa, and devotional offerings, please contact Gupt Upasana through email.


                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Gupt Upasana */}
                    <div className="bg-gradient-to-br from-[#8B0000] to-[#5a0000] rounded-2xl p-7 text-white shadow-lg">
                        <h3 className="font-bold text-[#e7c652] text-lg mb-5 flex items-center gap-2">
                            {/* <span className="w-8 h-8 rounded-full bg-[#e7c652]/10 flex items-center justify-center"></span> */}
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
                            <span className="w-8 h-8 p-2 rounded-full bg-[#8B0000]/10 flex items-center justify-center"><Phone /></span>
                            Contact Us
                        </h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <span className="text-[#8B0000] text-base mt-0.5 flex-shrink-0"><Locate /></span>
                                <span className="leading-relaxed">
                                    BC 160, Sector 1, Salt Lake, Kolkata – 700064, West Bengal, India.<br />

                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-[#8B0000] text-base flex-shrink-0"><Mail /></span>
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
                            <div className="flex items-start gap-3">
                                <span className="text-[#8B0000] text-base flex-shrink-0"><Phone /></span>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-0.5">Phone</p>
                                    <a
                                        href="tel:+919674933763"
                                        className="text-[#8B0000] hover:underline break-all"
                                    >
                                        +91 9674933763
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
