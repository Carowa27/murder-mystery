import { Note } from '@/app/components/Note';
import { INotes } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';
import CreateNoteForm from '@/app/components/CreateNoteForm';

const EvidencePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  const cookieStore = await cookies();

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
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <div className="mt-10 w-[calc(0.95*100%)] h-screen">
        <div className="px-6 pt-6">
          <CreateNoteForm investigationId={investigationId} />
        </div>
        <nav className="text-surface flex flex-col ps-10 pt-6 rotate-1 leading-5.5">
          {notes && notes.length > 0 ? (
            notes.map((note, i) => <Note n={note} key={i} />)
          ) : (
            <p className="text-text-secondary text-center text-sm italic">Inga anteckningar än</p>
          )}
        </nav>
      </div>
    </div>
  );
};
export default EvidencePage;
