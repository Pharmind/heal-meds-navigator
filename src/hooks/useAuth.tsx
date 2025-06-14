
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  user_type: 'farmaceutico' | 'usuario';
  is_active: boolean;
  role: 'admin' | 'user';
}

interface UserPermission {
  module_name: string;
  has_access: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  permissions: UserPermission[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  hasPermission: (module: string) => boolean;
  isFarmaceutico: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para limpar estado de autenticação
const cleanupAuthState = () => {
  // Remover todas as chaves relacionadas ao Supabase
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          cleanupAuthState();
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getSession:', error);
        cleanupAuthState();
        setLoading(false);
      }
    };

    getSession();

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer para evitar deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setPermissions([]);
          cleanupAuthState();
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Erro ao carregar perfil do usuário');
        return;
      }

      if (!profileData) {
        console.error('No profile found for user:', userId);
        toast.error('Perfil não encontrado');
        return;
      }

      if (!profileData.is_active) {
        toast.error('Sua conta está inativa. Entre em contato com um farmacêutico.');
        await signOut();
        return;
      }

      setProfile(profileData);
      console.log('Profile loaded:', profileData);

      // Buscar permissões do usuário
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_module_permissions')
        .select('module_name, has_access')
        .eq('user_id', userId);

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        // Não bloquear o login por erro de permissões
      } else {
        setPermissions(permissionsData || []);
        console.log('Permissions loaded:', permissionsData);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      toast.error('Erro inesperado ao carregar dados do usuário');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Limpar estado antes de fazer login
      cleanupAuthState();
      
      // Tentar fazer logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Ignoring signOut error:', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      if (data.user && data.session) {
        console.log('Sign in successful:', data.user.email);
        // Forçar refresh da página para garantir estado limpo
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setPermissions([]);
      
      // Forçar refresh para estado limpo
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      // Forçar refresh mesmo com erro
      window.location.href = '/login';
    }
  };

  const hasPermission = (module: string): boolean => {
    if (profile?.user_type === 'farmaceutico') {
      return true; // Farmacêuticos têm acesso a tudo
    }
    
    const permission = permissions.find(p => p.module_name === module);
    return permission?.has_access || false;
  };

  const isFarmaceutico = profile?.user_type === 'farmaceutico';

  const value = {
    user,
    session,
    profile,
    permissions,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    isFarmaceutico,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
