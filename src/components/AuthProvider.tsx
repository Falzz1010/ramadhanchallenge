import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, getUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const authProcessed = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (authProcessed.current) return;
      authProcessed.current = true;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await getUser();
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });

    handleAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};
