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
    <nav className="glass-navigation sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extralight text-slate-900 tracking-wide">AdvisorIQ</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-light transition-all duration-300 ${
                    isActive
                      ? 'text-blue-600 bg-white/60 backdrop-blur-sm shadow-sm'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-white/40 hover:backdrop-blur-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-light text-slate-700 hover:text-blue-600 hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-300">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="px-4 py-2 text-sm text-slate-500 border-b border-white/20 font-light">
                  {user?.role === 'operations' ? 'Operations Staff' : 'Advisor'}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-white/40 transition-all duration-300 font-light"
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