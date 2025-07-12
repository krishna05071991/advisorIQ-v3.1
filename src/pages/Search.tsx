import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search as SearchIcon, Filter, Download } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('');

  const handleSearch = () => {
    // This will be implemented when Supabase is connected
    console.log('Search:', { searchTerm, searchType, dateRange });
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
          <Button variant="secondary" className="flex items-center justify-center space-x-2 flex-1 sm:flex-none">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced Filters</span>
            <span className="sm:hidden">Filters</span>
          </Button>
          <Button variant="ghost" className="flex items-center justify-center space-x-2 flex-1 sm:flex-none">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Results</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      <Card className="p-6 md:p-12 text-center" variant="glass">
        <SearchIcon className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No search results</h3>
        <p className="text-sm md:text-base text-gray-500">
          Enter a search term to find advisors, recommendations, and performance data
        </p>
      </Card>
    </div>
  );
};