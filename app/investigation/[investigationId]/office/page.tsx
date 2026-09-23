import { Polaroid } from '../../../components/Polaroid';

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
    <div className="relative min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/office-bg.png)] bg-top-right bg-no-repeat bg-cover">
      <section className="grid grid-flow-col auto-cols-max gap-2 justify-center mx-2 pt-20 -rotate-3">
        {involvedPeople.map((p, i) => (
          <Polaroid c={p} key={i} />
        ))}
      </section>
      <section
        className={`flex items-end justify-center w-screen aspect-[1261/1247] absolute bottom-0 bg-[url(/images/item-backgrounds/desk.png)] bg-bottom bg-no-repeat bg-cover`}
      >
        <section className="h-[25%] mb-15 aspect-[1227/719] bg-[url(/images/item-backgrounds/notebook.png)] bg-bottom bg-no-repeat bg-cover">
          {/* <p className="!text-xl text-surface !font-bold -rotate-8 mt-5 ml-15">case notes</p> */}
        </section>
      </section>
    </div>
  );
};
export default OfficePage;
