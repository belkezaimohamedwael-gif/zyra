'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Btn from '@/components/Btn';
import { fmt, WILAYAS } from '@/lib/data';
import { useCartStore } from '@/lib/store';

interface FormState {
  firstName: string; lastName: string; phone: string; email: string;
  address: string; wilaya: string; city: string; notes: string;
}
type Errors = Partial<Record<keyof FormState, string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', phone: '', email: '', address: '', wilaya: '', city: '', notes: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'Requis';
    if (!form.lastName.trim()) e.lastName = 'Requis';
    if (!form.phone.trim() || !/^0[5-7]\d{8}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Numéro algérien invalide (ex: 0550 123 456)';
    if (!form.address.trim()) e.address = 'Requis';
    if (!form.wilaya) e.wilaya = 'Veuillez choisir une wilaya';
    if (!form.city.trim()) e.city = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, total }),
      });

      if (!res.ok) {
        const err = await res.json();
        setGlobalError(err.error || 'Une erreur est survenue. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      const { orderNum } = await res.json();
      const order = { ...form, cart: items, total, orderNum };
      clearCart();
      sessionStorage.setItem('zyra-order', JSON.stringify(order));
      router.push('/confirmation');
    } catch {
      setGlobalError('Erreur de connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const Field = ({ label, id, placeholder, type = 'text', req = true }: { label: string; id: keyof FormState; placeholder: string; type?: string; req?: boolean }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}{req && <span style={{ color: '#b8836f' }}> *</span>}
      </label>
      <input
        type={type}
        value={form[id]}
        onChange={(e) => set(id, e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '13px 16px', border: `1px solid ${errors[id] ? '#c0392b' : 'rgba(184,131,111,0.25)'}`, background: '#fff', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', outline: 'none', transition: 'border-color 0.2s', WebkitAppearance: 'none', borderRadius: 0 }}
      />
      {errors[id] && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors[id]}</div>}
    </div>
  );

  if (items.length === 0) {
    return (
      <main><Navbar />
        <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: '0 20px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, color: '#9a7a74', textAlign: 'center' }}>Votre panier est vide</p>
          <Btn primary onClick={() => router.push('/shop')}>Découvrir la Collection</Btn>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: 72, background: '#faf6f1', minHeight: '100vh' }}>
        <div className="checkout-outer" style={{ padding: '48px 80px' }}>
          <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.35em', color: '#c9a090', marginBottom: 10, textTransform: 'uppercase' }}>Commande</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: '#3a2a24', marginBottom: 40 }}>Finaliser la Commande</h1>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48, maxWidth: 400 }}>
            {['Livraison', 'Confirmation'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i === 0 ? 'none' : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#b8836f' : 'rgba(184,131,111,0.15)', border: i === 1 ? '2px solid rgba(184,131,111,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost'", fontSize: 11, color: i === 0 ? '#fff' : '#b8836f', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: i === 0 ? '#3a2a24' : '#c9a090' }}>{s}</span>
                </div>
                {i === 0 && <div style={{ flex: 1, height: 1, background: 'rgba(184,131,111,0.2)', margin: '0 16px' }} />}
              </div>
            ))}
          </div>

          <div
            className="checkout-main-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'start' }}
          >
            {/* Form — left col desktop, top on mobile */}
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, color: '#3a2a24', marginBottom: 28, fontWeight: 300 }}>Adresse de Livraison</div>
              <div className="checkout-2col">
                <Field label="Prénom" id="firstName" placeholder="Votre prénom" />
                <Field label="Nom" id="lastName" placeholder="Votre nom" />
              </div>
              <Field label="Téléphone" id="phone" placeholder="0550 123 456" type="tel" />
              <Field label="Email (optionnel)" id="email" placeholder="votre@email.com" type="email" req={false} />
              <Field label="Adresse complète" id="address" placeholder="N° rue, quartier..." />

              {/* Wilaya */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 8 }}>
                  Wilaya <span style={{ color: '#b8836f' }}>*</span>
                </label>
                <select
                  value={form.wilaya}
                  onChange={(e) => set('wilaya', e.target.value)}
                  style={{ width: '100%', padding: '13px 16px', border: `1px solid ${errors.wilaya ? '#c0392b' : 'rgba(184,131,111,0.25)'}`, background: '#fff', fontFamily: "'Jost'", fontSize: 14, color: form.wilaya ? '#3a2a24' : '#aaa', outline: 'none', cursor: 'pointer', borderRadius: 0 }}
                >
                  <option value="">Choisir votre wilaya...</option>
                  {WILAYAS.map((w, i) => <option key={w} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>)}
                </select>
                {errors.wilaya && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.wilaya}</div>}
              </div>

              <Field label="Ville / Commune" id="city" placeholder="Votre commune" />

              {/* Notes */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 8 }}>Notes (optionnel)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Instructions de livraison..."
                  style={{ width: '100%', padding: '13px 16px', height: 90, resize: 'vertical', border: '1px solid rgba(184,131,111,0.25)', background: '#fff', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', outline: 'none', borderRadius: 0 }}
                />
              </div>

              {/* Payment */}
              <div style={{ background: 'rgba(184,131,111,0.06)', border: '1px solid rgba(184,131,111,0.15)', padding: '20px 24px', marginBottom: 32 }}>
                <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 14 }}>Mode de Paiement</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#b8836f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24' }}>Paiement à la livraison</div>
                    <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74', fontWeight: 300, marginTop: 2 }}>Payez en cash à la réception de votre colis</div>
                  </div>
                </div>
              </div>

              {globalError && (
                <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#c0392b', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.2)', padding: '12px 16px', marginBottom: 20 }}>
                  {globalError}
                </div>
              )}

              <Btn primary full onClick={placeOrder} disabled={loading} style={{ fontSize: 13 }}>
                {loading ? 'Traitement...' : 'Confirmer la Commande →'}
              </Btn>
            </div>

            {/* Order summary — right col desktop, below form on mobile */}
            <div
              className="checkout-summary-panel"
              style={{ background: '#f5efe8', padding: '28px', border: '1px solid rgba(184,131,111,0.1)', position: 'sticky', top: 100 }}
            >
              <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.25em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 20 }}>Votre Commande</div>
              {items.map((item) => (
                <div key={item.cartId} style={{ display: 'flex', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
                  <div style={{ width: 60, height: 75, overflow: 'hidden', background: '#ede5da', flexShrink: 0, position: 'relative' }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 16, color: '#3a2a24' }}>{item.name}</div>
                    {item.selectedSize && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', marginTop: 2 }}>EU {item.selectedSize}{item.selectedColor ? ` · ${item.selectedColor}` : ''}</div>}
                    <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74', marginTop: 4 }}>×{item.qty}</div>
                  </div>
                  <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f', whiteSpace: 'nowrap' }}>{fmt(item.price * item.qty)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#7a5a54', fontWeight: 300 }}>Livraison</span>
                <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f' }}>Gratuite</span>
              </div>
              <div style={{ height: 1, background: 'rgba(184,131,111,0.15)', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, color: '#3a2a24' }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, color: '#b8836f' }}>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
