// src/pages/DashboardPage.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Project, ProjectStatus } from "../api/projects";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";

// --- Import Layout Components ---
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

// --- Import Content Components ---
import ProjectStats from "../components/dashboard/ProjectStats";
import ProjectBoard from "../components/dashboard/ProjectBoard";
import ProjectForm from "../components/dashboard/ProjectForm";
import Alert from "../components/Alert";

// A more robust notification state
interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

const DashboardPage: React.FC = () => {
  // Get user and logout function from the authentication context
  const { user, logout } = useAuth();
  
  // --- State for Projects and UI ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // --- STATE TO CONTROL THE MODAL ---
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // --- State for Sidebar ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- HANDLER FUNCTIONS ---
  const handleShowNotification = useCallback(
    (message: string, type: "success" | "error") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      let message = "Failed to load projects.";
      if (err.message === "Network Error") {
        message = "Network error. Please check your connection and try again.";
      } else if (err.response?.status >= 500) {
        message = "Server error. Please try again later.";
      } else if (err.response?.data?.detail) {
        message = err.response.data.detail;
      }
      handleShowNotification(message, "error");
    } finally {
      setLoading(false);
    }
  }, [handleShowNotification]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleCreate = useCallback(
    async (payload: { name: string; description?: string; status?: ProjectStatus }) => {
      setActionLoading((prev) => ({ ...prev, create: true }));
      try {
        const created = await createProject(payload);
        setProjects((prev) => [...prev, created]);
        handleShowNotification("Project created successfully.", "success");
        setShowAddForm(false); // Close the form on success
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
    async (id: number, data: { name: string; description?: string; status: ProjectStatus }) => {
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
      const confirmed = window.confirm(`Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone.`);
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
    [handleShowNotification, projects]
  );

  // --- RENDER ---
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          user={user}
          // This button sets the state to true, which shows the modal
          onAddProject={() => setShowAddForm(true)}
          onLogout={logout}
          isAddButtonDisabled={actionLoading.create}
          toggleSidebar={toggleSidebar}
        />
   
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {/* Center the content with a maximum width constraint */}
          <div className="flex justify-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-sm text-gray-700">Overview of your projects and recent activity.</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  <ProjectStats projects={projects} />
                  <ProjectBoard
                    projects={projects}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    disabled={Object.keys(actionLoading).some((key) => actionLoading[key])}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL SECTION --- */}
      {/* This block only renders when showAddForm is true */}
      {showAddForm && (
        <ProjectForm
          onSubmit={handleCreate}
          // The 'X' and 'Cancel' buttons inside the form will call this
          onCancel={() => setShowAddForm(false)}
          disabled={actionLoading.create}
        />
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <Alert key={notif.id} type={notif.type} message={notif.message} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;