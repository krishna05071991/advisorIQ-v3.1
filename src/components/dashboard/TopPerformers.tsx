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
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${getRankColor(index)}`} />
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