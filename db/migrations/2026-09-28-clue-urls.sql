-- Bilder på ledtrådarna i fall 1 och 2. Rapporter och vittnesmål har ingen
-- bild, och fall 3-10 har bara omslag. De ledtrådarna behåller image_url NULL.
--
-- Filen körs först när bilderna ligger på main, annars pekar URL:erna på filer
-- som inte finns där än. UPDATE går att köra flera gånger utan att något händer.
--
-- Sökvägarna utgår från public, samma format som Polaroid och kassan använder.

-- Fall 1, Mordet på Hôtel Le Mont. Polisrapporten och vittnesmålet (003 och
-- 004) har ingen bild.
UPDATE case_clues SET image_url = '/images/1-hotel-le-mont/clues/1-cognac-decanter.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000001';

UPDATE case_clues SET image_url = '/images/1-hotel-le-mont/clues/6-doctors-bag.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000002';

UPDATE case_clues SET image_url = '/images/1-hotel-le-mont/clues/2-office-ledger.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000005';

UPDATE case_clues SET image_url = '/images/1-hotel-le-mont/clues/3-telephone-switchboard.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000006';

UPDATE case_clues SET image_url = '/images/1-hotel-le-mont/clues/4-fingerprint-card.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000007';

UPDATE case_clues SET image_url = '/images/1-hotel-le-mont/clues/5-press-photos.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000008';

-- Fall 2, Mordet i sovvagn 12. Brottsplatsen, obduktionen, vittnesmålen och
-- avtrycken har ingen bild.
UPDATE case_clues SET image_url = '/images/2-express-train/clues/2-empty-medicine-bottle.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000202';

UPDATE case_clues SET image_url = '/images/2-express-train/clues/1-curtain-cord.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000205';

UPDATE case_clues SET image_url = '/images/2-express-train/clues/3-telegraph-log.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000208';

UPDATE case_clues SET image_url = '/images/2-express-train/clues/4-platform-photos.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000209';

UPDATE case_clues SET image_url = '/images/2-express-train/clues/5-newspaper-clipping.webp'
WHERE id = 'c0000000-0000-4000-8000-000000000210';
