import { useEffect } from "react";

import { PATHS, DEFAULT_CONTEXT, TITLE, TOAST_TYPE } from "../../common/Constants";
import { sendToast } from "../../common/Toast";
import { Context } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { isEmpty } from "../../common/utils/ObjUtils";

import "./Home.css";

const Home = (passedContext: Context): React.JSX.Element => {
  const context = isEmpty(passedContext) ? DEFAULT_CONTEXT : passedContext;

  useTitle(TITLE.HOME);

  useEffect(() => {
    if (!window.location.href.endsWith("/home")) {
      window.location.href = "/home";
      return;
    }

    if (context.session_status === DEFAULT_CONTEXT.session_status) {
      if (!context.genius_token) {
        sendToast(
          "Genius API token not found.\n"
            + "Lyrics fetch is disabled.",
          TOAST_TYPE.ERROR,
          10
        );
        sendToast(
          "Add your Genius API token to your\n" +
            ".env file and restart the application\n" +
            "to enable lyrics fetch.",
          TOAST_TYPE.WARN,
          20
        );
      } else {
        sendToast(
          "Welcome to GTFR-CG!\n"
            + "Application started successfully.",
          TOAST_TYPE.SUCCESS,
          5
        );
      }
    }
  }, [context]);

  return (
    <>
      <div id="toast-container"></div>
      <span className="top-bot-spacer"></span>
      <h1>Home</h1>
      <div className="navbar">
        <button type="button"
          onClick={() => { window.location.href = PATHS.artworkGeneration; }}
        >
          <span className="right">Artwork Generation</span>
        </button>
        <button type="button"
          onClick={() => { window.location.href = PATHS.lyrics; }}
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
    </>
  );
};

export default Home;