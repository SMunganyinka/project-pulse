import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, ListChecks, RefreshCw, PlusCircle, BarChart2, Shield, Lock, ArrowRight, Star, } from "lucide-react";
const coreFeatures = [
    {
        icon: LayoutDashboard,
        title: "Intuitive Dashboard",
        description: "Get a clear overview of all your projects in one place with total counts and status summaries.",
    },
    {
        icon: ListChecks,
        title: "Project Management",
        description: "Create, view, and organize your projects easily. Each project displays its name, description, and status.",
    },
    {
        icon: RefreshCw,
        title: "Real-time Status Updates",
        description: "Quickly update project progress from Not Started → In Progress → Completed.",
    },
    {
        icon: PlusCircle,
        title: "Quick Project Creation",
        description: "Add new projects fast with a simple, streamlined form.",
    },
];
const securityFeatures = [
    {
        icon: BarChart2,
        title: "Progress Tracking",
        description: "Visual indicators help your team understand progress at a glance.",
    },
    {
        icon: Lock,
        title: "Secure Authentication",
        description: "Login, register, and manage your personal dashboard safely.",
    },
    {
        icon: Shield,
        title: "Data Persistence",
        description: "All project data is stored securely and available anytime.",
    },
];
const FeatureCard = ({ feature, isVisible, delay }) => {
    return (_jsxs("div", { className: `group bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`, style: { transitionDelay: `${delay}ms` }, children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-100 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white", children: _jsx(feature.icon, { className: "w-6 h-6" }) }), _jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600 text-sm", children: feature.description })] }));
};
// --- 3. Custom Hook for Scroll Animation with Staggering ---
const useAnimateOnScroll = (ref) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);
    return isIntersecting;
};
// --- 4. Main Component ---
const FeaturesPage = () => {
    const { isAuthenticated } = useAuth();
    const sectionRef = useRef(null);
    const isVisible = useAnimateOnScroll(sectionRef);
    return (_jsxs("div", { className: "relative bg-gray-50 overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full opacity-20 blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80  rounded-full opacity-20 blur-3xl" }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-6 py-16", children: [_jsxs("div", { className: "max-w-3xl mx-auto text-center mb-16", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Powerful Features for Your Team" }), _jsx("p", { className: "text-gray-600 text-sm md:text-base", children: "Project Pulse focuses on the essentials for small teams: clarity, speed, and a shared understanding of what matters right now." }), _jsxs("div", { className: "mt-8 flex items-center justify-center", children: [_jsx("div", { className: "flex items-center", children: [1, 2, 3, 4, 5].map((star) => (_jsx(Star, { className: "w-5 h-5 text-yellow-400 fill-current" }, star))) }), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Loved by 1000+ teams worldwide" })] })] }), _jsxs("div", { ref: sectionRef, className: "space-y-16", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-8", children: "Core Functionality" }), _jsx("div", { className: "grid gap-8 md:grid-cols-2", children: coreFeatures.map((feature, index) => (_jsx(FeatureCard, { feature: feature, isVisible: isVisible, delay: index * 100 }, feature.title))) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-8", children: "Security & Reliability" }), _jsx("div", { className: "grid gap-8 md:grid-cols-3", children: securityFeatures.map((feature, index) => (_jsx(FeatureCard, { feature: feature, isVisible: isVisible, delay: index * 100 }, feature.title))) })] })] }), _jsxs("div", { className: "mt-20 w-full max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-lg text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Ready to get started?" }), _jsx("p", { className: "text-sm text-gray-600 sm:text-base mb-6", children: "Create your free account and start managing your projects today." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs(Link, { to: isAuthenticated ? "/dashboard" : "/register", className: "px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition flex items-center justify-center", children: [isAuthenticated ? "Go to Dashboard" : "Get Started Free", _jsx(ArrowRight, { className: "ml-2 w-4 h-4" })] }), !isAuthenticated && (_jsx(Link, { to: "/login", className: "px-6 py-3 text-indigo-600 font-semibold rounded-md border border-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center", children: "Sign In" }))] })] })] })] }));
};
export default FeaturesPage;
