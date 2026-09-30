-- Kortare titlar på fallen, så att de blir lättare att ögna igenom i butiken
-- och i admin. Titeln är platsen där mordet sker, samma namn som seed-filerna har.
--
-- UPDATE går att köra flera gånger utan att något händer.

UPDATE cases SET title = 'Hôtel Le Mont'
WHERE id = 'a0000000-0000-4000-8000-000000000001';

UPDATE cases SET title = 'Sovvagn 12'
WHERE id = 'a0000000-0000-4000-8000-000000000002';

UPDATE cases SET title = 'Corinthia'
WHERE id = 'a0000000-0000-4000-8000-000000000003';

UPDATE cases SET title = 'Fyren'
WHERE id = 'a0000000-0000-4000-8000-000000000004';

UPDATE cases SET title = 'Ateljé 9'
WHERE id = 'a0000000-0000-4000-8000-000000000005';

UPDATE cases SET title = 'Cirkus Fortuna'
WHERE id = 'a0000000-0000-4000-8000-000000000006';

UPDATE cases SET title = 'Studio B'
WHERE id = 'a0000000-0000-4000-8000-000000000007';

UPDATE cases SET title = 'Poggio Vecchio'
WHERE id = 'a0000000-0000-4000-8000-000000000008';

UPDATE cases SET title = 'Halvorsen'
WHERE id = 'a0000000-0000-4000-8000-000000000009';

UPDATE cases SET title = 'Sheung Wan'
WHERE id = 'a0000000-0000-4000-8000-000000000010';
