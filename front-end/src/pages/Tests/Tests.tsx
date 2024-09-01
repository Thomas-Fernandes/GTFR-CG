import { JSX } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { StateSetter } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { API, BACKEND_URL, PATHS, TITLE } from "../../constants/Common";

import { TestResult } from "./Test";
import { TestsBoard } from "./TestsBoard";

import "./Tests.css";

const Tests = (): JSX.Element => {
  useTitle(TITLE.TESTS);

  const navigate = useNavigate();

  const testStatistics = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    await sendRequest("GET", BACKEND_URL + API.STATISTICS).then((response) => {
      setter({ successful: is2xxSuccessful(response.status), prompt: response.message, duration: Date.now() - start });
    }).catch((error) => {
      setter({ successful: false, prompt: error.message, duration: Date.now() - start });
    });
  };

  const testGeniusToken = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    await sendRequest("GET", BACKEND_URL + API.GENIUS_TOKEN).then((response) => {
      setter({ successful: is2xxSuccessful(response.status), prompt: response.message, duration: Date.now() - start });
    }).catch((error) => {
      setter({ successful: false, prompt: error.message, duration: Date.now() - start });
    });
  };

  const boards = [
    {
      id: "env-var",
      title: "Environment Variables",
      tests: [
        { title: "Genius Token", func: testGeniusToken },
        { title: "Statistics", func: testStatistics },
      ],
    },
  ];

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
          <TestsBoard {...(boards.find((b) => b.id === "env-var"))} />

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