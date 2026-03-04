import Typography from "@mui/material/Typography";
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Grid,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Game } from "../utils/Types";
import { TeamScoreChip } from "./TeamScoreChip";

export const GameExpand = (game: Game) => {
  return (
    <Accordion
      sx={{
        mb: 0,
        width: "60%",
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Grid container spacing={1} width={"200px"}>
          <TeamScoreChip {...game.homeTeam} />
          <TeamScoreChip {...game.awayTeam} />
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};
