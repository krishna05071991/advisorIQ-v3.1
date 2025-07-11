import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Plus, Search } from 'lucide-react';

export const MyRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { recommendations, loading } = useRecommendations(user?.id);
  const [searchTerm, setSearchTerm] = useState('');

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Recommendations</h1>
            <p className="text-gray-600">Track your investment recommendations</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Recommendation</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search your recommendations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecommendations.length === 0 ? (
        <Card className="p-12 text-center" gradient>
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'No recommendations match your search' 
              : 'Get started by adding your first recommendation'
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Recommendation
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="p-6" gradient>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recommendation.stock_symbol}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(recommendation.status)}`}>
                      {recommendation.status}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {recommendation.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Target: ${recommendation.target_price} • Confidence: {recommendation.confidence_level}%
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    {recommendation.reasoning}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Created: {new Date(recommendation.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    Update Status
                  </Button>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};