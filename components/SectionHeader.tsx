'use client';
import { useReveal } from '@/hooks/useReveal';

interface Props {
  eyebrow: string;
  title: string;
  center?: boolean;
}

export default function SectionHeader({ eyebrow, title, center = false }: Props) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ textAlign: center ? 'center' : 'left' }}>
      <div style={{
        fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.4em', color: '#c9a090',
        textTransform: 'uppercase', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 12,
        justifyContent: center ? 'center' : 'flex-start',
      }}>
        {!center && <span style={{ width: 24, height: 1, background: '#c9a090', display: 'inline-block' }} />}
        {eyebrow}
        {center && <span style={{ width: 24, height: 1, background: '#c9a090', display: 'inline-block' }} />}
      </div>
      <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 'clamp(34px,4vw,54px)', fontWeight: 300, color: '#3a2a24', lineHeight: 1.05 }}>
        {title}
      </h2>
    </div>
  );
}
