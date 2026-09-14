CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL CHECK (length(trim(first_name)) > 0),
  last_name TEXT NOT NULL CHECK (length(trim(last_name)) > 0),
  number SMALLINT NOT NULL CHECK (number BETWEEN 0 AND 99),
  position TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  biography TEXT NOT NULL DEFAULT '',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  opponent TEXT NOT NULL CHECK (length(trim(opponent)) > 0),
  initials TEXT NOT NULL,
  match_date DATE NOT NULL,
  kickoff_time TIME NOT NULL,
  venue TEXT NOT NULL,
  competition TEXT NOT NULL,
  round INTEGER NOT NULL CHECK (round > 0),
  home BOOLEAN NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT complete_final_score CHECK (
    (home_score IS NULL AND away_score IS NULL) OR
    (home_score IS NOT NULL AND away_score IS NOT NULL AND home_score >= 0 AND away_score >= 0)
  )
);

CREATE INDEX IF NOT EXISTS matches_schedule_idx ON matches (match_date, kickoff_time);
