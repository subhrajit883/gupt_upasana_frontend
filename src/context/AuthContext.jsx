import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { authUrl } from "../config/config";

const TOKEN_KEY = "gupt upasana";

const AuthContext = createContext(null);

// Decode a JWT payload on the client (no signature verification)
const decodeToken = (token) => {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const json = decodeURIComponent(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(TOKEN_KEY);
        return stored ? decodeToken(stored) : null;
    });
    const [loading, setLoading] = useState(false);

    // Persist the token only (no user object is stored)
    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    // On first load, restore the full profile from the stored token
    useEffect(() => {
        const stored = localStorage.getItem(TOKEN_KEY);
        if (!stored) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await axios.get(authUrl.me, {
                    headers: { Authorization: `Bearer ${stored}` },
                    withCredentials: true,
                });
                if (!cancelled) setUser(res.data.user);
            } catch (err) {
                // Only sign out when the token is actually rejected
                if (!cancelled && err.response?.status === 401) {
                    setUser(null);
                    setToken(null);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (identifier, password) => {
        setLoading(true);
        try {
            const res = await axios.post(authUrl.login, { identifier, password }, { withCredentials: true });
            setToken(res.data.token);
            setUser(res.data.user || decodeToken(res.data.token));
            return { success: true, user: res.data.user };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (formData) => {
        setLoading(true);
        try {
            const res = await axios.post(authUrl.register, formData, { withCredentials: true });
            setToken(res.data.token);
            setUser(res.data.user || decodeToken(res.data.token));
            return { success: true, user: res.data.user };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Registration failed" };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post(authUrl.logout, {}, { withCredentials: true });
        } catch { /* ignore */ }
        setUser(null);
        setToken(null);
    }, []);

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, authHeader, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

export default AuthContext;
