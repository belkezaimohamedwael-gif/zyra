'use client';
import { CSSProperties, ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
  primary?: boolean;
  dark?: boolean;
  full?: boolean;
  sm?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  style?: CSSProperties;
  disabled?: boolean;
}

export default function Btn({ children, primary, dark, full, sm, onClick, type = 'button', style = {}, disabled }: Props) {
  const [h, setH] = useState(false);

  let bg = 'transparent';
  let color = h ? '#b8836f' : '#9a7a74';
  let border = `1px solid ${h ? '#b8836f' : 'rgba(154,122,116,0.35)'}`;
  let shadow = 'none';

  if (primary) {
    bg = h ? '#a07060' : '#b8836f';
    color = '#faf6f1';
    border = 'none';
    shadow = h ? '0 8px 24px rgba(184,131,111,0.3)' : 'none';
  }
  if (dark) {
    bg = h ? '#4a3a34' : '#3a2a24';
    color = '#faf6f1';
    border = 'none';
    shadow = 'none';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: "'Jost'",
        fontSize: sm ? 11 : 12,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: sm ? '11px 24px' : primary || dark ? '16px 44px' : '14px 32px',
        border,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        width: full ? '100%' : 'auto',
        background: bg,
        color,
        boxShadow: shadow,
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
