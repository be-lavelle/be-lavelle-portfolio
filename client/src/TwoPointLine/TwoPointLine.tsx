import Typography from "@mui/material/Typography";
import React from "react";
import { h4Style } from "../utils/StylingConsts";
import Button from "@mui/material/Button";
import axios from "axios";
import { GameExpand } from "./GameExpand";
import { Team } from "../utils/Types";
import { createTeam } from "./DataAdapter";

export const TwoPointLine = () => {
  let games = [];
  const [mappedGames, setMappedGames] = React.useState([]);
  const handleSubmit = (e: React.SyntheticEvent) => {
    axios.get("http://localhost:8080").then((data) => {
      //this console.log will be in our frontend console
      games = data.data.games;
      console.log(games);
      let gameMap = games.map((game) => {
        const homeTeam: Team = createTeam(game.homeTeam);
        const awayTeam: Team = createTeam(game.awayTeam);

        return (
          <GameExpand
            gameDate={game.gameDate}
            key={game.id}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        );
      });
      setMappedGames(gameMap);
    });
  };
  return (
    <div>
      <Button onClick={handleSubmit}>Refresh</Button>
      <Typography variant="h4" sx={h4Style}>
        Two Point Line
      </Typography>
      <div>{mappedGames}</div>
    </div>
  );
};
