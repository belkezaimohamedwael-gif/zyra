'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { fmt } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { useReveal } from '@/hooks/useReveal';

interface Props {
  product: Product;
  delay?: number;
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const router = useRouter();
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const ref = useReveal();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      ref={ref}
      className="reveal product-card"
      style={{ transitionDelay: `${delay}s`, cursor: 'pointer' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image */}
      <div
        style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#ede5da', borderRadius: 2 }}
        onClick={() => router.push(`/product/${product.id}`)}
      >
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="product-img"
          style={{ objectFit: 'cover' }}
          unoptimized
        />

        {/* Badge */}
        {product.tag && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: product.tag === 'New' ? '#b8836f' : 'rgba(250,246,241,0.92)',
            color: product.tag === 'New' ? '#fff' : '#b8836f',
            fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '5px 12px',
            border: product.tag === 'Bestseller' ? '1px solid rgba(184,131,111,0.3)' : 'none',
          }}>
            {product.tag}
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="product-overlay"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(250,246,241,0.72)',
            backdropFilter: 'blur(3px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <button
            className="overlay-btn"
            onClick={(e) => { e.stopPropagation(); router.push(`/product/${product.id}`); }}
            style={{
              padding: '13px 36px', background: '#b8836f', border: 'none', color: '#faf6f1',
              fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: '0 8px 20px rgba(184,131,111,0.25)',
            }}
          >
            Commander
          </button>
          <button
            className="overlay-btn"
            onClick={handleQuickAdd}
            style={{
              background: 'none', border: '1px solid rgba(184,131,111,0.35)',
              padding: '11px 24px', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: inCart || added ? '#b8836f' : '#9a7a74', cursor: 'pointer',
            }}
          >
            {added ? '✓ Ajouté' : inCart ? '✓ Dans le panier' : 'Ajouter au Panier'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, color: '#3a2a24', fontWeight: 400 }}>{product.name}</span>
          <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f', fontWeight: 300 }}>{fmt(product.price)}</span>
        </div>
        <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#c9a090', marginTop: 4, textTransform: 'uppercase' }}>{product.category}</div>
        <div className="product-line" />
      </div>
    </div>
  );
}
