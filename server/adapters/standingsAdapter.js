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

export function mapGamesToPoints(teamGames, isGameBreakdown = false) {
  let allMappedTeamData = []
  teamGames.forEach((team) => {
    let totalPossiblePoints = 0;

    let originalPoints = 0;
    let originalRegulationWins = 0;
    let originalRegulationAndOvertimeWins = 0;
    let originalTotalWins = 0;
    let twoPointLinePoints = 0;
    let twoPointLineRegulationWins = 0;
    let twoPointLineRegulationAndOvertimeWins = 0;
    let twoPointLineTotalWins = 0;
    let teamName = team.team
    let pointsAtGameDate = {}
    let sortedTeamGames = team.data.sort((a, b) => {
      return a.game.gameId - b.game.gameId
    })
    sortedTeamGames.forEach((game) => {
      let originalGame = {}
      if (isGameBreakdown) {
        originalGame = game.game
      } else {
        originalGame = game
      }
      const isOriginallyOvertime = originalGame.isOvertime
      const isOriginallyShootout = originalGame.isShootout
      const isTwoPointLineOvertime = game.resultWithTwoPointLine.home === "OTL" || game.resultWithTwoPointLine.away === "OTL"
      const isTwoPointLineShootout = isOriginallyShootout && isTwoPointLineOvertime
      let originalGamePoints = 0;
      let twoPointLineGamePoints = 0;
      if (originalGame.homeTeamAbbrev === teamName) {
        originalGamePoints = getResultOfGame(originalGame.score.home, originalGame.score.away, isOriginallyOvertime);
        twoPointLineGamePoints = getResultOfGame(game.scoreWithTwoPointLine.home, game.scoreWithTwoPointLine.away, isTwoPointLineOvertime);
        originalPoints += originalGamePoints;
        twoPointLinePoints += twoPointLineGamePoints
      } else {
        originalGamePoints = getResultOfGame(originalGame.score.away, originalGame.score.home, isOriginallyOvertime);
        twoPointLineGamePoints = getResultOfGame(game.scoreWithTwoPointLine.away, game.scoreWithTwoPointLine.home, isTwoPointLineOvertime);
        originalPoints += originalGamePoints;
        twoPointLinePoints += twoPointLineGamePoints
      }
      originalRegulationWins += originalGamePoints === 2 && !isOriginallyOvertime ? 1 : 0;
      twoPointLineRegulationWins += twoPointLineGamePoints === 2 && !isTwoPointLineOvertime ? 1 : 0;
      originalRegulationAndOvertimeWins += originalGamePoints === 2 && !isOriginallyShootout ? 1 : 0;
      twoPointLineRegulationAndOvertimeWins += twoPointLineGamePoints === 2 && !isTwoPointLineShootout ? 1 : 0;
      originalTotalWins += originalGamePoints === 2 ? 1 : 0;
      twoPointLineTotalWins += twoPointLineGamePoints === 2 ? 1 : 0;
      totalPossiblePoints += 2;

      let currentOriginalPointsPercentage = Math.floor(Math.round(1000 * (originalPoints / totalPossiblePoints))) / 1000;
      let currentTwoPointLinePointsPercentage = Math.floor(Math.round(1000 * (twoPointLinePoints / totalPossiblePoints))) / 1000;
      let pointsDataAtGameDate = {
        originalPoints,
        originalPointsPercentage: currentOriginalPointsPercentage,
        originalRegulationWins,
        originalRegulationAndOvertimeWins: originalRegulationAndOvertimeWins,
        originalTotalWins,
        twoPointLinePoints,
        twoPointLinePointsPercentage: currentTwoPointLinePointsPercentage,
        twoPointLineRegulationWins,
        twoPointLineRegulationAndOvertimeWins,
        twoPointLineTotalWins,
        totalPossiblePoints,
      }
      pointsAtGameDate[originalGame.gameDate] = pointsDataAtGameDate
    });
    const originalPointsPercentage =
      Math.floor(Math.round(1000 * (originalPoints / totalPossiblePoints))) / 1000;

    const twoPointLinePointsPercentage =
      Math.floor(Math.round(1000 * (twoPointLinePoints / totalPossiblePoints))) / 1000;

    const mappedTeamData = {
      team: {
        teamName,
        division: allTeams[teamName].division
      },
      pointsAtGameDate,
      originalPoints,
      originalPointsPercentage,
      originalRegulationWins,
      originalRegulationAndOvertimeWins,
      originalTotalWins,
      twoPointLinePoints,
      twoPointLinePointsPercentage,
      twoPointLineRegulationWins,
      twoPointLineRegulationAndOvertimeWins,
      twoPointLineTotalWins,
    }
    allMappedTeamData.push(mappedTeamData)
  })
  return allMappedTeamData;
}

export function mapPointsToLeagueRankings(allTeamPoints) {
  const originalSorted = allTeamPoints.sort(sortOriginalPointsRankings()).filter((x) => x);
  const twoPointLineSorted = allTeamPoints.sort(sortTwoPointLinePointsRankings()).filter((x) => x)
  return { originalSorted, twoPointLineSorted };
}

export function mapPointsToDivisionRankings(leagueRankings) {
  if (leagueRankings) {
    let pacific = leagueRankings.filter((team) => {
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
  ].sort(sortOriginalPointsRankings());
  let western = [...divisionRankings.pacific, ...divisionRankings.central].sort(
    sortOriginalPointsRankings(),
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
    sortOriginalPointsRankings(),
  );
  const restOfWest = [...restOfPacific, ...restOfCentral].sort(
    sortOriginalPointsRankings(),
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

function sortOriginalPointsRankings() {
  return function (a, b) {
    if (b.originalPoints === a.originalPoints) {
      if (b.originalPointsPercentage === a.originalPointsPercentage) {
        if (b.originalRegulationWins === a.originalRegulationWins) {
          if (b.originalRegulationAndOvertimeWins === a.originalRegulationAndOvertimeWins) {
            return b.originalTotalWins - a.originalTotalWins;
          } else {
            return b.originalRegulationAndOvertimeWins - a.originalRegulationAndOvertimeWins;
          }
        } else {
          return b.originalRegulationWins - a.originalRegulationWins;
        }
      } else {
        return b.originalPointsPercentage - a.originalPointsPercentage;
      }
    } else {
      return b.originalPoints - a.originalPoints;
    }
  };
}

function sortTwoPointLinePointsRankings() {
  return function (a, b) {
    if (b.twoPointLinePoints === a.twoPointLinePoints) {
      if (b.twoPointLinePointsPercentage === a.twoPointLinePointsPercentage) {
        if (b.twoPointLineRegulationWins === a.twoPointLineRegulationWins) {
          if (b.twoPointLineRegulationAndOvertimeWins === a.twoPointLineRegulationAndOvertimeWins) {
            return b.twoPointLineTotalWins - a.twoPointLineTotalWins;
          } else {
            return b.twoPointLineRegulationAndOvertimeWins - a.twoPointLineRegulationAndOvertimeWins;
          }
        } else {
          return b.twoPointLineRegulationWins - a.twoPointLineRegulationWins;
        }
      } else {
        return b.twoPointLinePointsPercentage - a.twoPointLinePointsPercentage;
      }
    } else {
      return b.twoPointLinePoints - a.twoPointLinePoints;
    }
  };
}

function getResultOfGame(ourTeamScore, otherTeamScore, isOT) {
  if (ourTeamScore > otherTeamScore) {
    return 2;
  } else if (isOT || (ourTeamScore === otherTeamScore)) {
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
