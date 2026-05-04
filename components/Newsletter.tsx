'use client';
import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const ref = useReveal();

  return (
    <section style={{ background: '#3a2a24', padding: '90px 80px', textAlign: 'center' }}>
      <div ref={ref} className="reveal">
        <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.4em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 16 }}>Restez Informée</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: '#faf6f1', marginBottom: 12 }}>Les nouveautés en premier</h2>
        <p style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 14, color: 'rgba(250,246,241,0.45)', marginBottom: 40 }}>Accès exclusif aux nouvelles collections et offres spéciales</p>
        {done ? (
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontStyle: 'italic', color: '#c9a090' }}>Merci ! Vous êtes maintenant inscrite ✦</div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', maxWidth: 440, margin: '0 auto' }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              style={{ flex: 1, padding: '14px 20px', background: 'rgba(250,246,241,0.08)', border: '1px solid rgba(201,160,144,0.25)', borderRight: 'none', color: '#faf6f1', fontFamily: "'Jost'", fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={() => email && setDone(true)}
              style={{ padding: '14px 28px', background: '#b8836f', border: 'none', color: '#faf6f1', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              S&apos;inscrire
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
