from flask import Config

from datetime import datetime
from os import path
from time import time
from typing import Optional

import src.constants as const
from src.typing import CachedElemType, CardsContents

def getHexColorFromRGB(rgb: tuple[int, int, int]) -> str:
    """ Converts an RGB color to a hex color.
    :param rgb: [tuple] The RGB color.
    :return: [string] The hex color.
    """
    return "#{:02x}{:02x}{:02x}".format(*rgb)

def snakeToCamelCase(snake_str: str) -> str:
    """ Converts a snake_case string to a camelCase string.
    :param snake_str: [string] The snake_case string.
    :return: [string] The camelCase string.
    """
    components = snake_str.split("_")
    return components[0] + "".join(x.title() for x in components[1:])

def doesFileExist(filepath: str) -> bool:
    """ Checks if the file exists.
    :param filepath: [string] The path to the file.
    :return: [bool] Whether the file exists.
    """
    return path.isfile(filepath)

def getCardsContentsFromFile(filepath: str) -> CardsContents:
    """ Returns the contents of the cards from a file.
    :param filepath: [string] The path to the file.
    :return: [list] The contents of the cards.
    """
    with open(filepath, "r") as file:
        all_cards = [card.split("\n\n") for card in file.read().split("\n\n\n")]
    cards = [[elem for elem in card if elem != ""] for card in all_cards][0] # remove empty elements & flatten the list
    return [card.split("\n") for card in cards]

def writeCardsContentsToFile(filepath: str, cards_contents: list[list[str]]) -> None:
    """ Writes the cards contents to a file.
    :param filepath: [string] The path to the file.
    :param cards_contents: [list] The contents of the cards.
    """
    with open(filepath, "w") as file:
        for card in cards_contents:
            has_content = len(card) > 0 and any([len(elem.strip(" \n")) > 0 for elem in card])
            if has_content:
                file.write(("\n\n".join(card) + "\n\n").translate(const.TRANSLATION_TABLE))

def checkImageFilenameValid(filename: str | None) -> Optional[str]:
    """ Checks if the given filename is valid for an image file.
    :param filename: [string] The filename to check.
    :return: [string?] The error message if the filename is invalid, None otherwise.
    """
    if filename == None or filename.strip() == "":
        return const.ERR_NO_FILE
    if not('.' in filename and filename.rsplit('.', 1)[1].lower() in ["png", "jpg", "jpeg"]):
        return const.ERR_IMG_INVALID_FILETYPE
    return None

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
