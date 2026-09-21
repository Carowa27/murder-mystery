import Image from 'next/image';

const TeamPage = () => {
  const team = [
    { username: '1', image_url: '' },
    { username: '2', image_url: '' },
    { username: '3', image_url: '' },
    { username: '4', image_url: '' },
  ];
  const caseInfo = {
    title: 'Mordet på Hôtel Le Mont',
    description:
      'Paris, våren 1929. Hotellets ägare Armand Rousseau hittas död i svit 402 morgonen efter vårbalen. Dörren var låst inifrån och nyckeln satt kvar. Fem personer var kvar i huset den natten, och alla har något de hellre hade behållit för sig själva.',
  };
  const isCaseActive = false;
  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/team-bg.png)] bg-center bg-no-repeat bg-cover">
      <div className="flex flex-col justify-between pt-20 px-2">
        <section className="flex justify-between pt-8">
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border border-4 border-primary">
            {team[0].username}
          </div>
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border border-4 border-primary">
            {team[1].username}
          </div>
        </section>
        <section>
          {isCaseActive ? (
            <div className="relative flex justify-center w-screen bg-center bg-no-repeat bg-cover">
              <Image
                src={'/images/item-backgrounds/open-case-v3.png'}
                alt={''}
                width={100}
                height={100}
                className="w-[55%] h-auto pe-2 -rotate-4"
              />
              <div className="absolute z-1000 text-surface w-[39%] pt-7 -rotate-6">
                <h5 className="!text-[0.7rem] !font-bold">{caseInfo.title}</h5>
                <p className="!text-[0.6rem]">{caseInfo.description}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-screen bg-center bg-no-repeat bg-cover">
              <Image
                src={'/images/item-backgrounds/casefiles-w-lightsource.png'}
                alt={''}
                width={100}
                height={100}
                className="w-[80%] h-auto pe-4 pb-8 -rotate-10"
              />
            </div>
          )}
        </section>
        <section className="flex justify-between">
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border border-4 border-primary">
            {team[2].username}
          </div>
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border border-4 border-primary">
            {team[3].username}
          </div>
        </section>
      </div>
    </div>
  );
};
export default TeamPage;
