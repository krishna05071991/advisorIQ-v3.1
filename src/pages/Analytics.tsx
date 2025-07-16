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
        <Card className="p-3 sm:p-4 md:p-6 lg:col-span-2" variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Network Performance</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          {timeSeriesData.length > 0 ? (
            <div className="h-48 md:h-64 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981"/>
                      <stop offset="100%" stopColor="#059669"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#cbd5e1" 
                    strokeOpacity={0.3}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    strokeOpacity={0.8}
                    fontSize={10}
                    tickMargin={4}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#64748b"
                    strokeOpacity={0.8}
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    width={25}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    stroke="#64748b"
                    strokeOpacity={0.8}
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    width={25}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      backdropFilter: 'blur(20px)',
                      fontSize: '12px',
                      fontWeight: '300'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: '500' }}
                    formatter={(value, name) => [
                      typeof value === 'number' ? 
                        (name === 'Success Rate (%)' ? `${value.toFixed(1)}%` : value) : 
                        value,
                      name
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '12px',
                      fontWeight: '300'
                    }}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="recommendations" 
                    fill="url(#barGradient)"
                    name="Recommendations"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                    opacity={0.9}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="successRate" 
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    name="Success Rate (%)"
                    dot={{ fill: '#10b981', strokeWidth: 0, r: 3, fillOpacity: 0.8 }}
                    activeDot={{ 
                      r: 6, 
                      strokeWidth: 3, 
                      stroke: '#10b981', 
                      fill: '#ffffff',
                      strokeOpacity: 0.8,
                      style: { filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))' }
                    }}
                    connectNulls={false}
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

        <Card className="p-3 sm:p-4 md:p-6" variant="glass">
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
      <Card className="p-3 sm:p-4 md:p-6" variant="glass">
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
                <div key={performer.advisor_id} className="flex items-center justify-between p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs sm:text-sm font-semibold">
                      {rankIcon}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {performer.advisor?.name || 'Unknown Advisor'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {performer.total_recommendations} recommendations
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
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