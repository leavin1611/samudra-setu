import type {Metadata} from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { HazardReportsProvider } from '@/context/HazardReportsContext';
import { FirebaseClientProvider } from '@/firebase';
import { NeedsProvider } from '@/context/NeedsContext';

export const metadata: Metadata = {
  title: 'SamudraSetu - Crowdsourced Ocean Hazard Reporting',
  description: 'Protecting Coastal Communities Through Crowdsourced Intelligence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
          <FirebaseClientProvider>
            <HazardReportsProvider>
              <NeedsProvider>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </div>
                <Toaster />
              </NeedsProvider>
            </HazardReportsProvider>
          </FirebaseClientProvider>
      </body>
    </html>
  );
}
