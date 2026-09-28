import { BackLink } from '@/app/components/BackLink';
import { KeyEvidence } from '@/app/components/KeyEvidence';
import { IFoundClues } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';
import Image from 'next/image';

const EvidenceSpecificPage = async ({
  params,
}: {
  params: Promise<{ investigationId: string; evidenceId: string }>;
}) => {
  const { investigationId, evidenceId } = await params;
  const baseUrl = `/investigation/${investigationId}`;

  const cookieStore = await cookies();

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
  const otherDocs = ['Vittnesmål', 'Telefonlogg'];

  return (
    <div className="relative w-full min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <BackLink linkUrl={`${baseUrl}/evidence`} linkText={'Bevismaterial'} />
      <div
        className={`relative w-[90%] -rotate-4 aspect-[1/1.414] rounded-md ${policeDocs.some((type) => evidence.case_clues.clue_types.name.includes(type)) ? 'bg-[url(/images/item-backgrounds/document-v2.png)] bg-cover shadow-lg' : otherDocs.some((type) => evidence.case_clues.clue_types.name.includes(type)) ? 'bg-[url(/images/item-backgrounds/document-v1.png)] bg-cover shadow-lg brightness-140' : evidence.case_clues.clue_types.name === 'Övervakningsbilder' ? 'bg-[url(/images/item-backgrounds/open-case-v3.png)] bg-contain' : ''} bg-center bg-no-repeat`}
      >
        <div
          className={
            evidence.case_clues.image_url !== null
              ? `px-2 h-100 text-surface flex flex-col justify-center items-center`
              : `ps-4 pe-2 pt-4 text-surface flex flex-col justify-center`
          }
        >
          <h4 className="!font-printed pb-2 leading-7">{evidence.case_clues.title}</h4>
          {evidence.case_clues.image_url === null ? (
            <>
              {/* <h3 className="!font-printed pb-2 leading-7">{evidence.title}</h3> */}
              <p className="!font-printed leading-4.5">{evidence.case_clues.content}</p>
            </>
          ) : (
            <Image
              src={evidence.case_clues.image_url}
              alt={`image of ${evidence.case_clues.title}`}
              width={250}
              height={250}
              className="self-center"
            />
          )}
        </div>
        {evidence.case_clues.is_key && <KeyEvidence />}
      </div>
    </div>
  );
};
export default EvidenceSpecificPage;
