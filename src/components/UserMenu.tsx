
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UserMenu = () => {
  const { profile, signOut } = useAuth();

  if (!profile) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{profile.full_name || profile.email}</span>
          <Badge variant={profile.user_type === 'farmaceutico' ? 'default' : 'secondary'} className="hidden md:inline">
            {profile.user_type === 'farmaceutico' ? 'Farmacêutico' : 'Usuário'}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile.full_name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
            <Badge variant={profile.user_type === 'farmaceutico' ? 'default' : 'secondary'} className="w-fit">
              {profile.user_type === 'farmaceutico' ? 'Farmacêutico' : 'Usuário'}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile.user_type === 'farmaceutico' && (
          <>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
