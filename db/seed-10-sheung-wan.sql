-- Mysterium 10 för NOCTURNE: Mordet på tjugotredje våningen, Hongkong 1986.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad hard, alltså bara en anklagelse. Fallet kostar pengar och
-- ingår inte i gratisnivån. Åtta personer, tolv ledtrådar, fem av dem
-- nyckelledtrådar. Kedjan pekar med flit ut fel person i mitten, och vänder
-- först när växelns samtalslista läggs bredvid kortläsarloggen.
--
-- Obs om namnen: familjenamnet står i last_name och tilltalsnamnet i
-- first_name, även för de kinesiska namnen. I texten skrivs de i den ordning
-- de används i Hongkong, alltså Lau Wing-kit. Visar gränssnittet namnen som
-- "förnamn efternamn" blir ordningen omvänd mot texten.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 1001 är fall 10,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000010';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000010',
  'Mordet på tjugotredje våningen',
  'Hongkong, september 1986. Signal åtta hissas klockan 17:40 och staden stänger, men sju personer blir kvar i Lau Cheongs kontorshus i Sheung Wan medan tyfonen drar in. På morgonen ligger styrelseordföranden Lau Wing-kit på lastkajens tak, sex våningar under sitt eget fönster. Polisen skriver olyckshändelse, eftersom rutan uppenbarligen gav vika för vinden. Glaset säger något annat.',
  'Lau Cheong Shipping, Sheung Wan, Hongkong',
  '1986-09-09',
  (SELECT id FROM difficulties WHERE name = 'hard'),
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
    'b0000000-0000-4000-8000-000000001001',
    'a0000000-0000-4000-8000-000000000010',
    'Wing-kit', 'Lau', NULL,
    'Styrelseordförande i tredje led och ensam ägare till rösterna i bolaget. Hade två dagar tidigare skrivit under ett avtal om att sälja hela rörelsen och flytta till Vancouver.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000001002',
    'a0000000-0000-4000-8000-000000000010',
    'Chi-ming', 'Lau', 'bror',
    'Har skött hamnsidan av bolaget i trettio år, med fyrahundra man under sig och lön men inga aktier. Fyrtionio år gammal och den ende i familjen som aldrig fick se faderns testamente.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000001003',
    'a0000000-0000-4000-8000-000000000010',
    'Mei-ling', 'Lau', 'dotter',
    'Finansdirektör, utbildad i London och den som skulle ta över. Satt kvar på kontoret under tyfonen för att hinna med Londonbörsens morgon.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000001004',
    'a0000000-0000-4000-8000-000000000010',
    'Eddie', 'Fong', 'bolagsjurist',
    'Skrev köpeavtalet och satt med vid varje möte om försäljningen. Har fakturerat bolaget för arbete på nio kvällar i augusti som ingen annan känner till.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000001005',
    'a0000000-0000-4000-8000-000000000010',
    'Margaret', 'Yau', 'chefssekreterare',
    'Tjugo år vid ordförandens dörr och den som vet vilka brev som aldrig skickades. Blev utan besked om vad som händer med henne efter försäljningen.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000001006',
    'a0000000-0000-4000-8000-000000000010',
    'Terence', 'Ng', 'redovisningschef',
    'Sköter böckerna och har spelat bolagets överskottslikviditet på fastighetsmarknaden i två år. Ligger back sedan i våras och har bett om att få lägga om en post innan bokslutet.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000001007',
    'a0000000-0000-4000-8000-000000000010',
    'Douglas', 'Erskine', 'bankman',
    'Kreditansvarig för bolaget på banken och den som skulle betala ut köpeskillingen. Blev kvar i huset när signalen gick upp och sov i konferensrummet.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000001008',
    'a0000000-0000-4000-8000-000000000010',
    'Tai', 'Wong', 'vaktmästare',
    'Sitter i entrén och för bok över alla som passerar när huset är stängt. Sextio år och den ende som vet vilka hissar som går när tyfonsignalen är uppe.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Fem nyckelledtrådar (is_key) krävs för att få anklaga: glassplittret,
