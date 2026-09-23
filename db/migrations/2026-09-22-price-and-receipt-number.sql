-- Ändring av databasen som redan är skapad. Denna körs iSupabase SQL Editor.
--
-- Två beslut varav det första är efter dialog med Steven och Carro:
-- 1. Priset är enda källan till om ett fall är gratis. Kolumnen is_free sa
--    samma sak en gång till och kunde glida isär från price.
-- 2. Kvittonumret kommer från en sekvens i databasen, så att servern slipper
--    räkna rader och två köp i samma ögonblick inte kan få samma nummer.
--

CREATE OR REPLACE FUNCTION public.owns_case(p_user_id uuid, p_case_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = p_case_id AND c.price = 0)
    OR EXISTS (
      SELECT 1 FROM public.purchases pu
      WHERE pu.user_id = p_user_id AND pu.case_id = p_case_id
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = p_user_id AND p.unlimited_until > now()
    );
$$;

ALTER TABLE cases DROP COLUMN is_free;

-- Finns det redan kvitton måste sekvensen sättas förbi dem med setval.
CREATE SEQUENCE receipt_number_seq;

ALTER TABLE receipts
  ALTER COLUMN receipt_number
  SET DEFAULT ('nocturne-' || lpad(nextval('public.receipt_number_seq')::text, 6, '0'));
