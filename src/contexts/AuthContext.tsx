import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SupabaseProfile } from '../types';
import { supabase } from '../supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Supabase client initialization (move to src/supabase.ts if needed)
  // Remove Supabase client initialization from here
  // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  // const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  // Replace checkAuth, login, and logout with Supabase logic
  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch user profile
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single<SupabaseProfile>();
        if (profile && !error) {
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role === 'admin' ? 'operations' : 'advisor',
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        throw error || new Error('No session');
      }
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single<SupabaseProfile>();
      if (profile && !profileError) {
        setUser({
          id: profile.id,
          email: profile.email,
          role: profile.role === 'admin' ? 'operations' : 'advisor',
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        });
      } else {
        throw profileError || new Error('Profile not found');
      }
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};