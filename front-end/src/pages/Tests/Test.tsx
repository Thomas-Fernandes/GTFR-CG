import { useState } from "react";

import { StateSetter } from "../../common/Types";
import { isEmpty } from "../../common/utils/ObjUtils";

export type TestResult = {
  successful: boolean;
  prompt: string;
  duration?: number;
};

export type TestFunc = (setter: StateSetter<TestResult>) => Promise<void>;

export type TestProps = {
  title: string;
  func: TestFunc;
};

export const Test = (props: TestProps) => {
  const { title, func } = props;

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
        <button type="button" onClick={() => runTest(func)}>
          {testIsRunning ? "Running..." : "Run test"}
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