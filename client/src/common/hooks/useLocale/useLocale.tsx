import { useLocaleContext } from "./contexts";

export const useLocale = () => {
  const context = useLocaleContext();

  if (!context)
    throw new Error("useLocale must be used within a LocaleProvider");
  return context;
};
