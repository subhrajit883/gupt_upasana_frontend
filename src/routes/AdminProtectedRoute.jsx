import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    return localStorage.getItem("admin_gupt") ? (

        children
    ) : (
        <Navigate to="/admin/login" replace />
    );
};

export default AdminProtectedRoute;
