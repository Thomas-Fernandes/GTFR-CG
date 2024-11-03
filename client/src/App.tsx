import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { VIEW_PATHS } from "@constants/paths";

import ArtworkGeneration from "@pages/ArtworkGeneration/ArtworkGeneration";
import CardsGeneration from "@pages/CardsGeneration/CardsGeneration";
import Home from "@pages/Home/Home";
import Lyrics from "@pages/Lyrics/Lyrics";
import ProcessedArtworks from "@pages/ProcessedArtworks/ProcessedArtworks";
import Redirect from "@pages/Redirect/Redirect";
import Tests from "@pages/Tests/Tests";

import "./App.css";

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path={VIEW_PATHS.CARDS_GENERATION} element={<CardsGeneration />} />
        <Route path={VIEW_PATHS.LYRICS} element={<Lyrics />} />
        <Route path={VIEW_PATHS.ARTWORK_PROCESSING} element={<ProcessedArtworks />} />
        <Route path={VIEW_PATHS.ARTWORK_GENERATION} element={<ArtworkGeneration />} />
        <Route path={VIEW_PATHS.REDIRECT} element={<Redirect />} />
        <Route path={VIEW_PATHS.TESTS} element={<Tests />} />
        <Route path={VIEW_PATHS.HOME} element={<Home />} />
        <Route path={VIEW_PATHS.ROOT} element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
