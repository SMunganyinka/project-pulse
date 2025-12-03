import api from "./client";

export type ProjectStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  owner_id: number;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get<Project[]>("/projects/");
  return res.data;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const res = await api.post<Project>("/projects/", payload);
  return res.data;
}

export async function updateProject(id: number, payload: UpdateProjectPayload): Promise<Project> {
  const res = await api.patch<Project>(`/projects/${id}`, payload);
  return res.data;
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/projects/${id}`);
}