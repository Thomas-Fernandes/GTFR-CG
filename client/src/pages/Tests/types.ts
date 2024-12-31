import { RefObject } from "react";

import { StateSetter } from "@/common/types";

export type TestsBoardProps = Readonly<{
  id?: string;
  title?: string;
  tests?: TestProps[];
}>;

export type TestResult = Readonly<{
  successful: boolean;
  prompt: string;
  duration?: number;
}>;

export type TestFunc = (setter: StateSetter<TestResult>) => Promise<void>;

export type TestProps = Readonly<{
  title: string;
  func: TestFunc;
  buttonRef: RefObject<HTMLButtonElement>;
}>;