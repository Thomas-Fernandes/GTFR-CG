import { JSX, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/hooks/useTitle";
import { is2xxSuccessful, objectToQueryString, sendRequest } from "@common/requests";
import { dismissToast, sendToast } from "@common/toast";
import { StateSetter } from "@common/types";
import { ItunesResponse } from "@pages/ArtworkGeneration/types";

import { TITLE } from "@constants/browser";
import { API, BACKEND_URL, ITUNES_URL, VIEW_PATHS } from "@constants/paths";
import { TOAST_TYPE } from "@constants/toasts";

import { LyricsResponse } from "@pages/Lyrics/types";

import { TestsBoard } from "./TestsBoard";
import { TestResult } from "./types";

import "./Tests.css";

const Tests = (): JSX.Element => { // TODO remove this when backend unit tests are implemented
  useTitle(TITLE.TESTS);

  const refGeniusToken = useRef<HTMLButtonElement>(null);
  const refStatistics = useRef<HTMLButtonElement>(null);
  const refSnacks = useRef<HTMLButtonElement>(null);
  const refItunes = useRef<HTMLButtonElement>(null);
  const refGenius = useRef<HTMLButtonElement>(null);

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

  // API
  const testItunes = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    const data = { term: "hello", country: "US", entity: "album", limit: 10 };
    const queryString = objectToQueryString(data);

    await sendRequest("POST", ITUNES_URL + "/search" + queryString).then((response: ItunesResponse) => {
      setter({ successful: response.data.resultCount > 0, prompt: "iTunes API test successful", duration: Date.now() - start });
    }).catch((error) => {
      setter({ successful: false, prompt: error.message, duration: Date.now() - start });
    });
  };
  const testGenius = async (setter: StateSetter<TestResult>) => {
    const start = Date.now();
    const body = { artist: "Adele", songName: "Hello" };
    await sendRequest("POST", BACKEND_URL + API.LYRICS.GET_LYRICS, body).then((response: LyricsResponse) => {
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
        { title: "Genius Token", func: testGeniusToken, buttonRef: refGeniusToken },
        { title: "Statistics", func: testStatistics, buttonRef: refStatistics },
      ],
    },
    {
      id: "front-end",
      title: "Front-End Components",
      tests: [
        { title: "Snacks", func: testSnacks, buttonRef: refSnacks },
      ],
    },
    {
      id: "api",
      title: "API",
      tests: [
        { title: "iTunes", func: testItunes, buttonRef: refItunes },
        { title: "Genius Lyrics", func: testGenius, buttonRef: refGenius },
      ],
    },
  ];

  const [clickedRunAll, setClickedRunAll] = useState(false);
  const handleRunAll = () => {
    setClickedRunAll(true);
    if (refGeniusToken.current) refGeniusToken.current.click();
    if (refStatistics.current) refStatistics.current.click();
    if (refSnacks.current) refSnacks.current.click();
    if (refItunes.current) refItunes.current.click();
    if (refGenius.current) refGenius.current.click();
  };

  return (
    <div id="tests">
      <span className="top-bot-spacer" />

      <div className="navbar">
        <button type="button" onClick={() => navigate(VIEW_PATHS.HOME)}>
          <span className="left">{TITLE.HOME}</span>
        </button>
      </div>

      <h1>Tests</h1>

      <button type="button" className={clickedRunAll ? "hidden" : ""} id="run-all" onClick={handleRunAll}>Run All Tests</button>

      <div id="page" className="flex-row">
        <div className="column">
          <TestsBoard {...(boards.find((b) => b.id === "env-var"))} />
          <TestsBoard {...(boards.find((b) => b.id === "front-end"))} />
        </div>

        <div className="column">
        <TestsBoard {...(boards.find((b) => b.id === "api"))} />
        </div>
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
};

export default Tests;