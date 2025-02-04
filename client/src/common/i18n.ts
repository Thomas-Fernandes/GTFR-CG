import merge from "lodash.merge";

import { Option } from "@/components/SelectPopover/types";
import en_US from "@/locales/en-US.json";
import fr_FR from "@/locales/fr-FR.json";

const flattenMessages = (nestedMessages: Record<string, any>, prefix = ""): Record<string, string> => {
  return Object.keys(nestedMessages).reduce(
    (messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") messages[prefixedKey] = value;
      else Object.assign(messages, flattenMessages(value, prefixedKey));

      return messages;
    },
    {} as Record<string, string>
  );
};

export type Locale = "en" | "fr";

type LocaleOptionType = Option & { value: Locale };
export const LOCALE_OPTIONS: LocaleOptionType[] = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
];

const locales: Record<Locale, unknown> = {
  en: en_US,
  fr: fr_FR,
};
export const getLocaleMessages = (l: Locale) => flattenMessages(merge({}, en_US, locales[l]));
