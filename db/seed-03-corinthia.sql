-- Mysterium 03 för NOCTURNE: Mordet ombord på Corinthia, Nordatlanten 1934.
-- Körs efter schema.sql, i Supabase SQL Editor.
--
-- Svårighetsgrad hard, alltså bara en anklagelse, och fallet är gratis och
-- satt till active. Nio personer, tolv ledtrådar, fem av dem nyckelledtrådar.
-- Kedjan går i två spår från start, ett om hur mordet gick till och ett om
-- varför, och de möts i den sista ledtråden.
--
-- Id:n är hårdkodade för att filen ska gå att köra om. De fyra sista
-- siffrorna är fallets nummer och sedan radens nummer, så 0301 är fall 03,
-- rad 01. Kör den här raden först om du vill börja om (tar med sig
-- karaktärer och ledtrådar):
-- DELETE FROM cases WHERE id = 'a0000000-0000-4000-8000-000000000003';
--
-- Obs: har någon redan startat en omgång på fallet går det inte att radera,
-- eftersom investigations pekar på det. Ta bort omgången först.


-- ============================================================
-- Fallet
-- ============================================================

INSERT INTO cases (id, title, description, location, story_date, difficulty_id, price, stage)
VALUES (
  'a0000000-0000-4000-8000-000000000003',
  'Mordet ombord på Corinthia',
  'Femte natten ut från Southampton hittas bankiren Cornelius Farrow död i simbassängen på C-däck, i pyjamas och morgonrock. Bassängen är tömd till knähöjd och kaklet runt den är torrt. Obduktionen i New York visar att han drunknat i saltvatten, fast bassängen är fylld med sötvatten. Åtta personer ombord hade skäl att vilja se honom gå under, och ingen av dem kunde lämna fartyget.',
  'Atlantångaren Corinthia, Nordatlanten',
  '1934-03-08',
  (SELECT id FROM difficulties WHERE name = 'hard'),
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
    'b0000000-0000-4000-8000-000000000301',
    'a0000000-0000-4000-8000-000000000003',
    'Cornelius', 'Farrow', NULL,
    'Ägare till Farrow Trust, banken som föll 1932 och tog tolv tusen småsparares pengar med sig. Reste till New York för att höras av en kommitté och bar en portfölj han inte lämnade ifrån sig under hela överfarten.',
    true, false
  ),
  (
    'b0000000-0000-4000-8000-000000000302',
    'a0000000-0000-4000-8000-000000000003',
    'Vivien', 'Farrow', 'hustru',
    'Gift med Farrow i fyra år, tidigare revyartist i London. Ärver det som finns kvar, vilket kan vara mycket eller ingenting alls. Kom in från båtdäck strax efter klockan två med en genomblöt kappa.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000303',
    'a0000000-0000-4000-8000-000000000003',
    'Julian', 'Pike', 'privatsekreterare',
    'Har skött Farrows post och kalender i sju år och är den ende som vet vad portföljen innehåller. Sökte i februari plats hos ett annat bankhus och fick nej med hänvisning till sin nuvarande arbetsgivare.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000304',
    'a0000000-0000-4000-8000-000000000003',
    'Ambrose', 'Kell', 'fartygsläkare',
    'Läkare ombord sedan hösten 1932, omtyckt av besättningen och anträffbar dygnet runt. Behandlade Farrows svaga hjärta under resan och skrev dödsattesten redan innan fartyget nådde New York.',
    false, true
  ),
  (
    'b0000000-0000-4000-8000-000000000305',
    'a0000000-0000-4000-8000-000000000003',
    'Tommy', 'Quill', 'badsteward på A-däck',
    'Tjugotvå år och ansvarig för sviternas badrum. Drar upp bad på beställning när som helst på dygnet. Hans far miste huset när Farrow Trust föll och drunknade i Themsen året därpå.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000306',
    'a0000000-0000-4000-8000-000000000003',
    'Ida', 'Brennan', 'medpassagerare i hytt A-9',
    'Änka från Boston som satte mannens hela pensionsförsäkring i Farrow Trust och fick tillbaka fjorton dollar. Reste till London i februari för att söka upp Farrow och fick aldrig komma innanför dörren.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000307',
    'a0000000-0000-4000-8000-000000000003',
    'Cyril', 'Nix', 'radiotelegrafist',
    'Ensam i radiohytten på nattpasset. Säljer i smyg notiser om kända passagerare till en kvällstidning i New York, vilket kostar honom jobbet den dag det kommer fram.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000308',
    'a0000000-0000-4000-8000-000000000003',
    'Hugh', 'Vance', 'förste styrman',
    'Ansvarar för däcken och för nyckeln till grinden vid simbassängen. Lät tömma bassängen till hälften på kvällen på grund av sjögången och gick sin rond klockan tre.',
    false, false
  ),
  (
    'b0000000-0000-4000-8000-000000000309',
    'a0000000-0000-4000-8000-000000000003',
    'Liam', 'Doyle', 'medpassagerare på tredje klass',
    'Nitton år, på väg hem till Queens efter ett år hos släkten i Cork. Påträffades på båtdäck där tredje klass inte har tillträde och vill inte förklara vad han gjorde där.',
    false, false
  );


