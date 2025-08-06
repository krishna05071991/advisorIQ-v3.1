import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { useRecommendations } from '../hooks/useRecommendations';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { TopPerformers } from '../components/dashboard/TopPerformers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const { dashboardStats, advisorMetrics, loading: metricsLoading } = usePerformanceMetrics(
    user?.role === 'advisor' ? advisorId : undefined
  );
  const { recommendations, loading: recommendationsLoading } = useRecommendations(
    user?.role === 'advisor' ? advisorId : undefined
  );

  const loading = metricsLoading || recommendationsLoading;

  useEffect(() => {
    const fetchAdvisorId = async () => {
      if (user?.id && user.role === 'advisor') {
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
  }, [user?.id, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // For advisor role, create personalized stats from their recommendations
  const advisorStats = user?.role === 'advisor' && advisorMetrics ? {
    total_advisors: 1, // The advisor themselves
    total_recommendations: advisorMetrics.total_recommendations,
    overall_success_rate: advisorMetrics.success_rate,
    active_recommendations: advisorMetrics.ongoing_recommendations,
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extralight text-slate-900 mb-2 tracking-wide">
          {user?.role === 'operations' ? 'Operations Dashboard' : 'Advisor Dashboard'}
        </h1>
        <p className="text-slate-600 font-light">
          {user?.role === 'operations' 
            ? 'Overview of your advisor network and performance metrics' 
            : 'Your personal performance and recommendation tracking'
          }
        </p>
      </div>

      <DashboardStats stats={
        user?.role === 'operations' 
          ? (dashboardStats || { total_advisors: 0, total_recommendations: 0, overall_success_rate: 0, active_recommendations: 0 })
          : (advisorStats || { total_advisors: 0, total_recommendations: 0, overall_success_rate: 0, active_recommendations: 0 })
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        {user?.role === 'operations' && (
          <div>
            <TopPerformers performers={dashboardStats?.top_performers || []} />
          </div>
        )}
      </div>
    </div>
  );
};