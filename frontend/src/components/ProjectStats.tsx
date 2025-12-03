import React, { useMemo } from "react";
import type { Project } from "../api/projects";

interface Props {
  projects: Project[];
}

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  color: "default" | "indigo" | "emerald" | "amber";
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  description,
  color,
  icon,
  trend,
  progress
}) => {
  const colorClasses = {
    default: {
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      valueColor: "text-slate-900",
      progressBg: "bg-slate-500"
    },
    indigo: {
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      valueColor: "text-indigo-700",
      progressBg: "bg-indigo-500"
    },
    emerald: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
      progressBg: "bg-emerald-500"
    },
    amber: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
      progressBg: "bg-amber-500"
    }
  };

  const styles = colorClasses[color];

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${styles.valueColor}`}>{value}</p>
            {trend && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  trend.isPositive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend.isPositive ? (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${styles.iconBg} ${styles.iconColor} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span className="font-medium">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full ${styles.progressBg} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectStats: React.FC<Props> = ({ projects }) => {
  const stats = useMemo(() => {
    const total = projects.length;
    const notStarted = projects.filter((p) => p.status === "NOT_STARTED").length;
    const inProgress = projects.filter((p) => p.status === "IN_PROGRESS").length;
    const completed = projects.filter((p) => p.status === "COMPLETED").length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const activeRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const notStartedRate = total > 0 ? Math.round((notStarted / total) * 100) : 0;

    return {
      total,
      notStarted,
      inProgress,
      completed,
      completionRate,
      activeRate,
      notStartedRate
    };
  }, [projects]);

  // Icons
  const TotalIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );

  const NotStartedIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const InProgressIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );

  const CompletedIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  // Empty state
  if (stats.total === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <svg
              className="h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            No Projects Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Create your first project to start tracking your progress and see statistics here.
          </p>
          <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
            Create Your First Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Project Overview</h2>
        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={stats.total}
          description="All projects you're currently tracking across all stages."
          color="default"
          icon={<TotalIcon />}
        />

        <StatCard
          label="Not Started"
          value={stats.notStarted}
          description="Ideas and tasks that haven't kicked off yet."
          color="amber"
          icon={<NotStartedIcon />}
          progress={stats.notStartedRate}
        />

        <StatCard
          label="In Progress"
          value={stats.inProgress}
          description="Work currently moving through your pipeline."
          color="indigo"
          icon={<InProgressIcon />}
          progress={stats.activeRate}
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          description="Successfully finished projects and deliverables."
          color="emerald"
          icon={<CompletedIcon />}
          progress={stats.completionRate}
        />
      </div>

      {/* Additional Insights */}
      {stats.total > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Insights</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Productivity Score */}
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Productivity
              </div>
              <p className="text-2xl font-bold text-indigo-700">
                {stats.inProgress > stats.notStarted ? "High" : stats.inProgress > 0 ? "Medium" : "Low"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {stats.inProgress} active / {stats.notStarted} pending
              </p>
            </div>

            {/* Success Rate */}
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Success Rate
              </div>
              <p className="text-2xl font-bold text-emerald-700">{stats.completionRate}%</p>
              <p className="mt-1 text-xs text-slate-600">
                {stats.completed} of {stats.total} completed
              </p>
            </div>

            {/* Active Focus */}
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Active Focus
              </div>
              <p className="text-2xl font-bold text-amber-700">
                {stats.inProgress > 0 ? `${stats.inProgress}` : "None"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {stats.inProgress > 0
                  ? `${stats.inProgress} project${stats.inProgress > 1 ? "s" : ""} in progress`
                  : "Start working on projects"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStats;