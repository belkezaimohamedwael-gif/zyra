'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { fmt } from '@/lib/data';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [
        { count: products },
        { count: pending },
        { data: orders },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('total').neq('status', 'cancelled'),
      ]);
      const revenue = orders?.reduce((s: number, o: { total: number }) => s + o.total, 0) ?? 0;
      setStats({ products: products ?? 0, pending: pending ?? 0, revenue });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: 'Produits en catalogue', value: loading ? '—' : String(stats.products), href: '/admin/products', accent: '#b8836f' },
    { label: 'Commandes en attente', value: loading ? '—' : String(stats.pending), href: '/admin/orders', accent: '#c47830' },
    { label: "Chiffre d'affaires", value: loading ? '—' : fmt(stats.revenue), href: '/admin/orders', accent: '#5a8a6a' },
  ];

  return (
    <div style={{ padding: '44px 52px' }}>
      <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.35em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 10 }}>Vue d&apos;ensemble</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 44, fontWeight: 300, color: '#3a2a24', marginBottom: 44 }}>Tableau de Bord</h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 52 }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} style={{ textDecoration: 'none', background: '#fff', padding: '32px 28px', border: '1px solid rgba(184,131,111,0.1)', display: 'block' }}>
            <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 14 }}>{c.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 44, fontWeight: 300, color: c.accent }}>{c.value}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.25em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 18 }}>Actions Rapides</div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Link href="/admin/products/new" style={{ padding: '13px 28px', background: '#b8836f', color: '#fff', textDecoration: 'none', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          + Ajouter un Produit
        </Link>
        <Link href="/admin/products" style={{ padding: '13px 28px', border: '1px solid rgba(184,131,111,0.3)', color: '#b8836f', textDecoration: 'none', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Gérer les Produits
        </Link>
        <Link href="/admin/orders" style={{ padding: '13px 28px', border: '1px solid rgba(184,131,111,0.3)', color: '#b8836f', textDecoration: 'none', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Voir les Commandes
        </Link>
      </div>
    </div>
  );
}
