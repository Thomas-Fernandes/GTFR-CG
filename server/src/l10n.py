from enum import StrEnum
from glob import glob
from json import load
from os import path
from string import Template
from typing import Any

from src.logger import log
from src.typing_gtfr import L10nDict

class Locale(StrEnum):
    """ Enum for the available locales """
    ENGLISH = "en_US"
    FRENCH = "fr_FR"

    def __repr__(self) -> str:
        return self.value

DEFAULT_LOCALE: Locale = Locale.ENGLISH

def use_fallback_locale(data: L10nDict, fallback: Locale) -> L10nDict:
    for loc in data:
        if loc != fallback:
            for key in data[loc]:
                if key not in data[fallback]:
                    data[loc][key] = data[fallback].get(key, key)
    return data

class Translator():
    """ Class to handle localization of server responses messages

    Attributes:
        data: [dict] The data containing the localized strings of the supported locales
        locale: [Locale] The current locale
    """
    def __init__(self) -> None:
        """ Initialize the translator with the available locales """
        self.data = {}
        self.locale = DEFAULT_LOCALE

        l10n_files = glob(path.join("src/locales/*.json"))
        for filename in l10n_files:
            loc = path.splitext(path.basename(filename))[0]
            with open(filename, "r", encoding="utf-8") as data:
                self.data[loc] = load(data)
        self.data = use_fallback_locale(self.data, DEFAULT_LOCALE)

    def set_locale(self, loc: Locale) -> Locale:
        if loc in self.data:
            self.locale = loc
            log.info(f"Server response locale set to: {loc}")
        else:
            self.locale = DEFAULT_LOCALE
            log.warn(f"Invalid locale: {loc}. Using default locale: {DEFAULT_LOCALE}")
        return self.locale

    def get_locale(self) -> Locale:
        return self.locale

    def get(self, key: str, **kwargs: dict[str, Any]) -> str:
        return Template(self.data[self.locale].get(key, key)).safe_substitute(**kwargs)

locale = Translator()
