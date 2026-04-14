export type RegexAndErrorMessage = {
  regex: RegExp;
  errorMessage: string;
};

export type RegexesType = {
  [key: string]: RegexAndErrorMessage;
};

export type Team = {
  fullTeamName: string;
  abbrev: string;
  img: string;
  color: string;
  blackText: boolean;
  score?: number;
};

export type Game = {
  key: string;
  gameDate: string;
  homeTeam: Team;
  awayTeam: Team;
};

export type GameExpandController = {
  game: Game;
  onChange?: any;
};

export type Player = {
  name: string;
  number: number;
  id: string;
  position: string;
  team: string;
};

export type Play = {
  playmakingTeam: string;
  defendingTeam: string;
  gameId: number;
  x: number;
  y: number;
  distanceFromGoal: number;
  againstGoalie: any;
  player: string;
  period: number;
  isENPlay: boolean;
  isShotOrGoal: string;
  is2PtGoal: boolean;
};

export type Standings = {
  id: number;
  team: string;
  points: number;
  pointsPercentage: number;
  regulationWins: number;
  regulationAndOvertimeWins: number;
  totalWins: number;
}

export enum RankingsType {
  Wildcard = "Wildcard",
  Division = "Division",
  Conference = "Conference",
  League = "League"
} 
