import React, { useState } from 'react';
import { useAdvisors } from '../hooks/useAdvisors';
import { useRecommendations } from '../hooks/useRecommendations';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { AdvancedFiltersModal, AdvancedFilters } from '../components/modals/AdvancedFiltersModal';
import { Advisor, Recommendation, PerformanceMetrics } from '../types';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Search as SearchIcon, Filter, Download, Users, TrendingUp, BarChart3 } from 'lucide-react';

interface SearchResults {
  advisors: Advisor[];
  recommendations: Recommendation[];
  performance: PerformanceMetrics[];
}

export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    dateFrom: '',
    dateTo: '',
    confidenceMin: 1,
    confidenceMax: 100,
    specialization: '',
    action: '',
    status: ''
  });
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    advisors: [],
    recommendations: [],
    performance: []
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const { advisors } = useAdvisors();
  const { recommendations } = useRecommendations();
  const { metrics } = usePerformanceMetrics();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Show user feedback if no search term is entered
      setHasSearched(true);
      setSearchResults({
        advisors: [],
        recommendations: [],
        performance: []
      });
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      let results: SearchResults = {
        advisors: [],
        recommendations: [],
        performance: []
      };

      // Apply date filter helper
      const applyDateFilter = (items: any[], dateField: string = 'created_at') => {
        return items.filter(item => {
          const itemDate = new Date(item[dateField]);
          const now = new Date();
          
          if (dateRange === '7d') {
            return itemDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          } else if (dateRange === '30d') {
            return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          } else if (dateRange === '90d') {
            return itemDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          } else if (dateRange === '1y') {
            return itemDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          }
          
          // Custom date range from advanced filters
          if (advancedFilters.dateFrom && itemDate < new Date(advancedFilters.dateFrom)) {
            return false;
          }
          if (advancedFilters.dateTo && itemDate > new Date(advancedFilters.dateTo)) {
            return false;
          }
          
          return true;
        });
      };

      // Search Advisors
      if (searchType === 'all' || searchType === 'advisors') {
        let filteredAdvisors = advisors.filter(advisor =>
          advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (advisor.specialization && advisor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Apply advanced filters
        if (advancedFilters.specialization) {
          filteredAdvisors = filteredAdvisors.filter(advisor => 
            advisor.specialization === advancedFilters.specialization
          );
        }

        results.advisors = applyDateFilter(filteredAdvisors);
      }

      // Search Recommendations
      if (searchType === 'all' || searchType === 'recommendations') {
        let filteredRecommendations = recommendations.filter(rec =>
          rec.stock_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (rec.advisor?.name && rec.advisor.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Apply advanced filters
        if (advancedFilters.action) {
          filteredRecommendations = filteredRecommendations.filter(rec => rec.action === advancedFilters.action);
        }
        if (advancedFilters.status) {
          filteredRecommendations = filteredRecommendations.filter(rec => rec.status === advancedFilters.status);
        }
        if (advancedFilters.confidenceMin || advancedFilters.confidenceMax !== 100) {
          filteredRecommendations = filteredRecommendations.filter(rec => 
            rec.confidence_level >= advancedFilters.confidenceMin && 
            rec.confidence_level <= advancedFilters.confidenceMax
          );
        }

        results.recommendations = applyDateFilter(filteredRecommendations);
      }

      // Search Performance
      if (searchType === 'all' || searchType === 'performance') {
        let filteredPerformance = metrics.filter(metric =>
          metric.advisor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          metric.advisor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        results.performance = filteredPerformance;
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const { advisors, recommendations, performance } = searchResults;
    
    let csvContent = '';
    
    if (searchType === 'all') {
      // Export all data types
      csvContent += 'Type,Name,Email,Specialization,Stock Symbol,Action,Target Price,Confidence,Success Rate\n';
      
      advisors.forEach(advisor => {
        csvContent += `Advisor,"${advisor.name}","${advisor.email}","${advisor.specialization || ''}",,,,,\n`;
      });
      
      recommendations.forEach(rec => {
        csvContent += `Recommendation,"${rec.advisor?.name || ''}","${rec.advisor?.email || ''}","${rec.advisor?.specialization || ''}","${rec.stock_symbol}","${rec.action}","${rec.target_price}","${rec.confidence_level}",\n`;
      });
      
      performance.forEach(perf => {
        csvContent += `Performance,"${perf.advisor?.name || ''}","${perf.advisor?.email || ''}","${perf.advisor?.specialization || ''}",,,,,"${perf.success_rate}%"\n`;
      });
    } else if (searchType === 'advisors') {
      csvContent += 'Name,Email,Specialization,Phone,Created Date\n';
      advisors.forEach(advisor => {
        csvContent += `"${advisor.name}","${advisor.email}","${advisor.specialization || ''}","${advisor.phone || ''}","${new Date(advisor.created_at).toLocaleDateString()}"\n`;
      });
    } else if (searchType === 'recommendations') {
      csvContent += 'Stock Symbol,Action,Target Price,Confidence,Status,Advisor,Created Date\n';
      recommendations.forEach(rec => {
        csvContent += `"${rec.stock_symbol}","${rec.action}","${rec.target_price}","${rec.confidence_level}","${rec.status}","${rec.advisor?.name || ''}","${new Date(rec.created_at).toLocaleDateString()}"\n`;
      });
    } else if (searchType === 'performance') {
      csvContent += 'Advisor,Total Recommendations,Successful,Success Rate\n';
      performance.forEach(perf => {
        csvContent += `"${perf.advisor?.name || ''}","${perf.total_recommendations}","${perf.successful_recommendations}","${perf.success_rate}%"\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `search_results_${searchType}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalResults = () => {
    return searchResults.advisors.length + searchResults.recommendations.length + searchResults.performance.length;
  };

  const renderSearchResults = () => {
    const { advisors, recommendations, performance } = searchResults;
    const totalResults = getTotalResults();

    if (loading) {
      return (
        <Card className="p-6 text-center" variant="glass">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600 mt-4">Searching...</p>
        </Card>
      );
    }

    if (!hasSearched) {
      return (
        <Card className="p-6 md:p-12 text-center" variant="glass">
          <SearchIcon className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No search results</h3>
          <p className="text-sm md:text-base text-gray-500">
            Enter a search term to find advisors, recommendations, and performance data
          </p>
        </Card>
      );
    }

    if (totalResults === 0) {
      return (
        <Card className="p-6 md:p-12 text-center" variant="glass">
          <SearchIcon className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-sm md:text-base text-gray-500">
            Try adjusting your search terms or filters
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Results Summary */}
        <Card className="p-4 bg-blue-50/50" variant="glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Found {totalResults} results for "{searchTerm}"
              </p>
              <p className="text-xs text-gray-600">
                {advisors.length} advisors, {recommendations.length} recommendations, {performance.length} performance records
              </p>
            </div>
            {totalResults > 0 && (
              <Button onClick={handleExport} variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </Card>

        {/* Advisors Results */}
        {advisors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Advisors ({advisors.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advisors.slice(0, 6).map((advisor) => (
                <Card key={advisor.id} className="p-4" variant="glass">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{advisor.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{advisor.specialization}</p>
                      <p className="text-xs text-gray-500 truncate">{advisor.email}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {advisors.length > 6 && (
              <p className="text-sm text-gray-500 mt-2">
                And {advisors.length - 6} more advisors...
              </p>
            )}
          </div>
        )}

        {/* Recommendations Results */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recommendations ({recommendations.length})
            </h3>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec) => (
                <Card key={rec.id} className="p-4" variant="glass">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{rec.stock_symbol}</h4>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {rec.action.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {rec.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        By {rec.advisor?.name} • Target: ${rec.target_price} • Confidence: {rec.confidence_level}%
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">{rec.reasoning}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {recommendations.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                And {recommendations.length - 5} more recommendations...
              </p>
            )}
          </div>
        )}

        {/* Performance Results */}
        {performance.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance ({performance.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performance.slice(0, 6).map((perf) => (
                <Card key={perf.advisor_id} className="p-4" variant="glass">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {perf.advisor?.name || 'Unknown Advisor'}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {perf.total_recommendations} recommendations
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {perf.success_rate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">success rate</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {performance.length > 6 && (
              <p className="text-sm text-gray-500 mt-2">
                And {performance.length - 6} more performance records...
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Search</h1>
        <p className="text-sm md:text-base text-gray-600">Find advisors, recommendations, and performance data</p>
      </div>

      {/* Search Form */}
      <Card className="p-4 md:p-6 mb-6 md:mb-8" variant="glass">
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
          <div className="md:col-span-2 order-1">
            <Input
              placeholder={window.innerWidth < 640 ? "Search..." : "Search across all data..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="order-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 md:px-3 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="advisors">Advisors</option>
              <option value="recommendations">Recs</option>
              <option value="performance">Performance</option>
            </select>
          </div>
          <div className="order-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 md:px-3 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Time</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <Button onClick={handleSearch} className="flex items-center justify-center space-x-2 flex-1 sm:flex-none">
            <SearchIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden">Search</span>
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center justify-center space-x-2 flex-1 sm:flex-none"
            onClick={() => setIsAdvancedModalOpen(true)}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced Filters</span>
            <span className="sm:hidden">Filters</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center justify-center space-x-2 flex-1 sm:flex-none"
            onClick={handleExport}
            disabled={!hasSearched || getTotalResults() === 0}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Results</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      {renderSearchResults()}

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onApply={(filters) => {
          setAdvancedFilters(filters);
          if (hasSearched) {
            handleSearch();
          }
        }}
        searchType={searchType}
      />
    </div>
  );
};