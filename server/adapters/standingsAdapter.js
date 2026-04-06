import { allTeams } from "../utils/consts.js";
export function getGameBreakdown(json, season) {
  const gameId = json.id;
  const gameDate = json.gameDate;
  const homeTeamAbbrev = json.homeTeam.abbrev;
  const awayTeamAbbrev = json.awayTeam.abbrev;
  const homeTeamId = json.homeTeam.id;
  let isOT = json.gameOutcome.lastPeriodType !== "REG";
  let isSO = json.gameOutcome.lastPeriodType === "SO";
  const homeTeamRoster = [];
  const awayTeamRoster = [];
  const allPlayers = {};
  json.rosterSpots.forEach((player) => {
    const teamPlayer = {
      name: `${player.firstName.default} ${player.lastName.default}`,
      number: player.sweaterNumber,
      id: player.playerId,
      position: player.positionCode,
      team:
        player.teamId === homeTeamId
          ? json.homeTeam.abbrev
          : json.awayTeam.abbrev,
    };
    if (player.teamId === homeTeamId) {
      homeTeamRoster.push(teamPlayer);
    } else {
      awayTeamRoster.push(teamPlayer);
    }
    allPlayers[`${teamPlayer.id}`] = teamPlayer;
  });
  const goals = json.plays.filter((play) => play.typeDescKey === "goal");
  const shots = json.plays.filter(
    (play) => play.typeDescKey === "shot-on-goal",
  );

  let homeTeamGoals = [];
  let homeTeamShots = [];
  let awayTeamGoals = [];
  let awayTeamShots = [];

  goals.forEach((goal) => {
    const isHomeGoal = homeTeamRoster.some((player) => {
      return player.id === goal.details.scoringPlayerId;
    });

    let playBreakdown = buildBreakdown(
      goal,
      allPlayers[goal.details.scoringPlayerId].name,
      isHomeGoal,
      isHomeGoal ? json.homeTeam.abbrev : json.awayTeam.abbrev,
      isHomeGoal ? json.awayTeam.abbrev : json.homeTeam.abbrev,
      "goal",
      gameId,
    );
    if (isHomeGoal) {
      homeTeamGoals.push(playBreakdown);
    } else {
      awayTeamGoals.push(playBreakdown);
    }
  });

  shots.forEach((shot) => {
    const isHomeShot = homeTeamRoster.some((player) => {
      return player.id === shot.details.shootingPlayerId;
    });
    const shotBreakdown = buildBreakdown(
      shot,
      shot.details.shootingPlayerId,
      isHomeShot,
      isHomeShot ? json.homeTeam.abbrev : json.awayTeam.abbrev,
      isHomeShot ? json.awayTeam.abbrev : json.homeTeam.abbrev,
      "shot",
      gameId,
    );
    if (isHomeShot) {
      homeTeamShots.push(shotBreakdown);
    } else {
      awayTeamShots.push(shotBreakdown);
    }
  });

  let getOriginalAndUpdatedScores = buildOriginalAndUpdatedScore(
    homeTeamGoals,
    awayTeamGoals,
  );
  const originalScore = getOriginalAndUpdatedScores.originalScore;
  const updatedScore = getOriginalAndUpdatedScores.updatedScore;

  const isOriginalHomeWin = originalScore.home - originalScore.away > 0;
  const isUpdatedHomeWin = updatedScore.home - updatedScore.away > 0;
  const isUpdatedTie = updatedScore.home === updatedScore.away;
  const originalResult = {
    home: isOriginalHomeWin ? "W" : isOT ? "OTL" : "L",
    away: isOriginalHomeWin ? (isOT ? "OTL" : "L") : "W",
  };

  let updatedResult = {
    home: isUpdatedTie ? "T" : isUpdatedHomeWin ? "W" : isOT ? "OTL" : "L",
    away: isUpdatedTie ? "T" : isUpdatedHomeWin ? (isOT ? "OTL" : "L") : "W",
  };

  const was2ptGoalScored =
    homeTeamGoals.some((goal) => {
      return goal.is2PtGoal;
    }) ||
    awayTeamGoals.some((goal) => {
      return goal.is2PtGoal;
    });

  const game = {
    season: season,
    gameId: gameId,
    gameDate: gameDate,
    homeTeamAbbrev: homeTeamAbbrev,
    awayTeamAbbrev: awayTeamAbbrev,
    score: originalScore,
    result: originalResult,
    isOvertime: isOT,
    isShootout: isSO,
  };

  return {
    game: game,
    was2ptGoalScored: was2ptGoalScored,
    homeTeamGoals: homeTeamGoals,
    awayTeamGoals: awayTeamGoals,
    scoreWithTwoPointLine: updatedScore,
    resultWithTwoPointLine: updatedResult,
  };
}

