'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { fmt } from '@/lib/data';

type Status = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface DbOrder {
  id: number;
  order_num: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  address: string;
  wilaya: string;
  city: string;
  notes: string | null;
  items: CartItem[];
  total: number;
  status: Status;
  created_at: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
  img_urls?: string[];
  selectedSize: number | null;
  selectedColor: string;
}

const STATUS_LABELS: Record<Status, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<Status, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(212,129,58,0.12)',  color: '#c47830' },
  confirmed: { bg: 'rgba(59,130,246,0.1)',   color: '#2563eb' },
  shipped:   { bg: 'rgba(139,92,246,0.1)',   color: '#7c3aed' },
  delivered: { bg: 'rgba(34,197,94,0.1)',    color: '#16a34a' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',    color: '#dc2626' },
};

const FILTERS: { key: Status | 'all'; label: string }[] = [
  { key: 'all',       label: 'Toutes' },
  { key: 'pending',   label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'shipped',   label: 'Expédiées' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

const NEXT_STATUS: Partial<Record<Status, Status[]>> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped:   ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as DbOrder[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    // Realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prev) => [payload.new as DbOrder, ...prev]);
          showToast('🔔 Nouvelle commande reçue !');
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const updateStatus = async (id: number, status: Status) => {
    const supabase = createClient();
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      showToast('Statut mis à jour.');
    }
  };

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' });

  const Badge = ({ status }: { status: Status }) => {
    const s = STATUS_COLORS[status];
    return (
      <span style={{ background: s.bg, color: s.color, fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 2, whiteSpace: 'nowrap' }}>
        {STATUS_LABELS[status]}
      </span>
    );
  };

  return (
    <div style={{ padding: '44px 52px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#3a2a24', color: '#f0e6d8', padding: '14px 24px', fontFamily: "'Jost'", fontSize: 13, letterSpacing: '0.08em', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.35em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 10 }}>Gestion</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 44, fontWeight: 300, color: '#3a2a24' }}>Commandes</h1>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 18px', border: 'none', cursor: 'pointer', fontFamily: "'Jost'", fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s',
              background: filter === f.key ? '#b8836f' : 'rgba(184,131,111,0.1)',
              color: filter === f.key ? '#fff' : '#9a7a74',
            }}
          >
            {f.label}
            {f.key !== 'all' && (
              <span style={{ marginLeft: 6, opacity: 0.7 }}>
                ({orders.filter((o) => o.status === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#9a7a74', padding: '40px 0' }}>Chargement...</div>
      ) : visible.length === 0 ? (
        <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#9a7a74', padding: '40px 0' }}>Aucune commande dans cette catégorie.</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid rgba(184,131,111,0.1)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 130px 110px 60px 120px 130px 40px', padding: '12px 20px', borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
            {['Commande', 'Client', 'Wilaya', 'Total', 'Articles', 'Statut', 'Date', ''].map((h) => (
              <div key={h} style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: '0.2em', color: '#9a7a74', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {visible.map((order) => (
            <div key={order.id}>
              {/* Row */}
              <div
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                style={{ display: 'grid', gridTemplateColumns: '140px 1fr 130px 110px 60px 120px 130px 40px', padding: '14px 20px', borderBottom: '1px solid rgba(184,131,111,0.06)', cursor: 'pointer', background: expanded === order.id ? 'rgba(184,131,111,0.04)' : 'transparent', alignItems: 'center', transition: 'background 0.15s' }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 15, color: '#b8836f', letterSpacing: '0.05em' }}>{order.order_num}</div>
                <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#3a2a24' }}>{order.first_name} {order.last_name}</div>
                <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#7a5a54' }}>{order.wilaya}</div>
                <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f' }}>{fmt(order.total)}</div>
                <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74' }}>{order.items?.length ?? 0}</div>
                <div><Badge status={order.status} /></div>
                <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#9a7a74' }}>{formatDate(order.created_at)}</div>
                <div style={{ fontFamily: "'Jost'", fontSize: 14, color: '#c9a090', textAlign: 'center' }}>
                  {expanded === order.id ? '▲' : '▼'}
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === order.id && (
                <div style={{ padding: '24px 24px 28px', background: '#fdfaf7', borderBottom: '1px solid rgba(184,131,111,0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 24 }}>
                    {/* Delivery info */}
                    <div>
                      <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 14 }}>Livraison</div>
                      {[
                        ['Téléphone', order.phone],
                        ['Email', order.email || '—'],
                        ['Adresse', order.address],
                        ['Wilaya', order.wilaya],
                        ['Commune', order.city],
                        ['Notes', order.notes || '—'],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                          <span style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', letterSpacing: '0.1em', textTransform: 'uppercase', width: 80, flexShrink: 0 }}>{k}</span>
                          <span style={{ fontFamily: "'Jost'", fontSize: 13, color: '#3a2a24', fontWeight: 300 }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status change */}
                    <div>
                      <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 14 }}>Changer le Statut</div>
                      <div style={{ marginBottom: 12 }}><Badge status={order.status} /></div>
                      {(NEXT_STATUS[order.status] ?? []).length > 0 ? (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {(NEXT_STATUS[order.status] ?? []).map((s) => (
                            <button
                              key={s}
                              onClick={(e) => { e.stopPropagation(); updateStatus(order.id, s); }}
                              style={{ padding: '8px 16px', background: STATUS_COLORS[s].bg, border: `1px solid ${STATUS_COLORS[s].color}30`, cursor: 'pointer', color: STATUS_COLORS[s].color, fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}
                            >
                              → {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74' }}>Statut final — aucune action disponible.</div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 14 }}>Articles commandés</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(order.items ?? []).map((item, i) => {
                      const imgSrc = item.img || item.img_urls?.[0] || '';
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: '#fff', border: '1px solid rgba(184,131,111,0.08)' }}>
                          <div style={{ width: 44, height: 56, overflow: 'hidden', background: '#ede5da', position: 'relative', flexShrink: 0 }}>
                            {imgSrc && <Image src={imgSrc} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 17, color: '#3a2a24' }}>{item.name}</div>
                            {item.selectedSize && (
                              <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c9a090', marginTop: 2 }}>
                                EU {item.selectedSize}{item.selectedColor ? ` · ${item.selectedColor}` : ''} · ×{item.qty}
                              </div>
                            )}
                          </div>
                          <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f' }}>{fmt(item.price * item.qty)}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(184,131,111,0.1)' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, color: '#b8836f' }}>Total : {fmt(order.total)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
