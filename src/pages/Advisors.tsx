import React, { useState } from 'react';
import { useAdvisors } from '../hooks/useAdvisors';
import { AdvisorFormModal } from '../components/modals/AdvisorFormModal';
import { AdvisorDetailModal } from '../components/modals/AdvisorDetailModal';
import { Advisor } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Users, Plus, Search, Filter } from 'lucide-react';

export const Advisors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { advisors, loading, updateAdvisor } = useAdvisors(searchTerm, filterSpecialization);

  const getAvatarUrl = (index: number) => {
    const avatars = [
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    ];
    return avatars[index % avatars.length];
  };

  const handleEditAdvisor = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setIsEditModalOpen(true);
  };

  const handleViewProfile = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setIsDetailModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Advisor>) => {
    if (selectedAdvisor) {
      await updateAdvisor(selectedAdvisor.id, data);
    }
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedAdvisor(null);
  };

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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Advisors</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your advisor network</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={window.innerWidth < 640 ? "Search..." : "Search advisors..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            >
              <option value="">All Types</option>
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
        <Card className="p-6 md:p-12 text-center" variant="glass">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No advisors found</h3>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            {searchTerm || filterSpecialization 
              ? 'No advisors match your search criteria' 
              : 'No advisors are currently available in the system'
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAdvisors.map((advisor, index) => (
            <Card key={advisor.id} className="p-4 md:p-6" variant="glass">
              <div className="flex items-start space-x-3 md:space-x-4">
                <img 
                  src={getAvatarUrl(index)}
                  alt={advisor.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">
                    {advisor.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 truncate">{advisor.specialization}</p>
                  <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 truncate">{advisor.email}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="flex-1 sm:flex-none"
                      onClick={() => handleViewProfile(advisor)}
                    >
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="flex-1 sm:flex-none"
                      onClick={() => handleEditAdvisor(advisor)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AdvisorFormModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditSubmit}
        advisor={selectedAdvisor}
        mode="edit"
      />

      <AdvisorDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeModals}
        advisor={selectedAdvisor}
        onEdit={(advisor) => {
          setIsDetailModalOpen(false);
          handleEditAdvisor(advisor);
        }}
      />
    </div>
  );
};