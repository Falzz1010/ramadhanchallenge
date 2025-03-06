import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { setLoginAllowed } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference on initial load
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Update document class and localStorage when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLoginClick = async () => {
    try {
      console.log('Login button clicked');
      setLoginAllowed(true);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during login navigation:', error);
      setLoginAllowed(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Ramadhan Challenge
              </h1>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
            </button>
            
            {['Program', 'Jadwal', 'Komunitas', 'Blog'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className="text-gray-700 hover:text-green-500 transition-colors duration-200 text-sm font-medium"
              >
                {item}
              </Link>
            ))}
          </div>
          
          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <button
              onClick={handleLoginClick}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white
                       bg-gradient-to-r from-green-600 to-green-500
                       hover:from-green-700 hover:to-green-600
                       transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button with rotating animation */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 transition-all duration-300 ease-in-out"
          >
            <svg 
              className={`w-6 h-6 text-gray-700 transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu with slide and fade animation */}
        <div 
          className={`md:hidden absolute top-[80px] left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
                    transition-all duration-300 ease-in-out transform
                    ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
              {/* Dark Mode Toggle Button (Mobile) */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-all duration-200 text-sm font-medium px-2 transform hover:translate-x-2"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
                <span className="ml-2">
                  {darkMode ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                      />
                    </svg>
                  )}
                </span>
              </button>
              
              {['Program', 'Jadwal', 'Komunitas', 'Blog'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  className="text-gray-700 hover:text-green-500 transition-all duration-200 text-sm font-medium px-2
                         transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLoginClick();
                  setIsMenuOpen(false);
                }}
                className="text-left px-5 py-2.5 rounded-lg text-sm font-medium text-white
                       bg-gradient-to-r from-green-600 to-green-500
                       hover:from-green-700 hover:to-green-600
                       transition-all duration-200 shadow-md hover:shadow-lg
                       transform hover:translate-x-2
                       mx-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


