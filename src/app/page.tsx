
'use client'

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Dribbble, Footprints, Shirt, Shield, icons } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { getFeaturedProducts, getCategories, getPopularProducts } from '@/lib/data';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const popularProducts = getPopularProducts();
  const categories = getCategories();
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const categoryIcons: { [key: string]: React.ReactNode } = {
    jerseys: <Shirt className="w-12 h-12" />,
    footballs: <Dribbble className="w-12 h-12" />,
    apparel: <Icons.apparel className="w-12 h-12" />,
    footwear: <Footprints className="w-12 h-12" />,
    accessories: <Icons.gloves className="w-12 h-12" />,
    'other-sports': <Dribbble className="w-12 h-12" />,
  };

  const heroImages = [
    { src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1920&auto=format&fit=crop', alt: 'Football on a field', hint: 'football field' },
    { src: 'https://images.unsplash.com/photo-1553778263-73a83bab9b83?q=80&w=1920&auto=format&fit=crop', alt: 'Player kicking a football', hint: 'football player' },
    { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1920&auto=format&fit=crop', alt: 'Football stadium', hint: 'football stadium' },
  ];

  return (
    <div className="space-y-20">
      <section className="text-center py-10 md:py-20 relative">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 tracking-tight">
            Elevate Your Game
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-neutral-300">
            Discover premium football gear, crafted for champions. From the pitch to the stands, we've got you covered.
          </p>

          <Carousel
            setApi={setApi}
            opts={{ align: 'start', loop: true }}
            className="w-full max-w-2xl mx-auto mt-8"
          >
            <CarouselContent>
              {heroImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative rounded-2xl overflow-hidden glassmorphism p-2">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                      data-ai-hint={image.hint}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
          <div className="py-2 flex justify-center gap-2 mt-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn('h-2 w-2 rounded-full transition-colors', i === current ? 'bg-white' : 'bg-white/50 hover:bg-white/75')}
              />
            ))}
          </div>
          
          <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            Shop New Arrivals <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center font-headline">Shop by Category</h2>
        <p className="mt-2 text-lg text-center text-neutral-300 mb-10">Find exactly what you need for your game.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
          {categories.map((category) => {
            const icon = categoryIcons[category.slug];
            return (
              <Link href={`/category/${category.slug}`} key={category.id}>
                <div className="group relative aspect-square flex flex-col items-center justify-center p-6 rounded-2xl glassmorphism transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:-translate-y-1">
                  <div className="text-foreground transition-transform duration-300 group-hover:scale-110 w-12 h-12 flex items-center justify-center">
                    {icon}
                  </div>
                  <h3 className="mt-4 text-center font-semibold text-lg">{category.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Recently Added Products</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Most Popular Products</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {popularProducts.map((product) => (
              <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </section>
    </div>
  );
}
