from enum import StrEnum
from glob import glob
from json import load
from os import path
from string import Template
from typing import Any

class Locale(StrEnum):
    """ Enum for the available locales """
    ENGLISH = "en_US"
    FRENCH = "fr_FR"

    def __repr__(self) -> str: return self.value

class Translator():
    """ Class to handle localization

    Attributes:
        data: [dict] The data containing the localized strings of the supported locales
        locale: [Locale] The current locale
    """
    def __init__(self) -> None:
        """ Initialize the translator with the available locales """
        self.data = {}
        self.locale = Locale.ENGLISH

        l10n_files = glob(path.join("src/locales/*.json"))
        for f in l10n_files:
            loc = path.splitext(path.basename(f))[0]
            with open(f, "r", encoding = "utf-8") as f:
                self.data[loc] = load(f)

    def set_locale(self, loc: Locale) -> None:
        if loc in self.data:
            self.locale = loc
        else:
            print("Invalid locale")

    def get_locale(self) -> Locale:
        return self.locale

    def get(self, key: str, **kwargs: dict[str, Any]) -> str:
        if self.locale not in self.data:
            return key # return the key instead of translation text if locale is not supported
        return Template(self.data[self.locale].get(key, key)).safe_substitute(**kwargs)

locale = Translator()