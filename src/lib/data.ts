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
};

export type Category = {
  id: string;
  name: string;
  slug: string;
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
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    brand: 'Brand A',
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'away-jersey-24-25',
    name: 'Away Jersey 24/25',
    description: 'The official away jersey for the 2024/2025 season. Lightweight and breathable for peak performance.',
    category: 'Jerseys',
    categorySlug: 'jerseys',
    price: 99.99,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    brand: 'Brand A',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '3',
    slug: 'national-team-jersey-24',
    name: 'National Team Jersey 2024',
    description: 'Support your country with the official 2024 national team jersey. Features the latest apparel technology.',
    category: 'Jerseys',
    categorySlug: 'jerseys',
    price: 109.99,
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand B',
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
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand C',
    sizes: ['5'],
    isFeatured: true,
  },
  {
    id: '5',
    slug: 'training-football-durable',
    name: 'Durable Training Football',
    description: 'A high-quality training ball designed for durability and consistent performance in all weather conditions.',
    category: 'Footballs',
    categorySlug: 'footballs',
    price: 39.99,
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand C',
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
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand A',
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
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand B',
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
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    brand: 'Brand D',
    sizes: ['8', '9', '10', '11', '12'],
    isFeatured: true,
  },
  {
    id: '9',
    slug: 'turf-cleats-agility',
    name: 'Agility Turf Cleats',
    description: 'Perfect for artificial turf surfaces, these cleats provide excellent traction and agility.',
    category: 'Footwear',
    categorySlug: 'footwear',
    price: 119.99,
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand D',
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
    images: ['https://placehold.co/600x600.png'],
    brand: 'Brand E',
    sizes: ['8', '9', '10'],
  },
];

const categories: Category[] = [
  { id: '1', name: 'Jerseys', slug: 'jerseys' },
  { id: '2', name: 'Footballs', slug: 'footballs' },
  { id: '3', name: 'Apparel', slug: 'apparel' },
  { id: '4', name: 'Footwear', slug: 'footwear' },
  { id: '5', name: 'Accessories', slug: 'accessories' },
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

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
