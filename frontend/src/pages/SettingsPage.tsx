// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { User, Bell, Shield, Palette, Globe, HelpCircle, Download, Trash2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [language, setLanguage] = useState('english');
  const [timezone, setTimezone] = useState('utc-5');
  
  // --- State for Sidebar ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  // --- State for active section ---
  const [activeSection, setActiveSection] = useState('profile');

  // --- Settings sections for navigation ---
  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'data', label: 'Data & Privacy', icon: Download },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-sm text-gray-700">Manage your account settings and preferences.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Navigation - Takes up 1/4 of space on large screens */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                    </div>
                    <nav className="p-2">
                      {settingsSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                              activeSection === section.id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="mr-3 h-5 w-5" />
                            {section.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                  
                  {/* Danger Zone */}
                  <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-red-200">
                      <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <Trash2 className="inline h-4 w-4 mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Settings Content - Takes up 3/4 of space on large screens */}
                <div className="lg:col-span-3">
                  {/* Profile Information Section */}
                  {activeSection === 'profile' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-6">
                          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-indigo-600">
                              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-6">
                            <h3 className="text-lg font-medium text-gray-900">{user?.full_name || 'User'}</h3>
                            <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
                            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                              Change Avatar
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              id="name"
                              type="text"
                              value={user?.full_name || ''}
                              readOnly
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              id="email"
                              type="email"
                              value={user?.email || ''}
                              readOnly
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                          </div>
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              id="title"
                              type="text"
                              placeholder="e.g. Product Designer"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                          </div>
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                              id="location"
                              type="text"
                              placeholder="e.g. San Francisco, CA"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                              id="bio"
                              rows={4}
                              placeholder="Tell us a little about yourself"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <button className="bg-indigo-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications Section */}
                  {activeSection === 'notifications' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Email Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Project Updates</p>
                                <p className="text-sm text-gray-500">Receive emails when projects are updated</p>
                              </div>
                              <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                  emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                    emailNotifications ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Task Assignments</p>
                                <p className="text-sm text-gray-500">Receive emails when tasks are assigned to you</p>
                              </div>
                              <button
                                className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600"
                              >
                                <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Comments</p>
                                <p className="text-sm text-gray-500">Receive emails when someone comments on your projects</p>
                              </div>
                              <button
                                className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200"
                              >
                                <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Push Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Desktop Notifications</p>
                                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                              </div>
                              <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                  pushNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                    pushNotifications ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Security Section */}
                  {activeSection === 'security' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Security</h2>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Password</h3>
                          <div className="max-w-md">
                            <p className="text-sm text-gray-500 mb-4">Last changed on January 10, 2023</p>
                            <button className="bg-indigo-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Change Password
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                          <div className="max-w-md">
                            <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                            <button className="bg-indigo-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Active Sessions</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Chrome on macOS</p>
                                <p className="text-sm text-gray-500">San Francisco, CA • Current session</p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                                <p className="text-sm text-gray-500">San Francisco, CA • Last active 2 hours ago</p>
                              </div>
                              <button className="text-sm text-red-600 hover:text-red-500">
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Appearance Section */}
                  {activeSection === 'appearance' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Theme</h3>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <input
                                id="light-mode"
                                name="theme"
                                type="radio"
                                checked={!darkMode}
                                onChange={() => setDarkMode(false)}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="light-mode" className="ml-3 block text-sm font-medium text-gray-700">
                                Light Mode
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="dark-mode"
                                name="theme"
                                type="radio"
                                checked={darkMode}
                                onChange={() => setDarkMode(true)}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="dark-mode" className="ml-3 block text-sm font-medium text-gray-700">
                                Dark Mode
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="system-mode"
                                name="theme"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="system-mode" className="ml-3 block text-sm font-medium text-gray-700">
                                System Default
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Accent Color</h3>
                          <div className="flex space-x-3">
                            <button className="h-8 w-8 rounded-full bg-indigo-600 border-2 border-white shadow-sm"></button>
                            <button className="h-8 w-8 rounded-full bg-purple-600 border-2 border-white shadow-sm"></button>
                            <button className="h-8 w-8 rounded-full bg-pink-600 border-2 border-white shadow-sm"></button>
                            <button className="h-8 w-8 rounded-full bg-green-600 border-2 border-white shadow-sm"></button>
                            <button className="h-8 w-8 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></button>
                            <button className="h-8 w-8 rounded-full bg-red-600 border-2 border-white shadow-sm"></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Language & Region Section */}
                  {activeSection === 'language' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Language & Region</h2>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                          <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                            <option value="japanese">Japanese</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                          <select
                            id="timezone"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="utc-12">(UTC-12:00) International Date Line West</option>
                            <option value="utc-8">(UTC-08:00) Pacific Time</option>
                            <option value="utc-5">(UTC-05:00) Eastern Time</option>
                            <option value="utc-0">(UTC+00:00) London</option>
                            <option value="utc+1">(UTC+01:00) Paris</option>
                            <option value="utc+8">(UTC+08:00) Beijing</option>
                            <option value="utc+9">(UTC+09:00) Tokyo</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">Date Format</label>
                          <select
                            id="date-format"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="mdy">MM/DD/YYYY</option>
                            <option value="dmy">DD/MM/YYYY</option>
                            <option value="ymd">YYYY/MM/DD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Data & Privacy Section */}
                  {activeSection === 'data' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Data & Privacy</h2>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Download Your Data</h3>
                          <p className="text-sm text-gray-500 mb-4">Get a copy of all your data in a machine-readable format</p>
                          <button className="bg-indigo-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Download className="inline h-4 w-4 mr-2" />
                            Request Data Export
                          </button>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Privacy Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                              </div>
                              <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600">
                                <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Activity Status</p>
                                <p className="text-sm text-gray-500">Show when you're active</p>
                              </div>
                              <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200">
                                <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Help & Support Section */}
                  {activeSection === 'help' && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Help & Support</h2>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
                          <div className="space-y-4">
                            <details className="group">
                              <summary className="flex justify-between items-center cursor-pointer list-none">
                                <span className="text-sm font-medium text-gray-900">How do I reset my password?</span>
                                <span className="ml-6 flex-shrink-0">
                                  <svg className="h-5 w-5 text-gray-500 group-open:text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-gray-500">
                                To reset your password, go to the login page and click on "Forgot Password". Enter your email address and follow the instructions sent to your email.
                              </div>
                            </details>
                            
                            <details className="group">
                              <summary className="flex justify-between items-center cursor-pointer list-none">
                                <span className="text-sm font-medium text-gray-900">How do I invite team members?</span>
                                <span className="ml-6 flex-shrink-0">
                                  <svg className="h-5 w-5 text-gray-500 group-open:text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-gray-500">
                                To invite team members, go to the Team page and click on "Invite New Member". Enter their email address and select their role.
                              </div>
                            </details>
                            
                            <details className="group">
                              <summary className="flex justify-between items-center cursor-pointer list-none">
                                <span className="text-sm font-medium text-gray-900">How do I export my data?</span>
                                <span className="ml-6 flex-shrink-0">
                                  <svg className="h-5 w-5 text-gray-500 group-open:text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              </summary>
                              <div className="mt-2 text-sm text-gray-500">
                                To export your data, go to Settings Data & Privacy and click on "Request Data Export". You will receive an email with a link to download your data.
                              </div>
                            </details>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-4">Contact Support</h3>
                          <p className="text-sm text-gray-500 mb-4">Can't find what you're looking for? Our support team is here to help.</p>
                          <button className="bg-indigo-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Contact Support
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;