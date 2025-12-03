import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from "react";
const statusLabel = {
    NOT_STARTED: "Not started",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed"
};
const statusColors = {
    NOT_STARTED: "bg-slate-100 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200"
};
// --- Icon Components ---
const EditIcon = ({ className }) => (_jsxs("svg", { viewBox: "0 0 24 24", className: `h-4 w-4 ${className ?? ''}`, "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: 1.8, children: [_jsx("path", { d: "M4 20h4l10.5-10.5a1.5 1.5 0 1 0-2.12-2.12L6 17.88V20z" }), _jsx("path", { d: "M13.5 6.5 17 10" })] }));
const TrashIcon = ({ className }) => (_jsxs("svg", { viewBox: "0 0 24 24", className: `h-4 w-4 ${className ?? ''}`, "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: 1.8, children: [_jsx("path", { d: "M5 7h14" }), _jsx("path", { d: "M10 11v6" }), _jsx("path", { d: "M14 11v6" }), _jsx("path", { d: "M6 7l1 12a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7" }), _jsx("path", { d: "M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" })] }));
const CheckIcon = ({ className }) => (_jsx("svg", { viewBox: "0 0 24 24", className: `h-3 w-3 ${className ?? ''}`, "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: 2.5, children: _jsx("path", { d: "M20 6L9 17l-5-5" }) }));
const ProjectCard = ({ project, onDelete, onUpdate, disabled }) => {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(project.name);
    const [editDescription, setEditDescription] = useState(project.description ?? "");
    const [editStatus, setEditStatus] = useState(project.status);
    const [saving, setSaving] = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const nameInputRef = useRef(null);
    // Reset form when project changes
    useEffect(() => {
        if (!editing) {
            setEditName(project.name);
            setEditDescription(project.description ?? "");
            setEditStatus(project.status);
        }
    }, [project, editing]);
    // Focus on name input when entering edit mode
    useEffect(() => {
        if (editing && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [editing]);
    // Validate name field
    const validateName = useCallback((name) => {
        if (!name.trim()) {
            return "Project name is required";
        }
        if (name.trim().length < 3) {
            return "Project name must be at least 3 characters";
        }
        if (name.length > 100) {
            return "Project name must be less than 100 characters";
        }
        return null;
    }, []);
    // Update validation when name changes
    useEffect(() => {
        if (editing && editName !== project.name) {
            setValidationError(validateName(editName));
        }
    }, [editName, editing, project.name, validateName]);
    const handleStatusChange = useCallback(async (newStatus) => {
        if (disabled || statusSaving || newStatus === project.status)
            return;
        setStatusSaving(true);
        try {
            await onUpdate({
                name: project.name,
                description: project.description ?? undefined,
                status: newStatus
            });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update status");
        }
        finally {
            setStatusSaving(false);
        }
    }, [disabled, statusSaving, project, onUpdate]);
    const startEdit = useCallback(() => {
        if (disabled)
            return;
        setEditName(project.name);
        setEditDescription(project.description ?? "");
        setEditStatus(project.status);
        setError(null);
        setValidationError(null);
        setEditing(true);
    }, [disabled, project]);
    const cancelEdit = useCallback(() => {
        if (disabled || saving)
            return;
        setEditing(false);
        setError(null);
        setValidationError(null);
    }, [disabled, saving]);
    const saveEdit = useCallback(async () => {
        if (disabled || saving)
            return;
        const nameError = validateName(editName);
        if (nameError) {
            setValidationError(nameError);
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onUpdate({
                name: editName.trim(),
                description: editDescription.trim() || undefined,
                status: editStatus
            });
            setEditing(false);
            setValidationError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update project");
        }
        finally {
            setSaving(false);
        }
    }, [disabled, saving, editName, editDescription, editStatus, onUpdate, validateName]);
    const confirmDelete = useCallback(() => {
        if (disabled)
            return;
        const ok = window.confirm(`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`);
        if (ok) {
            onDelete();
        }
    }, [disabled, project.name, onDelete]);
    // Keyboard shortcuts for edit mode
    useEffect(() => {
        if (!editing)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                cancelEdit();
            }
            else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                saveEdit();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editing, cancelEdit, saveEdit]);
    if (editing) {
        return (_jsxs("div", { className: "flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-all", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "project-name", className: "block text-sm font-medium text-slate-700 mb-1.5", children: ["Project Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { id: "project-name", ref: nameInputRef, className: `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${validationError
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-300"}`, value: editName, onChange: (e) => setEditName(e.target.value), disabled: disabled || saving, placeholder: "Project name", "aria-invalid": !!validationError, "aria-describedby": validationError ? "name-error" : undefined }), validationError && (_jsx("p", { id: "name-error", className: "mt-1.5 text-xs text-red-600", children: validationError }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "project-description", className: "block text-sm font-medium text-slate-700 mb-1.5", children: "Description" }), _jsx("textarea", { id: "project-description", className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none", rows: 3, value: editDescription, onChange: (e) => setEditDescription(e.target.value), disabled: disabled || saving, placeholder: "Project description (optional)" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "project-status", className: "block text-sm font-medium text-slate-700 mb-1.5", children: "Status" }), _jsxs("select", { id: "project-status", className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", value: editStatus, onChange: (e) => setEditStatus(e.target.value), disabled: disabled || saving, children: [_jsx("option", { value: "NOT_STARTED", children: "Not started" }), _jsx("option", { value: "IN_PROGRESS", children: "In progress" }), _jsx("option", { value: "COMPLETED", children: "Completed" })] })] })] }), error && (_jsx("div", { className: "mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700", children: error })), _jsxs("div", { className: "mt-5 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-slate-500", children: ["Press ", _jsx("kbd", { className: "rounded bg-slate-100 px-1.5 py-0.5 text-xs", children: "Esc" }), " to cancel,", _jsx("kbd", { className: "rounded bg-slate-100 px-1.5 py-0.5 text-xs ml-1", children: "Ctrl+Enter" }), " to save"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: cancelEdit, className: "rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-colors", disabled: disabled || saving, children: "Cancel" }), _jsx("button", { type: "button", disabled: saving || disabled || !!validationError, onClick: saveEdit, className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors", children: saving ? "Saving..." : "Save" })] })] })] }));
    }
    return (_jsxs("div", { className: `flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:-translate-y-0.5"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsx("h3", { className: "text-base font-semibold text-slate-900 truncate pr-2", children: project.name }) }), _jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [_jsx("button", { type: "button", onClick: startEdit, className: "rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors", "aria-label": "Edit project", title: "Edit project", disabled: disabled, children: _jsx(EditIcon, {}) }), _jsx("button", { type: "button", onClick: confirmDelete, className: "rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors", "aria-label": "Delete project", title: "Delete project", disabled: disabled, children: _jsx(TrashIcon, {}) })] })] }), _jsx("div", { className: "mt-3", children: _jsxs("span", { className: `inline-flex items-center gap-2 rounded border px-1 py-0.5 text-xs font-medium ${statusColors[project.status]}`, children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-current opacity-70" }), _jsx("span", { children: statusLabel[project.status] }), project.status === "COMPLETED" && (_jsx(CheckIcon, {}))] }) }), project.description && (_jsx("p", { className: "mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed", children: project.description })), _jsx("div", { className: "mt-4 pt-4 border-t border-slate-100", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-slate-700", children: "Status" }), _jsxs("select", { className: `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${statusColors[project.status]}`, value: project.status, onChange: (e) => handleStatusChange(e.target.value), disabled: disabled || statusSaving, children: [_jsx("option", { value: "NOT_STARTED", children: "Not started" }), _jsx("option", { value: "IN_PROGRESS", children: "In progress" }), _jsx("option", { value: "COMPLETED", children: "Completed" })] })] }) }), error && (_jsx("div", { className: "mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700", children: error }))] }));
};
export default ProjectCard;
