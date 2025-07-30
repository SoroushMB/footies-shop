
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
import { WelcomeDialog } from '@/components/welcome-dialog';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const popularProducts = getPopularProducts();
  const categories = getCategories();
  
  const [heroApi, setHeroApi] = React.useState<CarouselApi>()
  const [heroCurrent, setHeroCurrent] = React.useState(0)

  const [featuredApi, setFeaturedApi] = React.useState<CarouselApi>()
  const [featuredCurrent, setFeaturedCurrent] = React.useState(0)
  
  const [popularApi, setPopularApi] = React.useState<CarouselApi>()
  const [popularCurrent, setPopularCurrent] = React.useState(0)

  const [slidesToShow, setSlidesToShow] = React.useState(4);
  const [showWelcomePopup, setShowWelcomePopup] = React.useState(false);

  React.useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      setShowWelcomePopup(true);
      sessionStorage.setItem('hasSeenWelcomePopup', 'true');
    }
  }, []);

  React.useEffect(() => {
    function updateSlidesToShow() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setSlidesToShow(2);
      } else if (screenWidth < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    }
    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  React.useEffect(() => {
    if (!heroApi) return;
    setHeroCurrent(heroApi.selectedScrollSnap());
    heroApi.on("select", () => setHeroCurrent(heroApi.selectedScrollSnap()));
  }, [heroApi]);
  
  React.useEffect(() => {
    if (!featuredApi) return;
    setFeaturedCurrent(featuredApi.selectedScrollSnap());
    featuredApi.on("select", () => setFeaturedCurrent(featuredApi.selectedScrollSnap()));
  }, [featuredApi]);

  React.useEffect(() => {
    if (!popularApi) return;
    setPopularCurrent(popularApi.selectedScrollSnap());
    popularApi.on("select", () => setPopularCurrent(popularApi.selectedScrollSnap()));
  }, [popularApi]);

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
    <>
    <WelcomeDialog open={showWelcomePopup} onOpenChange={setShowWelcomePopup} />
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
            setApi={setHeroApi}
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
                      fill
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
                onClick={() => heroApi?.scrollTo(i)}
                className={cn('h-2 w-2 rounded-full transition-colors', i === heroCurrent ? 'bg-white' : 'bg-white/50 hover:bg-white/75')}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
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
          setApi={setFeaturedApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
        <div className="py-2 flex justify-center gap-2 mt-2">
            {Array.from({ length: Math.ceil(featuredProducts.length / slidesToShow) }).map((_, i) => (
              <button
                key={i}
                onClick={() => featuredApi?.scrollTo(i)}
                className={cn('h-2 w-2 rounded-full transition-colors', i === featuredCurrent ? 'bg-white' : 'bg-white/50 hover:bg-white/75')}
              />
            ))}
        </div>
        <div className="text-center mt-6">
            <Button variant="outline">View All</Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Most Popular Products</h2>
        <Carousel
          setApi={setPopularApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {popularProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 sm-basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
        <div className="py-2 flex justify-center gap-2 mt-2">
            {Array.from({ length: Math.ceil(popularProducts.length / slidesToShow) }).map((_, i) => (
              <button
                key={i}
                onClick={() => popularApi?.scrollTo(i)}
                className={cn('h-2 w-2 rounded-full transition-colors', i === popularCurrent ? 'bg-white' : 'bg-white/50 hover:bg-white/75')}
              />
            ))}
        </div>
        <div className="text-center mt-6">
            <Button variant="outline">View All</Button>
        </div>
      </section>
    </div>
    </>
  );
}
