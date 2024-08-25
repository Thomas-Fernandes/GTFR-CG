import { JSX } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { API, BACKEND_URL, PATHS, TITLE } from "../../constants/Common";

import useTitle from "../../common/UseTitle";

import { TestResult } from "./Test";
import "./Tests.css";
import { TestsBoard } from "./TestsBoard";

const Tests = (): JSX.Element => {
  useTitle(TITLE.TESTS);

  const navigate = useNavigate();

  const testStatistics = (): TestResult => {
    let result = { successful: false, prompt: "" };

    sendRequest("GET", BACKEND_URL + API.STATISTICS).then((response) => {
      result = { successful: is2xxSuccessful(response.status), prompt: response.message };
    }).catch((error) => {
      result = { successful: false, prompt: error.message };
    });
    return result;
  };

  const testGeniusToken = (): TestResult => {
    let result = { successful: false, prompt: "" };

    sendRequest("GET", BACKEND_URL + API.GENIUS_TOKEN).then((response) => {
      result = { successful: is2xxSuccessful(response.status), prompt: response.message };
    }).catch((error) => {
      result = { successful: false, prompt: error.message };
    });
    return result;
  };

  const boards = {
    env_var: {
      id: "env-var",
      title: "Environment Variables",
      tests: [
        { title: "Genius Token", func: testGeniusToken },
        { title: "Statistics", func: testStatistics },
      ],
    },
  };

  return (
    <div id="tests">
      <div id="toast-container"></div>
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(PATHS.home)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
      </div>

      <h1>Tests</h1>

      <div id="page" className="flex-row">
        <div className="column">
          <TestsBoard {...boards.env_var} />

          <div className="board" id="art-gen">
          </div>

          <div className="board" id="art-gen">
          </div>
        </div>

        <div className="column">
          <div id="external" className="board">
            <h2>External</h2>
            <div className="flex-row test">
              <h3>Genius Token</h3>
              <p>ééééé</p>
            </div>
          </div>

          <div className="board" id="art-gen">
          </div>

          <div className="board" id="art-gen">
          </div>
        </div>
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default Tests;