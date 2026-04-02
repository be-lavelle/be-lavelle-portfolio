import express from "express";
const app = express();
import cors from "cors";
import { allTeams } from "./utils/consts.js";
import {
  getGameBreakdown,
  mapGamesToPoints,
  mapPointsToLeagueRankings,
  mapPointsToDivisionRankings,
  mapPointsToConferenceRankings,
  mapPointsToWildcardRankings,
} from "./adapters/standingsAdapter.js";

import { getAllRegularSeasonGamesForTeam } from "./adapters/gamesAdapter.js";
import { MongoClient } from "mongodb";

import "./loadEnvironment.js";
import mongoose from "mongoose";
import { TestItem } from "./models/test.model.js";
import { GameBreakdown, Game } from "./models/gameBreakdown.model.js";

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "",
  )
  .then(() => {
    console.log("Connected to db");
    app.listen(8080, () => {
      console.log("server listening on port 8080");
    });
  })
  .catch(() => {
    console.error("database connection failed");
  });

app.get("/deleteDupes/:seasonId", async (req, res) => {
  const season = req.params.seasonId;
  let isAlreadyInDb = await Game.find({
    season: season,
  });
  isAlreadyInDb = isAlreadyInDb.sort((a, b) => {
    return b.gameId - a.gameId;
  });

  let cleanedUpDb = {};
  isAlreadyInDb.forEach(async (game) => {
    if (cleanedUpDb.hasOwnProperty(game.gameId)) {
      console.log(`Deleting duplicate Game: ${game.gameId}`);
      await Game.findByIdAndDelete(game._id);
    } else {
      cleanedUpDb[`${game.gameId}`] = game;
    }
  });
  res.send({
    cleanedUpDb: Object.keys(cleanedUpDb).map((gameId) => {
      cleanedUpDb[gameId];
    }),
  });
});

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
      const isHomeTeamAlreadyInDb = await Game.find({
        homeTeamAbbrev: team,
        season: season,
      });
      const isAwayTeamAlreadyInDb = await Game.find({
        awayTeamAbbrev: team,
        season: season,
      });
      const isTeamAlreadyInDb = [
        ...isHomeTeamAlreadyInDb,
        ...isAwayTeamAlreadyInDb,
      ];
      if (isTeamAlreadyInDb.length >= 82) {
        console.log(
          `Already got all the Team's games, boss - ${team} - ${season}`,
        );
        return isTeamAlreadyInDb;
      }
      return await getRegularSeasonGames(team, season);
    }),
  );

  let allGamesUnmapped = {};
  try {
    allTeamData.forEach((team) => {
      team.forEach(async (game) => {
        const isAlreadyInDb = await GameBreakdown.find({
          gameId: game.gameId,
        });
        if (isAlreadyInDb.length > 0) {
          console.log(`Already got the GameBreakdown, boss - ${game.id}`);
        } else if (!allGamesUnmapped.hasOwnProperty(game.id)) {
          const gameData = await getGameData(game.gameId, season);
          console.log("GAME DATA", gameData);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }

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
  let teamSchedule = await getRegularSeasonGames(team, season);
  res.send(teamSchedule);
});

app.get("/game/:gameId/season/:seasonId", async (req, res) => {
  const { gameId, seasonId } = req.params;
  let goalsForGame = await getGameData(gameId, seasonId);
  res.send(goalsForGame);
});

async function getGameData(gameId, season) {
  try {
    const gameData = await fetchWithRetry(
      `https://api-web.nhle.com/v1/gamecenter/${gameId}/play-by-play`,
      "playByPlay",
    )
      .then((response) => {
        console.log("PLAYBYPLAY RESPONSE", response.body);
        if (!response.ok) {
          if (response.status === 429) {
            console.error("Too many requests - games");
          }
          throw response;
        }
        return response.json();
      })
      .then(async (game) => {
        const gameBreakdown = getGameBreakdown(game, season);
        try {
          const newGameBreakdown = await GameBreakdown.create(gameBreakdown);
          console.log(`New GameBreakdown coming right up, boss - ${game.id}`);
          return newGameBreakdown;
        } catch (error) {
          console.log(error.message);
        }
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
    return gameData;
  } catch (error) {
    console.log(error.message);
  }
}

async function getRegularSeasonGames(team, season) {
  let teamSchedule = await fetchWithRetry(
    `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`,
    "TeamSchedule",
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
    .then(async (game) => {
      const allTeamGames = getAllRegularSeasonGamesForTeam(game, season);
      try {
        const mappedGames = allTeamGames.map(async (gameToMap) => {
          const isAlreadyInDb = await Game.find({
            gameId: gameToMap.gameId,
          });
          if (isAlreadyInDb.length > 0) {
            console.log(
              `Already got the Game, boss - ${gameToMap.gameId} - ${team}`,
            );
            return isAlreadyInDb[0];
          } else {
            const newGame = await Game.create(gameToMap);
            console.log(
              `New Game coming right up, boss - ${gameToMap.gameId} - ${team}`,
            );
            return newGame;
          }
        });
        return mappedGames;
      } catch (error) {
        console.error("Mapping error:", error.message);
      }
    })
    .catch((error) => {
      if (typeof error.json === "function") {
        error.json().then((jsonError) => {
          console.error("API error:", jsonError);
        });
      } else {
        console.error("Network or other error:", error.message);
        throw error;
      }
    });

  return teamSchedule;
}

async function fetchWithRetry(url, type) {
  const response = await fetch(url);

  if (response.status === 429) {
    console.error(`Rate limited for ${type}.`);
  }

  return response;
}