-- ============================================================
-- Ledtrådar
-- ============================================================

-- Fem nyckelledtrådar (is_key) krävs för att få anklaga: badjournalen,
-- avtrycken i tjänstetrappan, telegramjournalen, Ionia-papperen och
-- förhöret i New York.
INSERT INTO case_clues (id, case_id, clue_type_id, title, content, is_key)
VALUES
  (
    'c0000000-0000-4000-8000-000000000301',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Brottsplatsrapport'),
    'Simbassängen på C-däck',
    'Cornelius Farrow hittades klockan 06:10 av badmästaren, liggande på rygg i bassängen, som stod fylld till knähöjd. Han var klädd i pyjamas och morgonrock, utan tofflor. Kaklet närmast bassängen var torrt och där fanns inga våta avtryck. Däremot går en rad intorkade droppar från dörren till maskinrummet fram till bassängkanten. I morgonrockens ficka låg nyckeln till svit A-4. Grinden till bassängen var låst och nyckeln hängde på sin krok i sportkontoret.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000302',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Fartygsintendentens genomgång',
    'Samtliga i första klass hördes under morgonen. Balen slutade vid midnatt och sjögången höll många vakna. Förste styrman Vance lät tömma bassängen till hälften klockan tio på kvällen och låste grinden efter sig. Från teknikrummet under A-däck går en tjänstetrappa ner till bassängens maskinrum, och den dörren står olåst för personalen. Doktor Kell skrev en dödsattest med olyckshändelse som orsak redan samma morgon, men kaptenen höll inne den efter samtal med rederiet. I fru Brennans hytt hittades en revolver som inte har avlossats. Passageraren Liam Doyle från tredje klass påträffades på båtdäck under natten och vill inte säga vad han gjorde där.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000303',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Obduktionsrapport'),
    'Obduktion av Cornelius Farrow',
    'Döden inträffade mellan klockan ett och tre på natten och orsaken är drunkning. Vattnet i lungorna har samma salthalt som havsvatten och innehåller rester av den tvål som används i första klassens badrum. Bassängen på C-däck är fylld med sötvatten från fartygets tankar. På båda axlarna och på överarmarna finns blåmärken efter ett fast grepp. Pyjamasjackan är knäppt snett, med två knappar i fel hål, vilket sällan blir fallet när en man klär sig själv. Farrows hjärta var svagt sedan flera år, men det är inte det han dog av.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000304',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Badstewarden Tommy Quill',
    'Doktor Kell ringde ner strax efter ett och bad mig dra upp ett varmt saltvattensbad i svit A-4, åt herr Farrow som inte fick någon sömn. Det är inget ovanligt, gamla herrar badar om nätterna när det gungar. Jag fyllde karet och lade fram handdukarna. Då sa doktorn att jag kunde gå och lägga mig, att han stannade hos sin patient. Jag gick. Jag vet vad ni tänker om min far, men jag gick.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000305',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Badjournalen på A-däck',
    'Varje bad förs in med hyttnummer, klockslag och beställare. Natten mot den åttonde mars finns en enda rad: A-4, 01:15, beställt av fartygsläkaren, infört av Quill. Nästa rad är från morgonen därpå. Svit A-4 är Farrows. När intendenten kom dit vid åtta var badkaret torrt och nyskurat, trots att städerskorna ännu inte hunnit till A-däck.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000306',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Fingeravtrycksanalys'),
    'Avtryck i A-4 och i tjänstetrappan',
    'Kranarna i badrummet i A-4 bär Quills avtryck och inga andra. Karets kant och proppkedjan är avtorkade. På räcket i tjänstetrappan mellan A-däck och bassängens maskinrum finns avtryck från tre i besättningen, samtliga med ärende där, och dessutom från doktor Kell. På insidan av handtaget till maskinrummet finns Kells avtryck igen. Fartygsläkaren har inget att göra i den delen av fartyget och uppger själv att han aldrig varit nere vid bassängen.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000307',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Ida Brennan i hytt A-9',
    'Jag sover inte till sjöss. Vid halv två hörde jag dörren till tjänstetrappan gå, och sedan någon som bar något tungt nedför trappan, steg för steg, utan att säga ett ord. Strax efter två kom fru Farrow in från däck med en kappa som var genomblöt. Revolvern tog jag med ombord för att jag ville skrämma honom, och jag skäms inte för det. Men utanför hytten har jag inte varit.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000308',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Vittnesmål'),
    'Vivien Farrow och Julian Pike',
    'Båda uppger att de stod kvar på båtdäck till efter klockan två trots regnet, och båda säger det utan att se upp. Fru Farrow kom in i sviten vid tre, såg att sängen var orörd och antog att mannen satt uppe med sina papper. Pike uppger att Farrow under middagen bad doktor Kell titta upp i sviten efter midnatt, och att läkaren blev tyst en aning för länge innan han svarade ja.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000309',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Övervakningsbilder'),
    'Journalfilmen från balkvällen',
    'Ett filmbolag hade en fotograf ombord som spelade in en kortfilm om överfarten. Rullen från balkvällen är sju minuter lång. I en tagning från båtdäcket strax före midnatt syns Farrow komma ut ur radiohytten med portföljen under armen. På samma rulle står fru Farrow och sekreteraren Pike vid relingen, tätt ihop. I skuggan vid livbåt nummer nio står en ung man i tredje klassens kläder och ser på dansen genom fönstret.',
    false
  ),
  (
    'c0000000-0000-4000-8000-000000000310',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Telefonlogg'),
    'Telegramjournalen i radiohytten',
    'Journalen för den 7 mars: 22:50, inkommande till C. Farrow från en advokat på Wall Street, "kommittén sammanträder den tolfte, ta med allt". 23:55, utgående från C. Farrow till samma advokat, "har Ionia-papperen i portföljen, de byts mot min frihet". 02:40, utgående, betalt kontant av någon ur besättningen utan namn i boken, till en adress i London: "saken från trettioett är ur världen". Telegrafisten Nix uppger först att han sov vid den tiden och ändrar sig sedan.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000311',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Item'),
    'Ionia-papperen i portföljen',
    'Portföljen stod kvar i sviten, olåst och orörd. Överst ligger en dödsattest från ångaren Ionia, daterad i juni 1931: Eleanor Farrow, fyrtiotvå år, hjärtsvikt. Eleanor var Farrows första hustru. Under attesten ligger två sidor anteckningar med samma handstil, där ordet morfin står tre gånger och ett klockslag är understruket. Attesten är undertecknad av fartygsläkaren A. Kelleher. Längst ner ligger tre brev från samme man, det sista skrivet i januari i år, som ber om mer pengar.',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000312',
    'a0000000-0000-4000-8000-000000000003',
    (SELECT id FROM clue_types WHERE name = 'Polisrapport'),
    'Förhör i New York och besked från läkarregistret',
    'Det brittiska läkarregistret har ingen Ambrose Kell före oktober 1932. Alastair Kelleher ströks ur registret i mars samma år efter en fällande dom som rörde morfin. Ett halvår senare ansökte Kelleher om att få tjänstgöra till sjöss under sin mors flicknamn, och fotografiet i ansökan föreställer fartygsläkaren ombord på Corinthia. Sedan han fått se ansökan och avtrycken från tjänstetrappan vägrar han svara på vem som skrev under attesten från Ionia.',
    true
  );


