'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push('/');
  }

  return (
    <div className="w-full max-w-sm border border-gold/30 rounded-lg bg-surface p-8">
      <h1 className="text-center text-gold mb-2">Logga in</h1>
      <p className="text-center text-text-secondary text-sm mb-8">Välkommen tillbaka, detektiv</p>

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
            className="w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
            placeholder="********"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded py-2.5 font-label text-sm uppercase tracking-widest text-background bg-btn-primary disabled:bg-btn-disabled disabled:text-btn-disabled-text transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundImage: loading ? 'none' : 'var(--btn-primary)' }}
        >
          {loading ? 'Loggar in...' : 'Logga in'}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Inget konto?{' '}
        <Link href="/register" className="text-gold hover:text-gold-light transition-colors">
          Registrera dig
        </Link>
      </p>
    </div>
  );
}
