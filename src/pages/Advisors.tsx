import React, { useState } from 'react';
import { useAdvisors } from '../hooks/useAdvisors';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Users, Plus, Search, Filter, Star } from 'lucide-react';

export const Advisors: React.FC = () => {
  const { advisors, loading } = useAdvisors();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  // Sample realistic advisor data with professional headshots
  const sampleAdvisors = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@advisoriq.com',
      specialization: 'Equities',
      bio: 'Senior equity analyst with 12+ years in tech stocks',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      rating: 4.9,
      recommendations: 156
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@advisoriq.com',
      specialization: 'Fixed Income',
      bio: 'Bond market specialist focusing on corporate debt',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      rating: 4.8,
      recommendations: 203
    },
    {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily.johnson@advisoriq.com',
      specialization: 'Derivatives',
      bio: 'Options and futures expert with quantitative background',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      rating: 4.7,
      recommendations: 89
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david.thompson@advisoriq.com',
      specialization: 'Commodities',
      bio: 'Energy and metals trading specialist',
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      rating: 4.6,
      recommendations: 134
    },
    {
      id: '5',
      name: 'Lisa Park',
      email: 'lisa.park@advisoriq.com',
      specialization: 'Alternative Investments',
      bio: 'Private equity and hedge fund analysis expert',
      avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      rating: 4.9,
      recommendations: 97
    },
    {
      id: '6',
      name: 'James Wilson',
      email: 'james.wilson@advisoriq.com',
      specialization: 'Equities',
      bio: 'Healthcare and biotech sector specialist',
      avatar: 'https://images.pexels.com/photos/3760043/pexels-photo-3760043.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      rating: 4.8,
      recommendations: 178
    }
  ];

  // Use sample data when no real advisors are available
  const displayAdvisors = advisors.length > 0 ? advisors : sampleAdvisors;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredAdvisors = displayAdvisors.filter(advisor => {
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
              className="metallic-input border-0 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl"
            >
              <option value="">All Specializations</option>
              <option value="Equities">Equities</option>
              <option value="Fixed Income">Fixed Income</option>
              <option value="Derivatives">Derivatives</option>
              <option value="Commodities">Commodities</option>
              <option value="Alternative Investments">Alternative Investments</option>
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
            <Card key={advisor.id} className="p-6" variant="glass">
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={advisor.avatar || `https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1`}
                    alt={advisor.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white/50"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extralight text-slate-900 mb-1">
                    {advisor.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-light mb-1">{advisor.specialization}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-slate-600 font-light">{advisor.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500 font-light">{advisor.recommendations} recommendations</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 font-light mb-4 line-clamp-2">
                {advisor.bio}
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" variant="ghost">
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};