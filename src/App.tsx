import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Navigation } from './components/layout/Navigation';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Advisors } from './pages/Advisors';
import { Recommendations } from './pages/Recommendations';
import { Analytics } from './pages/Analytics';
import { Search } from './pages/Search';
import { MyRecommendations } from './pages/MyRecommendations';
import { MyPerformance } from './pages/MyPerformance';
import { MyProfile } from './pages/MyProfile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Operations Staff Routes */}
      {user?.role === 'operations' && (
        <>
          <Route path="/advisors" element={<Advisors />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/search" element={<Search />} />
        </>
      )}

      {/* Advisor Routes */}
      {user?.role === 'advisor' && (
        <>
          <Route path="/my-recommendations" element={<MyRecommendations />} />
          <Route path="/my-performance" element={<MyPerformance />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </>
      )}

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <AppRoutes />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
};

export default App;