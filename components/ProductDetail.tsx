'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Btn from '@/components/Btn';
import { SIZES, fmt } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: Props) {
  const router = useRouter();
  const [selSize, setSelSize] = useState<number | null>(null);
  const [selColor, setSelColor] = useState(product.colors[0]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeErr, setSizeErr] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (!selSize) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2000); return; }
    addItem(product, qty, selSize, selColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selSize) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2000); return; }
    addItem(product, qty, selSize, selColor);
    router.push('/cart');
  };

  const images = product.img_urls.length ? product.img_urls : [product.img];

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: 72, background: '#faf6f1', minHeight: '100vh' }}>
        {/* Breadcrumb */}
        <div style={{ padding: '20px 80px', borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
          <Link href="/" style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', letterSpacing: '0.1em', textDecoration: 'none' }}>Accueil</Link>
          <span style={{ color: '#c9a090', margin: '0 8px' }}>›</span>
          <Link href="/shop" style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', letterSpacing: '0.1em', textDecoration: 'none' }}>Boutique</Link>
          <span style={{ color: '#c9a090', margin: '0 8px' }}>›</span>
          <span style={{ fontFamily: "'Jost'", fontSize: 11, color: '#3a2a24', letterSpacing: '0.1em' }}>{product.name}</span>
        </div>

        <div style={{ padding: '60px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#ede5da', marginBottom: 16, position: 'relative' }}>
              <Image src={images[activeImg] || images[0]} alt={product.name} fill style={{ objectFit: 'cover', transition: 'opacity 0.4s' }} unoptimized />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 80, overflow: 'hidden', cursor: 'pointer', border: activeImg === i ? '2px solid #b8836f' : '2px solid transparent', transition: 'border-color 0.2s', opacity: activeImg === i ? 1 : 0.65, position: 'relative', flexShrink: 0 }}>
                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ paddingTop: 8 }}>
            {product.tag && (
              <div style={{ display: 'inline-block', background: product.tag === 'New' ? '#b8836f' : 'rgba(184,131,111,0.12)', color: product.tag === 'New' ? '#fff' : '#b8836f', fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 14px', marginBottom: 16 }}>
                {product.tag}
              </div>
            )}
            <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(36px,4vw,52px)', fontWeight: 300, color: '#3a2a24', lineHeight: 1.05, marginBottom: 8 }}>{product.name}</h1>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 20 }}>{product.category}</div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 36, color: '#b8836f', fontWeight: 300, marginBottom: 24 }}>{fmt(product.price)}</div>
            <div style={{ width: '100%', height: 1, background: 'rgba(184,131,111,0.15)', marginBottom: 28 }} />
            <p style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 15, color: '#7a5a54', lineHeight: 1.85, marginBottom: 28 }}>{product.description}</p>

            {/* Color */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 12 }}>
                Couleur: <span style={{ color: '#3a2a24' }}>{selColor}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelColor(c)} style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.1em', padding: '8px 16px', border: 'none', cursor: 'pointer', background: selColor === c ? '#b8836f' : 'rgba(184,131,111,0.1)', color: selColor === c ? '#fff' : '#7a5a54', transition: 'all 0.25s' }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: sizeErr ? '#c0392b' : '#9a7a74', textTransform: 'uppercase', marginBottom: 12 }}>
                {sizeErr ? '⚠ Veuillez choisir une taille' : 'Pointure (EU)'}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {SIZES.map((s) => (
                  <button key={s} onClick={() => setSelSize(s)} style={{ width: 48, height: 48, border: 'none', cursor: 'pointer', fontFamily: "'Jost'", fontSize: 13, background: selSize === s ? '#b8836f' : 'rgba(184,131,111,0.1)', color: selSize === s ? '#fff' : '#7a5a54', outline: sizeErr ? '2px solid rgba(192,57,43,0.4)' : 'none', transition: 'all 0.2s' }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#9a7a74', textTransform: 'uppercase' }}>Quantité:</div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(184,131,111,0.2)' }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#9a7a74' }}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24' }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#9a7a74' }}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ marginBottom: 12 }}>
              <Btn primary full onClick={handleAdd}>{added ? '✓ Ajouté au Panier' : 'Ajouter au Panier'}</Btn>
            </div>
            <div style={{ marginBottom: 24 }}>
              <Btn dark full onClick={handleBuyNow}>Commander Maintenant</Btn>
            </div>

            {/* Delivery info */}
            <div style={{ background: 'rgba(184,131,111,0.06)', border: '1px solid rgba(184,131,111,0.15)', padding: '20px 24px' }}>
              {[{ icon: '🚚', text: 'Livraison à domicile — 58 wilayas' }, { icon: '💳', text: 'Paiement à la livraison (cash)' }, { icon: '📦', text: 'Retours gratuits sous 14 jours' }].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                  <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#7a5a54', fontWeight: 300 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ padding: '60px 80px', background: '#f5efe8' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(28px,3vw,42px)', fontWeight: 300, color: '#3a2a24', marginBottom: 48 }}>Vous Aimerez Aussi</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 36 }}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
            </div>
          </section>
        )}

        <Footer />
      </div>
    </main>
  );
}
