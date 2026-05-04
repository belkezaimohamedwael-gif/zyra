import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, phone, email, address, wilaya, city, notes, items, total } = body;

  if (!firstName || !lastName || !phone || !address || !wilaya || !city || !items) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }

  if (!/^0[5-7]\d{8}$/.test((phone as string).replace(/\s/g, ''))) {
    return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const orderNum = 'ZYR-' + Math.floor(100000 + Math.random() * 900000);

  const { error } = await supabase.from('orders').insert({
    order_num: orderNum,
    first_name: firstName,
    last_name: lastName,
    phone: (phone as string).replace(/\s/g, ''),
    email: email || null,
    address,
    wilaya,
    city,
    notes: notes || null,
    items,
    total,
    status: 'pending',
  });

  if (error) {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }

  return NextResponse.json({ orderNum });
}
