import React from 'react';
import { Card } from '../ui/Card';
import { Users, TrendingUp, Target, Activity } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total_advisors: number;
    total_recommendations: number;
    overall_success_rate: number;
    active_recommendations: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Users,
      label: 'Total Advisors',
      value: stats.total_advisors,
      color: 'text-blue-600',
      bgColor: 'light-blue-gradient',
    },
    {
      icon: TrendingUp,
      label: 'Total Recommendations',
      value: stats.total_recommendations,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    },
    {
      icon: Target,
      label: 'Success Rate',
      value: `${stats.overall_success_rate.toFixed(1)}%`,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    },
    {
      icon: Activity,
      label: 'Active Recommendations',
      value: stats.active_recommendations,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};