import { getProductBySlug, getAllProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

// Force dynamic rendering to avoid Clerk issues during static generation
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
