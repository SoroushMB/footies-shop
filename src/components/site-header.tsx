'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getCategories } from '@/lib/data';
import { useCart } from '@/contexts/cart-provider';
import { CartSheet } from './cart-sheet';

export function SiteHeader() {
  const categories = getCategories();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl font-headline text-white">
              Footies-Shop<span className="text-accent">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white">
            <User className="h-5 w-5" />
          </Button>
          
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-background/95 backdrop-blur-lg border-r border-white/20">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-bold text-2xl font-headline text-white">Footies-Shop<span className="text-accent">.</span></span>
                </Link>
                <nav className="grid gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="text-lg font-medium text-neutral-300 transition-colors hover:text-white"
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
