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
      color: 'from-blue-500 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100',
    },
    {
      icon: TrendingUp,
      label: 'Total Recommendations',
      value: stats.total_recommendations,
      color: 'from-green-500 to-green-700',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      icon: Target,
      label: 'Success Rate',
      value: `${stats.overall_success_rate.toFixed(1)}%`,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      icon: Activity,
      label: 'Active Recommendations',
      value: stats.active_recommendations,
      color: 'from-orange-500 to-orange-700',
      bgColor: 'from-orange-50 to-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="p-8 floating-element" gradient>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{item.label}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {item.value}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.bgColor} flex items-center justify-center shadow-lg`}>
                <Icon className={`w-8 h-8 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};