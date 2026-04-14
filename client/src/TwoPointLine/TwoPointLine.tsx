import Typography from "@mui/material/Typography";
import React from "react";
import { h4Style } from "../utils/StylingConsts";
import Button from "@mui/material/Button";
import axios from "axios";
import { GameExpand } from "./GameExpand";
import { Team } from "../utils/Types";
import { createTeam } from "./DataAdapter";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  Toolbar,
} from "@mui/material";
import { allTeams, seasons } from "../utils/Consts";
import { HockeyChart } from "./HockeyChart";

export const TwoPointLine = () => {
  let games = [];
  const [mappedGames, setMappedGames] = React.useState([]);
  const [teamsInDropdown, setTeamsInDropdown] = React.useState(allTeams);
  const [selectedSeason, setSelectedSeason] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [chartKey, setChartKey] = React.useState("");
  const [goalsForGame, setGoalsForGame] = React.useState({});

  const getGameData = (gameId: string) => {
    axios
      .get(`http://localhost:8080/game/${gameId}/season/${selectedSeason}`)
      .then((json) => {
        let goals = json.data;
        setGoalsForGame(goals);
      });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    if (selectedSeason !== "" && selectedTeam !== "") {
      axios
        .get(
          `http://localhost:8080/team/${selectedTeam}/season/${selectedSeason}`,
        )
        .then((data) => {
          console.log(data);
          games = data.data;
          let gameMap = games.map((game) => {
            const homeTeam: Team = createTeam(
              game.homeTeamAbbrev,
              game.score.home,
            );
            const awayTeam: Team = createTeam(
              game.awayTeamAbbrev,
              game.score.away,
            );
            const gameToExpand = {
              gameDate: game.gameDate,
              homeTeam: homeTeam,
              awayTeam: awayTeam,
              key: game.gameId,
            };
            return (
              <GameExpand
                game={gameToExpand}
                key={game.gameId}
                onChange={() => {
                  setChartKey(game.gameId);
                  getGameData(game.gameId);
                }}
              />
            );
          });
          setMappedGames(gameMap);
        });
    }
  };

  const handleOnChangeSeason = (e: React.ChangeEvent<{ value: string }>) => {
    console.log(e.target.value);
    setSelectedSeason(e.target.value);
  };

  const handleOnChangeTeam = (e: React.ChangeEvent<{ value: string }>) => {
    console.log(e.target.value);
    setSelectedTeam(e.target.value);
  };

  const dropdownSeasons = Object.keys(seasons).map((season) => {
    return (
      <option value={seasons[season]} key={season}>
        {season}
      </option>
    );
  });

  return (
    <div>
      <Typography variant="h4" sx={h4Style}>
        Two Point Line
      </Typography>
      <Toolbar>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Season
          </InputLabel>
          <NativeSelect defaultValue={""} onChange={handleOnChangeSeason}>
            <option value={""} disabled hidden></option>
            {dropdownSeasons}
          </NativeSelect>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Team
          </InputLabel>
          <NativeSelect
            defaultValue={""}
            disabled={selectedSeason === ""}
            onChange={handleOnChangeTeam}
          >
            <option value={""} disabled hidden></option>
            {Object.keys(teamsInDropdown).map((team) => {
              if (
                ((selectedSeason === "20242025" ||
                  selectedSeason === "20252026") &&
                  team === "ARI") ||
                ((selectedSeason === "20222023" ||
                  selectedSeason === "20232024") &&
                  team === "UTA")
              ) {
                return;
              } else if (selectedSeason === "20242025" && team === "UTA") {
                return (
                  <option value={team} key={team}>
                    {"Utah Hockey Club"}
                  </option>
                );
              } else {
                return (
                  <option value={team} key={team}>
                    {teamsInDropdown[team]}
                  </option>
                );
              }
            })}
          </NativeSelect>
        </FormControl>
        <Button onClick={handleSubmit}>Refresh</Button>
      </Toolbar>
      <Grid container spacing={1} sx={{ paddingLeft: 4, paddingRight: 4 }}>
        <Grid
          size={{ md: 3, sm: 12 }}
          maxHeight={{ md: "60vh", sm: "120px" }}
          overflow="auto"
          sx={{
            border: "3px #62626221",
            borderStyle: "solid",
            borderRadius: "2px",
          }}
        >
          <Box>{mappedGames}</Box>
        </Grid>
        <Grid
          size={{ md: 9, sm: 12 }}
          maxHeight={{ md: "60vh", sm: "40vh" }}
          sx={{
            border: "3px #62626221",
            borderStyle: "solid",
            borderRadius: "2px",
          }}
        >
          <HockeyChart goals={goalsForGame} />
        </Grid>
      </Grid>
    </div>
  );
};
