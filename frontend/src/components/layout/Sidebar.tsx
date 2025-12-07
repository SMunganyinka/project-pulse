// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Activity, // 1. Import the Activity icon
  Users,
  Settings,
  X,
} from 'lucide-react';

// ... (SidebarProps interface is the same)
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const linkClasses = (path: string) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? 'bg-indigo-100 text-indigo-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Project Pulse</h1>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link to="/" className={linkClasses('/')}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link to="/dashboard" className={linkClasses('/dashboard')}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/activityfeed" className={linkClasses('/activityfeed')}>
            <Activity className="h-5 w-5" /> {/* 2. Use the Activity icon */}
            <span>Activity Feed</span>
          </Link>
          <Link to="/team" className={linkClasses('/team')}>
            <Users className="h-5 w-5" />
            <span>Team</span>
          </Link>
          <Link to="/settings" className={linkClasses('/settings')}>
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;