export function getAllRegularSeasonGamesForTeam(json, season) {
  const regularSeasonGames = json.games.filter((game) => game.gameType === 2 && game.gameState !== "FUT");
  const mappedGames = regularSeasonGames.map((game) => {
    return mapGame(game, season);
  });
  return mappedGames;
}

export function mapGame(game, season) {
  const gameId = game.id;
  const gameDate = game.gameDate;
  const homeTeamAbbrev = game.homeTeam.abbrev;
  const awayTeamAbbrev = game.awayTeam.abbrev;
  const isOvertime = game.gameOutcome.lastPeriodType !== "REG";
  const isShootout = game.gameOutcome.lastPeriodType === "SO";
  const score = {
    home: game.homeTeam.score,
    away: game.awayTeam.score,
  };
  const isHomeWin = score.home - score.away > 0;
  const result = {
    home: isHomeWin ? "W" : isOvertime ? "OTL" : "L",
    away: isHomeWin ? (isOvertime ? "OTL" : "L") : "W",
  };

  const mappedGame = {
    season: season,
    gameId: gameId,
    gameDate: gameDate,
    homeTeamAbbrev: homeTeamAbbrev,
    awayTeamAbbrev: awayTeamAbbrev,
    score: score,
    result: result,
    isOvertime: isOvertime,
    isShootout: isShootout,
  };
  return mappedGame;
}
