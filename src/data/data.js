// Data configuration for Gupt Upasana Static ChatBot and website resources

export const chatbotConfig = {
    botName: "Gupt Upasana Sahayak",
    botSubtitle: "Divine Seva & Spiritual Assistance",
    logoPath: "/logo.png",
    
    // Notification popup banner when user visits the site
    notification: {
        title: "Namaste Devotee! 🙏",
        message: "Have questions about our pujas, seva, or sacred temple?",
        actionText: "Chat with us",
    },

    // Initial greeting in the chat window
    greeting: {
        title: "Jai Maa Kali! 🕉️",
        text: "Welcome to Gupt Upasana — The Ancient Science of Tantra for Kaliyug. I am your divine assistant. How may I assist your spiritual journey today?",
        prompt: "Please choose one of the options below to know more:",
    },

    // Main options presented to the devotee
    options: [
        {
            id: "about",
            label: "Know about Us",
            icon: "🕉️",
            summary: "Our mission, lineage & spiritual sanctuary",
            response:
                "Gupt Upasana is dedicated to reviving the sacred, timeless wisdom of Tantra, Mantra, Yantra, Dhyana, Japa, and Kaliyug Sadhana under authentic spiritual discipline. Led by experienced sadhaks, our mission is to guide devotees towards inner strength, spiritual remedies for life's challenges, and divine protection through Maa Mahakali, Mahakal Bhairav, and Maa Baglamukhi.",
            actionType: "redirect",
            actionUrl: "/about",
            actionButtonText: "Visit About Page →",
        },
        {
            id: "donate",
            label: "How to Donate?",
            icon: "🪔",
            summary: "Simple steps to offer your seva online",
            response:
                "Offering your sacred Seva is easy, secure, and blessed:\n\n1. Visit our 'Offer Your Seva' page.\n2. Choose from curated packages (such as Devotional Seva, Special Seva, Maha Seva) or enter a custom amount.\n3. Make your donation through our secure encrypted payment gateway.\n4. Receive your official donation receipt instantly in your profile.",
            actionType: "redirect",
            actionUrl: "/donate",
            actionButtonText: "Go to Seva & Donation Page →",
        },
        {
            id: "investment",
            label: "How My Money will be invested",
            icon: "🪙",
            summary: "Transparent utilization of temple contributions",
            response:
                "Every rupee offered by devotees is held with utmost reverence and treated as a sacred trust. Here is how your holy contributions are invested:\n\n🪔 Daily Nitya Puja & Bhog: Pure ghee, fresh flowers, sacred dhoop, and consecrated bhog for Maa Mahakali, Mahakal Bhairav, and Maa Baglamukhi.\n\n🍲 Annadanam & Sadhu Seva: Distribution of sacred satvik prasad and meals to sadhaks, visiting devotees, and the underprivileged.\n\n🛕 Mandir Preservation & Sanctum Maintenance: Maintaining the purity, cleanliness, lighting, and upkeep of the inner sanctum and darshan premises.\n\n🔥 Homa, Hawan & Special Anushthan: Conducting powerful Navratri, Amavasya, and Grahan sadhana anushthans for world welfare and devotee protection.\n\n📖 Spiritual Knowledge & Devotee Guidance: Supporting authentic spiritual teachings, sadhana counseling, and educational outreach.",
            actionType: "text",
            actionButtonText: null,
            actionUrl: null,
        },
    ],

    // Quick footer note inside chatbot
    footerNote: "Temple Timings: 6:00 AM – 9:00 PM | Public Darshan Open Daily",
};
