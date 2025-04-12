import { IntlShape } from "react-intl";

import { createNewContext } from "@/common/contextCreator";

import { Dict } from "./common/types";

interface IAppContext {
  intl: IntlShape;
}
const { context: AppContext, useContext: useAppContext } = createNewContext<IAppContext>();

export { AppContext, useAppContext };

let toasts: Dict<any>;
export const setToasts = (updatedToasts: Dict<any>) => {
  toasts = updatedToasts;
};
export const getToasts = () => toasts;
