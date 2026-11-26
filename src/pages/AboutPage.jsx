import React from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    Calendar,
    Mail,
    Phone,
    Sparkles,
    Shield,
    Flame,
    ArrowRight
} from "lucide-react";

// ── Images from local assets ──────────────────────────────────────────────────
import imgMahakali from "../assets/maakali.jpeg";
import imgBhairav from "../assets/mahadev bhairav.jpeg";
import imgBaglamukhi from "../assets/maa baglamukhi.jpeg";
import templeImg from "../assets/templephoto.jpeg";
import heroBg from "../assets/homepage.jpeg";
import hanuman from "../assets/hanuman ji.jpg";
// ── Red Divider matching the screenshot ───────────────────────────────────────
const RedDivider = ({ className = "mt-2 mb-6" }) => (
    <div className={`w-full h-[1.5px] bg-[#a0101b] ${className}`} />
);

// ── Image Frame with Red Pin Badge ────────────────────────────────────────────
const DeityImageFrame = ({
    src,
    alt,
    hasPin = false,
    className = "w-full h-96 sm:h-80 md:h-96",
    caption = "",
    objectFit = "cover",
    objectPosition = "center"
}) => {
    const [imgFailed, setImgFailed] = React.useState(false);

    return (
        <div className={`relative rounded-xl overflow-hidden shadow-md border border-[#a0101b]/15 bg-[#f5ede2] group ${className}`}>
            {!imgFailed && src ? (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setImgFailed(true)}
                    style={{ objectPosition }}
                    className={`w-full h-full object-${objectFit} group-hover:scale-[1.02] transition-transform duration-500`}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#4a0a0d] to-[#250305] text-[#FFD700]">
                    <span className="text-4xl mb-2">🛕</span>
                    <p className="font-serif font-bold text-base text-[#FFD700]">{alt}</p>
                    <p className="text-xs text-white/70 mt-1 max-w-[200px]">Sacred Murti of Gupt Upasana Mandir</p>
                </div>
            )}

            {hasPin && (
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#a0101b] text-white flex items-center justify-center shadow-lg border border-white/40">
                    <MapPin size={14} className="fill-white text-white" />
                </div>
            )}

            {caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-white text-xs font-semibold text-center">
                    {caption}
                </div>
            )}
        </div>
    );
};
const AboutPage = () => {
    return (
        <div
            className="min-h-screen text-[#2b2b2b] selection:bg-[#a0101b]/20 selection:text-[#a0101b]"
            style={{
                backgroundColor: "#fcf9f2",
                backgroundImage: `
                    radial-gradient(circle at 10% 20%, rgba(160, 16, 27, 0.02) 0%, transparent 20%),
                    radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 25%),
                    linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)
                `,
                backgroundSize: "100% 100%, 100% 100%, 32px 32px, 32px 32px"
            }}
        >
            {/* ── Reading Column Container (Centered paper width matching image) ──── */}
            <main className=" px-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-8 sm:py-10 lg:py-14">

                {/* ── SECTION 1: TOP HERO / TITLE & INTRO ─────────────────────── */}
                <section className="mb-14">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#a0101b] leading-[1.25] tracking-tight">
                        A Rare Convergence of Divine Powers in One Temple — Gupt Upasana Mahakal-Mahakali Mandir
                    </h1>
                    <RedDivider className="mt-3 mb-8" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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

                        {/* Image 1: Mahakal & Mahakali fiery aura with red pin */}
                        <div>
                            <DeityImageFrame
                                src={templeImg}
                                alt="Mahakal & Mahakali Divine Presence"
                                className="w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[540px] object-top"
                            />
                        </div>
                    </div>
                </section>


                {/* ── SECTION 2: A TEMPLE AS A LIVING TANTRIC MANDALA ────────── */}
                <section className="mb-14">
                    <h2 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#a0101b]">
                        A Temple as a Living Tantric Mandala
                    </h2>
                    <RedDivider className="mt-2.5 mb-5" />

                    <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                        <p>
                            A Tantric mandala is not merely a geometric drawing on paper. In its highest form, it is a consecrated physical space where deities are placed in precise geometric and energetic relationships to each other, creating an unbroken field of spiritual force.
                        </p>
                        <p>
                            At Gupt Upasana, every deity has been consecrated according to strict Vedic and Tantric protocols. The sequence of darshan, the placement of the sanctums, and the nature of the daily rituals all reflect this sacred geometry. Devotees do not simply visit a temple; they enter an active spiritual vortex designed to purify, protect, and elevate.
                        </p>
                    </div>
                </section>


                {/* ── SECTION 3: MAHAKAAL, MAHAKAALI AND SIDDHA PEETH MAA KALIKATA */}
                <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Image 2: Standing Maa Kali with red saree and weapons */}
                        <div>
                            <DeityImageFrame
                                src={imgMahakali}
                                alt="Maa Mahakali"
                                className="w-full h-80 sm:h-96 md:h-[420px]"
                            />
                        </div>

                        {/* Text Right */}
                        <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#a0101b]">
                                Mahakaal, Mahakaali and Siddha Peeth Maa Kalikata
                            </h3>

                            <p>
                                At the very heart of the temple stand the eternal cosmic pair — Bhagwan Mahakaal and Maa Mahakaali. Together, they represent the ultimate reality of Tantra: consciousness and energy, stillness and dynamic force, the unmanifest and the manifest.
                            </p>

                            {/* Sacred Mantra Card (exact from screenshot) */}
                            <div className="my-4 py-4 px-5 rounded-2xl bg-[#faf6ee] border border-[#a0101b]/25 text-center shadow-xs">
                                <p className="font-serif font-bold text-base sm:text-lg text-[#a0101b] tracking-wider leading-relaxed">
                                    ॐ क्रीं कालिकायै नमः
                                </p>
                                <p className="font-serif font-bold text-base sm:text-lg text-[#a0101b] tracking-wider leading-relaxed mt-1">
                                    ॐ हौं जूं सः महाकालाय नमः
                                </p>
                            </div>

                            <p>
                                Maa Mahakaali at Gupt Upasana is worshipped not only in her fierce, protective form that destroys negative energies and karmic blockages, but also in her profoundly compassionate form as the Mother of the Universe. Bhagwan Mahakaal stands as the eternal witness, the master of time and mortality, who liberates the soul from fear.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                        <p>
                            Unlike temporary puja pandals where the divine presence is invoked and then immersed, the deities at Gupt Upasana reside here permanently. The sanctum vibrates with the cumulative energy of continuous daily sadhana, mantra japa, and consecrated offerings.
                        </p>
                    </div>
                </section>


                {/* ── SECTION 4: EKADASHAMUKHI HANUMAN ──────────────────────── */}
                <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Text Left */}
                        <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#a0101b]">
                                Ekadashamukhi Hanuman — The Eleven-Headed Shield
                            </h3>

                            <p>
                                Hanuman Ji is revered across Bharat as the ultimate symbol of devotion, strength, and protection. But the{" "}
                                <strong className="text-[#a0101b] font-bold">
                                    Ekadashamukhi (11-Faced) form of Hanuman
                                </strong>{" "}
                                is an exceptionally rare and esoteric Tantric manifestation.
                            </p>
                            <p>
                                Each of the eleven faces represents a distinct divine power — including the forms of Narasimha, Garuda, Varaha, Hayagriva, and Shiva Himself. In Tantric science, this form is known as the{" "}
                                <strong className="text-[#a0101b] font-bold">Sarva-Shatru-Nashak</strong>{" "}
                                (destroyer of all enemies) and the ultimate shield against planetary afflictions, evil eye (nazar), black magic, and spiritual obstruction.
                            </p>
                            <p>
                                At Gupt Upasana, Ekadashamukhi Hanuman stands as the supreme protector of the mandala, guarding the four directions and ensuring that no negative entity can cross into the consecrated perimeter.
                            </p>
                            <p>
                                Devotees facing severe litigation, chronic health crises, unseen enemies, or deep-seated fear find immediate refuge and relief at His feet.
                            </p>
                        </div>

                        {/* Image 3: Brass 11-Mukhi Hanuman Murti */}
                        <div>
                            <DeityImageFrame
                                src={hanuman}
                                alt="Ekadashamukhi Hanuman Ji"
                                hasPin={false}
                                className="w-full h-80 sm:h-96 md:h-[420px] object-top"
                            />
                        </div>
                    </div>
                </section>


                {/* ── SECTION 5: SIDDHADATRI MAA BAGLAMUKHI ─────────────────── */}
                <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Image 4: Golden Maa Baglamukhi with red pin - order-2 on mobile, order-1 on desktop */}
                        <div className="order-2 md:order-1">
                            <DeityImageFrame
                                src={imgBaglamukhi}
                                alt="Siddhadatri Maa Baglamukhi"
                                className="w-full h-80 sm:h-96 md:h-[420px]"
                            />
                        </div>

                        {/* Text: Heading and Content - order-1 on mobile, order-2 on desktop */}
                        <div className="order-1 md:order-2 space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#a0101b]">
                                Siddhadatri Maa Baglamukhi
                            </h3>

                            <p>
                                The eighth of the Ten Mahavidyas,{" "}
                                <strong className="text-[#a0101b] font-bold">Maa Baglamukhi</strong>{" "}
                                is the goddess of stambhana — the divine power to freeze, paralyze, and silence all hostile forces, false accusations, legal entanglements, and internal doubts.
                            </p>
                            <p>
                                She holds the tongue of the demon of falsehood and raises her mace to strike down deceit. Her golden radiance symbolizes the blinding light of truth that leaves negativity powerless.
                            </p>
                            <p>
                                At Gupt Upasana, worship of Maa Baglamukhi is conducted with precise yellow offerings (haldi, pitambar flowers, yellow mustard, and consecrated lamps). Devotees entangled in court cases, business rivalries, administrative hurdles, or slander experience her miraculous intervention.
                            </p>
                            <p>
                                Her presence completes the triangle of supreme female shakti in the mandir — destruction of evil through Mahakaali, paralysis of malice through Baglamukhi, and ultimate protection through Pratyangira.
                            </p>
                        </div>
                    </div>
                </section>

                {/* <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                     
                        <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#a0101b]">
                                Ashta Bhairav — Eight Dimensions of Bhairava Consciousness
                            </h3>

                            <p>
                                Bhairava is the fierce, protective aspect of Shiva associated with the transcendence of fear and the mastery over time and direction. In classical Tantric tradition, there are{" "}
                                <strong className="text-[#a0101b] font-bold">Eight Primary Bhairavas (Ashta Bhairav)</strong>,
                                each governing a specific direction, element, and dimension of spiritual consciousness:
                            </p>

                  
                            <ul className="space-y-2 text-xs sm:text-[13px] text-[#4b5563] pl-2 sm:pl-3 border-l-2 border-[#a0101b]/30">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Asitanga Bhairav</strong> — Bestower of creative power and wisdom (East)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Ruru Bhairav</strong> — Subduer of enemies and negative forces (Southeast)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Chanda Bhairav</strong> — Destroyer of fear and provider of courage (South)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Krodha Bhairav</strong> — Eliminator of obstacles and dark energies (Southwest)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Unmatta Bhairav</strong> — Master of speech and emotional balance (West)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Kapala Bhairav</strong> — Lord of liberation and spiritual completion (Northwest)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Bhishana Bhairav</strong> — Vanquisher of spirits and unseen afflictions (North)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#a0101b] font-black">•</span>
                                    <span><strong>Samhara Bhairav</strong> — Dissolver of old karma and universal regenerator (Northeast)</span>
                                </li>
                            </ul>
                        </div>

                    
                        <div>
                            <DeityImageFrame
                                src={carousel3 || heroBg}
                                alt="Ashta Bhairav Altar Murtis"
                                hasPin={false}
                                className="w-full h-72 sm:h-80 md:h-[380px]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                        <p>
                            Having the complete Ashta Bhairav consecrated together in a single temple is an extraordinary rarity. Together, they form an impenetrable spiritual perimeter around the devotee, neutralizing hostile vibrations from every cardinal and intercardinal direction.
                        </p>
                        <p>
                            Devotees undergoing Rahu-Ketu dosha, Shani Sade Sati, or acute spiritual distress are guided to offer prayers to specific Bhairavas based on their astrological and karmic alignment.
                        </p>
                    </div>
                </section> */}


                {/* ── SECTION 7: MAA PRATYANGIRA ────────────────────────────── */}
                {/* <section className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
       
                        <div>
                            <DeityImageFrame
                                src={carousel1 || templeImg}
                                alt="Maa Pratyangira Devi"
                                hasPin={false}
                                className="w-full h-80 sm:h-96 md:h-[420px]"
                            />
                        </div>

              
                        <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#a0101b]">
                                Maa Pratyangira — The Mysterious Fierce Goddess
                            </h3>

                            <p>
                                With the face of a lioness and the body of a divine mother,{" "}
                                <strong className="text-[#a0101b] font-bold">Maa Pratyangira (Atharvana Bhadrakali)</strong>{" "}
                                is one of the most formidable and secretive Tantric deities known to Bharat.
                            </p>
                            <p>
                                Born from the third eye of Shiva to pacify the uncontrollable fury of Lord Narasimha, she embodies the supreme power of reversal — turning back any curse, black magic, envy, or ill-will directly upon its source.
                            </p>
                            <p>
                                Her worship requires the highest levels of spiritual purity and initiation. At Gupt Upasana, her sanctum is maintained under strict esoteric discipline, accessible only during designated homams and specialised pujas.
                            </p>
                            <p>
                                For devotees suffering from unexplainable chronic suffering, ancestral curses (pitru dosha), or extreme psychic attacks, her grace acts like an unbreachable fortress.
                            </p>
                        </div>
                    </div>
                </section> */}


                {/* ── SECTION 8: WHY IS THE GUPT MANDIR CLOSED TO GENERAL VISITORS? */}
                {/* <section className="mb-14">
                    <h2 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#a0101b]">
                        Why Is the Gupt Mandir Closed to General Visitors?
                    </h2>
                    <RedDivider className="mt-2.5 mb-5" />

                    <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#374151]">
                        <p>
                            A question frequently asked by visitors is why certain sections of Gupt Upasana Mandir are kept strictly confidential and closed to general public darshan.
                        </p>
                        <p>
                            In authentic Tantric tradition, high-potency consecrated energies are not meant for indiscriminate exposure. Just as a high-voltage transformer requires insulation and careful calibration, deities invoked with intense beej mantras and specialized homams require a sanctified, undisturbed atmosphere.
                        </p>

                
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf6ee] border border-[#a0101b]/20 my-4 space-y-1.5">
                            <h4 className="text-sm font-bold text-[#a0101b] uppercase tracking-wider flex items-center gap-2">
                                <Shield size={16} /> Specialized &amp; Supervised Access Only
                            </h4>
                            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                                Access to the inner Gupt Mandir is permitted only during specific anushthans, dedicated havans, or under the direct spiritual guidance and supervision of our resident sadhaks.
                            </p>
                        </div>

                        <p>
                            This preservation of sacred purity ensures that the divine vortex remains uncontaminated, intensely potent, and capable of generating profound spiritual breakthroughs when a devotee truly needs it.
                        </p>
                    </div>
                </section> */}


                {/* <section className="mb-14">
                    <h2 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#a0101b]">
                        One Temple — One Complete Shakti Mandala
                    </h2>
                    <RedDivider className="mt-2.5 mb-6" />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
                        {[
                            {
                                title: "Mahakal and Mahakali",
                                desc: "Supreme Consciousness & Cosmic Energy",
                                img: imgBhairav
                            },
                            {
                                title: "Hanuman Ji",
                                desc: "Ultimate Shield & Devotion",
                                img: carousel2 || templeImg
                            },
                            {
                                title: "Maa Baglamukhi",
                                desc: "Stambhana Shakti & Truth",
                                img: imgBaglamukhi
                            },
                            {
                                title: "Ashta Bhairav",
                                desc: "Eight Directions Protection",
                                img: carousel3 || heroBg
                            },
                            {
                                title: "Maa Pratyangira",
                                desc: "Reversal of Negative Force",
                                img: carousel1 || imgMahakali
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl overflow-hidden bg-white border border-[#a0101b]/15 shadow-xs flex flex-col justify-between"
                            >
                                <div className="h-28 sm:h-32 w-full overflow-hidden bg-[#f0e8dc]">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-2.5 text-center flex-1 flex flex-col justify-center">
                                    <h4 className="text-xs font-serif font-bold text-[#a0101b] leading-snug">
                                        {item.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs sm:text-sm text-center text-gray-500 italic mt-5">
                        Each deity at Gupt Upasana is not an isolated idol — they are interlocking nodes of one living, pulsating cosmic Mandala.
                    </p>
                </section> */}


                {/* ── SECTION 10: DARSHAN AND CONTACT ────────────────────────── */}
                <section className="mb-14">
                    <h2 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#a0101b]">
                        Darshan and Contact
                    </h2>
                    <RedDivider className="mt-2.5 mb-6" />

                    <div className="space-y-3.5 text-sm sm:text-[15px] text-[#374151]">
                        <div className="flex items-start gap-3">
                            <span className="text-[#a0101b] text-base mt-0.5 font-bold">•</span>
                            <p>
                                <strong className="text-[#a0101b]">Salt Lake Boro Maa Public Darshan:</strong>{" "}
                                Open daily during regular mandir timings (Morning 8:00 AM – 12:30 PM &amp; Evening 4:30 PM – 9:00 PM).
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#a0101b] text-base mt-0.5 font-bold">•</span>
                            <p>
                                <strong className="text-[#a0101b]">Gupt Mandir &amp; Special Rituals:</strong>{" "}
                                Access is subject to temple protocols and prior consultation with our sadhaks.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#a0101b] text-base mt-0.5 font-bold">•</span>
                            <p>
                                <strong className="text-gray-800">Mandir Address:</strong>{" "}
                                BC 160, Sector 1, Salt Lake, Kolkata – 700064, West Bengal, India.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-[#a0101b] text-base mt-0.5 font-bold">•</span>
                            <p>
                                <strong className="text-gray-800">General Enquiries:</strong>{" "}
                                <a href="mailto:guptupasana@gmail.com" className="text-[#a0101b] hover:underline font-semibold">
                                    guptupasana@gmail.com
                                </a>{" "}
                                |{" "}
                                <a href="tel:+919674933763" className="text-[#a0101b] hover:underline font-semibold">
                                    +91 9674933763
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-start">
                        <Link
                            to="/book-visit"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#a0101b] text-[#FFD700] font-bold text-xs sm:text-sm hover:bg-[#850c15] transition shadow-md"
                        >
                            <Calendar size={15} />
                            Schedule Mandir Visit
                        </Link>
                        <Link
                            to="/donate"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#a0101b]/40 text-[#a0101b] font-bold text-xs sm:text-sm hover:bg-[#a0101b]/5 transition"
                        >
                            Offer Seva / Donation →
                        </Link>
                    </div>
                </section>


                {/* ── FOOTER SIGN-OFF (Exact from bottom of screenshot) ──────── */}
                {/* <footer className="pt-10 pb-6 text-center border-t border-[#a0101b]/20">
                    <p className="font-serif italic text-base sm:text-lg text-[#374151]">
                        One temple. Many rare divine forms. One sacred field of Shakti.
                    </p>
                    <p className="text-xs sm:text-sm font-serif font-black tracking-widest text-[#a0101b] mt-2 uppercase">
                        — Gupt Upasana —
                    </p>
                </footer> */}

            </main>
        </div>
    );
};

export default AboutPage;
