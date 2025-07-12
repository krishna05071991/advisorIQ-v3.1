import { useState, useEffect } from 'react';
import { PerformanceMetrics, DashboardStats, RecentActivity } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

interface TimeSeriesData {
  date: string;
  recommendations: number;
  successRate: number;
}

export const usePerformanceMetrics = (advisorId?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
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
        await fetchTimeSeriesData();
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

  const fetchTimeSeriesData = async () => {
    try {
      // Fetch recommendations grouped by month for the last 12 months
      const { data: monthlyData, error } = await supabase
        .from('recommendations')
        .select('created_at, status')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (error) throw error;

      // Group data by month
      const groupedData: { [key: string]: { total: number; successful: number } } = {};
      
      (monthlyData || []).forEach(rec => {
        const month = new Date(rec.created_at).toISOString().slice(0, 7); // YYYY-MM format
        if (!groupedData[month]) {
          groupedData[month] = { total: 0, successful: 0 };
        }
        groupedData[month].total++;
        if (rec.status === 'successful') {
          groupedData[month].successful++;
        }
      });

      // Convert to array format for charts
      const chartData = Object.entries(groupedData).map(([month, data]) => ({
        date: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        recommendations: data.total,
        successRate: data.total > 0 ? (data.successful / data.total) * 100 : 0
      }));

      setTimeSeriesData(chartData);
    } catch (err) {
      console.error('Error fetching time series data:', err);
      setTimeSeriesData([]);
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
    timeSeriesData,
    loading,
    error,
    fetchMetrics,
  };
};