import React from 'react';
import { Card } from '../ui/Card';
import { RecentActivity as RecentActivityType } from '../../types';
import { Clock, TrendingUp, UserPlus, CheckCircle } from 'lucide-react';

interface RecentActivityProps {
  activities: RecentActivityType[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'recommendation_added':
        return TrendingUp;
      case 'recommendation_updated':
        return CheckCircle;
      case 'advisor_joined':
        return UserPlus;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'recommendation_added':
        return 'from-blue-500 to-blue-700';
      case 'recommendation_updated':
        return 'from-green-500 to-green-700';
      case 'advisor_joined':
        return 'from-purple-500 to-purple-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Sample avatars for activities
  const avatars = [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
  ];

  return (
    <Card className="p-8" gradient>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Recent Activity
        </h3>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-lg">
          <Clock className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent" />
        </div>
      </div>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Clock className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Activity will appear here as it happens</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const avatarUrl = avatars[index % avatars.length];
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:chrome-reflection transition-all duration-300">
                <div className="relative">
                  <img 
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover avatar-glow border-2 border-white/60 shadow-lg"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getActivityColor(activity.type)} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};