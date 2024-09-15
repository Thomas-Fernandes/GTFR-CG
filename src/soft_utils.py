from flask import Config
from PIL import Image

from datetime import datetime
from os import path
from time import time

import src.constants as const
from src.typing import CachedElemType, CardsContents, RGBColor

def getAverageColor(image_path: str) -> str: # FIXME unused, initially used for the background color of the generated cards
    """ Gets the average color of an image.
    :param image_path: [string] The path to the image.
    :return: [string] The hex color of the average color.
    """
    try:
        with Image.open(image_path) as img:
            img = img.convert("RGB")
    except Exception as e:
        # log.error(f"Error while opening image: {e}") # causes circular import on log
        print(f"Error while opening image: {e}")
        return "000000"

    pixels: list[RGBColor] = list(img.getdata())
    total_r, total_g, total_b = 0, 0, 0
    for r, g, b in pixels:
        total_r += r
        total_g += g
        total_b += b

    num_pixels = len(pixels)
    avg_r = total_r // num_pixels
    avg_g = total_g // num_pixels
    avg_b = total_b // num_pixels
    avg_hex = f"{avg_r:02x}{avg_g:02x}{avg_b:02x}"
    return avg_hex

def getNormalizedFilename(name: str) -> str: # FIXME unused, initially used for the filename of the generated cards
    """ Formats the name of the song for the filename.
    :param name: [string] The name of the song.
    :return: [string] The formatted name of the song.
    """
    return "".join([c for c in name.replace(" ", "_") if c.isalnum() or c == "_"]) # replace spaces with underscores, remove any non-alphanum char

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
