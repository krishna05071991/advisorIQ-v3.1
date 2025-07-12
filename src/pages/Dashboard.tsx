import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { TopPerformers } from '../components/dashboard/TopPerformers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { supabase } from '../supabase';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  
  // For operations: get network-wide stats
  const { dashboardStats, loading: networkLoading } = usePerformanceMetrics();
  
  // For advisors: get their specific metrics
  const { metrics: advisorMetrics, loading: advisorLoading } = usePerformanceMetrics(advisorId || undefined);

  useEffect(() => {
    const fetchAdvisorId = async () => {
      if (user?.role === 'advisor' && user?.id) {
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

  const loading = user?.role === 'operations' ? networkLoading : advisorLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // For advisor role, create personalized stats from their recommendations
  const myMetrics = user?.role === 'advisor' ? advisorMetrics[0] : null;
  const advisorStats = myMetrics ? {
    total_advisors: 1, // The advisor themselves
    total_recommendations: myMetrics.total_recommendations,
    overall_success_rate: myMetrics.success_rate,
    active_recommendations: myMetrics.ongoing_recommendations,
  } : {
    total_advisors: 1,
    total_recommendations: 0,
    overall_success_rate: 0,
    active_recommendations: 0,
  };

  const activityToDisplay = user?.role === 'operations' 
    ? (dashboardStats?.recent_activity || [])
    : myMetrics ? [{
        id: 'advisor-activity',
        type: 'recommendation_added' as const,
        description: `You have ${myMetrics.total_recommendations} total recommendations with ${myMetrics.success_rate.toFixed(1)}% success rate`,
        created_at: new Date().toISOString(),
        advisor: undefined
      }] : [];

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
          : advisorStats
      } />

      {user?.role === 'operations' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentActivity activities={activityToDisplay} />
          </div>
          <div>
            <TopPerformers performers={networkDashboardStats?.top_performers || []} />
          </div>
        </div>
      ) : (
        <div className="lg:col-span-2">
          <RecentActivity activities={activityToDisplay} />
        </div>
      )}
    </div>
  );
};