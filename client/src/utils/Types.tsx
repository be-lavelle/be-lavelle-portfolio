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