-- växelns samtalslista, föremålet ur vattnet, avtrycken och handlingarna
-- om försäljningen.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000001001',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Rummet och lastkajens tak',
    'Lau Wing-kit hittades klockan 06:15 på lastkajens tak, sex våningar under fönstret till sitt eget rum på tjugotredje våningen. Fönstret är krossat i hela sin bredd. I rummet står stolen kvar vid skrivbordet och papperen ligger utspridda över golvet, vilket stämmer med att vinden stod in genom hålet i sju timmar. På skrivbordet står ett glas whisky och en karaff. I den tomma hållaren på hyllan bakom skrivbordet saknas en modell av en fartygspropeller i brons, som enligt sekreteraren stod där på fredagen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001002',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Royal Hong Kong Police, första genomgången',
    'Signal åtta hissades 17:40 och personalen skickades hem. Sju personer blev kvar i huset över natten och samtliga uppger att de höll sig på sina egna våningar. Ytterdörrarna låses automatiskt när signalen går upp och vaktmästaren för bok över varje person som passerar entrén därefter. Ingen utomstående finns i boken. Kortläsarna till våningsdörrarna sattes in förra året och skriver ut kortnummer, dörr och klockslag på en remsa. Bolaget hade två dagar tidigare tecknat avtal om att sälja rörelsen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001003',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Lau Wing-kit',
    'Skadorna svarar mot ett fall från tjugotredje våningen. Utöver dem finns en intryckt fraktur i bakhuvudet som inte kan ha uppkommit vid nedslaget, eftersom den ligger på motsatt sida och blödningen under skallbenet hunnit utvecklas före döden. I såret finns spår av brons. Händerna saknar skärsår, vilket de inte gör på någon som går genom en fönsterruta. Alkoholhalten svarar mot två glas. Döden inträffade mellan klockan tio och midnatt.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001004',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Glassplittret',
    'Nio tiondelar av glaset låg utanför huset, på lastkajens tak och på gatan nedanför. Hade rutan tryckts in av vinden skulle splittret ha legat inne i rummet. De skärvor som sitter kvar i karmen är böjda utåt. Vinden låg den natten från nordost, och ordförandens fönster vetter mot sydväst, alltså i lä. Krosset börjar i en punkt en meter över golvet, vilket svarar mot ett slag med ett trubbigt föremål och inte mot en kropp som faller mot rutan.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000001005',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Vaktmästaren Wong Tai',
    'När signalen går upp stänger jag av alla hissar utom den i mitten, och godshissen ska stå låst med nyckel. Klockan tjugo över tio hörde jag godshissen gå. Den går inte utan nyckel, och nycklarna finns hos mig och hos hamnkontoret. Ingen kom in eller ut genom entrén efter klockan sex. Fröken Lau ringde ner tio i elva och bad om te, och då satt hon vid sitt bord på tjugoförsta, för jag bar upp det själv.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001006',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Kortläsarremsan från tjugotredje våningen',
    'Remsan för kvällen visar tre passager genom korridorsdörren på tjugotredje våningen. 19:12 kort 004, ordföranden själv, som sedan inte passerar dörren igen. 21:58 kort 011, ingående. 22:16 kort 011, utgående. Kort 011 är utfärdat till Lau Mei-ling. Hennes eget kort ligger i hennes handväska på tjugoförsta våningen, och hon uppger att reservkortet med samma nummer har legat i hamnkontorets skrivbord sedan hennes farbror tappade sitt i juli.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001007',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Växelns samtalslista under natten',
    'Husets växel skriver ut varje samtal med anknytning, nummer och längd. Anknytning 2104, Lau Mei-lings rum, är upptagen mot ett nummer i London från 21:36 till 22:41, sextiofem minuter i ett sträck. Mäklarfirman i London har bekräftat samtalet och att det var hon som talade. Under samma tid gick kort 011 in och ut genom dörren två våningar ovanför. Anknytning 2301, ordförandens rum, ringde hamnkontorets direktnummer 21:44, ett samtal på under en minut.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000001008',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Lau Mei-ling om kvällen och om avtalet',
    'Jag satt i telefon med London till tjugo i elva och gick aldrig upp. Reservkortet gav jag till farbror Chi-ming i juli när han tappade sitt, och det ligger i hans låda på hamnkontoret. Min far ringde honom på kvällen, det hade han sagt att han skulle göra. Han hade bestämt sig för att berätta två saker: att rörelsen var såld och att farfars testamente aldrig gav farbror en enda aktie, vilket min far vetat sedan 1961 och aldrig sagt.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001009',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Kameran vid lastporten',
    'Hamnbolaget har sedan 1984 en kamera mot lastporten som spelar in på band dygnet runt och som bandas över var sjunde dag. Bilden är grov och regnet gör den grövre. Klockan 22:25 går en man ut genom porten med något långsmalt under rocken, går de trettio metrarna fram till kajkanten och gör en kaströrelse med höger arm. Klockan 22:28 är han tillbaka inne. Gestalten går inte att känna igen på bilden, men kroppslängden svarar mot en man kring en och åttio.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000001010',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Fyndet i hamnbassängen',
    'Polisens dykare sökte av bottnen innanför kajkanten och tog upp modellen av fartygspropellern på fyra meters djup, elva meter ut från den punkt kameran visar. Föremålet väger tre och ett halvt kilo och är av brons. På den ena bladkanten finns hår och vävnad som stämmer med ordförandens skada, och bronset är av samma sammansättning som spåren i såret. Modellen är den som saknas ur hållaren på tjugotredje våningen.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000001011',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på foten och på karmen',
    'Havsvatten tar bort avtryck på fria ytor, men på insidan av modellens ihåliga fot, dit vattnet stått stilla, satt två avtryck kvar. De tillhör Lau Chi-ming. På fönsterkarmens insida, en decimeter under krosspunkten, finns ett handavtryck från samma man, vänt som när någon tar stöd mot karmen och lutar sig ut genom hålet. Chi-ming har uppgett att han inte varit på tjugotredje våningen sedan i juni.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000001012',
    'a0000000-0000-4000-8000-000000000010',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Köpeavtalet och testamentet från 1961',
    'Köpeavtalet är daterat den 7 september och ger ordföranden ensam hela köpeskillingen, eftersom rösterna och aktierna är hans. Bolagsjuristen Fong bekräftar att Lau Chi-ming inte nämns i handlingen och inte var kallad till något möte. I faderns testamente från 1961, som ligger i bankfacket, går hela innehavet till den äldste sonen med villkor att den yngre får anställning så länge han vill ha den. Enligt bankens liggare togs testamentet ut ur facket den 8 september klockan 11:20 av Lau Wing-kit, och det återlämnades samma dag.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och polisens genomgång är öppna från början.
