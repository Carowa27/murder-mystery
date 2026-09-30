'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, display_name: displayName }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // Precis som i login kör vi här `window.location.assign('/')` istället för
    // `router.push()` + `router.refresh()` vilket fastnande på Vercel.
    window.location.assign('/');
  }

  return (
    <div className="w-full max-w-sm border border-gold/30 rounded-lg bg-surface p-8">
      <h1 className="text-center text-gold mb-2">Registrera dig</h1>
      <p className="text-center text-text-secondary text-sm mb-8">Skapa ditt detektivkonto</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-label text-xs uppercase tracking-widest text-muted"
          >
            E-postadress
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
            placeholder="din@epost.se"
          />
        </div>

        {/* Den enda "Frontend validation" vi gör just nu är browser native (required, type="email" och minLength) */}
        {/* Ingen frontend check på password där vi skriver i den ena, tar bort fokus från det fältet och det andra
        helt plötsligt är rött och skriker på oss */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="font-label text-xs uppercase tracking-widest text-muted"
          >
            Lösenord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
            placeholder="********"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm-password"
            className="font-label text-xs uppercase tracking-widest text-muted"
          >
            Bekräfta lösenord
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
            placeholder="********"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="display-name"
            className="font-label text-xs uppercase tracking-widest text-muted"
          >
            Visningsnamn
          </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
            placeholder="Detektiv Nattuggla"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded py-2.5 font-label text-sm uppercase tracking-widest text-background bg-btn-primary disabled:bg-btn-disabled disabled:text-btn-disabled-text transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundImage: loading ? 'none' : 'var(--btn-primary)' }}
        >
          {loading ? 'Skapar konto...' : 'Skapa konto'}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Har du redan ett konto?{' '}
        <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
          Logga in
        </Link>
      </p>
    </div>
  );
}
