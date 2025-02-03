import enUS_i18n from "@/locales/en-US.json";
import frFR_i18n from "@/locales/fr-FR.json";

const flattenMessages = (nestedMessages: Record<string, any>, prefix = ""): Record<string, string> => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string")
      messages[prefixedKey] = value;
    else
      Object.assign(messages, flattenMessages(value, prefixedKey));

    return messages;
  }, {} as Record<string, string>);
};

export type Locale = "en" | "fr";

export const i18n: Record<Locale, Record<string, string>> = {
  "en": flattenMessages(enUS_i18n),
  "fr": flattenMessages(frFR_i18n),
};