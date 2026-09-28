import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
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
  let durationDays = 0;

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

    // owns_case svarar ja både när fallet redan är köpt och när man har Unlimited.
    const { data: owns, error: ownsError } = await supabase.rpc('owns_case', {
      p_user_id: user.sub,
      p_case_id: caseId,
    });

    if (ownsError) {
      return NextResponse.json({ error: ownsError.message }, { status: 500 });
    }
    if (owns) {
      return NextResponse.json({ error: 'Du har redan tillgång till fallet' }, { status: 409 });
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

  // Allt nedan här rör pengar och rättigheter. De tabellerna saknar skrivpolicy i RLS
  // med flit, så det görs med service-klienten som går förbi RLS.
  const service = createServiceClient();

  // Betalningen sparas först som pending.
  const { data: payment, error: paymentError } = await service
    .from('payments')
    .insert({
      user_id: user.sub,
      product,
      case_id: product === 'case' ? caseId : null,
      amount,
    })
    .select('id')
    .single();

  if (paymentError || !payment) {
    return NextResponse.json({ error: 'Betalningen kunde inte skapas' }, { status: 500 });
  }

  // Den fejkade betalningen går alltid igenom, så nu får användaren tillgång.
  let accessGiven = false;

  if (product === 'case') {
    // Ett köpt fall ägs för alltid.
    const { error } = await service.from('purchases').insert({
      user_id: user.sub,
      case_id: caseId,
      payment_id: payment.id,
    });

    accessGiven = !error;
  } else {
    // Har man redan Unlimited förlängs det från slutdatumet, annars räknas det från nu.
    const { data: profile } = await service
      .from('profiles')
      .select('unlimited_until')
      .eq('id', user.sub)
      .single();

    const now = new Date();
    const currentEnd = profile?.unlimited_until ? new Date(profile.unlimited_until) : now;
    const newEnd = currentEnd > now ? currentEnd : now;
    newEnd.setDate(newEnd.getDate() + durationDays);

    const { error } = await service
      .from('profiles')
      .update({ unlimited_until: newEnd.toISOString() })
      .eq('id', user.sub);

    accessGiven = !error;
  }

  // Gick det inte att ge tillgång räknas betalningen som misslyckad och
  // det blir inget kvitto. Annars markeras den som betald.
  if (!accessGiven) {
    await service.from('payments').update({ status: 'failed' }).eq('id', payment.id);
    return NextResponse.json({ error: 'Köpet kunde inte genomföras' }, { status: 500 });
  }

  await service.from('payments').update({ status: 'paid' }).eq('id', payment.id);

  // Kvittot. Numret sätts av databasen i formatet "nocturne-000001".
  const { data: receipt, error: receiptError } = await service
    .from('receipts')
    .insert({ payment_id: payment.id })
    .select('receipt_number')
    .single();

  if (receiptError || !receipt) {
    return NextResponse.json({ error: 'Kvittot kunde inte skapas' }, { status: 500 });
  }

  return NextResponse.json({ receiptNumber: receipt.receipt_number }, { status: 201 });
}
