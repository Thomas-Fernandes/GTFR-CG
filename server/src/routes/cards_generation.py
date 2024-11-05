from colorthief import ColorThief
from flask import Blueprint, Response, request
from flask_restx import Resource
from PIL import Image, ImageDraw
from werkzeug.datastructures import FileStorage

from ast import literal_eval
from os import path, makedirs
from time import time
from typing import Any, Optional
from uuid import uuid4

from server.src.constants.cards_generation import METADATA_IDENTIFIER, METADATA_SEP
from server.src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, MetanameFontNames, SessionFields
from server.src.constants.paths import \
    API_ROUTE, CARDS_BOTTOM_B, CARDS_BOTTOM_W, FRONT_PROCESSED_CARDS_DIR, ROUTES, SLASH, CARDS_DIR, \
    PROCESSED_DIR, PROCESSED_OUTRO_FILENAME, PROCESSED_ARTWORK_FILENAME, UPLOADED_FILE_IMG_FILENAME
from server.src.constants.pillow import \
    FONT_LYRICS, FONT_OUTRO, FONTS_METANAME, LYRIC_HEIGHT, LYRIC_SPACING, LYRIC_BOX_OFFSET, LYRIC_TEXT_OFFSET, \
    OUTRO_TEXT_COLOR, X_META_LYRIC, Y_METADATA, Y_BOTTOM_LYRICS
from server.src.constants.responses import Err, Msg, Warn
from server.src.docs import models, ns_cards_generation
from server.src.logger import log, LogSeverity
from server.src.routes.artwork_processing import generateCoverArt
from server.src.statistics import updateStats
from server.src.typing_gtfr import CardgenSettings, CardsContents, CardMetadata, RGBAColor, SongMetadata
from server.src.utils.file_utils import doesFileExist, getCardsContentsFromFile, writeCardsContentsToFile
from server.src.utils.string_utils import getHexColorFromRGB, snakeToCamelCase
from server.src.utils.time_utils import getNowStamp
from server.src.utils.web_utils import createApiResponse

