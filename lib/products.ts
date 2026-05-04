import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Product } from './types';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

function mapRow(row: Record<string, unknown>): Product {
  const imgUrls = (row.img_urls as string[]) || [];
  return {
    id: row.id as number,
    name: row.name as string,
    price: row.price as number,
    category: row.category as string,
    img: imgUrls[0] || '',
    img_urls: imgUrls,
    tag: (row.tag as string) || '',
    description: (row.description as string) || '',
    colors: (row.colors as string[]) || [],
    stock: row.stock as boolean,
    featured: row.featured as boolean,
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) return [];

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getProduct(id: number): Promise<Product | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error || !data) return [];
  return data.map(mapRow);
}
