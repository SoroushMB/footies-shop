
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getCategories } from '@/lib/data';
import { useCart } from '@/contexts/cart-provider';
import { CartSheet } from './cart-sheet';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Icons } from './icons';
import { useAuth } from '@/contexts/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function SiteHeader() {
  const categories = getCategories();
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchActive(false);
    }
  };
  
  const baseMarqueeTexts = [
    '🎉 Free Shipping On Orders Over $60',
    '⚽ New Season Arrivals Out Now',
    '🏆 Shop The Latest Kits',
  ];

  const marqueeTexts = user
    ? baseMarqueeTexts
    : ['💸 Register and get 10% off EVERY order!', ...baseMarqueeTexts];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glassmorphism">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="hidden md:block h-6 w-6 text-white" />
              <span className="font-bold text-lg md:text-2xl font-headline text-white">
                Footies-Shop
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-base font-medium text-neutral-300 transition-colors hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setIsSearchActive(!isSearchActive)}>
              {isSearchActive ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/account')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {itemCount}
                      </span>
                  )}
              </Button>
            </CartSheet>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs bg-background/95 backdrop-blur-lg border-r border-white/20">
                <div className="flex flex-col h-full">
                  <div className="p-6">
                      <Link href="/" className="flex items-center space-x-2">
                        <Icons.logo className="h-8 w-8 text-white" />
                        <span className="font-bold text-2xl font-headline text-white">Footies-Shop</span>
                      </Link>
                  </div>
                  <nav className="grid gap-4 p-6 pt-0">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="text-lg font-medium text-neutral-300 transition-colors hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto p-6 border-t border-white/10">
                      <div className="flex flex-col gap-4">
                          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                            setIsMobileMenuOpen(false);
                            setTimeout(() => setIsSearchActive(true), 100);
                          }}>
                              <Search className="h-5 w-5" />
                              Search
                          </Button>
                          <Link href="/account">
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <User className="h-5 w-5" />
                                Account
                            </Button>
                          </Link>
                           {user && (
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                              signOut();
                              setIsMobileMenuOpen(false);
                            }}>
                                <LogOut className="h-5 w-5" />
                                Logout
                            </Button>
                          )}
                      </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <div className="h-12 bg-accent flex items-center overflow-hidden">
        <div className="flex">
          <div className="whitespace-nowrap flex items-center animate-marquee">
            {marqueeTexts.map((text, index) => (
              <p key={index} className="text-accent-foreground font-bold text-lg mx-8">
                {text}
              </p>
            ))}
          </div>
          <div className="whitespace-nowrap flex items-center animate-marquee" aria-hidden="true">
            {marqueeTexts.map((text, index) => (
              <p key={`dup-${index}`} className="text-accent-foreground font-bold text-lg mx-8">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
      
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden bg-transparent",
        isSearchActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="relative flex h-20 items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input name="search" type="search" placeholder="Search..." className="w-full h-11 pl-12 pr-12 rounded-full bg-background border-border" autoFocus />
          </form>
        </div>
      </div>
    </header>
  );
}