from server.src.app import api, app
bp_cards_generation = Blueprint(ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = API_ROUTE + ROUTES.cards_gen.path
api.add_namespace(ns_cards_generation, path=api_prefix)

def generateOutroCard(output_path: str, contributor_logins: list[str]) -> None:
    """ Generates the outro card mentioning the transcription contributors.
    :param output_path: [string] The path to save the card to.
    :param contributor_logins: [list[str]] The logins of the contributors.
    """
    log.info("  Generating outro card...")
    user_folder = path.abspath(str(session[SessionFields.user_folder.value]))
    user_folder = SLASH.join(user_folder.split(SLASH)[:-1])
    image_file = f"{user_folder}{SLASH}{CARDS_DIR}{PROCESSED_OUTRO_FILENAME}"
    image: Image.Image = Image.open(image_file)

    def getContributorsString(contributor_logins: list[str]) -> str:
        """ Gets the string of contributors from their logins.
        :param contributor_logins: [list[str]] The logins of the contributors.
        :return: [str] The string of contributors.
        """
        contributor_logins = [f"@{c}" for c in contributor_logins] # add '@' before each login
        log.debug(f"  Contributors: {contributor_logins}")
        contributors_str = "Traduit par : "
        if len(contributor_logins) != 1:
            contributors_str += ", ".join(contributor_logins[:-1]) + " & " + contributor_logins[-1]
        else:
            contributors_str += contributor_logins[0]
        return contributors_str
    contributors_str = "" if contributor_logins == [] else getContributorsString(contributor_logins)

    draw = ImageDraw.Draw(image)
    _, _, w, _ = draw.textbbox((0, 0), contributors_str, font=FONT_OUTRO) # deduce the width of the text to center it
    draw.text(((1920-w) / 2, 960), contributors_str, font=FONT_OUTRO, fill=OUTRO_TEXT_COLOR)

    image.save(output_path)
    image.save(f"{FRONT_PROCESSED_CARDS_DIR}{PROCESSED_OUTRO_FILENAME}")
    log.info("  Outro card generated successfully.")

def getVerticalOffset(font_type: str) -> int:
    match font_type:
        case MetanameFontNames.latin.value: return 0
        case MetanameFontNames.s_chinese.value: return -10
        case MetanameFontNames.t_chinese.value: return -10
        case MetanameFontNames.japanese.value: return -11
        case MetanameFontNames.korean.value: return -10
        case _ : return -1 # fallback
    return 0
def getCharFontType(char: str) -> str:
    c = ord(char) # get the Unicode code point of the character
    if char.isascii() or char in "‘’“”" \
        or 0x0080 <= c <= 0x00FF or 0x0100 <= c <= 0x017F or 0x0180 <= c <= 0x024F:
            return MetanameFontNames.latin.value
    if 0x4E00 <= c <= 0x9FFF:
        return MetanameFontNames.s_chinese.value
    if 0x3400 <= c <= 0x4DBF or 0x20000 <= c <= 0x2A6DF:
        return MetanameFontNames.t_chinese.value
    if 0x3040 <= c <= 0x309F or 0x30A0 <= c <= 0x30FF or 0x31F0 <= c <= 0x31FF or 0x3300 <= c <= 0x33FF \
        or 0x2F00 <= c <= 0x2FDF or 0xFE30 <= c <= 0xFE4F or 0xF900 <= c <= 0xFAFF or 0x2F800 <= c <= 0x2FA1F \
        or 0x2E80 <= c <= 0x2EFF or 0x3000 <= c <= 0x303F or 0x31C0 <= c <= 0x31EF or 0x4E00 <= c <= 0x9FFF \
        or 0x20000 <= c <= 0x2A6D6 or 0x2A700 <= c <= 0x2B73F or 0x2B740 <= c <= 0x2B81F \
        or 0x3200 <= c <= 0x32FF or 0x2FF0 <= c <= 0x2FFF:
            return MetanameFontNames.japanese.value
    if 0xAC00 <= c <= 0xD7A3 or 0x1100 <= c <= 0x11FF or 0x3130 <= c <= 0x318F \
        or 0xA960 <= c <= 0xA97F or 0xD7B0 <= c <= 0xD7FF:
            return MetanameFontNames.korean.value
    else: return MetanameFontNames.fallback.value

def generateCard(output_path: str, lyrics: list[str], card_metadata: CardMetadata) -> None:
    """ Generates a card using the provided lyrics and metadata.
    :param output_path: [string] The path to save the card to.
    :param lyrics: [list[str]] The lyrics to display on the card.
    :param cards_metadata: [dict] The metadata of the card.
    """
    card_name = output_path.split(SLASH)[-1]
    log.info(f"  Generating card {card_name}...")
    card: Image.Image = Image.new("RGBA", (1920, 1080), (0,0,0,0))

    if (card_metadata.include_bg_img == True):
        card.paste(card_metadata.bg, (0, -100))

    bottom_color_bar = Image.new("RGBA", (1920, 200), card_metadata.dominant_color) # bottom: 880px -> 1080 - 880 = 200px
    card.paste(bottom_color_bar, (0, 880))

    bottom_bar = Image.open(f"{CARDS_BOTTOM_B if card_metadata.text_meta_color[0] == 0 else CARDS_BOTTOM_W}")
    card.paste(bottom_bar, mask=bottom_bar)

    draw = ImageDraw.Draw(card)
    def drawMetaname(draw: ImageDraw.ImageDraw, metaname: str, color: RGBAColor) -> None:
        """ Draws the metadata name on the card.
        :param draw: [ImageDraw.ImageDraw] The drawing object.
        :param metaname: [str] The metadata name to draw.
        :param color: [RGBAColor] The color to use.
        """
        cursor = 0
        for char in metaname:
            font_type = getCharFontType(char)
            vertical_offset = getVerticalOffset(font_type)
            metaname_position = (X_META_LYRIC + cursor, Y_METADATA + vertical_offset)
            draw.text(metaname_position, char, font=FONTS_METANAME[font_type], fill=color)
            cursor += draw.textlength(char, font=FONTS_METANAME[font_type])
    drawMetaname(draw, card_metadata.card_metaname, card_metadata.text_meta_color)

    log.debug(f"    Card contents: {lyrics}")
    start_lyrics_from = Y_BOTTOM_LYRICS - (len(lyrics) * LYRIC_HEIGHT + (len(lyrics) - 1) * LYRIC_SPACING)
    for lyric_line in lyrics:
        lyric_px_length = draw.textlength(lyric_line, font=FONT_LYRICS)
        rectangle_end_x_coord = X_META_LYRIC + LYRIC_BOX_OFFSET + LYRIC_TEXT_OFFSET + lyric_px_length
        draw.rectangle(
            [(X_META_LYRIC, start_lyrics_from), (rectangle_end_x_coord, start_lyrics_from + LYRIC_HEIGHT - 1)],
            fill=((255,255,255) if card_metadata.text_lyrics_color[0] == 0 else (0,0,0))
        )
        draw.text(
            (X_META_LYRIC + LYRIC_BOX_OFFSET, start_lyrics_from + LYRIC_TEXT_OFFSET),
            lyric_line, font=FONT_LYRICS, fill=card_metadata.text_lyrics_color
        )
        start_lyrics_from += LYRIC_HEIGHT + LYRIC_SPACING

    card.save(output_path)
    card.save(f"{FRONT_PROCESSED_CARDS_DIR}{card_name}")
    log.info(f"  Card {card_name} generated successfully.")

def getCardMetadata(song_data: SongMetadata, enforce_bottom_color: str | None, include_bg_img: bool) -> CardMetadata:
    """ Extracts the metadata needed for card generation from the song data.
    :param song_data: [dict] The data of the song.
    :param enforce_bottom_color: [str] The color to enforce at the bottom of the card.
    :param include_bg_img: [bool] True if the background image should be included, False otherwise.
    :return: [dict] The metadata of related cards.
    """
    card_metaname = song_data.get("card_metaname", "").upper()
    if card_metaname == "":
        if song_data.get("artist", "???").startswith("Genius"):
            song_author = song_data.get("title", "???").upper().split(" - ")[0]
            song_title = song_data.get("title", "???").upper().split(" - ")[1].split(" (")[0]
        else:
            song_author = song_data.get("artist", "???").upper()
            song_title = song_data.get("title", "???").upper()
        card_metaname = f"{song_author}, “{song_title}”"

    bg_path = f"{PROCESSED_DIR}{session[SessionFields.user_folder.value]}{SLASH}" + \
        f"{AvailableCacheElemType.artworks.value}{SLASH}" + \
        f"{PROCESSED_ARTWORK_FILENAME}"
    bg = None
    log.debug(f"  Background image path: {bg_path}")
    if not doesFileExist(bg_path) and include_bg_img == True:
        raise FileNotFoundError("Background image missing.")
    else:
        bg = Image.open(bg_path)

    start = time()
    if enforce_bottom_color is not None:
        log.debug("  Enforcing bottom color...")
        def colorHexStringToTuple(color: str) -> tuple[int, int, int]:
            """ Converts a color hex string to a tuple.
            :param color: [str] The color hex string.
            :return: [tuple] The color tuple.
            """
            return (int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16))
        dominant_color = colorHexStringToTuple(enforce_bottom_color)
        log.info(f"  Bottom color enforced: ({dominant_color})={enforce_bottom_color}")
    else:
        log.debug("  Calculating dominant color from background image...")
        color_thief = ColorThief(bg_path)
        dominant_color = color_thief.get_color(quality=1)
        log.info(f"  Dominant color: {dominant_color}=#{hex(dominant_color[0])[2:]}{hex(dominant_color[1])[2:]}{hex(dominant_color[2])[2:]}")

    def getLuminance(bg_color: RGBAColor) -> int:
        """ Checks if the text should be black or white, depending on the background color.
        :param bg_color: [RGBAColor] The background color.
        :return: [bool] True if the text should be black, False otherwise.
        """
        r, g, b = bg_color[:3]
        # Calculate luminance (perceived brightness): 0.299 * R + 0.587 * G + 0.114 * B
        luminance = 0.3 * r + 0.6 * g + 0.1 * b
        log.debug(f"  Deducted luminance={round(luminance, 2)}, rgb=({round(0.3 * r, 2)}, {round(0.6 * g, 2)}, {round(0.1 * b, 2)})")
        return int(luminance)
    dominant_color_luminance = getLuminance(dominant_color)
    if enforce_bottom_color is None:
        log.time(LogSeverity.INFO, time() - start, padding=2)
    text_meta_color = (0,0,0) if dominant_color_luminance > 128 else (255,255,255)
    text_lyrics_color = (255,255,255) if dominant_color_luminance > 220 else (0,0,0)

    cards_metadata = CardMetadata(
        card_metaname=card_metaname,
        include_bg_img=include_bg_img, bg=bg, dominant_color=dominant_color,
        text_meta_color=text_meta_color, text_lyrics_color=text_lyrics_color,
    )
    log.debug(f"  {cards_metadata}")
    return cards_metadata

