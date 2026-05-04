// Run: npx tsx scripts/seed.ts
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
try {
  const env = readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  }
} catch {
  // .env.local not found — use existing env
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PHOTOS = {
  p1: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80',
  p2: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=700&q=80',
  p3: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=700&q=80',
  p4: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=80',
  p5: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=700&q=80',
  p6: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=700&q=80',
  p7: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=700&q=80',
  p8: 'https://images.unsplash.com/photo-1494386346843-e12284507169?w=700&q=80',
};

const products = [
  {
    name: 'Petal Flat',
    price: 6800,
    category: 'Flats',
    img_urls: [PHOTOS.p1, PHOTOS.p4, PHOTOS.p7],
    tag: 'Bestseller',
    description: 'Un flat raffiné du quotidien en cuir souple. La silhouette basse le rend effortlessly polyvalent.',
    colors: ['Ivory', 'Blush', 'Camel'],
    stock: true,
    featured: true,
  },
  {
    name: 'Rosé Sandal',
    price: 8200,
    category: 'Sandals',
    img_urls: [PHOTOS.p2, PHOTOS.p5, PHOTOS.p8],
    tag: 'New',
    description: 'Sandale à lanières délicates avec semelle rembourrée. Conçue pour les longues journées sans compromis.',
    colors: ['Rose', 'Nude', 'White'],
    stock: true,
    featured: true,
  },
  {
    name: 'Camel Boot',
    price: 14500,
    category: 'Boots',
    img_urls: [PHOTOS.p3, PHOTOS.p6, PHOTOS.p1],
    tag: '',
    description: "Bottine en cuir pleine fleur. Un ancre de garde-robe qui ne fait que s'améliorer avec le temps.",
    colors: ['Camel', 'Black', 'Cognac'],
    stock: true,
    featured: true,
  },
  {
    name: 'Blush Mule',
    price: 7600,
    category: 'Mules',
    img_urls: [PHOTOS.p4, PHOTOS.p2, PHOTOS.p5],
    tag: 'New',
    description: 'Mule slip-on à talon sculptural. Le ton blush s\'accorde avec tout ce qui est dans votre garde-robe.',
    colors: ['Blush', 'Terracotta', 'Beige'],
    stock: true,
    featured: false,
  },
  {
    name: 'Linen Slip',
    price: 6200,
    category: 'Flats',
    img_urls: [PHOTOS.p5, PHOTOS.p1, PHOTOS.p3],
    tag: '',
    description: 'Léger comme l\'air, fabriqué en lin respirant. Parfait pour les chaudes journées algériennes.',
    colors: ['Natural', 'Sand', 'Ecru'],
    stock: true,
    featured: false,
  },
  {
    name: 'Terracotta Heel',
    price: 9800,
    category: 'Heels',
    img_urls: [PHOTOS.p6, PHOTOS.p4, PHOTOS.p2],
    tag: 'Bestseller',
    description: 'Un talon bloc confiant en terracotta terreux. Assez confortable pour être porté toute la journée.',
    colors: ['Terracotta', 'Rust', 'Taupe'],
    stock: true,
    featured: false,
  },
  {
    name: 'Desert Flat',
    price: 7200,
    category: 'Flats',
    img_urls: [PHOTOS.p7, PHOTOS.p3, PHOTOS.p6],
    tag: '',
    description: 'Inspiré du désert algérien au coucher du soleil. Un flat aux tons chauds en daim premium.',
    colors: ['Sand', 'Dune', 'Ochre'],
    stock: true,
    featured: false,
  },
  {
    name: 'Garden Sandal',
    price: 7900,
    category: 'Sandals',
    img_urls: [PHOTOS.p8, PHOTOS.p1, PHOTOS.p4],
    tag: 'New',
    description: 'Sandale ouverte avec détails tressés. Légère, fraîche et faite pour les mois chauds.',
    colors: ['Ivory', 'Sage', 'Blush'],
    stock: true,
    featured: false,
  },
];

async function seed() {
  console.log('Seeding products...');
  const { data, error } = await supabase.from('products').insert(products).select();
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
  console.log(`✓ Inserted ${data?.length} products`);
}

seed();
