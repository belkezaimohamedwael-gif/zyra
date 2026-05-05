'use client';
import { useEffect, useState } from 'react';
import { TESTIMONIALS } from '@/lib/data';
import SectionHeader from './SectionHeader';
import { useReveal } from '@/hooks/useReveal';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useReveal();

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section-testimonials" style={{ background: '#faf6f1', padding: '100px 80px' }}>
      <SectionHeader eyebrow="Elles Témoignent" title="Ce Qu'Elles Disent" center />
      <div ref={ref} className="reveal" style={{ maxWidth: 700, margin: '56px auto 0', textAlign: 'center' }}>
        {TESTIMONIALS.map((r, i) => (
          <div key={i} style={{ display: i === active ? 'block' : 'none', animation: 'fadeIn 0.7s ease' }}>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 80, lineHeight: 0.6, color: 'rgba(184,131,111,0.15)', marginBottom: 20, userSelect: 'none' }}>❝</div>
            <p style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(18px,2.2vw,28px)', fontStyle: 'italic', fontWeight: 300, color: '#3a2a24', lineHeight: 1.65, marginBottom: 32 }}>
              "{r.text}"
            </p>
            <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f', letterSpacing: '0.12em' }}>{r.name}</div>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', marginTop: 3 }}>{r.city}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 28 : 8, height: 4, borderRadius: 2, border: 'none', background: i === active ? '#b8836f' : 'rgba(184,131,111,0.2)', cursor: 'pointer', transition: 'all 0.4s' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
