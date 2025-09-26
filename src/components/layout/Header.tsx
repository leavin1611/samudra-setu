'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { GoogleTranslateWidget } from '@/components/common/GoogleTranslateWidget';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { LogOut, Menu } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';

export function Header() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleSignOut = () => {
    auth.signOut();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/social-intelligence', label: 'Social Intel' },
    { href: '/report', label: 'Report Hazard' },
    { href: '/needs', label: 'Report a Need' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-[#357ABD] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white font-medium transition-opacity hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            {!isUserLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white">{user.phoneNumber || user.email}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent border-white text-white hover:bg-white/10"
                      onClick={handleSignOut}
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="default" className="bg-white text-primary hover:bg-white/90" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
            <GoogleTranslateWidget />
          </div>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary text-primary-foreground border-l-0">
                <SheetHeader>
                    <SheetTitle className="text-white">Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-10">
                  <nav className="flex flex-col items-start gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-white text-lg font-medium transition-opacity hover:opacity-80"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-4">
                    {!isUserLoading && (
                      <>
                        {user ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">{user.phoneNumber || user.email}</span>
                            <Button
                              variant="outline"
                              className="bg-transparent border-white text-white hover:bg-white/10"
                              onClick={handleSignOut}
                            >
                              Sign Out
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                              <Link href="/login">Login</Link>
                            </Button>
                            <Button variant="default" className="bg-white text-primary hover:bg-white/90" asChild>
                              <Link href="/signup">Sign Up</Link>
                            </Button>
                          </>
                        )}
                      </>
                    )}
                    <GoogleTranslateWidget />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
