'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ICheckoutForm {
  product: string;
  caseId: string;
  price: number;
}

const inputClass =
  'w-full rounded border border-gold/20 bg-background px-3 py-2 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none';
const labelClass = 'flex flex-col gap-1 font-label text-xs uppercase tracking-widest text-muted';

// Tar bort allt som inte är siffror och lägger ett mellanslag efter var fjärde
// siffra, så att 42424242 blir 4242 4242.
function formatCardNumber(value: string) {
  // Tar bort allt som inte är siffror och tar bara de första 16 siffrorna.
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups: string[] = [];

  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }

  return groups.join(' ');
}

// Lägger in snedstrecket när månaden är skriven, så att 1228 blir 12/28.
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// Betalningen är fejkad. Kortuppgifterna skickas aldrig någonstans, fälten
// finns bara för att köpet ska kännas som ett riktigt köp. Webbläsaren
// kontrollerar formatet med required och pattern.
export const CheckoutForm = ({ product, caseId, price }: ICheckoutForm) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, caseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setReceiptNumber(data.receiptNumber);
    } catch {
      setError('Något gick fel, försök igen');
    } finally {
      setLoading(false);
    }
  }

  // Bekräftelsen visas i stället för formuläret när köpet är klart.
  if (receiptNumber) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-gold">Tack för ditt köp</h2>
        <p>Kvittonummer: {receiptNumber}</p>
        <Link href="/profile/receipts" className="text-gold hover:text-gold-light">
          Se dina kvitton
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className={labelClass}>
        Namn på kortet
        <input required autoComplete="off" className={inputClass} />
      </label>

      <label className={labelClass}>
        Kortnummer
        <input
          required
          inputMode="numeric"
          pattern="[0-9 ]{16,19}"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          autoComplete="off"
          className={inputClass}
        />
      </label>

      <div className="flex gap-4">
        <label className={labelClass}>
          Giltigt till
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{2}/[0-9]{2}"
            placeholder="MM/ÅÅ"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            autoComplete="off"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          CVC
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{3}"
            placeholder="123"
            autoComplete="off"
            className={inputClass}
          />
        </label>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded py-2.5 font-label text-sm uppercase tracking-widest text-background bg-btn-primary hover:opacity-90 cursor-pointer disabled:bg-none disabled:bg-btn-disabled disabled:text-btn-disabled-text disabled:cursor-not-allowed"
      >
        {loading ? 'Betalar...' : `Betala ${price} kr`}
      </button>
    </form>
  );
};
