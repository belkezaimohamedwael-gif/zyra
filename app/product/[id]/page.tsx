export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(Number(id)),
    getProducts(),
  ]);

  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return <ProductDetail product={product} related={related} />;
}
