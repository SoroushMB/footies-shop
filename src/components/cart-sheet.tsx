'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/cart-provider';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

export function CartSheet({ children }: { children: React.ReactNode }) {
    const { cart, removeFromCart, updateQuantity, isSheetOpen, setSheetOpen } = useCart();
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
            {children}
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
            <SheetHeader className="px-6">
                <SheetTitle>Shopping Cart ({cart.length})</SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            
            {cart.length > 0 ? (
                <>
                <ScrollArea className="flex-1 px-6">
                    <div className="flex flex-col gap-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-md">
                                <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="flex-1">
                                <Link href={`/product/${item.slug}`} className="font-semibold hover:underline">{item.name}</Link>
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                        <Minus className="h-4 w-4"/>
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                        <Plus className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
                <Separator className="my-4" />
                <SheetFooter className="px-6">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                        <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                           <Link href="/checkout" onClick={() => setSheetOpen(false)}>Proceed to Checkout</Link>
                        </Button>
                    </div>
                </SheetFooter>
                </>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <h3 className="text-xl font-semibold">Your cart is empty</h3>
                    <p className="text-muted-foreground">Add some gear to get started.</p>
                    <Button asChild onClick={() => setSheetOpen(false)}>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            )}
        </SheetContent>
    </Sheet>
  )
}
