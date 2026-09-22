-- Databasschema för NOCTURNE (murder-mystery).
-- Körs i Supabase: SQL Editor, klistra in hela filen, Run.
-- Filen skapar tabeller, uppslagsdata, RLS-policies och triggers.
--
-- Obs: filen kan inte importeras i dbdiagram.io, eftersom den använder
-- auth-schemat och funktioner. Använd schema.dbml för diagrammet.
--
-- Vill du köra om filen från början, kör först detta (raderar all data):
-- DROP TABLE IF EXISTS receipts, purchases, payments, accusations, notes,
--   investigation_found_clues, investigations, team_members, teams,
--   clue_characters, clue_requirements, case_clues, characters, cases,
--   profiles, clue_types, difficulties CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- (funktionerna i public försvinner med tabellerna tack vare CASCADE)


-- ============================================================
-- 1. Uppslagstabeller
-- ============================================================

CREATE TABLE difficulties (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE, -- beginner, intermediate, hard
  max_accusations int NOT NULL CHECK (max_accusations > 0) -- 3, 2, 1
);

CREATE TABLE clue_types (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);


-- ============================================================
-- 2. Användare
-- ============================================================

-- Inloggning sköts av Supabase Auth, profiles.id är samma id som i auth.users.
-- Kopplingen till auth.users ligger i avsnitt 7.
-- Nivån (free, premium, unlimited) lagras inte, den räknas fram, se avsnitt 8.
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  avatar_url text, -- sökväg till fördefinierad bild i storage bucket
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  unlimited_until timestamptz, -- Unlimited gäller så länge datumet är i framtiden
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 3. Mysterier
-- ============================================================

-- stage: dev är under uppbyggnad, active är spelbart, inactive är borttaget
-- (soft delete). Nya fall börjar som dev så att inget publiceras av misstag.
CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  location text, -- till exempel St. Orison Island
  story_date date, -- datum i berättelsen, till exempel 1926-09-12
  difficulty_id int NOT NULL REFERENCES difficulties (id),
  price int NOT NULL DEFAULT 0 CHECK (price >= 0), -- i kronor, 0 betyder att fallet ingår i gratisnivån
  stage text NOT NULL DEFAULT 'dev' CHECK (stage IN ('dev', 'active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- relationship beskriver relationen till offret och är tom för offret själv.
CREATE TABLE characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text,
  relationship text,
  description text,
  image_url text,
  is_guilty boolean NOT NULL DEFAULT false,
  is_victim boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT (is_guilty AND is_victim))
);

-- Exakt en mördare och ett offer per fall.
CREATE UNIQUE INDEX characters_one_guilty_per_case ON characters (case_id) WHERE is_guilty;
CREATE UNIQUE INDEX characters_one_victim_per_case ON characters (case_id) WHERE is_victim;

CREATE TABLE case_clues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  clue_type_id int NOT NULL REFERENCES clue_types (id),
  title text NOT NULL,
  content text,
  image_url text,
  is_key boolean NOT NULL DEFAULT false, -- alla nyckelledtrådar krävs för att få anklaga
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX case_clues_case_id_idx ON case_clues (case_id);

-- En ledtråd syns först när alla ledtrådar den kräver är hittade.
-- clue_id är den låsta ledtråden, required_clue_id måste hittas först.
CREATE TABLE clue_requirements (
  clue_id uuid NOT NULL REFERENCES case_clues (id) ON DELETE CASCADE,
  required_clue_id uuid NOT NULL REFERENCES case_clues (id) ON DELETE CASCADE,
  PRIMARY KEY (clue_id, required_clue_id),
  CHECK (clue_id <> required_clue_id)
);

-- En ledtråd kan handla om flera personer, till exempel ett telefonsamtal.
CREATE TABLE clue_characters (
  clue_id uuid NOT NULL REFERENCES case_clues (id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
  PRIMARY KEY (clue_id, character_id)
);


-- ============================================================
-- 4. Team
-- ============================================================

-- Ägaren läggs också in i team_members. Övriga medlemmar är gäster
-- och spelar ägarens mysterier.
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text NOT NULL UNIQUE,
  owner_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  max_members int NOT NULL DEFAULT 4 CHECK (max_members BETWEEN 1 AND 4),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
  team_id uuid NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

CREATE INDEX team_members_user_id_idx ON team_members (user_id);


-- ============================================================
-- 5. Spelomgångar
-- ============================================================

-- En omgång av ett mysterium. Nytt försök på samma mysterium blir en ny rad.
-- paused betyder att värden tappat anslutningen och alla kastats till lobbyn.
CREATE TABLE investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES cases (id),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'solved', 'failed', 'abandoned')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);

