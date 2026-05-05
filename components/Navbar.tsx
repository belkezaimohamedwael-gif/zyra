'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const wishlist = useCartStore((s) => s.wishlist);
  const count = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop', label: 'Collections' },
    { href: '/', label: 'About' },
  ];

  return (
    <>
      <nav
        className="nav-bar"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 500,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px',
          background: 'rgba(250,246,241,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
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

        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 36 }}>
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

        {/* Right icons */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {/* Search — desktop only */}
          <Link href="/shop" className="hide-mobile" style={{ color: 'inherit', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a7a74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          {/* Wishlist — desktop only */}
          <div className="hide-mobile" style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7a74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </div>

          {/* Cart — always visible */}
          <Link href="/cart" style={{ position: 'relative', cursor: 'pointer', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a7a74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && <Badge n={count} />}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#7a5a54" strokeWidth="1.5" strokeLinecap="round">
              <line x1="0" y1="1" x2="22" y2="1" />
              <line x1="0" y1="8" x2="17" y2="8" />
              <line x1="0" y1="15" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div className={`nav-backdrop${open ? ' open' : ''}`} onClick={() => setOpen(false)} />

      {/* Mobile drawer */}
      <div className={`nav-drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid rgba(184,131,111,0.1)',
          flexShrink: 0,
        }}>
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, letterSpacing: '0.18em', color: '#3a2a24', textDecoration: 'none' }}>
            ZYRA
          </Link>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', color: '#9a7a74' }}
            aria-label="Fermer le menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <nav style={{ padding: '12px 28px', flex: 1 }}>
          {links.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
              style={{
                textDecoration: 'none',
                display: 'block',
                padding: '15px 0',
                fontSize: 13,
                letterSpacing: '0.2em',
                borderBottom: '1px solid rgba(184,131,111,0.08)',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer — search + wishlist */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid rgba(184,131,111,0.1)',
          display: 'flex',
          gap: 28,
          flexShrink: 0,
        }}>
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a7a74', textDecoration: 'none' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Rechercher
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a7a74', position: 'relative' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Favoris
            {wishlist.length > 0 && <span style={{ marginLeft: 4, background: '#b8836f', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontFamily: "'Jost'", fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{wishlist.length}</span>}
          </div>
        </div>
      </div>
    </>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span
      style={{
        position: 'absolute',
        top: -7, right: -7,
        background: '#b8836f',
        color: '#fff',
        borderRadius: '50%',
        width: 16, height: 16,
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
