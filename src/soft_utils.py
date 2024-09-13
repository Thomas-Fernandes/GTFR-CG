from flask import Config

from time import time
from datetime import datetime

import src.constants as const
from src.typing import CachedElemType, CardsContents

def getCardsContentsFromFile(filepath: str) -> CardsContents:
    with open(filepath, "r") as file:
        all_cards = [card.split("\n\n") for card in file.read().split("\n\n\n")]
    cards = [[elem for elem in card if elem != ""] for card in all_cards][0] # remove empty elements & flatten the list
    return [card.split("\n") for card in cards]

def writeCardsContentsToFile(filepath: str, cards_contents: list[list[str]]) -> None:
    with open(filepath, "w") as file:
        for card in cards_contents:
            file.write("\n\n".join(card) + "\n\n")

def getNowStamp() -> str: # as YY-MM-DD_HH-MM-SS
    """ Returns the current time in stamp format.
    :return: [string] The current time in stamp format.
    """
    current_time = datetime.now()
    formatted_time = current_time.strftime(const.DATE_FORMAT_STAMP)
    return formatted_time

def getNowEpoch() -> str: # in MM-DD 24-hour format
    """ Returns the current time in epoch format.
    :return: [string] The current time in epoch format.
    """
    current_time = datetime.now()
    formatted_time = current_time.strftime(const.DATE_FORMAT_FULL)
    return formatted_time

# cards and images: 1 to 2 hours if the user is still logged in
#   (maybe send a toast to remind him to download the generated files)
# 20 to 30 minutes after the user logs out
def getExpirationTimestamp(filetype: CachedElemType, session: Config) -> int:
    """ Returns the default expiration timestamp for a given cached element type.
    :param elem: [CachedElemType] A type of cached elements.
    :return: [integer] The default expiration timestamp.
    """

    expiration_time: int = 0
    match filetype:
        case "sessions":
            expiration_time = const.TimeInSeconds.DAY.value
        case "images" | "cards":
            if const.SessionFields.user_folder.value in session: # user is still logged in
                expiration_time = 2 * const.TimeInSeconds.HOUR.value
            else: # user has logged out
                expiration_time = 30 * const.TimeInSeconds.MINUTE.value
        case _:
            raise ValueError(f"Invalid cached element type: {filetype}")
    return int(time() - expiration_time)