-- Ett team kan bara ha en pågående utredning åt gången. En pausad omgång
-- räknas fortfarande som pågående, annars kan värden inte återuppta den.
CREATE UNIQUE INDEX investigations_one_active_per_team
  ON investigations (team_id) WHERE status IN ('active', 'paused');

CREATE INDEX investigations_case_id_idx ON investigations (case_id);

-- En rad betyder att ledtråden är hittad i omgången.
CREATE TABLE investigation_found_clues (
  investigation_id uuid NOT NULL REFERENCES investigations (id) ON DELETE CASCADE,
  clue_id uuid NOT NULL REFERENCES case_clues (id) ON DELETE CASCADE,
  found_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
  found_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (investigation_id, clue_id)
);

CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id uuid NOT NULL REFERENCES investigations (id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
  clue_id uuid REFERENCES case_clues (id) ON DELETE SET NULL, -- valfri koppling till en ledtråd
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notes_investigation_id_idx ON notes (investigation_id);

-- Rätt eller fel avgörs av characters.is_guilty. Antal använda räknas fram.
CREATE TABLE accusations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id uuid NOT NULL REFERENCES investigations (id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
  character_id uuid NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX accusations_investigation_id_idx ON accusations (investigation_id);


-- ============================================================
-- 6. Betalningar
-- ============================================================

-- product är antingen ett enstaka mysterium eller en månad Unlimited.
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  product text NOT NULL CHECK (product IN ('case', 'unlimited_month')),
  case_id uuid REFERENCES cases (id),
  amount int NOT NULL CHECK (amount >= 0), -- i kronor
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (product = 'case' AND case_id IS NOT NULL)
    OR (product = 'unlimited_month' AND case_id IS NULL)
  )
);

CREATE INDEX payments_user_id_idx ON payments (user_id);

-- Mysterier som användaren äger för alltid, även utan Unlimited.
CREATE TABLE purchases (
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  payment_id uuid NOT NULL UNIQUE REFERENCES payments (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, case_id)
);

-- Löpnumret i kvittonumret. En sekvens ger aldrig samma nummer två gånger, inte
-- ens om två köp sker i samma ögonblick. Ett avbrutet köp förbrukar ett nummer,
-- så serien kan få luckor. Medvetet val.
CREATE SEQUENCE receipt_number_seq;

-- Användare och belopp hämtas via payments. Numret sätts av databasen, servern
-- skriver bara payment_id.
CREATE TABLE receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL UNIQUE REFERENCES payments (id) ON DELETE CASCADE,
  receipt_number text NOT NULL UNIQUE
    DEFAULT ('nocturne-' || lpad(nextval('public.receipt_number_seq')::text, 6, '0')),
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 7. Koppling till Supabase Auth
-- ============================================================

ALTER TABLE profiles ADD FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- När någon registrerar sig skapas profilraden automatiskt. display_name tas
-- från metadata om det skickas med vid signup, annars från e-postadressen.
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''),
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 8. Nivå (subscription_tier)
-- ============================================================

-- Nivån lagras inte som kolumn, den räknas fram. En funktion som tar profiles
-- som argument kan anropas som om den vore en kolumn, både i SQL och i
-- Supabase-API:t: select id, display_name, subscription_tier from profiles.
-- Poängen är att den aldrig kan säga unlimited när prenumerationen gått ut.
-- Namnen på nivåerna är inte spikade i gruppen än, byt strängarna här när de är det.
CREATE FUNCTION public.subscription_tier(p public.profiles)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE
    WHEN p.unlimited_until IS NOT NULL AND p.unlimited_until > now() THEN 'unlimited'
    WHEN EXISTS (SELECT 1 FROM public.purchases pu WHERE pu.user_id = p.id) THEN 'premium'
    ELSE 'free'
  END;
$$;


-- ============================================================
-- 9. Hjälpfunktioner för RLS
-- ============================================================

-- Alla är SECURITY DEFINER. Det betyder att de kör med ägarens behörighet och
-- struntar i RLS internt. Utan det skulle en policy på profiles som läser
-- profiles anropa sig själv i all oändlighet (infinite recursion).

