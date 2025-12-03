import React, { useState, useEffect } from "react";
import type { CreateProjectPayload, ProjectStatus } from "../api/projects";

interface Props {
  onSubmit: (data: CreateProjectPayload) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  initialData?: Partial<CreateProjectPayload>; // For edit mode
}

interface FormErrors {
  name?: string;
  status?: string;
}

// Define a type that includes the empty string for the placeholder state
type StatusState = ProjectStatus | "";

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" }
];

// --- Icon Components ---
// 

const ExclamationIcon = () => (
  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 102 0zm-1-9a1 1 0 00-1 1v4a1 1 0 00-1 1z" clipRule="evenodd" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ProjectForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  disabled = false,
  initialData
}) => {
  const isEditMode = !!initialData?.name;
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  // Use the new StatusState type here
  const [status, setStatus] = useState<StatusState>(
    initialData?.status || ""
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  const validateField = (fieldName: string, value: string): string | undefined => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Project name is required";
        if (value.trim().length < 3) return "Project name must be at least 3 characters";
        if (value.length > 100) return "Project name must be less than 100 characters";
        break;
      case "status":
        if (!value) return "Status is required";
        break;
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField("name", name),
      status: validateField("status", status)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  // Handle field blur
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    if (fieldName === "name") {
      const error = validateField("name", name);
      setErrors((prev) => ({ ...prev, name: error }));
    } else if (fieldName === "status") {
      const error = validateField("status", status);
      setErrors((prev) => ({ ...prev, status: error }));
    }
  };

  // Handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === "name") setName(value);
    else if (fieldName === "description") setDescription(value);
    else if (fieldName === "status") setStatus(value as StatusState); // Cast to StatusState

    // Re-validate on change if the field has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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
        status: status as ProjectStatus
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
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = disabled || loading;
  const hasErrors = Object.values(errors).some((error) => error !== undefined);
  // Be explicit about checking for an empty string
  const canSubmit = name.trim() && status !== "" && !hasErrors;

  return (
    // Modal overlay without dark backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal content with shadow to make it stand out */}
      <div 
        className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl border border-gray-200 transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={onCancel}
          disabled={isDisabled}
        >
          <CloseIcon />
        </button>

        {/* Form Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditMode ? "Edit Project" : "Add New Project"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isEditMode
              ? "Update the details for your project."
              : "Fill out the details below to create a new project."}
          </p>
        </div>

        {/* Global Error Message */}
        {submitError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <div className="flex items-start gap-3">
              <ExclamationIcon />
              <span>{submitError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              className={`w-full rounded-lg border px-4 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                touched.name && errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed`}
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter project name"
              required
              disabled={isDisabled}
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={touched.name && errors.name ? "name-error" : undefined}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                <ExclamationIcon />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="project-description"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-none"
              rows={5}
              value={description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter project description (optional)"
              disabled={isDisabled}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Optional: Provide additional details about your project.
            </p>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="project-status" className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              id="project-status"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              value={status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              onBlur={() => handleBlur("status")}
              disabled={isDisabled}
              aria-label="Project status"
            >
              <option value="" disabled>Choose status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {touched.status && errors.status && (
              <p id="status-error" className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                <ExclamationIcon />
                {errors.status}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDisabled}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isDisabled || !canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <SpinnerIcon />}
              {loading ? "Saving..." : isEditMode ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;