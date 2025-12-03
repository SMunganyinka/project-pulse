import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const displayName = user?.full_name ?? user?.email ?? "";
  const userInitial = displayName.charAt(0).toUpperCase();

  const toggle = useCallback(() => setOpen((prevOpen) => !prevOpen), []);
  const close = useCallback(() => setOpen(false), []);
  const toggleProfile = useCallback(() => setProfileOpen((prevOpen) => !prevOpen), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    close();
    closeProfile();
  }, [logout, close, closeProfile]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            P
          </span>
          <span className="text-sm font-semibold text-slate-900">
            Project Pulse
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/features" className={linkClass}>
            Features
          </NavLink>
          
          {/* Only show Dashboard link when authenticated */}
          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {userInitial}
                </span>
                <span className="hidden md:inline">{displayName}</span>
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Get started
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-2">
            <NavLink to="/" className={linkClass} onClick={close}>
              Home
            </NavLink>
            <NavLink to="/features" className={linkClass} onClick={close}>
              Features
            </NavLink>
            
            {/* Only show Dashboard link when authenticated */}
            {isAuthenticated && (
              <NavLink to="/dashboard" className={linkClass} onClick={close}>
                Dashboard
              </NavLink>
            )}

            {isAuthenticated ? (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {userInitial}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={close}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  onClick={close}
                >
                  Get started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;