CREATE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

CREATE FUNCTION public.is_team_member(p_team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id AND user_id = (SELECT auth.uid())
  );
$$;

-- Sant om den inloggade och den andra användaren är i samma team.
CREATE FUNCTION public.shares_team(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members mine
    JOIN public.team_members theirs ON theirs.team_id = mine.team_id
    WHERE mine.user_id = (SELECT auth.uid()) AND theirs.user_id = p_user_id
  );
$$;

CREATE FUNCTION public.can_access_investigation(p_investigation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.investigations i
    JOIN public.team_members m ON m.team_id = i.team_id
    WHERE i.id = p_investigation_id AND m.user_id = (SELECT auth.uid())
  );
$$;

-- Sant om användaren äger fallet: gratisfall, köpt fall eller aktiv Unlimited.
CREATE FUNCTION public.owns_case(p_user_id uuid, p_case_id uuid)
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

-- Sant om den inloggade får se innehållet i ett fall. Gäster äger inte fallet
-- själva, de spelar värdens mysterium, därför räcker det att vara med i ett
-- team som har en utredning igång på fallet.
CREATE FUNCTION public.has_case_access(p_case_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    public.is_admin()
    OR public.owns_case((SELECT auth.uid()), p_case_id)
    OR EXISTS (
      SELECT 1
      FROM public.investigations i
      JOIN public.team_members m ON m.team_id = i.team_id
      WHERE i.case_id = p_case_id AND m.user_id = (SELECT auth.uid())
    );
$$;

-- Ett team får starta ett fall om ägaren av teamet har tillgång till det.
CREATE FUNCTION public.team_owner_owns_case(p_team_id uuid, p_case_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = p_team_id AND public.owns_case(t.owner_id, p_case_id)
  );
$$;


-- ============================================================
-- 10. Kontroller som håller ihop spelet
-- ============================================================

-- Främmande nycklar räcker inte här. De säger att en karaktär finns, men inte
-- att hon hör till det fall omgången spelar. Utan kontrollerna nedan går det
-- att anklaga mördaren i ett annat mysterium och få rätt, eller att kräva en
-- ledtråd ur ett fall för att låsa upp en ledtråd i ett annat.
-- Alla är SECURITY DEFINER så att kontrollen ser hela sanningen, inte bara de
-- rader den inloggade råkar ha läsrätt till.

CREATE FUNCTION public.check_accusation_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.investigations i
    JOIN public.characters c ON c.case_id = i.case_id
    WHERE i.id = NEW.investigation_id AND c.id = NEW.character_id
  ) THEN
    RAISE EXCEPTION 'Karaktären hör inte till fallet som utreds';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_accusation_case_trigger
BEFORE INSERT ON accusations
FOR EACH ROW EXECUTE FUNCTION public.check_accusation_case();

CREATE FUNCTION public.check_found_clue_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.investigations i
    JOIN public.case_clues c ON c.case_id = i.case_id
    WHERE i.id = NEW.investigation_id AND c.id = NEW.clue_id
  ) THEN
    RAISE EXCEPTION 'Ledtråden hör inte till fallet som utreds';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_found_clue_case_trigger
BEFORE INSERT ON investigation_found_clues
FOR EACH ROW EXECUTE FUNCTION public.check_found_clue_case();

-- Anteckningen får tagga en ledtråd, men bara en ur samma fall.
CREATE FUNCTION public.check_note_clue_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.clue_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM public.investigations i
    JOIN public.case_clues c ON c.case_id = i.case_id
    WHERE i.id = NEW.investigation_id AND c.id = NEW.clue_id
  ) THEN
    RAISE EXCEPTION 'Ledtråden hör inte till fallet som utreds';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_note_clue_case_trigger
BEFORE INSERT OR UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION public.check_note_clue_case();

CREATE FUNCTION public.check_clue_requirement_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.case_clues laast
    JOIN public.case_clues kraevs ON kraevs.case_id = laast.case_id
    WHERE laast.id = NEW.clue_id AND kraevs.id = NEW.required_clue_id
  ) THEN
    RAISE EXCEPTION 'Båda ledtrådarna måste tillhöra samma fall';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_clue_requirement_case_trigger
BEFORE INSERT ON clue_requirements
FOR EACH ROW EXECUTE FUNCTION public.check_clue_requirement_case();

