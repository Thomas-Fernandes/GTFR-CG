import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { VIEW_PATHS } from "./constants/Paths";
import ArtworkGeneration from "./pages/ArtworkGeneration/ArtworkGeneration";
import CardsGeneration from "./pages/CardsGeneration/CardsGeneration";
import Home from "./pages/Home/Home";
import Lyrics from "./pages/Lyrics/Lyrics";
import ProcessedImages from "./pages/ProcessedImages/ProcessedImages";
import Redirect from "./pages/Redirect/Redirect";
import Tests from "./pages/Tests/Tests";

import "./App.css";

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path={VIEW_PATHS.cardsGeneration} element={<CardsGeneration />} />
        <Route path={VIEW_PATHS.lyrics} element={<Lyrics />} />
        <Route path={VIEW_PATHS.processedImages} element={<ProcessedImages />} />
        <Route path={VIEW_PATHS.artworkGeneration} element={<ArtworkGeneration />} />
        <Route path={VIEW_PATHS.redirect} element={<Redirect />} />
        <Route path={VIEW_PATHS.tests} element={<Tests />} />
        <Route path={VIEW_PATHS.home} element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
