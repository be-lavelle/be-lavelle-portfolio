import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import { RegexesType, Standings } from "./Types";

export const regexes: RegexesType = {
  name: { regex: /^.{1,100}$/, errorMessage: "Please enter a name" },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    errorMessage: "Please enter a valid email address",
  },
  message: {
    regex: /^.{1,1000}$/,
    errorMessage: "",
  },
};

export const allTeams = {
  ANA: "Anaheim Ducks",
  ARI: "Arizona Coyotes",
  BOS: "Boston Bruins",
  BUF: "Buffalo Sabres",
  CAR: "Carolina Hurricanes",
  CBJ: "Columbus Blue Jackets",
  CGY: "Calgary Flames",
  CHI: "Chicago Blackhawks",
  COL: "Colorado Avalanche",
  DAL: "Dallas Stars",
  DET: "Detroit Red Wings",
  EDM: "Edmonton Oilers",
  FLA: "Florida Panthers",
  LAK: "Los Angeles Kings",
  MIN: "Minnesota Wild",
  MTL: "Montréal Canadiens",
  NJD: "New Jersey Devils",
  NSH: "Nashville Predators",
  NYI: "New York Islanders",
  NYR: "New York Rangers",
  OTT: "Ottawa Senators",
  PHI: "Philadelphia Flyers",
  PIT: "Pittsburgh Penguins",
  SEA: "Seattle Kraken",
  SJS: "San Jose Sharks",
  STL: "St. Louis Blues",
  TBL: "Tampa Bay Lightning",
  TOR: "Toronto Maple Leafs",
  UTA: "Utah Mammoth",
  VAN: "Vancouver Canucks",
  VGK: "Vegas Golden Knights",
  WPG: "Winnipeg Jets",
  WSH: "Washington Capitals",
};

export const seasons = {
  "22-23": "20222023",
  "23-24": "20232024",
  "24-25": "20242025",
  "25-26": "20252026",
};

export const allTeamColors = {
  ANA: ["#412838", false],
  ARI: ["#D45000", true],
  BOS: ["#FCB514", true],
  BUF: ["#002554", false],
  CAR: ["#CE1126", false],
  CBJ: ["#002554", false],
  CGY: ["#CE1125", false],
  CHI: ["#Cf092B", false],
  COL: ["#6F263D", false],
  DAL: ["#006645", false],
  DET: ["#CE1126", false],
  EDM: ["#FF4C00", true],
  FLA: ["#C8102E", false],
  LAK: ["#ABAEA9", true],
  MIN: ["#014830", false],
  MTL: ["#AE1E2D", false],
  NJD: ["#CE1125", false],
  NSH: ["#FFB71B", true],
  NYI: ["#F47D30", true],
  NYR: ["#0068AA", false],
  OTT: ["#BE900B", false],
  PHI: ["#F74802", false],
  PIT: ["#FCB414", true],
  SEA: ["#96D8D8", true],
  SJS: ["#46BDC6", true],
  STL: ["#002E87", false],
  TBL: ["#002868", false],
  TOR: ["#00205B", false],
  UTA: ["#79b2e0", true],
  VAN: ["#002854", false],
  VGK: ["#B4975A", false],
  WPG: ["#041E41", false],
  WSH: ["#CF0A2B", false],
};

export const defaultStandings = {
  "originalLeagueRankings": [],
  "twoPointLineLeagueRankings": [],
  "originalDivisionRankings": {
    "pacific": [],
    "central": [],
    "atlantic": [],
    "metropolitan": []
  },
  "twoPointLineDivisionRankings": {
    "pacific": [],
    "central": [],
    "atlantic": [],
    "metropolitan": []
  },
  "originalConferenceRankings": {
    "eastern": [],
    "western": [],
  },
  "twoPointLineConferenceRankings": {
    "eastern": [],
    "western": [],
  },
  "originalWildcardRankings": {
    "top3Atlantic": [],
    "top3Central": [],
    "top3Metropolitan": [],
    "top3Pacific": [],
    "eastWildcards": [],
    "westWildcards": [],
    "restOfEast": [],
    "restOfWest": []
  },
  "twoPointLineWildcardRankings": {
    "top3Atlantic": [],
    "top3Central": [],
    "top3Metropolitan": [],
    "top3Pacific": [],
    "eastWildcards": [],
    "westWildcards": [],
    "restOfEast": [],
    "restOfWest": []
  }
}

export const defaultStandingsColumns: GridColDef<Standings>[] = [
  {
    field: 'id', headerName: 'Rank', width: 50,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
  },
  {
    field: 'team', headerName: 'Team', width: 100,
    display: "flex",
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
    renderCell: (params) => <><img width="40px" src={`https://assets.nhle.com/logos/nhl/svg/${params.value}_light.svg`} /> {params.value}</>, // renderCell will render the component
  },
  {
    field: 'points',
    headerName: 'Points',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
  },
  {
    field: 'pointsPercentage',
    headerName: 'Points %',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
  },
  {
    field: 'regulationWins',
    headerName: 'RW',
    description: 'Regulation wins',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
  },
  {
    field: 'regulationAndOvertimeWins',
    headerName: 'ROW',
    description: 'Regulation and overtime wins',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
  },
  {
    field: 'totalWins',
    headerName: 'TW',
    description: 'Total Wins',
    flex: 1,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    headerClassName: 'data-grid-header',
  },
];

export const defaultStandingsRows = [{
  id: 1,
  team: "N/A",
  points: 0,
  pointsPercentage: 0,
  regulationWins: 0,
  regulationAndOvertimeWins: 0,
  totalWins: 0
}]
