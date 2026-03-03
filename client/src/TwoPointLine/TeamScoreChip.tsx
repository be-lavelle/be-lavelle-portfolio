import { Grid, Typography, Chip } from "@mui/material";
import React from "react";
import { Team } from "../utils/Types";
import { gridAbbrevItemStyle } from "../utils/StylingConsts";

export const TeamScoreChip = (team: Team) => {
  return (
    <>
      <Grid size={3} sx={gridAbbrevItemStyle}>
        <img
          src={team.img}
          aria-label={`${team.fullTeamName} Logo`}
          width="64px"
        ></img>
      </Grid>
      <Grid size={5} sx={gridAbbrevItemStyle}>
        <Typography component="h6">{team.abbrev}</Typography>
      </Grid>
      <Grid size={4} sx={gridAbbrevItemStyle}>
        <Chip
          label={team.score}
          sx={{
            fontWeight: 900,
            background: team.color,
            color: team.blackText ? "black" : "white",
          }}
        />
      </Grid>
    </>
  );
};
