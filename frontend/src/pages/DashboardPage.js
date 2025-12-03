import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchProjects, createProject, updateProject, deleteProject, } from "../api/projects";
import ProjectStats from "../components/ProjectStats";
import ProjectBoard from "../components/ProjectBoard";
import ProjectForm from "../components/ProjectForm";
import Alert from "../components/Alert";
const DashboardPage = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false); // State for the form
    const [actionLoading, setActionLoading] = useState({});
    // Auto-dismiss notifications after 5 seconds
    useEffect(() => {
        if (notifications.length === 0)
            return;
        const timer = setTimeout(() => {
            setNotifications((prev) => prev.slice(1)); // Remove the first notification
        }, 5000);
        return () => clearTimeout(timer);
    }, [notifications]);
    const loadProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchProjects();
            setProjects(data);
        }
        catch (err) {
            const id = Date.now().toString();
            let message = "Failed to load projects.";
            if (err.message === "Network Error") {
                message = "Network error. Please check your connection and try again.";
            }
            else if (err.response?.status >= 500) {
                message = "Server error. Please try again later.";
            }
            else if (err.response?.data?.detail) {
                message = err.response.data.detail;
            }
            setNotifications((prev) => [...prev, { id, type: "error", message }]);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);
    const handleShowNotification = useCallback((message, type) => {
        const id = Date.now().toString();
        setNotifications((prev) => [...prev, { id, type, message }]);
    }, []);
    const handleCreate = useCallback(async (payload) => {
        setActionLoading((prev) => ({ ...prev, create: true }));
        try {
            const created = await createProject(payload);
            setProjects((prev) => [...prev, created]);
            handleShowNotification("Project created successfully.", "success");
            setShowAddForm(false); // Hide the form after successful creation
        }
        catch (err) {
            let message = "Failed to create project.";
            if (err.response?.data?.detail) {
                message = err.response.data.detail;
            }
            handleShowNotification(message, "error");
        }
        finally {
            setActionLoading((prev) => ({ ...prev, create: false }));
        }
    }, [handleShowNotification]);
    const handleStatusChange = useCallback(async (id, status) => {
        setActionLoading((prev) => ({ ...prev, [`status-${id}`]: true }));
        try {
            const updated = await updateProject(id, { status });
            setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
            handleShowNotification("Project status updated.", "success");
        }
        catch (err) {
            let message = "Failed to update project.";
            if (err.response?.data?.detail) {
                message = err.response.data.detail;
            }
            handleShowNotification(message, "error");
        }
        finally {
            setActionLoading((prev) => ({ ...prev, [`status-${id}`]: false }));
        }
    }, [handleShowNotification]);
    const handleUpdate = useCallback(async (id, data) => {
        setActionLoading((prev) => ({ ...prev, [`update-${id}`]: true }));
        try {
            const updated = await updateProject(id, data);
            setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
            handleShowNotification("Project updated.", "success");
        }
        catch (err) {
            let message = "Failed to update project.";
            if (err.response?.data?.detail) {
                message = err.response.data.detail;
            }
            handleShowNotification(message, "error");
        }
        finally {
            setActionLoading((prev) => ({ ...prev, [`update-${id}`]: false }));
        }
    }, [handleShowNotification]);
    const handleDelete = useCallback(async (id) => {
        const projectToDelete = projects.find((p) => p.id === id);
        if (!projectToDelete) {
            handleShowNotification("Project not found.", "error");
            return;
        }
        const confirmed = window.confirm(`Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone.`);
        if (!confirmed)
            return;
        setActionLoading((prev) => ({ ...prev, [`delete-${id}`]: true }));
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            handleShowNotification("Project deleted.", "success");
        }
        catch (err) {
            let message = "Failed to delete project.";
            if (err.response?.data?.detail) {
                message = err.response.data.detail;
            }
            handleShowNotification(message, "error");
        }
        finally {
            setActionLoading((prev) => ({ ...prev, [`delete-${id}`]: false }));
        }
    }, [handleShowNotification, projects] // Added projects to dependencies
    );
    return (_jsxs("div", { className: "bg-gray-50 min-h-screen", children: [_jsx("header", { className: "sticky top-14 z-30 bg-white shadow-sm border-b border-slate-200", children: _jsx("div", { className: "mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col justify-between gap-3 sm:flex-row sm:items-end", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-slate-500", children: "Dashboard" }), _jsxs("h1", { className: "text-2xl font-semibold text-slate-900", children: ["Welcome", user?.full_name ? `, ${user.full_name}` : ""] }), _jsxs("p", { className: "mt-1 text-xs text-slate-600", children: ["You're tracking", " ", _jsxs("span", { className: "font-semibold text-slate-900", children: [projects.length, " project", projects.length === 1 ? "" : "s"] }), " ", "in this workspace."] })] }), _jsx("button", { onClick: () => setShowAddForm(true), className: "inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700", children: "+ Add New project" })] }) }) }), _jsx("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: notifications.map((notif) => (_jsx(Alert, { type: notif.type, message: notif.message }, notif.id))) }), _jsx("main", { className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8", children: loading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12" }) })) : (_jsxs("div", { className: "flex flex-col space-y-6", children: [showAddForm && (_jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Add New Project" }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Fill out the details below to create a new project." })] }), _jsx(ProjectForm, { onSubmit: handleCreate, onCancel: () => setShowAddForm(false), disabled: actionLoading.create })] })), _jsx(ProjectStats, { projects: projects }), _jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: _jsx(ProjectBoard, { projects: projects, onStatusChange: handleStatusChange, onDelete: handleDelete, onUpdate: handleUpdate, disabled: Object.keys(actionLoading).some((key) => actionLoading[key]) }) })] })) })] }));
};
export default DashboardPage;
