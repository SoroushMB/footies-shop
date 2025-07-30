
'use client';

import { useState } from 'react';
import type { Product } from '@/lib/data';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductSuggestions } from '@/components/product-suggestions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  const [actionToPerform, setActionToPerform] = useState<'addToCart' | 'buyNow' | null>(null);

  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleAction = (action: 'addToCart' | 'buyNow') => {
    if (selectedSize) {
      addToCart(product, 1);
      if (action === 'buyNow') {
        router.push('/checkout');
      } else {
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart.`,
        });
      }
    } else {
      setActionToPerform(action);
      setShowSizeDialog(true);
    }
  };

  const handleSizeSelectionInDialog = () => {
    if (selectedSize && actionToPerform) {
      handleAction(actionToPerform);
      setShowSizeDialog(false);
      setActionToPerform(null);
    } else {
       toast({
        variant: 'destructive',
        title: 'No size selected',
        description: `Please select a size to continue.`,
      });
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="md:sticky top-24">
          <Carousel className="w-full rounded-2xl overflow-hidden glassmorphism p-2">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative">
                    <Image
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      objectFit="cover"
                      className="rounded-xl"
                      data-ai-hint="football equipment"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-accent font-semibold">{product.category}</p>
            <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
            <p className="text-3xl font-bold text-accent">${product.price.toFixed(2)}</p>
          </div>
          <p className="text-neutral-300 leading-relaxed">{product.description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Size</h3>
              <Select onValueChange={setSelectedSize} value={selectedSize || ''}>
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <AddToCartButton
              onAddToCart={() => handleAction('addToCart')}
              onBuyNow={() => handleAction('buyNow')}
            />

          </div>
          <div className="pt-8">
              <ProductSuggestions currentSelection={product.name} />
          </div>
        </div>
      </div>

      <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please select a size</DialogTitle>
            <DialogDescription>
              Choose a size for {product.name} to add it to your cart.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSizeSelectionInDialog}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {actionToPerform === 'buyNow' ? 'Buy Now' : 'Add to Cart'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
