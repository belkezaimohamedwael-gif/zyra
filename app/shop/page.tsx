export const dynamic = 'force-dynamic';

import { getProducts } from '@/lib/products';
import ShopClient from '@/components/ShopClient';

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
}
