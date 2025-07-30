
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-provider';
import type { Product } from '@/lib/data';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  selectedSize: string | null;
  onSizeNotSelected: () => void;
}

export function AddToCartButton({ product, selectedSize, onSizeNotSelected }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize) {
      onSizeNotSelected();
      return;
    }
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleBuyNow = () => {
    if (!selectedSize) {
      onSizeNotSelected();
      return;
    }
    addToCart(product, quantity);
    router.push('/checkout');
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" className="w-full" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
       <Button size="lg" variant="outline" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleBuyNow}>
        <ShoppingBag className="mr-2 h-5 w-5" />
        Buy Now
      </Button>
    </div>
  );
}
