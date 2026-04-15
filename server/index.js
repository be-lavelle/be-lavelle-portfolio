import express from "express";
const app = express();
import cors from "cors";
import { allTeams } from "./utils/consts.js";
import {
  getGameBreakdown,
  mapGamesToPoints,
  mapPointsToLeagueRankings,
  mapRankingsByDate,
} from "./adapters/standingsAdapter.js";
import 'dotenv/config'
import { getAllRegularSeasonGamesForTeam } from "./adapters/gamesAdapter.js";

import "./loadEnvironment.js";
import mongoose from "mongoose";
import { GameBreakdown, Game } from "./models/gameBreakdown.model.js";

app.use(cors());
app.use(express.json());
const mongoDBURL = process.env.MONGODB_URI;

mongoose
  .connect(
    mongoDBURL,
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
  let isGameAlreadyInDb = await Game.find({
    season: season,
  });
  let isGameBreakdownAlreadyInDb = await GameBreakdown.find({
    "game.season": season,
  });

  isGameAlreadyInDb = isGameAlreadyInDb.sort((a, b) => {
    return b.gameId - a.gameId;
  });

  let cleanedUpGameDb = {};
  isGameAlreadyInDb.forEach(async (game) => {
    if (cleanedUpGameDb.hasOwnProperty(game.gameId)) {
      console.log(`Deleting duplicate Game: ${game.gameId}`);
      await Game.findByIdAndDelete(game._id);
    } else {
      cleanedUpGameDb[`${game.gameId}`] = game;
    }
  });

  let cleanedUpGameBreakdownDb = {};
  isGameBreakdownAlreadyInDb.forEach(async (gameBreakdown) => {
    if (cleanedUpGameBreakdownDb.hasOwnProperty(gameBreakdown.game.gameId)) {
      console.log(`Deleting duplicate GameBreakdown: ${gameBreakdown.game.gameId}`);
      await GameBreakdown.findByIdAndDelete(gameBreakdown._id);
    } else {
      cleanedUpGameBreakdownDb[`${gameBreakdown.game.gameId}`] = gameBreakdown;
    }
  });
  res.send({
    cleanedUpGameDb: Object.keys(cleanedUpGameDb).map((gameId) => {
      return cleanedUpGameDb[gameId];
    }),
    cleanedUpGameBreakdownDb: Object.keys(cleanedUpGameBreakdownDb).map(
      (gameId) => {
        return cleanedUpGameBreakdownDb[gameId];
      },
    ),
  });
});

app.get("/season/:seasonId/", async (req, res) => {
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
      if (isTeamAlreadyInDb.length >= 82 || (season === "20252026" && isTeamAlreadyInDb.length >= 79)) {
        console.log(
          `Already got all the Team's games, boss - ${team} - ${season}`,
        );
        return { team: team, data: isTeamAlreadyInDb };
      } else {
        console.log(
          `Haven't got this Team's games yet, boss - ${team} - ${season}`,
        );
        let regularSeasonGames = await Promise.all(await getRegularSeasonGames(team, season));
        return { team: team, data: regularSeasonGames };
      }
    }),
  );

  try {
    const allGameBreakdowns = await Promise.all(allTeamData.map(async (team) => {
      const teamData = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          const isHomeTeamAlreadyInDb = await GameBreakdown.find({
            "game.homeTeamAbbrev": team.team,
            "game.season": season,
          });
          const isAwayTeamAlreadyInDb = await GameBreakdown.find({
            "game.awayTeamAbbrev": team.team,
            "game.season": season,
          });
          const isTeamAlreadyInDb = [
            ...isHomeTeamAlreadyInDb,
            ...isAwayTeamAlreadyInDb,
          ];
          console.log("ALREADY IN DB", isTeamAlreadyInDb.length, team.team)
          if (isTeamAlreadyInDb.length < team.data.length) {
            const mappedDataGames = await Promise.all(
              team.data.map(async (game) => {
                const isAlreadyInDb = await GameBreakdown.find({
                  "game.gameId": game.gameId,
                });
                if (isAlreadyInDb.length > 0) {
                  console.log(`Already got the GameBreakdown, boss - ${game.gameId}`);
                  return isAlreadyInDb[0]
                } else {
                  let gameBreakdown = await new Promise((resolve2, rej) => {
                    setTimeout(async () => {
                      const gameData = await getGameData(game.gameId, season)
                      resolve2(gameData)
                    }, Math.random() * 20000)
                  })
                  return gameBreakdown
                }
              }
              ))
            resolve(mappedDataGames)
          } else {
            console.log(`Already mapped all ${team.team} games for ${season}`);
            resolve(isTeamAlreadyInDb)
          }
        }, Math.random() * 1000)
      })
      return {
        team: team.team,
        data: teamData
      }
    }
    ))
    const mappedTeamData = mapGamesToPoints(allGameBreakdowns, true)
    const leagueRankings = mapPointsToLeagueRankings(mappedTeamData);
    const mappedRankingsByDate = mapRankingsByDate(leagueRankings)

    res.send({ mappedRankingsByDate });
  } catch (error) {
    console.log(error);
  }
});

app.get("/team/:teamId/season/:seasonId", async (req, res) => {
  const team = req.params.teamId;
  const season = req.params.seasonId;
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
  let teamSchedule = {};
  if (isTeamAlreadyInDb.length >= 82) {
    console.log(`Already got all the Team's games, boss - ${team} - ${season}`);
    teamSchedule = isTeamAlreadyInDb;
  } else {
    teamSchedule = await Promise.all(await getRegularSeasonGames(team, season));
  }
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
        if (!response.ok) {
          if (response.status === 429) {
            console.error("Too many requests - games");
            console.log(response);
          }
          console.log(response);
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
    console.log("Other Error", error.message);
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
          console.log(response);
        }
        console.log(response);
        throw response;
      }
      return response.json();
    })
    .then(async (game) => {
      const allTeamGames = getAllRegularSeasonGamesForTeam(game, season);
      try {
        const mappedGames = await allTeamGames.map(async (gameToMap) => {
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
