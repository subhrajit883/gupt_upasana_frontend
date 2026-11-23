/**
 * Checks if an Axios error response message is the "invalid/expired token" sentinel.
 * If it is, clears the admin token from localStorage and redirects to /admin/login.
 *
 * Usage inside any catch block:
 *   if (handleAdminAuthError(err, navigate)) return;
 *
 * Returns `true` when it handled the redirect (so the caller can bail out early).
 */
export const handleAdminAuthError = (err, navigate) => {
    const message = err?.response?.data?.message || "";
    if (message === "Invalid or expired admin token") {
        localStorage.removeItem("admin_gupt");
        navigate("/admin/login", { replace: true });
        return true;
    }
    return false;
};
