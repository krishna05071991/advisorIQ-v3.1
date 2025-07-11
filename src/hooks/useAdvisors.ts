import { useState, useEffect } from 'react';
import { Advisor } from '../types';
import { supabase } from '../supabase';

export const useAdvisors = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
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
  const createAdvisor = async (advisorData: Partial<Advisor>) => {
    try {
      const { error } = await supabase
        .from('advisors')
        .insert(advisorData);
      
      if (error) {
        throw error;
      }
      
      await fetchAdvisors();
    } catch (err) {
      console.error('Error creating advisor:', err);
      throw err;
    }
  };

  const updateAdvisor = async (userId: string, advisorData: Partial<Advisor>) => {
    try {
      const { error } = await supabase
        .from('advisors')
        .update(advisorData)
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
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

  return {
    advisors,
    loading,
    error,
    fetchAdvisors,
    fetchAdvisorProfile,
    createAdvisor,
    updateAdvisor,
    deleteAdvisor,
  };
};