export function mapGamesToPoints(teamGames) {
  let allMappedTeamData = []
  teamGames.forEach((team) => {
    let points = 0;
    let totalPossiblePoints = 0;
    let regulationWins = 0;
    let regulationAndOvertimeWins = 0;
    let totalWins = 0;
    let teamName = team.team
    team.data.forEach((game) => {
      let isOvertime = game.isOvertime
      let isShootout = game.isShootout
      console.log("GAME", game)
      let gameResult = 0;
      if (game.homeTeamAbbrev === teamName) {
        gameResult = getResultOfGame(game.score.home, game.score.away, isOvertime);
        points += gameResult;
      } else {
        gameResult = getResultOfGame(game.score.away, game.score.home, isOvertime);
        points += gameResult;
      }
      regulationWins += gameResult === 2 && !isOvertime ? 1 : 0;
      regulationAndOvertimeWins += gameResult === 2 && !isShootout ? 1 : 0;
      totalWins += gameResult === 2 ? 1 : 0;
      totalPossiblePoints += 2;
    });
    let pointsPercentage =
      Math.floor(Math.round(1000 * (points / totalPossiblePoints))) / 1000;

    let mappedTeamData = {
      team: {
        teamName,
        division: allTeams[teamName].division
      },
      points,
      pointsPercentage: pointsPercentage,
      regulationWins: regulationWins,
      regulationAndOvertimeWins: regulationAndOvertimeWins,
      totalWins: totalWins,
    }
    allMappedTeamData.push(mappedTeamData)
  })
  return allMappedTeamData;
}

export function mapPointsToLeagueRankings(allTeamPoints) {
  const sorted = allTeamPoints.sort(sortPointsRankings()).filter((x) => x);
  return sorted;
}

export function mapPointsToDivisionRankings(leagueRankings) {
  if (leagueRankings) {
    let pacific = leagueRankings.filter((team) => {
      console.log("TEAM", team);
      return team.team.division === "Pacific";
    });
    let atlantic = leagueRankings.filter((team) => {
      return team.team.division === "Atlantic";
    });
    let central = leagueRankings.filter((team) => {
      return team.team.division === "Central";
    });
    let metropolitan = leagueRankings.filter((team) => {
      return team.team.division === "Metropolitan";
    });
    return { pacific, central, atlantic, metropolitan };
  }
  return {};
}

export function mapPointsToConferenceRankings(divisionRankings) {
  let eastern = [
    ...divisionRankings.atlantic,
    ...divisionRankings.metropolitan,
  ].sort(sortPointsRankings());
  let western = [...divisionRankings.pacific, ...divisionRankings.central].sort(
    sortPointsRankings(),
  );
  return {
    eastern,
    western,
  };
}

export function mapPointsToWildcardRankings(divisionRankings) {
  const top3Pacific = divisionRankings.pacific.slice(0, 3);
  const restOfPacific = divisionRankings.pacific.slice(3);
  const top3Atlantic = divisionRankings.atlantic.slice(0, 3);
  const restOfAtlantic = divisionRankings.atlantic.slice(3);
  const top3Metropolitan = divisionRankings.metropolitan.slice(0, 3);
  const restOfMetropolitan = divisionRankings.metropolitan.slice(3);
  const top3Central = divisionRankings.central.slice(0, 3);
  const restOfCentral = divisionRankings.central.slice(3);

  const restOfEast = [...restOfAtlantic, ...restOfMetropolitan].sort(
    sortPointsRankings(),
  );
  const restOfWest = [...restOfPacific, ...restOfCentral].sort(
    sortPointsRankings(),
  );

  return {
    top3Atlantic,
    top3Central,
    top3Metropolitan,
    top3Pacific,
    eastWildcards: restOfEast.slice(0, 2),
    westWildcards: restOfWest.slice(0, 2),
    restOfEast: restOfEast.slice(2),
    restOfWest: restOfWest.slice(2),
  };
}

