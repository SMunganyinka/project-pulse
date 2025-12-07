// src/pages/TeamPage.tsx
import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';

// --- Define mock data with a simple inline object type ---
const mockTeamMembers: { 
  id: number; 
  full_name: string | null; 
  email: string | null; 
  role: string;
  phone?: string;
  location?: string;
  joinDate?: string;
  status: 'active' | 'away' | 'busy';
}[] = [
  { 
    id: 1, 
    full_name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: 'Admin',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2022-01-15',
    status: 'active'
  },
  { 
    id: 2, 
    full_name: 'Bob Williams', 
    email: 'bob@example.com', 
    role: 'Developer',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    joinDate: '2022-03-22',
    status: 'busy'
  },
  { 
    id: 3, 
    full_name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    role: 'Designer',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    joinDate: '2022-05-10',
    status: 'away'
  },
  { 
    id: 4, 
    full_name: null, 
    email: 'new.user@example.com', 
    role: 'Developer',
    status: 'active'
  }, 
];

const TeamPage: React.FC = () => {
  // Get user and logout function from authentication context
  const { user, logout } = useAuth();
  
  // --- State for Sidebar ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  // --- State for Search ---
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- State for Role Filter ---
  const [roleFilter, setRoleFilter] = useState('all');
  
  // --- State for View Mode ---
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // --- Filter team members based on search and role ---
  const filteredTeamMembers = mockTeamMembers.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // --- Get unique roles for filter dropdown ---
  const uniqueRoles = ['all', ...Array.from(new Set(mockTeamMembers.map(member => member.role)))];
  
  // --- Get status color ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'away': return 'bg-yellow-100 text-yellow-800';
      case 'busy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // --- Get role color ---
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Developer': return 'bg-blue-100 text-blue-800';
      case 'Designer': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                <p className="mt-2 text-sm text-gray-700">Manage your team members and their roles.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content - Takes up 3/4 of space on large screens */}
                <div className="lg:col-span-3">
                  {/* Search and Filter Bar */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Search team members..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          {uniqueRoles.map(role => (
                            <option key={role} value={role}>
                              {role === 'all' ? 'All Roles' : role}
                            </option>
                          ))}
                        </select>
                        
                        <div className="flex bg-gray-100 rounded-md p-1">
                          <button
                            className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('grid')}
                          >
                            Grid
                          </button>
                          <button
                            className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            onClick={() => setViewMode('list')}
                          >
                            List
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Members Display */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredTeamMembers.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-lg font-medium text-gray-600">
                                {member.full_name?.charAt(0).toUpperCase() ?? 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{member.full_name ?? 'Unknown User'}</p>
                              <p className="text-sm text-gray-500">{member.email ?? 'No email'}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Role</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                                {member.role}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Status</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                                {member.status}
                              </span>
                            </div>
                            
                            {member.phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="h-3 w-3 mr-1" />
                                {member.phone}
                              </div>
                            )}
                            
                            {member.location && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {member.location}
                              </div>
                            )}
                            
                            {member.joinDate && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                Joined {new Date(member.joinDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-3 border-b border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
                          <span className="text-sm text-gray-500">{filteredTeamMembers.length} members</span>
                        </div>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {filteredTeamMembers.map((member) => (
                          <li key={member.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-lg font-medium text-gray-600">
                                    {member.full_name?.charAt(0).toUpperCase() ?? 'U'}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium text-gray-900">{member.full_name ?? 'Unknown User'}</p>
                                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                                      {member.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">{member.email ?? 'No email'}</p>
                                  {member.phone && (
                                    <p className="text-xs text-gray-500 mt-1">{member.phone}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                                  {member.role}
                                </span>
                                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                  Edit
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Sidebar - Takes up 1/4 of space on large screens */}
                <div className="lg:col-span-1">
                  {/* Team Stats */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Members</span>
                        <span className="text-sm font-medium text-gray-900">{mockTeamMembers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Now</span>
                        <span className="text-sm font-medium text-green-600">
                          {mockTeamMembers.filter(m => m.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admins</span>
                        <span className="text-sm font-medium text-gray-900">
                          {mockTeamMembers.filter(m => m.role === 'Admin').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Developers</span>
                        <span className="text-sm font-medium text-gray-900">
                          {mockTeamMembers.filter(m => m.role === 'Developer').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Designers</span>
                        <span className="text-sm font-medium text-gray-900">
                          {mockTeamMembers.filter(m => m.role === 'Designer').length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Invite Button */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Members</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Invite new members to join your team and collaborate on projects.
                    </p>
                    <button className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Send Invitation
                    </button>
                  </div>
                  
                  {/* Team Roles */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Roles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${getRoleColor('Admin').split(' ')[0]}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Admin</p>
                          <p className="text-xs text-gray-500">Full access to all features</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${getRoleColor('Developer').split(' ')[0]}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Developer</p>
                          <p className="text-xs text-gray-500">Can create and edit projects</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${getRoleColor('Designer').split(' ')[0]}`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Designer</p>
                          <p className="text-xs text-gray-500">Can create and edit designs</p>
                        </div>
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

export default TeamPage;