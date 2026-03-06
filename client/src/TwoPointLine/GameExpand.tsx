import Typography from "@mui/material/Typography";
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { GameExpandController } from "../utils/Types";
import { TeamScoreChip } from "./TeamScoreChip";
import "../App.css";

export const GameExpand = (gameExpandController: GameExpandController) => {
  const [focused, setFocused] = React.useState(false);
  const [backgroundColor, setBackgroundColor] = React.useState("#ffffff");

  React.useEffect(() => {
    setBackgroundColor(focused ? "#def2ff" : "#ffffff");
  }, [focused]);

  return (
    <Accordion
      sx={{
        mb: 0,
        width: "100%",
        backgroundColor: backgroundColor,
      }}
      slotProps={{ transition: { unmountOnExit: true } }}
      onChange={(e, expanded) => {
        if (expanded) {
          gameExpandController.onChange();
          setFocused(true);
        } else {
          setFocused(false);
        }
      }}
      expanded={focused}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{ width: "100%", justifyContent: "center", display: "flex" }}
        onBlur={() => {
          setFocused(false);
        }}
      >
        <Grid container spacing={1} width={"auto"}>
          <TeamScoreChip {...gameExpandController.game.homeTeam} />
          <TeamScoreChip {...gameExpandController.game.awayTeam} />
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>BLEP</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
