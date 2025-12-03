import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState, useCallback, useRef } from "react";
import ProjectCard from "./ProjectCard";
const STATUS_OPTIONS = [
    { value: "ALL", label: "All" },
    { value: "NOT_STARTED", label: "Not started" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "COMPLETED", label: "Completed" }
];
const COLUMN_CONFIG = [
    { status: "NOT_STARTED", label: "Not Started", color: "bg-slate-100" },
    { status: "IN_PROGRESS", label: "In Progress", color: "bg-blue-50" },
    { status: "COMPLETED", label: "Completed", color: "bg-green-50" }
];
const SearchIcon = () => (_jsx("svg", { className: "h-4 w-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }));
const ListIcon = () => (_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }));
const BoardIcon = () => (_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" }) }));
const FilterIcon = () => (_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }) }));
const ProjectBoard = ({ projects, onStatusChange, onDelete, onUpdate, disabled, loading = false }) => {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [mode, setMode] = useState("board");
    const [search, setSearch] = useState("");
    const [draggedProject, setDraggedProject] = useState(null);
    const [dragOverStatus, setDragOverStatus] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const dragCounter = useRef(0);
    // Memoize search normalization
    const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);
    // Filter and search logic
    const filtered = useMemo(() => {
        return projects.filter((project) => {
            // Status filter
            if (statusFilter !== "ALL" && project.status !== statusFilter) {
                return false;
            }
            // Search filter
            if (normalizedSearch) {
                const nameMatch = project.name.toLowerCase().includes(normalizedSearch);
                const descMatch = (project.description ?? "")
                    .toLowerCase()
                    .includes(normalizedSearch);
                return nameMatch || descMatch;
            }
            return true;
        });
    }, [projects, statusFilter, normalizedSearch]);
    // Group projects by status for board view
    const grouped = useMemo(() => {
        const result = {
            NOT_STARTED: [],
            IN_PROGRESS: [],
            COMPLETED: []
        };
        filtered.forEach((project) => {
            result[project.status].push(project);
        });
        return result;
    }, [filtered]);
    // Calculate statistics
    const stats = useMemo(() => {
        const total = projects.length;
        const filteredCount = projects.filter((p) => {
            if (statusFilter !== "ALL" && p.status !== statusFilter)
                return false;
            if (normalizedSearch) {
                return (p.name.toLowerCase().includes(normalizedSearch) ||
                    (p.description ?? "").toLowerCase().includes(normalizedSearch));
            }
            return true;
        }).length;
        const byStatus = {
            NOT_STARTED: projects.filter(p => p.status === "NOT_STARTED").length,
            IN_PROGRESS: projects.filter(p => p.status === "IN_PROGRESS").length,
            COMPLETED: projects.filter(p => p.status === "COMPLETED").length,
        };
        return {
            total,
            filtered: filteredCount,
            isFiltering: statusFilter !== "ALL" || !!normalizedSearch,
            byStatus
        };
    }, [projects, statusFilter, normalizedSearch]);
    // Memoized handlers
    const handleStatusFilterChange = useCallback((status) => {
        setStatusFilter(status);
    }, []);
    const handleModeChange = useCallback((newMode) => {
        setMode(newMode);
    }, []);
    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);
    const handleClearSearch = useCallback(() => {
        setSearch("");
    }, []);
    const handleClearFilters = useCallback(() => {
        setStatusFilter("ALL");
        setSearch("");
    }, []);
    // Drag and drop handlers
    const handleDragStart = useCallback((e, project) => {
        setDraggedProject(project);
        e.dataTransfer.effectAllowed = 'move';
    }, []);
    const handleDragOver = useCallback((e, status) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverStatus(status);
    }, []);
    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragOverStatus(null);
        }
    }, []);
    const handleDragEnter = useCallback((e, status) => {
        e.preventDefault();
        dragCounter.current++;
        setDragOverStatus(status);
    }, []);
    const handleDrop = useCallback((e, status) => {
        e.preventDefault();
        dragCounter.current = 0;
        setDragOverStatus(null);
        if (draggedProject && draggedProject.status !== status) {
            onStatusChange(draggedProject.id, status);
        }
        setDraggedProject(null);
    }, [draggedProject, onStatusChange]);
    const handleDragEnd = useCallback(() => {
        setDraggedProject(null);
        setDragOverStatus(null);
        dragCounter.current = 0;
    }, []);
    // Style helpers
    const chipClass = useCallback((active) => `rounded-full px-3 py-1 text-xs font-medium transition-colors ${active
        ? "bg-indigo-600 text-white shadow-sm"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`, []);
    const viewButtonClass = useCallback((active) => `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active
        ? "bg-slate-900 text-white shadow-sm"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`, []);
    // Highlight search terms in text
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4", children: [_jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-3 shadow-sm", children: [_jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Total Projects" }), _jsx("div", { className: "text-2xl font-bold text-slate-900", children: stats.total })] }), _jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-3 shadow-sm", children: [_jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Not Started" }), _jsx("div", { className: "text-2xl font-bold text-slate-600", children: stats.byStatus.NOT_STARTED })] }), _jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-3 shadow-sm", children: [_jsx("div", { className: "text-xs text-slate-500 mb-1", children: "In Progress" }), _jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.byStatus.IN_PROGRESS })] }), _jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-3 shadow-sm", children: [_jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Completed" }), _jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.byStatus.COMPLETED })] })] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "md:hidden flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700", children: [_jsx(FilterIcon, {}), "Filters"] }), _jsx("div", { className: `${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-2`, children: STATUS_OPTIONS.map(({ value, label }) => (_jsx("button", { className: chipClass(statusFilter === value), onClick: () => handleStatusFilterChange(value), disabled: disabled, "aria-label": `Filter by ${label}`, "aria-pressed": statusFilter === value, children: label }, value))) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3", children: _jsx(SearchIcon, {}) }), _jsx("input", { type: "search", className: "w-40 rounded-md border border-slate-200 py-1.5 pl-9 pr-8 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-56", placeholder: "Search projects...", value: search, onChange: handleSearchChange, disabled: disabled, "aria-label": "Search projects" }), search && (_jsx("button", { type: "button", onClick: handleClearSearch, className: "absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600", "aria-label": "Clear search", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }), _jsxs("div", { className: "flex gap-1 rounded-lg bg-slate-100 p-1", children: [_jsxs("button", { onClick: () => handleModeChange("list"), className: viewButtonClass(mode === "list"), disabled: disabled, "aria-label": "List view", "aria-pressed": mode === "list", title: "List view", children: [_jsx(ListIcon, {}), _jsx("span", { className: "hidden sm:inline", children: "List" })] }), _jsxs("button", { onClick: () => handleModeChange("board"), className: viewButtonClass(mode === "board"), disabled: disabled, "aria-label": "Board view", "aria-pressed": mode === "board", title: "Board view", children: [_jsx(BoardIcon, {}), _jsx("span", { className: "hidden sm:inline", children: "Board" })] })] })] })] }), stats.isFiltering && (_jsxs("div", { className: "flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600", children: [_jsxs("span", { children: ["Showing ", _jsx("strong", { children: stats.filtered }), " of ", _jsx("strong", { children: stats.total }), " projects"] }), _jsx("button", { onClick: handleClearFilters, className: "text-indigo-600 hover:text-indigo-700 font-medium", children: "Clear filters" })] })), loading && (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" }) })), !loading && (_jsx(_Fragment, { children: mode === "list" ? (_jsxs("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3", children: [filtered.map((project) => (_jsx(ProjectCard, { project: project, onStatusChange: (status) => onStatusChange(project.id, status), onDelete: () => onDelete(project.id), onUpdate: (data) => onUpdate(project.id, data), disabled: disabled }, project.id))), filtered.length === 0 && (_jsxs("div", { className: "col-span-full flex flex-col items-center justify-center py-12 text-center", children: [_jsx("div", { className: "rounded-full bg-slate-100 p-3 mb-3", children: _jsx("svg", { className: "h-6 w-6 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("p", { className: "text-sm font-medium text-slate-900 mb-1", children: "No projects found" }), _jsx("p", { className: "text-sm text-slate-500", children: search || statusFilter !== "ALL"
                                        ? "Try adjusting your filters"
                                        : "Create your first project to get started" }), search || statusFilter !== "ALL" ? (_jsx("button", { onClick: handleClearFilters, className: "mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors", children: "Clear filters" })) : null] }))] })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-3", children: COLUMN_CONFIG.map(({ status, label, color }) => (_jsxs("div", { className: `flex flex-col gap-2 rounded-xl border border-slate-200 ${color} p-3 min-h-[200px] ${dragOverStatus === status ? 'ring-2 ring-indigo-500' : ''}`, onDragOver: (e) => handleDragOver(e, status), onDragEnter: (e) => handleDragEnter(e, status), onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, status), children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-slate-600", children: label }), _jsx("span", { className: "rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600", children: grouped[status].length })] }), _jsxs("div", { className: "space-y-2 flex-1", children: [grouped[status].map((project) => (_jsx("div", { draggable: !disabled, onDragStart: (e) => handleDragStart(e, project), onDragEnd: handleDragEnd, className: draggedProject?.id === project.id ? 'opacity-50' : '', children: _jsx(ProjectCard, { project: project, onStatusChange: (s) => onStatusChange(project.id, s), onDelete: () => onDelete(project.id), onUpdate: (data) => onUpdate(project.id, data), disabled: disabled }) }, project.id))), grouped[status].length === 0 && (_jsx("div", { className: "flex items-center justify-center py-8 text-center", children: _jsx("p", { className: "text-xs text-slate-400", children: dragOverStatus === status ? 'Drop here' : 'No projects yet' }) }))] })] }, status))) })) }))] }));
};
export default ProjectBoard;