def generateSingleCard(cards_contents: CardsContents, song_data: SongMetadata, settings: CardgenSettings) -> Response:
    """ Generates a single card using the contents provided.
    :param cards_contents: [CardsContents] The contents of the card.
    :param song_data: [SongMetadata] The metadata of the song.
    :param settings: [dict] The settings for card generation.
    :return: [Response] The response to the request.
    """
    enforce_bottom_color = settings.get(SessionFields.enforce_bottom_color.value)
    include_bg_img = settings.get(SessionFields.include_bg_img.value)

    if SessionFields.user_folder.value not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value, Err.ERR_USER_FOLDER_NOT_FOUND)

    log.info("Deducing card metadata...")
    try:
        card_metadata = getCardMetadata(song_data, enforce_bottom_color, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while deducing card metadata: {e}")
        return createApiResponse(HttpStatus.PRECONDITION_FAILED.value, Err.ERR_CARDS_BACKGROUND_NOT_FOUND)
    log.info("Card metadata calculated successfully.")

    user_folder = str(session[SessionFields.user_folder.value]) + SLASH + AvailableCacheElemType.cards.value
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Generating card... ({user_processed_path + SLASH}...)")
    image_output_path = f"{user_processed_path}{SLASH}{settings[SessionFields.card_filename.value].split('/')[-1]}"
    generateCard(image_output_path, literal_eval(cards_contents[1][0]), card_metadata)
    log.log("Generated new card successfully.")
    updateStats(to_increment=AvailableStats.cardsGenerated.value)

    return createApiResponse(HttpStatus.CREATED.value, Msg.MSG_CARD_GENERATED)

def generateCards(cards_contents: CardsContents, song_data: SongMetadata, settings: CardgenSettings) -> Response:
    """ Generates cards using the contents provided.
    :param cards_contents: [CardsContents] The contents of the cards.
    :param song_data: [SongMetadata] The metadata of the song.
    :param settings: [dict] The settings for card generation.
    :return: [Response] The response to the request.
    """
    enforce_bottom_color = settings.get(SessionFields.enforce_bottom_color.value)
    gen_outro = settings.get(SessionFields.gen_outro.value)
    include_bg_img = settings.get(SessionFields.include_bg_img.value)

    if SessionFields.user_folder.value not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value, Err.ERR_USER_FOLDER_NOT_FOUND)

    log.info("Deducing cards metadata...")
    try:
        card_metadata = getCardMetadata(song_data, enforce_bottom_color, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while deducing cards metadata: {e}")
        return createApiResponse(HttpStatus.PRECONDITION_FAILED.value, Err.ERR_CARDS_BACKGROUND_NOT_FOUND)
    log.info("Cards metadata calculated successfully.")

    start = time()
    user_folder = str(session[SessionFields.user_folder.value]) + SLASH + AvailableCacheElemType.cards.value
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Generating cards... ({user_processed_path + SLASH}...)")
    image_output_path = f"{user_processed_path}{SLASH}00.png"
    generateCard(image_output_path, [], card_metadata)
    cards_contents = cards_contents[1:] # remove the metadata from the cards contents
    for idx, card in enumerate(cards_contents, start=1):
        padding = '0' if idx < 10 else ''
        image_output_path = f"{user_processed_path}{SLASH}{padding}{idx}.png"
        generateCard(image_output_path, card, card_metadata)
    if gen_outro:
        image_output_path = f"{user_processed_path}{SLASH}{PROCESSED_OUTRO_FILENAME}"
        outro_contributors = settings.get(SessionFields.outro_contributors.value, "").split(", ")
        outro_contributors = [c for c in outro_contributors if c != ""] # remove empty strings
        generateOutroCard(image_output_path, outro_contributors)

    number_of_generated_cards = len(cards_contents) + (2 if gen_outro else 1) # lyrics + empty + outro card
    updateStats(to_increment=AvailableStats.cardsGenerated.value, increment=number_of_generated_cards)
    log.log(f"Generated {number_of_generated_cards} card{'s' if number_of_generated_cards > 1 else ''} successfully.") \
        .time(LogSeverity.LOG, time() - start)

    return createApiResponse(
        HttpStatus.OK.value,
        "Cards generated successfully.",
        {
            "cardsLyrics": cards_contents,
            "cardBottomColor": getHexColorFromRGB(card_metadata.dominant_color),
        }
    )

def getSongMetadata(cards_contents: CardsContents, card_metaname: str | None) -> dict[str, str]:
    """ Gets the metadata of the song from the cards contents.
    :param cards_contents: [CardsContents] The contents of the cards.
    :return: [dict] The metadata of the song.
    """
    metadata = cards_contents[0][0].replace(METADATA_IDENTIFIER, "").split(METADATA_SEP)
    song_data = { "card_metaname": card_metaname if card_metaname else "" }
    for datum in metadata:
        key, value = datum.split(": ")
        song_data[key] = value
    return song_data

def saveEnforcedBackgroundImage(file: FileStorage, include_center_artwork: bool) -> None:
    if SessionFields.user_folder.value not in session:
        log.debug(Warn.WARN_NO_USER_FOLDER)
        session[SessionFields.user_folder.value] = str(uuid4())

    user_folder = str(session[SessionFields.user_folder.value]) + SLASH + AvailableCacheElemType.artworks.value + SLASH
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Creating user processed path directory: {user_processed_path}")
    makedirs(user_processed_path, exist_ok=True)
    image_path = path.join(user_processed_path, UPLOADED_FILE_IMG_FILENAME)

    log.debug(f"Saving uploaded image to {image_path}")
    file.save(image_path)

    output_bg = path.join(user_processed_path, PROCESSED_ARTWORK_FILENAME)
    generateCoverArt(image_path, output_bg, include_center_artwork)

def checkCardgenParametersInvalid(
    enforce_background_image: bool, enforce_bottom_color: Optional[str], include_center_artwork: Optional[bool], include_bg_img: Optional[str]
) -> Optional[str]:
    bg_path = f"{PROCESSED_DIR}{session[SessionFields.user_folder.value]}{SLASH}" + \
        f"{AvailableCacheElemType.artworks.value}{SLASH}" + \
        f"{PROCESSED_ARTWORK_FILENAME}"
    bg_exists = doesFileExist(bg_path)
    if include_bg_img is None:
        return "Missing parameter: Include background image"
    if enforce_background_image and include_center_artwork is None:
        return "Missing parameter: Include center artwork"
    if enforce_bottom_color is None and bg_exists != True:
        if include_bg_img != "true":
            return "Missing parameter: Enforced bottom color"
        else:
            return "Missing element: Background image"
    return None

def getBaseCardgenSettings(*, is_singular_card: bool = False) -> CardgenSettings:
    enforce_bg_image: bool = snakeToCamelCase(SessionFields.enforce_background_image.value) in request.files
    enforce_bottom_color: Optional[str] = None
    include_center_artwork: Optional[bool] = None
    gen_outro: Optional[str] = None
    if not is_singular_card:
        gen_outro = request.form[snakeToCamelCase(SessionFields.gen_outro.value)]
    include_bg_img: Optional[str] = request.form[snakeToCamelCase(SessionFields.include_bg_img.value)]
    card_metaname: Optional[str] = request.form[snakeToCamelCase(SessionFields.card_metaname.value)]

    if enforce_bg_image:
        include_center_artwork = \
            request.form[snakeToCamelCase(SessionFields.include_center_artwork.value)] == "true"
        saveEnforcedBackgroundImage(request.files[snakeToCamelCase(SessionFields.enforce_background_image.value)], include_center_artwork)

    if snakeToCamelCase(SessionFields.enforce_bottom_color.value) in request.form:
        enforce_bottom_color = request.form[snakeToCamelCase(SessionFields.enforce_bottom_color.value)]

    outro_contributors = None
    if gen_outro is not None and eval(gen_outro.capitalize()) == True:
        print(str(dict(request.form).keys()), snakeToCamelCase(SessionFields.outro_contributors.value) in request.form)
        print(request.form[snakeToCamelCase(SessionFields.outro_contributors.value)])
        outro_contributors: Optional[str] = request.form[snakeToCamelCase(SessionFields.outro_contributors.value)]

    def checkCardgenParametersValidity(card_metaname: str, enforce_bg_image: bool, include_center_artwork: bool, include_bg_img: str) -> Optional[str]:
        if card_metaname is None: return Err.ERR_CARDS_METANAME_NOT_FOUND
        if enforce_bg_image and include_center_artwork is None: return Err.ERR_CARDS_CENTER_ARTWORK_NOT_FOUND
        if not enforce_bg_image and include_bg_img is None: return Err.ERR_CARDS_BACKGROUND_NOT_FOUND
        return None
    err = checkCardgenParametersValidity(card_metaname, enforce_bg_image, include_center_artwork, include_bg_img)
    if err is not None:
        raise ValueError(err)

    base_settings = {
        SessionFields.enforce_bottom_color.value: enforce_bottom_color,
        SessionFields.gen_outro.value: gen_outro is not None and eval(gen_outro.capitalize()),
        SessionFields.include_bg_img.value: eval(include_bg_img.capitalize()),
        SessionFields.card_metaname.value: card_metaname,
        SessionFields.outro_contributors.value: outro_contributors,
    }

    if is_singular_card:
        card_content: Optional[str] = request.form[snakeToCamelCase(SessionFields.cards_contents.value)]
        card_filename: Optional[str] = request.form[snakeToCamelCase(SessionFields.card_filename.value)]

        def checkSingularCardgenParametersValidity(card_content: str, card_filename: str, bottom_color: str) -> Optional[str]:
            if bottom_color is None: return Err.ERR_CARDS_COLOR_NOT_FOUND
            if card_content is None: return Err.ERR_CARDS_CONTENTS_NOT_FOUND
            if card_filename is None: return Err.ERR_CARDS_FILENAME_NOT_FOUND
            return None
        err = checkSingularCardgenParametersValidity(card_content, card_filename, enforce_bottom_color)
        if err is not None:
            raise ValueError(err)

        base_settings[SessionFields.cards_contents.value] = card_content
        base_settings[SessionFields.card_filename.value] = card_filename

    return base_settings

@ns_cards_generation.route("/generate-single")
class SingleCardGenerationResource(Resource):
    @ns_cards_generation.doc("post_generate_single_card")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["generate-single"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED.value, Msg.MSG_CARD_GENERATED)
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST.value, Err.ERR_CARDS_PARAMS_NOT_FOUND)
    @ns_cards_generation.response(HttpStatus.PRECONDITION_FAILED.value, "\n".join([Err.ERR_CARDS_CONTENTS_NOT_FOUND, Err.ERR_CARDS_BACKGROUND_NOT_FOUND]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR.value, "\n".join([Err.ERR_CARDS_CONTENTS_READ_FAILED, Err.ERR_USER_FOLDER_NOT_FOUND]))
    def post(self) -> Response:
        """ Generates a single card again using custom contents. """
        log.debug("POST - Generating a singular card...")
        start = time()
        if SessionFields.cards_contents.value not in session:
            log.error(Err.ERR_CARDS_CONTENTS_NOT_FOUND)
            return createApiResponse(HttpStatus.PRECONDITION_FAILED.value, Err.ERR_CARDS_CONTENTS_NOT_FOUND)

        try:
            cardgen_settings: CardgenSettings = getBaseCardgenSettings(is_singular_card=True)
            log.debug(f"  Cardgen settings: {cardgen_settings}")
        except ValueError as e:
            log.error(e)
            return createApiResponse(HttpStatus.BAD_REQUEST.value, e)

        log.info("Getting card contents from request...")
        try:
            card_contents: CardsContents = getCardsContentsFromFile(session[SessionFields.cards_contents.value])

            if len(card_contents) == 0 or not card_contents[0][0].startswith(METADATA_IDENTIFIER):
                raise ValueError("Invalid card contents.")

            card_contents = card_contents[:1] # keep only the metadata
            card_contents += [[c.strip() for c in cardgen_settings[SessionFields.cards_contents.value].split("\n")]]

            song_data = getSongMetadata(card_contents, cardgen_settings[SessionFields.card_metaname.value])
        except Exception as e:
            log.error(f"Error while getting card contents: {e}")
            return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value, Err.ERR_CARDS_CONTENTS_READ_FAILED)
        log.debug("  Card contents:")
        for card in card_contents:
            log.debug(f"    {card}")
        log.info("Card contents retrieved successfully.").time(LogSeverity.INFO, time() - start)

        return generateSingleCard(card_contents, song_data, cardgen_settings)