-- ============================================================
-- Upplåsningar
-- ============================================================

-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
-- Brottsplatsrapporten och intendentens genomgång är öppna från början.
-- Spåret 301-303-304-305-306 visar hur mordet gick till, spåret
-- 302-307-308-309-310-311 visar varför, och de möts i 312.
INSERT INTO clue_requirements (clue_id, required_clue_id)
VALUES
  -- Obduktionen beställs utifrån brottsplatsen.
  ('c0000000-0000-4000-8000-000000000303', 'c0000000-0000-4000-8000-000000000301'),
  -- Saltvattnet och tvålen leder till den som drar upp baden.
  ('c0000000-0000-4000-8000-000000000304', 'c0000000-0000-4000-8000-000000000303'),
  -- Journalen begärs ut för att kontrollera stewardens uppgift.
  ('c0000000-0000-4000-8000-000000000305', 'c0000000-0000-4000-8000-000000000304'),
  -- Avtrycken tas i badrummet och i trappan när baden är bekräftade.
  ('c0000000-0000-4000-8000-000000000306', 'c0000000-0000-4000-8000-000000000305'),
  -- Grannen i A-9 hörs efter intendentens första genomgång.
  ('c0000000-0000-4000-8000-000000000307', 'c0000000-0000-4000-8000-000000000302'),
  -- Hustrun och sekreteraren hörs om den blöta kappan.
  ('c0000000-0000-4000-8000-000000000308', 'c0000000-0000-4000-8000-000000000307'),
  -- Filmen letas fram för att pröva deras uppgifter om båtdäcket.
  ('c0000000-0000-4000-8000-000000000309', 'c0000000-0000-4000-8000-000000000308'),
  -- Filmen visar Farrow lämna radiohytten, alltså begärs journalen ut.
  ('c0000000-0000-4000-8000-000000000310', 'c0000000-0000-4000-8000-000000000309'),
  -- Telegrammet om Ionia-papperen pekar på portföljen i sviten.
  ('c0000000-0000-4000-8000-000000000311', 'c0000000-0000-4000-8000-000000000310'),
  -- Sista förhöret kräver både namnet i papperen och avtrycken i trappan.
  ('c0000000-0000-4000-8000-000000000312', 'c0000000-0000-4000-8000-000000000311'),
  ('c0000000-0000-4000-8000-000000000312', 'c0000000-0000-4000-8000-000000000306');


