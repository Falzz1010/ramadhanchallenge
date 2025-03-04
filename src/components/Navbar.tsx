import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { setLoginAllowed } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
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
          className={`md:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-gray-200
                    transition-all duration-300 ease-in-out transform
                    ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
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


