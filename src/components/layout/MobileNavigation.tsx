import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Search,
  User,
  Menu,
  X
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    closeMenu();
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-navigation border-t border-white/20 z-40">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Current Page Indicator */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              if (isActive) {
                return (
                  <div key={item.path} className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-light text-blue-600">{item.label}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="w-11 h-11 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/80 transition-all duration-300"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-navigation border-l border-white/20 z-50 transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extralight text-slate-900 tracking-wide">AdvisorIQ</span>
          </div>
          <button
            onClick={closeMenu}
            className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/80 transition-all duration-300"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-light text-slate-900 truncate">{user?.email}</p>
              <p className="text-xs text-slate-500 font-light">
                {user?.role === 'operations' ? 'Operations Staff' : 'Advisor'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-light transition-all duration-300 w-full ${
                  isActive
                    ? 'text-blue-600 bg-white/60 backdrop-blur-sm shadow-sm'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-white/40 hover:backdrop-blur-sm'
                }`}
                style={{ minHeight: '44px' }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-center">
            <p className="text-xs text-slate-400 font-light">
              Premium Fintech Intelligence Platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
};