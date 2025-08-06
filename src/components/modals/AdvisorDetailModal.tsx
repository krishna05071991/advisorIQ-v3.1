import React from 'react';
import { Advisor } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, User, Mail, Phone, Briefcase, Calendar, Edit } from 'lucide-react';

interface AdvisorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisor: Advisor | null;
  onEdit: (advisor: Advisor) => void;
}

export const AdvisorDetailModal: React.FC<AdvisorDetailModalProps> = ({
  isOpen,
  onClose,
  advisor,
  onEdit
}) => {
  if (!isOpen || !advisor) return null;

  const getAvatarUrl = () => {
    if (advisor.profile_image_url) return advisor.profile_image_url;
    // Use first item from the predefined avatar list as default
    return 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto" variant="glass">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={getAvatarUrl()}
                alt={advisor.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{advisor.name}</h2>
                <p className="text-sm text-gray-600">{advisor.specialization}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onEdit(advisor)}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/60 backdrop-blur-sm flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{advisor.email}</p>
                    </div>
                  </div>

                  {advisor.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100/60 backdrop-blur-sm flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{advisor.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100/60 backdrop-blur-sm flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Specialization</p>
                      <p className="text-sm text-gray-600">{advisor.specialization}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100/60 backdrop-blur-sm flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Joined</p>
                      <p className="text-sm text-gray-600">{formatDate(advisor.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100/60 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">User ID</p>
                      <p className="text-sm text-gray-600 font-mono">{advisor.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                {advisor.bio ? (
                  <p className="text-sm text-gray-700 leading-relaxed">{advisor.bio}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No biography provided</p>
                )}
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