function sortPointsRankings() {
  return function (a, b) {
    if (b.points === a.points) {
      if (b.pointsPercentage === a.pointsPercentage) {
        if (b.regulationWins === a.regulationWins) {
          if (b.regulationAndOvertimeWins === a.regulationAndOvertimeWins) {
            return b.totalWins - a.totalWins;
          } else {
            return b.regulationAndOvertimeWins - a.regulationAndOvertimeWins;
          }
        } else {
          return b.regulationWins - a.regulationWins;
        }
      } else {
        return b.pointsPercentage - a.pointsPercentage;
      }
    } else {
      return b.points - a.points;
    }
  };
}

function getResultOfGame(ourTeamScore, otherTeamScore, isOT) {
  if (ourTeamScore > otherTeamScore) {
    return 2;
  } else if (isOT) {
    return 1;
  } else {
    return 0;
  }
}

function buildBreakdown(
  play,
  playerId,
  isHomeGoal,
  playmakingTeam,
  defendingTeam,
  shotOrGoal,
  gameId,
) {
  let isRight = false;
  if (isHomeGoal) {
    isRight = play.homeTeamDefendingSide === "right";
  } else {
    isRight = play.homeTeamDefendingSide === "left";
  }

  const distance = distanceFromGoal(
    play.details.xCoord,
    play.details.yCoord,
    isRight,
  );

  const isENPlay = play.details.goalieInNetId === undefined;

  const playBreakdown = {
    playmakingTeam: playmakingTeam,
    defendingTeam: defendingTeam,
    gameId: gameId,
    x: play.details.xCoord,
    y: play.details.yCoord,
    distanceFromGoal: distance,
    againstGoalie: isENPlay ? 0 : play.details.goalieInNetId,
    playerId: playerId,
    period: play.periodDescriptor.number,
    isEmptyNetPlay: isENPlay,
    isShotOrGoal: shotOrGoal,
    is2PtGoal: shotOrGoal === "goal" && distance > 43.5 && !isENPlay,
  };

  return playBreakdown;
}

function shouldGoToOvertime(original, updated) {
  if (original.home === updated.home && original.away === updated.away) {
    return true;
  }
}

function isRegulationPeriod(period) {
  return period !== 4 && period !== 5;
}

function updateScore(goal, isHome, originalScore, updatedScore) {
  const isRegulation = isRegulationPeriod(goal.period);
  if (
    isRegulation ||
    (!isRegulation && shouldGoToOvertime(originalScore, updatedScore))
  ) {
    if (isHome) {
      originalScore.home += 1;
      updatedScore.home += goal.is2PtGoal ? 2 : 1;
    } else {
      originalScore.away += 1;
      updatedScore.away += goal.is2PtGoal ? 2 : 1;
    }
  } else if (
    !isRegulation &&
    !shouldGoToOvertime(originalScore, updatedScore)
  ) {
    if (isHome) {
      originalScore.home += 1;
    } else {
      originalScore.away += 1;
    }
  }
  return {
    originalScore,
    updatedScore,
  };
}

function buildOriginalAndUpdatedScore(homeTeamGoals, awayTeamGoals) {
  let originalScore = { home: 0, away: 0 };
  let updatedScore = { home: 0, away: 0 };

  homeTeamGoals.forEach((goal) => {
    const newScore = updateScore(goal, true, originalScore, updatedScore);
    originalScore = newScore.originalScore;
    updatedScore = newScore.updatedScore;
  });
  awayTeamGoals.forEach((goal) => {
    const newScore = updateScore(goal, false, originalScore, updatedScore);
    originalScore = newScore.originalScore;
    updatedScore = newScore.updatedScore;
  });
  return {
    originalScore,
    updatedScore,
  };
}

function distanceFromGoal(x, y, isRight) {
  const center = isRight ? { x: -87.5, y: 0 } : { x: 87.5, y: 0 };
  return (
    Math.round(
      Math.sqrt(
        (center.x - x) * (center.x - x) + (center.y - y) * (center.y - y),
      ) * 10,
    ) / 10
  );
}
