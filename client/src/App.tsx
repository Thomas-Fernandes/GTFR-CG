import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { ViewPaths } from "@/constants/paths";
import ArtworkGeneration from "@/pages/ArtworkGeneration/ArtworkGeneration";
import CardsGeneration from "@/pages/CardsGeneration/CardsGeneration";
import Home from "@/pages/Home/Home";
import LandingPage from "@/pages/LandingPage/LandingPage";
import Lyrics from "@/pages/Lyrics/Lyrics";
import ProcessedArtworks from "@/pages/ProcessedArtworks/ProcessedArtworks";
import Redirect from "@/pages/Redirect/Redirect";
import Tests from "@/pages/Tests/Tests";

import "./App.scss";
import AppBackground from "./components/AppBackground/AppBackground";

const App = () => {
  return (
    <Router>
      <AppBackground />
      <Routes>
        <Route path={ViewPaths.CardsGeneration} element={<CardsGeneration />} />
        <Route path={ViewPaths.Lyrics} element={<Lyrics />} />
        <Route path={ViewPaths.ProcessedArtworks} element={<ProcessedArtworks />} />
        <Route path={ViewPaths.ArtworkGeneration} element={<ArtworkGeneration />} />
        <Route path={ViewPaths.Redirect} element={<Redirect />} />
        <Route path={ViewPaths.Tests} element={<Tests />} />
        <Route path={ViewPaths.Home} element={<Home />} />
        <Route path={ViewPaths.LandingPage} element={<LandingPage />} />
        <Route path={ViewPaths.Default} element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
