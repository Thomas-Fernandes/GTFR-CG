import { createNewContext } from "@/common/contextCreator";

interface IDarkModeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const { context: DarkModeContext, useContext: useDarkModeContext } = createNewContext<IDarkModeContext>();

export { DarkModeContext, useDarkModeContext, type IDarkModeContext as DarkModeContextType };
