
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/data';
import { Button } from './ui/button';
import { useCart } from '@/contexts/cart-provider';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className="rounded-2xl overflow-hidden glassmorphism transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="overflow-hidden aspect-[4/3]">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint="football gear"
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-semibold text-lg truncate text-center">{product.name}</h3>
          <p className="text-sm text-neutral-400 text-center">{product.category}</p>
          <p className="font-bold text-xl mt-2 text-accent text-center">${product.price.toFixed(2)}</p>
        </Link>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            onClick={handleBuyNow}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
