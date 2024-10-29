import { Test, TestProps } from "./Test";

type TestsBoardProps = {
  id?: string;
  title?: string;
  tests?: TestProps[];
};

export const TestsBoard = (props: TestsBoardProps) => {
  const { id, title, tests } = props;

  return (
    <div id={id} className="board">
      <h2 className="title">{title}</h2>
      { tests?.map((test) => (
        <Test key={test.title} title={test.title} func={test.func} buttonRef={test.buttonRef} />
      ))}
    </div>
  );
};