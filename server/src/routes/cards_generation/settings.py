from colorthief import ColorThief
from flask import request
from PIL import Image
from werkzeug.datastructures import FileStorage

from os import path, makedirs
from time import time
from typing import Optional
from uuid import uuid4

from server.src.constants.enums import AvailableCacheElemType, SessionFields
from server.src.constants.image_generation import BLACK_OVERLAY, METADATA_IDENTIFIER, METADATA_SEP, WHITE_OVERLAY
from server.src.constants.paths import SLASH, PROCESSED_DIR, PROCESSED_ARTWORK_FILENAME, UPLOADED_FILE_IMG_FILENAME
from server.src.constants.responses import Err, Warn

from server.src.app import session
from server.src.logger import log, LogSeverity
from server.src.routes.artwork_processing.pillow import generateCoverArt
from server.src.typing_gtfr import CardgenSettings, CardsContents, CardMetadata, SongMetadata
from server.src.utils.file_utils import doesFileExist
from server.src.utils.string_utils import snakeToCamel

from server.src.routes.cards_generation.utils import getLuminance

def getCardMetadata(song_data: SongMetadata, enforce_bottom_color: str | None, include_bg_img: bool) -> CardMetadata:
    """ Extracts the metadata needed for card generation from the song data
    :param song_data: [dict] The data of the song
    :param enforce_bottom_color: [str] The color to enforce at the bottom of the card
    :param include_bg_img: [bool] True if the background image should be included, False otherwise
    :return: [dict] The metadata of related cards
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

    bg_path = f"{PROCESSED_DIR}{session[SessionFields.USER_FOLDER]}{SLASH}" + \
        f"{AvailableCacheElemType.ARTWORKS}{SLASH}" + \
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
            """ Converts a color hex string to a tuple
            :param color: [str] The color hex string
            :return: [tuple] The color tuple
            """
            return (int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16))
        dominant_color = colorHexStringToTuple(enforce_bottom_color)
        log.info(f"  Bottom color enforced: ({dominant_color})={enforce_bottom_color}")
    else:
        log.debug("  Calculating dominant color from background image...")
        color_thief = ColorThief(bg_path)
        dominant_color = color_thief.get_color(quality=1)
        log.info(f"  Dominant color: {dominant_color}=#{hex(dominant_color[0])[2:]}{hex(dominant_color[1])[2:]}{hex(dominant_color[2])[2:]}")

    dominant_color_luminance = getLuminance(dominant_color)
    if enforce_bottom_color is None:
        log.time(LogSeverity.INFO, time() - start, padding=2)
    text_meta_color = (0,0,0) if dominant_color_luminance > 128 else (255,255,255)
    text_lyrics_color = (255,255,255) if dominant_color_luminance > 220 else (0,0,0)
    bottom_bar_overlay= BLACK_OVERLAY if text_meta_color[0] == 0 else WHITE_OVERLAY

    cards_metadata = CardMetadata(
        card_metaname=card_metaname,
        include_bg_img=include_bg_img,
        bg=bg, bottom_bar_overlay=bottom_bar_overlay,
        dominant_color=dominant_color, text_meta_color=text_meta_color, text_lyrics_color=text_lyrics_color,
    )
    log.debug(f"  {cards_metadata}")
    return cards_metadata

def getSongMetadata(cards_contents: CardsContents, card_metaname: str | None) -> dict[str, str]:
    """ Gets the metadata of the song from the cards contents
    :param cards_contents: [CardsContents] The contents of the cards
    :return: [dict] The metadata of the song
    """
    metadata = cards_contents[0][0].replace(METADATA_IDENTIFIER, "").split(METADATA_SEP)
    song_data = { "card_metaname": card_metaname if card_metaname else "" }
    for datum in metadata:
        key, value = datum.split(": ")
        song_data[key] = value
    return song_data

def saveEnforcedBackgroundImage(file: FileStorage, include_center_artwork: bool) -> None:
    if SessionFields.USER_FOLDER not in session:
        log.debug(Warn.NO_USER_FOLDER)
        session[SessionFields.USER_FOLDER] = str(uuid4())

    user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.ARTWORKS + SLASH
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
    bg_path = f"{PROCESSED_DIR}{session[SessionFields.USER_FOLDER]}{SLASH}" + \
        f"{AvailableCacheElemType.ARTWORKS}{SLASH}" + \
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
    enforce_bg_image: bool = snakeToCamel(SessionFields.ENFORCE_BACKGROUND_IMAGE) in request.files
    enforce_bottom_color: Optional[str] = None
    include_center_artwork: Optional[bool] = None
    gen_outro: Optional[str] = None
    if not is_singular_card:
        gen_outro = request.form[snakeToCamel(SessionFields.GEN_OUTRO)]
    include_bg_img: Optional[str] = request.form[snakeToCamel(SessionFields.INCLUDE_BG_IMG)]
    card_metaname: Optional[str] = request.form[snakeToCamel(SessionFields.CARD_METANAME)]

    if enforce_bg_image:
        include_center_artwork = \
            request.form[snakeToCamel(SessionFields.INCLUDE_CENTER_ARTWORK)] == "true"
        saveEnforcedBackgroundImage(request.files[snakeToCamel(SessionFields.ENFORCE_BACKGROUND_IMAGE)], include_center_artwork)

    if snakeToCamel(SessionFields.ENFORCE_BOTTOM_COLOR) in request.form:
        enforce_bottom_color = request.form[snakeToCamel(SessionFields.ENFORCE_BOTTOM_COLOR)]

    outro_contributors = None
    if gen_outro is not None and eval(gen_outro.capitalize()) == True:
        print(str(dict(request.form).keys()), snakeToCamel(SessionFields.OUTRO_CONTRIBUTORS) in request.form)
        print(request.form[snakeToCamel(SessionFields.OUTRO_CONTRIBUTORS)])
        outro_contributors: Optional[str] = request.form[snakeToCamel(SessionFields.OUTRO_CONTRIBUTORS)]

    def checkCardgenParametersValidity(card_metaname: str, enforce_bg_image: bool, include_center_artwork: bool, include_bg_img: str) -> Optional[str]:
        if card_metaname is None: return Err.CARDS_METANAME_NOT_FOUND
        if enforce_bg_image and include_center_artwork is None: return Err.CARDS_CENTER_ARTWORK_NOT_FOUND
        if not enforce_bg_image and include_bg_img is None: return Err.CARDS_BACKGROUND_NOT_FOUND
        return None
    err = checkCardgenParametersValidity(card_metaname, enforce_bg_image, include_center_artwork, include_bg_img)
    if err is not None:
        raise ValueError(err)

    base_settings = {
        SessionFields.ENFORCE_BOTTOM_COLOR: enforce_bottom_color,
        SessionFields.GEN_OUTRO: gen_outro is not None and eval(gen_outro.capitalize()),
        SessionFields.INCLUDE_BG_IMG: eval(include_bg_img.capitalize()),
        SessionFields.CARD_METANAME: card_metaname,
        SessionFields.OUTRO_CONTRIBUTORS: outro_contributors,
    }

    if is_singular_card:
        card_content: Optional[str] = request.form[snakeToCamel(SessionFields.CARDS_CONTENTS)]
        card_filename: Optional[str] = request.form[snakeToCamel(SessionFields.CARD_FILENAME)]

        def checkSingularCardgenParametersValidity(card_content: str, card_filename: str, bottom_color: str) -> Optional[str]:
            if bottom_color is None: return Err.CARDS_COLOR_NOT_FOUND
            if card_content is None: return Err.CARDS_CONTENTS_NOT_FOUND
            if card_filename is None: return Err.CARDS_FILENAME_NOT_FOUND
            return None
        err = checkSingularCardgenParametersValidity(card_content, card_filename, enforce_bottom_color)
        if err is not None:
            raise ValueError(err)

        base_settings[SessionFields.CARDS_CONTENTS] = card_content
        base_settings[SessionFields.CARD_FILENAME] = card_filename

    return base_settings
