'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNoteForm({ investigationId }: { investigationId: string }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/investigations/${investigationId}/notes/createNote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // För att inte ändra i Carolinas createNote route utelämnas clue_id medvetet. Att skicka null på denna ger 404
        // Men att utelämna fältet helt fungerar och skapar en anteckning utan kopplad ledtråd
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Något gick fel');
      }

      setContent('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Skriv en anteckning..."
        rows={2}
        className="flex-1 rounded bg-background/80 border border-gold/30 text-text-primary placeholder:text-text-secondary/50 px-3 py-2 text-xl font-handwritten resize-none focus:outline-none focus:border-gold/60"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        // Fixed width och height så att knappen inte byter form när "Spara" ändras till "..."
        className="rounded px-4 py-2 min-w-[5.5rem] h-9 font-label text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed self-end"
        style={{ backgroundImage: 'var(--btn-primary)' }}
      >
        {/* Återanvänd vår three pulsing dots animation! */}
        {loading ? (
          <span className="inline-flex">
            <span className="animate-dot-blink" style={{ animationDelay: '0s' }}>
              .
            </span>
            <span className="animate-dot-blink" style={{ animationDelay: '0.2s' }}>
              .
            </span>
            <span className="animate-dot-blink" style={{ animationDelay: '0.4s' }}>
              .
            </span>
          </span>
        ) : (
          'Spara'
        )}
      </button>
      {error && <p className="text-danger text-xs">{error}</p>}
    </form>
  );
}