@ns_cards_generation.route("/generate")
class CardsGenerationResource(Resource):
    @ns_cards_generation.doc("post_generate_cards")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["generate"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED.value, Msg.MSG_CARDS_GENERATED)
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST.value, Err.ERR_CARDS_PARAMS_NOT_FOUND)
    @ns_cards_generation.response(HttpStatus.PRECONDITION_FAILED.value, "\n".join([Err.ERR_CARDS_CONTENTS_NOT_FOUND, Err.ERR_CARDS_BACKGROUND_NOT_FOUND]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR.value, "\n".join([Err.ERR_CARDS_CONTENTS_READ_FAILED, Err.ERR_USER_FOLDER_NOT_FOUND]))
    def post(self) -> Response:
        """ Generates cards using the contents previously saved """
        log.debug("POST - Generating cards...")
        start = time()
        if SessionFields.cards_contents.value not in session:
            log.error(Err.ERR_CARDS_CONTENTS_NOT_FOUND)
            return createApiResponse(HttpStatus.BAD_REQUEST.value, Err.ERR_CARDS_CONTENTS_NOT_FOUND)

        try:
            cardgen_settings: CardgenSettings = getBaseCardgenSettings()
        except ValueError as e:
            log.error(e)
            return createApiResponse(HttpStatus.BAD_REQUEST.value, e)

        log.info("Getting cards contents from savefile...")
        try:
            cards_contents: CardsContents = getCardsContentsFromFile(session[SessionFields.cards_contents.value])

            if len(cards_contents) == 0 or not cards_contents[0][0].startswith(METADATA_IDENTIFIER):
                raise ValueError("Invalid cards contents.")

            cards_contents = [[line.strip() for line in card] for card in cards_contents]

            song_data = getSongMetadata(cards_contents, cardgen_settings[SessionFields.card_metaname.value])
        except Exception as e:
            log.error(f"Error while getting cards contents: {e}")
            return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value, Err.ERR_CARDS_CONTENTS_READ_FAILED)
        log.debug("  Cards contents:\n")
        for card in cards_contents:
            log.debug(f"    {card}")
        log.info("Cards contents retrieved successfully.").time(LogSeverity.INFO, time() - start)

        return generateCards(cards_contents, song_data, cardgen_settings)

