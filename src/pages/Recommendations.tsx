import React, { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrendingUp, Plus, Search, Filter } from 'lucide-react';

export const Recommendations: React.FC = () => {
  const { recommendations, loading } = useRecommendations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.stock_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.advisor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || rec.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Recommendations</h1>
            <p className="text-gray-600">Track all investment recommendations</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Recommendation</span>
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by stock symbol or advisor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="successful">Successful</option>
              <option value="unsuccessful">Unsuccessful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecommendations.length === 0 ? (
        <Card className="p-12 text-center" gradient>
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus 
              ? 'No recommendations match your search criteria' 
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
                    By {recommendation.advisor?.name} • Target: ${recommendation.target_price}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    {recommendation.reasoning}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Confidence: {recommendation.confidence_level}%</span>
                    <span>Created: {new Date(recommendation.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    View Details
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