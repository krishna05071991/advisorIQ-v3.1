import React from 'react';
import { Recommendation } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';
import { X, TrendingUp, Target, BarChart3, Calendar, User, Edit } from 'lucide-react';

interface RecommendationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  onEdit: (recommendation: Recommendation) => void;
}

export const RecommendationDetailModal: React.FC<RecommendationDetailModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  onEdit
}) => {
  if (!isOpen || !recommendation) return null;

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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'text-green-600 bg-green-100';
      case 'sell':
        return 'text-red-600 bg-red-100';
      case 'hold':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceLevel = () => {
    const level = recommendation.confidence_level;
    if (level >= 80) return { label: 'Very High', color: 'text-green-600' };
    if (level >= 60) return { label: 'High', color: 'text-blue-600' };
    if (level >= 40) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-red-600' };
  };

  const confidenceInfo = getConfidenceLevel();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" variant="glass">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-blue-100/60 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-semibold text-gray-900">{recommendation.stock_symbol}</h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getActionColor(recommendation.action)}`}>
                    {recommendation.action.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(recommendation.status)}`}>
                    {recommendation.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Investment Recommendation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onEdit(recommendation)}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-300"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100/60 backdrop-blur-sm flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Target Price</p>
                        <p className="text-lg font-semibold text-gray-900">${recommendation.target_price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/60 backdrop-blur-sm flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Confidence</p>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={recommendation.confidence_level} size="md" />
                          <span className="text-sm font-medium text-gray-900">
                            ({recommendation.confidence_level}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Reasoning</h3>
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-sm text-gray-700 leading-relaxed">{recommendation.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Advisor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advisor</h3>
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100/60 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {recommendation.advisor?.name || 'Unknown Advisor'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {recommendation.advisor?.specialization || 'Specialization not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100/60 backdrop-blur-sm flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-xs text-gray-600">{formatDate(recommendation.created_at)}</p>
                    </div>
                  </div>

                  {recommendation.updated_at && recommendation.updated_at !== recommendation.created_at && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100/60 backdrop-blur-sm flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-600">{formatDate(recommendation.updated_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recommendation ID</span>
                    <span className="text-sm font-mono text-gray-900">{recommendation.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Action Type</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{recommendation.action}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Status</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{recommendation.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 mt-6 border-t border-white/20">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};