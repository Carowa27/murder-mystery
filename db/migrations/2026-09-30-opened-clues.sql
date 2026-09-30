-- En ledtråd i listan räknas som öppnad när någon i teamet har klickat in på den.
-- Ledtrådar med krav låses upp först när alla krav är öppnade, inte bara
-- syns i listan. Annars kunde man öppna samma ledtråd två gånger och få en
-- ledtråd vars andra krav ingen hade läst.
--
-- RLS: tabellen hade bara policies för select och insert. Update behövs för
-- att sätta stämpeln. Insert-policyn släpper redan igenom samma personer,
-- så det här öppnar inget nytt.

ALTER TABLE investigation_found_clues ADD COLUMN opened_at timestamptz;

CREATE POLICY found_clues_update ON investigation_found_clues
  FOR UPDATE TO authenticated
  USING (public.can_access_investigation(investigation_id))
  WITH CHECK (public.can_access_investigation(investigation_id));
