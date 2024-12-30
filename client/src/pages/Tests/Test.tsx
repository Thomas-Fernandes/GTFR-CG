import { useState } from "react";

import { isEmpty } from "@/common/utils/objUtils";

import { TestFunc, TestProps, TestResult } from "./types";

export const Test = (props: TestProps) => {
  const { title, func, buttonRef } = props;

  const [result, setResult] = useState<TestResult>({} as TestResult);
  const [testIsRunning, setTestIsRunning] = useState(false);

  const runTest = async (func: TestFunc) => {
    setResult({} as TestResult);
    setTestIsRunning(true);
    await func(setResult);
    setTestIsRunning(false);
  };

  return (
    <div id={`test-${title.replace(" ", "_").toLowerCase()}`} className="test flex-row">
      <h3>{title}</h3>
      { isEmpty(result) ?
        <button type="button" ref={buttonRef} onClick={() => runTest(func)}>
          {testIsRunning ? "Running..." : "Run Test"}
        </button>
      :
        <p>
          Test completed<br/>
          <span className={`${result?.successful ? "t-green" : "t-red"}`}>{result?.successful ? "successfully" : "with a failure"}</span><br/>
          in {result?.duration} milliseconds
        </p>
      }
    </div>
  );
}