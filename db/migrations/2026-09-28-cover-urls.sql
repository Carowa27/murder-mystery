-- Omslagsbilder för alla tio fall. Fall 1 hade redan sin URL, den är med här
-- så att filen visar alla omslag på ett ställe.
--
-- Filen körs först när bilderna ligger på main, annars pekar URL:erna på filer
-- som inte finns där än. UPDATE går att köra flera gånger utan att något händer.
--
-- Sökvägarna utgår från public, samma format som Polaroid och kassan använder.

UPDATE cases SET image_url = '/images/1-hotel-le-mont/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000001';

UPDATE cases SET image_url = '/images/2-express-train/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000002';

UPDATE cases SET image_url = '/images/3-ocean-liner/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000003';

UPDATE cases SET image_url = '/images/4-lighthouse/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000004';

UPDATE cases SET image_url = '/images/5-film-studio/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000005';

UPDATE cases SET image_url = '/images/6-circus/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000006';

UPDATE cases SET image_url = '/images/7-tv-studio/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000007';

UPDATE cases SET image_url = '/images/8-vineyard/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000008';

UPDATE cases SET image_url = '/images/9-antarctic-station/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000009';

UPDATE cases SET image_url = '/images/10-hong-kong/cover.webp'
WHERE id = 'a0000000-0000-4000-8000-000000000010';
