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

  return <button onClick={handleCopy}>{copied ? 'Kopierad!' : 'Kopiera inbjudningslänk'}</button>;
}
