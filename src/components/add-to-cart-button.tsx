'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-provider';
import type { Product } from '@/lib/data';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
       <Button size="lg" variant="outline" className="w-full" onClick={handleBuyNow}>
        <ShoppingBag className="mr-2 h-5 w-5" />
        Buy Now
      </Button>
    </div>
  );
}
