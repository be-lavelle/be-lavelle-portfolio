export function mapGamesToPoints(games, team) {
  let points = 0;
  let totalPossiblePoints = 0;
  let regulationWins = 0;
  let regulationAndOvertimeWins = 0;
  let totalWins = 0;
  games.forEach((game) => {
    if (game.gameOutcome) {
      let isOT = game.gameOutcome.lastPeriodType !== "REG";
      let isSO = game.gameOutcome.lastPeriodType === "SO";

      let gameResult = 0;
      if (game.homeTeam.abbrev === team.abbrev) {
        gameResult = getResultOfGame(game.homeTeam, game.awayTeam, isOT);
        points += gameResult;
      } else {
        gameResult = getResultOfGame(game.awayTeam, game.homeTeam, isOT);
        points += gameResult;
      }
      regulationWins += gameResult === 2 && !isOT ? 1 : 0;
      regulationAndOvertimeWins += gameResult === 2 && !isSO ? 1 : 0;
      totalWins += gameResult === 2 ? 1 : 0;
      totalPossiblePoints += 2;
    }
  });
  let pointsPercentage =
    Math.floor(Math.round(1000 * (points / totalPossiblePoints))) / 1000;

  return {
    team,
    points,
    pointsPercentage: pointsPercentage,
    regulationWins: regulationWins,
    regulationAndOvertimeWins: regulationAndOvertimeWins,
    totalWins: totalWins,
  };
}

export function mapPointsToLeagueRankings(allTeamPoints) {
  const sorted = allTeamPoints.sort(sortByPoints()).filter((x) => x);
  return sorted;
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
  ].sort(sortByPoints());
  let western = [...divisionRankings.pacific, ...divisionRankings.central].sort(
    sortByPoints(),
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
    sortByPoints(),
  );
  const restOfWest = [...restOfPacific, ...restOfCentral].sort(sortByPoints());

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

// TODO: implement sorting by all factors
function sortByPoints() {
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

function getResultOfGame(ourTeam, otherTeam, isOT) {
  if (ourTeam.score > otherTeam.score) {
    return 2;
  } else if (isOT) {
    return 1;
  } else {
    return 0;
  }
}
