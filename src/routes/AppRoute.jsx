
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import DonatePage from "../pages/DonatePage";
import DonationSuccessPage from "../pages/DonationSuccessPage";
import MyDonationsPage from "../pages/MyDonationsPage";
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AuthPage from "../pages/AuthPage";
import ContactPage from "../pages/ContactPage";
import AdminLogin from "../adminPages/AdminLogin";
import AdminDonations from "../adminPages/AdminDonations";
import AdminDonPackage from "../adminPages/AdminDonPackage";
import AdminPujaUpdates from "../adminPages/AdminPujaUpdates";

// Redirect admin based on token
const AdminRedirect = () => {
    const adminToken = localStorage.getItem("admin_gupt");

    return adminToken
        ? <Navigate to="/admin/donations" replace />
        : <Navigate to="/admin/login" replace />;
};

// Prevent logged-in admin from accessing login page
const AdminLoginRedirect = () => {
    const adminToken = localStorage.getItem("admin_gupt");

    return adminToken
        ? <Navigate to="/admin/donations" replace />
        : <AdminLogin />;
};

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Main Website Layout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route
                        path="/donation"
                        element={<Navigate to="/donate" replace />}
                    />
                    <Route
                        path="/donate/success"
                        element={<DonationSuccessPage />}
                    />
                    <Route path="/my-donations" element={<MyDonationsPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                </Route>

                {/* Admin Login */}
                <Route
                    path="/admin/login"
                    element={<AdminLoginRedirect />}
                />

                {/* Admin Dashboard Routes */}
                <Route
                    path="/admin"
                    element={<AdminRedirect />}
                />

                <Route
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >
                    <Route
                        path="/admin/donations"
                        element={<AdminDonations />}
                    />
                    <Route
                        path="/admin/donation-packages"
                        element={<AdminDonPackage />}
                    />
                    <Route
                        path="/admin/puja-updates"
                        element={<AdminPujaUpdates />}
                    />
                </Route>

                {/* Unmatched User Routes */}
                <Route
                    path="/user/*"
                    element={<Navigate to="/" replace />}
                />

                {/* Global Catch-all */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoute;
