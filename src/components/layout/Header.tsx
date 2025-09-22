'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/report', label: 'Report Hazard' },
  { href: '#posts', label: 'Posts' },
  { href: '#feeds', label: 'Feeds' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-[#357ABD] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
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
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button variant="default" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
            <LanguageSwitcher />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary text-primary-foreground border-l-0">
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
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="default" className="bg-white text-primary hover:bg-white/90" asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                    <LanguageSwitcher />
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
