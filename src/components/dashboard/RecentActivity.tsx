import React from 'react';
import { Card } from '../ui/Card';
import { RecentActivity as RecentActivityType } from '../../types';
import { Clock, TrendingUp, UserPlus, CheckCircle } from 'lucide-react';

interface RecentActivityProps {
  activities: RecentActivityType[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Sample recent activity with realistic advisor data
  const sampleActivities = [
    {
      id: '1',
      type: 'recommendation_added' as const,
      description: 'Sarah Chen added BUY recommendation for AAPL',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      advisor: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
      }
    },
    {
      id: '2',
      type: 'recommendation_updated' as const,
      description: 'Michael Rodriguez updated TSLA recommendation to SUCCESSFUL',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      advisor: {
        id: '2',
        name: 'Michael Rodriguez',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
      }
    },
    {
      id: '3',
      type: 'recommendation_added' as const,
      description: 'Lisa Park added HOLD recommendation for GOOGL',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      advisor: {
        id: '3',
        name: 'Lisa Park',
        avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
      }
    },
    {
      id: '4',
      type: 'advisor_joined' as const,
      description: 'James Wilson joined as Healthcare sector specialist',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      advisor: {
        id: '4',
        name: 'James Wilson',
        avatar: 'https://images.pexels.com/photos/3760043/pexels-photo-3760043.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
      }
    },
    {
      id: '5',
      type: 'recommendation_added' as const,
      description: 'Emily Johnson added SELL recommendation for NVDA',
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      advisor: {
        id: '5',
        name: 'Emily Johnson',
        avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
      }
    }
  ];

  // Use sample data when no real activities are available
  const displayActivities = activities.length > 0 ? activities : sampleActivities;
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
        return 'text-blue-500';
      case 'recommendation_updated':
        return 'text-green-500';
      case 'advisor_joined':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
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
        <h3 className="text-lg font-extralight text-slate-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          displayActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  {activity.advisor?.avatar ? (
                    <img
                      src={activity.advisor.avatar}
                      alt={activity.advisor.name}
                      className="w-8 h-8 rounded-lg object-cover shadow-sm ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-100/60 backdrop-blur-sm flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-light">{activity.description}</p>
                  <p className="text-xs text-slate-500 font-light mt-1">
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