'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Btn from '@/components/Btn';
import { fmt } from '@/lib/data';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: 72, background: '#faf6f1', minHeight: '100vh' }}>
        <div className="cart-outer" style={{ padding: '48px 80px' }}>
          <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.35em', color: '#c9a090', marginBottom: 12, textTransform: 'uppercase' }}>Mon Panier</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(32px,4vw,56px)', fontWeight: 300, color: '#3a2a24', marginBottom: 40 }}>
            {items.length === 0 ? 'Votre panier est vide' : `${items.length} article${items.length > 1 ? 's' : ''}`}
          </h1>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.3 }}>👜</div>
              <p style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 15, color: '#9a7a74', marginBottom: 32 }}>Vous n&apos;avez rien ajouté au panier.</p>
              <Btn primary onClick={() => router.push('/shop')}>Découvrir la Collection</Btn>
            </div>
          ) : (
            <div
              className="cart-main-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'start' }}
            >
              {/* Items */}
              <div>
                {items.map((item, idx) => (
                  <div
                    key={item.cartId}
                    className="cart-item-grid"
                    style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, paddingBottom: 28, marginBottom: 28, borderBottom: idx < items.length - 1 ? '1px solid rgba(184,131,111,0.12)' : 'none', alignItems: 'start' }}
                  >
                    <div
                      style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#ede5da', position: 'relative', cursor: 'pointer' }}
                      onClick={() => router.push(`/product/${item.id}`)}
                    >
                      <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, color: '#3a2a24', marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{item.category}</div>
                      {item.selectedSize && <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74', marginBottom: 4 }}>Pointure: EU {item.selectedSize}</div>}
                      {item.selectedColor && <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74', marginBottom: 16 }}>Couleur: {item.selectedColor}</div>}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(184,131,111,0.2)', width: 'fit-content' }}>
                        <button onClick={() => updateQty(item.cartId, item.qty - 1)} style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: '#9a7a74' }}>−</button>
                        <span style={{ width: 36, textAlign: 'center', fontFamily: "'Jost'", fontSize: 13, color: '#3a2a24' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.cartId, item.qty + 1)} style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: '#9a7a74' }}>+</button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Jost'", fontSize: 14, color: '#b8836f', marginBottom: 12 }}>{fmt(item.price * item.qty)}</div>
                      <button onClick={() => removeItem(item.cartId)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Jost'", fontSize: 11, color: '#c9b0a8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary-panel" style={{ background: '#f5efe8', padding: '32px', border: '1px solid rgba(184,131,111,0.1)', position: 'sticky', top: 100 }}>
                <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.25em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 24 }}>Récapitulatif</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#7a5a54', fontWeight: 300 }}>Sous-total</span>
                  <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#3a2a24' }}>{fmt(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#7a5a54', fontWeight: 300 }}>Livraison</span>
                  <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f' }}>Gratuite</span>
                </div>
                <div style={{ height: 1, background: 'rgba(184,131,111,0.15)', marginBottom: 20 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, color: '#3a2a24' }}>Total</span>
                  <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, color: '#b8836f' }}>{fmt(total)}</span>
                </div>
                <div style={{ background: 'rgba(184,131,111,0.08)', border: '1px solid rgba(184,131,111,0.15)', padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>💳</span>
                  <span style={{ fontFamily: "'Jost'", fontSize: 12, color: '#7a5a54', fontWeight: 300 }}>Paiement à la livraison (cash)</span>
                </div>
                <Btn primary full onClick={() => router.push('/checkout')}>Passer la Commande →</Btn>
                <div style={{ marginTop: 12 }}>
                  <Btn full onClick={() => router.push('/shop')}>Continuer les Achats</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}
