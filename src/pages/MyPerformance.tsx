import { supabase } from '../supabase';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Target, Award, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MyPerformance: React.FC = () => {
  const { user } = useAuth();
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const { metrics, timeSeriesData, advisorBreakdownStats, loading } = usePerformanceMetrics(advisorId || undefined);

  useEffect(() => {
    const fetchAdvisorId = async () => {
      if (user?.id) {
        const { data: advisor } = await supabase
          .from('advisors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (advisor) {
          setAdvisorId(advisor.id);
        }
      }
    };

    fetchAdvisorId();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const myMetrics = metrics[0]; // Since we're fetching for specific advisor, it's the first (and only) item

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">My Performance</h1>
        <p className="text-sm md:text-base text-gray-600">Track your recommendation performance and trends</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card className="p-3 md:p-6" variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
                <span className="hidden sm:inline">Total Recommendations</span>
                <span className="sm:hidden">Total</span>
              </p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {myMetrics?.total_recommendations || 0}
              </p>
            </div>
            <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-3 md:p-6" variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Success Rate</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {myMetrics?.success_rate?.toFixed(1) || 0}%
              </p>
            </div>
            <Target className="w-6 md:w-8 h-6 md:h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-3 md:p-6" variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Successful</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {myMetrics?.successful_recommendations || 0}
              </p>
            </div>
            <Award className="w-6 md:w-8 h-6 md:h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-3 md:p-6" variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Ongoing</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {myMetrics?.ongoing_recommendations || 0}
              </p>
            </div>
            <BarChart3 className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-3 sm:p-4 md:p-6 mb-6 md:mb-8" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Performance Trends</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        {timeSeriesData.length > 0 ? (
          <div className="h-48 md:h-64 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="performanceBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                  </linearGradient>
                  <linearGradient id="performanceLineGradient" x1="0" y1="0" x2="1" y2="0">
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
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="recommendations" 
                  stroke="url(#performanceBarGradient)"
                  strokeWidth={4}
                  name="Recommendations"
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3, fillOpacity: 0.8 }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 3, 
                    stroke: '#3b82f6', 
                    fill: '#ffffff',
                    strokeOpacity: 0.8,
                    style: { filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }
                  }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="url(#performanceLineGradient)"
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 md:h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Calendar className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm md:text-base">No performance data available yet</p>
              <p className="text-xs md:text-sm">Create some recommendations to see your trends</p>
            </div>
          </div>
        )}
      </Card>

      {/* Performance Breakdown */}
      <Card className="p-3 sm:p-4 md:p-6" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Performance Breakdown</h3>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Best Performing Stock</span>
            <span className="text-xs md:text-sm font-medium text-gray-900">
              {advisorBreakdownStats?.bestPerformingStock || 'No data'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Avg Confidence Level</span>
            <span className="text-xs md:text-sm font-medium text-gray-900">
              {advisorBreakdownStats?.avgConfidenceLevel ? `${advisorBreakdownStats.avgConfidenceLevel}%` : 'No data'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Most Recommended Action</span>
            <span className="text-xs md:text-sm font-medium text-gray-900">
              {advisorBreakdownStats?.mostRecommendedAction || 'No data'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};