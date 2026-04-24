import { Typography } from "@mui/material";
import * as React from "react";
import { h4Style } from "./utils/StylingConsts";

export const About = () => {
  return (
    <>
      <Typography variant="h4" sx={h4Style}>About Me</Typography>
      <Typography sx={{ marginTop: 2, marginBottom: 2 }}>Be Lavelle is a Software Engineer with 7+ years of experience working with React, Typescript, Javascript, GraphQL, and Kotlin.</Typography>
      <Typography sx={{ marginTop: 2, marginBottom: 2 }}>This site is built with a React/Typescript front-end, and uses an express backend. The data is fetched from the NHL API and cached in a MongoDb cluster for faster retrieval</Typography>
    </>
  );
};
