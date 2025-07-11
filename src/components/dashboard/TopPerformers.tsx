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
        return 'from-yellow-400 to-yellow-600';
      case 1:
        return 'from-gray-400 to-gray-600';
      case 2:
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-blue-500 to-blue-700';
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-50 to-yellow-100';
      case 1:
        return 'from-gray-50 to-gray-100';
      case 2:
        return 'from-amber-50 to-amber-100';
      default:
        return 'from-blue-50 to-blue-100';
    }
  };

  // Sample advisor avatars
  const advisorAvatars = [
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
          Top Performers
        </h3>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center shadow-lg">
          <Crown className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent" />
        </div>
      </div>

      <div className="space-y-6">
        {performers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium">No performance data available</p>
            <p className="text-sm text-gray-400 mt-1">Top performers will appear here</p>
          </div>
        ) : (
          performers.slice(0, 5).map((performer, index) => {
            const Icon = getRankIcon(index);
            const avatarUrl = advisorAvatars[index % advisorAvatars.length];
            return (
              <div key={performer.advisor_id} className="flex items-center justify-between p-4 rounded-xl hover:chrome-reflection transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={avatarUrl}
                      alt={performer.advisor?.name || 'Advisor'}
                      className="w-12 h-12 rounded-full object-cover avatar-glow border-2 border-white/60 shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getRankBg(index)} flex items-center justify-center shadow-lg border-2 border-white`}>
                      <Icon className={`w-3 h-3 bg-gradient-to-r ${getRankColor(index)} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {performer.advisor?.name || 'Unknown Advisor'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {performer.total_recommendations} recommendations
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {performer.success_rate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 font-medium">success rate</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};