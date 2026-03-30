import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Typography from "@mui/material/Typography";
import { Container, Box } from "@mui/material";
import { Contact } from "./Contact";
import * as React from "react";
import { TwoPointLine } from "./TwoPointLine/TwoPointLine";
import { Standings } from "./TwoPointLine/Standings";

// Placeholder components for different pages
const HomePage = () => <Typography variant="h4">Welcome Home!</Typography>;
const AboutPage = () => <Typography variant="h4">About Us Page</Typography>;

const App = () => {
  return (
    <Box>
      <Header />
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/two-point-line" element={<TwoPointLine />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
