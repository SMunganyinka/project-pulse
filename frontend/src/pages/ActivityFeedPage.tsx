// src/pages/ActivityFeedPage.tsx
import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ActivityFeed from "../components/dashboard/ActivityFeed";

const ActivityFeedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          user={user}
          onAddProject={() => {}}
          onLogout={logout}
          isAddButtonDisabled={false}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100" role="main">
          {/* Center the content with a maximum width constraint */}
          <div className="flex justify-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
                <p className="mt-2 text-sm text-gray-700">Track recent activities and updates across your projects.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed - Takes up 2/3 of the space on large screens */}
                <div className="lg:col-span-2">
                  <ActivityFeed />
                </div>
                
                {/* Additional Content - Takes up 1/3 of the space on large screens */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Today's Activities</span>
                        <span className="text-sm font-medium text-gray-900">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="text-sm font-medium text-gray-900">38</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">This Month</span>
                        <span className="text-sm font-medium text-gray-900">124</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Activities</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="filter-projects"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="filter-projects" className="ml-2 block text-sm text-gray-900">
                          Project Updates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="filter-tasks"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="filter-tasks" className="ml-2 block text-sm text-gray-900">
                          Task Changes
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="filter-comments"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="filter-comments" className="ml-2 block text-sm text-gray-900">
                          Comments
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityFeedPage;