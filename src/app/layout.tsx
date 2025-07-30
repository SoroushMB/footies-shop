
import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/contexts/cart-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-provider';
import { ChatWidget } from '@/components/chat-widget';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Footies-Shop',
  description: 'High-quality football gear for athletes and fans.',
  icons: null,
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
          'bg-background font-sans antialiased',
          poppins.variable
        )}
      >
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1546608235-3310a2494cdf?q=80&w=1920&auto=format&fit=crop')`,
          }}
          data-ai-hint="stadium background"
        />
        <div className="fixed inset-0 z-[-1] bg-black/50 backdrop-blur-lg" />
        
        <AuthProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 container mx-auto px-4 py-8 pt-40">
                {children}
              </main>
              <SiteFooter />
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
        
        <ChatWidget />
      </body>
    </html>
  );
}
