import { useState, useEffect } from 'react';
import { PerformanceMetrics, DashboardStats, RecentActivity } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

export const usePerformanceMetrics = (advisorId?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMetrics();
  }, [advisorId, user]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (advisorId) {
        // Fetch metrics for specific advisor
        await fetchAdvisorMetrics(advisorId);
      } else {
        // Fetch dashboard stats (for operations role)
        await fetchDashboardStats();
      }
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError('Failed to fetch performance metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvisorMetrics = async (advisorId: string) => {
    try {
      // Get advisor performance data
      const { data: performanceData, error: perfError } = await supabase
        .from('advisor_performance')
        .select(`
          *,
          advisor:advisors(*)
        `)
        .eq('advisor_id', advisorId);

      if (perfError) throw perfError;

      setMetrics(performanceData || []);
    } catch (err) {
      console.error('Error fetching advisor metrics:', err);
      setMetrics([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch total advisors
      const { count: totalAdvisors } = await supabase
        .from('advisors')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Fetch total recommendations
      const { count: totalRecommendations } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact' });

      // Fetch active recommendations
      const { count: activeRecommendations } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact' })
        .eq('status', 'ongoing');

      // Calculate overall success rate
      const { count: successfulRecommendations } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact' })
        .eq('status', 'successful');

      const overallSuccessRate = totalRecommendations && totalRecommendations > 0
        ? ((successfulRecommendations || 0) / totalRecommendations) * 100
        : 0;

      // Fetch recent activity (recent recommendations)
      const { data: recentRecommendations, error: recentError } = await supabase
        .from('recommendations')
        .select(`
          *,
          advisor:advisors(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Transform recent recommendations to recent activity format
      const recentActivity: RecentActivity[] = (recentRecommendations || []).map(rec => ({
        id: rec.id,
        type: 'recommendation_added',
        description: `${rec.advisor?.name || 'Unknown'} added ${rec.action.toUpperCase()} recommendation for ${rec.stock_symbol}`,
        created_at: rec.created_at,
        advisor: rec.advisor
      }));

      // Fetch top performers
      const { data: topPerformers, error: topError } = await supabase
        .from('advisor_performance')
        .select(`
          *,
          advisor:advisors(*)
        `)
        .order('success_rate', { ascending: false })
        .limit(5);

      if (topError) throw topError;

      const dashboardStatsData: DashboardStats = {
        total_advisors: totalAdvisors || 0,
        total_recommendations: totalRecommendations || 0,
        overall_success_rate: overallSuccessRate,
        active_recommendations: activeRecommendations || 0,
        recent_activity: recentActivity,
        top_performers: topPerformers || []
      };

      setDashboardStats(dashboardStatsData);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setDashboardStats({
        total_advisors: 0,
        total_recommendations: 0,
        overall_success_rate: 0,
        active_recommendations: 0,
        recent_activity: [],
        top_performers: []
      });
    }
  };

  return {
    metrics,
    dashboardStats,
    loading,
    error,
    fetchMetrics,
  };
};