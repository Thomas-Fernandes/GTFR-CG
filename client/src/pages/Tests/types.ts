import { RefObject } from "react";

import { StateSetter } from "@common/types";

export type TestsBoardProps = {
  id?: string;
  title?: string;
  tests?: TestProps[];
};

export type TestResult = {
  successful: boolean;
  prompt: string;
  duration?: number;
};

export type TestFunc = (setter: StateSetter<TestResult>) => Promise<void>;

export type TestProps = {
  title: string;
  func: TestFunc;
  buttonRef: RefObject<HTMLButtonElement>;
};