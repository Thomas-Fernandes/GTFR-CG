import NumberFlow from "@number-flow/react";

import { defaultStatistics } from "./constants";

export const getStatDisplayValue = (value: string) => {
  return value.includes("/")
    ? value // date-time
    : <NumberFlow value={parseInt(value)} />
  ;
}

export const statIsInitialized = (value: string) => {
  return !Object.values(defaultStatistics).includes(value);
}