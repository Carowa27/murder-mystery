'use client';

import { useEffect, useState } from 'react';

// Skulle kunna byggas från typerna i database.types.ts men det är enklare att bara skriva ut vad som behövs här.
interface IReceipt {
  product: string;
  amount: number;
  created_at: string;
  cases: { title: string } | null;
  receipts: { receipt_number: string } | null;
}

// Kvittona på profilsidan. Det senaste syns direkt, Visa alla fäller ut resten.
export const ReceiptList = () => {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [error, setError] = useState('');
  // Denna är för dig Mattias. Eftersom jag missade det i Vikingsås.
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadReceipts() {
      try {
        const res = await fetch('/api/receipts');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setReceipts(data);
      } catch {
        setError('Kunde inte hämta dina kvitton');
      } finally {
        setLoading(false);
      }
    }

    loadReceipts();
  }, []);

  // API:t skickar nyaste först, så det första kvittot är det senaste.
  const shownReceipts = showAll ? receipts : receipts.slice(0, 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="font-label text-xs uppercase tracking-widest text-gold">Kvitton</div>

      {loading && <div className="text-sm text-text-secondary">Hämtar kvitton...</div>}

      {error && <div className="text-sm text-danger">{error}</div>}

      {!loading && !error && receipts.length === 0 && (
        <div className="text-sm text-text-secondary">Du har inga kvitton än.</div>
      )}

      {receipts.length > 0 && (
        <div className="flex flex-col gap-4 rounded-lg border border-gold/30 bg-surface p-6">
          <ul className="flex flex-col divide-y divide-gold/20">
            {shownReceipts.map((receipt) => (
              <li
                key={receipt.receipts?.receipt_number}
                className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-label text-xs uppercase tracking-widest text-gold">
                    {receipt.receipts?.receipt_number}
                  </div>
                  <div>
                    {receipt.product === 'case' ? receipt.cases?.title : 'Unlimited, en månad'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {new Date(receipt.created_at).toLocaleDateString('sv-SE')}
                  </div>
                </div>
                <div>{receipt.amount} kr</div>
              </li>
            ))}
          </ul>

          {receipts.length > 1 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="self-end text-sm text-gold hover:text-gold-light transition-colors cursor-pointer"
            >
              {showAll ? 'Visa färre' : 'Visa alla'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
