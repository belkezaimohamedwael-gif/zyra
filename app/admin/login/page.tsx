'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 400, padding: '52px 44px', background: '#fff', border: '1px solid rgba(184,131,111,0.15)' }}>
        <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.45em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 18 }}>ZYRA</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 40, fontWeight: 300, color: '#3a2a24', marginBottom: 36 }}>Administration</h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(184,131,111,0.25)', background: '#faf6f1', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.15em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 8 }}>Mot de Passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(184,131,111,0.25)', background: '#faf6f1', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            />
          </div>

          {error && (
            <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#c0392b', marginBottom: 18, padding: '10px 14px', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.15)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: loading ? '#c9a090' : '#b8836f', border: 'none', color: '#fff', fontFamily: "'Jost'", fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s' }}
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
