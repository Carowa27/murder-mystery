-- Mysterium 06 för NOCTURNE: Mordet under kupolen, Köpenhamn 1962.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad beginner, alltså tre anklagelser. Fallet kostar pengar och
-- ingår inte i gratisnivån. Sex personer, åtta ledtrådar, en per typ, tre av
-- dem nyckelledtrådar.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0601 är fall 06,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000006';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, is_free, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000006',
  'Mordet under kupolen',
  'Köpenhamn, oktober 1962. Vid säsongens sista föreställning kastar sig trapetsartisten Aurel Bassi ut mot fångaren, blir inte gripen och faller mot säkerhetsnätet. Nätet borde ha tagit emot. I stället ger det vika i ett hörn och Bassi slår i sågspånet inför åttahundra åskådare. Alla fyra surrningarna satt på plats när tältmästaren kontrollerade dem klockan fem.',
  'Cirkus Fortuna, Bellahøj, Köpenhamn',
  '1962-10-14',
  (SELECT id FROM difficulties WHERE name = 'beginner'),
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
    'b0000000-0000-4000-8000-000000000601',
    'a0000000-0000-4000-8000-000000000006',
    'Aurel', 'Bassi', NULL,
    'Trapetsartist och sällskapets stjärnnummer sedan tolv år, född i Bologna. Känd för att skrika åt riggarna och för att aldrig betala för en skada som skett i hans nummer. Hade börjat förhandla med ett tyskt sällskap.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000602',
    'a0000000-0000-4000-8000-000000000006',
    'Vera', 'Bassi', 'hustru och fångare i numret',
    'Gift med Bassi i nio år och den som griper honom i luften. Kommer från ett italienskt sällskap och riggade själv innan hon började flyga. Bär långa ärmar året om.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000603',
    'a0000000-0000-4000-8000-000000000006',
    'Poul', 'Iversen', 'tältmästare och riggare',
    'Ansvarar för tältet, linorna och säkerhetsnätet och skriver under riggboken före varje föreställning. Tjugo år hos Fortuna. Hotade i somras att sluta om Bassi skrek åt hans pojkar en gång till.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000604',
    'a0000000-0000-4000-8000-000000000006',
    'Margit', 'Falk', 'cirkusdirektör',
    'Äger Cirkus Fortuna efter sin far och håller ihop en säsong som gått med förlust två år i rad. Visste att Bassi tänkte ta numret till Hamburg, vilket hade tagit halva publiken med sig.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000605',
    'a0000000-0000-4000-8000-000000000006',
    'Janos', 'Kertesz', 'medflygare i numret',
    'Kom till Danmark från Ungern 1956 och har flugit i Bassis nummer i tre år. Skulle bli stjärna i sällskapet den dag Bassi försvann, och det går rykten om honom och Vera.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000606',
    'a0000000-0000-4000-8000-000000000006',
    'Erik', 'Sund', 'clown',
    'Clown sedan trettio år och den ende som vågade säga emot Bassi inför andra. Har en flaska i vagnen och ett rykte om sig att ta av den före föreställningen.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Tre nyckelledtrådar (is_key) krävs för att få anklaga: surrningarna,
