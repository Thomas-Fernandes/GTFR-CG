import merge from "lodash.merge";

import en_US from "@/locales/en-US.json";
import fr_FR from "@/locales/fr-FR.json";

import { Dict, Locale, LocaleOptionType } from "./types";

const flattenMessages = (nestedMessages: Dict<any>, prefix = ""): Dict<string> => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {} as Dict<string>);
};

export const LOCALE_OPTIONS: LocaleOptionType[] = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
];

const locales: Record<Locale, unknown> = {
  en: en_US,
  fr: fr_FR,
};
export const getLocaleMessages = (l: Locale) => flattenMessages(merge({}, en_US, locales[l]));
