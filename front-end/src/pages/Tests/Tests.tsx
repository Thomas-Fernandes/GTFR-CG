import { JSX } from "react";
import { useNavigate } from "react-router-dom";

import { is2xxSuccessful, sendRequest } from "../../common/Requests";
import { StateSetter } from "../../common/Types";
import useTitle from "../../common/UseTitle";
import { API, BACKEND_URL, PATHS, TITLE, TOAST_TYPE } from "../../constants/Common";

import { TestResult } from "./Test";
import { TestsBoard } from "./TestsBoard";

import { dismissToast, sendToast } from "../../common/Toast";
import "./Tests.css";

const Tests = (): JSX.Element => {
  useTitle(TITLE.TESTS);

  const navigate = useNavigate();

  // ENV-VAR
  const testGeniusToken = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    await sendRequest("GET", BACKEND_URL + API.GENIUS_TOKEN).then((response) => {
      setter({ successful: is2xxSuccessful(response.status), prompt: response.message, duration: Date.now() - start });
    }).catch((error) => {
      setter({ successful: false, prompt: error.message, duration: Date.now() - start });
    });
  };
  const testStatistics = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    await sendRequest("GET", BACKEND_URL + API.STATISTICS).then((response) => {
      setter({ successful: is2xxSuccessful(response.status), prompt: response.message, duration: Date.now() - start });
    }).catch((error) => {
      setter({ successful: false, prompt: error.message, duration: Date.now() - start });
    });
  };

  // FRONT-END
  const testSnacks = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    const toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
      setter({ successful: false, prompt: "Toast container not found", duration: Date.now() - start });
      return;
    }

    sendToast("Testing snacks", TOAST_TYPE.INFO);
    if (toastContainer.childElementCount === 0) {
      setter({ successful: false, prompt: "Snacks not working", duration: Date.now() - start });
    } else {
      setter({ successful: true, prompt: "Snacks tested", duration: Date.now() - start });
      dismissToast(toastContainer.lastElementChild as HTMLElement, 0);
    }
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
    {
      id: "front-end",
      title: "Front-end Features",
      tests: [
        { title: "Snacks", func: testSnacks },
      ],
    }
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
          <TestsBoard {...(boards.find((b) => b.id === "front-end"))} />
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
        </div>
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default Tests;