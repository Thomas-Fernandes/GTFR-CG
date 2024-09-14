from flask import Blueprint, Response, request
from flask_cors import cross_origin
from PIL import Image

from ast import literal_eval
from os import path, makedirs
from typing import Optional
from uuid import uuid4

import src.constants as const
from src.logger import log
from src.soft_utils import getCardsContentsFromFile, getNowStamp, writeCardsContentsToFile
from src.typing import CardsContents, Pixel
from src.web_utils import createApiResponse

from src.app import app
bp_cards_generation = Blueprint(const.ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.cards_gen.path

def should_use_black_text(hex_color: str) -> bool:
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    # Calculate luminance (perceived brightness): 0.299 * R + 0.587 * G + 0.114 * B
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return luminance > 128
def getAverageColor(image_path: str) -> str:
    try:
        with Image.open(image_path) as img:
            img = img.convert("RGB")
    except Exception as e:
        log.error(f"Error while opening image: {e}")
        return "000000"

    pixels: list[Pixel] = list(img.getdata())

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

def generateCards(cards_contents: CardsContents, gen_outro: bool, include_bg_img: bool) -> Response:
    if const.SessionFields.user_folder.value not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_USER_FOLDER_NOT_FOUND)

    log.info("Deducing cards color properties...")
    avg_color = getAverageColor(const.PROCESSED_DIR + session[const.SessionFields.user_folder.value] + const.SLASH \
                + const.AvailableCacheElemType.images.value + const.SLASH + const.PROCESSED_ARTWORK_FILENAME)
    text_color = "000000" if should_use_black_text(avg_color) else "ffffff"
    text_bg_color = "ffffff" if text_color.startswith("0") else "000000"
    log.debug(f"Average color: {avg_color}, Text color: {text_color}, Text background color: {text_bg_color}")
    log.info("Cards color properties calculated successfully.")

    log.info("Generating cards...")
    # TODO: Implement cards generation
    log.log("Cards generated successfully.")
    return createApiResponse(const.HttpStatus.OK.value, "Cards generated successfully.")

@bp_cards_generation.route(api_prefix + "/generate", methods=["POST"])
@cross_origin()
def postGenerateCards() -> Response:
    """ Generates cards using the contents previously saved.
    :return: [Response] The response to the request.
    """
    log.debug("POST - Generating cards...")
    if const.SessionFields.cards_contents.value not in session:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_CONTENTS_NOT_FOUND)

    body = literal_eval(request.get_data(as_text=True))
    if const.SessionFields.gen_outro.value not in body or const.SessionFields.include_bg_img.value not in body:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_GEN_PARAMS_NOT_FOUND)
    gen_outro = body[const.SessionFields.gen_outro.value]
    include_bg_img = body[const.SessionFields.include_bg_img.value]

    log.info("Getting cards contents from savefile...")
    try:
        cards_contents: CardsContents = getCardsContentsFromFile(session[const.SessionFields.cards_contents.value])
    except Exception as e:
        log.error(f"Error while getting cards contents: {e}")
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_CARDS_CONTENTS_READ_FAILED)
    log.info("Cards contents retrieved successfully.")

    return generateCards(cards_contents, gen_outro, include_bg_img)

def isListListStr(obj) -> bool: # type: ignore
    """ Checks if the object is a list of lists of strings.
    :param obj: [list[list[str]]?] The object to check.
    :return: [bool] True if the object is a list of lists of strings, False otherwise.
    """
    if not isinstance(obj, list):
        return False
    for elem in obj:
        if not isinstance(elem, list):
            return False
        for sub_elem in elem:
            if not isinstance(sub_elem, str):
                return False
    return True
def saveCardsContents(cards_contents: CardsContents) -> Response:
    if const.SessionFields.user_folder.value not in session:
        log.debug("User folder not found in session. Creating a new one.")
        session[const.SessionFields.user_folder.value] = str(uuid4())

    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.cards.value + const.SLASH
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    if not isListListStr(cards_contents):
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_CONTENTS_INVALID)

    filepath = path.join(user_processed_path, f"contents_{getNowStamp()}.txt")
    try:
        writeCardsContentsToFile(filepath, cards_contents)
    except Exception as e:
        log.error(f"Error while saving cards contents: {e}")
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_CARDS_CONTENTS_SAVE_FAILED)

    session[const.SessionFields.cards_contents.value] = filepath
    log.log(f"Cards contents saved to {filepath}.")
    return createApiResponse(const.HttpStatus.OK.value, "Cards contents saved successfully.")

@bp_cards_generation.route(api_prefix + "/save-contents", methods=["POST"])
@cross_origin()
def postCardsContents() -> Response:
    """ Saves the cards contents to the user's folder.
    :return: [Response] The response to the request.
    """
    log.debug("POST - Saving cards contents...")
    body = literal_eval(request.get_data(as_text=True))
    cards_contents: Optional[list[list[str]]] = body.get("cards_contents")
    if cards_contents is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_CONTENTS_NOT_FOUND)
    return saveCardsContents(cards_contents)