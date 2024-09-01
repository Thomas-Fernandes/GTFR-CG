import { useState } from "react";

import { StateSetter } from "../../common/Types";

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
    <div id={`test-${title}`} className="test flex-row">
      <h3>{title}</h3>
      <button type="button" onClick={() => runTest(func)}>
        {testIsRunning ? "Running..." : "Run test"}
      </button>
      { result?.successful &&
        <p>{`Test completed in ${result.duration}ms`}</p>
      }
    </div>
  );
}