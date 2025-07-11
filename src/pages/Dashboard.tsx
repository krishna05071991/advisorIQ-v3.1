import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { useRecommendations } from '../hooks/useRecommendations';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { TopPerformers } from '../components/dashboard/TopPerformers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { dashboardStats, loading: metricsLoading } = usePerformanceMetrics();
  const { recommendations, loading: recommendationsLoading } = useRecommendations(
    user?.role === 'advisor' ? user.id : undefined
  );

  const loading = metricsLoading || recommendationsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const advisorStats = user?.role === 'advisor' ? {
    total_advisors: 1,
    total_recommendations: recommendations.length,
    overall_success_rate: recommendations.length > 0 
      ? (recommendations.filter(r => r.status === 'successful').length / recommendations.length) * 100
      : 0,
    active_recommendations: recommendations.filter(r => r.status === 'ongoing').length,
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 blue-gradient rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'operations' ? 'Operations Dashboard' : 'Advisor Dashboard'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'operations' 
                ? 'Overview of your advisor network and performance metrics' 
                : 'Your personal performance and recommendation tracking'
              }
            </p>
          </div>
        </div>
      </div>

      <DashboardStats stats={
        user?.role === 'operations' 
          ? (dashboardStats || { total_advisors: 0, total_recommendations: 0, overall_success_rate: 0, active_recommendations: 0 })
          : (advisorStats || { total_advisors: 0, total_recommendations: 0, overall_success_rate: 0, active_recommendations: 0 })
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={
            user?.role === 'operations' 
              ? (dashboardStats?.recent_activity || [])
              : recommendations.slice(0, 5).map(rec => ({
                  id: rec.id,
                  type: 'recommendation_added' as const,
                  description: `You added ${rec.action.toUpperCase()} recommendation for ${rec.stock_symbol}`,
                  created_at: rec.created_at,
                  advisor: undefined
                }))
          } />
        </div>
        <div>
          <TopPerformers performers={
            user?.role === 'operations' 
              ? (dashboardStats?.top_performers || [])
              : []
          } />
        </div>
      </div>
    </div>
  );
};