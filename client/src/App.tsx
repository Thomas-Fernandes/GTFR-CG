import { useMemo } from "react";
import { useIntl } from "react-intl";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AppBackground from "@/components/AppBackground/AppBackground";
import { ViewPaths } from "@/constants/paths";
import ArtworkGeneration from "@/pages/ArtworkGeneration/ArtworkGeneration";
import CardsGeneration from "@/pages/CardsGeneration/CardsGeneration";
import Home from "@/pages/Home/Home";
import LandingPage from "@/pages/LandingPage/LandingPage";
import Lyrics from "@/pages/Lyrics/Lyrics";
import ProcessedArtworks from "@/pages/ProcessedArtworks/ProcessedArtworks";
import Redirect from "@/pages/Redirect/Redirect";

import { getLocalizedToasts } from "./common/utils/toastUtils";
import { AppContext, setToasts } from "./contexts";

import "./App.scss";

const App = () => {
  const intl = useIntl();
  const toasts = getLocalizedToasts(intl);
  setToasts(toasts);

  const contextValue = useMemo(() => ({ intl }), [intl]);

  return (
    <Router>
      <AppContext.Provider value={contextValue}>
        <AppBackground />
        <Routes>
          <Route path={ViewPaths.CardsGeneration} element={<CardsGeneration />} />
          <Route path={ViewPaths.Lyrics} element={<Lyrics />} />
          <Route path={ViewPaths.ProcessedArtworks} element={<ProcessedArtworks />} />
          <Route path={ViewPaths.ArtworkGeneration} element={<ArtworkGeneration />} />
          <Route path={ViewPaths.Redirect} element={<Redirect />} />
          <Route path={ViewPaths.Home} element={<Home />} />
          <Route path={ViewPaths.LandingPage} element={<LandingPage />} />
          <Route path={ViewPaths.Default} element={<LandingPage />} />
        </Routes>
      </AppContext.Provider>
    </Router>
  )
}

export default App
