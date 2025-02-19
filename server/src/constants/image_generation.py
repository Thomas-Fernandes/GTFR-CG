from PIL import Image

from enum import StrEnum
from os import path

from server.src.logger import log
from server.src.constants.paths import \
    ASSETS_THUMBNAILS_DIR, CARDS_BOTTOM_B_FILEPATH, CARDS_BOTTOM_W_FILEPATH, CARDS_OUTRO_FILEPATH, LOGO_POSITIONS
from server.src.constants.responses import Error

class ImageMode(StrEnum):
    """ Enum for the available image modes """
    RGB = "RGB"
    RGBA = "RGBA"

    def __repr__(self) -> str: return self.value

# Artwork generation
LOGO_OVERLAYS = []
for pos in LOGO_POSITIONS:
    overlay_filepath = f"{ASSETS_THUMBNAILS_DIR}{pos}.png"
    if (not path.exists(overlay_filepath)):
        log.error(f"  Overlay file not found: {overlay_filepath}")
        raise FileNotFoundError(Error.OVERLAY_NOT_FOUND)
    overlay = Image.open(overlay_filepath)
    LOGO_OVERLAYS.append(overlay)

# Cards generation
BLACK_OVERLAY: Image.Image = Image.open(CARDS_BOTTOM_B_FILEPATH)
WHITE_OVERLAY: Image.Image = Image.open(CARDS_BOTTOM_W_FILEPATH)

OUTRO_IMAGE: Image.Image = Image.open(CARDS_OUTRO_FILEPATH)

ATTRIBUTION_PERCENTAGE_TOLERANCE = 5 # if user_attr < ATTRIBUTION_TOLERANCE, don't display them on outro card

METADATA_IDENTIFIER = "Metadata | "
METADATA_SEP = " ;;; "

TRANSLATION_TABLE = {
    ord('\u2005'): ' ', # Replace four-per-em space with normal space
    ord('\u200b'): '', # Replace zero-width space with nothing
    ord('\u0435'): 'e', # Replace Cyrillic 'е' with Latin 'e'
}