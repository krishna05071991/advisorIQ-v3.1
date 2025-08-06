import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdvisors } from '../hooks/useAdvisors';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { User, Mail, Phone, Briefcase, Edit } from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { user } = useAuth();
  const { fetchAdvisorProfile, updateAdvisor } = useAdvisors();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    specialization: '',
    bio: '',
    profile_image: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    specialization: '',
    bio: '',
    profile_image: '',
  });

  const getDefaultAvatar = () => {
    return 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face';
  };
  useEffect(() => {
    if (user?.id) {
      loadAdvisorProfile();
    }
  }, [user?.id]);

  const loadAdvisorProfile = async () => {
    try {
      setLoading(true);
      const profile = await fetchAdvisorProfile(user!.id);
      
      if (profile) {
        const profileData = {
          name: profile.name || '',
          email: profile.email || user?.email || '',
          phone: profile.phone || '',
          specialization: profile.specialization || '',
          bio: profile.bio || '',
          profile_image: profile.profile_image || getDefaultAvatar(),
        };
        setFormData(profileData);
        setOriginalData(profileData);
      }
    } catch (error) {
      console.error('Error loading advisor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setSaveLoading(true);
      setSaveError(null);
      
      await updateAdvisor(user.id, {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        bio: formData.bio,
        profile_image: formData.profile_image,
      });
      
      setOriginalData({ ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
    setSaveError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your advisor profile information</p>
          </div>
          <Button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            variant={isEditing ? 'secondary' : 'primary'}
            className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6"
            disabled={saveLoading}
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            <span className="sm:hidden">{isEditing ? 'Cancel' : 'Edit'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Image */}
        <Card className="p-4 md:p-6 text-center" variant="glass">
          {formData.profile_image || getDefaultAvatar() ? (
            <img 
              src={formData.profile_image || getDefaultAvatar()} 
              alt="Profile" 
              className="w-24 md:w-32 h-24 md:h-32 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 md:w-32 h-24 md:h-32 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-12 md:w-16 h-12 md:h-16 text-blue-600" />
            </div>
          )}
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 truncate">
            {formData.name || 'Your Name'}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mb-4 truncate">{formData.specialization || 'Specialization'}</p>
        </Card>

        {/* Profile Information */}
        <Card className="p-4 md:p-6 lg:col-span-2" variant="glass">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Profile Information</h3>
          
          {saveError && (
            <div className="mb-4 p-2 md:p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs md:text-sm text-red-600">{saveError}</p>
            </div>
          )}
          
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  disabled={saveLoading}
                />
              ) : (
                <p className="text-sm md:text-base text-gray-900 truncate">{formData.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <p className="text-sm md:text-base text-gray-900 truncate">{formData.email}</p>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  disabled={saveLoading}
                />
              ) : (
                <p className="text-sm md:text-base text-gray-900 truncate">{formData.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Specialization
              </label>
              {isEditing ? (
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saveLoading}
                >
                  <option value="">Select specialization</option>
                  <option value="Equities">Equities</option>
                  <option value="Fixed Income">Fixed Income</option>
                  <option value="Derivatives">Derivatives</option>
                  <option value="Commodities">Commodities</option>
                  <option value="Alternative Investments">Alternative Investments</option>
                </select>
              ) : (
                <p className="text-sm md:text-base text-gray-900 truncate">{formData.specialization || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your experience and expertise"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saveLoading}
                />
              ) : (
                <p className="text-sm md:text-base text-gray-900">{formData.bio || 'Not set'}</p>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <Input
                  value={formData.profile_image}
                  onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                  placeholder="Enter image URL"
                  disabled={saveLoading}
                />
              </div>
            )}

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button onClick={handleSave} loading={saveLoading} disabled={saveLoading} className="flex-1 sm:flex-none">
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={handleCancel} disabled={saveLoading} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};