import React, { useMemo, useState } from "react";
import { IntlProvider } from "react-intl";

import { LocaleContext } from "@/common/hooks/useLocale/contexts";
import { getLocaleMessages, Locale } from "@/common/l10n";

import { LocaleContextProviderProps } from "./types";

export const LocaleProvider: React.FC<LocaleContextProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState((navigator.language.split('-')[0] || "en") as Locale);

  const switchLocale = (newLocale: Locale) => setLocale(newLocale); // TODO remove this, used for testing

  const contextValue = useMemo(() => ({ locale, switchLocale, setLocale }), [locale]);

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider locale={locale} messages={getLocaleMessages(locale)}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
