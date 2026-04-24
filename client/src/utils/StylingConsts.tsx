import { Team } from "./Types";

export const h4Style = {
  flexGrow: 1,
  color: "#966a9e",
  textDecoration: "none",
  fontFamily: "Faculty Glyphic",
};

export const h6Style = {
  flexGrow: 1,
  color: "#966a9e",
  textDecoration: "none",
  fontFamily: "Faculty Glyphic",
};

export const toolbarStyle = {
  background: "#ebbaf4",
};

export const toolbarBoxStyle = { display: { md: "flex" }, color: "#966a9e" };

export const boxStyle = { m: 1, width: "100%" };

export const textFieldStyle = { mt: 1 };

export const helperTextStyle = { ml: 1, mb: 0.35 };

export const gridAbbrevItemStyle = {
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
};

export const standingsTypeGridItem = {
  ...gridAbbrevItemStyle,
  border: 1,
  borderColor: "rgba(224, 224, 224, 1)"
}

export const chipScoreStyle = (team: Team) => {
  return {
    fontWeight: 900,
    background: team.color,
    color: team.blackText ? "black" : "white",
  };
};

export const mappedGamesBoxStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
};

export const playoffTeamRowStyling = {
  '& .playoff-team:hover': {
    "background-color": "rgb(200, 228, 200)"
  }, '& .non-playoff-team:hover': {
    "background-color": "rgb(213, 183, 189);"
  },
}

export const standingsTabStyle = {
  width: "100%",
  flexGrow: 1,
  color: "#966a9e",
  textDecoration: "none",
  fontFamily: "Faculty Glyphic",
}

export const standingsTitle = {
  flexGrow: 1,
  color: "#966a9e",
  textDecoration: "none",
  fontFamily: "Faculty Glyphic", marginTop: 2, marginBottom: 2, justifyContent: "center", display: "flex"
}


