import mongoose from "mongoose";

const ScoreSchema = mongoose.Schema({
  home: {
    type: Number,
    required: [true, "Please enter home score"],
  },
  away: {
    type: Number,
    required: [true, "Please enter away score"],
  },
});
export const Score = mongoose.model("Score", ScoreSchema);

const ResultSchema = mongoose.Schema({
  home: {
    type: String,
    required: [true, "Please enter home result"],
  },
  away: {
    type: String,
    required: [true, "Please enter away result"],
  },
});
export const Result = mongoose.model("Result", ResultSchema);

const PlayBreakdownSchema = mongoose.Schema({
  gameId: {
    type: String,
    required: [true, "Please enter gameId"],
  },
  playmakingTeam: {
    type: String,
    required: [true, "Please enter playmakingTeam"],
  },
  defendingTeam: {
    type: String,
    required: [true, "Please enter defendingTeam"],
  },
  x: {
    type: Number,
    required: [true, "Please enter x"],
  },
  y: {
    type: Number,
    required: [true, "Please enter y"],
  },
  distanceFromGoal: {
    type: Number,
    required: [true, "Please enter distanceFromGoal"],
  },
  againstGoalie: {
    type: String,
    required: [true, "Please enter againstGoalie"],
  },
  playerId: {
    type: String,
    required: [true, "Please enter playerId"],
  },
  period: {
    type: Number,
    required: [true, "Please enter period"],
  },
  isEmptyNetPlay: {
    type: Boolean,
    required: [true, "Please enter isEmptyNetPlay"],
  },
  is2PtGoal: {
    type: Boolean,
    required: [true, "Please enter is2PtGoal"],
  },
  isShotOrGoal: {
    type: String,
    required: [true, "Please enter isShotOrGoal"],
  },
});

export const PlayBreakdown = mongoose.model(
  "PlayBreakdown",
  PlayBreakdownSchema,
);

const GameSchema = mongoose.Schema({
  gameId: {
    type: String,
    required: [true, "Please enter gameId"],
  },
  season: {
    type: String,
    required: [true, "Please enter gameId"],
  },
  gameDate: {
    type: String,
    required: [true, "Please enter gameDate"],
  },
  homeTeamAbbrev: {
    type: String,
    required: [true, "Please enter homeTeamAbbrev"],
  },
  awayTeamAbbrev: {
    type: String,
    required: [true, "Please enter awayTeamAbbrev"],
  },
  score: {
    type: ScoreSchema,
    required: [true, "Please enter score"],
  },
  result: {
    type: ResultSchema,
    required: [true, "Please enter result"],
  },
  isOvertime: {
    type: Boolean,
    required: [true, "Please enter isOvertime"],
  },
  isShootout: {
    type: Boolean,
    required: [true, "Please enter isShootout"],
  },
});

export const Game = mongoose.model("Game", GameSchema);

const GameBreakdownSchema = mongoose.Schema(
  {
    game: {
      type: GameSchema,
      required: [true, "Please enter gameId"],
    },
    homeTeamGoals: {
      type: [PlayBreakdownSchema],
      required: [true, "Please enter homeTeamGoals"],
    },
    awayTeamGoals: {
      type: [PlayBreakdownSchema],
      required: [true, "Please enter awayTeamGoals"],
    },
    scoreWithTwoPointLine: {
      type: ScoreSchema,
      required: [true, "Please enter scoreWithTwoPointLine"],
    },
    resultWithTwoPointLine: {
      type: ResultSchema,
      required: [true, "Please enter resultWithTwoPointLine"],
    },
    was2ptGoalScored: {
      type: Boolean,
      required: [true, "Please enter was2ptGoalScored"],
    },
  },
  { timestamps: true },
);

export const GameBreakdown = mongoose.model(
  "GameBreakdown",
  GameBreakdownSchema,
);
