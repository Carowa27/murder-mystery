import { AccusationPhoto } from '@/app/components/AccusationPhoto';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const InvestigationPage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  const cookieStore = await cookies();

  // Bryt ut headers för att använda den i byta concurrent fetches
  const headers = { Cookie: cookieStore.toString() };

  // Nu när vi hämtar från can_accuse också kan vi göra det concurrent som i can_accuse routen
  const [officeRes, accuseRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/office`, {
      headers,
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/can_accuse`, {
      headers,
      cache: 'no-store',
    }),
  ]);

  const officeData = await officeRes.json();
  const accuseData = await accuseRes.json();
  // Utan alla nyckelledtrådar skickas man till kontoret, även om man skriver adressen själv.
  if (!accuseData.all_keys_found) {
    redirect(`/investigation/${investigationId}/office`);
  }

  const characters: IGameCharacter[] = officeData.characters;

  return (
    <div className="min-h-[calc(100vh-64px-80px)] flex flex-col bg-[url(/images/backgrounds/accusation-bg.png)] bg-center bg-no-repeat bg-cover">
      <div className="flex justify-center pt-6">
        <p className="rounded bg-background/80 px-4 py-2 border border-gold/30 font-label text-xs uppercase tracking-widest text-gold">
          Anklagelser: {accuseData.accusations_made}/{accuseData.max_accusations}
        </p>
      </div>
      <section className="w-[90%] flex flex-wrap flex-1 justify-center items-center gap-2 mx-auto mb-10">
        {characters.map((c, i) => c.is_victim === false && <AccusationPhoto key={i} c={c} />)}
      </section>
    </div>
  );
};
export default InvestigationPage;
