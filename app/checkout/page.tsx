import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { CheckoutForm } from '@/app/components/CheckoutForm';

// Kassan nås via en länk, till exempel /checkout?product=case&caseId=...
// eller /checkout?product=unlimited_month. Sidan visar vad som köps och vad
// det kostar. Själva köpet görs i CheckoutForm.
export default async function CheckoutPage(props: PageProps<'/checkout'>) {
  const params = await props.searchParams;

  // Next ger varje värde i länken som string, string[] eller undefined.
  // Vi godtar bara en vanlig sträng, allt annat blir ''.
  const product = typeof params.product === 'string' ? params.product : '';
  const caseId = typeof params.caseId === 'string' ? params.caseId : '';

  const supabase = await createClient();

  let name = '';
  let price = 0;
  let imageUrl: string | null = null;

  if (product === 'case' && caseId) {
    const { data } = await supabase
      .from('cases')
      .select('title, price, image_url')
      .eq('id', caseId)
      .maybeSingle();

    if (data) {
      name = data.title;
      price = data.price;
      imageUrl = data.image_url;
    }
  } else if (product === 'unlimited_month') {
    const { data } = await supabase
      .from('subscription_plans')
      .select('name, price, duration_days')
      .eq('code', product)
      .maybeSingle();

    if (data) {
      name = `${data.name}, ${data.duration_days} dagar`;
      price = data.price;
    }
  }

  if (!name) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p>Det finns inget att köpa här.</p>
        <Link href="/shop" className="text-gold hover:text-gold-light">
          Tillbaka till butiken
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-sm border border-gold/30 rounded-lg bg-surface p-8">
        <h1 className="text-center text-gold mb-6">Kassa</h1>

        {product === 'case' &&
          (imageUrl !== null ? (
            <Image
              src={imageUrl}
              alt={name}
              width={320}
              height={320}
              className="w-full h-auto rounded mb-6"
            />
          ) : (
            <div className="w-full aspect-square rounded bg-muted mb-6"></div>
          ))}

        <div className="flex justify-between border-b border-gold/20 pb-4 mb-6">
          <span>{name}</span>
          <span>{price} kr</span>
        </div>

        <CheckoutForm product={product} caseId={caseId} price={price} />
      </div>
    </div>
  );
}
