'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/contexts/OrganizationContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Building2, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const { state: orgState } = useOrganization();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'View project dashboard and statistics' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, description: 'Manage and view tasks' },
    { name: 'Organizations', href: '/organizations', icon: Building2, description: 'Manage organizations and teams' },
    { name: 'Settings', href: '/settings', icon: Settings, description: 'Configure application settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && event.target instanceof Element) {
        const mobileMenu = document.querySelector('.lg\\:hidden.fixed.inset-0');
        if (mobileMenu && !mobileMenu.contains(event.target) && !event.target.closest('button')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
          id="mobile-navigation"
        >
          <div className="fixed left-0 top-0 h-full w-64 bg-background border-r" role="navigation">
            <div className="p-6">
              <h2 id="mobile-nav-title" className="text-lg font-semibold">Project Management</h2>
              {orgState.currentOrganization && (
                <Badge variant="secondary" className="mt-2">
                  {orgState.currentOrganization.name}
                </Badge>
              )}
            </div>
            <nav className="px-4 space-y-2" aria-label="Main navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={item.href !== pathname} // Prefetch if not current page
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <nav 
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-background"
        aria-label="Main navigation"
      >
        <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6">
            <h2 className="text-lg font-semibold">Project Management</h2>
          </div>
          
          {orgState.currentOrganization && (
            <div className="px-6 mt-4">
              <Badge variant="secondary" className="w-full justify-center">
                {orgState.currentOrganization.name}
              </Badge>
            </div>
          )}
          
          <nav className="mt-8 flex-1 px-4 space-y-2" aria-label="Main navigation links">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={item.href !== pathname} // Prefetch if not current page
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  title={item.description}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </nav>
    </>
  );
}