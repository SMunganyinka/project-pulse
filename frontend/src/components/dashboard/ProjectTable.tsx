// src/components/dashboard/ProjectTable.tsx
import React, { useState } from 'react';
import type { Project, ProjectStatus } from '../../api/projects';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onStatusChange: (id: number, status: ProjectStatus) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: { name: string; description: string; status: ProjectStatus }) => void;
  disabled?: boolean;
}

const statusColors: Record<ProjectStatus, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onStatusChange,
  onDelete,
  onUpdate,
  disabled
}) => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Project Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900">
                {project.name}
              </td>
              <td className="whitespace-nowrap py-4 px-6 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </td>
              <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdate(project.id, { name: project.name, description: project.description || '', status: project.status })}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Project"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;