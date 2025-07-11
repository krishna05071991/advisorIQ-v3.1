import React from 'react';
import { Card } from '../ui/Card';
import { PerformanceMetrics } from '../../types';
import { Trophy, TrendingUp, Award, Crown } from 'lucide-react';

interface TopPerformersProps {
  performers: PerformanceMetrics[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ performers }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return Crown;
      case 1:
        return Trophy;
      case 2:
        return Award;
      default:
        return TrendingUp;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-600';
      case 1:
        return 'bg-gray-100 text-gray-600';
      case 2:
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const advisorAvatars = [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg flex items-center justify-center">
          <Crown className="w-5 h-5 text-yellow-600" />
        </div>
      </div>

      <div className="space-y-4">
        {performers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No performance data available</p>
          </div>
        ) : (
          performers.slice(0, 5).map((performer, index) => {
            const Icon = getRankIcon(index);
            const avatarUrl = advisorAvatars[index % advisorAvatars.length];
            return (
              <div key={performer.advisor_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={avatarUrl}
                      alt={performer.advisor?.name || 'Advisor'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${getRankColor(index)} flex items-center justify-center`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {performer.advisor?.name || 'Unknown Advisor'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {performer.total_recommendations} recommendations
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {performer.success_rate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">success rate</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};