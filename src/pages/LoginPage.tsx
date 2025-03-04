import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Moon, Star } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, isLoading, error, isLoginAllowed } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoginAllowed) {
      navigate('/', { replace: true });
    }
  }, [isLoginAllowed, navigate]);

  if (!isLoginAllowed) {
    return null; // atau loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-950 flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-white/20">
        <Moon size={60} />
      </div>
      <div className="absolute bottom-10 right-10 text-white/20">
        <Star size={60} />
      </div>
      <div className="absolute top-1/4 right-1/4 text-white/10">
        <Star size={40} />
      </div>
      <div className="absolute bottom-1/3 left-1/5 text-white/10">
        <Star size={30} />
      </div>
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden transition-colors duration-200">
        <div className="p-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Beranda
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">Ramadhan Challenge</h1>
            <p className="text-gray-600 dark:text-gray-400">30 Hari Tantangan Kebaikan</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
              <p className="text-primary-800 dark:text-primary-300">
                Tingkatkan ibadah dan amal kebaikan selama bulan Ramadhan dengan tantangan harian yang menginspirasi.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                <p className="font-semibold text-gray-800 dark:text-gray-200">30</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tantangan</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                <p className="font-semibold text-gray-800 dark:text-gray-200">5</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Badge</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Komunitas</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Berbagi Progress</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Ranking</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Leaderboard</p>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="w-full bg-primary-600 dark:bg-primary-700 text-white py-3 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                <span>Masuk dengan Google</span>
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          &copy; {new Date().getFullYear()} Ramadhan Challenge. Semua hak cipta dilindungi.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
