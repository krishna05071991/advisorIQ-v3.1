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
      color: 'blue',
    },
    {
      icon: TrendingUp,
      label: 'Total Recommendations',
      value: stats.total_recommendations,
      color: 'green',
    },
    {
      icon: Target,
      label: 'Success Rate',
      value: `${stats.overall_success_rate.toFixed(1)}%`,
      color: 'purple',
    },
    {
      icon: Activity,
      label: 'Active Recommendations',
      value: stats.active_recommendations,
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="p-6" gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};