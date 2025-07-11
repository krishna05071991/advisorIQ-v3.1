import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

export const MyPerformance: React.FC = () => {
  const { user } = useAuth();
  const { metrics, loading } = usePerformanceMetrics(user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const myMetrics = metrics.find(m => m.advisor_id === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Performance</h1>
        <p className="text-gray-600">Track your recommendation performance and trends</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">
                {myMetrics?.total_recommendations || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {myMetrics?.success_rate?.toFixed(1) || 0}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {myMetrics?.successful_recommendations || 0}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ongoing</p>
              <p className="text-2xl font-bold text-gray-900">
                {myMetrics?.ongoing_recommendations || 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-6 mb-8" gradient>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Performance charts will appear here</p>
            <p className="text-sm">Connect to Supabase to see real data</p>
          </div>
        </div>
      </Card>

      {/* Performance Breakdown */}
      <Card className="p-6" gradient>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Breakdown</h3>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Best Performing Stock</span>
            <span className="text-sm font-medium text-gray-900">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Confidence Level</span>
            <span className="text-sm font-medium text-gray-900">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Most Recommended Action</span>
            <span className="text-sm font-medium text-gray-900">-</span>
          </div>
        </div>
      </Card>
    </div>
  );
};