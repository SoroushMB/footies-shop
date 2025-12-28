import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/contexts/cart-provider';
import { Toaster } from '@/components/ui/toaster';
import { ChatWidget } from '@/components/chat-widget';
import { ClerkProvider } from '@clerk/nextjs';
import { StripeProvider } from '@/components/stripe-provider';

// Force dynamic rendering for all pages using this layout
// This is required because ClerkProvider needs the publishableKey at runtime
export const dynamic = 'force-dynamic';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap', // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Footies-Shop',
    template: '%s | Footies-Shop',
  },
  description: 'High-quality football gear for athletes and fans. Shop jerseys, cleats, footballs, and more.',
  keywords: ['football gear', 'soccer equipment', 'football jerseys', 'soccer cleats', 'football accessories'],
  authors: [{ name: 'Footies-Shop' }],
  creator: 'Footies-Shop',
  publisher: 'Footies-Shop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Footies-Shop',
    title: 'Footies-Shop - Premium Football Gear',
    description: 'High-quality football gear for athletes and fans. Shop jerseys, cleats, footballs, and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Footies-Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footies-Shop - Premium Football Gear',
    description: 'High-quality football gear for athletes and fans.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
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

        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: '#16a34a',
              colorBackground: '#0a0a0a',
              colorText: '#ffffff',
              colorTextSecondary: '#a1a1aa',
              colorInputBackground: '#1a1a1a',
              colorInputText: '#ffffff',
              borderRadius: '0.75rem',
            },
            elements: {
              card: 'bg-black/80 backdrop-blur-xl border border-white/10',
              headerTitle: 'text-white',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border-white/20',
              formFieldInput: 'bg-white/10 border-white/20 text-white',
              formButtonPrimary: 'bg-green-600 hover:bg-green-700',
              footerActionLink: 'text-green-500 hover:text-green-400',
            },
          }}
        >
          <StripeProvider>
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
          </StripeProvider>
        </ClerkProvider>

        <ChatWidget />
      </body>
    </html>
  );
}
