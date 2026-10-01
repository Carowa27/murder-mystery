-- Datum i en startledtråd per fall, så att spelarna vet vilken dag mordet
-- skedde (issue #174). Spelet visar bara årtalet, inte hela story_date.
-- Halvorsen och Sheung Wan får datumet i polisrapporten, eftersom kroppen
-- där hittas dagen efter story_date. Sheung Wan får också "på fredagen"
-- rättat, eftersom den 9 september 1986 var en tisdag.
--
-- replace gör ingenting när texten redan är ändrad, så filen går att köra
-- flera gånger. Seed-filerna har samma text.

-- Hôtel Le Mont
UPDATE case_clues
SET content = replace(content,
  'Armand Rousseau hittades klockan 06:20 av städerskan, sittande',
  'Armand Rousseau hittades av städerskan klockan 06:20 på morgonen den 15 mars, sittande')
WHERE id = 'c0000000-0000-4000-8000-000000000001';

-- Sovvagn 12
UPDATE case_clues
SET content = replace(content,
  'hittades klockan 05:40 av sovvagnskonduktören',
  'hittades klockan 05:40 på morgonen den 4 mars av sovvagnskonduktören')
WHERE id = 'c0000000-0000-4000-8000-000000000201';

-- Corinthia
UPDATE case_clues
SET content = replace(content,
  'hittades klockan 06:10 av badmästaren',
  'hittades klockan 06:10 på morgonen den 8 mars av badmästaren')
WHERE id = 'c0000000-0000-4000-8000-000000000301';

-- Fyren
UPDATE case_clues
SET content = replace(content,
  'till tornet strax efter klockan ett.',
  'till tornet strax efter klockan ett natten mot den 13 november.')
WHERE id = 'c0000000-0000-4000-8000-000000000401';

-- Ateljé 9
UPDATE case_clues
SET content = replace(content,
  'Vincent Hale föll klockan 21:20 vid fjärde tagningen,',
  'Vincent Hale föll vid fjärde tagningen klockan 21:20 på kvällen den 9 augusti,')
WHERE id = 'c0000000-0000-4000-8000-000000000501';

-- Cirkus Fortuna
UPDATE case_clues
SET content = replace(content,
  'Aurel Bassi föll klockan 21:40, under',
  'Aurel Bassi föll klockan 21:40 den 14 oktober, under')
WHERE id = 'c0000000-0000-4000-8000-000000000601';

-- Studio B
UPDATE case_clues
SET content = replace(content,
  'hittades klockan 17:32 sittande',
  'hittades klockan 17:32 den 30 juli, sittande')
WHERE id = 'c0000000-0000-4000-8000-000000000701';

-- Poggio Vecchio
UPDATE case_clues
SET content = replace(content,
  'hittades klockan 06:30 av skördearbetarna',
  'hittades klockan 06:30 på morgonen den 14 september av skördearbetarna')
WHERE id = 'c0000000-0000-4000-8000-000000000801';

-- Halvorsen, polisrapporten
UPDATE case_clues
SET content = replace(content,
  'Midvinterkvällen firades',
  'Midvinterkvällen den 21 juni firades')
WHERE id = 'c0000000-0000-4000-8000-000000000902';

-- Sheung Wan, brottsplatsrapporten
UPDATE case_clues
SET content = replace(content,
  'stod där på fredagen.',
  'stod där på eftermiddagen.')
WHERE id = 'c0000000-0000-4000-8000-000000001001';

-- Sheung Wan, polisrapporten
UPDATE case_clues
SET content = replace(content,
  'Signal åtta hissades 17:40 och',
  'Signal åtta hissades 17:40 den 9 september och')
WHERE id = 'c0000000-0000-4000-8000-000000001002';
