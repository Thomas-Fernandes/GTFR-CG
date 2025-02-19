from flask import Blueprint, Response
from flask_restx import Resource

from ast import literal_eval
from time import time

from server.src.constants.enums import AvailableStats, HttpStatus, PayloadFields, SessionFields
from server.src.constants.paths import ROUTES, SLASH
from server.src.constants.responses import Error, Success

from server.src.app import session
from server.src.docs import models, ns_cards_generation
from server.src.l10n import locale
from server.src.logger import log, SeverityLevel
from server.src.statistics import updateStats
from server.src.typing_gtfr import CardgenSettings, CardsContents, SongMetadata
from server.src.utils.web_utils import createApiResponse

from server.src.routes.cards_generation.pillow import generateCard
from server.src.routes.cards_generation.settings import getCardMetadata, getGenerationRequisites
from server.src.routes.cards_generation.utils import getUserProcessedPath

def generateSingleCard(cards_contents: CardsContents, song_data: SongMetadata, settings: CardgenSettings) -> Response:
    """ Generates a single card using the contents provided
    :param cards_contents: [CardsContents] The contents of the card
    :param song_data: [SongMetadata] The metadata of the song
    :param settings: [dict] The settings for card generation
    :return: [Response] The response to the request
    """
    enforce_bottom_color = settings.get(PayloadFields.ENFORCE_BOTTOM_COLOR)
    include_bg_img = settings.get(PayloadFields.INCLUDE_BG_IMG)

    if SessionFields.USER_FOLDER not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, locale.get(Error.USER_FOLDER_NOT_FOUND))

    log.info("Deducing card metadata...")
    try:
        card_metadata = getCardMetadata(song_data, enforce_bottom_color, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while deducing card metadata: {e}")
        return createApiResponse(HttpStatus.PRECONDITION_FAILED, e)
    log.info("Card metadata calculated successfully.")

    image_output_path = f"{getUserProcessedPath()}{SLASH}{settings[PayloadFields.CARD_FILENAME].split('/')[-1]}"
    lyrics_to_print = literal_eval(cards_contents[1][0])[-8:] # get the last 8 lines of the lyrics; rest overflows
    generateCard(image_output_path, lyrics_to_print, card_metadata)
    log.info("Generated new card successfully.")
    updateStats(to_increment=AvailableStats.CARDS_GENERATED)

    return createApiResponse(HttpStatus.CREATED, locale.get(Success.CARD_GENERATED))

bp_cards_generation_generate_single = Blueprint("generate-single", __name__.split('.')[-1])

@ns_cards_generation.route("/generate-single")
class SingleCardGenerationResource(Resource):
    @ns_cards_generation.doc("post_generate_single_card")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["generate-single"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED, locale.get(Success.CARD_GENERATED))
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST, locale.get(Error.CARDS_PARAMS_NOT_FOUND))
    @ns_cards_generation.response(HttpStatus.PRECONDITION_FAILED, "\n".join([locale.get(Error.CARDS_CONTENTS_NOT_FOUND), locale.get(Error.CARDS_BACKGROUND_NOT_FOUND)]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, "\n".join([locale.get(Error.CARDS_CONTENTS_READ_FAILED), locale.get(Error.USER_FOLDER_NOT_FOUND)]))
    def post(self) -> Response:
        """ Generates a single card again using custom contents """
        log.debug("POST - Generating a singular card...")
        if SessionFields.CARDS_CONTENTS not in session:
            log.error(Error.CARDS_CONTENTS_NOT_FOUND)
            return createApiResponse(HttpStatus.PRECONDITION_FAILED, locale.get(Error.CARDS_CONTENTS_NOT_FOUND))

        start = time()
        (err, cardgen_settings, card_contents, song_data) = getGenerationRequisites(is_singular_card=True)
        if err:
            return createApiResponse(HttpStatus.PRECONDITION_FAILED if err == locale.get(Error.CARDS_CONTENTS_READ_FAILED) else HttpStatus.BAD_REQUEST, err)
        log.info("Card contents retrieved successfully.").time(SeverityLevel.INFO, time() - start)

        return generateSingleCard(card_contents, song_data, cardgen_settings)