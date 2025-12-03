import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Alert from "../components/Alert";
const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ email, password });
            const from = location.state?.from?.pathname ?? "/dashboard";
            navigate(from, { replace: true });
        }
        catch (err) {
            setError(err?.response?.data?.detail ?? "Login failed. Check your credentials.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-8 bg-gray-50", children: _jsxs("div", { className: "w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [_jsx("h1", { className: "text-xl font-semibold text-slate-900", children: "Welcome back" }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Sign in to access your Project Pulse dashboard." }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-6 space-y-4", children: [error && _jsx(Alert, { type: "error", message: error }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700", children: "Email" }), _jsx("input", { type: "email", required: true, className: "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700", children: "Password" }), _jsx("input", { type: "password", required: true, minLength: 6, className: "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500", value: password, onChange: (e) => setPassword(e.target.value) })] }), _jsx("button", { type: "submit", disabled: loading, className: "mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60", children: loading ? "Signing in..." : "Sign in" })] }), _jsxs("p", { className: "mt-4 text-xs text-slate-600", children: ["Don't have an account?", " ", _jsx(Link, { to: "/register", className: "text-indigo-600 hover:text-indigo-700", children: "Create one" })] })] }) }));
};
export default LoginPage;
