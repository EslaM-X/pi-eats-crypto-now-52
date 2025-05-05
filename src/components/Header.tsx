
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Import the refactored components
import Logo from './header/Logo';
import NavItems from './header/NavItems';
import HeaderActions from './header/HeaderActions';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/restaurants', label: t('nav.restaurants') },
    { path: '/homefood', label: t('nav.homefood') },
    { path: '/homefood/add', label: t('nav.addFood'), highlight: true },
    { path: '/orders', label: t('nav.orders') },
    { path: '/wallet', label: t('nav.wallet') },
    { path: '/rewards', label: t('nav.rewards') },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md dark:shadow-gray-800/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <NavItems items={navItems} currentPath={location.pathname} />

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          <HeaderActions />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu 
        navItems={navItems} 
        isOpen={mobileMenuOpen} 
        currentPath={location.pathname} 
        onItemClick={() => setMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
