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

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [error, setError] = useState('');
  // Denna är för dig Mattias. Eftersom jag missade det i Vikingsås.
  const [loading, setLoading] = useState(true);

  // Tom lista som andra argument betyder att hämtningen bara görs en gång,
  // när sidan visas första gången.
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

  if (loading) {
    return <p className="py-16 text-center">Hämtar kvitton...</p>;
  }

  if (error) {
    return <p className="py-16 text-center text-danger">{error}</p>;
  }

  if (receipts.length === 0) {
    return <p className="py-16 text-center">Du har inga kvitton än.</p>;
  }

  return (
    <div className="flex flex-col gap-4 py-8">
      <h1 className="text-gold">Kvitton</h1>

      <ul className="flex flex-col gap-3">
        {receipts.map((receipt) => (
          <li
            key={receipt.receipts?.receipt_number}
            className="flex justify-between gap-4 rounded border border-gold/30 bg-surface p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="font-label text-xs uppercase tracking-widest text-muted">
                {receipt.receipts?.receipt_number}
              </span>
              <span>
                {receipt.product === 'case' ? receipt.cases?.title : 'Unlimited, en månad'}
              </span>
              <span className="text-sm text-text-secondary">
                {new Date(receipt.created_at).toLocaleDateString('sv-SE')}
              </span>
            </div>
            <span>{receipt.amount} kr</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
