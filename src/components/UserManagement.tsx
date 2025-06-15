
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Search, Settings, Save, UserCheck, UserX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  user_type: 'farmaceutico' | 'usuario';
  is_active: boolean;
  role: 'admin' | 'user';
}

interface UserPermission {
  user_id: string;
  module_name: string;
  has_access: boolean;
}

type ModuleName = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'multiprofessional-round' | 'round-reports';

const MODULES: { id: ModuleName; name: string }[] = [
  { id: 'search', name: 'Busca Geral' },
  { id: 'medications', name: 'Medicamentos' },
  { id: 'materials', name: 'Materiais' },
  { id: 'diets', name: 'Dietas' },
  { id: 'intoxication', name: 'Intoxicação' },
  { id: 'high-alert', name: 'Medicamentos de Alta Vigilância' },
  { id: 'elderly', name: 'Idosos' },
  { id: 'sequential-therapy', name: 'Terapia Sequencial' },
  { id: 'pharmacovigilance', name: 'Farmacovigilância' },
  { id: 'cft', name: 'CFT' },
  { id: 'protocols', name: 'Protocolos' },
  { id: 'pictogram', name: 'Pictograma' },
  { id: 'discharge-guidelines', name: 'Orientações de Alta' },
  { id: 'drug-interactions', name: 'Interações Medicamentosas' },
  { id: 'treatment-estimation', name: 'Estimativa de Tratamento' },
  { id: 'multiprofessional-round', name: 'Round Multiprofissional' },
  { id: 'round-reports', name: 'Relatórios de Round' }
];

const UserManagement = () => {
  const { profile, isFarmaceutico } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isFarmaceutico) {
      loadUsers();
      loadPermissions();
    }
  }, [isFarmaceutico]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    }
  };

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_module_permissions')
        .select('*');

      if (error) throw error;
      setPermissions(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast.error('Erro ao carregar permissões');
      setLoading(false);
    }
  };

  const getUserPermissions = (userId: string) => {
    return permissions.filter(p => p.user_id === userId);
  };

  const hasPermission = (userId: string, moduleId: ModuleName) => {
    const userPerms = getUserPermissions(userId);
    const perm = userPerms.find(p => p.module_name === moduleId);
    return perm?.has_access || false;
  };

  const togglePermission = async (userId: string, moduleId: ModuleName, hasAccess: boolean) => {
    if (!profile) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('user_module_permissions')
        .upsert({
          user_id: userId,
          module_name: moduleId as any,
          has_access: hasAccess,
          granted_by: profile.id,
          granted_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,module_name'
        });

      if (error) throw error;

      // Atualizar estado local
      setPermissions(prev => {
        const existing = prev.find(p => p.user_id === userId && p.module_name === moduleId);
        if (existing) {
          return prev.map(p => 
            p.user_id === userId && p.module_name === moduleId 
              ? { ...p, has_access: hasAccess }
              : p
          );
        } else {
          return [...prev, { user_id: userId, module_name: moduleId, has_access: hasAccess }];
        }
      });

      toast.success('Permissão atualizada com sucesso');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Erro ao atualizar permissão');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: isActive } : u
      ));

      toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Erro ao atualizar status do usuário');
    } finally {
      setSaving(false);
    }
  };

  const grantAllPermissions = async (userId: string) => {
    if (!profile) return;

    try {
      setSaving(true);

      const permissionUpdates = MODULES.map(module => ({
        user_id: userId,
        module_name: module.id as any,
        has_access: true,
        granted_by: profile.id,
        granted_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('user_module_permissions')
        .upsert(permissionUpdates, {
          onConflict: 'user_id,module_name'
        });

      if (error) throw error;

      // Atualizar estado local
      setPermissions(prev => {
        const filtered = prev.filter(p => p.user_id !== userId);
        const newPerms = MODULES.map(module => ({
          user_id: userId,
          module_name: module.id,
          has_access: true
        }));
        return [...filtered, ...newPerms];
      });

      toast.success('Todas as permissões concedidas com sucesso');
    } catch (error) {
      console.error('Error granting all permissions:', error);
      toast.error('Erro ao conceder todas as permissões');
    } finally {
      setSaving(false);
    }
  };

  const revokeAllPermissions = async (userId: string) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('user_module_permissions')
        .update({ has_access: false })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar estado local
      setPermissions(prev => prev.map(p => 
        p.user_id === userId ? { ...p, has_access: false } : p
      ));

      toast.success('Todas as permissões revogadas com sucesso');
    } catch (error) {
      console.error('Error revoking all permissions:', error);
      toast.error('Erro ao revogar todas as permissões');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isFarmaceutico) {
    return (
      <div className="text-center py-8">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
        <p className="text-gray-600">Apenas farmacêuticos podem gerenciar usuários.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Gerencie permissões e status dos usuários do sistema</p>
        </div>
        <Users className="h-8 w-8 text-blue-600" />
      </div>

      {/* Barra de busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.full_name || 'Nome não informado'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.user_type === 'farmaceutico' ? 'default' : 'secondary'}>
                      {user.user_type === 'farmaceutico' ? 'Farmacêutico' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'destructive'}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {MODULES.filter(module => hasPermission(user.id, module.id)).length} / {MODULES.length} módulos
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      {user.user_type !== 'farmaceutico' && (
                        <Button
                          size="sm"
                          variant={user.is_active ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(user.id, !user.is_active)}
                          disabled={saving}
                        >
                          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalhes do usuário selecionado */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Permissões</CardTitle>
            <CardDescription>
              Usuário: {users.find(u => u.id === selectedUser)?.full_name || users.find(u => u.id === selectedUser)?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => grantAllPermissions(selectedUser)}
                disabled={saving}
                size="sm"
              >
                Conceder Todas
              </Button>
              <Button
                onClick={() => revokeAllPermissions(selectedUser)}
                disabled={saving}
                variant="outline"
                size="sm"
              >
                Revogar Todas
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULES.map((module) => (
                <div key={module.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={`${selectedUser}-${module.id}`}
                    checked={hasPermission(selectedUser, module.id)}
                    onCheckedChange={(checked) => 
                      togglePermission(selectedUser, module.id, !!checked)
                    }
                    disabled={saving}
                  />
                  <Label 
                    htmlFor={`${selectedUser}-${module.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {module.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
