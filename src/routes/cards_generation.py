from flask import Blueprint, Response, request
from flask_cors import cross_origin

from ast import literal_eval
from typing import Optional

import src.constants as const
from src.logger import log
from src.web_utils import createApiResponse

from src.app import app
bp_cards_generation = Blueprint(const.ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.cards_gen.path

def saveCardsContents(cards_contents: list[list[str]]) -> Response:
    # TODO save cards_contents
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