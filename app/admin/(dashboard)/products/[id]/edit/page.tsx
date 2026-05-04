'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AdminProductForm from '@/components/AdminProductForm';
import { Product } from '@/lib/types';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('products').select('*').eq('id', Number(id)).single();
      if (data) setProduct({ ...data, img: data.img_urls?.[0] ?? '' });
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '44px 52px', fontFamily: "'Jost'", fontSize: 13, color: '#9a7a74' }}>
        Chargement...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '44px 52px', fontFamily: "'Jost'", fontSize: 13, color: '#c0392b' }}>
        Produit introuvable.
      </div>
    );
  }

  return <AdminProductForm mode="edit" product={product} />;
}
