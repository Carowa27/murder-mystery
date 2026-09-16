-- Testmysterium för NOCTURNE: Mordet på Hôtel Le Mont, Paris 1929.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Fallet är gratis och satt till active, så det går att spela direkt.
-- Id:n är hårdkodade för att filen ska gå att köra om. Kör den här raden
-- först om du vill börja om (tar med sig karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000001';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, is_free, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Mordet på Hôtel Le Mont',
  'Paris, våren 1929. Hotellets ägare Armand Rousseau hittas död i svit 402 morgonen efter vårbalen. Dörren var låst inifrån och nyckeln satt kvar. Fem personer var kvar i huset den natten, och alla har något de hellre hade behållit för sig själva.',
  'Hôtel Le Mont, Paris',
  '1929-03-15',
  (SELECT id FROM difficulties WHERE name = 'beginner'),
  true,
  0,
  'active'
);


-- ============================================================
-- Personer
-- ============================================================

-- relationship är relationen till offret och lämnas tom för offret själv.
INSERT INTO characters (id, case_id, first_name, last_name, relationship, description, is_victim, is_guilty)
VALUES
  (
    'b0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    'Armand', 'Rousseau', NULL,
    'Hotellets ägare sedan tjugo år. Sträng med siffror, generös med andras hemligheter. Hade bokat ett möte med sin bokhållare till den femtonde mars.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000001',
    'Colette', 'Rousseau', 'hustru',
    'Ärver hotellet och de skulder som följer med det. Dansade i balsalen till efter klockan ett och gör ingen hemlighet av att äktenskapet var över sedan länge.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000001',
    'Étienne', 'Bardot', 'bokhållare',
    'Har skött hotellets räkenskaper i elva år. Lugn, noggrann och den ende som vet exakt hur illa det står till med kassan.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000001',
    'Margot', 'Lefèvre', 'sångerska i hotellets bar',
    'Sjöng på vårbalen. Rousseau hade lovat henne ett kontrakt i höst och tagit tillbaka löftet två gånger.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000005',
    'a0000000-0000-4000-8000-000000000001',
    'Jean-Luc', 'Moreau', 'nattportier',
    'Står i receptionen från tio på kvällen till sex på morgonen. Ser allt, säger ingenting, och hade fått besked om att sägas upp till sommaren.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000006',
    'a0000000-0000-4000-8000-000000000001',
    'Philippe', 'Aumont', 'hotelläkare',
    'Bor på våning tre och tar hand om gästernas krämpor. Hans läkarväska stod olåst i personalrummet hela kvällen.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Tre av dem är nyckelledtrådar (is_key) och krävs för att få anklaga:
-- huvudboken, telefonloggen och fingeravtrycken.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Svit 402',
    'Armand Rousseau hittades klockan 06:20 av städerskan, sittande i fåtöljen vid fönstret. Inga tecken på kamp. Dörren var låst inifrån med nyckeln kvar i låset, fönstret reglat. På bordet stod en konjakskaraff och två glas. Bara det ena hade använts.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Armand Rousseau',
    'Döden inträffade mellan klockan ett och tre på natten. Inga yttre skador. I blodet påvisas digitalis i en mängd som inget hjärta står emot. Rousseau medicinerade inte för hjärtat. Preparatet förvaras i hotellets läkarväska.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Förhör med personalen',
    'Samtliga anställda hördes under förmiddagen. Nattportiern uppger att direktören tog emot ett sent besök men vill inte säga av vem. Bokhållaren Bardot förnekade först att han varit kvar på kontoret efter balen, men ändrade sig när kontorslampan visade sig ha brunnit hela natten.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Nattportiern Jean-Luc Moreau',
    'Tio över två såg jag en man i frack kliva ur hissen på fjärde våningen och ta trapporna ner. Han hade handskar på sig, fast balen var slut sedan en timme. Jag såg inte ansiktet, men han gick som någon som räknar stegen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000005',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Huvudboken från hotellets kontor',
    'Sidorna för januari och februari är omskrivna med nyare bläck. Summorna stämmer inte med bankens besked: 180 000 franc saknas. Marginalanteckningarna är skrivna med bokhållaren Bardots handstil. Längst ner på februarisidan har Rousseau själv skrivit ett datum och strukit under det två gånger: den 15 mars.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000006',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Hotellets växel, natten till den 15 mars',
    '23:40, samtal från kontorets apparat till Banque Rolland i Genève, fyra minuter. 00:15, samtal från samma apparat till svit 402, en minut. Därefter kopplades inga fler samtal den natten.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000007',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på karaffen och glasen',
    'På karaffens hals finns avtryck från Rousseau och från en andra person. Det använda glaset bär Rousseaus avtryck. Det oanvända glaset är torkat rent, vilket ett oanvänt glas sällan är. De främmande avtrycken matchar dem som togs från skrivbordet på hotellets kontor, där bokhållaren Bardot arbetar.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000008',
    'a0000000-0000-4000-8000-000000000001',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Pressfotografens bilder från vårbalen',
    'Fotografen från Le Petit Journal tog fjorton bilder i balsalen mellan midnatt och ett. På tolv av dem syns Colette Rousseau och Margot Lefèvre tillsammans vid orkestern. Bokhållaren Bardot finns med på de första bilderna men saknas på alla som är tagna efter 00:20.',
    false
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och polisrapporten är öppna från början, resten
-- växer fram ur dem. Alla tre nyckelledtrådar går att nå.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån brottsplatsen.
  ('c0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001'),
  -- Vittnesmålet kommer fram under förhören.
  ('c0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000003'),
  -- Huvudboken hittas först när förhören pekar mot kontoret.
  ('c0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000003'),
  -- Telefonloggen begärs ut när huvudboken visar pengar på väg till Genève.
  ('c0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000005'),
  -- Fingeravtrycken kräver både brottsplatsen och giftet i obduktionen.
  ('c0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000002'),
  -- Fotografierna letas fram efter vittnesmålet om mannen i frack.
  ('c0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000004');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000006'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000005'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003'),
  ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000005'),
  ('c0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000003'),
  ('c0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000003'),
  ('c0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000003'),
  ('c0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000002'),
  ('c0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000004'),
  ('c0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000003');
