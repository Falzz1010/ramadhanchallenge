import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Award, Users, User, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';

const Layout: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  
  if (!user) {
    return <Outlet />;
  }
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/challenges', label: 'Tantangan', icon: Calendar },
    { path: '/badges', label: 'Badge', icon: Award },
    { path: '/community', label: 'Komunitas', icon: Users },
    { path: '/profile', label: 'Profil', icon: User },
  ];
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <div className="fixed w-64 h-screen bg-white dark:bg-gray-800 shadow-md hidden md:block transition-colors duration-200">
        <div className="p-4 flex flex-col h-full">
          <div className="mb-8 mt-4">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Ramadhan Challenge</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">30 Hari Tantangan Kebaikan</p>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                        location.pathname === item.path 
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={(e) => {
                        if (location.pathname === item.path) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="mt-auto pb-4 space-y-2">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name || 'User'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">
                      {(user.name || 'U').charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium truncate max-w-[120px]">{user.name}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center p-3 w-full text-left rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-20 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">Ramadhan Challenge</h1>
          
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleMobileMenu}>
          <div 
            className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 p-4 shadow-lg transition-transform transform-gpu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 mt-2">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Ramadhan Challenge</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">30 Hari Tantangan Kebaikan</p>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                          location.pathname === item.path 
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={(e) => {
                          if (location.pathname === item.path) {
                            e.preventDefault();
                          }
                          toggleMobileMenu();
                        }}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="absolute bottom-4 left-4 right-4">
              <button 
                onClick={handleLogout}
                className="flex items-center p-3 w-full text-left rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-2 md:hidden z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`p-2 rounded-full ${
                location.pathname === item.path 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={(e) => {
                if (location.pathname === item.path) {
                  e.preventDefault();
                }
              }}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
      
      {/* Main content */}
      <div className="flex-1 md:ml-64 overflow-auto pb-16 md:pb-0 mt-16 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
