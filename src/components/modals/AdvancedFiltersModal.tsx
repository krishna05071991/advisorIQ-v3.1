import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Filter } from 'lucide-react';

export interface AdvancedFilters {
  dateFrom: string;
  dateTo: string;
  confidenceMin: number;
  confidenceMax: number;
  specialization: string;
  action: string;
  status: string;
}

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
  searchType: string;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  searchType
}) => {
  const [filters, setFilters] = useState<AdvancedFilters>({
    dateFrom: '',
    dateTo: '',
    confidenceMin: 1,
    confidenceMax: 100,
    specialization: '',
    action: '',
    status: ''
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      confidenceMin: 1,
      confidenceMax: 100,
      specialization: '',
      action: '',
      status: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" variant="glass">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 backdrop-blur-sm flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
                <p className="text-sm text-gray-600">
                  Refine your search with additional criteria
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Recommendation-specific filters */}
            {searchType === 'recommendations' && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Confidence Level: {filters.confidenceMin}% - {filters.confidenceMax}%
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={filters.confidenceMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, confidenceMin: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={filters.confidenceMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, confidenceMax: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                    <select
                      value={filters.action}
                      onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                    >
                      <option value="">All Actions</option>
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                      <option value="hold">Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                    >
                      <option value="">All Statuses</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="successful">Successful</option>
                      <option value="unsuccessful">Unsuccessful</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Advisor-specific filters */}
            {searchType === 'advisors' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select
                  value={filters.specialization}
                  onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 metallic-input"
                >
                  <option value="">All Specializations</option>
                  <option value="Equities">Equities</option>
                  <option value="Fixed Income">Fixed Income</option>
                  <option value="Derivatives">Derivatives</option>
                  <option value="Commodities">Commodities</option>
                  <option value="Alternative Investments">Alternative Investments</option>
                  <option value="Portfolio Management">Portfolio Management</option>
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 mt-6 border-t border-white/20">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 sm:flex-none"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};