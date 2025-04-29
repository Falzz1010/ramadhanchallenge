import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChallengesPage from './pages/ChallengesPage';
import BadgesPage from './pages/BadgesPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import { useThemeStore } from './store/themeStore';
import { AuthProvider } from './components/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   
import LandingPage from './pages/LandingPage';
import ProgramPage from './pages/ProgramPage';
import JadwalPage from './pages/JadwalPage';  
import KomunitasPage from './pages/KomunitasPage';  
import BlogPage from './pages/BlogPage';

function App() {
  const { user, isLoginAllowed, setLoginAllowed } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  // Reset login access on refresh
  React.useEffect(() => {
    setLoginAllowed(false);
  }, []);
 
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <AuthProvider>
          <Routes>
            {/* Landing Page - Default Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Login Page - Only accessible through button click */}
            <Route 
              path="/login" 
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : isLoginAllowed ? (
                  <LoginPage />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            {/* Protected routes */}
            <Route element={<Layout />}>
              <Route 
                path="/dashboard" 
                element={
                  user ? (
                    <DashboardPage />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/challenges" 
                element={
                  user ? (
                    <ChallengesPage />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }  
              />
              <Route 
                path="/badges" 
                element={
                  user ? (
                    <BadgesPage />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/community" 
                element={
                  user ? (
                    <CommunityPage />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/profile" 
                element={
                  user ? (
                    <ProfilePage />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
            </Route>
            
            {/* New routes */}
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/jadwal" element={<JadwalPage />} />
            <Route path="/komunitas" element={<KomunitasPage />} />
            <Route path="/blog" element={<BlogPage />} />
            
            {/* Catch all route - Redirect to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkMode ? "dark" : "light"}
          />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
