import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationFormModal } from '../components/modals/RecommendationFormModal';
import { RecommendationDetailModal } from '../components/modals/RecommendationDetailModal';
import { Recommendation } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Plus, Search, Filter } from 'lucide-react';

export const Recommendations: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { recommendations, loading, createRecommendation, updateRecommendation } = useRecommendations(
    undefined,
    searchTerm,
    filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleAddRecommendation = () => {
    setSelectedRecommendation(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEditRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Recommendation>) => {
    if (formMode === 'create') {
      await createRecommendation(data);
    } else if (selectedRecommendation) {
      await updateRecommendation(selectedRecommendation.id, data);
    }
  };

  const closeModals = () => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedRecommendation(null);
  };


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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Recommendations</h1>
            <p className="text-sm md:text-base text-gray-600">
              {user?.role === 'operations' 
                ? 'Review and manage investment recommendations' 
                : 'Track all investment recommendations'
              }
            </p>
          </div>
          {user?.role === 'advisor' && (
            <Button onClick={handleAddRecommendation} className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Recommendation</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={window.innerWidth < 640 ? "Search..." : "Search by stock symbol or advisor..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            >
              <option value="">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="successful">Successful</option>
              <option value="unsuccessful">Unsuccessful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <Card className="p-6 md:p-12 text-center" variant="glass">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterStatus ? 'No recommendations found' : 'No recommendations available'}
          </h3>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            {searchTerm || filterStatus
              ? 'No recommendations match your search criteria'
              : user?.role === 'operations'
                ? 'No recommendations have been created by advisors yet'
                : 'Get started by adding your first recommendation'
            }
          </p>
          {user?.role === 'advisor' && !searchTerm && !filterStatus && (
            <Button onClick={handleAddRecommendation} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Recommendation</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {recommendations.map((recommendation) => (
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
                    <span className="hidden sm:inline">By {recommendation.advisor?.name} • </span>
                    <span className="sm:hidden">{recommendation.advisor?.name} • </span>
                    Target: ${recommendation.target_price}
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 line-clamp-2">
                    {recommendation.reasoning}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-gray-500">
                    <span className="whitespace-nowrap">Confidence: {recommendation.confidence_level}%</span>
                    <span className="whitespace-nowrap">{new Date(recommendation.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 self-start md:self-auto">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex-1 md:flex-none whitespace-nowrap"
                    onClick={() => handleViewDetails(recommendation)}
                  >
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex-1 md:flex-none"
                    disabled={user?.role === 'operations'}
                    title={user?.role === 'operations' ? 'Operations staff cannot edit recommendations' : ''}
                    onClick={() => handleEditRecommendation(recommendation)}
                  >
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

      <RecommendationDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeModals}
        recommendation={selectedRecommendation}
        onEdit={(recommendation) => {
          setIsDetailModalOpen(false);
          handleEditRecommendation(recommendation);
        }}
      />
    </div>
  );
};