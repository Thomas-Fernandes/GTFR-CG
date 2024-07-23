import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PATHS } from "./common/Constants";
import ArtworkGeneration from "./pages/ArtworkGeneration/ArtworkGeneration";
import Home from "./pages/Home/Home";
import Lyrics from "./pages/Lyrics/Lyrics";
import ProcessedImages from "./pages/ProcessedImages/ProcessedImages";
import Redirect from "./pages/Redirect/Redirect";

import "./App.css";

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>
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
