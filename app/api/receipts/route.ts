import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';

// Den inloggades betalda köp med kvitto, nyaste först.
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  const supabase = await createClient();

  // Frågan utgår från payments eftersom det är där user_id finns. RLS släpper
  // igenom allt för admin, så filtret på user_id behövs för att bara få sina egna.
  const { data, error } = await supabase
    .from('payments')
    .select(
      `
      product,
      amount,
      created_at,
      cases ( title ),
      receipts ( receipt_number )
    `
    )
    .eq('user_id', user.sub)
    .eq('status', 'paid')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
