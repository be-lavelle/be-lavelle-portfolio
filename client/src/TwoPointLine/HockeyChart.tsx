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
    let homeGoals = goalsForGame.homeGoals.map((goal) => {
      return {
        name: goal.player,
        x: goal.x,
        y: goal.y,
        distanceFromGoal: goal.distanceFromGoal,
      };
    });

    let awayGoals = goalsForGame.awayGoals.map((goal) => {
      return {
        name: goal.player,
        x: goal.x,
        y: goal.y,
        distanceFromGoal: goal.distanceFromGoal,
      };
    });

    let data = {
      datasets: [
        {
          label: `${goalsForGame.homeTeam} Goals`,
          data: homeGoals,
          pointRadius: [6],
          fill: false,
          pointHoverBackgroundColor: allTeamColors[goalsForGame.homeTeam][0],
          backgroundColor: allTeamColors[goalsForGame.homeTeam][0],
        },
        {
          label: `${goalsForGame.awayTeam} Goals`,
          data: awayGoals,
          pointRadius: [6],
          fill: false,
          pointHoverBackgroundColor: allTeamColors[goalsForGame.awayTeam][0],
          backgroundColor: allTeamColors[goalsForGame.awayTeam][0],
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
