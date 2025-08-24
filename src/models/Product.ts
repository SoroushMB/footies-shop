export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Should correspond to a category slug
  brand: string;
  sizes: string[];
  images: string[];
  isFeatured: boolean;
  isPopular: boolean;
}