def isListListStr(obj: list[list[str]] | Any) -> bool:
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
    """ Saves the cards contents to the user's folder.
    :param cards_contents: [list[list[str]]] The contents of the cards.
    :return: [Response] The response to the request.
    """
    start = time()
    if SessionFields.user_folder.value not in session:
        log.debug(Warn.WARN_NO_USER_FOLDER)
        session[SessionFields.user_folder.value] = str(uuid4())

    user_folder = str(session[SessionFields.user_folder.value]) + SLASH + AvailableCacheElemType.cards.value + SLASH
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    if not isListListStr(cards_contents):
        log.error(Err.ERR_CARDS_CONTENTS_INVALID)
        return createApiResponse(HttpStatus.BAD_REQUEST.value, Err.ERR_CARDS_CONTENTS_INVALID)

    filepath = path.join(user_processed_path, f"contents_{getNowStamp()}.txt")
    try:
        writeCardsContentsToFile(filepath, cards_contents)
    except Exception as e:
        log.error(f"Error while saving cards contents: {e}")
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value, Err.ERR_CARDS_CONTENTS_SAVE_FAILED)

    session[SessionFields.cards_contents.value] = filepath
    log.log(f"Cards contents saved to {filepath}.").time(LogSeverity.INFO, time() - start)
    return createApiResponse(HttpStatus.CREATED.value, Msg.MSG_CARDS_CONTENTS_SAVED)

