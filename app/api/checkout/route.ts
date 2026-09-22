import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  const body = await request.json();

  const { product, caseId } = body;

  if (product !== 'case' && product !== 'unlimited_month') {
    return NextResponse.json({ error: 'Okänd produkt' }, { status: 400 });
  }

  if (product === 'case' && typeof caseId !== 'string') {
    return NextResponse.json({ error: 'caseId krävs när produkten är ett fall' }, { status: 400 });
  }

  const supabase = await createClient();

  let amount: number;
  let durationDays: number | null = null;

  if (product === 'case') {
    const { data: mystery } = await supabase
      .from('cases')
      .select('price')
      .eq('id', caseId)
      .maybeSingle();

    if (!mystery) {
      return NextResponse.json({ error: 'Fallet finns inte' }, { status: 404 });
    }
    if (mystery.price === 0) {
      return NextResponse.json(
        { error: 'Fallet är gratis och behöver inte köpas' },
        { status: 400 }
      );
    }

    amount = mystery.price;
  } else {
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('price, duration_days')
      .eq('code', product)
      .maybeSingle();

    if (!plan) {
      return NextResponse.json({ error: 'Abonnemanget saknas' }, { status: 500 });
    }

    amount = plan.price;
    durationDays = plan.duration_days;
  }

  return NextResponse.json({ ok: true, amount, durationDays }, { status: 200 });
}
