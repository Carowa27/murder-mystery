-- Mysterium 05 för NOCTURNE: Mordet i ateljé 9, Hollywood 1957.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad intermediate, alltså två anklagelser. Fallet kostar pengar
-- och ingår inte i gratisnivån. Sju personer, tio ledtrådar, fyra av dem
-- nyckelledtrådar.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0501 är fall 05,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000005';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000005',
  'Mordet i ateljé 9',
  'Hollywood, augusti 1957. Vid fjärde tagningen av scen 108 höjer Ruth Calder revolvern och skjuter Vincent Hale i bröstet, precis som i manus. Skillnaden är att han inte reser sig igen. Vapnet kom ur studions eget skåp, laddat med sex lösa patroner av rekvisitören själv, och hela ateljén såg det hända. Någon av de nitton på golvet bytte en av patronerna under matrasten.',
  'Monarch Pictures, ateljé 9, Hollywood',
  '1957-08-09',
  (SELECT id FROM difficulties WHERE name = 'intermediate'),
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
    'b0000000-0000-4000-8000-000000000501',
    'a0000000-0000-4000-8000-000000000005',
    'Vincent', 'Hale', NULL,
    'Stjärna sedan trettiotalet, nu på nedgång och bitter över det. Vittnade inför kommittén 1951 och lämnade sex namn, varav ett var regissörens. Hade börjat förhandla med televisionen om ett eget program.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000502',
    'a0000000-0000-4000-8000-000000000005',
    'Ruth', 'Calder', 'motspelerska',
    'Spelar kvinnan som skjuter i scen 108 och är den som tryckte av. Hale såg till att hon byttes ut i en film förra året, och den här rollen fick hon först sedan hon gått med på halva gaget.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000503',
    'a0000000-0000-4000-8000-000000000005',
    'Leo', 'Marek', 'regissör',
    'Ungerskfödd regissör som stod på svarta listan i fem år och gör sin första film under eget namn sedan 1951. Vet precis vem som lämnade hans namn till kommittén, och arbetar ändå med honom varje dag.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000504',
    'a0000000-0000-4000-8000-000000000005',
    'Estelle', 'Ward', 'producent',
    'Producent och delägare i Monarch Pictures efter sin far. Filmen ligger nitton dagar efter plan, banken har sagt upp krediten till den sista augusti, och hon är den enda som sett hela kalkylen.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000505',
    'a0000000-0000-4000-8000-000000000005',
    'Sam', 'Purdy', 'rekvisitör',
    'Ansvarar för rekvisitan och för vapenskåpet, laddar varje vapen och visar upp trumman innan tagning. Tjugofyra år på Monarch utan en enda olycka, fram till den nionde augusti.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000506',
    'a0000000-0000-4000-8000-000000000005',
    'Nora', 'Fields', 'skripta',
    'För tidkort på varje tagning och antecknar varje avvikelse i repliker och rekvisita. Rör sig över hela golvet utan att någon lägger märke till henne.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000507',
    'a0000000-0000-4000-8000-000000000005',
    'Chuck', 'Deene', 'stand-in och kaskadör',
    'Står in för Hale under ljussättningen och gör hans fall och slagsmål. Miste ett kontrakt på en annan film sedan Hale krävt att få en ny stand-in, och har sagt högt i matsalen vad han tycker om den saken.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Fyra nyckelledtrådar (is_key) krävs för att få anklaga: den sjätte lösa
