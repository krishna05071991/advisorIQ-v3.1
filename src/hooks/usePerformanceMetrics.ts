import { useState, useEffect } from 'react';
import { PerformanceMetrics, DashboardStats } from '../types';
import { useAuth } from '../contexts/AuthContext';

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
      // This will be implemented when Supabase is connected
      console.log('Fetching performance metrics for:', advisorId || 'all');
      setMetrics([]);
      setDashboardStats(null);
      setError(null);
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError('Failed to fetch performance metrics');
    } finally {
      setLoading(false);
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