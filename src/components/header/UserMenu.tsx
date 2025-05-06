
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogIn, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const UserMenu = () => {
  const { user: piUser, login: piLogin, logout: piLogout, isAuthenticating } = usePiAuth();
  const { user: supabaseUser, profile, loading, signOut } = useSupabaseAuth();
  const { t } = useLanguage();

  // Use Supabase authentication if available, fallback to Pi Network auth
  const user = supabaseUser || piUser;
  
  const handleLogin = () => {
    // Redirect to auth page for Supabase auth
    window.location.href = '/auth';
  };
  
  const handleLogout = () => {
    if (supabaseUser) {
      signOut();
    } else if (piUser) {
      piLogout();
    }
  };

  if (!user) {
    return (
      <Button
        onClick={handleLogin}
        disabled={isAuthenticating || loading}
        className="button-gradient"
      >
        {isAuthenticating || loading ? t('loading') : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            {t('auth.login')}
          </>
        )}
      </Button>
    );
  }

  // Get display name and avatar from appropriate source
  // Fix the type error by safely accessing properties and providing fallbacks
  const displayName = profile?.username || 
    (piUser && 'username' in piUser ? piUser.username : '') || 
    (supabaseUser && supabaseUser.email ? supabaseUser.email.split('@')[0] : '') || 
    'User';
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-pi text-white">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/wallet">{t('nav.wallet')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/rewards">{t('nav.rewards')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders">{t('nav.orders')}</Link>
        </DropdownMenuItem>
        {profile?.is_provider && (
          <DropdownMenuItem asChild>
            <Link to="/admin">{t('nav.adminDashboard')}</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
