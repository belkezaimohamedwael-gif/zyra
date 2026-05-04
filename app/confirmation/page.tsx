'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Btn from '@/components/Btn';
import { fmt } from '@/lib/data';
import { Order } from '@/lib/types';

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('zyra-order');
    if (raw) { setOrder(JSON.parse(raw)); sessionStorage.removeItem('zyra-order'); }
    setTimeout(() => setVisible(true), 100);
  }, []);

  const timeline = [
    { s: 'Commande reçue', d: 'Maintenant', done: true },
    { s: 'Confirmation par téléphone', d: 'Dans les 24h', done: false },
    { s: 'Expédition', d: '1-2 jours ouvrables', done: false },
    { s: 'Livraison à domicile', d: '2-4 jours ouvrables', done: false },
  ];

  if (!order) return (
    <main><Navbar />
      <div style={{ paddingTop: 200, textAlign: 'center' }}>
        <Btn primary onClick={() => router.push('/')}>Retour à l&apos;accueil</Btn>
      </div>
    </main>
  );

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: 72, background: '#faf6f1', minHeight: '100vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 40px', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.9s' }}>
          {/* Checkmark */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(184,131,111,0.1)', border: '2px solid #b8836f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 32 }}>✓</div>
          <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.4em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 16 }}>Commande Confirmée</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: '#3a2a24', marginBottom: 12 }}>Merci, {order.firstName} !</h1>
          <p style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 15, color: '#8a6860', lineHeight: 1.7, marginBottom: 36 }}>Votre commande a été reçue avec succès. Nous vous contacterons sous 24h pour confirmer la livraison.</p>

          {/* Order number */}
          <div style={{ background: '#f5efe8', border: '1px solid rgba(184,131,111,0.2)', padding: '20px 28px', marginBottom: 32, display: 'inline-block' }}>
            <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.3em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 6 }}>Numéro de Commande</div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, color: '#b8836f', letterSpacing: '0.1em' }}>{order.orderNum}</div>
          </div>

          {/* Delivery details */}
          <div style={{ background: '#fff', border: '1px solid rgba(184,131,111,0.12)', padding: '28px', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 20 }}>Détails de Livraison</div>
            {([['Nom', `${order.firstName} ${order.lastName}`], ['Téléphone', order.phone], ['Adresse', order.address], ['Wilaya', order.wilaya], ['Commune', order.city], ['Paiement', 'Cash à la livraison']] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 24, marginBottom: 10, alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.1em', color: '#c9a090', textTransform: 'uppercase', width: 90, flexShrink: 0 }}>{k}</span>
                <span style={{ fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', fontWeight: 300 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ background: '#f5efe8', border: '1px solid rgba(184,131,111,0.1)', padding: '24px', marginBottom: 36, textAlign: 'left' }}>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 16 }}>Articles Commandés</div>
            {order.cart.map((item) => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 60, position: 'relative', overflow: 'hidden', background: '#ede5da', flexShrink: 0 }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, color: '#3a2a24' }}>{item.name}</div>
                    {item.selectedSize && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090' }}>EU {item.selectedSize}{item.selectedColor ? ` · ${item.selectedColor}` : ''} · ×{item.qty}</div>}
                  </div>
                </div>
                <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f' }}>{fmt(item.price * item.qty)}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, color: '#3a2a24' }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, color: '#b8836f' }}>{fmt(order.total)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: 40, textAlign: 'left' }}>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 20 }}>Suivi de Commande</div>
            {timeline.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: step.done ? '#b8836f' : 'rgba(184,131,111,0.15)', border: !step.done ? '2px solid rgba(184,131,111,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.done ? '#fff' : '#c9a090', fontSize: 10 }}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  {i < 3 && <div style={{ width: 1, height: 20, background: 'rgba(184,131,111,0.15)', marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontFamily: "'Jost'", fontSize: 13, color: step.done ? '#3a2a24' : '#9a7a74' }}>{step.s}</div>
                  <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', marginTop: 2 }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Btn primary onClick={() => router.push('/')}>Retour à l&apos;Accueil</Btn>
            <Btn onClick={() => router.push('/shop')}>Continuer les Achats</Btn>
          </div>
        </div>
      </div>
    </main>
  );
}
