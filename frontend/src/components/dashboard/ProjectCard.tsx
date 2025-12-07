import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Project, ProjectStatus } from "../../api/projects";

interface EditPayload {
  name: string;
  description?: string;
  status: ProjectStatus;
}

interface Props {
  project: Project;
  onStatusChange: (status: ProjectStatus) => void;
  onDelete: () => void;
  onUpdate: (data: EditPayload) => Promise<void>;
  disabled: boolean;
}

// --- Common Props for Icons ---
interface IconProps {
  className?: string;
}

const statusLabel: Record<ProjectStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed"
};

const statusColors: Record<ProjectStatus, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700 border-slate-200",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200"
};

// --- Icon Components ---
const EditIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${className ?? ''}`}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M4 20h4l10.5-10.5a1.5 1.5 0 1 0-2.12-2.12L6 17.88V20z" />
    <path d="M13.5 6.5 17 10" />
  </svg>
);

const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${className ?? ''}`}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M5 7h14" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 12a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7" />
    <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
  </svg>
);

const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-3 w-3 ${className ?? ''}`}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ProjectCard: React.FC<Props> = ({
  project,
  onDelete,
  onUpdate,
  disabled
}) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDescription, setEditDescription] = useState(project.description ?? "");
  const [editStatus, setEditStatus] = useState<ProjectStatus>(project.status);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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
  const validateName = useCallback((name: string): string | null => {
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

  const handleStatusChange = useCallback(async (newStatus: ProjectStatus) => {
    if (disabled || statusSaving || newStatus === project.status) return;

    setStatusSaving(true);
    try {
      await onUpdate({
        name: project.name,
        description: project.description ?? undefined,
        status: newStatus
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  }, [disabled, statusSaving, project, onUpdate]);

  const startEdit = useCallback(() => {
    if (disabled) return;
    setEditName(project.name);
    setEditDescription(project.description ?? "");
    setEditStatus(project.status);
    setError(null);
    setValidationError(null);
    setEditing(true);
  }, [disabled, project]);

  const cancelEdit = useCallback(() => {
    if (disabled || saving) return;
    setEditing(false);
    setError(null);
    setValidationError(null);
  }, [disabled, saving]);

  const saveEdit = useCallback(async () => {
    if (disabled || saving) return;

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setSaving(false);
    }
  }, [disabled, saving, editName, editDescription, editStatus, onUpdate, validateName]);

  const confirmDelete = useCallback(() => {
    if (disabled) return;
    const ok = window.confirm(
      `Are you sure you want to delete project "${project.name}"? This action cannot be undone.`
    );
    if (ok) {
      onDelete();
    }
  }, [disabled, project.name, onDelete]);

  // Keyboard shortcuts for edit mode
  useEffect(() => {
    if (!editing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelEdit();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        saveEdit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editing, cancelEdit, saveEdit]);

  if (editing) {
    return (
      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-md transition-all">
        <div className="space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              ref={nameInputRef}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300"
              }`}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={disabled || saving}
              placeholder="Project name"
              aria-invalid={!!validationError}
              aria-describedby={validationError ? "name-error" : undefined}
            />
            {validationError && (
              <p id="name-error" className="mt-1.5 text-xs text-red-600">
                {validationError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="project-description"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={disabled || saving}
              placeholder="Project description (optional)"
            />
          </div>

          <div>
            <label htmlFor="project-status" className="block text-sm font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <select
              id="project-status"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
              disabled={disabled || saving}
            >
              <option value="NOT_STARTED">Not started</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Esc</kbd> to cancel, 
            <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs ml-1">Ctrl+Enter</kbd> to save
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
              disabled={disabled || saving}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || disabled || !!validationError}
              onClick={saveEdit}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ${
      disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:-translate-y-0.5"
    }`}>
      {/* Card Header with Title and Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 truncate pr-2">
            {project.name}
          </h3>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            aria-label="Edit project"
            title="Edit project"
            disabled={disabled}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            aria-label="Delete project"
            title="Delete project"
            disabled={disabled}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Status Badge under title */}
      <div className="mt-3">
        <span className={`inline-flex items-center gap-2 rounded border px-1 py-0.5 text-xs font-medium ${
          statusColors[project.status]
        }`}>
          <span className="h-2 w-2 rounded-full bg-current opacity-70" />
          <span>{statusLabel[project.status]}</span>
          {project.status === "COMPLETED" && (
            <CheckIcon />
          )}
        </span>
      </div>

      {/* Project Description */}
      {project.description && (
        <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Status Section with Dropdown at bottom */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              statusColors[project.status]
            }`}
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
            disabled={disabled || statusSaving}
          >
            <option value="NOT_STARTED">Not started</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;