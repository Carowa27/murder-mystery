-- Mysterium 09 för NOCTURNE: Mordet i polarnatten, Antarktis 1979.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad hard, alltså bara en anklagelse. Fallet kostar pengar och
-- ingår inte i gratisnivån. Åtta personer, tolv ledtrådar, fem av dem
-- nyckelledtrådar. Kedjan går i två spår, ett om hur det gick till och ett
-- om ett dödsfall två år tidigare, och de möts i den sista ledtråden.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0901 är fall 09,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000009';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, is_free, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000009',
  'Mordet i polarnatten',
  'Coats Land, midvinternatten 1979. Åtta personer övervintrar på stationen Halvorsen och nästa flygplan kommer i oktober. Mitt under snöstormen larmar generatorhuset, och Gordon Slade går ut längs livlinan för att se efter. Han hittas fyra timmar senare fyrahundra meter ut på isen, ihjälfrusen och fullt påklädd. Livlinans bortre ände satt inte där den ska sitta.',
  'Stationen Halvorsen, Coats Land, Antarktis',
  '1979-06-21',
  (SELECT id FROM difficulties WHERE name = 'hard'),
  false,
  49,
  'active'
);


-- ============================================================
-- Personer
-- ============================================================

-- relationship är relationen till offret och lämnas tom för offret själv.
INSERT INTO characters (id, case_id, first_name, last_name, relationship, description, is_victim, is_guilty)
VALUES
  (
    'b0000000-0000-4000-8000-000000000901',
    'a0000000-0000-4000-8000-000000000009',
    'Gordon', 'Slade', NULL,
    'Meteorolog och stationens biträdande chef, fjärde övervintringen. Hade i juni tagit på sig att packa ner den förre läkarens kvarlämnade lådor inför fartyget i oktober.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000902',
    'a0000000-0000-4000-8000-000000000009',
    'Frank', 'Dunbar', 'kock och allt-i-allo',
    'Har lagat mat på stationerna i söder sedan 1969 och är den ende som alla tycker om. Hämtar posten i radiohytten, fyller på bränsle, skottar och vet var varje verktyg hör hemma. Följer med som fältassistent på varje resa ut från stationen, även den i oktober 1977.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000903',
    'a0000000-0000-4000-8000-000000000009',
    'Mary', 'Kerr', 'stationsläkare',
    'Kom ut 1978 och tog över efter David Bell, som omkom året innan. Har räknat om narkotikaförrådet två gånger och fått det att gå ihop först andra gången.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000904',
    'a0000000-0000-4000-8000-000000000009',
    'Ian', 'Petrie', 'radiooperatör',
    'Ansvarar för radiopassen mot Cambridge och för telegramboken. Har ett glapp i loggen den fjortonde juni som han först förklarade med strömavbrott och sedan inte alls.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000905',
    'a0000000-0000-4000-8000-000000000009',
    'Nils', 'Haugen', 'glaciolog',
    'Norsk och den ende forskaren kvar på stationen som var med på fältresan i oktober 1977, när läkaren David Bell försvann i en spricka. Talar helst inte om den resan.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000906',
    'a0000000-0000-4000-8000-000000000009',
    'Charles', 'Ovenden', 'stationschef',
    'Har hand om loggboken, utpasseringstavlan och rapporterna hem. Låg i öppen strid med Slade om en rapport som föreslog att stationen skulle läggas ner efter 1981.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000907',
    'a0000000-0000-4000-8000-000000000009',
    'Ruth', 'Mailer', 'biolog',
    'Räknar sälar och håller till i hyddan vid vaken, femhundra meter söder om stationen. Hade skrivit ut sig på tavlan klockan sex och kom in strax innan larmet gick.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000908',
    'a0000000-0000-4000-8000-000000000009',
    'Tom', 'Beattie', 'mekaniker',
    'Sköter generatorerna, fordonen och larmet som går i mässen när något strular i generatorhuset. Sov över sitt pass på midvinterkvällen och blev väckt av att Slade redan gått ut.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Fem nyckelledtrådar (is_key) krävs för att få anklaga: livlinan,
-- allskykamerans bilder, Bells anteckningsbok, radiologgen och
-- jämförelsen med fingeravtryckskortet från 1968.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000901',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Fyrahundra meter nordväst',
    'Gordon Slade hittades klockan 02:40 av sökpatrullen, liggande på isen fyrahundra meter nordväst om huvudhuset. Han var fullt påklädd med ytterkläder, dubbla vantar och pjäxor, och höll fortfarande ficklampan i handen. Livlinan mellan huvudhuset och generatorhuset är sextio meter lång och märkt med flaggor. Dess bortre ände satt inte i isskruven vid generatorhusets vägg, utan var surrad runt ett bränslefat fyrtio meter nordväst om huset, ute på fria isen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000902',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Huvudkontorets utredning',
    'Ingen myndighet kan komma till platsen förrän i oktober, så utredningen gjordes av stationschefen på uppdrag av huvudkontoret och togs över av polis i Cambridge i november. Åtta personer övervintrade. Midvinterkvällen firades i mässen från klockan sju. När larmet gick 22:10 satt fem personer kvar vid bordet. Beattie sov i sin koj, Dunbar uppger sig ha varit i köket och Mailer kom in från sälhyddan strax efter tio. Regeln är att ingen går ut ensam i storm, och att den som går ut skriver upp sig på utpasseringstavlan. Slade skrev upp sig 22:12. Stormen drog in strax före tio, och när Slade gick ut låg vinden på trettio meter per sekund med noll sikt.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000903',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Gordon Slade',
    'Dödsorsaken är nedkylning. Döden inträffade två till tre timmar efter att han lämnat huset, alltså strax efter midnatt. Inga skador och inga tecken på våld. Skyddsglasögonen låg i bröstfickan, vilket är normalt i mörker eftersom de immar igen. Innehållet i magsäcken svarar mot midvinterns middag. Han har alltså gått rakt ut på isen av egen kraft och inte hittat tillbaka.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000904',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Mekanikern Tom Beattie',
    'Larmet i mässen går när oljetrycket faller i något av aggregaten. Jag gick ut till generatorhuset klockan tre på natten och allt var som det skulle, samma oljetryck, ingen felkod, inget läckage. Larmet hade alltså ingen orsak därute. Reläet kan lösa ut om någon trycker på provknappen i korridoren utanför mässen, den som sitter i en dosa vid ytterdörren. Den knappen är till för att prova klockan innan vintern och ingen rör den annars.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000905',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Livlinan och isskruven',
    'Linans bortre ände har lossats ur isskruven och surrats runt ett bränslefat. Isskruven själv saknas från verktygstavlan i generatorhuset, där varje plats är märkt, och hittades nedstucken i snön vid fatet. Fatet har dragmärken i snön efter att ha rullats på plats. Den som följer linan utåt hamnar alltså vid fatet, fyrtio meter nordväst om generatorhuset, och släpper man linan där finns den inte att hitta igen i drivsnön. Arbetet kräver bara vantar och en minut, men det kräver att man vet var isskruven hör hemma och att man vet att linan är det enda som håller en på rätt kurs i noll sikt.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000906',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Allskykamerans bildserie',
    'Stationen fotograferar himlen för norrskensforskningen med en kamera som tar en bild var tionde minut, hela vintern, med tid instämplad i kanten. Objektivet ser hela himlen och en remsa av marken närmast masten. På bilden 21:40 syns en gestalt gå från huvudhuset mot generatorhuset med ficklampa. På bilden 21:50 syns samma ljus röra sig nordväst om huset, där inget ärende finns. På bilden 22:00 syns gestalten gå tillbaka in. Från och med bilden 22:10 syns bara drivsnö, eftersom stormen då står på, så de tre bilderna dessförinnan är de enda som visar något. Slade skrev upp sig först 22:12.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000907',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Stationsläkaren Mary Kerr',
    'David Bell var läkare här före mig och föll i en spricka på en fältresa i oktober 1977. Tre man var ute: Bell, Haugen och kocken, som alltid följer med och lagar mat i fält. Hans lådor har stått på vinden sedan dess, eftersom fartyget inte tar personliga tillhörigheter utan anhörigs underskrift. Slade tog på sig att gå igenom dem i juni. Han kom ner därifrån den tolfte och var sig inte lik resten av dagen. Han frågade mig samma kväll hur länge fingeravtryck går att jämföra bakåt i tiden.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000908',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'David Bells anteckningsbok',
    'Boken låg i den understa lådan på vinden, under ett par kängor. Bell arbetade som rättsläkare åt polisen i Glasgow mellan 1964 och 1971 innan han sökte sig söderut. På de sista sidorna, daterade i september 1977, skriver han att han känt igen kocken från ett fall i Glasgow nio år tidigare och att mannen bär en dödsförklarad mans namn. Den sista raden lyder: "Han vet att jag vet. Jag tar upp det när vi kommer tillbaka från fältet."',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000909',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Radiologgen den 10 till 14 juni',
    'Varje telegram skrivs in med tid, avsändare och mottagare. Den 13 juni 09:20, utgående från Slade till personalavdelningen i Cambridge: "begär anställningsakt och referenser för F. Dunbar, anställd 1969, brådskande". Den 14 juni 09:05, inkommande från Cambridge, mottaget och kvitterat, men telegrammets text saknas i boken och bladet är utrivet. Petrie uppger att han lämnade radiohytten för att hämta kaffe och att kocken bar in posten till mässen som vanligt.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000910',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på provknappens kontakt',
    'Dosan vid ytterdörren har en knapp under ett lock. Gummihatten över knappen är sprucken sedan i fjol, så den som trycker får fingret mot kontaktblecket under. Locket och knappens ovansida är avtorkade, men på blecket sitter ett avtryck från en bar högertumme. Utredningen tog avtryck av samtliga åtta som övervintrade. Avtrycket i dosan tillhör kocken Frank Dunbar, som uppgett att han var i köket från åtta till halv elva och inte rörde sig i korridoren.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000911',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Besked från polisen i Glasgow',
    'Francis Dunbar, född 1928 i Govan, avled på sjukhus i februari 1968 utan efterlevande. Hans handlingar rekvirerades och förnyades 1969. I december 1968 efterlystes Thomas Rennie, trettiosju år, för dråp på en man utanför en krog i Anderston. Rennie greps aldrig. I akten finns ett fingeravtryckskort taget vid ett tidigare tillfälle, och obduktionen i det fallet gjordes av rättsläkaren David Bell.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000912',
    'a0000000-0000-4000-8000-000000000009',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Jämförelsen med kortet från 1968',
    'Avtrycken som togs på stationen jämfördes med kortet i Glasgowakten. Höger tumme, pekfinger och långfinger stämmer på samtliga punkter. Mannen som i elva år har hetat Frank Dunbar är Thomas Rennie. Samma jämförelse förklarar varför en kock kände till läkarens anteckningsbok, varför bladet i telegramboken revs ut och varför den som flyttade livlinan visste precis var isskruven hörde hemma.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och huvudkontorets utredning är öppna från början.
-- Spåret 901-903-905-906-910 visar hur det gick till, spåret
-- 902-907-908-909-911 visar varför, och de möts i 912.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån fyndplatsen.
  ('c0000000-0000-4000-8000-000000000903', 'c0000000-0000-4000-8000-000000000901'),
  -- Mekanikern hörs om larmet när utredningen gått igenom kvällen.
  ('c0000000-0000-4000-8000-000000000904', 'c0000000-0000-4000-8000-000000000902'),
  -- Linan undersöks när dödstiden och det falska larmet är klarlagda.
  ('c0000000-0000-4000-8000-000000000905', 'c0000000-0000-4000-8000-000000000903'),
  ('c0000000-0000-4000-8000-000000000905', 'c0000000-0000-4000-8000-000000000904'),
  -- Kameran gås igenom för att se när linan flyttades.
  ('c0000000-0000-4000-8000-000000000906', 'c0000000-0000-4000-8000-000000000905'),
  -- Bilderna visar en tur ut före larmet, alltså tas avtryck i dosan.
  ('c0000000-0000-4000-8000-000000000910', 'c0000000-0000-4000-8000-000000000906'),
  -- Läkaren hörs om vad Slade gjorde dagarna före.
  ('c0000000-0000-4000-8000-000000000907', 'c0000000-0000-4000-8000-000000000902'),
  -- Hon pekar på lådorna på vinden, där boken ligger kvar.
  ('c0000000-0000-4000-8000-000000000908', 'c0000000-0000-4000-8000-000000000907'),
  -- Boken gör det värt att läsa radiologgen rad för rad.
  ('c0000000-0000-4000-8000-000000000909', 'c0000000-0000-4000-8000-000000000908'),
  -- Telegrammet till Cambridge leder vidare till polisen i Glasgow.
  ('c0000000-0000-4000-8000-000000000911', 'c0000000-0000-4000-8000-000000000909'),
  -- Sista jämförelsen kräver både avtrycken på stationen och akten hemifrån.
  ('c0000000-0000-4000-8000-000000000912', 'c0000000-0000-4000-8000-000000000910'),
  ('c0000000-0000-4000-8000-000000000912', 'c0000000-0000-4000-8000-000000000911');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000901', 'b0000000-0000-4000-8000-000000000901'),
  ('c0000000-0000-4000-8000-000000000902', 'b0000000-0000-4000-8000-000000000906'),
  ('c0000000-0000-4000-8000-000000000902', 'b0000000-0000-4000-8000-000000000907'),
  ('c0000000-0000-4000-8000-000000000902', 'b0000000-0000-4000-8000-000000000908'),
  ('c0000000-0000-4000-8000-000000000903', 'b0000000-0000-4000-8000-000000000901'),
  ('c0000000-0000-4000-8000-000000000904', 'b0000000-0000-4000-8000-000000000908'),
  ('c0000000-0000-4000-8000-000000000905', 'b0000000-0000-4000-8000-000000000901'),
  ('c0000000-0000-4000-8000-000000000905', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000906', 'b0000000-0000-4000-8000-000000000901'),
  ('c0000000-0000-4000-8000-000000000906', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000907', 'b0000000-0000-4000-8000-000000000903'),
  ('c0000000-0000-4000-8000-000000000907', 'b0000000-0000-4000-8000-000000000901'),
  ('c0000000-0000-4000-8000-000000000907', 'b0000000-0000-4000-8000-000000000905'),
  ('c0000000-0000-4000-8000-000000000908', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000908', 'b0000000-0000-4000-8000-000000000905'),
  ('c0000000-0000-4000-8000-000000000909', 'b0000000-0000-4000-8000-000000000901'),
  ('c0000000-0000-4000-8000-000000000909', 'b0000000-0000-4000-8000-000000000904'),
  ('c0000000-0000-4000-8000-000000000909', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000910', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000911', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000912', 'b0000000-0000-4000-8000-000000000902'),
  ('c0000000-0000-4000-8000-000000000912', 'b0000000-0000-4000-8000-000000000901');
