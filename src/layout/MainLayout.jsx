import { Outlet } from "react-router-dom";
import UpdatesHeader from "../component/UpdatesHeader";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import PujaUpdatesNotifier from "../component/PujaUpdatesNotifier";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#fdf5e6]">
            {/* Live puja updates ticker */}
            <UpdatesHeader />

            {/* Main navigation with PujaNotificationBell */}
            <Navbar />

            {/* Background push notification listener & permission prompt */}
            <PujaUpdatesNotifier />

            {/* Page content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;
