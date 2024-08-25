import { Test, TestResult } from "./Test";

type TestsBoardProps = {
  id: string;
  title: string;
  tests: { title: string, func: () => TestResult }[];
};

export const TestsBoard = (props: TestsBoardProps) => {
  const { id, title, tests } = props;

  return (
    <div id={id} className="board">
      <h2>{title}</h2>
      { tests.map((test) => (
        <Test key={test.title} title={test.title} func={test.func} />
      ))}
    </div>
  );
};