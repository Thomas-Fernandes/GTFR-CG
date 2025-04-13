from os import path
from typing import Optional

from src.constants.image_generation import TRANSLATION_TABLE
from src.constants.responses import Error

from src.l10n import locale
from src.typing_gtfr import CardsContents


def getCardsContentsFromFile(filepath: str) -> CardsContents:
    """Returns the contents of the cards from a file
    :param filepath: [string] The path to the file
    :return: [list] The contents of the cards
    """
    with open(filepath, "r") as file:
        all_cards = [card.split("\n\n") for card in file.read().split("\n\n\n")]
    cards = [[elem for elem in card if elem != ""] for card in all_cards][0]  # remove empty elements & flatten the list
    return [card.split("\n") for card in cards]


def writeCardsContentsToFile(filepath: str, cards_contents: list[list[str]]) -> None:
    """Writes the cards contents to a file
    :param filepath: [string] The path to the file
    :param cards_contents: [list] The contents of the cards
    """
    with open(filepath, "w") as file:
        for card in cards_contents:
            has_content = len(card) > 0 and any([len(elem.strip(" \n")) > 0 for elem in card])
            if has_content:
                file.write(("\n\n".join(card) + "\n\n").translate(TRANSLATION_TABLE))


def validateImageFilename(filename: str | None) -> Optional[str]:
    """Checks if the given filename is valid for an image file
    :param filename: [string] The filename to check
    :return: [string?] The error message if the filename is invalid, None otherwise
    """
    if filename == None or filename.strip() == "":
        return locale.get(Error.NO_FILE)
    if not ('.' in filename and filename.rsplit('.', 1)[1].lower() in ["png", "jpg", "jpeg"]):
        return locale.get(Error.IMG_INVALID_FILETYPE)
    return None


def doesFileExist(filepath: str) -> bool:
    """Checks if the file exists
    :param filepath: [string] The path to the file
    :return: [bool] Whether the file exists
    """
    return path.isfile(filepath)
