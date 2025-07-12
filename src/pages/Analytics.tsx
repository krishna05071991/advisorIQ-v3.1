import React from 'react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { metrics, loading } = usePerformanceMetrics();

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
          <div className="h-48 md:h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm md:text-base">Performance charts will appear here</p>
              <p className="text-xs md:text-sm">Connect to Supabase to see real data</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6" variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Key Metrics</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Avg Success Rate</span>
              <span className="text-base md:text-lg font-semibold text-gray-900">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Total Recommendations</span>
              <span className="text-base md:text-lg font-semibold text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Active Advisors</span>
              <span className="text-base md:text-lg font-semibold text-gray-900">0</span>
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
        <div className="text-center py-6 md:py-8 text-gray-500">
          <TrendingUp className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm md:text-base">Performance rankings will appear here</p>
          <p className="text-xs md:text-sm">Connect to Supabase to see real data</p>
        </div>
      </Card>
    </div>
  );
};