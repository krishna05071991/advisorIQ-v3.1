import React, { useState } from 'react';
import { useAdvisors } from '../hooks/useAdvisors';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Users, Plus, Search, Filter } from 'lucide-react';

export const Advisors: React.FC = () => {
  const { advisors, loading } = useAdvisors();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !filterSpecialization || advisor.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Advisors</h1>
            <p className="text-gray-600">Manage your advisor network</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Advisor</span>
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search advisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specializations</option>
              <option value="Equities">Equities</option>
              <option value="Fixed Income">Fixed Income</option>
              <option value="Derivatives">Derivatives</option>
              <option value="Commodities">Commodities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advisors Grid */}
      {filteredAdvisors.length === 0 ? (
        <Card className="p-12 text-center" gradient>
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No advisors found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterSpecialization 
              ? 'No advisors match your search criteria' 
              : 'Get started by adding your first advisor'
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Advisor
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvisors.map((advisor) => (
            <Card key={advisor.id} className="p-6" gradient>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {advisor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{advisor.specialization}</p>
                  <p className="text-sm text-gray-500 mb-4">{advisor.email}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary">
                      View Profile
                    </Button>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};