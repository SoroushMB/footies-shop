
'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export function AddToCartButton({ onAddToCart, onBuyNow }: AddToCartButtonProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" className="w-full" onClick={onAddToCart}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
       <Button size="lg" variant="outline" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={onBuyNow}>
        <ShoppingBag className="mr-2 h-5 w-5" />
        Buy Now
      </Button>
    </div>
  );
}