CREATE FUNCTION public.check_clue_character_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.case_clues c
    JOIN public.characters k ON k.case_id = c.case_id
    WHERE c.id = NEW.clue_id AND k.id = NEW.character_id
  ) THEN
    RAISE EXCEPTION 'Ledtråden och karaktären tillhör olika fall';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_clue_character_case_trigger
BEFORE INSERT ON clue_characters
FOR EACH ROW EXECUTE FUNCTION public.check_clue_character_case();

-- max_members är bara en siffra tills något kontrollerar den. FOR UPDATE
-- låser teamraden så att två som klickar samtidigt inte kan bli medlem
-- nummer fem båda två.
CREATE FUNCTION public.check_team_size()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  tak int;
  antal int;
BEGIN
  SELECT max_members INTO tak FROM public.teams WHERE id = NEW.team_id FOR UPDATE;
  SELECT count(*) INTO antal FROM public.team_members WHERE team_id = NEW.team_id;

  IF antal >= tak THEN
    RAISE EXCEPTION 'Teamet är fullt';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER check_team_size_trigger
BEFORE INSERT ON team_members
FOR EACH ROW EXECUTE FUNCTION public.check_team_size();


-- ============================================================
-- 11. Skydd mot att någon ger sig själv admin eller Unlimited
-- ============================================================

-- En policy kan bara säga ja eller nej till hela raden, den kan inte skydda
-- enskilda kolumner. Utan den här triggern kan en användare uppdatera sin egen
-- profil och sätta role = 'admin' eller unlimited_until långt fram i tiden.
-- Servern (service_role) och admin får ändra, alla andra blockeras.
-- Obs: den här ska INTE vara SECURITY DEFINER. I en sådan funktion är
-- current_user alltid funktionens ägare, och då hade kontrollen nedan trott
-- att varje anrop kom från servern.
CREATE FUNCTION public.protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- service_role är nyckeln som bara används på servern, postgres är SQL-editorn.
  IF current_user IN ('service_role', 'postgres', 'supabase_admin')
     OR (SELECT auth.uid()) IS NULL
     OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'role kan bara ändras av admin';
  END IF;

  IF NEW.unlimited_until IS DISTINCT FROM OLD.unlimited_until THEN
    RAISE EXCEPTION 'unlimited_until sätts av checkouten på servern';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_columns_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();


-- ============================================================
-- 12. RLS
-- ============================================================

-- Tumregel för hela avsnittet: service_role (nyckeln som bara används på
-- servern) går förbi alla policies. Det som står nedan gäller alltså anrop
-- direkt från webbläsaren med anon-nyckeln. Allt som skapar pengar eller
-- rättigheter (payments, purchases, receipts, unlimited_until) saknar därför
-- policy för skrivning med flit, det ska bara gå att göra från våra egna
-- route handlers.

ALTER TABLE difficulties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clue_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE clue_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE clue_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_found_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accusations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;


-- Uppslagstabeller: alla får läsa, bara admin får ändra.

CREATE POLICY difficulties_select ON difficulties
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY difficulties_admin ON difficulties
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY clue_types_select ON clue_types
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY clue_types_admin ON clue_types
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- Profiler: du ser din egen och dina lagkamraters, inget mer.

CREATE POLICY profiles_select ON profiles
  FOR SELECT TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR public.shares_team(id)
    OR public.is_admin()
  );

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY profiles_admin ON profiles
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Ingen DELETE-policy med flit. Att radera profilraden tar inte bort kontot i
-- auth.users. Radering av konto görs på servern med admin-API:t, och då
-- försvinner profilraden automatiskt via ON DELETE CASCADE.


-- Fall: alla får se de publicerade fallen i butiken, även utloggade.
-- Admin ser även dev och inactive.

CREATE POLICY cases_select ON cases
  FOR SELECT TO anon, authenticated
  USING (stage = 'active' OR public.is_admin());

CREATE POLICY cases_admin ON cases
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- Innehållet i ett fall: bara den som äger fallet eller spelar det i ett team.
-- Att en ledtråd ännu inte är hittad i omgången sköts i appen, inte här.

CREATE POLICY characters_select ON characters
  FOR SELECT TO authenticated USING (public.has_case_access(case_id));

CREATE POLICY characters_admin ON characters
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY case_clues_select ON case_clues
  FOR SELECT TO authenticated USING (public.has_case_access(case_id));

