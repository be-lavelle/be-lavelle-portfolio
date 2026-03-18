import { allTeamColors } from "../utils/Consts";
import { Play, Player } from "../utils/Types";

export const createTeam = (team: any) => {
  return {
    abbrev: team.abbrev,
    score: team.score,
    fullTeamName: `${team.placeName.default} ${team.commonName.default}`,
    img: team.logo,
    color: allTeamColors[team.abbrev][0],
    blackText: allTeamColors[team.abbrev][1],
  };
};

const image = new Image();
image.src = "https://i.imgur.com/Mm17Z4Q.png";

export const plugin = {
  id: "customCanvasBackgroundImage",
  beforeDraw: (chart) => {
    if (image.complete) {
      const ctx = chart.ctx;
      const { top, left, width, height } = chart.chartArea;
      const x = left - 1;
      const y = top - 1;
      ctx.drawImage(image, x, y, width, height + 1);
    } else {
      image.onload = () => chart.draw();
    }
  },
};

export const options = {
  scales: {
    x: {
      display: false,
      max: 100,
      min: -100,
    },
    y: {
      display: false,
      max: 42.5,
      min: -42.5,
    },
  },
  parsing: {
    xAxisKey: "x",
    yAxisKey: "y",
  },
  animation: {
    duration: 0,
  },

  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      usePointStyle: true,
      callbacks: {
        label: function (tooltipData) {
          const labels = tooltipData.dataset.label.toString();
          const values =
            tooltipData.dataset.data[tooltipData.dataIndex].distanceFromGoal;

          return `${labels}: ${values} from goal`;
        },
        title: function (tooltipData) {
          return tooltipData[0].dataset.data[tooltipData[0].dataIndex].name;
        },
      },
    },
  },
};

export function mapGoals(json) {
  console.log(json);
  const gameId = json.id;
  const homeTeamAbbrev = json.homeTeam.abbrev;
  const awayTeamAbbrev = json.awayTeam.abbrev;
  const homeTeamId = json.homeTeam.id;
  const homeTeamRoster = [];
  const awayTeamRoster = [];
  const allPlayers = {};
  json.rosterSpots.forEach((player) => {
    const teamPlayer: Player = {
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

  let isOTL =
    homeTeamGoals.some((goal) => {
      return !isRegulationPeriod(goal.period);
    }) ||
    awayTeamGoals.some((goal) => {
      return !isRegulationPeriod(goal.period);
    });
  const isOriginalHomeWin = originalScore.home - originalScore.away > 0;
  const isUpdatedHomeWin = updatedScore.home - updatedScore.away > 0;
  const isUpdatedTie = updatedScore.home === updatedScore.away;
  const originalResult = {
    [`${json.homeTeam.abbrev}`]: isOriginalHomeWin ? "W" : isOTL ? "OTL" : "L",
    [`${json.awayTeam.abbrev}`]: isOriginalHomeWin
      ? isOTL
        ? "OTL"
        : "L"
      : "W",
  };

  let updatedResult = {
    [`${json.homeTeam.abbrev}`]: isUpdatedTie
      ? "T"
      : isUpdatedHomeWin
        ? "W"
        : isOTL
          ? "OTL"
          : "L",
    [`${json.awayTeam.abbrev}`]: isUpdatedTie
      ? "T"
      : isUpdatedHomeWin
        ? isOTL
          ? "OTL"
          : "L"
        : "W",
  };

  const was2ptGoalScored =
    homeTeamGoals.some((goal) => {
      return goal.is2PtGoal;
    }) ||
    awayTeamGoals.some((goal) => {
      return goal.is2PtGoal;
    });
  return {
    gameId: gameId,
    was2ptGoalScored: was2ptGoalScored,
    homeTeam: homeTeamAbbrev,
    awayTeam: awayTeamAbbrev,
    homeGoals: homeTeamGoals,
    awayGoals: awayTeamGoals,
    originalScore,
    updatedScore,
    originalResult,
    updatedResult,
  };
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

  const isENPlay =
    play.situationCode.substring(0, 1) === "0" ||
    play.situationCode.substring(3, 4) === "0";

  const playBreakdown: Play = {
    playmakingTeam: playmakingTeam,
    defendingTeam: defendingTeam,
    gameId: gameId,
    x: play.details.xCoord,
    y: play.details.yCoord,
    distanceFromGoal: distance,
    againstGoalie: play.details,
    player: playerId,
    period: play.periodDescriptor.number,
    isENPlay: isENPlay,
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
