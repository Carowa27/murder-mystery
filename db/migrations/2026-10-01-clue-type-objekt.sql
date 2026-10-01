-- Ledtrådstypen heter Objekt enligt protokollet 2026-09-15, inte Item.
UPDATE clue_types SET name = 'Objekt' WHERE name = 'Item';
