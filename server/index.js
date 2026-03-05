const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/team/:teamId/season/:seasonId", async (req, res) => {
  const team = req.params.teamId;
  const season = req.params.seasonId;
  let teamSchedule = await fetch(
    `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`,
  )
    .then((response) => response.json())
    .then((json) => {
      return getAllRegularSeasonGameIdsForTeam(json);
    });
  res.send(teamSchedule);
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});

function getAllRegularSeasonGameIdsForTeam(json) {
  return json.games.filter((game) => game.gameType === 2);
}
