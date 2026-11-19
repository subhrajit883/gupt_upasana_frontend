import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const UserProtectedRoute = ({ children }) => {
    return isAuthenticated()
        ? children
        : <Navigate to="/user/login" replace />;
};

export default UserProtectedRoute;  