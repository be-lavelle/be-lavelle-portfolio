import { allTeamColors } from "../utils/Consts";

export const createTeam = (team: any) => {
  console.log(`${team.abbrev}`);
  console.log(`${allTeamColors[team.abbrev][0]}`);
  return {
    abbrev: team.abbrev,
    score: team.score,
    fullTeamName: `${team.placeName.default} ${team.commonName.default}`,
    img: team.logo,
    color: allTeamColors[team.abbrev][0],
    blackText: allTeamColors[team.abbrev][1],
  };
};
