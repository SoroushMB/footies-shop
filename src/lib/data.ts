export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  price: number;
  images: string[];
  brand: string;
  sizes: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  filters?: {
    brands?: string[];
    teams?: string[];
    nationalTeams?: string[];
  }
};

const products: Product[] = [
  // Jerseys
  {
    id: '1',
    slug: 'home-jersey-24-25',
    name: 'Home Jersey 24/25',
    description: 'The official home jersey for the 2024/2025 season. Made with moisture-wicking fabric to keep you cool and dry.',
    category: 'Jerseys',
    categorySlug: 'jerseys',
    price: 99.99,
    images: ['https://images.unsplash.com/photo-1552064137-59c1b1856331?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599408223485-6858a74bee57?q=80&w=600&auto=format&fit=crop'],
    brand: 'Nike',
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isPopular: true,
  },
  {
    id: '2',
    slug: 'away-jersey-24-25',
    name: 'Away Jersey 24/25',
    description: 'The official away jersey for the 2024/2025 season. Lightweight and breathable for peak performance.',
    category: 'Jerseys',
    categorySlug: 'jerseys',
    price: 99.99,
    images: ['https://images.unsplash.com/photo-1628104239891-764f6b384666?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1511886921339-7b3b21884b49?q=80&w=600&auto=format&fit=crop'],
    brand: 'Adidas',
    sizes: ['S', 'M', 'L', 'XL'],
    isPopular: true,
  },
  {
    id: '3',
    slug: 'national-team-jersey-24',
    name: 'National Team Jersey 2024',
    description: 'Support your country with the official 2024 national team jersey. Features the latest apparel technology.',
    category: 'Jerseys',
    categorySlug: 'jerseys',
    price: 109.99,
    images: ['https://images.unsplash.com/photo-1588861096303-3486532432d4?q=80&w=600&auto=format&fit=crop'],
    brand: 'Puma',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  // Footballs
  {
    id: '4',
    slug: 'official-match-ball',
    name: 'Official Match Ball',
    description: 'The official match ball used by professionals. Thermally bonded seamless surface for a more predictable trajectory.',
    category: 'Footballs',
    categorySlug: 'footballs',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1521413693433-1443ab790331?q=80&w=600&auto=format&fit=crop'],
    brand: 'Adidas',
    sizes: ['5'],
    isFeatured: true,
    isPopular: true,
  },
  {
    id: '5',
    slug: 'training-football-durable',
    name: 'Durable Training Football',
    description: 'A high-quality training ball designed for durability and consistent performance in all weather conditions.',
    category: 'Footballs',
    categorySlug: 'footballs',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1542632230-9a22ac6e6c14?q=80&w=600&auto=format&fit=crop'],
    brand: 'Nike',
    sizes: ['4', '5'],
  },
  // Apparel
  {
    id: '6',
    slug: 'pro-tracksuit-set',
    name: 'Pro Tracksuit Set',
    description: 'Stay comfortable during warm-ups and cool-downs with this professional tracksuit set.',
    category: 'Apparel',
    categorySlug: 'apparel',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1585232104595-3c124bad365e?q=80&w=600&auto=format&fit=crop'],
    brand: 'Nike',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '7',
    slug: 'all-weather-windbreaker',
    name: 'All-Weather Windbreaker',
    description: 'Lightweight and water-resistant windbreaker, perfect for training sessions in unpredictable weather.',
    category: 'Apparel',
    categorySlug: 'apparel',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1515735162817-109a0b8e8a75?q=80&w=600&auto=format&fit=crop'],
    brand: 'Adidas',
    sizes: ['M', 'L', 'XL'],
    isFeatured: true,
  },
  // Footwear
  {
    id: '8',
    slug: 'elite-pro-cleats',
    name: 'Elite Pro Cleats',
    description: 'Engineered for speed and precision. The Elite Pro cleats offer superior grip and ball control.',
    category: 'Footwear',
    categorySlug: 'footwear',
    price: 249.99,
    images: ['https://images.unsplash.com/photo-1526279979402-99a384074a15?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1608229452294-252f4019b841?q=80&w=600&auto=format&fit=crop'],
    brand: 'Nike',
    sizes: ['8', '9', '10', '11', '12'],
    isFeatured: true,
    isPopular: true,
  },
  {
    id: '9',
    slug: 'turf-cleats-agility',
    name: 'Agility Turf Cleats',
    description: 'Perfect for artificial turf surfaces, these cleats provide excellent traction and agility.',
    category: 'Footwear',
    categorySlug: 'footwear',
    price: 119.99,
    images: ['https://images.unsplash.com/photo-1627914946322-9598a3949987?q=80&w=600&auto=format&fit=crop'],
    brand: 'Puma',
    sizes: ['8', '9', '10', '11'],
  },
  // Accessories
  {
    id: '10',
    slug: 'pro-goalkeeper-gloves',
    name: 'Pro Goalkeeper Gloves',
    description: 'Professional-grade goalkeeper gloves with superior grip and shock absorption for ultimate save-making.',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1549464065-126207452d3c?q=80&w=600&auto=format&fit=crop'],
    brand: 'Other Brands',
    sizes: ['8', '9', '10'],
    isPopular: true,
  },
  // Other Sports
  {
    id: '11',
    slug: 'pro-basketball-jersey',
    name: 'Pro Basketball Jersey',
    description: 'A professional basketball jersey with breathable fabric, perfect for the court.',
    category: 'Other Sports',
    categorySlug: 'other-sports',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1576481492331-a836a41785d0?q=80&w=600&auto=format&fit=crop'],
    brand: 'Nike',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '12',
    slug: 'classic-baseball-jersey',
    name: 'Classic Baseball Jersey',
    description: 'A classic pinstripe baseball jersey, combining timeless style with modern performance materials.',
    category: 'Other Sports',
    categorySlug: 'other-sports',
    price: 94.99,
    images: ['https://images.unsplash.com/photo-1616413221903-a4a3b118029c?q=80&w=600&auto=format&fit=crop'],
    brand: 'Other Brands',
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
];

const categories: Category[] = [
  { 
    id: '1', 
    name: 'Jerseys', 
    slug: 'jerseys',
    filters: {
      brands: ['Nike', 'Adidas', 'Puma', 'Other Brands'],
      teams: ['FC Barcelona', 'Real Madrid', 'Manchester United'],
      nationalTeams: ['Brazil', 'Argentina', 'Germany'],
    }
  },
  { 
    id: '2', 
    name: 'Footballs', 
    slug: 'footballs',
    filters: {
      brands: ['Nike', 'Adidas'],
    }
  },
  { 
    id: '3', 
    name: 'Apparel', 
    slug: 'apparel',
    filters: {
      brands: ['Nike', 'Adidas'],
    }
  },
  { 
    id: '4', 
    name: 'Footwear', 
    slug: 'footwear',
    filters: {
      brands: ['Nike', 'Puma', 'Adidas'],
    }
  },
  { 
    id: '5', 
    name: 'Accessories', 
    slug: 'accessories',
    filters: {
      brands: ['Other Brands'],
    }
  },
  { 
    id: '6', 
    name: 'Other Sports', 
    slug: 'other-sports',
    filters: {
      brands: ['Nike', 'Other Brands'],
      teams: ['Lakers', 'Yankees']
    }
  },
];

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

export function getPopularProducts() {
  return products.filter((p) => p.isPopular);
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
