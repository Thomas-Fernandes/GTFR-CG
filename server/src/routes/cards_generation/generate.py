from flask import Blueprint, Response
from flask_restx import Resource

from os import path
from time import time

from server.src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, SessionFields
from server.src.constants.paths import ROUTES, SLASH, PROCESSED_DIR, PROCESSED_OUTRO_FILENAME
from server.src.constants.responses import Err, Msg

from server.src.app import session
from server.src.docs import models, ns_cards_generation
from server.src.logger import log, LogSeverity
from server.src.statistics import updateStats
from server.src.typing_gtfr import CardgenSettings, CardMetadata, CardsContents, SongMetadata
from server.src.utils.string_utils import getHexColorFromRGB, snakeToCamel
from server.src.utils.web_utils import createApiResponse

from server.src.routes.cards_generation.pillow import generateCard, generateOutroCard
from server.src.routes.cards_generation.settings import getCardMetadata, getGenerationRequisites

def generateAllCards(
    user_processed_path: str, cards_contents: CardsContents, card_metadata: CardMetadata, settings: CardgenSettings
) -> None:
    image_output_path = f"{user_processed_path}{SLASH}00.png"
    generateCard(image_output_path, [], card_metadata)

    cards_contents = cards_contents[1:] # remove the metadata from the cards contents
    for idx, card_lyrics in enumerate(cards_contents, start=1):
        padding = '0' if idx < 10 else ''
        image_output_path = f"{user_processed_path}{SLASH}{padding}{idx}.png"
        lyrics_to_print = card_lyrics[-8:] # get the last 8 lines of the lyrics; rest overflows
        generateCard(image_output_path, lyrics_to_print, card_metadata)

    gen_outro = bool(settings.get(SessionFields.GEN_OUTRO))
    if gen_outro:
        image_output_path = f"{user_processed_path}{SLASH}{PROCESSED_OUTRO_FILENAME}"
        outro_contributors = settings.get(SessionFields.OUTRO_CONTRIBUTORS, "").split(", ")
        outro_contributors = [c for c in outro_contributors if c != ""] # remove empty strings
        generateOutroCard(image_output_path, outro_contributors)

def getUserProcessedPath() -> str:
    user_folder = f"{str(session[SessionFields.USER_FOLDER])}{SLASH}{AvailableCacheElemType.CARDS}"
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Generating cards... ({user_processed_path}{SLASH}...)")
    return user_processed_path

def extractCardMetadata(
    song_data: SongMetadata, enforce_bottom_color: bool, include_bg_img: bool
) -> tuple[Response, None] | tuple[None, CardMetadata]:
    log.info("Deducing cards metadata...")
    try:
        card_metadata = getCardMetadata(song_data, enforce_bottom_color, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while generating cards: {e}")
        return (createApiResponse(HttpStatus.PRECONDITION_FAILED, e), None)
    log.info("Cards metadata calculated successfully.")
    return (None, card_metadata)

def generateCards(cards_contents: CardsContents, song_data: SongMetadata, settings: CardgenSettings) -> Response:
    """ Generates cards using the contents provided
    :param cards_contents: [CardsContents] The contents of the cards
    :param song_data: [SongMetadata] The metadata of the song
    :param settings: [CardgenSettings] The settings for card generation
    :return: [Response] The response to the request
    """

    if SessionFields.USER_FOLDER not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.USER_FOLDER_NOT_FOUND)

    start = time()
    (err, card_metadata) = extractCardMetadata(song_data, settings.get(SessionFields.ENFORCE_BOTTOM_COLOR), settings.get(SessionFields.INCLUDE_BG_IMG))
    if err: return err
    if card_metadata is None: return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR)

    generateAllCards(getUserProcessedPath(), cards_contents, card_metadata, settings)

    number_of_generated_cards = len(cards_contents) + (2 if settings.get(SessionFields.GEN_OUTRO) else 1)
    updateStats(to_increment=AvailableStats.CARDS_GENERATED, increment=number_of_generated_cards)
    log.log(f"Generated {number_of_generated_cards} card{'s' if number_of_generated_cards > 1 else ''} successfully.") \
        .time(LogSeverity.LOG, time() - start)

    return createApiResponse(HttpStatus.OK, Msg.CARDS_GENERATED, {
        "cardsLyrics": cards_contents,
        snakeToCamel(SessionFields.BOTTOM_COLOR): getHexColorFromRGB(card_metadata.dominant_color),
    })

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
        if SessionFields.CARDS_CONTENTS not in session:
            log.error(f"Missing element in session: {Err.CARDS_CONTENTS_NOT_FOUND}")
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.CARDS_CONTENTS_NOT_FOUND)

        start = time()
        (err, cardgen_settings, cards_contents, song_data) = getGenerationRequisites()
        if err:
            return createApiResponse(HttpStatus.PRECONDITION_FAILED if err == Err.CARDS_CONTENTS_READ_FAILED else HttpStatus.BAD_REQUEST, err)
        log.info("Cards contents retrieved successfully.").time(LogSeverity.INFO, time() - start)

        return generateCards(cards_contents, song_data, cardgen_settings)
