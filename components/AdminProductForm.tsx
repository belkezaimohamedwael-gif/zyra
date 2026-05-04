'use client';
import { useState, useRef, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Product } from '@/lib/types';

const CATEGORIES = ['Flats', 'Sandals', 'Boots', 'Mules', 'Heels'];
const TAGS = ['', 'New', 'Bestseller'];

interface Props {
  product?: Product;
  mode: 'new' | 'edit';
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.2em', color: '#9a7a74', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(184,131,111,0.25)', background: '#faf6f1', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', outline: 'none', boxSizing: 'border-box' }}
    />
  );
}

export default function AdminProductForm({ product, mode }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(String(product?.price ?? ''));
  const [category, setCategory] = useState(product?.category ?? 'Flats');
  const [tag, setTag] = useState(product?.tag ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [stock, setStock] = useState(product?.stock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [imgUrls, setImgUrls] = useState<string[]>(product?.img_urls ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Colors ──────────────────────────────────────────────
  const addColor = (raw: string) => {
    const c = raw.trim();
    if (c && !colors.includes(c)) setColors((prev) => [...prev, c]);
    setColorInput('');
  };

  const handleColorKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addColor(colorInput);
    }
  };

  // ── Image upload ─────────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const valid = Array.from(files).filter((f) => allowed.includes(f.type));
    if (!valid.length) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of valid) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from('products').upload(path, file, { cacheControl: '3600', upsert: false });
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path);
        setImgUrls((prev) => [...prev, publicUrl]);
      }
    }
    setUploading(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const handleDeleteImg = async (url: string, idx: number) => {
    const supabase = createClient();
    const pathPart = url.split('/storage/v1/object/public/products/')[1];
    if (pathPart) await supabase.storage.from('products').remove([pathPart]);
    setImgUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveImg = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= imgUrls.length) return;
    setImgUrls((prev) => {
      const a = [...prev];
      [a[idx], a[next]] = [a[next], a[idx]];
      return a;
    });
  };

  // ── Save ─────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Requis';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Prix invalide';
    if (!description.trim()) e.description = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const supabase = createClient();
    const payload = {
      name: name.trim(),
      price: Number(price),
      category,
      tag,
      description: description.trim(),
      colors,
      img_urls: imgUrls,
      stock,
      featured,
    };

    if (mode === 'new') {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { showToast(`Erreur: ${error.message}`); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', product!.id);
      if (error) { showToast(`Erreur: ${error.message}`); setSaving(false); return; }
    }

    showToast(mode === 'new' ? 'Produit créé !' : 'Produit mis à jour !');
    setTimeout(() => router.push('/admin/products'), 900);
  };

  const fieldStyle = { marginBottom: 24 };
  const selectStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1px solid rgba(184,131,111,0.25)', background: '#faf6f1', fontFamily: "'Jost'", fontSize: 13, color: '#3a2a24', outline: 'none', cursor: 'pointer' };
  const toggleRow = (label: string, checked: boolean, set: (v: boolean) => void) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(184,131,111,0.08)' }}>
      <span style={{ fontFamily: "'Jost'", fontSize: 12, color: '#7a5a54', letterSpacing: '0.08em' }}>{label}</span>
      <button
        type="button"
        onClick={() => set(!checked)}
        style={{ width: 42, height: 24, borderRadius: 12, background: checked ? '#b8836f' : 'rgba(184,131,111,0.18)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}
      >
        <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: checked ? 21 : 3, transition: 'left 0.22s', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: '44px 52px', maxWidth: 860 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#3a2a24', color: '#f0e6d8', padding: '14px 24px', fontFamily: "'Jost'", fontSize: 13, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'Jost'", fontSize: 10, letterSpacing: '0.35em', color: '#c9a090', textTransform: 'uppercase', marginBottom: 10 }}>
          {mode === 'new' ? 'Nouveau Produit' : 'Modifier le Produit'}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 44, fontWeight: 300, color: '#3a2a24' }}>
          {mode === 'new' ? 'Ajouter un Produit' : (product?.name ?? 'Modifier')}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 36px' }}>
        {/* Name */}
        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <Label>Nom <span style={{ color: '#b8836f' }}>*</span></Label>
          <Input value={name} onChange={setName} placeholder="Ex : Petal Flat" />
          {errors.name && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.name}</div>}
        </div>

        {/* Price */}
        <div style={fieldStyle}>
          <Label>Prix (DA) <span style={{ color: '#b8836f' }}>*</span></Label>
          <Input value={price} onChange={setPrice} placeholder="6800" type="number" />
          {errors.price && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.price}</div>}
        </div>

        {/* Category */}
        <div style={fieldStyle}>
          <Label>Catégorie</Label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tag */}
        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <Label>Tag</Label>
          <select value={tag} onChange={(e) => setTag(e.target.value)} style={{ ...selectStyle, width: 'auto', minWidth: 180 }}>
            <option value="">Aucun</option>
            <option value="New">New</option>
            <option value="Bestseller">Bestseller</option>
          </select>
        </div>

        {/* Description */}
        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <Label>Description <span style={{ color: '#b8836f' }}>*</span></Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le produit..."
            rows={4}
            style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(184,131,111,0.25)', background: '#faf6f1', fontFamily: "'Jost'", fontSize: 14, color: '#3a2a24', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
          />
          {errors.description && <div style={{ fontFamily: "'Jost'", fontSize: 11, color: '#c0392b', marginTop: 4 }}>{errors.description}</div>}
        </div>

        {/* Colors */}
        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <Label>Couleurs</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {colors.map((c) => (
              <span key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(184,131,111,0.1)', fontFamily: "'Jost'", fontSize: 12, color: '#7a5a54' }}>
                {c}
                <button type="button" onClick={() => setColors((prev) => prev.filter((x) => x !== c))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b8836f', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={handleColorKey}
              placeholder="Ivory, Blush… puis Entrée"
              style={{ flex: 1, padding: '10px 14px', border: '1px solid rgba(184,131,111,0.25)', background: '#faf6f1', fontFamily: "'Jost'", fontSize: 13, color: '#3a2a24', outline: 'none' }}
            />
            <button type="button" onClick={() => addColor(colorInput)} style={{ padding: '10px 18px', background: 'rgba(184,131,111,0.12)', border: 'none', cursor: 'pointer', fontFamily: "'Jost'", fontSize: 11, letterSpacing: '0.12em', color: '#b8836f', textTransform: 'uppercase' }}>
              Ajouter
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          {toggleRow('En stock', stock, setStock)}
          {toggleRow('Produit vedette (affiché en page d\'accueil)', featured, setFeatured)}
        </div>

        {/* Image upload */}
        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <Label>Images <span style={{ color: '#9a7a74', fontSize: 9, letterSpacing: '0.1em' }}>(JPG / PNG / WEBP — première image = visuel principal)</span></Label>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#b8836f' : 'rgba(184,131,111,0.3)'}`,
              background: dragOver ? 'rgba(184,131,111,0.06)' : '#faf6f1',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: 16,
            }}
          >
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: 'none' }} onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); }} />
            {uploading ? (
              <div style={{ fontFamily: "'Jost'", fontSize: 13, color: '#b8836f', letterSpacing: '0.1em' }}>Téléversement en cours...</div>
            ) : (
              <>
                <div style={{ fontSize: 28, marginBottom: 10, color: '#c9a090' }}>⊕</div>
                <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a7a74', letterSpacing: '0.1em' }}>Glissez vos images ici ou cliquez pour parcourir</div>
              </>
            )}
          </div>

          {/* Previews */}
          {imgUrls.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {imgUrls.map((url, i) => (
                <div key={url} style={{ position: 'relative', width: 90, flexShrink: 0 }}>
                  <div style={{ width: 90, height: 112, overflow: 'hidden', background: '#ede5da', position: 'relative', border: i === 0 ? '2px solid #b8836f' : '1px solid rgba(184,131,111,0.2)' }}>
                    <Image src={url} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                    {i === 0 && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#b8836f', fontFamily: "'Jost'", fontSize: 8, letterSpacing: '0.15em', color: '#fff', textAlign: 'center', padding: '3px 0', textTransform: 'uppercase' }}>Principal</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, justifyContent: 'center' }}>
                    <button type="button" onClick={() => moveImg(i, -1)} disabled={i === 0} style={{ padding: '3px 7px', background: 'rgba(184,131,111,0.1)', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: '#b8836f', fontSize: 10, opacity: i === 0 ? 0.35 : 1 }}>◀</button>
                    <button type="button" onClick={() => moveImg(i, 1)} disabled={i === imgUrls.length - 1} style={{ padding: '3px 7px', background: 'rgba(184,131,111,0.1)', border: 'none', cursor: i === imgUrls.length - 1 ? 'default' : 'pointer', color: '#b8836f', fontSize: 10, opacity: i === imgUrls.length - 1 ? 0.35 : 1 }}>▶</button>
                    <button type="button" onClick={() => handleDeleteImg(url, i)} style={{ padding: '3px 7px', background: 'rgba(192,57,43,0.08)', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: 10 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '14px 40px', background: saving ? '#c9a090' : '#b8836f', border: 'none', color: '#fff', fontFamily: "'Jost'", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.25s' }}
        >
          {saving ? 'Sauvegarde...' : mode === 'new' ? 'Créer le Produit' : 'Enregistrer les Modifications'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          style={{ padding: '14px 28px', background: 'transparent', border: '1px solid rgba(184,131,111,0.3)', color: '#9a7a74', fontFamily: "'Jost'", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