-- ============================================================
-- Vilka ledtrådar handlar om vilka personer
-- ============================================================

INSERT INTO clue_characters (clue_id, character_id)
VALUES
  ('c0000000-0000-4000-8000-000000000301', 'b0000000-0000-4000-8000-000000000301'),
  ('c0000000-0000-4000-8000-000000000301', 'b0000000-0000-4000-8000-000000000308'),
  ('c0000000-0000-4000-8000-000000000302', 'b0000000-0000-4000-8000-000000000308'),
  ('c0000000-0000-4000-8000-000000000302', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000302', 'b0000000-0000-4000-8000-000000000306'),
  ('c0000000-0000-4000-8000-000000000302', 'b0000000-0000-4000-8000-000000000309'),
  ('c0000000-0000-4000-8000-000000000303', 'b0000000-0000-4000-8000-000000000301'),
  ('c0000000-0000-4000-8000-000000000304', 'b0000000-0000-4000-8000-000000000305'),
  ('c0000000-0000-4000-8000-000000000304', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000304', 'b0000000-0000-4000-8000-000000000301'),
  ('c0000000-0000-4000-8000-000000000305', 'b0000000-0000-4000-8000-000000000305'),
  ('c0000000-0000-4000-8000-000000000305', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000306', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000306', 'b0000000-0000-4000-8000-000000000305'),
  ('c0000000-0000-4000-8000-000000000307', 'b0000000-0000-4000-8000-000000000306'),
  ('c0000000-0000-4000-8000-000000000307', 'b0000000-0000-4000-8000-000000000302'),
  ('c0000000-0000-4000-8000-000000000308', 'b0000000-0000-4000-8000-000000000302'),
  ('c0000000-0000-4000-8000-000000000308', 'b0000000-0000-4000-8000-000000000303'),
  ('c0000000-0000-4000-8000-000000000308', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000309', 'b0000000-0000-4000-8000-000000000301'),
  ('c0000000-0000-4000-8000-000000000309', 'b0000000-0000-4000-8000-000000000302'),
  ('c0000000-0000-4000-8000-000000000309', 'b0000000-0000-4000-8000-000000000303'),
  ('c0000000-0000-4000-8000-000000000309', 'b0000000-0000-4000-8000-000000000309'),
  ('c0000000-0000-4000-8000-000000000310', 'b0000000-0000-4000-8000-000000000301'),
  ('c0000000-0000-4000-8000-000000000310', 'b0000000-0000-4000-8000-000000000307'),
  ('c0000000-0000-4000-8000-000000000310', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000311', 'b0000000-0000-4000-8000-000000000301'),
  ('c0000000-0000-4000-8000-000000000311', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000312', 'b0000000-0000-4000-8000-000000000304'),
  ('c0000000-0000-4000-8000-000000000312', 'b0000000-0000-4000-8000-000000000301');
