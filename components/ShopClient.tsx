'use client';
import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/lib/data';
import { Product } from '@/lib/types';

interface Props {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: Props) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    let p = cat === 'All' ? initialProducts : initialProducts.filter((p) => p.category === cat);
    if (sort === 'asc') p = [...p].sort((a, b) => a.price - b.price);
    if (sort === 'desc') p = [...p].sort((a, b) => b.price - a.price);
    return p;
  }, [cat, sort, initialProducts]);

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: 72, minHeight: '100vh', background: '#faf6f1' }}>
        {/* Header */}
        <div style={{ background: '#f5efe8', padding: '60px 80px 48px', borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
          <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.35em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 12 }}>ZYRA</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(40px,5vw,64px)', fontWeight: 300, color: '#3a2a24' }}>Notre Collection</h1>
          <p style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 14, color: '#8a6860', marginTop: 8 }}>
            {filtered.length} styles · Livraison dans toute l&apos;Algérie
          </p>
        </div>

        {/* Filters */}
        <div style={{ padding: '24px 80px', background: '#faf6f1', borderBottom: '1px solid rgba(184,131,111,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 72, zIndex: 100, backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 18px', border: 'none', cursor: 'pointer', background: cat === c ? '#b8836f' : 'transparent', color: cat === c ? '#faf6f1' : '#9a7a74', borderBottom: cat === c ? 'none' : '1px solid rgba(154,122,116,0.2)', transition: 'all 0.25s' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'Jost'", fontSize: 11, color: '#9a7a74', letterSpacing: '0.1em' }}>TRIER:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.1em', background: 'transparent', border: '1px solid rgba(184,131,111,0.2)', padding: '6px 12px', color: '#7a5a54', outline: 'none', cursor: 'pointer' }}>
              <option value="featured">Populaire</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding: '60px 80px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 36 }}>
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.06} />)}
        </div>

        <Footer />
      </div>
    </main>
  );
}
