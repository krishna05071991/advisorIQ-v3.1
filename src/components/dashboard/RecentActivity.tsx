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
        return 'text-blue-600';
      case 'recommendation_updated':
        return 'text-green-600';
      case 'advisor_joined':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
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

  return (
    <Card className="p-6" gradient>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
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