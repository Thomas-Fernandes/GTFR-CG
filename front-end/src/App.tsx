import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Lyrics from "./pages/Lyrics";
// import ProcessedImages from "./pages/ProcessedImages";
// import ArtworkGeneration from "./pages/ArtworkGeneration";
// import Redirect from "./pages/Redirect";
import Home from "./pages/Home";
import "./App.css";

const App = () => {
  return (
    <body>
    <Router>
      <Routes>
        {/* <Route path="/lyrics" element={<Lyrics />} />
        <Route path="/processed-images" element={<ProcessedImages />} />
        <Route path="/artwork-generation" element={<ArtworkGeneration />} />
        <Route path="/redirect" element={<Redirect />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
    </body>
  )
}

export default App
