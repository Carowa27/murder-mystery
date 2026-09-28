'use client'; // Must be a client component since it uses useState

import { useState } from 'react';

export default function CopyInviteLink({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/join/${inviteCode}`;

    // Clipboard API kräver tydligen HTTPS! På LAN (http://192.168...) blir navigator.clipboard undefined.
    // Lösning: fallback med execCommand! Vilket fungerar även utan HTTPS. Även med deprecated varningar!
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-background/80 px-6 py-3 rounded-lg border border-gold/30">
      <span className="font-label text-sm uppercase tracking-widest text-gold font-bold">
        Team Kod: {inviteCode}
      </span>
      <button
        onClick={handleCopy}
        className="rounded px-4 py-2 font-label text-xs uppercase tracking-widest text-background bg-btn-primary transition-opacity hover:opacity-90 cursor-pointer"
        style={{ backgroundImage: 'var(--btn-primary)' }}
      >
        {copied ? 'Kopierad!' : 'Kopiera inbjudningslänk'}
      </button>
    </div>
  );
}
