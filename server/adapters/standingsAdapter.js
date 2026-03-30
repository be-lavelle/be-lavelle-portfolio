export function mapGamesToPoints(games, team) {
  let points = 0;
  games.forEach((game) => {
    if (game.gameOutcome) {
      let isOT = game.gameOutcome.lastPeriodType !== "REG";
      if (game.homeTeam.abbrev === team.abbrev) {
        points += getResultOfGame(game.homeTeam, game.awayTeam, isOT);
      } else {
        points += getResultOfGame(game.awayTeam, game.homeTeam, isOT);
      }
    }
  });
  return { team, points };
}

export function mapPointsToLeagueRankings(allTeamPoints) {
  const sorted = allTeamPoints.sort(sortByPoints());
  return sorted;
}

export function mapPointsToDivisionRankings(leagueRankings) {
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

function sortByPoints() {
  return function (a, b) {
    return b.points - a.points;
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
