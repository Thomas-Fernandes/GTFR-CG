import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { ViewPaths } from "@constants/paths";

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
        <Route path={ViewPaths.CardsGeneration} element={<CardsGeneration />} />
        <Route path={ViewPaths.Lyrics} element={<Lyrics />} />
        <Route path={ViewPaths.ArtworkProcessing} element={<ProcessedArtworks />} />
        <Route path={ViewPaths.ArtworkGeneration} element={<ArtworkGeneration />} />
        <Route path={ViewPaths.Redirect} element={<Redirect />} />
        <Route path={ViewPaths.Tests} element={<Tests />} />
        <Route path={ViewPaths.Home} element={<Home />} />
        <Route path={ViewPaths.Root} element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
