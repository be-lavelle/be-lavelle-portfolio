import express from "express";
const app = express();
import cors from "cors";
import { allTeams } from "./utils/consts.js";
import {
  mapGoals,
  mapGamesToPoints,
  mapPointsToLeagueRankings,
  mapPointsToDivisionRankings,
  mapPointsToConferenceRankings,
  mapPointsToWildcardRankings,
} from "./adapters/standingsAdapter.js";

app.use(cors());

app.get("/season/:seasonId/twopointline/:isTwoPointLine", async (req, res) => {
  const season = req.params.seasonId;
  const isTwoPointLine = req.params.isTwoPointLine;
  let teams = Object.fromEntries(
    Object.entries(allTeams).filter(
      ([key, value]) =>
        ((season === "20222023" || season === "20232024") && key !== "UTA") ||
        ((season === "20242025" || season === "20252026") && key !== "ARI"),
    ),
  );

  let allTeamData = await Promise.all(
    Object.keys(teams).map(async (team) => {
      return await getRegularSeasonGamesForTeam(team, season);
    }),
  );

  let allGamesUnmapped = {};

  allTeamData.forEach((team) => {
    team.forEach((game) => {
      if (!allGamesUnmapped.hasOwnProperty(game.id)) {
        allGamesUnmapped[game.id] = game;
      }
    });
  });

  let allGameData = await Promise.all(
    Object.keys(allGamesUnmapped).map(async (gameId) => {
      return await getGameData(gameId);
    }),
  );

  // console.log(allGameData);

  // let leagueRankings = mapPointsToLeagueRankings(allTeamData);
  // let divisionRankings = mapPointsToDivisionRankings(leagueRankings);
  // let conferenceRankings = mapPointsToConferenceRankings(divisionRankings);
  // let wildcardRankings = mapPointsToWildcardRankings(divisionRankings);

  // let response = {
  //   leagueRankings,
  //   divisionRankings,
  //   conferenceRankings,
  //   wildcardRankings,
  // };

  res.send({});
});

app.get("/team/:teamId/season/:seasonId", async (req, res) => {
  const team = req.params.teamId;
  const season = req.params.seasonId;
  let teamSchedule = await getRegularSeasonGamesForTeam(team, season);
  res.send(teamSchedule);
});

app.get("/game/:gameId/", async (req, res) => {
  const gameId = req.params.gameId;
  getGameData(gameId);
  res.send(goalsForGame);
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

function getAllRegularSeasonGameIdsForTeam(json) {
  return json.games.filter((game) => game.gameType === 2);
}

async function getGameData(gameId) {
  let gameBreakdown = await fetchWithRetry(
    `https://api-web.nhle.com/v1/gamecenter/${gameId}/play-by-play`,
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 429) {
          console.error("Too many requests - games");
        }
        throw response;
      }
      console.log("GAME", response);

      return response.json();
    })
    .then((game) => {
      return mapGoals(game);
    })
    .catch((error) => {
      if (typeof error.json === "function") {
        error.json().then((jsonError) => {
          console.error("API error:", jsonError);
        });
      } else {
        console.error("Network or other error:", error.message);
      }
    });
  return gameBreakdown;
}

async function getRegularSeasonGamesForTeam(team, season) {
  let teamSchedule = await fetchWithRetry(
    `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`,
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 429) {
          console.error("Too many requests - team");
        }
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      return getAllRegularSeasonGameIdsForTeam(json);
    })
    .catch((error) => {
      if (typeof error.json === "function") {
        error.json().then((jsonError) => {
          console.error("API error:", jsonError);
        });
      } else {
        console.error("Network or other error:", error.message);
      }
    });
  return teamSchedule;
}

async function fetchWithRetry(url, maxRetries = 5) {
  let retries = 0;

  while (retries < maxRetries) {
    const response = await fetch(url);

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter
        ? parseInt(retryAfter) * 1000
        : calculateBackoff(retries);

      console.log(
        `Rate limited. Waiting ${waitTime}ms before retry ${retries + 1}`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      retries++;
      continue;
    }

    return response;
  }

  throw new Error("Max retries exceeded");
}

function calculateBackoff(retryCount, baseDelay = 1000, maxDelay = 32000) {
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(2, retryCount),
    maxDelay,
  );
  const jitter = Math.random() * exponentialDelay * 0.1;
  return exponentialDelay + jitter;
}
