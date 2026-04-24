import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import { Container, Box } from "@mui/material";
import { Contact } from "./Contact";
import * as React from "react";
import { TwoPointLine } from "./TwoPointLine/TwoPointLine";
import { Standings } from "./TwoPointLine/Standings";
import { About } from "./About";

const App = () => {
  return (
    <Box>
      <Header />
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Standings />} />
          <Route path="/game-breakdowns" element={<TwoPointLine />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