-- samtalen från kontorsvagnen och avtrycken på spännskruvarna.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000601',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Manegen efter numret',
    'Aurel Bassi föll klockan 21:40, under kvällens sista nummer. Numret slutar med att han kastar sig från trapetsen och grips om handlederna av fångaren, och flera i publiken uppger att greppet aldrig togs. Han tog i nätet med rygg och axlar, varpå nätet gav vika i nordöstra hörnet och han slog i sågspånet under. Två av hörnsurrningarna sitter kvar, två hänger lösa. Repändarna i de lösa är rena och släta i snittet, inte fransiga som i ett brustet rep.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000602',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Köpenhamnspolisens genomgång',
    'Sexton personer hör till sällskapet och samtliga fanns i tältet under föreställningen. Nätet spänns upp före varje föreställning och kontrolleras av tältmästaren, som skriver under i riggboken. Riggboken för den fjortonde är påskriven klockan 17:00. Under pausen mellan 21:00 och 21:15 stod manegen tom med nedsläckt belysning medan publiken var ute i foajétältet. Artistingången bakom draperiet är obevakad.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000603',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Aurel Bassi',
    'Dödsorsaken är skador i nacke och bröstkorg som uppkommit när kroppen träffat marken med full fallhastighet. Ett fall som bromsas av ett spänt nät ger inte sådana skador. Händerna är täckta av magnesiumkrita, vilket hör till numret. På vänster handled finns ett äldre brott som läkt snett och axeln har varit ur led minst två gånger. Varken alkohol eller läkemedel påvisas.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000604',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Tältmästaren Poul Iversen',
    'Jag spände nätet klockan fem, gick ett varv och kände på alla fyra hörnen, och skrev under i boken. Jag slår samma knop i alla fyra och har gjort det i tjugo år. De två surrningar som hänger lösa nu är inte mina. De är slagna åt andra hållet, och så gör bara den som lärt sig rigga söderut. I somras sa jag att jag slutar om Bassi skriker åt mina pojkar en gång till. Det har jag redan berättat för polisen, och jag säger det igen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000605',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Surrningarna i de lösa hörnen',
    'De två lösa surrningarna är slagna med en annan knop än de två som höll. Repet i dem är dessutom kapat och skarvat, och snittet är gjort med ett vasst blad. Knopen är den som används i de italienska och franska sällskapen och slås åt motsatt håll jämfört med den danska. Tre personer hos Fortuna har lärt sig rigga söderut: Bassi själv, hans hustru Vera och ungraren Janos Kertesz. Iversens knop sitter i de två hörn som höll. En lös surrning syns inte uppifrån plattformen, bara från sidan, vilket är skälet till att ingen i numret märkte något.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000606',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Samtalen från kontorsvagnen',
    'Kontorsvagnen har telefon inkopplad på gästspelsplatsen och varje samtal antecknas för debitering. Den 9 oktober, utgående till Circus Roland i Hamburg, nio minuter, begärt av Bassi. Den 11 oktober, utgående till en advokat i Milano, sex minuter, begärt av Bassi. Advokaten uppger att han fått i uppdrag att förbereda en ansökan om vårdnaden om dottern Lucia, sju år, inför en flytt till Tyskland. Den 13 oktober, utgående till samma advokat, två minuter, begärt av Vera Bassi.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000607',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Pressfotografens bilder från sista kvällen',
    'En fotograf från en Köpenhamnstidning följde säsongens sista föreställning och tog trettiotvå bilder. På samtliga bilder från första halvan hänger nätet spänt i alla fyra hörnen. På en bild tagen under clownnumret, strax efter pausen, hänger nordöstra hörnet slakt mot golvet. Mellan de två bilderna ligger pausen. Två bilder från foajétältet visar clownen Sund med en flaska i handen, och genom tältöppningen bakom honom skymtar en gestalt i glitterdräkt inne i den nedsläckta manegen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000608',
    'a0000000-0000-4000-8000-000000000006',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på spännskruvarna',
    'Nätets fyra hörn spänns med skruvar av mässing. På de två skruvar som hör till de lösa hörnen finns avtryck från Iversen och från Vera Bassi, och i gängorna sitter magnesiumkrita. På de två hörn som höll finns bara Iversens avtryck. Vera Bassi har uppgett att hon aldrig rör riggen och att hon inte var nere i manegen under pausen. Magnesiumkritan används bara av de tre som flyger i numret.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och polisens genomgång är öppna från början.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån brottsplatsen.
  ('c0000000-0000-4000-8000-000000000603', 'c0000000-0000-4000-8000-000000000601'),
  -- Tältmästaren hörs när riggboken kommit fram i polisens genomgång.
  ('c0000000-0000-4000-8000-000000000604', 'c0000000-0000-4000-8000-000000000602'),
  -- Surrningarna undersöks närmare efter att Iversen sagt att knoparna är fel.
  ('c0000000-0000-4000-8000-000000000605', 'c0000000-0000-4000-8000-000000000604'),
  -- Samtalslistan begärs ut från cirkusens kontor.
  ('c0000000-0000-4000-8000-000000000606', 'c0000000-0000-4000-8000-000000000602'),
  -- Bilderna letas fram när obduktionen visar att nätet inte tog emot.
  ('c0000000-0000-4000-8000-000000000607', 'c0000000-0000-4000-8000-000000000603'),
  -- Avtrycken kräver både knoparna och bilderna som placerar tiden i pausen.
  ('c0000000-0000-4000-8000-000000000608', 'c0000000-0000-4000-8000-000000000605'),
  ('c0000000-0000-4000-8000-000000000608', 'c0000000-0000-4000-8000-000000000607');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000601', 'b0000000-0000-4000-8000-000000000601'),
  ('c0000000-0000-4000-8000-000000000601', 'b0000000-0000-4000-8000-000000000602'),
  ('c0000000-0000-4000-8000-000000000602', 'b0000000-0000-4000-8000-000000000603'),
  ('c0000000-0000-4000-8000-000000000602', 'b0000000-0000-4000-8000-000000000604'),
  ('c0000000-0000-4000-8000-000000000603', 'b0000000-0000-4000-8000-000000000601'),
  ('c0000000-0000-4000-8000-000000000604', 'b0000000-0000-4000-8000-000000000603'),
  ('c0000000-0000-4000-8000-000000000604', 'b0000000-0000-4000-8000-000000000601'),
  ('c0000000-0000-4000-8000-000000000605', 'b0000000-0000-4000-8000-000000000602'),
  ('c0000000-0000-4000-8000-000000000605', 'b0000000-0000-4000-8000-000000000605'),
  ('c0000000-0000-4000-8000-000000000605', 'b0000000-0000-4000-8000-000000000603'),
  ('c0000000-0000-4000-8000-000000000606', 'b0000000-0000-4000-8000-000000000601'),
  ('c0000000-0000-4000-8000-000000000606', 'b0000000-0000-4000-8000-000000000602'),
  ('c0000000-0000-4000-8000-000000000606', 'b0000000-0000-4000-8000-000000000604'),
  ('c0000000-0000-4000-8000-000000000607', 'b0000000-0000-4000-8000-000000000606'),
  ('c0000000-0000-4000-8000-000000000607', 'b0000000-0000-4000-8000-000000000602'),
  ('c0000000-0000-4000-8000-000000000608', 'b0000000-0000-4000-8000-000000000602'),
  ('c0000000-0000-4000-8000-000000000608', 'b0000000-0000-4000-8000-000000000603');
