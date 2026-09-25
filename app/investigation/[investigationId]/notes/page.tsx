import { Note } from '@/app/components/Note';
import { INotes } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';

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
      <div className={`mt-10 w-[calc(0.95*100%)] h-screen`}>
        <nav className="text-surface flex flex-col ps-10 pt-12 rotate-1 leading-5.5">
          {notes && notes.map((note, i) => <Note n={note} key={i} />)}
        </nav>
      </div>
    </div>
  );
};
export default EvidencePage;
