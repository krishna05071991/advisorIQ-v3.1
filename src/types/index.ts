export interface User {
  id: string;
  email: string;
  role: 'operations' | 'advisor' | 'admin';
  created_at: string;
  updated_at: string;
}

// Optionally, add a type for the raw Supabase profile
export interface SupabaseProfile {
  id: string;
  email: string;
  role: 'admin' | 'advisor';
  created_at: string;
  updated_at: string;
}

export interface Advisor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Recommendation {
  id: string;
  advisor_id: string;
  stock_symbol: string;
  action: 'buy' | 'sell' | 'hold';
  target_price: number;
  reasoning: string;
  confidence_level: number;
  timeframe: number;
  status: 'ongoing' | 'successful' | 'unsuccessful';
  created_at: string;
  updated_at: string;
  outcome_notes?: string;
  advisor?: Advisor;
}

export interface PerformanceMetrics {
  advisor_id: string;
  total_recommendations: number;
  successful_recommendations: number;
  unsuccessful_recommendations: number;
  ongoing_recommendations: number;
  success_rate: number;
  advisor?: Advisor;
}

export interface DashboardStats {
  total_advisors: number;
  total_recommendations: number;
  overall_success_rate: number;
  active_recommendations: number;
  recent_activity: RecentActivity[];
  top_performers: PerformanceMetrics[];
}

export interface RecentActivity {
  id: string;
  type: 'recommendation_added' | 'recommendation_updated' | 'advisor_joined';
  description: string;
  created_at: string;
  advisor?: Advisor;
}