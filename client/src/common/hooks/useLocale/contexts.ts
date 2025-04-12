import { createNewContext } from "@/common/contextCreator";
import { Locale, StateSetter } from "@/common/types";

interface ILocaleContext {
  locale: Locale;
  switchLocale: (locale: Locale) => void;
  setLocale: StateSetter<Locale>;
}

const { context: LocaleContext, useContext: useLocaleContext } = createNewContext<ILocaleContext>();

export { LocaleContext, useLocaleContext, type ILocaleContext as LocaleContextType };
