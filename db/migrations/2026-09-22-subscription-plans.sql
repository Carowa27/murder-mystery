-- Vad en månad Unlimited kostar fanns inte i databasen tidigare.
-- Priset låg i koden, och då kan ingen ändra det utan en ny release.
-- Nu är det en rad i databasen, tillsammans med hur länge abonnemanget
-- gäller.
--
-- RLS: alla får läsa priset, även utloggade, eftersom det ska stå på
-- prenumerationssidan. Bara admin får ändra det.

CREATE TABLE subscription_plans (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code text NOT NULL UNIQUE, -- samma sträng som payments.product, alltså unlimited_month
  name text NOT NULL, -- visningsnamn på prenumerationssidan
  price int NOT NULL CHECK (price >= 0), -- i kronor
  duration_days int NOT NULL CHECK (duration_days > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscription_plans_select ON subscription_plans
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY subscription_plans_admin ON subscription_plans
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO subscription_plans (code, name, price, duration_days) VALUES
  ('unlimited_month', 'Unlimited', 99, 30);
