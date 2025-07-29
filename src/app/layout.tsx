import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/contexts/cart-provider';
import { Toaster } from '@/components/ui/toaster';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Apex Football Gear',
  description: 'High-quality football gear for athletes and fans.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          poppins.variable
        )}
        style={{
          backgroundImage: `url('https://placehold.co/1920x1080.png?text=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
        data-ai-hint="stadium background"
      >
        <div className="relative flex min-h-screen flex-col backdrop-blur-sm bg-black/30">
          <CartProvider>
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-8 pt-24">
              {children}
            </main>
            <SiteFooter />
            <Toaster />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
