import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Card className="rounded-2xl overflow-hidden glassmorphism transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:-translate-y-1">
        <div className="overflow-hidden aspect-[4/3]">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={300}
            data-ai-hint="football gear"
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-neutral-400">{product.category}</p>
          <p className="font-bold text-xl mt-2 text-accent">${product.price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
