import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Search,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const operationsNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/advisors', icon: Users, label: 'Advisors' },
    { path: '/recommendations', icon: TrendingUp, label: 'Recommendations' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/search', icon: Search, label: 'Search' },
  ];

  const advisorNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-recommendations', icon: TrendingUp, label: 'My Recommendations' },
    { path: '/my-performance', icon: BarChart3, label: 'My Performance' },
    { path: '/my-profile', icon: User, label: 'My Profile' },
  ];

  const navItems = user?.role === 'operations' ? operationsNavItems : advisorNavItems;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 metallic-button rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AdvisorIQ
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'metallic-button text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:chrome-reflection hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-3 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:chrome-reflection hover:shadow-lg transition-all duration-300">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover avatar-glow border-2 border-white/50"
                />
                <div className="text-left">
                  <div className="text-sm font-medium">{user?.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500">
                    {user?.role === 'operations' ? 'Operations' : 'Advisor'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-56 chrome-reflection rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-white/30">
                <div className="px-6 py-3 text-sm text-gray-600 border-b border-white/30">
                  <div className="font-medium">{user?.email}</div>
                  <div className="text-xs text-gray-500">
                    {user?.role === 'operations' ? 'Operations Staff' : 'Financial Advisor'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-red-50/80 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};