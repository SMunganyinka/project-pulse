import React, { useMemo, useState, useCallback, useRef } from "react";
import type { Project, ProjectStatus } from "../api/projects";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
  onStatusChange: (id: number, status: ProjectStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (
    id: number,
    data: { name: string; description?: string; status: ProjectStatus }
  ) => Promise<void>;
  disabled: boolean;
  loading?: boolean;
}

type BoardMode = "list" | "board";
type FilterStatus = "ALL" | ProjectStatus;

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NOT_STARTED", label: "Not started" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" }
];

const COLUMN_CONFIG: { status: ProjectStatus; label: string; color: string }[] = [
  { status: "NOT_STARTED", label: "Not Started", color: "bg-slate-100" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-blue-50" },
  { status: "COMPLETED", label: "Completed", color: "bg-green-50" }
];

const SearchIcon = () => (
  <svg
    className="h-4 w-4 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const BoardIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const ProjectBoard: React.FC<Props> = ({
  projects,
  onStatusChange,
  onDelete,
  onUpdate,
  disabled,
  loading = false
}) => {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [mode, setMode] = useState<BoardMode>("board");
  const [search, setSearch] = useState("");
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ProjectStatus | null>(null);
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
    const result: Record<ProjectStatus, Project[]> = {
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
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (normalizedSearch) {
        return (
          p.name.toLowerCase().includes(normalizedSearch) ||
          (p.description ?? "").toLowerCase().includes(normalizedSearch)
        );
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
  const handleStatusFilterChange = useCallback((status: FilterStatus) => {
    setStatusFilter(status);
  }, []);

  const handleModeChange = useCallback((newMode: BoardMode) => {
    setMode(newMode);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleDragStart = useCallback((e: React.DragEvent, project: Project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    
    if (dragCounter.current === 0) {
      setDragOverStatus(null);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverStatus(status);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, status: ProjectStatus) => {
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
  const chipClass = useCallback(
    (active: boolean) =>
      `rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`,
    []
  );

  const viewButtonClass = useCallback(
    (active: boolean) =>
      `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`,
    []
  );

  // Highlight search terms in text
 

  return (
    <div className="space-y-4">
      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Total Projects</div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Not Started</div>
          <div className="text-2xl font-bold text-slate-600">{stats.byStatus.NOT_STARTED}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{stats.byStatus.IN_PROGRESS}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.byStatus.COMPLETED}</div>
        </div>
      </div>

      {/* Controls Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filters - Toggleable on mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700"
          >
            <FilterIcon />
            Filters
          </button>
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-2`}>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                className={chipClass(statusFilter === value)}
                onClick={() => handleStatusFilterChange(value)}
                disabled={disabled}
                aria-label={`Filter by ${label}`}
                aria-pressed={statusFilter === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </div>
            <input
              type="search"
              className="w-40 rounded-md border border-slate-200 py-1.5 pl-9 pr-8 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-56"
              placeholder="Search projects..."
              value={search}
              onChange={handleSearchChange}
              disabled={disabled}
              aria-label="Search projects"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => handleModeChange("list")}
              className={viewButtonClass(mode === "list")}
              disabled={disabled}
              aria-label="List view"
              aria-pressed={mode === "list"}
              title="List view"
            >
              <ListIcon />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => handleModeChange("board")}
              className={viewButtonClass(mode === "board")}
              disabled={disabled}
              aria-label="Board view"
              aria-pressed={mode === "board"}
              title="Board view"
            >
              <BoardIcon />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {stats.isFiltering && (
        <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span>
            Showing <strong>{stats.filtered}</strong> of <strong>{stats.total}</strong> projects
          </span>
          <button
            onClick={handleClearFilters}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {mode === "list" ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onStatusChange={(status) => onStatusChange(project.id, status)}
                  onDelete={() => onDelete(project.id)}
                  onUpdate={(data) => onUpdate(project.id, data)}
                  disabled={disabled}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-slate-100 p-3 mb-3">
                    <svg
                      className="h-6 w-6 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">No projects found</p>
                  <p className="text-sm text-slate-500">
                    {search || statusFilter !== "ALL"
                      ? "Try adjusting your filters"
                      : "Create your first project to get started"}
                  </p>
                  {search || statusFilter !== "ALL" ? (
                    <button
                      onClick={handleClearFilters}
                      className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Clear filters
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {COLUMN_CONFIG.map(({ status, label, color }) => (
                <div
                  key={status}
                  className={`flex flex-col gap-2 rounded-xl border border-slate-200 ${color} p-3 min-h-[200px] ${
                    dragOverStatus === status ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragEnter={(e) => handleDragEnter(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {label}
                    </h3>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {grouped[status].length}
                    </span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {grouped[status].map((project) => (
                      <div
                        key={project.id}
                        draggable={!disabled}
                        onDragStart={(e) => handleDragStart(e, project)}
                        onDragEnd={handleDragEnd}
                        className={draggedProject?.id === project.id ? 'opacity-50' : ''}
                      >
                        <ProjectCard
                          project={project}
                          onStatusChange={(s) => onStatusChange(project.id, s)}
                          onDelete={() => onDelete(project.id)}
                          onUpdate={(data) => onUpdate(project.id, data)}
                          disabled={disabled}
                        />
                      </div>
                    ))}
                    {grouped[status].length === 0 && (
                      <div className="flex items-center justify-center py-8 text-center">
                        <p className="text-xs text-slate-400">
                          {dragOverStatus === status ? 'Drop here' : 'No projects yet'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectBoard;