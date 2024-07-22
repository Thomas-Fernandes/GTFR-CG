import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Lyrics from "./pages/Lyrics";
// import ProcessedImages from "./pages/ProcessedImages/ProcessedImages";
import ArtworkGeneration from "./pages/ArtworkGeneration/ArtworkGeneration";
import Redirect from "./pages/Redirect/Redirect";
import Home from "./pages/Home/Home";
import { _PATHS } from "./common/Constants";

import "./App.css";

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>
        {/* <Route path={} element={<Lyrics />} /> */}
        {/* <Route path={} element={<ProcessedImages />} /> */}
        <Route path={_PATHS.artworkGeneration} element={<ArtworkGeneration />} />
        <Route path={_PATHS.redirect} element={<Redirect />} />
        <Route path={_PATHS.home} element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
