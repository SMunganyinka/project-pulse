import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Project, ProjectStatus } from "../api/projects";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import ProjectStats from "../components/ProjectStats";
import ProjectBoard from "../components/ProjectBoard";
import ProjectForm from "../components/ProjectForm";
import Alert from "../components/Alert";

// A more robust notification state
interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAddForm, setShowAddForm] = useState(false); // State for the form
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;

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
    } catch (err: any) {
      const id = Date.now().toString();
      let message = "Failed to load projects.";

      if (err.message === "Network Error") {
        message = "Network error. Please check your connection and try again.";
      } else if (err.response?.status >= 500) {
        message = "Server error. Please try again later.";
      } else if (err.response?.data?.detail) {
        message = err.response.data.detail;
      }
      
      setNotifications((prev) => [...prev, { id, type: "error", message }]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleShowNotification = useCallback(
    (message: string, type: "success" | "error") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const handleCreate = useCallback(
    async (payload: {
      name: string;
      description?: string;
      status?: ProjectStatus;
    }) => {
      setActionLoading((prev) => ({ ...prev, create: true }));
      try {
        const created = await createProject(payload);
        setProjects((prev) => [...prev, created]);
        handleShowNotification("Project created successfully.", "success");
        setShowAddForm(false); // Hide the form after successful creation
      } catch (err: any) {
        let message = "Failed to create project.";
        if (err.response?.data?.detail) {
          message = err.response.data.detail;
        }
        handleShowNotification(message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [handleShowNotification]
  );

  const handleStatusChange = useCallback(
    async (id: number, status: ProjectStatus) => {
      setActionLoading((prev) => ({ ...prev, [`status-${id}`]: true }));
      try {
        const updated = await updateProject(id, { status });
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        handleShowNotification("Project status updated.", "success");
      } catch (err: any) {
        let message = "Failed to update project.";
        if (err.response?.data?.detail) {
          message = err.response.data.detail;
        }
        handleShowNotification(message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, [`status-${id}`]: false }));
      }
    },
    [handleShowNotification]
  );

  const handleUpdate = useCallback(
    async (
      id: number,
      data: { name: string; description?: string; status: ProjectStatus }
    ) => {
      setActionLoading((prev) => ({ ...prev, [`update-${id}`]: true }));
      try {
        const updated = await updateProject(id, data);
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        handleShowNotification("Project updated.", "success");
      } catch (err: any) {
        let message = "Failed to update project.";
        if (err.response?.data?.detail) {
          message = err.response.data.detail;
        }
        handleShowNotification(message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, [`update-${id}`]: false }));
      }
    },
    [handleShowNotification]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const projectToDelete = projects.find((p) => p.id === id);
      if (!projectToDelete) {
        handleShowNotification("Project not found.", "error");
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone.`
      );
      if (!confirmed) return;

      setActionLoading((prev) => ({ ...prev, [`delete-${id}`]: true }));
      try {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        handleShowNotification("Project deleted.", "success");
      } catch (err: any) {
        let message = "Failed to delete project.";
        if (err.response?.data?.detail) {
          message = err.response.data.detail;
        }
        handleShowNotification(message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, [`delete-${id}`]: false }));
      }
    },
    [handleShowNotification, projects] // Added projects to dependencies
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="sticky top-14 z-30 bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Dashboard
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Welcome{user?.full_name ? `, ${user.full_name}` : ""}
              </h1>
              <p className="mt-1 text-xs text-slate-600">
                You&apos;re tracking{" "}
                <span className="font-semibold text-slate-900">
                  {projects.length} project{projects.length === 1 ? "" : "s"}
                </span>{" "}
                in this workspace.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              + Add New project
            </button>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <Alert key={notif.id} type={notif.type} message={notif.message} />
        ))}
      </div>

      {/* Main Content - Single Column Layout */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {/* Add Project Form - Appears above the board */}
            {showAddForm && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Add New Project</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill out the details below to create a new project.
                  </p>
                </div>
                <ProjectForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowAddForm(false)}
                  disabled={actionLoading.create}
                />
              </div>
            )}
            
            {/* Stats */}
            <ProjectStats projects={projects} />
            
            {/* Project Board */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <ProjectBoard
                projects={projects}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                disabled={Object.keys(actionLoading).some((key) => actionLoading[key])}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;