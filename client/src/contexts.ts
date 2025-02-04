import { createNewContext } from "@/common/contextCreator";
import { IntlShape } from "react-intl";

interface IAppContext {
  intl: IntlShape;
}
const { context: AppContext, useContext: useAppContext } = createNewContext<IAppContext>();

export { AppContext, useAppContext };

let toasts: Record<string, any>;
export const setToasts = (updatedToasts: Record<string, any>) => {
  toasts = updatedToasts;
};
export const getToasts = () => toasts;
