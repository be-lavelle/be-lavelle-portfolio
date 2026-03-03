const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/", async (req, res) => {
  const team = "COL";
  const season = "20242025";
  let teamSchedule = await fetch(
    `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`,
  ).then((response) => response.json());
  res.send(teamSchedule);
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
