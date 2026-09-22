-- Mysterium 07 för NOCTURNE: Mordet under finalen, London 1966.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad intermediate, alltså två anklagelser. Fallet kostar pengar
-- och ingår inte i gratisnivån. Sju personer, tio ledtrådar, fyra av dem
-- nyckelledtrådar.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0701 är fall 07,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000007';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, is_free, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000007',
  'Mordet under finalen',
  'London, den 30 juli 1966. Hela huset samlas kring tv-apparaten i kantinen för att se finalen, och Studio B står tom och mörk. När personalen kommer tillbaka efter slutsignalen sitter producenten Gerald Prentice död vid programledarbordet med en bränd handflata. Bordsmikrofonen förde ström. Alla säger att de såg matchen tillsammans, och en av dem ljuger om det tredje målet.',
  'Meridian Television, Studio B, London',
  '1966-07-30',
  (SELECT id FROM difficulties WHERE name = 'intermediate'),
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
    'b0000000-0000-4000-8000-000000000701',
    'a0000000-0000-4000-8000-000000000007',
    'Gerald', 'Prentice', NULL,
    'Producent för aktualitetsprogrammet Spotlight och den som avgör vad som sänds. Satte sitt namn på andras arbete i tjugo år och blev lovad en plats i bolagets styrelse i höst.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000702',
    'a0000000-0000-4000-8000-000000000007',
    'Sylvia', 'Cross', 'redaktör på Spotlight',
    'Har grävt i ett bostadsbolags ockerhyror och vräkningar i Hackney i ett och ett halvt år och skrivit varje rad i programmet. Utbildad radiomekaniker under sin tid i flygvapnet och lagar sina apparater själv.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000703',
    'a0000000-0000-4000-8000-000000000007',
    'Dennis', 'Ware', 'ljudtekniker',
    'Sköter mikrofoner och bandspelare i båda studiorna. Klagade skriftligt på husets eldragning i mars och fick svaret att det får vänta till ombyggnaden.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000704',
    'a0000000-0000-4000-8000-000000000007',
    'Alec', 'Pargiter', 'belysningsmästare',
    'Ansvarar för lamporna i Studio B och har nycklar till alla eltavlor i huset. Blev förbigången när Prentice gav ett fast arbete till en yngre man i våras.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000705',
    'a0000000-0000-4000-8000-000000000007',
    'Roland', 'Beech', 'verkställande direktör',
    'Driver Meridian Television och äter lunch med de bolag som programmet granskar. Hade bett Prentice lägga ner Hackney-programmet, vilket han fick igenom på torsdagen.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000706',
    'a0000000-0000-4000-8000-000000000007',
    'Michael', 'Tarrant', 'programledare',
    'Sitter vid bordet i Studio B fyra kvällar i veckan och läser det Cross har skrivit. Har fått höra av Prentice att kontraktet inte förlängs efter årsskiftet.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000707',
    'a0000000-0000-4000-8000-000000000007',
    'Kitty', 'Nolan', 'sekreterare på redaktionen',
    'Skriver ut allt som sägs i redaktionsrummet och för husets besökslista tillsammans med portvakten. Håller reda på var alla är, utom den här eftermiddagen.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Fyra nyckelledtrådar (is_key) krävs för att få anklaga: bandet från
