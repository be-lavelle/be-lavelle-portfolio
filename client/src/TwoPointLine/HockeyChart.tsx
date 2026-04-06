import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import { Scatter } from "react-chartjs-2";
import { options, plugin } from "./DataAdapter";
import { allTeamColors } from "../utils/Consts";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const HockeyChart = (goals: any) => {
  console.log(goals);
  if (Object.keys(goals.goals).length !== 0) {
    const goalsForGame = goals.goals;
    let homeGoals = goalsForGame.homeTeamGoals.map((goal) => {
      return {
        name: goal.playerId,
        x: goal.x,
        y: goal.y,
        distanceFromGoal: goal.distanceFromGoal,
      };
    });

    let awayGoals = goalsForGame.awayTeamGoals.map((goal) => {
      return {
        name: goal.playerId,
        x: goal.x,
        y: goal.y,
        distanceFromGoal: goal.distanceFromGoal,
      };
    });

    let data = {
      datasets: [
        {
          label: `${goalsForGame.game.homeTeamAbbrev} Goals`,
          data: homeGoals,
          pointRadius: [6],
          fill: false,
          pointHoverBackgroundColor:
            allTeamColors[goalsForGame.game.homeTeamAbbrev][0],
          backgroundColor: allTeamColors[goalsForGame.game.homeTeamAbbrev][0],
        },
        {
          label: `${goalsForGame.game.awayTeamAbbrev} Goals`,
          data: awayGoals,
          pointRadius: [6],
          fill: false,
          pointHoverBackgroundColor:
            allTeamColors[goalsForGame.game.awayTeamAbbrev][0],
          backgroundColor: allTeamColors[goalsForGame.game.awayTeamAbbrev][0],
        },
      ],
    };
    return (
      <Box height={{ md: "55vh", sm: "37vh" }} position="relative">
        <Scatter options={options} data={data} plugins={[plugin]} />
      </Box>
    );
  } else {
    return <></>;
  }
};
