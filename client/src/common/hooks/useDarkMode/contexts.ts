import { createNewContext } from "@/common/contextCreator";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const {
  context: DarkModeContext,
  useContext: useDarkModeContext
} = createNewContext<DarkModeContextType>();

export { DarkModeContext, useDarkModeContext, type DarkModeContextType };

