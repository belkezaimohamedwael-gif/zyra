'use client';
import Link from 'next/link';

export default function Footer() {
  const cols = [
    { title: 'Boutique', links: [['Nouvelles Arrivées', '/shop'], ['Meilleures Ventes', '/shop'], ['Sandales', '/shop'], ['Bottes', '/shop']] },
    { title: 'Info', links: [['Notre Histoire', '/'], ['Guide des Tailles', '/'], ['Retours', '/'], ['Contact', '/']] },
    { title: 'Aide', links: [['FAQ', '/'], ['Livraison', '/'], ['Paiement', '/'], ['Nous Contacter', '/']] },
  ];

  return (
    <footer className="footer-outer" style={{ background: '#2a1e1a', padding: '60px 80px 36px' }}>
      <div className="footer-grid">
        <div className="footer-brand-col">
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 32, color: '#faf6f1', letterSpacing: '0.16em', marginBottom: 16 }}>ZYRA</div>
          <p style={{ fontFamily: "'Jost'", fontWeight: 300, fontSize: 13, color: 'rgba(250,246,241,0.3)', lineHeight: 1.8, maxWidth: 220 }}>
            Chaussures féminines · Livraison partout en Algérie · Paiement à la livraison
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.25em', color: '#c9a090', marginBottom: 20, textTransform: 'uppercase' }}>{col.title}</div>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} style={{ display: 'block', fontFamily: "'Jost'", fontSize: 13, color: 'rgba(250,246,241,0.28)', marginBottom: 10, textDecoration: 'none', fontWeight: 300 }}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div
        className="footer-bottom-row"
        style={{ borderTop: '1px solid rgba(201,160,144,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between' }}
      >
        <span style={{ fontFamily: "'Jost'", fontSize: 11, color: 'rgba(201,160,144,0.3)' }}>© 2026 ZYRA Algeria. Tous droits réservés.</span>
        <span style={{ fontFamily: "'Jost'", fontSize: 11, color: 'rgba(201,160,144,0.3)' }}>Alger · Algérie 🇩🇿</span>
      </div>
    </footer>
  );
}
