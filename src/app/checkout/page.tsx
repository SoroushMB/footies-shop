'use client';

import { useCart } from '@/contexts/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { cart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 font-headline">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="you@example.com" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input id="first-name" />
                            </div>
                            <div className="col-span-1">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input id="last-name" />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input id="state" />
                            </div>
                             <div>
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input id="zip" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expiry-date">Expiration</Label>
                                    <Input id="expiry-date" placeholder="MM / YY" />
                                </div>
                                 <div>
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input id="cvc" placeholder="•••" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="md:sticky top-24 h-fit">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden border border-white/20">
                                            <Image src={item.images[0]} alt={item.name} layout="fill" objectFit="cover" />
                                            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <Button size="lg" className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90">Place Order</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
