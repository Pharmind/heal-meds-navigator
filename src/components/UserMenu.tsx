
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserMenuProps {
  onUserManagementClick?: () => void;
}

const UserMenu = ({ onUserManagementClick }: UserMenuProps) => {
  const { profile, signOut } = useAuth();
  const isMobile = useIsMobile();

  if (!profile) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUserManagement = () => {
    if (onUserManagementClick) {
      onUserManagementClick();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`flex items-center gap-2 ${isMobile ? 'px-2' : 'px-3'}`}>
          <User className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          {!isMobile && (
            <>
              <span className="hidden sm:inline max-w-32 truncate">
                {profile.full_name || profile.email}
              </span>
              <Badge variant={profile.user_type === 'farmaceutico' ? 'default' : 'secondary'} className="hidden md:inline text-xs">
                {profile.user_type === 'farmaceutico' ? 'Farmacêutico' : 'Usuário'}
              </Badge>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${isMobile ? 'w-64' : 'w-56'} bg-white z-50`}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {profile.full_name || 'Usuário'}
            </p>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'} truncate`}>
              {profile.email}
            </p>
            <Badge variant={profile.user_type === 'farmaceutico' ? 'default' : 'secondary'} className="w-fit text-xs">
              {profile.user_type === 'farmaceutico' ? 'Farmacêutico' : 'Usuário'}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile.user_type === 'farmaceutico' && (
          <>
            <DropdownMenuItem onClick={handleUserManagement} className={`${isMobile ? 'py-3' : ''}`}>
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut} className={`text-red-600 ${isMobile ? 'py-3' : ''}`}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