@ns_cards_generation.route("/save-cards-contents")
class CardsContentsResource(Resource):
    @ns_cards_generation.doc("post_save_cards_contents")
    @ns_cards_generation.expect(models[ROUTES.cards_gen.bp_name]["save-cards-contents"]["payload"])
    @ns_cards_generation.response(HttpStatus.CREATED.value, Msg.MSG_CARDS_CONTENTS_SAVED)
    @ns_cards_generation.response(HttpStatus.BAD_REQUEST.value, "\n".join([Err.ERR_CARDS_CONTENTS_NOT_FOUND, Err.ERR_CARDS_CONTENTS_INVALID]))
    @ns_cards_generation.response(HttpStatus.INTERNAL_SERVER_ERROR.value, Err.ERR_CARDS_CONTENTS_SAVE_FAILED)
    def post(self) -> Response:
        """ Saves the cards contents to the user's folder """
        log.debug("POST - Saving cards contents...")

        body = literal_eval(request.get_data(as_text=True))
        cards_contents: Optional[list[list[str]]] = body.get("cardsContents")

        if cards_contents is None:
            log.error(Err.ERR_CARDS_CONTENTS_NOT_FOUND)
            return createApiResponse(HttpStatus.BAD_REQUEST.value, Err.ERR_CARDS_CONTENTS_NOT_FOUND)

        return saveCardsContents(cards_contents)
