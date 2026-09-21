-- Mysterium 04 för NOCTURNE: Mordet på Bredskär, Bohuslän 1949.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad beginner, alltså tre anklagelser. Fallet kostar pengar och
-- ingår inte i gratisnivån. Sex personer, åtta ledtrådar, tre av dem
-- nyckelledtrådar, en ledtråd per typ.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0401 är fall 04,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000004';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, is_free, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000004',
  'Mordet på Bredskär',
  'Bohuslän, november 1949. Stormen har hållit Bredskärs fyrplats avskuren från land i tre dygn. Natten mot den trettonde slutar fyren att blinka i tjugo minuter, och när fyrvaktaren kommer upp i tornet ligger fyrmästaren Ragnar Stenberg död vid foten av trappan. Det ser ut som ett fall i mörkret, ända tills någon frågar sig varför linsen stannade.',
  'Bredskärs fyrplats, Bohuslän',
  '1949-11-13',
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
    'b0000000-0000-4000-8000-000000000401',
    'a0000000-0000-4000-8000-000000000004',
    'Ragnar', 'Stenberg', NULL,
    'Fyrmästare på Bredskär i sexton år och noga med journalen ner till minuten. Ringde lotsplatsen i Lysekil på kvällen före sin död och bad dem skicka tullen ut med första båt efter stormen.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000402',
    'a0000000-0000-4000-8000-000000000004',
    'Elsa', 'Stenberg', 'hustru',
    'Har bott på ön lika länge som sin man och sköter hushållet för båda familjerna. Ville flytta in till Lysekil den dag han fyllde sextio, vilket han aldrig gick med på.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000403',
    'a0000000-0000-4000-8000-000000000004',
    'Ingrid', 'Stenberg', 'dotter',
    'Tjugotvå år, fotograferar fåglar och sjö med en kamera hon köpt för egna pengar och framkallar bilderna i skafferiet. Grälade med sin far i oktober om en kontorsplats i Göteborg som hon blivit erbjuden.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000404',
    'a0000000-0000-4000-8000-000000000004',
    'Birger', 'Holm', 'fyrvaktare',
    'Har vakten varannan natt och sköter urverket som vrider linsen. Fick en anmärkning i journalen i september för att han somnat på passet, och anmärkningen går vidare till Lotsverket vid årsskiftet.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000405',
    'a0000000-0000-4000-8000-000000000004',
    'Maj', 'Holm', 'fyrvaktarens hustru',
    'Bor med två små barn i den andra lägenheten i fyrmästarbostaden. Handlar av fiskaren Bratt när han kommer ut med posten och bokför varje inköp i ett vaxdukshäfte.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000406',
    'a0000000-0000-4000-8000-000000000004',
    'Evert', 'Bratt', 'fiskare och postförare',
    'Kör ut post och varor till fyrplatsen två gånger i veckan från Grundsund. Blev liggande i hamnen på Bredskär när stormen kom den elfte och har sovit i sjöboden sedan dess.',
    false, true
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Tre nyckelledtrådar (is_key) krävs för att få anklaga: urverkets lod,
-- samtalet till lotsplatsen och fingeravtrycken.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000401',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Foten av fyrtrappan',
    'Ragnar Stenberg låg på granitgolvet vid nedersta trappsteget, på rygg och med huvudet mot väggen. Fotogenlampan stod kvar på steget ovanför, oskadd och med hela glaset. Bredvid honom på golvet låg urverkets lod, ett tyngdstycke i mässing. Stövlarna var blöta ända upp på skaftet och det låg sand på de tre nedersta stegen. Enligt hustrun gick han över gården till tornet strax efter klockan ett. Dörren ut mot gården står alltid olåst, och uppe i lanterninen satt nyckeln kvar i luckan till urverket.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000402',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Länsmannens rapport från Bredskär',
    'Stormen gjorde att länsmannen kom ut till ön först den fjortonde. På fyrplatsen bodde fem personer: fyrmästaren, hans hustru och dotter samt fyrvaktaren Holm med hustru och två barn. Därtill fiskaren Evert Bratt, som blev liggande i hamnen den elfte och har sovit i sjöboden sedan dess. Ingen båt kunde gå till eller från ön mellan den elfte och den fjortonde. I sjöboden förvaras redskap, tomfat och fyrplatsens fotogen i märkta plåtfat från Lotsverket.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000403',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Ragnar Stenberg',
    'Döden inträffade mellan klockan ett och två på natten. I bakhuvudet finns en rund och skarpt avgränsad krosskada, ungefär fem centimeter tvärs över. Trappans kanter är skarpa och granitgolvet är plant, och ingendera ger en sådan skada. Händer och underarmar saknar skador, alltså tog han inte emot sig när han föll. I magsäcken finns kaffe och ingenting annat.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000404',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Fyrvaktaren Birger Holm',
    'Jag hade vakten och satt i maskinrummet med journalen framför mig. Halv två slutade fyren att blinka, och det har inte hänt på de nio år jag varit här. Skenet stod stilla i stället för två blink var tjugonde sekund. Jag tog lyktan och gick upp, och då låg fyrmästaren i trappan. Uppe i lanterninen hängde linan tom, lodet var avhakat, och det låg nere i trappan bredvid fyrmästaren.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000405',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Urverkets lod',
    'Lodet är ett tyngdstycke i mässing på nio kilo som hänger i en lina i tornets schakt och driver runt linsen. Det vevas upp var fjärde timme. Underkanten är rund och mäter fem centimeter tvärs över. I kanten sitter hår, och blodet i skarven är av fyrmästarens blodgrupp. För att få loss lodet måste man haka av det uppe i lanterninen, och då stannar linsen. Fyren slutar inte lysa när det sker, men den slutar blinka.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000406',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Samtalet till lotsplatsen i Lysekil',
    'Fyrplatsen har telefon över sjökabeln och lotsplatsen för bok över alla samtal. Den tolfte november klockan 22:40 ringde fyrmästare Stenberg och begärde att tullens kustbevakning skulle komma ut med första båt efter stormen. Han uppgav att han hittat något i sjöboden som inte hörde hemma där, och att han inte tänkte ta upp saken med den det gällde förrän tullen var på plats. Samtalet varade i tre minuter. Därefter gick inga fler samtal från fyren.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000407',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Ingrid Stenbergs negativ från den tolfte',
    'Ingrid fotograferade sjön från klippan ovanför hamnen på eftermiddagen den tolfte, innan stormen tog i på allvar. På tre av bilderna syns sjöboden i bakgrunden med dörren på vid gavel. Innanför dörren står träbackar staplade med plomberade dunkar, av det slag som brännvin fraktas i över Kattegatt, och stämpeln på locken är dansk. Segelduksskynket som brukar ligga över dem har halkat ner på golvet. I dörröppningen står Evert Bratt och ser rakt in i kameran.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000408',
    'a0000000-0000-4000-8000-000000000004',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på lodet och på hänglåset',
    'Lodet är avtorkat på sidorna, men i skarven mellan kroken och öglan sitter ett avtryck kvar som trasan inte nått. Det matchar Evert Bratts högra tumme. Samma tumavtryck finns på insidan av hänglåset till sjöboden, alltså på den sida som ligger mot dörren när låset är stängt. Fyrvaktaren Holms avtryck finns på veven till urverket, där de ska finnas, men inte på lodet.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och länsmannens rapport är öppna från början.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån brottsplatsen.
  ('c0000000-0000-4000-8000-000000000403', 'c0000000-0000-4000-8000-000000000401'),
  -- Fyrvaktaren hörs när länsmannen gått igenom vilka som fanns på ön.
  ('c0000000-0000-4000-8000-000000000404', 'c0000000-0000-4000-8000-000000000402'),
  -- Lodet undersöks när skadan inte passar trappan och linsen stannat.
  ('c0000000-0000-4000-8000-000000000405', 'c0000000-0000-4000-8000-000000000403'),
  ('c0000000-0000-4000-8000-000000000405', 'c0000000-0000-4000-8000-000000000404'),
  -- Samtalslistan begärs ut från lotsplatsen på land.
  ('c0000000-0000-4000-8000-000000000406', 'c0000000-0000-4000-8000-000000000402'),
  -- Samtalet pekar på sjöboden, och dottern har fotograferat den.
  ('c0000000-0000-4000-8000-000000000407', 'c0000000-0000-4000-8000-000000000406'),
  -- Avtrycken tas på lodet och på sjöbodens lås.
  ('c0000000-0000-4000-8000-000000000408', 'c0000000-0000-4000-8000-000000000405'),
  ('c0000000-0000-4000-8000-000000000408', 'c0000000-0000-4000-8000-000000000407');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000401', 'b0000000-0000-4000-8000-000000000401'),
  ('c0000000-0000-4000-8000-000000000401', 'b0000000-0000-4000-8000-000000000402'),
  ('c0000000-0000-4000-8000-000000000402', 'b0000000-0000-4000-8000-000000000406'),
  ('c0000000-0000-4000-8000-000000000402', 'b0000000-0000-4000-8000-000000000404'),
  ('c0000000-0000-4000-8000-000000000402', 'b0000000-0000-4000-8000-000000000405'),
  ('c0000000-0000-4000-8000-000000000403', 'b0000000-0000-4000-8000-000000000401'),
  ('c0000000-0000-4000-8000-000000000404', 'b0000000-0000-4000-8000-000000000404'),
  ('c0000000-0000-4000-8000-000000000404', 'b0000000-0000-4000-8000-000000000401'),
  ('c0000000-0000-4000-8000-000000000405', 'b0000000-0000-4000-8000-000000000401'),
  ('c0000000-0000-4000-8000-000000000405', 'b0000000-0000-4000-8000-000000000404'),
  ('c0000000-0000-4000-8000-000000000406', 'b0000000-0000-4000-8000-000000000401'),
  ('c0000000-0000-4000-8000-000000000406', 'b0000000-0000-4000-8000-000000000406'),
  ('c0000000-0000-4000-8000-000000000407', 'b0000000-0000-4000-8000-000000000403'),
  ('c0000000-0000-4000-8000-000000000407', 'b0000000-0000-4000-8000-000000000406'),
  ('c0000000-0000-4000-8000-000000000408', 'b0000000-0000-4000-8000-000000000406'),
  ('c0000000-0000-4000-8000-000000000408', 'b0000000-0000-4000-8000-000000000404');
