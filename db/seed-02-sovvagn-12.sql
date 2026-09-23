-- Mysterium 02 för NOCTURNE: Mordet i sovvagn 12, expresståget mot Istanbul 1936.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad intermediate, gratis och satt till active, så det går att
-- spela direkt. Sju personer, tio ledtrådar, fyra av dem nyckelledtrådar.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. Mönstret är samma som
-- i mockup-seed.sql, men de fyra sista siffrorna är fallets nummer och sedan
-- radens nummer: 0201 är fall 02, rad 01. Kör den här raden först om du vill
-- börja om (tar med sig karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000002';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000002',
  'Mordet i sovvagn 12',
  'Natten mot den fjärde mars 1936 kör expresståget från Wien in i en snödriva tjugo kilometer norr om Niš och blir stående. När plogen kommer fram i gryningen ligger konsthandlaren Viktor Halász död i kupé 5, och den förseglade lådan han vaktat hela vägen från Budapest är tom. Snön runt vagnarna är orörd, så den som gjorde det sitter kvar ombord.',
  'Sovvagn 12, expresståget mot Istanbul',
  '1936-03-04',
  (SELECT id FROM difficulties WHERE name = 'intermediate'),
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
    'b0000000-0000-4000-8000-000000000201',
    'a0000000-0000-4000-8000-000000000002',
    'Viktor', 'Halász', NULL,
    'Konsthandlare från Budapest, på väg till en köpare i Istanbul med en ikon i en förseglad låda. Reste alltid ensam med lådan och lät ingen bära den åt honom.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000202',
    'a0000000-0000-4000-8000-000000000002',
    'Ilona', 'Kádár', 'kompanjon',
    'Halász delägare sedan sex år och den som sköter firmans papper. Grälade med honom i restaurangvagnen på kvällen, högt nog för att tre bord skulle höra. Hon tar över affären nu.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000203',
    'a0000000-0000-4000-8000-000000000002',
    'Klara', 'Varnay', 'medresenär i kupé 6',
    'Pianist, tjugofyra år, på väg till en konsertturné i Istanbul. Steg på i Budapest med en enda liten väska. Säger att hon aldrig växlat ett ord med Halász.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000204',
    'a0000000-0000-4000-8000-000000000002',
    'Stefan', 'Novak', 'medresenär i kupé 7',
    'Läkare från Zagreb på väg hem från en kongress. Har sin läkarväska med sig och skrev ut ett sömnmedel åt Halász vid middagen, på Halász egen begäran.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000205',
    'a0000000-0000-4000-8000-000000000002',
    'Emil', 'Brandt', 'medresenär i kupé 8',
    'Tysk ingenjör med en nyinköpt Leica som han provar på varje perrong. Satt kvar i restaurangvagnen tills den stängde och pratade mest om kameran.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000206',
    'a0000000-0000-4000-8000-000000000002',
    'Sofia', 'Doukas', 'medresenär i kupé 9',
    'Änka från Thessaloniki som reser mellan sina söner två gånger om året. Sover lätt, vaknar av allt och för anteckningar om tågets förseningar.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000207',
    'a0000000-0000-4000-8000-000000000002',
    'Petar', 'Mihajlović', 'sovvagnskonduktör',
    'Sköter vagnen ensam från Budapest till Sofia och har huvudnyckeln till alla kupéer. Spelade bort en månadslön i Wien och har bett om förskott två gånger i vinter.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Fyra nyckelledtrådar (is_key) krävs för att få anklaga: gardinsnöret,
-- fingeravtrycken, telegrafjournalen och tidningsurklippet.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000201',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Kupé 5',
    'Viktor Halász hittades klockan 05:40 av sovvagnskonduktören, liggande på den nedfällda britsen i skjorta och väst. Kupédörren var olåst, fönstret stängt och igensnöat. På fällbordet stod en konjakskupa med en skvätt kvar i botten. Resväskan var uppbruten med ett trubbigt verktyg och den förseglade trälådan låg tom på golvet. På mattan intill britsen låg ett avklippt mörkblått sidensnöre.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000202',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Gendarmeriets avspärrning vid Niš',
    'Tåget blev stående 02:10 och plogen nådde fram först 07:20. Snön runt vagnarna var orörd, inga spår varken till eller från tåget. Sovvagn 12 har nio kupéer, sex av dem belagda: kupé 3 Ilona Kádár, kupé 5 Viktor Halász, kupé 6 Klara Varnay, kupé 7 doktor Stefan Novak, kupé 8 Emil Brandt, kupé 9 Sofia Doukas. Konduktören Petar Mihajlović höll till i tjänstekupén längst fram. I snön under korridorsfönstret mellan kupé 6 och 7 låg en tom medicinflaska med doktor Novaks etikett.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000203',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Viktor Halász',
    'Döden inträffade mellan klockan två och halv fyra på natten. Halász ströps med ett mjukt band omkring fem millimeter brett, utan grova fibrer. Inga skador på händer eller underarmar, alltså inget försök att värja sig. I blodet finns veronal i en mängd som ger tung sömn men inte död. Mängden motsvarar flera doser, inte den enda tablett en läkare skriver ut till natten.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000204',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Konduktören Petar Mihajlović',
    'När vi blivit stående gick jag min runda vid halv tre. Utanför kupé 5 hörde jag ingenting. Korridorsfönstret mellan kupé 6 och 7 stod öppet en glipa i femton graders kyla, och jag stängde det. På väg tillbaka mötte jag fröken Varnay i korridoren, fullt påklädd med kappan knäppt, och hon sa att hon inte kunde sova i stillheten. Klockan var då tio minuter i tre.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000205',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Gardinsnöret i kupé 6',
    'I kupé 6 saknar den inre gardinen sitt uppfästningssnöre, och stumpen som sitter kvar i öglan har en ren snittyta. Snöret som låg på golvet i kupé 5 är av samma mörkblå siden och samma bredd, och ändarna passar mot stumpen. Konduktören uppger att snörena sitter fast i en ögla och inte går att lossa för hand. I necessären i kupé 6 ligger en nagelsax.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000206',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Sofia Doukas i kupé 9',
    'Jag vaknar alltid när tåget stannar, och sedan blir jag liggande. Dörren till kupé 6 gick två gånger den natten, en gång strax efter två och en gång långt senare. Emellan hörde jag fönstret i korridoren. På kvällen såg jag samma unga kvinna stå kvar i korridoren utanför restaurangvagnen och lyssna på grälet mellan Halász och hans kompanjon, fast hon inte hade något ärende dit.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000207',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck på kupan, lådan och flaskan',
    'Konjakskupan bär Halász avtryck och en andra uppsättning från en mindre hand. Trälådans lock är avtorkat, liksom låset på resväskan. Medicinflaskan i snön saknar avtryck helt, trots att doktor Novak uppger att han hanterat den dagligen i en vecka. Den andra uppsättningen på kupan matchar avtrycken från vattenglaset i kupé 6.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000208',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Telegrafjournalen i Budapest Keleti',
    'Två telegram lämnades in vid luckan på avgångskvällen den 3 mars. 18:12, avsändare V. Halász, till Pera Palace i Istanbul: "varan i min hand, priset står fast, ankomst den femte". 18:40, kontant betalt utan namn i kundboken, till en advokatbyrå på Schottenring i Wien: "det blir i natt, sköt om mor, K. Wenzel". Stationen i Niš har inga utgående telegram sedan tåget blev stående.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000209',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Brandts bilder från perrongen i Budapest',
    'Emil Brandt provade sin nya Leica på perrongen och tog elva bilder medan vagnarna fylldes. På fyra av dem syns Halász vid vagn 12 med lådan under armen. På den sjunde står en kvinna i mörk kappa tätt intill honom och han håller hennes handled. Kvinnan är Klara Varnay, som i förhör sagt att hon aldrig växlat ett ord med honom. På den åttonde bilden går hon mot vagnen ensam, och lådan syns inte längre i Halász hand.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000210',
    'a0000000-0000-4000-8000-000000000002',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Urklipp ur Wiener Zeitung, november 1931',
    'Notisen handlar om konsthandlaren Anton Wenzel, som tog sitt liv i november 1931. En samling ikoner han köpt av Viktor Halász hade visat sig vara kopior, och firman gick i konkurs på hösten. Wenzel efterlämnar hustru och dotter. Dottern Klara, nitton år, är elev vid musikakademien. Advokatbyrån som förde dödsboets talan låg på Schottenring. Urklippet låg hopvikt i passfodralet i kupé 6, tillsammans med ett fotografi av en äldre man utanför en butik i Wien.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och polisrapporten är öppna från början.
-- Alla fyra nyckelledtrådar går att nå.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån brottsplatsen.
  ('c0000000-0000-4000-8000-000000000203', 'c0000000-0000-4000-8000-000000000201'),
  -- Konduktören hörs när gendarmeriet gått igenom vagnen.
  ('c0000000-0000-4000-8000-000000000204', 'c0000000-0000-4000-8000-000000000202'),
  -- Snöret spåras först när man vet att det är mordvapnet och vem som var vaken.
  ('c0000000-0000-4000-8000-000000000205', 'c0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000205', 'c0000000-0000-4000-8000-000000000204'),
  -- Doukas hörs efter konduktörens berättelse om korridoren.
  ('c0000000-0000-4000-8000-000000000206', 'c0000000-0000-4000-8000-000000000204'),
  -- Avtrycken tas efter obduktionen, när veronalen gör flaskan intressant.
  ('c0000000-0000-4000-8000-000000000207', 'c0000000-0000-4000-8000-000000000203'),
  -- Telegrammen begärs ut när Doukas placerar henne vid grälet.
  ('c0000000-0000-4000-8000-000000000208', 'c0000000-0000-4000-8000-000000000206'),
  -- Brandts bilder letas fram för att se vem hon egentligen är.
  ('c0000000-0000-4000-8000-000000000209', 'c0000000-0000-4000-8000-000000000208'),
  -- Urklippet hittas vid husrannsakan i kupé 6, som bilderna och snöret motiverar.
  ('c0000000-0000-4000-8000-000000000210', 'c0000000-0000-4000-8000-000000000209'),
  ('c0000000-0000-4000-8000-000000000210', 'c0000000-0000-4000-8000-000000000205');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000201', 'b0000000-0000-4000-8000-000000000201'),
  ('c0000000-0000-4000-8000-000000000202', 'b0000000-0000-4000-8000-000000000204'),
  ('c0000000-0000-4000-8000-000000000202', 'b0000000-0000-4000-8000-000000000207'),
  ('c0000000-0000-4000-8000-000000000203', 'b0000000-0000-4000-8000-000000000201'),
  ('c0000000-0000-4000-8000-000000000203', 'b0000000-0000-4000-8000-000000000204'),
  ('c0000000-0000-4000-8000-000000000204', 'b0000000-0000-4000-8000-000000000207'),
  ('c0000000-0000-4000-8000-000000000204', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000205', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000205', 'b0000000-0000-4000-8000-000000000207'),
  ('c0000000-0000-4000-8000-000000000206', 'b0000000-0000-4000-8000-000000000206'),
  ('c0000000-0000-4000-8000-000000000206', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000206', 'b0000000-0000-4000-8000-000000000202'),
  ('c0000000-0000-4000-8000-000000000207', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000207', 'b0000000-0000-4000-8000-000000000201'),
  ('c0000000-0000-4000-8000-000000000207', 'b0000000-0000-4000-8000-000000000204'),
  ('c0000000-0000-4000-8000-000000000208', 'b0000000-0000-4000-8000-000000000201'),
  ('c0000000-0000-4000-8000-000000000208', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000209', 'b0000000-0000-4000-8000-000000000205'),
  ('c0000000-0000-4000-8000-000000000209', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000209', 'b0000000-0000-4000-8000-000000000201'),
  ('c0000000-0000-4000-8000-000000000210', 'b0000000-0000-4000-8000-000000000203'),
  ('c0000000-0000-4000-8000-000000000210', 'b0000000-0000-4000-8000-000000000201');
