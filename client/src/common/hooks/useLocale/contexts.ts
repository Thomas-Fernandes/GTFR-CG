import { createNewContext } from "@/common/contextCreator";
import { Locale } from "@/common/i18n";

interface ILocaleContext {
  locale: Locale;
  switchLocale: (locale: Locale) => void;
}

const {
  context: LocaleContext,
  useContext: useLocaleContext
} = createNewContext<ILocaleContext>();

export { LocaleContext, useLocaleContext, type ILocaleContext as LocaleContextType };

