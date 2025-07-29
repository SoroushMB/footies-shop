import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Dribbble, Footprints, Shirt, Shield } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { getFeaturedProducts, getCategories } from '@/lib/data';
import { Icons } from '@/components/icons';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const categories = getCategories();

  const categoryIcons: { [key: string]: React.ReactNode } = {
    jerseys: <Shirt className="w-12 h-12" />,
    footballs: <Dribbble className="w-12 h-12" />,
    apparel: <Icons.apparel className="w-12 h-12" />,
    footwear: <Footprints className="w-12 h-12" />,
    accessories: <Icons.gloves className="w-12 h-12" />,
  };

  return (
    <div className="space-y-20">
      <section className="text-center py-20">
        <div className="relative">
          <div
            className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"
          ></div>
          <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 tracking-tight">
            Elevate Your Game
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-neutral-300">
            Discover premium football gear, crafted for champions. From the pitch to the stands, we've got you covered.
          </p>
          <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            Shop New Arrivals <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.id}>
              <div className="group relative aspect-square md:aspect-[4/3] flex flex-col items-center justify-center p-6 rounded-2xl glassmorphism transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:-translate-y-1">
                <div className="text-foreground transition-transform duration-300 group-hover:scale-110">
                  {categoryIcons[category.slug]}
                </div>
                <h3 className="mt-4 text-center font-semibold text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Featured Products</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </section>
    </div>
  );
}