-- kontrollrummet, vittnesmålen om det tredje målet, avtrycken i
-- mikrofonkontakten och researchpärmen.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000701',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Studio B',
    'Gerald Prentice hittades klockan 17:32 sittande vid programledarbordet, framåtlutad med höger hand kvar på bordsmikrofonens fot. Handflatan är bränd i ett band tvärs över. Studion var mörklagd så när som på arbetsbelysningen. Mikrofonens hölje är av metall och står på en fot som är skruvad i bordsskivan. Kontakten i bordets uttag sitter löst och dess två skruvar har färska märken efter en skruvmejsel. Ingenting i rummet är stulet eller flyttat.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000702',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Metropolitan Police, första genomgången',
    'Huset hade ingen sändning den eftermiddagen och tolv anställda var i tjänst. Samtliga uppger att de såg finalen på apparaten i kantinen, två trappor upp från Studio B. Portvakten har fört in alla som passerat porten och ingen utomstående finns i boken efter klockan tolv. Prentice sågs senast i kantinen när ordinarie tid tog slut och sade då att han skulle ner och ringa ostört innan förlängningen började. Dörren till Studio B saknar lås och studion användes inte den dagen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000703',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Gerald Prentice',
    'Dödsorsaken är strömgenomgång. Strömmen har gått in genom höger handflata och ut genom vänster underarm där den vilat mot bordets metallkant. Döden inträffade inom sekunder. Brännmärket i handflatan har samma bredd som mikrofonfotens kant. Tidpunkten kan utifrån kroppstemperaturen sättas till mellan klockan fyra och halv sex på eftermiddagen. Hjärtat var friskt och inga andra skador finns.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000704',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Ljudteknikern Dennis Ware',
    'Mikrofonen fungerade när jag provade den vid tolv, det gör jag varje dag oavsett om vi sänder eller inte. Vem som helst med en skruvmejsel kan öppna kontakten, det är fyra ledare och två skruvar. Korsar man skärmen mot fasen på arbetslampans uttag blir höljet strömförande, och då räcker det att ta i foten. Bandspelaren i kontrollrummet stod och gick hela eftermiddagen, för sportredaktionen ville ha kommentatorn från apparaten inspelad.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000705',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Bandet från kontrollrummet',
    'Bandspelaren spelade in ljudet från kantinens apparat via en ledning, tre timmar i sträck. Vid 17:04 hörs kommentatorn ropa ut det tredje målet och publiken på Wembley. En och en halv sekund senare hörs i bakgrunden ett skarpt knäpp och ett kort skrik från en man, båda ur studiomikrofonen som stod öppen mot bandet. Därefter hörs ingenting mer därifrån. Bandet placerar alltså dödsögonblicket vid 17:04.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000706',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'De elva i kantinen om det tredje målet',
    'Samtliga elva har hörts om vad som hände vid det tredje målet. Tio av dem beskriver samma sak: att rummet först skrek till, att linjemannen tillfrågades och att två av dem grälade i tio minuter om huruvida bollen var inne. Sylvia Cross svarar att målet dömdes genast och att ingen sa emot. Hon uppger att hon satt längst bak vid dörren hela tiden. Två personer minns att stolen längst bak stod tom under förlängningen, men ingen tittade åt det hållet.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000707',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck i mikrofonkontakten',
    'Kontaktens utsida är avtorkad och bär inga användbara avtryck. På insidan av höljet, på den yta som bara syns när de två skruvarna är lossade, sitter tre avtryck från en vänster hand. De matchar Sylvia Cross. Skruvmejseln i redaktionsrummets låda har samma spår som märkena på skruvarna och bär avtryck från flera, bland dem Cross. På arbetslampans uttag finns avtryck från Pargiter, som byter lampor där varje vecka.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000708',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Växelns samtalsbok, veckan före finalen',
    'Den 28 juli 14:10, från Prentices anknytning till bostadsbolagets kontor i City, sju minuter. Samma dag 16:20, från Beechs rum till Prentices anknytning, en minut. Den 28 juli 18:05, från Sylvia Cross anknytning till ett sjukhus i Hackney, tolv minuter. Den 29 juli 09:15, inkommande till Cross anknytning från samma sjukhus, två minuter. Den 30 juli 16:52, utgående från Studio B:s apparat till bostadsbolagets direktör i hans bostad, fyra minuter.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000709',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Personaltidningens bilder från kantinen',
    'Husets fotograf gick runt med kameran under matchen för att göra ett uppslag i personaltidningen och tog fyrtiosex bilder, alla med klockan på kantinens vägg i bild. Sylvia Cross finns med på bilderna fram till 16:47 och sedan först igen på en bild tagen 17:22. Stolen längst bak vid dörren står tom på varje bild däremellan. Alla övriga tio finns med på minst en bild under hela förlängningen.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000710',
    'a0000000-0000-4000-8000-000000000007',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Researchpärmen om Hackney',
    'Pärmen låg i Sylvia Cross skrivbord och innehåller arton månaders arbete: hyreskvitton, fotografier av trapphus, namn på fjorton familjer som vräkts. Överst ligger en lapp från Prentice, daterad den 28 juli: "Programmet läggs ner. Materialet arkiveras. G.P." Sist i pärmen ligger ett brev från en av de vräkta, Doreen Keane, som skriver att hon inte orkar mer. Doreen Keane avled på sjukhuset i Hackney den 28 juli.',
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
  ('c0000000-0000-4000-8000-000000000703', 'c0000000-0000-4000-8000-000000000701'),
  -- Ljudteknikern hörs om mikrofonen när polisen gått igenom huset.
  ('c0000000-0000-4000-8000-000000000704', 'c0000000-0000-4000-8000-000000000702'),
  -- Han nämner bandspelaren, och då hämtas bandet.
  ('c0000000-0000-4000-8000-000000000705', 'c0000000-0000-4000-8000-000000000704'),
  -- Med dödsögonblicket satt till målet kan alla höras om just den stunden.
  ('c0000000-0000-4000-8000-000000000706', 'c0000000-0000-4000-8000-000000000705'),
  -- Avtrycken kräver både skadan i obduktionen och tiden från bandet.
  ('c0000000-0000-4000-8000-000000000707', 'c0000000-0000-4000-8000-000000000703'),
  ('c0000000-0000-4000-8000-000000000707', 'c0000000-0000-4000-8000-000000000705'),
  -- Den som svarar fel om målet får sin vecka genomgången i växelboken.
  ('c0000000-0000-4000-8000-000000000708', 'c0000000-0000-4000-8000-000000000706'),
  -- Samtalen till sjukhuset gör det värt att leta efter bilder på henne.
  ('c0000000-0000-4000-8000-000000000709', 'c0000000-0000-4000-8000-000000000708'),
  -- Pärmen hämtas ur hennes skrivbord när tomrummet i bilderna är klart.
  ('c0000000-0000-4000-8000-000000000710', 'c0000000-0000-4000-8000-000000000709');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000701', 'b0000000-0000-4000-8000-000000000701'),
  ('c0000000-0000-4000-8000-000000000702', 'b0000000-0000-4000-8000-000000000701'),
  ('c0000000-0000-4000-8000-000000000702', 'b0000000-0000-4000-8000-000000000707'),
  ('c0000000-0000-4000-8000-000000000703', 'b0000000-0000-4000-8000-000000000701'),
  ('c0000000-0000-4000-8000-000000000704', 'b0000000-0000-4000-8000-000000000703'),
  ('c0000000-0000-4000-8000-000000000704', 'b0000000-0000-4000-8000-000000000704'),
  ('c0000000-0000-4000-8000-000000000705', 'b0000000-0000-4000-8000-000000000701'),
  ('c0000000-0000-4000-8000-000000000705', 'b0000000-0000-4000-8000-000000000703'),
  ('c0000000-0000-4000-8000-000000000706', 'b0000000-0000-4000-8000-000000000702'),
  ('c0000000-0000-4000-8000-000000000706', 'b0000000-0000-4000-8000-000000000707'),
  ('c0000000-0000-4000-8000-000000000707', 'b0000000-0000-4000-8000-000000000702'),
  ('c0000000-0000-4000-8000-000000000707', 'b0000000-0000-4000-8000-000000000704'),
  ('c0000000-0000-4000-8000-000000000708', 'b0000000-0000-4000-8000-000000000701'),
  ('c0000000-0000-4000-8000-000000000708', 'b0000000-0000-4000-8000-000000000705'),
  ('c0000000-0000-4000-8000-000000000708', 'b0000000-0000-4000-8000-000000000702'),
  ('c0000000-0000-4000-8000-000000000709', 'b0000000-0000-4000-8000-000000000702'),
  ('c0000000-0000-4000-8000-000000000710', 'b0000000-0000-4000-8000-000000000702'),
  ('c0000000-0000-4000-8000-000000000710', 'b0000000-0000-4000-8000-000000000701');
