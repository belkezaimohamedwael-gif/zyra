'use client';
import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const NAV = [
  { href: '/admin', label: 'Tableau de Bord', icon: '◈' },
  { href: '/admin/products', label: 'Produits', icon: '◎' },
  { href: '/admin/orders', label: 'Commandes', icon: '◉' },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Jost'" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#3a2a24', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, color: '#f0e6d8', letterSpacing: '0.08em' }}>ZYRA</div>
          <div style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: '0.35em', color: 'rgba(240,230,216,0.4)', textTransform: 'uppercase', marginTop: 3 }}>Administration</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {NAV.map((item) => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', marginBottom: 4,
                  textDecoration: 'none', borderRadius: 6,
                  background: active ? 'rgba(184,131,111,0.15)' : 'transparent',
                  borderLeft: `2px solid ${active ? '#b8836f' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 13, color: active ? '#d4a090' : 'rgba(240,230,216,0.4)' }}>{item.icon}</span>
                <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: active ? '#f0e6d8' : 'rgba(240,230,216,0.5)' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 6 }}
          >
            <span style={{ fontSize: 14, color: 'rgba(240,230,216,0.35)' }}>⎋</span>
            <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,230,216,0.4)' }}>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 220, background: '#f5efe8', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
