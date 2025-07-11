import React from 'react';
import { Card } from '../ui/Card';
import { PerformanceMetrics } from '../../types';
import { Trophy, TrendingUp, Award, Star } from 'lucide-react';

interface TopPerformersProps {
  performers: PerformanceMetrics[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ performers }) => {
  // Sample top performers with realistic data
  const samplePerformers = [
    {
      advisor_id: '1',
      total_recommendations: 156,
      successful_recommendations: 142,
      success_rate: 91.0,
      advisor: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
        specialization: 'Equities'
      }
    },
    {
      advisor_id: '2',
      total_recommendations: 203,
      successful_recommendations: 178,
      success_rate: 87.7,
      advisor: {
        id: '2',
        name: 'Michael Rodriguez',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
        specialization: 'Fixed Income'
      }
    },
    {
      advisor_id: '3',
      total_recommendations: 97,
      successful_recommendations: 84,
      success_rate: 86.6,
      advisor: {
        id: '3',
        name: 'Lisa Park',
        avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
        specialization: 'Alternative Investments'
      }
    },
    {
      advisor_id: '4',
      total_recommendations: 178,
      successful_recommendations: 152,
      success_rate: 85.4,
      advisor: {
        id: '4',
        name: 'James Wilson',
        avatar: 'https://images.pexels.com/photos/3760043/pexels-photo-3760043.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
        specialization: 'Equities'
      }
    },
    {
      advisor_id: '5',
      total_recommendations: 134,
      successful_recommendations: 112,
      success_rate: 83.6,
      advisor: {
        id: '5',
        name: 'Emily Johnson',
        avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
        specialization: 'Derivatives'
      }
    }
  ];

  // Use sample data when no real performers are available
  const displayPerformers = performers.length > 0 ? performers : samplePerformers;
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
        return 'text-yellow-500';
      case 1:
        return 'text-slate-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Card className="p-6" gradient>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extralight text-slate-900">Top Performers</h3>
        <Trophy className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {displayPerformers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No performance data available</p>
          </div>
        ) : (
          displayPerformers.slice(0, 5).map((performer, index) => {
            const Icon = getRankIcon(index);
            return (
              <div key={performer.advisor_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={performer.advisor?.avatar || `https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1`}
                      alt={performer.advisor?.name || 'Advisor'}
                      className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-white/20"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <Icon className={`w-4 h-4 ${getRankColor(index)}`} />
                  </div>
                  </div>
                  <div>
                    <p className="text-sm font-light text-slate-900">
                      {performer.advisor?.name || 'Unknown Advisor'}
                    </p>
                    <p className="text-xs text-slate-500 font-light">
                      {performer.total_recommendations} recommendations
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <p className="text-sm font-light text-slate-900">
                    {performer.success_rate.toFixed(1)}%
                  </p>
                  </div>
                  <p className="text-xs text-slate-500 font-light">success rate</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};