import { getProductBySlug, getAllProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
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
                    layout="fill"
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
            <Select>
              <SelectTrigger className="w-[180px]">
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
          
          <AddToCartButton product={product} />

        </div>
        <div className="pt-8">
            <ProductSuggestions currentSelection={product.name} />
        </div>
      </div>
    </div>
  );
}
