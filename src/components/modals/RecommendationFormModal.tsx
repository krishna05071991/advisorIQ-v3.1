import React, { useState, useEffect } from 'react';
import { Recommendation } from '../../types';
import { useAdvisors } from '../../hooks/useAdvisors';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, TrendingUp } from 'lucide-react';

interface RecommendationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Recommendation>) => Promise<void>;
  recommendation?: Recommendation;
  mode: 'create' | 'edit';
}

export const RecommendationFormModal: React.FC<RecommendationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  recommendation,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { advisors } = useAdvisors();
  
  const [formData, setFormData] = useState({
    advisor_id: '',
    stock_symbol: '',
    action: 'buy' as 'buy' | 'sell' | 'hold',
    target_price: '',
    reasoning: '',
    confidence_level: 75,
    status: 'ongoing' as 'ongoing' | 'successful' | 'unsuccessful',
  });

  useEffect(() => {
    if (recommendation && mode === 'edit') {
      setFormData({
        advisor_id: recommendation.advisor_id || '',
        stock_symbol: recommendation.stock_symbol || '',
        action: recommendation.action || 'buy',
        target_price: recommendation.target_price?.toString() || '',
        reasoning: recommendation.reasoning || '',
        confidence_level: recommendation.confidence_level || 75,
        status: recommendation.status || 'ongoing',
      });
    } else {
      setFormData({
        advisor_id: '',
        stock_symbol: '',
        action: 'buy',
        target_price: '',
        reasoning: '',
        confidence_level: 75,
        status: 'ongoing',
      });
    }
    setError(null);
  }, [recommendation, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.advisor_id || !formData.stock_symbol.trim() || !formData.reasoning.trim()) {
        throw new Error('Advisor, stock symbol, and reasoning are required');
      }

      const targetPrice = parseFloat(formData.target_price);
      if (isNaN(targetPrice) || targetPrice <= 0) {
        throw new Error('Target price must be a valid positive number');
      }

      const submitData = {
        ...formData,
        target_price: targetPrice,
        stock_symbol: formData.stock_symbol.toUpperCase(),
        confidence_level: Math.max(1, Math.min(100, formData.confidence_level)),
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto" variant="glass">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {mode === 'create' ? 'Add New Recommendation' : 'Edit Recommendation'}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'create' ? 'Create a new investment recommendation' : 'Update recommendation details'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-300"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advisor *
                </label>
                <select
                  value={formData.advisor_id}
                  onChange={(e) => handleInputChange('advisor_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                  required
                  disabled={loading}
                >
                  <option value="">Select advisor</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.name} ({advisor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Symbol *
                </label>
                <Input
                  value={formData.stock_symbol}
                  onChange={(e) => handleInputChange('stock_symbol', e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, GOOGL"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action *
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => handleInputChange('action', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                  required
                  disabled={loading}
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="hold">Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.target_price}
                  onChange={(e) => handleInputChange('target_price', e.target.value)}
                  placeholder="e.g., 150.00"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level: {formData.confidence_level}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.confidence_level}
                  onChange={(e) => handleInputChange('confidence_level', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                  disabled={loading}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="successful">Successful</option>
                  <option value="unsuccessful">Unsuccessful</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reasoning *
              </label>
              <textarea
                value={formData.reasoning}
                onChange={(e) => handleInputChange('reasoning', e.target.value)}
                placeholder="Provide detailed reasoning for this recommendation"
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                {mode === 'create' ? 'Create Recommendation' : 'Update Recommendation'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};