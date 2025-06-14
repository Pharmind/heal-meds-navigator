
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Stethoscope, Heart, Shield } from 'lucide-react';

const Login = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Mapear usuários para emails
  const getUserEmail = (username: string): string => {
    switch (username.toLowerCase()) {
      case 'heal123':
        return 'heal123@heal.com';
      case 'fa123':
        return 'fa123@heal.com';
      default:
        return username; // Fallback para caso seja um email
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const email = getUserEmail(loginData.username);
      console.log('Attempting login with email:', email);
      
      const { error } = await signIn(email, loginData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Usuário ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu email antes de fazer login');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
      } else {
        toast.success('Login realizado com sucesso!');
        // O redirecionamento será feito pelo useAuth
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heal-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-heal-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-heal-green-600 to-emerald-700 rounded-2xl mb-6 shadow-2xl">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              GUIA FARMACÊUTICO
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-5 w-5 text-heal-green-600" />
              <span className="text-xl font-semibold text-heal-green-700">HEAL</span>
              <Heart className="h-5 w-5 text-heal-green-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Hospital Estadual de Águas Lindas - GO
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-heal-green-600" />
              Acesso Seguro
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  disabled={isLoading}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-heal-green-500 focus:ring-heal-green-500 rounded-xl transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    disabled={isLoading}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-heal-green-500 focus:ring-heal-green-500 rounded-xl pr-12 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-heal-green-600 to-emerald-600 hover:from-heal-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>

            {/* Info adicional */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Sistema de Gestão Farmacêutica
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-heal-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-heal-green-600 font-medium">
                    Plataforma Segura e Confiável
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2024 Hospital Estadual de Águas Lindas - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
