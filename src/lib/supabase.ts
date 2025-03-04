import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Add health check
export const checkSupabaseHealth = async () => {
  try {
    const start = performance.now();
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    const end = performance.now();
    
    console.log(`Database response time: ${Math.round(end - start)}ms`);
    
    if (error) {
      console.error('Database health check failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

