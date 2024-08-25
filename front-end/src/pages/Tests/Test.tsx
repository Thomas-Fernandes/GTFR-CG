import { useState } from "react";

export type TestResult = {
  successful: boolean;
  prompt: string;
};

type TestProps = {
  title: string;
  func: () => TestResult;
};

export const Test = (props: TestProps) => {
  const { title, func } = props;

  const [result, setResult] = useState<TestResult>();

  return (
    <div id={`test-${title}`} className="test flex-row">
      <h3>{title}</h3>
      <button type="button" onClick={() => setResult(func())}>
        Run
      </button>
      { result?.successful &&
        <p>{result.prompt}</p>
      }
    </div>
  );
}