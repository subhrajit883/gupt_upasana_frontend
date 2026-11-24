import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";

const AdminLayout = () => {
    // Open by default on desktop, closed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(
        typeof window !== "undefined" ? window.innerWidth >= 768 : true
    );

    return (
        <div className="min-h-screen bg-[#faf8f3] print:bg-white print:min-h-0">

            {/* Sidebar */}
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpen={() => setSidebarOpen(true)}
            />

            {/* Main Content */}
            <main
                className={`min-h-screen transition-all duration-300 ${
                    sidebarOpen ? "md:ml-64" : "ml-0"
                } print:ml-0 print:min-h-0 print:w-full`}
            >
                <div className="min-w-0 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;