import { useEffect } from "react";

import { defaultContext } from "../../utils/Constants";
import { Context } from "../../utils/Types";
import { sendToast } from "../../utils/Generic";

import "./Home.css";

const Home = (context: Context = defaultContext): React.JSX.Element => {
  useEffect(() => {
    if (!window.location.href.endsWith("/home")) {
      window.location.href = "/home";
      return;
    }

    if (context.session_status === "initializing") {
      if (!context.genius_token) {
        sendToast(
          "Genius API token not found.\n"
            + "Lyrics fetch is disabled.",
          "error",
          10
        );
        sendToast(
          "Add your Genius API token to your\n" +
            ".env file and restart the application\n" +
            "to enable lyrics fetch.",
          "warning",
          20
        );
      } else {
        sendToast(
          "Welcome to GTFR-CG!\n"
            + "Application started successfully.",
          "success",
          5
        );
      }
    }
  }, [context]);

  return (
    <div>
      <div id="toast-container"></div>
      <span className="top-bot-spacer"></span>
      <h1>Home</h1>
      <div className="navbar">
        <button type="button"
          onClick={() => { window.location.href="{{ url_for('art-gen.renderArtworkGeneration') }}"; }}
        >
          <span className="right">Artwork Generation</span>
        </button>
        <button type="button"
          onClick={() => { window.location.href="{{ url_for('lyrics.renderLyrics') }}"; }}
        >
          <span className="right">Lyrics</span>
        </button>
      </div>
      <div className="stats-board">
        <div className="hidden">
          <p id="session-status">{ context.session_status }</p>
          <p id="genius-token">{ context.genius_token }</p>
        </div>
        <div className="stats-entry">
          <h3 className="stat-title">Date of First Operation</h3>
          <p className="stat-text">{ context.stats?.dateFirstOperation }</p>
        </div>
        <hr />
        <div className="stats-entry">
          <h3 className="stat-title">Date of Last Operation</h3>
          <p className="stat-text">{ context.stats?.dateLastOperation }</p>
        </div>
        <hr />
        <div className="stats-entry">
          <h3 className="stat-title">Artwork Generations</h3>
          <p className="stat-text">{ context.stats?.artworkGenerations }</p>
        </div>
        <hr />
        <div className="stats-entry">
          <h3 className="stat-title">Genius Lyrics Fetches</h3>
          <p className="stat-text">{ context.stats?.lyricsFetches }</p>
        </div>
      </div>
      <span className="top-bot-spacer"></span>
    </div>
  );
};

export default Home;