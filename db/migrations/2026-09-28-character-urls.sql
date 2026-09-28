-- Bilder på karaktärerna i fall 1 och 2. Fall 3-10 har bara omslag, deras
-- karaktärer behåller image_url NULL.
--
-- Filen körs först när bilderna ligger på main, annars pekar URL:erna på filer
-- som inte finns där än. UPDATE går att köra flera gånger utan att något händer.
--
-- Sökvägarna utgår från public, samma format som Polaroid och kassan använder.

-- Fall 1, Mordet på Hôtel Le Mont
UPDATE characters SET image_url = '/images/1-hotel-le-mont/characters/armand-rousseau.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000001';

UPDATE characters SET image_url = '/images/1-hotel-le-mont/characters/colette-rousseau.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000002';

UPDATE characters SET image_url = '/images/1-hotel-le-mont/characters/etienne-bardot.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000003';

UPDATE characters SET image_url = '/images/1-hotel-le-mont/characters/margot-lefevre.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000004';

UPDATE characters SET image_url = '/images/1-hotel-le-mont/characters/jean-luc-moreau.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000005';

UPDATE characters SET image_url = '/images/1-hotel-le-mont/characters/philippe-aumont.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000006';

-- Fall 2, Mordet i sovvagn 12
UPDATE characters SET image_url = '/images/2-express-train/characters/viktor-halasz.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000201';

UPDATE characters SET image_url = '/images/2-express-train/characters/ilona-kadar.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000202';

UPDATE characters SET image_url = '/images/2-express-train/characters/klara-varnay.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000203';

UPDATE characters SET image_url = '/images/2-express-train/characters/stefan-novak.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000204';

UPDATE characters SET image_url = '/images/2-express-train/characters/emil-brandt.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000205';

UPDATE characters SET image_url = '/images/2-express-train/characters/sofia-doukas.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000206';

UPDATE characters SET image_url = '/images/2-express-train/characters/petar-mihajlovic.webp'
WHERE id = 'b0000000-0000-4000-8000-000000000207';
