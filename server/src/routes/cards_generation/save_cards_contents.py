from flask import Blueprint, Response, request
from flask_restx import Resource

from ast import literal_eval
from os import path, makedirs
from time import time
from typing import Optional
from uuid import uuid4

from server.src.constants.enums import AvailableCacheElemType, HttpStatus, SessionFields
from server.src.constants.paths import ROUTES, SLASH, PROCESSED_DIR
from server.src.constants.responses import Err, Msg, Warn

from server.src.app import session
from server.src.docs import models, ns_cards_generation
from server.src.logger import log, LogSeverity
from server.src.typing_gtfr import CardsContents
from server.src.utils.file_utils import writeCardsContentsToFile
from server.src.utils.time_utils import getNowStamp
from server.src.utils.web_utils import createApiResponse

from server.src.routes.cards_generation.utils import isListListStr

def saveCardsContents(cards_contents: CardsContents) -> Response:
    """ Saves the cards contents to the user's folder
    :param cards_contents: [list[list[str]]] The contents of the cards
    :return: [Response] The response to the request
    """
    start = time()
    if SessionFields.USER_FOLDER not in session:
        log.debug(Warn.NO_USER_FOLDER)
        session[SessionFields.USER_FOLDER] = str(uuid4())

    user_folder = str(session.get(SessionFields.USER_FOLDER)) + SLASH + AvailableCacheElemType.CARDS + SLASH
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    if not isListListStr(cards_contents):
        log.error(f"Error while saving cards contents: {Err.CARDS_CONTENTS_INVALID}")
        return createApiResponse(HttpStatus.BAD_REQUEST, Err.CARDS_CONTENTS_INVALID)

    filepath = path.join(user_processed_path, f"contents_{getNowStamp()}.txt")
    try:
        writeCardsContentsToFile(filepath, cards_contents)
    except Exception as e:
        log.error(f"Error while saving cards contents: {e}")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.CARDS_CONTENTS_SAVE_FAILED)

    session[SessionFields.CARDS_CONTENTS] = filepath
    log.log(f"Cards contents saved to {filepath}.").time(LogSeverity.INFO, time() - start)
    return createApiResponse(HttpStatus.CREATED, Msg.CARDS_CONTENTS_SAVED)

bp_cards_generation_save_cards_contents = Blueprint("save-cards-contents", __name__.split('.')[-1])

@ns_cards_generation.route("/save-cards-contents")
class CardsContentsResource(Resource):
    @ns_cards_generation.doc("post_save_cards_contents")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["save-cards-contents"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED, Msg.CARDS_CONTENTS_SAVED)
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST, "\n".join([Err.CARDS_CONTENTS_NOT_FOUND, Err.CARDS_CONTENTS_INVALID]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, Err.CARDS_CONTENTS_SAVE_FAILED)
    def post(self) -> Response:
        """ Saves the cards contents to the user's folder """
        log.debug("POST - Saving cards contents...")

        body = literal_eval(request.get_data(as_text=True))
        cards_contents: Optional[list[list[str]]] = body.get("cardsContents")

        if cards_contents is None:
            log.error(f"Error while deducing cards metadata: {Err.CARDS_CONTENTS_NOT_FOUND}")
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.CARDS_CONTENTS_NOT_FOUND)

        return saveCardsContents(cards_contents)
