import React from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { NativeSelect } from "@mui/material";
import { seasons } from "../utils/Consts";

export const Standings = () => {
  const [selectedSeason, setSelectedSeason] = React.useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    axios
      .get(`http://localhost:8080/season/${selectedSeason}/`)
      .then((data) => {
        console.log(data);
      });
  };

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
  };

  return (
    <div>
      <NativeSelect defaultValue={""} onChange={handleOnChangeSeason}>
        <option value={""} disabled hidden></option>
        {dropdownSeasons}
      </NativeSelect>
      <Button onClick={handleSubmit}>Refresh</Button>
      <Button onClick={handleSubmitDelete}>Delete Dupes</Button>
    </div>
  );
};
