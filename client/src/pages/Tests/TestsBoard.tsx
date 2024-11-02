import { Test } from "./Test";
import { TestsBoardProps } from "./types";

export const TestsBoard = (props: TestsBoardProps): JSX.Element => {
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