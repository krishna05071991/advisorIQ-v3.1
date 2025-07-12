import React from 'react';
import { Card } from '../ui/Card';
import { PerformanceMetrics } from '../../types';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface TopPerformersProps {
  performers: PerformanceMetrics[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ performers }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return Trophy;
      case 1:
        return Award;
      default:
        return TrendingUp;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-600';
      case 1:
        return 'text-gray-600';
      default:
        return 'text-blue-600';
    }
  };

  const getAvatarUrl = (index: number) => {
    const avatars = [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    ];
    return avatars[index % avatars.length];
  };
  return (
    <Card className="p-6" gradient>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        <Trophy className="w-5 h-5 text-gray-400" />
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
            return (
              <div key={performer.advisor_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={getAvatarUrl(index)}
                      alt={performer.advisor?.name || 'Advisor'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Icon className={`w-3 h-3 ${getRankColor(index)}`} />
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
                  <p className="text-sm font-semibold text-gray-900">
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