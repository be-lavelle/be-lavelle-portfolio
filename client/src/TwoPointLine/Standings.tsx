import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box, Grid, NativeSelect, Toolbar, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { defaultStandings, seasons } from "../utils/Consts";
import { RankingsType } from "../utils/Types";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { LeagueStandings } from "./LeagueStandings";
import { gridAbbrevItemStyle, standingsTypeGridItem } from "../utils/StylingConsts";
import { ConferenceStandings } from "./ConferenceStandings";
import { DivisionStandings } from "./DivisionStandings";
import { WildcardStandings } from "./WildcardStandings";

export const Standings = () => {
  const [selectedSeason, setSelectedSeason] = React.useState("");
  const [allStandings, setAllStandings] = React.useState({});
  const [currentStandings, setCurrentStandings] = React.useState(defaultStandings);
  const [standingsType, setStandingsType] = React.useState(RankingsType.League);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(dayjs().format("YYYY-MM-DD").toString());
  const [defaultDate, setDefaultDate] = React.useState<Dayjs | null>(dayjs());

  const handleSubmitDelete = (e: React.SyntheticEvent) => {
    axios
      .get(`http://localhost:8080/deleteDupes/${selectedSeason}`)
      .then((data) => {
        console.log(data);
      });
  };

  const dropdownSeasons = Object.keys(seasons).map((season) => {
    return (
      <option value={seasons[season]} key={season}>
        {season}
      </option>
    );
  });

  const handleOnChangeSeason = (e: React.ChangeEvent<{ value: string }>) => {
    console.log(e.target.value);
    setSelectedSeason(e.target.value);
    axios
      .get(`http://localhost:8080/season/${e.target.value}/`)
      .then((json) => {
        let standingsByDate = json.data.mappedRankingsByDate;
        console.log(standingsByDate)
        setAllStandings(standingsByDate);
        if (standingsByDate.hasOwnProperty(selectedDate)) {
          setCurrentStandings(standingsByDate[selectedDate])
        } else {
          let keys = Object.keys(standingsByDate)
          const finalKey = keys[keys.length - 1]
          setCurrentStandings(standingsByDate[finalKey])
          setSelectedDate(finalKey)
          setDefaultDate(dayjs(finalKey))
        }
      });
  };

  const handleOnChangeType = (e: React.SyntheticEvent, type: RankingsType) => {
    setStandingsType(type)
  }

  const handleOnChangeDate = (date: string) => {
    let keys = Object.keys(allStandings)
    const finalKey = keys[keys.length - 1]
    if (keys.length > 0) {
      if (allStandings.hasOwnProperty(date)) {
        setCurrentStandings(allStandings[date])
        setSelectedDate(date)
      } else {
        setCurrentStandings(allStandings[finalKey])
      }
    }
  }

  return (
    <div>
      <Grid container spacing={1} width={"auto"}>
        <Grid size={{ sm: 4, md: 4, lg: 4 }} sx={gridAbbrevItemStyle}>
          <NativeSelect defaultValue={"Pick Season"} onChange={handleOnChangeSeason} sx={{ width: "100%" }}>
            <option value={"Pick Season"} disabled>Pick Season</option>
            {dropdownSeasons}
          </NativeSelect>
        </Grid>
        {Object.keys(allStandings).length > 0 && <Grid size={{ sm: 4, md: 4, lg: 4 }} sx={gridAbbrevItemStyle}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Standings on date" defaultValue={defaultDate} onChange={(newValue) => handleOnChangeDate(newValue.format("YYYY-MM-DD").toString())} sx={{ width: "200px" }} />
          </LocalizationProvider>        </Grid>
        }
        <Grid size={{ sm: 4, md: 4, lg: 4 }} sx={gridAbbrevItemStyle}>
          <Button onClick={handleSubmitDelete}>Delete Dupes</Button>
        </Grid>
      </Grid>
      {Object.keys(allStandings).length > 0 && <Grid container width={"auto"} margin="20px 0 0" justifyContent="center">
        <Grid size={{ sm: 3, md: 3, lg: 3 }} sx={standingsTypeGridItem}>
          <Button onClick={(e) => handleOnChangeType(e, RankingsType.Wildcard)}>Wildcard</Button>
        </Grid>
        <Grid size={{ sm: 3, md: 3, lg: 3 }} sx={standingsTypeGridItem}>
          <Button onClick={(e) => handleOnChangeType(e, RankingsType.Division)}>Division</Button>
        </Grid>
        <Grid size={{ sm: 3, md: 3, lg: 3 }} sx={standingsTypeGridItem}>
          <Button onClick={(e) => handleOnChangeType(e, RankingsType.Conference)}>Conference</Button>
        </Grid><Grid size={{ sm: 3, md: 3, lg: 3 }} sx={standingsTypeGridItem}>
          <Button onClick={(e) => handleOnChangeType(e, RankingsType.League)}>League</Button>
        </Grid>
      </Grid>}
      <Box>
        {standingsType === RankingsType.League && <LeagueStandings standings={currentStandings} />}
        {standingsType === RankingsType.Conference && <ConferenceStandings standings={currentStandings} />}
        {standingsType === RankingsType.Division && <DivisionStandings standings={currentStandings} />}
        {standingsType === RankingsType.Wildcard && <WildcardStandings standings={currentStandings} />}
      </Box>
    </div>
  );
};
