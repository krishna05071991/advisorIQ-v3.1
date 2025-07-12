import { useState, useEffect } from 'react';
import { PerformanceMetrics, DashboardStats, RecentActivity } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

interface TimeSeriesData {
  date: string;
  recommendations: number;
  successRate: number;
}

interface AdvisorBreakdownStats {
  bestPerformingStock: string;
  avgConfidenceLevel: number;
  mostRecommendedAction: string;
}

export const usePerformanceMetrics = (advisorId?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [advisorBreakdownStats, setAdvisorBreakdownStats] = useState<AdvisorBreakdownStats | null>(null);
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
        // Fetch comprehensive metrics for specific advisor
        await fetchAdvisorSpecificMetrics(advisorId);
      } else {
        // Fetch dashboard stats (for operations role)
        await fetchDashboardStats();
        await fetchTimeSeriesData(null);
      }
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError('Failed to fetch performance metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvisorSpecificMetrics = async (advisorId: string) => {
    try {
      // Fetch all recommendations for this advisor
      const { data: recommendations, error: recError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('advisor_id', advisorId);

      if (recError) throw recError;

      const recs = recommendations || [];
      
      // Calculate performance metrics
      const totalRecommendations = recs.length;
      const successfulRecommendations = recs.filter(r => r.status === 'successful').length;
      const unsuccessfulRecommendations = recs.filter(r => r.status === 'unsuccessful').length;
      const ongoingRecommendations = recs.filter(r => r.status === 'ongoing').length;
      const successRate = totalRecommendations > 0 ? (successfulRecommendations / totalRecommendations) * 100 : 0;

      // Get advisor info
      const { data: advisor } = await supabase
        .from('advisors')
        .select('*')
        .eq('id', advisorId)
        .single();

      const performanceMetrics: PerformanceMetrics = {
        advisor_id: advisorId,
        total_recommendations: totalRecommendations,
        successful_recommendations: successfulRecommendations,
        unsuccessful_recommendations: unsuccessfulRecommendations,
        ongoing_recommendations: ongoingRecommendations,
        success_rate: successRate,
        advisor: advisor
      };

      setMetrics([performanceMetrics]);

      // Calculate breakdown stats
      await calculateAdvisorBreakdownStats(recs);

      // Fetch time series data for this advisor
      await fetchTimeSeriesData(advisorId);
    } catch (err) {
      console.error('Error fetching advisor specific metrics:', err);
      setMetrics([]);
      setAdvisorBreakdownStats(null);
    }
  };

  const calculateAdvisorBreakdownStats = async (recommendations: any[]) => {
    try {
      if (recommendations.length === 0) {
        setAdvisorBreakdownStats({
          bestPerformingStock: 'No data',
          avgConfidenceLevel: 0,
          mostRecommendedAction: 'No data'
        });
        return;
      }

      // Calculate best performing stock (highest success rate by stock)
      const stockPerformance: { [key: string]: { total: number; successful: number } } = {};
      recommendations.forEach(rec => {
        if (!stockPerformance[rec.stock_symbol]) {
          stockPerformance[rec.stock_symbol] = { total: 0, successful: 0 };
        }
        stockPerformance[rec.stock_symbol].total++;
        if (rec.status === 'successful') {
          stockPerformance[rec.stock_symbol].successful++;
        }
      });

      let bestStock = 'No data';
      let bestSuccessRate = -1;
      Object.entries(stockPerformance).forEach(([stock, data]) => {
        const successRate = data.total > 0 ? (data.successful / data.total) * 100 : 0;
        if (successRate > bestSuccessRate) {
          bestSuccessRate = successRate;
          bestStock = stock;
        }
      });

      // Calculate average confidence level
      const avgConfidence = recommendations.reduce((sum, rec) => sum + (rec.confidence_level || 0), 0) / recommendations.length;

      // Calculate most recommended action
      const actionCounts: { [key: string]: number } = {};
      recommendations.forEach(rec => {
        actionCounts[rec.action] = (actionCounts[rec.action] || 0) + 1;
      });
      
      let mostRecommendedAction = 'No data';
      let maxCount = 0;
      Object.entries(actionCounts).forEach(([action, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostRecommendedAction = action;
        }
      });

      setAdvisorBreakdownStats({
        bestPerformingStock: bestStock,
        avgConfidenceLevel: Math.round(avgConfidence * 10) / 10,
        mostRecommendedAction: mostRecommendedAction.charAt(0).toUpperCase() + mostRecommendedAction.slice(1)
      });
    } catch (err) {
      console.error('Error calculating advisor breakdown stats:', err);
      setAdvisorBreakdownStats(null);
    }
  };

  const fetchAdvisorMetrics = async (advisorId: string) => {
    try {
      // This is kept for backward compatibility but now calls the comprehensive function
      await fetchAdvisorSpecificMetrics(advisorId);
    } catch (err) {
      console.error('Error fetching advisor metrics:', err);
      setMetrics([]);
    }
  };

  const fetchTimeSeriesData = async (advisorId: string | null) => {
    try {
      let query = supabase
        .from('recommendations')
        .select('created_at, status')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());
      
      // If advisorId is provided, filter by advisor
      if (advisorId) {
        query = query.eq('advisor_id', advisorId);
      }
      
      const { data: monthlyData, error } = await query
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
      
      // Also fetch network-wide time series for operations dashboard
      await fetchTimeSeriesData(null);
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
    advisorBreakdownStats,
    loading,
    error,
    fetchMetrics,
  };
};