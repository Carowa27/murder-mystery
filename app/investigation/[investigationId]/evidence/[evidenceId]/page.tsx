import { KeyEvidence } from '@/app/components/KeyEvidence';
import Image from 'next/image';

const EvidenceSpecificPage = () => {
  const policeDocs = [
    'Brottsplatsrapport',
    'Polisrapport',
    'Obduktionsrapport',
    'Fingeravtrycksanalys',
    'Övervakningsbilder',
  ];
  const otherDocs = ['Vittnesmål', 'Telefonlogg'];
  const evidence = {
    clue_type: 'Telefonlogg',
    title: 'Hotellets växel, natten till den 15 mars',
    content:
      '23:40, samtal från kontorets apparat till Banque Rolland i Genève, fyra minuter. 00:15, samtal från samma apparat till svit 402, en minut. Därefter kopplades inga fler samtal den natten.',
    image_url: null,
    key: true,
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <div
        className={`relative w-[calc(0.9*100%)] rounded-md h-100 ${policeDocs.some((type) => evidence.clue_type.includes(type)) ? 'bg-[url(/images/item-backgrounds/document-v2.png)] bg-cover shadow-lg' : otherDocs.some((type) => evidence.clue_type.includes(type)) ? 'bg-[url(/images/item-backgrounds/document-v1.png)] bg-cover shadow-lg brightness-140' : evidence.clue_type === 'Övervakningsbilder' ? 'bg-[url(/images/item-backgrounds/open-case-v3.png)] bg-contain' : ''} bg-center bg-no-repeat`}
      >
        <div
          className={
            evidence.image_url !== null
              ? `px-2 h-100 text-surface flex flex-col justify-center items-center`
              : `ps-4 pe-2 pt-4 text-surface flex flex-col justify-center`
          }
        >
          <h4 className="!font-printed pb-2 leading-7">{evidence.title}</h4>
          {evidence.image_url === null ? (
            <>
              {/* <h3 className="!font-printed pb-2 leading-7">{evidence.title}</h3> */}
              <p className="!font-printed leading-4.5">{evidence.content}</p>
            </>
          ) : (
            <Image
              src={evidence.image_url}
              alt={`image of ${evidence.title}`}
              width={250}
              height={250}
              className="self-center"
            />
          )}
        </div>
        {evidence.key && <KeyEvidence />}
      </div>
    </div>
  );
};
export default EvidenceSpecificPage;