-- Kortläsarremsan pekar ut dottern, och växelns lista tar bort henne igen.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån fyndplatsen.
  ('c0000000-0000-4000-8000-000000001003', 'c0000000-0000-4000-8000-000000001001'),
  -- Skadan i bakhuvudet gör att glaset undersöks ordentligt.
  ('c0000000-0000-4000-8000-000000001004', 'c0000000-0000-4000-8000-000000001003'),
  -- Vaktmästaren hörs om natten i huset.
  ('c0000000-0000-4000-8000-000000001005', 'c0000000-0000-4000-8000-000000001002'),
  -- Hans uppgift om hissen leder till kortläsarremsan.
  ('c0000000-0000-4000-8000-000000001006', 'c0000000-0000-4000-8000-000000001005'),
  -- Kortet pekar ut dottern, så hennes kväll kontrolleras i växeln.
  ('c0000000-0000-4000-8000-000000001007', 'c0000000-0000-4000-8000-000000001006'),
  -- Med alibit klart kan hon höras om vem som har hennes reservkort.
  ('c0000000-0000-4000-8000-000000001008', 'c0000000-0000-4000-8000-000000001007'),
  -- Bandet vid lastporten gås igenom innan det bandas över.
  ('c0000000-0000-4000-8000-000000001009', 'c0000000-0000-4000-8000-000000001006'),
  -- Dykarna söker där kameran visar, efter det som krossade rutan.
  ('c0000000-0000-4000-8000-000000001010', 'c0000000-0000-4000-8000-000000001009'),
  ('c0000000-0000-4000-8000-000000001010', 'c0000000-0000-4000-8000-000000001004'),
  -- Avtrycken tas på det upptagna föremålet och på karmen.
  ('c0000000-0000-4000-8000-000000001011', 'c0000000-0000-4000-8000-000000001010'),
  -- Handlingarna hämtas när dottern berättat vad fadern tänkte säga.
  ('c0000000-0000-4000-8000-000000001012', 'c0000000-0000-4000-8000-000000001008');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000001001', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001001', 'b0000000-0000-4000-8000-000000001005'),
  ('c0000000-0000-4000-8000-000000001002', 'b0000000-0000-4000-8000-000000001008'),
  ('c0000000-0000-4000-8000-000000001002', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001003', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001004', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001005', 'b0000000-0000-4000-8000-000000001008'),
  ('c0000000-0000-4000-8000-000000001005', 'b0000000-0000-4000-8000-000000001003'),
  ('c0000000-0000-4000-8000-000000001006', 'b0000000-0000-4000-8000-000000001003'),
  ('c0000000-0000-4000-8000-000000001006', 'b0000000-0000-4000-8000-000000001002'),
  ('c0000000-0000-4000-8000-000000001006', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001007', 'b0000000-0000-4000-8000-000000001003'),
  ('c0000000-0000-4000-8000-000000001007', 'b0000000-0000-4000-8000-000000001002'),
  ('c0000000-0000-4000-8000-000000001007', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001008', 'b0000000-0000-4000-8000-000000001003'),
  ('c0000000-0000-4000-8000-000000001008', 'b0000000-0000-4000-8000-000000001002'),
  ('c0000000-0000-4000-8000-000000001009', 'b0000000-0000-4000-8000-000000001002'),
  ('c0000000-0000-4000-8000-000000001010', 'b0000000-0000-4000-8000-000000001001'),
  ('c0000000-0000-4000-8000-000000001011', 'b0000000-0000-4000-8000-000000001002'),
  ('c0000000-0000-4000-8000-000000001012', 'b0000000-0000-4000-8000-000000001002'),
  ('c0000000-0000-4000-8000-000000001012', 'b0000000-0000-4000-8000-000000001004');
