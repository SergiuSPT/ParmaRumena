export async function listPlayers(databaseQuery) {
  const { rows } = await databaseQuery(`SELECT id, first_name AS "firstName", last_name AS "lastName",
    number, position, photo, biography, is_demo AS "isDemo"
    FROM players ORDER BY number, last_name, first_name, id`);
  return rows;
}

export async function listMatches(databaseQuery) {
  const { rows } = await databaseQuery(`SELECT id, opponent, initials,
    to_char(match_date, 'YYYY-MM-DD') AS date, to_char(kickoff_time, 'HH24:MI') AS time,
    venue, competition, round, home,
    CASE WHEN home_score IS NULL THEN NULL
      ELSE json_build_object('home', home_score, 'away', away_score) END AS score,
    is_demo AS "isDemo"
    FROM matches ORDER BY match_date, kickoff_time, id`);
  return rows;
}
