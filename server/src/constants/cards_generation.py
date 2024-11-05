from PIL import Image

from server.src.constants.paths import CARDS_BOTTOM_B_FILEPATH, CARDS_BOTTOM_W_FILEPATH, CARDS_OUTRO_FILEPATH

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