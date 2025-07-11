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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search</h1>
        <p className="text-gray-600">Find advisors, recommendations, and performance data</p>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-8" gradient>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search across all data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="advisors">Advisors</option>
              <option value="recommendations">Recommendations</option>
              <option value="performance">Performance</option>
            </select>
          </div>
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <Button onClick={handleSearch} className="flex items-center space-x-2">
            <SearchIcon className="w-4 h-4" />
            <span>Search</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      <Card className="p-12 text-center" gradient>
        <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No search results</h3>
        <p className="text-gray-500">
          Enter a search term to find advisors, recommendations, and performance data
        </p>
      </Card>
    </div>
  );
};