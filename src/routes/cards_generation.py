from flask import Blueprint, Response, request
from flask_cors import cross_origin

from ast import literal_eval
from os import path, makedirs
from typing import Optional
from uuid import uuid4

import src.constants as const
from src.logger import log
from src.soft_utils import getCardsContentsFromFile, getNowStamp, writeCardsContentsToFile
from src.typing import CardsContents
from src.web_utils import createApiResponse

from src.app import app
bp_cards_generation = Blueprint(const.ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.cards_gen.path

def generateCards(cards_contents: CardsContents, gen_outro: bool, include_bg_img: bool) -> Response:
    if const.SessionFields.user_folder.value not in session:
        log.debug("User folder not found in session. Creating a new one.")
        session[const.SessionFields.user_folder.value] = str(uuid4())

    # TODO - generate cards
    return createApiResponse(const.HttpStatus.OK.value, "Cards generated successfully.")

@bp_cards_generation.route(api_prefix + "/generate-cards", methods=["POST"])
@cross_origin()
def postGenerateCards() -> Response:
    """ Generates cards using the contents previously saved.
    :return: [Response] The response to the request.
    """
    log.debug("POST - Generating cards...")
    if const.SessionFields.cards_contents.value not in session:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_CONTENTS_NOT_FOUND)

    body = literal_eval(request.get_data(as_text=True)) # TODO - contains parameters for card generation
    if const.SessionFields.gen_outro.value not in body or const.SessionFields.include_bg_img.value not in body:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_GEN_PARAMS_NOT_FOUND)

    try:
        cards_contents: CardsContents = getCardsContentsFromFile(session[const.SessionFields.cards_contents.value])
    except Exception as e:
        log.error(f"Error while getting cards contents: {e}")
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_CARDS_CONTENTS_READ_FAILED)

    return generateCards(cards_contents, body[const.SessionFields.gen_outro.value], body[const.SessionFields.include_bg_img.value])

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

    return createApiResponse(const.HttpStatus.OK.value, "Cards contents saved successfully.")

@bp_cards_generation.route(api_prefix + "/save-cards-contents", methods=["POST"])
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