CREATE POLICY case_clues_admin ON case_clues
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY clue_requirements_select ON clue_requirements
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM case_clues c
    WHERE c.id = clue_requirements.clue_id AND public.has_case_access(c.case_id)
  ));

CREATE POLICY clue_requirements_admin ON clue_requirements
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY clue_characters_select ON clue_characters
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM case_clues c
    WHERE c.id = clue_characters.clue_id AND public.has_case_access(c.case_id)
  ));

CREATE POLICY clue_characters_admin ON clue_characters
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- Team: bara medlemmar ser teamet. Att gå med via kod går inte att göra
-- direkt från klienten, eftersom man inte får läsa team man inte är med i.
-- Den vägen går via servern, som slår upp koden och lägger in raden.

-- Ägaren står med här också, inte bara via team_members. Annars går det inte
-- att skapa ett team och läsa tillbaka raden i samma anrop, eftersom man inte
-- hunnit bli medlem än när raden skapas.
CREATE POLICY teams_select ON teams
  FOR SELECT TO authenticated
  USING (owner_id = (SELECT auth.uid()) OR public.is_team_member(id) OR public.is_admin());

CREATE POLICY teams_insert ON teams
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY teams_update_owner ON teams
  FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY teams_delete_owner ON teams
  FOR DELETE TO authenticated
  USING (owner_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY team_members_select ON team_members
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_team_member(team_id) OR public.is_admin());

CREATE POLICY team_members_insert_self ON team_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Lämna teamet själv, eller kastas ut av ägaren.
CREATE POLICY team_members_delete ON team_members
  FOR DELETE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = team_members.team_id AND t.owner_id = (SELECT auth.uid())
    )
  );

-- Spelomgångar: allt hänger på att man är med i teamet.

CREATE POLICY investigations_select ON investigations
  FOR SELECT TO authenticated
  USING (public.is_team_member(team_id) OR public.is_admin());

-- Man kan bara starta ett fall som teamets ägare har tillgång till.
CREATE POLICY investigations_insert ON investigations
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_team_member(team_id)
    AND public.team_owner_owns_case(team_id, case_id)
  );

CREATE POLICY investigations_update ON investigations
  FOR UPDATE TO authenticated
  USING (public.is_team_member(team_id))
  WITH CHECK (public.is_team_member(team_id));

CREATE POLICY found_clues_select ON investigation_found_clues
  FOR SELECT TO authenticated
  USING (public.can_access_investigation(investigation_id));

CREATE POLICY found_clues_insert ON investigation_found_clues
  FOR INSERT TO authenticated
  WITH CHECK (public.can_access_investigation(investigation_id));

CREATE POLICY notes_select ON notes
  FOR SELECT TO authenticated
  USING (public.can_access_investigation(investigation_id));

CREATE POLICY notes_insert ON notes
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.can_access_investigation(investigation_id)
  );

CREATE POLICY notes_update_own ON notes
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY notes_delete_own ON notes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Anklagelser går inte att ändra eller ta bort, de är omgångens historik.
CREATE POLICY accusations_select ON accusations
  FOR SELECT TO authenticated
  USING (public.can_access_investigation(investigation_id));

CREATE POLICY accusations_insert ON accusations
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.can_access_investigation(investigation_id)
  );


-- Pengar: bara läsning, och bara sitt eget. Skrivning sker på servern.

CREATE POLICY payments_select_own ON payments
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY purchases_select_own ON purchases
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY receipts_select_own ON receipts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM payments p
      WHERE p.id = receipts.payment_id AND p.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );


-- ============================================================
-- 13. Uppslagsdata
-- ============================================================

-- Krävs för att det ska gå att skapa ett enda fall, cases.difficulty_id och
-- case_clues.clue_type_id är NOT NULL. Ligger därför här och inte i seed-filen.

INSERT INTO difficulties (name, max_accusations) VALUES
  ('beginner', 3),
  ('intermediate', 2),
  ('hard', 1);

-- De åtta typerna från protokollet 2026-09-15, med Objekt omdöpt till Item
-- enligt beslutet 2026-09-16.
INSERT INTO clue_types (name) VALUES
  ('Brottsplatsrapport'),
  ('Polisrapport'),
  ('Vittnesmål'),
  ('Telefonlogg'),
  ('Obduktionsrapport'),
  ('Övervakningsbilder'),
  ('Fingeravtrycksanalys'),
  ('Item');
