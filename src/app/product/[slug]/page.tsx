import { getProductBySlug, getAllProducts, Product } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

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

  return <ProductDetailClient product={product} />;
}
