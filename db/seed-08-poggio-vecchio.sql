-- Mysterium 08 för NOCTURNE: Mordet i jäskaret, Chianti 1971.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad beginner, alltså tre anklagelser. Fallet kostar pengar och
-- ingår inte i gratisnivån. Sex personer, åtta ledtrådar, en per typ, tre av
-- dem nyckelledtrådar.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0801 är fall 08,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000008';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, is_free, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000008',
  'Mordet i jäskaret',
  'Chianti, september 1971, mitt under skörden. På morgonen hittas den unge ägaren Piero Ferrante död på botten av kar fyra, med ficklampan fortfarande lysande i handen. Koldioxiden från jäsningen samlas på botten av tomma kar, och den som går ner utan fläkt kommer inte upp igen. Fläktens stickpropp låg bredvid uttaget och stegen låg femton meter bort.',
  'Vingården Poggio Vecchio, Chianti',
  '1971-09-14',
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
    'b0000000-0000-4000-8000-000000000801',
    'a0000000-0000-4000-8000-000000000008',
    'Piero', 'Ferrante', NULL,
    'Tjugonio år och ägare till Poggio Vecchio sedan faderns död i vintras. Lämnade ett kontorsarbete i Milano för att ta över gården och började genast räkna på lager och leveranser.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000802',
    'a0000000-0000-4000-8000-000000000008',
    'Lucia', 'Ferrante', 'mor',
    'Änka sedan i vintras och van vid att gården sköts som den alltid har skötts. Tycker att sonen kränkte gamla Ricci genom att gå igenom hans papper.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000803',
    'a0000000-0000-4000-8000-000000000008',
    'Renata', 'Ferrante', 'syster',
    'Tjugosex år och bosatt i Florens. Äger halva gården med sin bror och vill sälja alltihop till ett bolag som köper upp åsarna på andra sidan dalen.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000804',
    'a0000000-0000-4000-8000-000000000008',
    'Nando', 'Ricci', 'källarmästare',
    'Har skött källaren sedan han var pojke och tjänat tre generationer Ferrante. Är den ende som har nycklar till bakporten och den ende som skriver i leveransboken.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000805',
    'a0000000-0000-4000-8000-000000000008',
    'Elena', 'Barducci', 'enolog',
    'Anställd av Piero i våras, utbildad i Florens och den första utifrån som fått säga något om vinet. Har legat i konflikt med Ricci sedan första veckan om allt från jästtemperatur till städning.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000806',
    'a0000000-0000-4000-8000-000000000008',
    'Marco', 'Sarti', 'traktorförare',
    'Tjugofem år, brorson till Ricci och uppvuxen på gården. Kör druvorna från åsen till källaren under skörden och gör det farbrodern ber honom om utan att fråga varför.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Tre nyckelledtrådar (is_key) krävs för att få anklaga: stegen, samtalen