-- patronen, kameratestet, växelns samtalsbok och kvittot i Burbank.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000501',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Ateljé 9, scen 108',
    'Vincent Hale föll klockan 21:20 vid fjärde tagningen, mitt framför kameran och inför nitton personer. Han träffades i bröstet på fyra meters håll. Vapnet är en revolver av kaliber .38 ur studions vapenskåp. I trumman ligger fem lösa patroner och en tom hylsa. Ateljéporten var stängd för utomstående och grindvakten förde in varje namn som passerade under kvällen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000502',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Hollywood Division, första genomgången',
    'Nitton personer fanns på golvet vid tagningen. Under matrasten mellan 19:00 och 20:15 stod ateljén tom, så när som på två ljusmästare som arbetade uppe på gallerierna och inte ser golvet därifrån. Rekvisitavagnen med vapenskåpet stod kvar på golvet hela rasten. Nyckeln till skåpet hänger på en krok innanför dörren till rekvisitakontoret, och det rummet var olåst. Grindvakten har fört in sexton namn den kvällen, samtliga anställda.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000503',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Vincent Hale',
    'Döden inträffade omedelbart. Skottkanalen går snett uppifrån och in i hjärtat. Kulan är av bly, kaliber .38, alltså skarp ammunition och inte den vadd en lös patron lämnar efter sig. Krutstänket på skjortan svarar mot tre till fem meter, vilket stämmer med tagningen. Kulan bär spår från revolverns lopp och kommer från en tillverkare som studion inte köper in.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000504',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Rekvisitören Sam Purdy',
    'Jag laddade revolvern klockan sex, sex lösa patroner ur en öppnad ask, och visade upp trumman för regissören som reglerna säger. Sedan låste jag skåpet och gick och åt. Nyckeln hänger där den alltid har hängt, och det vet var och en som arbetat här längre än en vecka. Jag har skött vapen på den här ateljén i tjugofyra år utan att någon fått en skråma.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000505',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Den sjätte lösa patronen',
    'I rekvisitavagnens översta låda, under en putstrasa, låg en enda lös patron ur samma sats som de fem i trumman. Satsen levereras i askar om femtio. I asken i skåpet ligger fyrtiofyra, i trumman fem, och den i lådan är den femtionde. Någon har alltså tagit ut en lös patron ur revolvern, lagt den i lådan och satt en skarp patron i dess ställe.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000506',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Skriptan Nora Fields',
    'Jag gick in vid 19:35 för att hämta min pärm vid kameran. Någon stod då vid rekvisitavagnen med ryggen mot mig, i ljus kavaj och med uppsatt hår. Jag antog att det var en av flickorna från garderoben och tänkte inte mer på det. Kameran stod kvar och gick, för fotografen hade bett att få pröva en ny filmsort under rasten.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000507',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Kameratestet under matrasten',
    'Fotografen lät kameran gå i fem minuter under rasten för att pröva den nya filmsorten. Rullen följde med kvällens övriga material till laboratoriet och låg kvar i högen. På rutorna mellan 19:33 och 19:38 syns rekvisitavagnen i bakgrunden, suddig men läsbar. En kvinna i ljus kavaj låser upp skåpet på vagnen, öppnar den översta lådan, står stilla en halv minut med ryggen mot kameran och stänger bådadera. När hon går därifrån passerar hon nära objektivet, och i de rutorna syns ansiktet: producenten Estelle Ward.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000508',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Växelns samtalsbok den 7 och 8 augusti',
    'Växeln för bok över alla samtal från kontorsflygeln. Den 7 augusti 11:20, från Estelle Wards rum till ett försäkringsbolag i Pasadena, elva minuter, antecknat som personförsäkring för pågående produktion. Samma dag 16:05, inkommande till Wards rum från Hales agent, fyra minuter. Den 8 augusti 09:30, utgående från Wards rum till Monarchs bank, två minuter. Agenten uppger att hans samtal gällde att Hale ville bryta kontraktet och gå över till televisionen.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000509',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på hylsan och på lådan',
    'Hylsan efter den skarpa patronen bär ett ofullständigt avtryck på botten, med för få punkter för ett säkert utlåtande men förenligt med Estelle Wards vänstra pekfinger. På insidan av rekvisitavagnens översta låda finns avtryck från Purdy, från ett av rekvisitabiträdena och från Ward, som uppgett att hon aldrig rört vagnen. Revolverns kolv och trumma bär bara Purdys och Ruth Calders avtryck, och Calders sitter precis där de ska sitta när vapnet hålls som i scenen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000510',
    'a0000000-0000-4000-8000-000000000005',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Liggaren i vapenhandeln i Burbank',
    'Den 6 augusti såldes en ask .38 av det märke kulan kommer från, betald kontant. I liggaren har köparen skrivit L. Marek och en adress i Glendale som inte finns. Regissören Leo Marek stod den dagen i ateljén från sju på morgonen till nio på kvällen, vilket sexton personer intygar, och handstilen är inte hans. Den stämmer med Estelle Wards anteckningar i produktionsboken, ända ner till det öppna M:et. Biträdet minns en kvinna i fyrtioårsåldern som frågade vilken ammunition som passar en revolver av den modell som brukar synas i filmer.',
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
  ('c0000000-0000-4000-8000-000000000503', 'c0000000-0000-4000-8000-000000000501'),
  -- Rekvisitören hörs när polisen gått igenom rasten och nyckeln.
  ('c0000000-0000-4000-8000-000000000504', 'c0000000-0000-4000-8000-000000000502'),
  -- Vagnen genomsöks efter att Purdy redogjort för laddningen.
  ('c0000000-0000-4000-8000-000000000505', 'c0000000-0000-4000-8000-000000000504'),
  -- Skriptan hörs om vem som rörde sig på golvet under rasten.
  ('c0000000-0000-4000-8000-000000000506', 'c0000000-0000-4000-8000-000000000504'),
  -- Hennes uppgift om att kameran gick leder till rullen på labbet.
  ('c0000000-0000-4000-8000-000000000507', 'c0000000-0000-4000-8000-000000000506'),
  -- Namnet på filmen gör det motiverat att begära ut växelns bok.
  ('c0000000-0000-4000-8000-000000000508', 'c0000000-0000-4000-8000-000000000507'),
  -- Avtrycken kräver både hylsan och lådan som pekats ut.
  ('c0000000-0000-4000-8000-000000000509', 'c0000000-0000-4000-8000-000000000503'),
  ('c0000000-0000-4000-8000-000000000509', 'c0000000-0000-4000-8000-000000000505'),
  -- Vapenhandeln söks upp när försäkringssamtalet ger ett skäl att leta.
  ('c0000000-0000-4000-8000-000000000510', 'c0000000-0000-4000-8000-000000000508');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000501', 'b0000000-0000-4000-8000-000000000501'),
  ('c0000000-0000-4000-8000-000000000501', 'b0000000-0000-4000-8000-000000000502'),
  ('c0000000-0000-4000-8000-000000000502', 'b0000000-0000-4000-8000-000000000505'),
  ('c0000000-0000-4000-8000-000000000502', 'b0000000-0000-4000-8000-000000000507'),
  ('c0000000-0000-4000-8000-000000000503', 'b0000000-0000-4000-8000-000000000501'),
  ('c0000000-0000-4000-8000-000000000504', 'b0000000-0000-4000-8000-000000000505'),
  ('c0000000-0000-4000-8000-000000000504', 'b0000000-0000-4000-8000-000000000503'),
  ('c0000000-0000-4000-8000-000000000505', 'b0000000-0000-4000-8000-000000000505'),
  ('c0000000-0000-4000-8000-000000000506', 'b0000000-0000-4000-8000-000000000506'),
  ('c0000000-0000-4000-8000-000000000506', 'b0000000-0000-4000-8000-000000000504'),
  ('c0000000-0000-4000-8000-000000000507', 'b0000000-0000-4000-8000-000000000504'),
  ('c0000000-0000-4000-8000-000000000508', 'b0000000-0000-4000-8000-000000000504'),
  ('c0000000-0000-4000-8000-000000000508', 'b0000000-0000-4000-8000-000000000501'),
  ('c0000000-0000-4000-8000-000000000509', 'b0000000-0000-4000-8000-000000000504'),
  ('c0000000-0000-4000-8000-000000000509', 'b0000000-0000-4000-8000-000000000502'),
  ('c0000000-0000-4000-8000-000000000509', 'b0000000-0000-4000-8000-000000000505'),
  ('c0000000-0000-4000-8000-000000000510', 'b0000000-0000-4000-8000-000000000504'),
  ('c0000000-0000-4000-8000-000000000510', 'b0000000-0000-4000-8000-000000000503');
