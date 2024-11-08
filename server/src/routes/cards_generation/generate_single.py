from flask import Blueprint, Response
from flask_restx import Resource

from ast import literal_eval
from os import path
from time import time

from server.src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, SessionFields
from server.src.constants.image_generation import METADATA_IDENTIFIER
from server.src.constants.paths import ROUTES, SLASH, PROCESSED_DIR
from server.src.constants.responses import Err, Msg

from server.src.app import session
from server.src.docs import models, ns_cards_generation
from server.src.logger import log, LogSeverity
from server.src.statistics import updateStats
from server.src.typing_gtfr import CardgenSettings, CardsContents, SongMetadata
from server.src.utils.file_utils import getCardsContentsFromFile
from server.src.utils.web_utils import createApiResponse

from server.src.routes.cards_generation.pillow import generateCard
from server.src.routes.cards_generation.settings import getBaseCardgenSettings, getCardMetadata, getSongMetadata

def generateSingleCard(cards_contents: CardsContents, song_data: SongMetadata, settings: CardgenSettings) -> Response:
    """ Generates a single card using the contents provided
    :param cards_contents: [CardsContents] The contents of the card
    :param song_data: [SongMetadata] The metadata of the song
    :param settings: [dict] The settings for card generation
    :return: [Response] The response to the request
    """
    enforce_bottom_color = settings.get(SessionFields.ENFORCE_BOTTOM_COLOR)
    include_bg_img = settings.get(SessionFields.INCLUDE_BG_IMG)

    if SessionFields.USER_FOLDER not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.USER_FOLDER_NOT_FOUND)

    log.info("Deducing card metadata...")
    try:
        card_metadata = getCardMetadata(song_data, enforce_bottom_color, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while deducing card metadata: {e}")
        return createApiResponse(HttpStatus.PRECONDITION_FAILED, Err.CARDS_BACKGROUND_NOT_FOUND)
    log.info("Card metadata calculated successfully.")

    user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.CARDS
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Generating card... ({user_processed_path + SLASH}...)")
    image_output_path = f"{user_processed_path}{SLASH}{settings[SessionFields.CARD_FILENAME].split('/')[-1]}"
    lyrics_to_print = literal_eval(cards_contents[1][0])[-8:] # get the last 8 lines of the lyrics; rest overflows
    generateCard(image_output_path, lyrics_to_print, card_metadata)
    log.log("Generated new card successfully.")
    updateStats(to_increment=AvailableStats.CARDS_GENERATED)

    return createApiResponse(HttpStatus.CREATED, Msg.CARD_GENERATED)

bp_cards_generation_generate_single = Blueprint("generate-single", __name__.split('.')[-1])

@ns_cards_generation.route("/generate-single")
class SingleCardGenerationResource(Resource):
    @ns_cards_generation.doc("post_generate_single_card")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["generate-single"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED, Msg.CARD_GENERATED)
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST, Err.CARDS_PARAMS_NOT_FOUND)
    @ns_cards_generation.response(HttpStatus.PRECONDITION_FAILED, "\n".join([Err.CARDS_CONTENTS_NOT_FOUND, Err.CARDS_BACKGROUND_NOT_FOUND]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, "\n".join([Err.CARDS_CONTENTS_READ_FAILED, Err.USER_FOLDER_NOT_FOUND]))
    def post(self) -> Response:
        """ Generates a single card again using custom contents """
        log.debug("POST - Generating a singular card...")
        start = time()
        if SessionFields.CARDS_CONTENTS not in session:
            log.error(Err.CARDS_CONTENTS_NOT_FOUND)
            return createApiResponse(HttpStatus.PRECONDITION_FAILED, Err.CARDS_CONTENTS_NOT_FOUND)

        try:
            cardgen_settings: CardgenSettings = getBaseCardgenSettings(is_singular_card=True)
            log.debug(f"  Cardgen settings: {cardgen_settings}")
        except ValueError as e:
            log.error(e)
            return createApiResponse(HttpStatus.BAD_REQUEST, e)

        log.info("Getting card contents from request...")
        try:
            card_contents: CardsContents = getCardsContentsFromFile(session[SessionFields.CARDS_CONTENTS])

            if len(card_contents) == 0 or not card_contents[0][0].startswith(METADATA_IDENTIFIER):
                raise ValueError("Invalid card contents.")

            card_contents = card_contents[:1] # keep only the metadata
            card_contents += [[c.strip() for c in cardgen_settings[SessionFields.CARDS_CONTENTS].split("\n")]]

            song_data = getSongMetadata(card_contents, cardgen_settings[SessionFields.CARD_METANAME])
        except Exception as e:
            log.error(f"Error while getting card contents: {e}")
            return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.CARDS_CONTENTS_READ_FAILED)
        log.debug("  Card contents:")
        for card in card_contents:
            log.debug(f"    {card}")
        log.info("Card contents retrieved successfully.").time(LogSeverity.INFO, time() - start)

        return generateSingleCard(card_contents, song_data, cardgen_settings)