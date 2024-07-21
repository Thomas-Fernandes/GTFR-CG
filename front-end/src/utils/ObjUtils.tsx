import { Context } from "./Types";

const isEmpty = (obj?: Context) => {
  for (const _i in obj) { return false; }
  return true;
}

export { isEmpty };