import { AccusationPhoto } from '@/app/components/AccusationPhoto';

const InvestigationPage = () => {
  const characters = [
    {
      first_name: 'Rosa',
      last_name: 'Pantern',
      relationship: 'panter hallucination',
      description: 'tydlig hallucination som borde lämnat Clouseau för länge sedan',
      image_url: null,
      is_guilty: false,
      is_victim: false,
    },
    {
      first_name: 'Jack',
      last_name: 'Gaston',
      relationship: 'Tjuvjägare',
      description: 'Kvinnokarl',
      image_url: null,
      is_guilty: false,
      is_victim: false,
    },
    {
      first_name: 'Hercule',
      last_name: 'Poirot',
      relationship: 'detektiv',
      description: 'ser allt, glömmer inget',
      image_url: null,
      is_guilty: false,
      is_victim: false,
    },
    {
      first_name: 'Jacques',
      last_name: 'Clouseau',
      relationship: 'polis',
      description: 'klumpig och naiv fransk polis',
      image_url: null,
      is_guilty: false,
      is_victim: true,
    },
    {
      first_name: 'Jack',
      last_name: 'Gaston',
      relationship: 'Tjuvjägare',
      description: 'Kvinnokarl',
      image_url: null,
      is_guilty: true,
      is_victim: false,
    },
    {
      first_name: 'Jack',
      last_name: 'Gaston',
      relationship: 'Tjuvjägare',
      description: 'Kvinnokarl',
      image_url: null,
      is_guilty: false,
      is_victim: false,
    },
  ];
  return (
    <div className="min-h-[calc(100vh-64px-80px)] flex bg-[url(/images/backgrounds/accusation-bg.png)] bg-center bg-no-repeat bg-cover">
      <section className="w-[90%] flex flex-wrap self-end justify-center items-center gap-2 mx-auto mb-10">
        {characters.map((c, i) => c.is_victim === false && <AccusationPhoto key={i} c={c} />)}
      </section>
    </div>
  );
};
export default InvestigationPage;
