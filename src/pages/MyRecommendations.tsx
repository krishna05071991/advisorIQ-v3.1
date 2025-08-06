import { supabase } from '../supabase';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationFormModal } from '../components/modals/RecommendationFormModal';
import { Recommendation } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Plus, Search } from 'lucide-react';

export const MyRecommendations: React.FC = () => {
  const { user } = useAuth();
  // Get advisor ID from advisors table, not user ID
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const { recommendations, loading, createRecommendation } = useRecommendations(advisorId || undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    const fetchAdvisorId = async () => {
      if (user?.id) {
        const { data: advisor } = await supabase
          .from('advisors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (advisor) {
          setAdvisorId(advisor.id);
        }
      }
    };

    fetchAdvisorId();
  }, [user?.id]);

  const handleAddRecommendation = () => {
    setSelectedRecommendation(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const closeModals = () => {
    setIsFormModalOpen(false);
    setSelectedRecommendation(null);
  };

  const handleFormSubmit = async (data: Partial<Recommendation>) => {
    if (advisorId) {
      await createRecommendation({ ...data, advisor_id: advisorId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredRecommendations = recommendations.filter(rec => 
    rec.stock_symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-green-600 bg-green-100';
      case 'unsuccessful':
        return 'text-red-600 bg-red-100';
      case 'ongoing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">My Recommendations</h1>
            <p className="text-sm md:text-base text-gray-600">Track your investment recommendations</p>
          </div>
          <Button 
            onClick={handleAddRecommendation}
            className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Recommendation</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={window.innerWidth < 640 ? "Search..." : "Search your recommendations..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecommendations.length === 0 ? (
        <Card className="p-6 md:p-12 text-center" variant="glass">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            {searchTerm 
              ? 'No recommendations match your search' 
              : 'Get started by adding your first recommendation'
            }
          </p>
          <Button onClick={handleAddRecommendation} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Recommendation</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="p-4 md:p-6" variant="glass">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      {recommendation.stock_symbol}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(recommendation.status)}`}>
                      {recommendation.status}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap">
                      {recommendation.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">
                    Target: ${recommendation.target_price} • Confidence: {recommendation.confidence_level}%
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 line-clamp-2">
                    {recommendation.reasoning}
                  </p>
                  <div className="text-xs text-gray-500">
                    <span className="whitespace-nowrap">Created: {new Date(recommendation.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 self-start md:self-auto">
                  <Button size="sm" variant="secondary" className="flex-1 md:flex-none whitespace-nowrap">
                    <span className="hidden sm:inline">Update Status</span>
                    <span className="sm:hidden">Update</span>
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 md:flex-none">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <RecommendationFormModal
        isOpen={isFormModalOpen}
        onClose={closeModals}
        onSubmit={handleFormSubmit}
        recommendation={selectedRecommendation}
        mode={formMode}
      />
    </div>
  );
};