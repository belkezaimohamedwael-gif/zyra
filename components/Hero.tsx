'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HERO_SLIDES, PHOTOS, fmt } from '@/lib/data';
import Btn from './Btn';

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const cur = HERO_SLIDES[slide];

  const marqueeItems = ['Nouveautés', 'Livraison 48h', 'Paiement à la livraison', '58 Wilayas', 'Qualité Premium', 'Retours Gratuits', 'Made in Algeria'];

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#f5ede4' }}>
      {/* Slides */}
      {HERO_SLIDES.map((s, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slide ? 1 : 0, transition: 'opacity 1.4s cubic-bezier(0.4,0,0.2,1)', zIndex: i === slide ? 1 : 0 }}>
          <Image src={s.img} alt="" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} priority={i === 0} unoptimized />
        </div>
      ))}

      {/* Gradient */}
      <div
        className="hero-gradient-overlay"
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(105deg, rgba(250,246,241,0.92) 0%, rgba(250,246,241,0.82) 30%, rgba(250,246,241,0.35) 55%, rgba(250,246,241,0.0) 75%)',
        }}
      />

      {/* Content */}
      <div
        className="hero-content-inner"
        style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '100px 80px 80px',
        }}
      >
        <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.45em', color: '#9a5a48', textTransform: 'uppercase', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-block', width: 32, height: 1, background: '#b8836f', flexShrink: 0 }} />
          Nouvelle Collection 2026 · Alger
        </div>

        <h1 key={slide} style={{ fontFamily: "'Cormorant Garamond'", fontWeight: 300, fontSize: 'clamp(64px,8.5vw,124px)', lineHeight: 0.9, letterSpacing: '-0.02em', maxWidth: 750, marginBottom: 4 }}>
          {cur.title.map((line, i) => (
            <span key={i} style={{
              display: 'block', color: line === cur.accent ? '#b8836f' : '#2a1a14',
              fontStyle: line === cur.accent ? 'italic' : 'normal',
              fontFamily: "'Cormorant Garamond'", fontWeight: line === cur.accent ? 400 : 300,
            }}>
              {line}
            </span>
          ))}
        </h1>

        <p className="hero-sub" style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 16, color: '#5a3a30', marginTop: 28 }}>{cur.sub}</p>

        <div className="hero-btn-group" style={{ display: 'flex', gap: 16, marginTop: 48 }}>
          <Btn primary onClick={() => router.push('/shop')}>Découvrir la Collection</Btn>
          <Btn onClick={() => router.push('/shop')} style={{ background: 'rgba(250,246,241,0.7)', backdropFilter: 'blur(8px)', borderBottom: 'none', padding: '14px 28px' }}>Nouveautés →</Btn>
        </div>

        {/* Delivery badge */}
        <div
          className="hero-badge"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 40,
            background: 'rgba(250,246,241,0.85)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(184,131,111,0.2)', padding: '12px 20px',
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: 18 }}>🚚</span>
          <div>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', color: '#b8836f', textTransform: 'uppercase' }}>Livraison Gratuite</div>
            <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#7a5a54', fontWeight: 300 }}>Pour toute commande · 58 wilayas</div>
          </div>
        </div>
      </div>

      {/* Floating product card — hidden on mobile */}
      <div
        className="animate-float hero-floating-card"
        style={{
          position: 'absolute', right: 60, top: '50%', transform: 'translateY(-40%)', zIndex: 4,
          background: 'rgba(250,246,241,0.95)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(184,131,111,0.2)', padding: '20px 24px',
          boxShadow: '0 24px 48px rgba(100,60,40,0.12)', minWidth: 170,
        }}
      >
        <div style={{ width: 140, height: 140, overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
          <Image src={PHOTOS.p1} alt="Petal Flat" fill style={{ objectFit: 'cover' }} unoptimized />
        </div>
        <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.3em', color: '#c9a090', marginBottom: 4, textTransform: 'uppercase' }}>Coup de Cœur</div>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, color: '#3a2a24' }}>Petal Flat</div>
        <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f', marginTop: 4 }}>{fmt(6800)}</div>
        <Link href="/product/1" style={{ marginTop: 14, fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#b8836f', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          Commander <span style={{ display: 'inline-block', width: 20, height: 1, background: '#b8836f' }} />
        </Link>
      </div>

      {/* Slide dots */}
      <div
        className="hero-dots-bar"
        style={{ position: 'absolute', bottom: 80, left: 80, zIndex: 4, display: 'flex', gap: 8 }}
      >
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 28 : 8, height: 4, borderRadius: 2, border: 'none', background: i === slide ? '#b8836f' : 'rgba(184,131,111,0.25)', cursor: 'pointer', transition: 'all 0.4s' }} />
        ))}
      </div>

      {/* Scroll cue */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.5 }}>
        <span style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.3em', color: '#b8836f', textTransform: 'uppercase' }}>Défiler</span>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom,#b8836f,transparent)' }} />
      </div>

      {/* Marquee */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4, borderTop: '1px solid rgba(184,131,111,0.1)', background: 'rgba(250,246,241,0.8)', backdropFilter: 'blur(8px)', padding: '11px 0', overflow: 'hidden' }}>
        <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {Array(4).fill(marqueeItems).flat().map((t, i) => (
            <span key={i} style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.28em', color: '#c9a090', padding: '0 32px', textTransform: 'uppercase' }}>
              {t}<span style={{ marginLeft: 32, color: '#dbbba8' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
