import { Note } from '@/app/components/Note';
import { INotes } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/supabase/auth';
import CreateNoteForm from '@/app/components/CreateNoteForm';

const EvidencePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  const cookieStore = await cookies();
  const claims = await getCurrentUser(); // sub i denna är en användares id!

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/notes`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );
  const notes: INotes[] = await res.json();

  return (
    <div className="h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col">
      <div className="px-6 pt-6">
        <CreateNoteForm investigationId={investigationId} />
      </div>
      {/* `flex-1 overflow-y-auto` för att göra vår notes area scrollable, annars fortsätter de under vår gamenav */}
      <nav className="flex-1 overflow-y-auto text-surface flex flex-col ps-10 pt-6 pb-4 rotate-1 leading-5.5">
        {notes && notes.length > 0 ? (
          notes.map((note, i) => <Note n={note} currentUserId={claims?.sub as string} key={i} />)
        ) : (
          <p className="text-text-secondary text-center text-sm italic">Inga anteckningar än</p>
        )}
      </nav>
    </div>
  );
};
export default EvidencePage;
