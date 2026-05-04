export const dynamic = 'force-dynamic';

import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { FEATURES, PHOTOS } from '@/lib/data';
import { getFeaturedProducts, getProducts } from '@/lib/products';

export default async function Home() {
  const [featured, all] = await Promise.all([getFeaturedProducts(), getProducts()]);
  const bestSellers = featured.slice(0, 3);
  const newArrivals = all.filter((p) => p.tag === 'New').slice(0, 3);

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Best Sellers */}
      <section style={{ background: '#faf6f1', padding: '110px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
          <SectionHeader eyebrow="Les Plus Aimés" title="Meilleures Ventes" />
          <Link href="/shop" style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9a7a74', textDecoration: 'none', borderBottom: '1px solid rgba(154,122,116,0.35)', paddingBottom: 2 }}>Voir Tout →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 36 }}>
          {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
        </div>
      </section>

      {/* Editorial banner */}
      <section style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <Image src={PHOTOS.hero2} alt="" fill style={{ objectFit: 'cover', objectPosition: 'center 25%' }} unoptimized />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(58,42,36,0.72) 0%,rgba(58,42,36,0.1) 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
          <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.4em', color: 'rgba(250,246,241,0.65)', textTransform: 'uppercase', marginBottom: 18 }}>Édition Limitée</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(40px,5vw,76px)', fontWeight: 300, color: '#faf6f1', lineHeight: 1.05, marginBottom: 30 }}>
            La Sélection<br /><em style={{ fontStyle: 'italic', color: '#f0c4b0' }}>Été 2026</em>
          </h2>
          <Link href="/shop" style={{ display: 'inline-block', fontFamily: "'Jost'", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 44px', background: 'rgba(250,246,241,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(250,246,241,0.3)', color: '#faf6f1', textDecoration: 'none', alignSelf: 'flex-start', cursor: 'pointer' }}>
            Découvrir Maintenant
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{ background: '#f5efe8', padding: '110px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
          <SectionHeader eyebrow="Juste Arrivé" title="Nouveautés" />
          <Link href="/shop" style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9a7a74', textDecoration: 'none', borderBottom: '1px solid rgba(154,122,116,0.35)', paddingBottom: 2 }}>Tout Voir →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 36 }}>
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
        </div>
      </section>

      {/* Features strip */}
      <section style={{ background: '#3a2a24', padding: '60px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#f5ede8', letterSpacing: '0.1em', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontFamily: "'Jost'", fontSize: 12, color: 'rgba(245,237,232,0.45)', fontWeight: 300 }}>{f.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
