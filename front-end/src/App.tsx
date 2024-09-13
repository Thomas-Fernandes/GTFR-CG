import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { PATHS } from "./constants/Common";
import ArtworkGeneration from "./pages/ArtworkGeneration/ArtworkGeneration";
import CardsGeneration from "./pages/CardsGeneration/CardsGeneration";
import Home from "./pages/Home/Home";
import Lyrics from "./pages/Lyrics/Lyrics";
import ProcessedImages from "./pages/ProcessedImages/ProcessedImages";
import Redirect from "./pages/Redirect/Redirect";

import "./App.css";

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path={PATHS.cardsGeneration} element={<CardsGeneration />} />
        <Route path={PATHS.lyrics} element={<Lyrics />} />
        <Route path={PATHS.processedImages} element={<ProcessedImages />} />
        <Route path={PATHS.artworkGeneration} element={<ArtworkGeneration />} />
        <Route path={PATHS.redirect} element={<Redirect />} />
        <Route path={PATHS.home} element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
