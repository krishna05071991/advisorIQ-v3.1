import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { TopPerformers } from '../components/dashboard/TopPerformers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { dashboardStats, loading } = usePerformanceMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Mock data for demonstration until Supabase is connected
  const mockStats = {
    total_advisors: 0,
    total_recommendations: 0,
    overall_success_rate: 0,
    active_recommendations: 0,
  };

  const mockActivities: any[] = [];
  const mockPerformers: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.role === 'operations' ? 'Operations Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'operations' 
            ? 'Overview of your advisor network and performance metrics' 
            : 'Your personal performance and recommendation tracking'
          }
        </p>
      </div>

      <DashboardStats stats={dashboardStats || mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity activities={dashboardStats?.recent_activity || mockActivities} />
        </div>
        <div>
          <TopPerformers performers={dashboardStats?.top_performers || mockPerformers} />
        </div>
      </div>
    </div>
  );
};