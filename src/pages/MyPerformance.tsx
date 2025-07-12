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
      <Card className="p-4 md:p-6 mb-6 md:mb-8" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Performance Trends</h3>
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
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="recommendations" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Recommendations"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
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
              <Calendar className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm md:text-base">No performance data available yet</p>
              <p className="text-xs md:text-sm">Create some recommendations to see your trends</p>
            </div>
          </div>
        )}
      </Card>

      {/* Performance Breakdown */}
      <Card className="p-4 md:p-6" variant="glass">
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