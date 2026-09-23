const EvidencePage = () => {
  const notes = [
    { title: 'Rapporter', content: 'bla bla bla' },
    { title: 'misstänkt', content: 'lorem ipsum' },
    { title: 'suspekt?', content: 'väldigt suspekt' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <div
        className={`mt-10 w-[calc(0.95*100%)] h-screen bg-[url(/images/item-backgrounds/open-case-v2.png)] bg-contain bg-top-center bg-no-repeat`}
      >
        <nav className="text-surface flex flex-col ps-10 pt-12 rotate-1 leading-5.5">
          {notes.map((note, i) => (
            <section key={i}>
              <h5>{note.title}</h5>
              <p className="ps-5">{note.content}</p>
            </section>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default EvidencePage;
