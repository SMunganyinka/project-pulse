// src/components/layout/Topbar.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Bell, LogOut, Plus, ChevronDown, Menu } from 'lucide-react'; // Add Menu icon
import { User as UserType } from '../../api/auth';

interface TopbarProps {
  user: UserType | null;
  onAddProject: () => void;
  onLogout: () => void;
  isAddButtonDisabled?: boolean;
  toggleSidebar?: () => void; // Add this prop for toggling sidebar
}

const Topbar: React.FC<TopbarProps> = ({ 
  user, 
  onAddProject, 
  onLogout, 
  isAddButtonDisabled,
  toggleSidebar // Add this prop
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.full_name ?? user?.email ?? "";
  const userInitial = displayName.charAt(0).toUpperCase();

  const toggleProfile = useCallback(() => {
    setProfileOpen((prevOpen) => !prevOpen);
  }, []);

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    onLogout();
    closeProfile();
  }, [onLogout, closeProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        closeProfile();
      }
    };

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen, closeProfile]);

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      
      {/* Left Side: Menu button for mobile and Welcome Message */}
      <div className="flex items-center">
        {/* Menu button - only visible on mobile screens */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome, {user?.full_name || user?.email || 'Guest'}
        </h1>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Add New Project Button */}
        <button
          onClick={onAddProject}
          disabled={isAddButtonDisabled}
          className="hidden sm:flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {userInitial}
            </span>
            <span className="hidden md:inline">{displayName}</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                <p className="font-medium">{displayName}</p>
                <p className="text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;