-- från kontoret och avtrycken.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000801',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Kar fyra',
    'Piero Ferrante hittades klockan 06:30 av skördearbetarna, liggande på botten av kar fyra, som tömdes och skulle skuras. Ficklampan i hans hand lyste fortfarande. Manluckan i karets sida står alltid öppen när ett kar ska skuras, men nu var den stängd och reglad utifrån. Fläkten som blåser ut koldioxid ur tomma kar stod på golvet med stickproppen bredvid uttaget. Aluminiumstegen låg på golvet vid motsatta väggen, femton meter bort. I grannkaret jäste årets skörd för fullt.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000802',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Carabinieri i Greve, första genomgången',
    'Under skörden arbetar folk i källaren dygnet runt, eftersom skalhatten måste stötas ner var fjärde timme. Nio säsongsarbetare sover i längan bakom huset, familjen i huvudbyggnaden och Ricci i sin egen stuga vid bakporten. Gårdens regel är att ingen går ner i ett kar ensam, och den regeln skrev Pieros far själv upp på väggen. Bakporten mot grusvägen hålls låst och nyckeln finns hos källarmästaren. Ingen har hört något ovanligt under natten.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000803',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Piero Ferrante',
    'Dödsorsaken är syrebrist i en miljö med hög halt koldioxid. Döden inträffade mellan klockan tio på kvällen och ett på natten, alltså fem till åtta timmar innan han hittades. På höger underarm finns ett färskt skrapsår med spår av aluminium. Inga andra skador. Under naglarna finns vinsten från karets insida, alltså de kristaller som sätter sig på väggen, vilket tyder på att han försökt ta sig uppför den släta ytan.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000804',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Enologen Elena Barducci',
    'Jag gick förbi källaren vid halv elva på kvällen och såg ljus därinne. Fläkten gick, det hörs över hela gården när den går. När jag kom tillbaka från längan vid elva var det tyst, och jag tänkte att han gått och lagt sig. Piero hade sagt vid middagen att han skulle ner och titta på kar fyra innan det skurades. Han sa det rakt ut vid bordet, så alla vid bordet hörde det.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000805',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Aluminiumstegen',
    'Stegen är det enda sättet att ta sig upp ur ett tomt kar. Den låg femton meter från kar fyra, och i kalkdammet på golvet syns var den stått: tätt intill karets kant, med fötterna i två tydliga märken. Spåren efter att den dragits därifrån går åt sidan, inte mot förrådet där den hör hemma. På stegens övre steg finns färg från karets kant, och på Pieros underarm finns aluminium från samma steg. Han gick alltså ner för den, och någon flyttade den efteråt.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000806',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Samtalen från gårdskontoret',
    'Den 6 september, utgående till ett analyslaboratorium i Siena, nio minuter, begärt av Piero Ferrante. Den 9 september, inkommande från samma laboratorium, fyra minuter. Den 13 september klockan 11:20, utgående till konsortiets kontor i Florens, sex minuter, begärt av Piero. Den 13 september klockan 21:40, utgående till en åkerifirma i Barletta i Puglia, tre minuter, ringt från kontorets apparat efter att kontoret stängt. Laboratoriet uppger att Piero beställt en analys av fem fat ur förra årets lager.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000807',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Den franske köparens diabilder',
    'En vinhandlare från Bordeaux besökte gården den 13 september och fotograferade skörden för sin katalog. På bild nitton, tagen 18:40 från terrassen, syns bakporten öppen och en tankbil med registreringsskylt från Bari stå innanför. På bild tjugo lastas en slang från tankbilen in genom källarens sidodörr. På bild tjugoett står Nando Ricci vid bilens förarhytt med leveransboken i handen. Gården köper inte in vin utifrån.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000808',
    'a0000000-0000-4000-8000-000000000008',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på manluckan och på fläkten',
    'Manluckans regel är avtorkad på utsidan, men på undersidan av handtaget, där en trasa inte kommer åt, sitter avtryck från Nando Ricci. På fläktens strömbrytare finns samma sak: rent ovanpå, avtryck undertill. Stickproppen bär inga avtryck alls. På stegens sidostycken finns avtryck från Piero Ferrante, från Marco Sarti som bar dit den på morgonen och från Ricci. Ricci har uppgett att han inte var i källaren efter klockan nio den kvällen.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och carabinieris genomgång är öppna från början.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån brottsplatsen.
  ('c0000000-0000-4000-8000-000000000803', 'c0000000-0000-4000-8000-000000000801'),
  -- Enologen hörs när gårdens rutiner under skörden är genomgångna.
  ('c0000000-0000-4000-8000-000000000804', 'c0000000-0000-4000-8000-000000000802'),
  -- Hennes uppgift om fläkten gör stegen värd att undersöka.
  ('c0000000-0000-4000-8000-000000000805', 'c0000000-0000-4000-8000-000000000804'),
  -- Samtalslistan begärs ut från gårdskontoret.
  ('c0000000-0000-4000-8000-000000000806', 'c0000000-0000-4000-8000-000000000802'),
  -- Samtalet till åkeriet i Puglia gör det värt att se besökarens bilder.
  ('c0000000-0000-4000-8000-000000000807', 'c0000000-0000-4000-8000-000000000806'),
  -- Avtrycken kräver dödstiden från obduktionen och spåren efter stegen.
  ('c0000000-0000-4000-8000-000000000808', 'c0000000-0000-4000-8000-000000000803'),
  ('c0000000-0000-4000-8000-000000000808', 'c0000000-0000-4000-8000-000000000805');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000801', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000802', 'b0000000-0000-4000-8000-000000000804'),
  ('c0000000-0000-4000-8000-000000000802', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000803', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000804', 'b0000000-0000-4000-8000-000000000805'),
  ('c0000000-0000-4000-8000-000000000804', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000805', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000805', 'b0000000-0000-4000-8000-000000000806'),
  ('c0000000-0000-4000-8000-000000000806', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000806', 'b0000000-0000-4000-8000-000000000804'),
  ('c0000000-0000-4000-8000-000000000807', 'b0000000-0000-4000-8000-000000000804'),
  ('c0000000-0000-4000-8000-000000000808', 'b0000000-0000-4000-8000-000000000804'),
  ('c0000000-0000-4000-8000-000000000808', 'b0000000-0000-4000-8000-000000000801'),
  ('c0000000-0000-4000-8000-000000000808', 'b0000000-0000-4000-8000-000000000806');
