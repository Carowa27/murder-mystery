import { BackLink } from '@/app/components/BackLink';
import { KeyEvidence } from '@/app/components/KeyEvidence';
import { ScalableImageBox } from '@/app/components/ScalableImageBox';
import { ZoomableImage } from '@/app/components/ZoomableImage';
import { IFoundClues } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';

const EvidenceSpecificPage = async ({
  params,
}: {
  params: Promise<{ investigationId: string; evidenceId: string }>;
}) => {
  const { investigationId, evidenceId } = await params;
  const baseUrl = `/investigation/${investigationId}`;

  const cookieStore = await cookies();

  // Stämplar ledtråden som öppnad och låser upp de ledtrådar som kräver den.
  // Svaret behövs inte här, de nya ledtrådarna syns i Bevismaterial nästa gång listan hämtas.
  await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/evidence/${evidenceId}/open`,
    {
      method: 'POST',
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/evidence/${evidenceId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );

  const evidence: IFoundClues = await res.json();

  const policeDocs = [
    'Brottsplatsrapport',
    'Polisrapport',
    'Obduktionsrapport',
    'Fingeravtrycksanalys',
    'Övervakningsbilder',
  ];
  // Polisens dokument skrivs på det ljusa pappret, allt annat på det bruna.
  // De två bilderna har hörn av olika storlek, därför olika slice och edge.
  // Vad siffrorna betyder står i ScalableImageBox.
  const isPoliceDoc = policeDocs.some((type) => evidence.case_clues.clue_types.name.includes(type));
  const paper = isPoliceDoc
    ? {
        image: '/images/item-backgrounds/document-v2.png',
        slice: '70 80 130 100',
        edge: '35px 40px 65px 50px',
        layerClassName: '',
      }
    : {
        image: '/images/item-backgrounds/document-v1.png',
        slice: '40',
        edge: '20px',
        layerClassName: 'brightness-140',
      };

  // Pappret har alltid A4-format (aspect-[1/1.414]). Blir texten för lång
  // scrollar den inuti pappret i stället för att rinna ut över kanten.
  return (
    <div className="relative flex min-h-[calc(100vh-64px-80px)] items-center justify-center bg-[url(/images/backgrounds/evidence-bg.png)] bg-cover bg-center px-4 pt-14 pb-6">
      <BackLink linkUrl={`${baseUrl}/evidence`} linkText={'Bevismaterial'} />
      <ScalableImageBox
        image={paper.image}
        slice={paper.slice}
        edge={paper.edge}
        layerClassName={paper.layerClassName}
        className="aspect-[1/1.414] w-[90%] max-w-md -rotate-2 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
      >
        {/* Marginalen gör att texten slutar innanför papperskanten när den scrollar. */}
        <div className="h-full px-7 py-8">
          <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1 text-surface scrollbar-thin">
            <h4 className="!font-printed leading-7">{evidence.case_clues.title}</h4>

            {/* Har ledtråden en bild visas både bilden och texten, annars bara texten. */}
            {evidence.case_clues.image_url && (
              <ZoomableImage src={evidence.case_clues.image_url} alt={evidence.case_clues.title} />
            )}

            {evidence.case_clues.content && (
              <p className="!font-printed leading-6">{evidence.case_clues.content}</p>
            )}

            {evidence.case_clues.is_key && (
              <div className="relative h-8 shrink-0">
                <KeyEvidence />
              </div>
            )}
          </div>
        </div>
      </ScalableImageBox>
    </div>
  );
};
export default EvidenceSpecificPage;
