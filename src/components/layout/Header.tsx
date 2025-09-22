
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n';

export function Header() {
  const { language } = useLanguage();
  const t = translations[language];

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/dashboard', label: t.nav.dashboard },
    { href: '/social-intelligence', label: 'Social Intel' },
    { href: '/report', label: t.nav.reportHazard },
    { href: '#posts', label: t.nav.posts },
    { href: '#feeds', label: t.nav.feeds },
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
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button variant="default" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link href="/signup">{t.nav.signUp}</Link>
            </Button>
            <LanguageSwitcher />
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
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
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
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                        <Link href="/login">{t.nav.login}</Link>
                    </Button>
                    <Button variant="default" className="bg-white text-primary hover:bg-white/90" asChild>
                        <Link href="/signup">{t.nav.signUp}</Link>
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

