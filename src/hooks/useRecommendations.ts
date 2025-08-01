import { useState, useEffect } from 'react';
import { Recommendation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

export const useRecommendations = (advisorId?: string, searchTerm?: string, filterStatus?: string) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRecommendations();
  }, [advisorId, user, searchTerm, filterStatus]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('recommendations')
        .select(`
          *,
          advisor:advisors(*)
        `)
        .order('created_at', { ascending: false });

      // If advisorId is provided, filter by advisor
      if (advisorId) {
        query = query.eq('advisor_id', advisorId);
      }

      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`stock_symbol.ilike.%${searchTerm}%,reasoning.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (filterStatus && filterStatus.trim()) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      setRecommendations(data || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const createRecommendation = async (recommendationData: Partial<Recommendation>) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .insert(recommendationData);

      if (error) throw error;

      await fetchRecommendations();
    } catch (err) {
      console.error('Error creating recommendation:', err);
      throw err;
    }
  };

  const updateRecommendation = async (id: string, recommendationData: Partial<Recommendation>) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .update({
          ...recommendationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchRecommendations();
    } catch (err) {
      console.error('Error updating recommendation:', err);
      throw err;
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchRecommendations();
    } catch (err) {
      console.error('Error deleting recommendation:', err);
      throw err;
    }
  };

  const getRecommendationById = async (id: string): Promise<Recommendation | null> => {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .select(`
          *,
          advisor:advisors(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error fetching recommendation by ID:', err);
      return null;
    }
  };

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    getRecommendationById,
  };
};