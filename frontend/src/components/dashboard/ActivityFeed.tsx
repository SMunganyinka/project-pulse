// src/components/dashboard/ActivityFeed.tsx

import React, { useState, useEffect } from 'react';
import { CheckSquare, Edit, Trash2, MessageSquare, Plus } from 'lucide-react';

// Define the structure for a single activity item
interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete' | 'comment';
}

// Initial mock data
const initialActivities: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Shakira', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d8231f3b3d' },
    action: 'created the project',
    target: 'New Marketing Website',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    type: 'create',
  },
  {
    id: '2',
    user: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=042581f4e29026704d8231f3b3d' },
    action: 'moved a task',
    target: 'Design Homepage Mockup',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: 'update',
  },
  {
    id: '3',
    user: { name: 'Shakira', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d8231f3b3d' },
    action: 'commented on',
    target: 'Project Pulse API',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    type: 'comment',
  },
  {
    id: '4',
    user: { name: 'Chris', avatar: 'https://i.pravatar.cc/150?u=042581f4e29026704d8231f3b3d' },
    action: 'deleted the project',
    target: 'Old Campaign Assets',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: 'delete',
  },
];

// Helper function to format the timestamp into a readable "time ago" string
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000; // years

  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000; // months
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400; // days
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600; // hours
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60; // minutes
  if (interval > 1) {
    return Math.floor(interval) + ' mins ago';
  }
  return 'just now';
};

// Icon mapping based on activity type
const activityIcons = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  comment: MessageSquare,
};

// Activity feed context to manage activities across the app
export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Load activities from localStorage on mount
  useEffect(() => {
    const storedActivities = localStorage.getItem('activityFeed');
    if (storedActivities) {
      try {
        const parsedActivities = JSON.parse(storedActivities).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
        setActivities(parsedActivities);
      } catch (error) {
        console.error('Error parsing stored activities:', error);
        setActivities(initialActivities);
      }
    } else {
      setActivities(initialActivities);
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('activityFeed', JSON.stringify(activities));
    }
  }, [activities]);

  // Function to add a new activity
  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep only the latest 50 activities
  };

  // Function to clear all activities
  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem('activityFeed');
  };

  return { activities, addActivity, clearActivities };
};

const ActivityFeed: React.FC = () => {
  const { activities } = useActivityFeed();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button
          onClick={() => {
            if (confirm('Clear all activities?')) {
              localStorage.removeItem('activityFeed');
              window.location.reload();
            }
          }}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <img
                  className="h-8 w-8 rounded-full flex-shrink-0"
                  src={activity.user.avatar}
                  alt={`${activity.user.name}'s avatar`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user.name}</span>{' '}
                    <span className="font-normal">{activity.action}</span>{' '}
                    <span className="font-medium">"{activity.target}"</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
                <div className="flex-shrink-0">
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;