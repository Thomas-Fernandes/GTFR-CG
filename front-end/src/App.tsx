import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Lyrics from "./pages/Lyrics";
// import ProcessedImages from "./pages/ProcessedImages/ProcessedImages";
// import ArtworkGeneration from "./pages/ArtworkGeneration/ArtworkGeneration";
import Redirect from "./pages/Redirect/Redirect";
import Home from "./pages/Home/Home";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/lyrics" element={<Lyrics />} /> */}
        {/* <Route path="/processed-images" element={<ProcessedImages />} /> */}
        {/* <Route path="/artwork-generation" element={<ArtworkGeneration />} /> */}
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
