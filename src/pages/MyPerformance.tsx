import { supabase } from '../supabase';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

export const MyPerformance: React.FC = () => {
  const { user } = useAuth();
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const { metrics, loading, dashboardStats } = usePerformanceMetrics(advisorId || undefined);

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

  // Find metrics by advisorId, not user.id
  const advisorMetrics = advisorId ? metrics.find(m => m.advisor_id === advisorId) : null;
  
  // If we don't have metrics from the performance table, create basic stats from dashboard data
  const defaultMetrics = {
    total_recommendations: dashboardStats?.total_recommendations || 0,
    successful_recommendations: dashboardStats?.total_recommendations ? 
      Math.floor((dashboardStats.overall_success_rate / 100) * dashboardStats.total_recommendations) : 0,
    ongoing_recommendations: dashboardStats?.active_recommendations || 0,
    success_rate: dashboardStats?.overall_success_rate || 0
  };
  
  const displayMetrics = advisorMetrics || defaultMetrics;

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
                {displayMetrics.total_recommendations}
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
                {displayMetrics.success_rate.toFixed(1)}%
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
                {displayMetrics.successful_recommendations}
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
                {displayMetrics.ongoing_recommendations}
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
        <div className="h-48 md:h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm md:text-base">Performance charts will appear here</p>
            <p className="text-xs md:text-sm">Connect to Supabase to see real data</p>
          </div>
        </div>
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
            <span className="text-xs md:text-sm font-medium text-gray-900">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Avg Confidence Level</span>
            <span className="text-xs md:text-sm font-medium text-gray-900">-</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Most Recommended Action</span>
            <span className="text-xs md:text-sm font-medium text-gray-900">-</span>
          </div>
        </div>
      </Card>
    </div>
  );
};