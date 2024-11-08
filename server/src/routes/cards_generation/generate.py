from flask import Blueprint, Response
from flask_restx import Resource

from os import path
from time import time

from server.src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, SessionFields
from server.src.constants.image_generation import METADATA_IDENTIFIER
from server.src.constants.paths import ROUTES, SLASH, PROCESSED_DIR, PROCESSED_OUTRO_FILENAME
from server.src.constants.responses import Err, Msg

from server.src.docs import models, ns_cards_generation
from server.src.logger import log, LogSeverity
from server.src.statistics import updateStats
from server.src.typing_gtfr import CardgenSettings, CardsContents, SongMetadata
from server.src.utils.file_utils import getCardsContentsFromFile
from server.src.utils.string_utils import getHexColorFromRGB
from server.src.utils.web_utils import createApiResponse

from server.src.app import session

from server.src.routes.cards_generation.pillow import generateCard, generateOutroCard
from server.src.routes.cards_generation.settings import getBaseCardgenSettings, getCardMetadata, getSongMetadata

def generateCards(cards_contents: CardsContents, song_data: SongMetadata, settings: CardgenSettings) -> Response:
    """ Generates cards using the contents provided
    :param cards_contents: [CardsContents] The contents of the cards
    :param song_data: [SongMetadata] The metadata of the song
    :param settings: [dict] The settings for card generation
    :return: [Response] The response to the request
    """
    enforce_bottom_color = settings.get(SessionFields.ENFORCE_BOTTOM_COLOR)
    gen_outro = settings.get(SessionFields.GEN_OUTRO)
    include_bg_img = settings.get(SessionFields.INCLUDE_BG_IMG)

    if SessionFields.USER_FOLDER not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.USER_FOLDER_NOT_FOUND)

    log.info("Deducing cards metadata...")
    try:
        card_metadata = getCardMetadata(song_data, enforce_bottom_color, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while deducing cards metadata: {e}")
        return createApiResponse(HttpStatus.PRECONDITION_FAILED, Err.CARDS_BACKGROUND_NOT_FOUND)
    log.info("Cards metadata calculated successfully.")

    start = time()
    user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.CARDS
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Generating cards... ({user_processed_path + SLASH}...)")
    image_output_path = f"{user_processed_path}{SLASH}00.png"
    generateCard(image_output_path, [], card_metadata)
    cards_contents = cards_contents[1:] # remove the metadata from the cards contents
    for idx, card_lyrics in enumerate(cards_contents, start=1):
        padding = '0' if idx < 10 else ''
        image_output_path = f"{user_processed_path}{SLASH}{padding}{idx}.png"
        lyrics_to_print = card_lyrics[-8:] # get the last 8 lines of the lyrics; rest overflows
        generateCard(image_output_path, lyrics_to_print, card_metadata)
    if gen_outro:
        image_output_path = f"{user_processed_path}{SLASH}{PROCESSED_OUTRO_FILENAME}"
        outro_contributors = settings.get(SessionFields.OUTRO_CONTRIBUTORS, "").split(", ")
        outro_contributors = [c for c in outro_contributors if c != ""] # remove empty strings
        generateOutroCard(image_output_path, outro_contributors)

    number_of_generated_cards = len(cards_contents) + (2 if gen_outro else 1) # lyrics + 00 + outro card
    updateStats(to_increment=AvailableStats.CARDS_GENERATED, increment=number_of_generated_cards)
    log.log(f"Generated {number_of_generated_cards} card{'s' if number_of_generated_cards > 1 else ''} successfully.") \
        .time(LogSeverity.LOG, time() - start)

    return createApiResponse(
        HttpStatus.OK,
        "Cards generated successfully.",
        {
            "cardsLyrics": cards_contents,
            "cardBottomColor": getHexColorFromRGB(card_metadata.dominant_color),
        }
    )

bp_cards_generation_generate = Blueprint("generate", __name__.split('.')[-1])

@ns_cards_generation.route("/generate")
class CardsGenerationResource(Resource):
    @ns_cards_generation.doc("post_generate_cards")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["generate"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED, Msg.CARDS_GENERATED)
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST, Err.CARDS_PARAMS_NOT_FOUND)
    @ns_cards_generation.response(HttpStatus.PRECONDITION_FAILED, "\n".join([Err.CARDS_CONTENTS_NOT_FOUND, Err.CARDS_BACKGROUND_NOT_FOUND]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, "\n".join([Err.CARDS_CONTENTS_READ_FAILED, Err.USER_FOLDER_NOT_FOUND]))
    def post(self) -> Response:
        """ Generates cards using the contents previously saved """
        log.debug("POST - Generating cards...")
        start = time()
        if SessionFields.CARDS_CONTENTS not in session:
            log.error(Err.CARDS_CONTENTS_NOT_FOUND)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.CARDS_CONTENTS_NOT_FOUND)

        try:
            cardgen_settings: CardgenSettings = getBaseCardgenSettings()
        except ValueError as e:
            log.error(e)
            return createApiResponse(HttpStatus.BAD_REQUEST, e)

        log.info("Getting cards contents from savefile...")
        try:
            cards_contents: CardsContents = getCardsContentsFromFile(session[SessionFields.CARDS_CONTENTS])

            if len(cards_contents) == 0 or not cards_contents[0][0].startswith(METADATA_IDENTIFIER):
                raise ValueError("Invalid cards contents.")

            cards_contents = [[line.strip() for line in card] for card in cards_contents]

            song_data = getSongMetadata(cards_contents, cardgen_settings[SessionFields.CARD_METANAME])
        except Exception as e:
            log.error(f"Error while getting cards contents: {e}")
            return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.CARDS_CONTENTS_READ_FAILED)
        log.debug("  Cards contents:\n")
        for card in cards_contents:
            log.debug(f"    {card}")
        log.info("Cards contents retrieved successfully.").time(LogSeverity.INFO, time() - start)

        return generateCards(cards_contents, song_data, cardgen_settings)
