'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((s) => s.items);
  const wishlist = useCartStore((s) => s.wishlist);
  const count = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop', label: 'Collections' },
    { href: '/', label: 'About' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
        background: 'rgba(250,246,241,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(184,131,111,0.12)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "'Cormorant Garamond'",
          fontSize: 30,
          fontWeight: 400,
          letterSpacing: '0.18em',
          color: '#3a2a24',
          textDecoration: 'none',
        }}
      >
        ZYRA
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 36 }}>
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className={`nav-link ${pathname === href ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Icons */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {/* Search */}
        <Link href="/shop" style={{ color: 'inherit' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a7a74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>

        {/* Wishlist */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7a74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {wishlist.length > 0 && <Badge n={wishlist.length} />}
        </div>

        {/* Cart */}
        <Link href="/cart" style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7a74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {count > 0 && <Badge n={count} />}
        </Link>
      </div>
    </nav>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span
      style={{
        position: 'absolute',
        top: -7,
        right: -7,
        background: '#b8836f',
        color: '#fff',
        borderRadius: '50%',
        width: 16,
        height: 16,
        fontSize: 9,
        fontFamily: "'Jost'",
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </span>
  );
}
