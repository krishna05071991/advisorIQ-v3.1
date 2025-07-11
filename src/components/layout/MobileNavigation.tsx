import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Search,
  User
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
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
    { path: '/my-recommendations', icon: TrendingUp, label: 'Recommendations' },
    { path: '/my-performance', icon: BarChart3, label: 'Performance' },
    { path: '/my-profile', icon: User, label: 'Profile' },
  ];

  const navItems = user?.role === 'operations' ? operationsNavItems : advisorNavItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};