import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { dashboardStats, timeSeriesData, loading } = usePerformanceMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-sm md:text-base text-gray-600">Performance insights and trends</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
        <Card className="p-4 md:p-6 lg:col-span-2" variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Network Performance</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          {timeSeriesData.length > 0 ? (
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#64748b" 
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    stroke="#64748b" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(20px)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="recommendations" 
                    fill="#3b82f6" 
                    name="Recommendations"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="successRate" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Success Rate (%)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 md:h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm md:text-base">No performance data available</p>
                <p className="text-xs md:text-sm">Data will appear as recommendations are created</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 md:p-6" variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Key Metrics</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Avg Success Rate</span>
              <span className="text-base md:text-lg font-semibold text-gray-900">
                {dashboardStats?.overall_success_rate?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Total Recommendations</span>
              <span className="text-base md:text-lg font-semibold text-gray-900">
                {dashboardStats?.total_recommendations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Active Advisors</span>
              <span className="text-base md:text-lg font-semibold text-gray-900">
                {dashboardStats?.total_advisors || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Rankings */}
      <Card className="p-4 md:p-6" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            <span className="hidden sm:inline">Advisor Performance Rankings</span>
            <span className="sm:hidden">Performance Rankings</span>
          </h3>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        {dashboardStats?.top_performers && dashboardStats.top_performers.length > 0 ? (
          <div className="space-y-4">
            {dashboardStats.top_performers.slice(0, 10).map((performer, index) => {
              const rankIcons = ['🥇', '🥈', '🥉'];
              const rankIcon = index < 3 ? rankIcons[index] : `${index + 1}.`;
              
              return (
                <div key={performer.advisor_id} className="flex items-center justify-between p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm font-semibold">
                      {rankIcon}
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
                    <p className="text-xs text-gray-500">
                      {performer.successful_recommendations}/{performer.total_recommendations}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 text-gray-500">
            <TrendingUp className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm md:text-base">No performance data available</p>
            <p className="text-xs md:text-sm">Rankings will appear as advisors create recommendations</p>
          </div>
        )}
      </Card>
    </div>
  );
};