
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
import MyProfilePage from "../pages/MyProfilePage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AdminAllUsers from "../adminPages/AdminAllUsers";
import AboutPage from "../pages/AboutPage";
import BookVisitPage from "../pages/BookVisitPage";
import ServiceBookingPage from "../pages/ServiceBookingPage";
import AdminServicePage from "../adminPages/AdminServicePage";

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
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route
                        path="/donation"
                        element={<Navigate to="/donate" replace />}
                    />
                    <Route
                        path="/donate/success"
                        element={<DonationSuccessPage />}
                    />
                    <Route path="/book-visit" element={<BookVisitPage />} />
                    <Route path="/services" element={<ServiceBookingPage />} />
                    <Route
                        path="/service-booking"
                        element={<Navigate to="/services" replace />}
                    />
                    <Route path="/my-donations" element={<MyDonationsPage />} />
                    <Route path="/my-profile" element={<MyProfilePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
                        path="/admin/services"
                        element={<AdminServicePage />}
                    />
                    <Route
                        path="/admin/puja-updates"
                        element={<AdminPujaUpdates />}
                    />
                    <Route
                        path="/admin/all-users"
                        element={<AdminAllUsers />}
                    />
                </Route>

                {/* Unmatched User Routes */}
                <Route
                    path="/user/login"
                    element={<Navigate to="/auth" replace />}
                />
                <Route
                    path="/user/register"
                    element={<Navigate to="/auth" replace />}
                />
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
