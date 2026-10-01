const steps = [
  {
    title: 'Samla ditt team',
    body: [
      'Ett mysterium löses bäst tillsammans. Skapa ett team och dela inbjudningskoden med dina vänner. Ni kan vara upp till fyra personer.',
      'Den som skapade teamet är värd. Övriga är gäster och alla fall som är upplåsta av minst en spelare kan väljas, så bara en behöver äga fallet.',
    ],
  },
  {
    title: 'Välj ett fall',
    body: [
      'I butiken hittar ni mysterierna. Vissa är gratis, andra kostar mellan 9 och 49 kr och är ert för alltid när ni har köpt dem. Med Unlimited för 99 kr i månaden får ni spela alla fall under den tiden.',
      'Varje fall har en svårighetsgrad. Den avgör svårighet men även hur många anklagelser ert team har: ju svårare fall, desto färre försök. Ett team kan bara ha ett fall igång i taget.',
    ],
  },
  {
    title: 'Utred på kontoret',
    body: [
      'Ni sitter vid skrivbordet. Bevisen ligger framför er som dokument ni kan öppna och läsa: brottsplatsrapporter, polisrapporter, vittnesmål, telefonloggar och mer.',
      'På väggen hänger en korktavla med polaroidbilder på alla inblandade. Där håller ni reda på vem som är vem.',
      'Alla bevis är inte tillgängliga från början. Vissa är låsta tills ni har öppnat ett annat bevis. När ni öppnar det som krävs låses nästa upp. Hittar ni inte vidare, läs om det ni redan har.',
      'Teamet delar både bevis och anteckningar. Det någon hittar ser alla.',
    ],
  },
  {
    title: 'Anklaga i rättssalen',
    body: [
      'När ni är redo går ni till rättssalen. Klicka på porträttet av den ni tror är skyldig och bekräfta valet.',
      'Alla i teamet kan anklaga, men anklagelserna tillhör teamet, inte spelaren. Har ni tre försök delar ni på de tre. Fel person betyder att ett försök är förbrukat och att personen är frikänd. Rätt person tas i förvar och fallet är löst. Tar försöken slut har ni misslyckats.',
      'Oavsett utgång kan ni spela fallet igen, så länge ni inte har ett annat fall igång.',
    ],
  },
];

const GuidePage = () => {
  return (
    <div className="flex flex-col max-w-3xl mx-auto mb-5">
      <h1 className="text-gold uppercase !font-label mt-4 mb-2">Spelguide</h1>
      <p className="text-text-secondary mb-6">
        Ett brott har begåtts och ingen får lämna platsen. Så här går en utredning till, från första
        bevis till dom.
      </p>

      <ol className="flex flex-col gap-6">
        {steps.map((step, index) => (
          <li key={step.title}>
            <div className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 py-1 my-2">
              <h4 className="!font-label text-gold uppercase">
                {index + 1}. {step.title}
              </h4>
            </div>
            <div className="flex flex-col gap-3 ps-2">
              {step.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <h3 className="text-center my-3">Lycka till!</h3>
    </div>
  );
};

export default GuidePage;
