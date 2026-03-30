import express from "express";
const app = express();
import cors from "cors";
import { allTeams } from "./utils/consts.js";
import {
  mapGamesToPoints,
  mapPointsToLeagueRankings,
  mapPointsToDivisionRankings,
  mapPointsToConferenceRankings,
  mapPointsToWildcardRankings,
} from "./adapters/standingsAdapter.js";

app.use(cors());

app.get("/standings/:standingsType/season/:seasonId", async (req, res) => {
  const type = req.params.standingsType;
  const season = req.params.seasonId;
  let teams = Object.fromEntries(
    Object.entries(allTeams).filter(
      ([key, value]) =>
        ((season === "20222023" || season === "20232024") && key !== "UTA") ||
        ((season === "20242025" || season === "20252026") && key !== "ARI"),
    ),
  );
  let allTeamData = await Promise.all(
    Object.keys(teams).map(async (team) => {
      return await getRegularSeasonGamesForTeam(team, season).then((games) => {
        return mapGamesToPoints(games, teams[team]);
      });
    }),
  );

  let leagueRankings = mapPointsToLeagueRankings(allTeamData);
  let divisionRankings = mapPointsToDivisionRankings(leagueRankings);
  let conferenceRankings = mapPointsToConferenceRankings(divisionRankings);
  let wildcardRankings = mapPointsToWildcardRankings(divisionRankings);
  console.log(wildcardRankings);

  res.send(allTeamData);
});

app.get("/team/:teamId/season/:seasonId", async (req, res) => {
  const team = req.params.teamId;
  const season = req.params.seasonId;
  let teamSchedule = await getRegularSeasonGamesForTeam(team, season);
  res.send(teamSchedule);
});

app.get("/game/:gameId/", async (req, res) => {
  const game = req.params.gameId;
  let goalsForGame = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${game}/play-by-play`,
  ).then((response) => response.json());
  res.send(goalsForGame);
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

function getAllRegularSeasonGameIdsForTeam(json) {
  return json.games.filter((game) => game.gameType === 2);
}

async function getRegularSeasonGamesForTeam(team, season) {
  let teamSchedule = await fetch(
    `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`,
  )
    .then((response) => response.json())
    .then((json) => {
      return getAllRegularSeasonGameIdsForTeam(json);
    });
  return teamSchedule;
}
