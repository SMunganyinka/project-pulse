import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const statusOptions = [
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" }
];
// --- Icon Components ---
// 
const ExclamationIcon = () => (_jsx("svg", { className: "h-5 w-5 text-red-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 102 0zm-1-9a1 1 0 00-1 1v4a1 1 0 00-1 1z", clipRule: "evenodd" }) }));
const SpinnerIcon = () => (_jsxs("svg", { className: "h-4 w-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
const CloseIcon = () => (_jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }));
const ProjectForm = ({ onSubmit, onCancel, disabled = false, initialData }) => {
    const isEditMode = !!initialData?.name;
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    // Use the new StatusState type here
    const [status, setStatus] = useState(initialData?.status || "");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitError, setSubmitError] = useState(null);
    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setStatus(initialData.status || "");
            setErrors({});
            setTouched({});
        }
    }, [initialData]);
    // Validation function
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case "name":
                if (!value.trim())
                    return "Project name is required";
                if (value.trim().length < 3)
                    return "Project name must be at least 3 characters";
                if (value.length > 100)
                    return "Project name must be less than 100 characters";
                break;
            case "status":
                if (!value)
                    return "Status is required";
                break;
        }
        return undefined;
    };
    // Validate all fields
    const validateForm = () => {
        const newErrors = {
            name: validateField("name", name),
            status: validateField("status", status)
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== undefined);
    };
    // Handle field blur
    const handleBlur = (fieldName) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        if (fieldName === "name") {
            const error = validateField("name", name);
            setErrors((prev) => ({ ...prev, name: error }));
        }
        else if (fieldName === "status") {
            const error = validateField("status", status);
            setErrors((prev) => ({ ...prev, status: error }));
        }
    };
    // Handle input changes
    const handleInputChange = (fieldName, value) => {
        if (fieldName === "name")
            setName(value);
        else if (fieldName === "description")
            setDescription(value);
        else if (fieldName === "status")
            setStatus(value); // Cast to StatusState
        // Re-validate on change if the field has been touched
        if (touched[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors((prev) => ({ ...prev, [fieldName]: error }));
        }
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        // Mark all fields as touched
        setTouched({ name: true, status: true });
        // Validate form
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            // We can safely cast status to ProjectStatus here because validation ensures it's not an empty string
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                status: status
            });
            // Reset form on success
            if (!isEditMode) {
                setName("");
                setDescription("");
                setStatus("");
            }
            setErrors({});
            setTouched({});
            setSubmitError(null);
        }
        catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Failed to save project");
        }
        finally {
            setLoading(false);
        }
    };
    const isDisabled = disabled || loading;
    const hasErrors = Object.values(errors).some((error) => error !== undefined);
    // Be explicit about checking for an empty string
    const canSubmit = name.trim() && status !== "" && !hasErrors;
    return (
    // Modal overlay without dark backdrop
    _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl border border-gray-200 transition-all", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { type: "button", className: "absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500", onClick: onCancel, disabled: isDisabled, children: _jsx(CloseIcon, {}) }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-slate-900", children: isEditMode ? "Edit Project" : "Add New Project" }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: isEditMode
                                ? "Update the details for your project."
                                : "Fill out the details below to create a new project." })] }), submitError && (_jsx("div", { className: "mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(ExclamationIcon, {}), _jsx("span", { children: submitError })] }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "project-name", className: "block text-sm font-medium text-slate-700 mb-2", children: ["Project Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { id: "project-name", type: "text", className: `w-full rounded-lg border px-4 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${touched.name && errors.name
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"} disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed`, value: name, onChange: (e) => handleInputChange("name", e.target.value), onBlur: () => handleBlur("name"), placeholder: "Enter project name", required: true, disabled: isDisabled, "aria-invalid": touched.name && !!errors.name, "aria-describedby": touched.name && errors.name ? "name-error" : undefined }), touched.name && errors.name && (_jsxs("p", { id: "name-error", className: "mt-2 text-xs text-red-600 flex items-center gap-1.5", children: [_jsx(ExclamationIcon, {}), errors.name] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "project-description", className: "block text-sm font-medium text-slate-700 mb-2", children: "Description" }), _jsx("textarea", { id: "project-description", className: "w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-none", rows: 5, value: description, onChange: (e) => handleInputChange("description", e.target.value), placeholder: "Enter project description (optional)", disabled: isDisabled }), _jsx("p", { className: "mt-1.5 text-xs text-slate-500", children: "Optional: Provide additional details about your project." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "project-status", className: "block text-sm font-medium text-slate-700 mb-2", children: "Status" }), _jsxs("select", { id: "project-status", className: "w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed", value: status, onChange: (e) => handleInputChange("status", e.target.value), onBlur: () => handleBlur("status"), disabled: isDisabled, "aria-label": "Project status", children: [_jsx("option", { value: "", disabled: true, children: "Choose status" }), statusOptions.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] }), touched.status && errors.status && (_jsxs("p", { id: "status-error", className: "mt-2 text-xs text-red-600 flex items-center gap-1.5", children: [_jsx(ExclamationIcon, {}), errors.status] }))] }), _jsxs("div", { className: "flex justify-end gap-3 pt-6", children: [onCancel && (_jsx("button", { type: "button", onClick: onCancel, className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60", disabled: isDisabled, children: "Cancel" })), _jsxs("button", { type: "submit", disabled: isDisabled || !canSubmit, className: "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60", children: [loading && _jsx(SpinnerIcon, {}), loading ? "Saving..." : isEditMode ? "Update Project" : "Create Project"] })] })] })] }) }));
};
export default ProjectForm;
