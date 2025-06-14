
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ children, requiredModule, fallback }: ProtectedRouteProps) => {
  const { user, profile, hasPermission, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && profile && requiredModule && !hasPermission(requiredModule)) {
      toast.error('Você não tem permissão para acessar este módulo. Entre em contato com um farmacêutico.');
    }
  }, [user, profile, requiredModule, hasPermission, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // O App.tsx vai redirecionar para login
  }

  if (requiredModule && !hasPermission(requiredModule)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar este módulo.
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato com um farmacêutico para solicitar acesso.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
