import { Polaroid } from '../components/Polaroid';

const OfficePage = () => {
  const involvedPeople = [
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
  ];

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/office-bg.png)] bg-center bg-no-repeat bg-cover">
      <section className="grid grid-cols-1 gap-2 mx-2 grid-cols-3">
        {involvedPeople.map((p, i) => (
          <Polaroid c={p} key={i} />
        ))}
      </section>
    </div>
  );
};
export default OfficePage;
