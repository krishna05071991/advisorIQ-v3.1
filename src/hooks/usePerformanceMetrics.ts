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
  const [advisorMetrics, setAdvisorMetrics] = useState<PerformanceMetrics | null>(null);
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
        await fetchAllAdvisorMetrics();
      }
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError('Failed to fetch performance metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAdvisorMetrics = async () => {
    try {
      // Fetch all advisor performance metrics for search functionality
      const { data: performanceData, error: perfError } = await supabase
        .from('advisor_performance')
        .select('*')
        .order('success_rate', { ascending: false });

      if (perfError) throw perfError;

      // Fetch advisor details separately and merge
      let allMetrics: PerformanceMetrics[] = [];
      if (performanceData && performanceData.length > 0) {
        const advisorIds = performanceData.map(p => p.advisor_id);
        const { data: advisorData, error: advisorError } = await supabase
          .from('advisors')
          .select('*')
          .in('id', advisorIds);

        if (advisorError) throw advisorError;

        // Merge performance data with advisor data
        allMetrics = performanceData.map(perf => ({
          ...perf,
          advisor: advisorData?.find(advisor => advisor.id === perf.advisor_id) || null
        }));
      }

      setMetrics(allMetrics);
    } catch (err) {
      console.error('Error fetching all advisor metrics:', err);
      setMetrics([]);
    }
  };

  const fetchAdvisorMetrics = async (advisorId: string) => {
    try {
      // Get advisor's recommendations to calculate metrics
      const { data: recommendations, error: recError } = await supabase
        .from('recommendations')
        .select(`
          *,
          advisor:advisors(*)
        `)
        .eq('advisor_id', advisorId);

      if (recError) throw recError;

      if (recommendations && recommendations.length > 0) {
        const totalRecs = recommendations.length;
        const successfulRecs = recommendations.filter(r => r.status === 'successful').length;
        const unsuccessfulRecs = recommendations.filter(r => r.status === 'unsuccessful').length;
        const ongoingRecs = recommendations.filter(r => r.status === 'ongoing').length;
        const successRate = totalRecs > 0 ? (successfulRecs / totalRecs) * 100 : 0;

        // Calculate breakdown metrics
        const stockCounts: { [key: string]: { total: number; successful: number } } = {};
        const confidenceLevels: number[] = [];
        const actionCounts: { [key: string]: number } = { buy: 0, sell: 0, hold: 0 };

        recommendations.forEach(rec => {
          // Track stock performance
          if (!stockCounts[rec.stock_symbol]) {
            stockCounts[rec.stock_symbol] = { total: 0, successful: 0 };
          }
          stockCounts[rec.stock_symbol].total++;
          if (rec.status === 'successful') {
            stockCounts[rec.stock_symbol].successful++;
          }

          // Track confidence levels
          confidenceLevels.push(rec.confidence_level);

          // Track actions
          actionCounts[rec.action]++;
        });

        // Find best performing stock (highest success rate)
        let bestStock = '';
        let bestSuccessRate = -1;
        Object.entries(stockCounts).forEach(([stock, data]) => {
          const stockSuccessRate = data.total > 0 ? (data.successful / data.total) * 100 : 0;
          if (stockSuccessRate > bestSuccessRate) {
            bestSuccessRate = stockSuccessRate;
            bestStock = stock;
          }
        });

        // Calculate average confidence level
        const avgConfidence = confidenceLevels.length > 0 
          ? confidenceLevels.reduce((sum, conf) => sum + conf, 0) / confidenceLevels.length 
          : 0;

        // Find most recommended action
        let mostAction: 'buy' | 'sell' | 'hold' = 'buy';
        let maxActionCount = 0;
        (Object.entries(actionCounts) as [('buy' | 'sell' | 'hold'), number][]).forEach(([action, count]) => {
          if (count > maxActionCount) {
            maxActionCount = count;
            mostAction = action;
          }
        });

        const advisorMetric: PerformanceMetrics = {
          advisor_id: advisorId,
          total_recommendations: totalRecs,
          successful_recommendations: successfulRecs,
          unsuccessful_recommendations: unsuccessfulRecs,
          ongoing_recommendations: ongoingRecs,
          success_rate: successRate,
          best_performing_stock: bestStock,
          avg_confidence_level: avgConfidence,
          most_recommended_action: mostAction,
          advisor: recommendations[0].advisor
        };

        setAdvisorMetrics(advisorMetric);
      } else {
        setAdvisorMetrics(null);
      }
    } catch (err) {
      console.error('Error fetching advisor metrics:', err);
      setAdvisorMetrics(null);
    }
  };

  const fetchTimeSeriesData = async (advisorId?: string) => {
    try {
      // Fetch recommendations grouped by month for the last 12 months
      let query = supabase
        .from('recommendations')
        .select('created_at, status')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      // Filter by advisor if provided
      if (advisorId) {
        query = query.eq('advisor_id', advisorId);
      }

      const { data: monthlyData, error } = await query;

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
      // Fetch top performers - manual join to avoid view relationship issues
      const { data: performanceData, error: perfError } = await supabase
        .from('advisor_performance')
        .select('*')
        .order('success_rate', { ascending: false })
        .limit(5);

      if (perfError) throw perfError;

      // Fetch advisor details separately and merge
      let topPerformers: PerformanceMetrics[] = [];
      if (performanceData && performanceData.length > 0) {
        const advisorIds = performanceData.map(p => p.advisor_id);
        const { data: advisorData, error: advisorError } = await supabase
          .from('advisors')
          .select('*')
          .in('id', advisorIds);

        if (advisorError) throw advisorError;

        // Merge performance data with advisor data
        topPerformers = performanceData.map(perf => ({
          ...perf,
          advisor: advisorData?.find(advisor => advisor.id === perf.advisor_id) || null
        }));
      }

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
    advisorMetrics,
    dashboardStats,
    timeSeriesData,
    loading,
    error,
    fetchMetrics,
  };
};