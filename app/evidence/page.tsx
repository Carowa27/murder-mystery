const EvidencePage = () => {
  const clueTypes = [
    'Rapporter',
    'Fingeravtrycksanalys',
    'Vittnesmål',
    'Telefonlogg',
    'Objekt',
    'Övervakningsbilder',
  ];

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <div
        className={`mt-10 w-[calc(0.95*100%)] h-screen bg-[url(/images/item-backgrounds/open-case-v2.png)] bg-contain bg-top-center bg-no-repeat`}
      >
        <nav className="text-surface flex flex-col ps-10 pt-12 rotate-1 leading-5.5">
          {clueTypes.map((type, i) => (
            <section key={i}>
              <h5>{type}</h5>
              <p className="ps-5">found clues here</p>
            </section>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default EvidencePage;
