'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { fmt } from '@/lib/data';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ width: 42, height: 24, borderRadius: 12, background: checked ? '#b8836f' : 'rgba(184,131,111,0.18)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: checked ? 21 : 3, transition: 'left 0.22s', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
    </button>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data.map((row) => ({ ...row, img: row.img_urls?.[0] ?? '' })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id: number, field: 'stock' | 'featured', value: boolean) => {
    const supabase = createClient();
    await supabase.from('products').update({ [field]: value }).eq('id', id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    showToast('Produit supprimé.');
  };

  return (
    <div style={{ padding: '44px 52px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#3a2a24', color: '#f0e6d8', padding: '14px 24px', fontFamily: "'Jost'", fontSize: 13, letterSpacing: '0.08em', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
        <div>
          <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.35em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 10 }}>Catalogue</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 44, fontWeight: 300, color: '#3a2a24' }}>Produits</h1>
        </div>
        <Link href="/admin/products/new" style={{ padding: '13px 24px', background: '#b8836f', color: '#fff', textDecoration: 'none', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          + Ajouter un Produit
        </Link>
      </div>

      {loading ? (
        <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#9a7a74', padding: '40px 0' }}>Chargement...</div>
      ) : products.length === 0 ? (
        <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#9a7a74', padding: '40px 0' }}>Aucun produit. <Link href="/admin/products/new" style={{ color: '#b8836f' }}>Ajouter le premier →</Link></div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid rgba(184,131,111,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
                {['Image', 'Nom', 'Catégorie', 'Prix', 'Tag', 'Stock', 'Vedette', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.18em', color: '#9a7a74', textTransform: 'uppercase', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(184,131,111,0.06)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ width: 40, height: 52, overflow: 'hidden', background: '#ede5da', position: 'relative', flexShrink: 0 }}>
                      {p.img && <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} unoptimized />}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Cormorant Garamond'", fontSize: 18, color: '#3a2a24' }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Jost'", fontSize: 11, color: '#9a7a74', letterSpacing: '0.1em' }}>{p.category}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Jost'", fontSize: 13, color: '#b8836f' }}>{fmt(p.price)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.tag ? (
                      <span style={{ background: p.tag === 'New' ? '#b8836f' : 'rgba(184,131,111,0.1)', color: p.tag === 'New' ? '#fff' : '#b8836f', fontFamily: "'Jost'", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 9px' }}>
                        {p.tag}
                      </span>
                    ) : <span style={{ color: '#c9a090', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Toggle checked={p.stock} onChange={(v) => handleToggle(p.id, 'stock', v)} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Toggle checked={p.featured} onChange={(v) => handleToggle(p.id, 'featured', v)} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                        style={{ padding: '6px 13px', background: 'rgba(184,131,111,0.1)', border: 'none', cursor: 'pointer', fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.12em', color: '#b8836f', textTransform: 'uppercase' }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        style={{ padding: '6px 13px', background: 'rgba(192,57,43,0.07)', border: 'none', cursor: deleting === p.id ? 'not-allowed' : 'pointer', fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.12em', color: '#c0392b', textTransform: 'uppercase' }}
                      >
                        {deleting === p.id ? '...' : 'Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
