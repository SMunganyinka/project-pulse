import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    // Restore from localStorage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem("pp_access_token");
        const storedUser = localStorage.getItem("pp_user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const persist = (newToken, newUser) => {
        localStorage.setItem("pp_access_token", newToken);
        localStorage.setItem("pp_user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };
    const login = async (payload) => {
        const res = await apiLogin(payload);
        persist(res.access_token, res.user);
    };
    const register = async (payload) => {
        // create user then log in
        const newUser = await apiRegister(payload);
        const res = await apiLogin({ email: newUser.email, password: payload.password });
        persist(res.access_token, res.user);
    };
    const logout = () => {
        localStorage.removeItem("pp_access_token");
        localStorage.removeItem("pp_user");
        setToken(null);
        setUser(null);
    };
    const value = {
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
