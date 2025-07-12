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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="glass-navigation sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extralight text-slate-900 tracking-wide">AdvisorIQ</span>
              </Link>
            </div>

            {/* Desktop Navigation Items */}
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

            {/* Desktop User Menu & Mobile Hamburger */}
            <div className="flex items-center space-x-4">
              {/* Desktop User Menu */}
              <div className="hidden md:block relative group">
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

              {/* Mobile Hamburger Menu */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden w-11 h-11 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/80 transition-all duration-300"
                aria-label="Open navigation menu"
              >
                <svg 
                  className="w-6 h-6 text-slate-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-navigation border-l border-white/20 z-50 transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
            onClick={closeMobileMenu}
            className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/80 transition-all duration-300"
            aria-label="Close navigation menu"
          >
            <svg 
              className="w-5 h-5 text-slate-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
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
                onClick={closeMobileMenu}
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

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="flex items-center justify-center space-x-2 w-full px-4 py-4 rounded-xl text-base font-light text-slate-700 hover:text-red-600 hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-300"
            style={{ minHeight: '44px' }}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};