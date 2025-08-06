import { useState, useEffect } from 'react';
import { Advisor } from '../types';
import { supabase } from '../supabase';

export const useAdvisors = (searchTerm?: string, filterSpecialization?: string, dateFrom?: string, dateTo?: string) => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvisors();
  }, [searchTerm, filterSpecialization, dateFrom, dateTo]);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('advisors')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      // Apply specialization filter
      if (filterSpecialization && filterSpecialization.trim()) {
        query = query.eq('specialization', filterSpecialization);
      }
      
      // Apply date filters
      if (dateFrom && dateFrom.trim()) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo && dateTo.trim()) {
        query = query.lte('created_at', dateTo);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setAdvisors(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching advisors:', err);
      setError('Failed to fetch advisors');
      setAdvisors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvisorProfile = async (userId: string): Promise<Advisor | null> => {
    try {
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, advisor profile doesn't exist
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching advisor profile:', err);
      throw err;
    }
  };

  const updateAdvisor = async (advisorId: string, advisorData: Partial<Advisor>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('advisors')
        .update({
          ...advisorData,
          updated_at: new Date().toISOString()
        })
        .eq('id', advisorId);
      
      if (error) {
        throw error;
      }
      
      await fetchAdvisors();
    } catch (err) {
      console.error('Error updating advisor:', err);
      throw err;
    }
  };

  const deleteAdvisor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advisors')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      await fetchAdvisors();
    } catch (err) {
      console.error('Error deleting advisor:', err);
      throw err;
    }
  };

  const getAdvisorById = async (id: string): Promise<Advisor | null> => {
    try {
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching advisor by ID:', err);
      return null;
    }
  };

  return {
    advisors,
    loading,
    error,
    fetchAdvisors,
    fetchAdvisorProfile,
    updateAdvisor,
    deleteAdvisor,
    getAdvisorById,
  };
};