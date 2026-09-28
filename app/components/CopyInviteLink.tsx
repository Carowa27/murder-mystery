'use client'; // Must be a client component since it uses useState

import { useState } from 'react';

export default function CopyInviteLink({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // We use window.location.origin instead of NEXT_PUBLIC_SITE_URL to avoid another env variable
    // windows is only available on the client and this runs only on the client for now anyway
    const url = `${window.location.origin}/join/${inviteCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-background/80 px-6 py-3 rounded-lg border border-gold/30">
      <span className="font-label text-sm uppercase tracking-widest text-gold font-bold">
        Room Code: {inviteCode}
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
