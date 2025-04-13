import { useMemo, useState } from "react";
import { IntlProvider } from "react-intl";

import { LocaleContext } from "@/common/hooks/useLocale/contexts";
import { getLocaleMessages } from "@/common/l10n";
import { Locale } from "@/common/types";

import { postLocaleChange } from "./requests";
import { LocaleContextProviderProps } from "./types";

export const LocaleProvider: React.FC<LocaleContextProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState((navigator.language.split("-")[0] || "en") as Locale);

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    postLocaleChange({ locale: newLocale });
  };

  const contextValue = useMemo(() => ({ locale, switchLocale, setLocale }), [locale]);

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider locale={locale} messages={getLocaleMessages(locale)}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
