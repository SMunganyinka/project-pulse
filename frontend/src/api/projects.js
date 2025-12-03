import api from "./client";
export async function fetchProjects() {
    const res = await api.get("/projects/");
    return res.data;
}
export async function createProject(payload) {
    const res = await api.post("/projects/", payload);
    return res.data;
}
export async function updateProject(id, payload) {
    const res = await api.patch(`/projects/${id}`, payload);
    return res.data;
}
export async function deleteProject(id) {
    await api.delete(`/projects/${id}`);
}
