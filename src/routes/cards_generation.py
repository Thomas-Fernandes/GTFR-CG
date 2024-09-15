from flask import Blueprint, Response, request
from flask_cors import cross_origin
from PIL import Image, ImageDraw, ImageFont

from ast import literal_eval
from json import dumps
from os import path, makedirs
from requests.exceptions import ReadTimeout as ReadTimeoutException
from typing import Optional
from uuid import uuid4

import src.constants as const
from src.logger import log
from src.routes.lyrics import genius
from src.soft_utils import getCardsContentsFromFile, getNowStamp, writeCardsContentsToFile
from src.typing import CardsContents, CardsMetadata, Pixel, SongMetadata
from src.web_utils import createApiResponse

from src.app import app
bp_cards_generation = Blueprint(const.ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.cards_gen.path

def generateOutroCard(output_path: str, contributor_logins: list[str]) -> None:
    """ Generates the outro card mentioning the transcription contributors.
    :param output_path: [string] The path to save the card to.
    :param contributor_logins: [list[str]] The logins of the contributors.
    """
    log.debug("  Generating outro card...")
    user_folder = path.abspath(str(session[const.SessionFields.user_folder.value]))
    user_folder = const.SLASH.join(user_folder.split(const.SLASH)[:-1])
    image_file = f"{user_folder}{const.SLASH}{const.CARDS_DIR}{const.PROCESSED_OUTRO_FILENAME}"
    image: Image.Image = Image.open(image_file)

    font_file = f"{user_folder}{const.SLASH}{const.FONTS_DIR}{const.FONT_PROGRAMME}"
    contributors_font = ImageFont.truetype(font_file, const.OUTRO_FONT_SIZE)
    def getContributorsString(contributor_logins: list[str]) -> str:
        """ Gets the string of contributors from their logins.
        :param contributor_logins: [list[str]] The logins of the contributors.
        :return: [str] The string of contributors.
        """
        contributor_logins = [f"@{c}" for c in contributor_logins] # add '@' before each login
        contributors_str = "Traduit par : "
        if len(contributor_logins) != 1:
            contributors_str += ", ".join(contributor_logins[:-1]) + (" & " + contributor_logins[-1] if len(contributor_logins) > 2 else " & " + contributor_logins[0])
        else:
            contributors_str += contributor_logins[0]
        return contributors_str
    contributors_str = getContributorsString(contributor_logins)

    draw = ImageDraw.Draw(image)
    _, _, w, _ = draw.textbbox((0, 0), contributors_str, font=contributors_font) # deduce the width of the text to center it
    draw.text(((1920-w) / 2, 960), contributors_str, font=contributors_font, fill=const.OUTRO_TEXT_COLOR)

    image.save(output_path)
    image.save(f"{const.FRONT_PROCESSED_CARDS_DIR}{const.PROCESSED_OUTRO_FILENAME}")
    log.debug("  Outro card generated successfully.")

def generateCard(output_path: str, lyrics: list[str], song_data: SongMetadata, cards_metadata: CardsMetadata) -> None:
    """ Generates a card using the provided lyrics and metadata.
    :param output_path: [string] The path to save the card to.
    :param lyrics: [list[str]] The lyrics to display on the card.
    :param song_data: [dict] The data of the song.
    :param cards_metadata: [dict] The metadata of the cards.
    """
    card_name = output_path.split(const.SLASH)[-1]
    log.debug(f"  Generating card {card_name}...")
    # TODO
    log.debug(f"  Card {card_name} generated successfully.")

def getCardsMetadata(song_data: SongMetadata, include_bg_img: bool) -> CardsMetadata:
    """ Extracts the metadata needed for card generation from the song data.
    :param song_data: [dict] The data of the song.
    :param include_bg_img: [bool] True if the background image should be included, False otherwise.
    :return: [dict] The metadata of the cards.
    """
    cards_metadata: CardsMetadata = {}

    def getAverageColor(image_path: str) -> str:
        """ Gets the average color of an image.
        :param image_path: [string] The path to the image.
        :return: [string] The hex color of the average color.
        """
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
    cards_metadata["avg_color"] = getAverageColor(const.PROCESSED_DIR + session[const.SessionFields.user_folder.value] \
        + const.SLASH + const.AvailableCacheElemType.images.value + const.SLASH + const.PROCESSED_ARTWORK_FILENAME)

    def shouldUseBlackText(hex_color: str) -> bool:
        """ Checks if the text should be black or white, depending on the background color.
        :param hex_color: [string] The hex color of the background.
        :return: [bool] True if the text should be black, False otherwise.
        """
        r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
        # Calculate luminance (perceived brightness): 0.299 * R + 0.587 * G + 0.114 * B
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        return luminance > 128
    cards_metadata["text_color"] = "ffffff" if shouldUseBlackText(cards_metadata["avg_color"]) else "000000"
    cards_metadata["text_bg_color"] = "000000" if cards_metadata["text_color"].startswith("0") else "ffffff"
    cards_metadata["include_bg_img"] = eval(include_bg_img.capitalize())
    cards_metadata["song_author"] = song_data.get("artist", "???")
    cards_metadata["song_title"] = song_data.get("title", "???")
    log.debug(f"  Cards metadata: {dumps(cards_metadata)}")
    return cards_metadata

def generateCards(cards_contents: CardsContents, song_data: SongMetadata, gen_outro: bool, include_bg_img: bool) -> Response:
    """ Generates cards using the contents provided.
    :param cards_contents: [CardsContents] The contents of the cards.
    :param song_data: [dict] The data of the song.
    :param gen_outro: [bool] True if the outro card should be generated, False otherwise.
    :param include_bg_img: [bool] True if the background image should be included, False otherwise.
    :return: [Response] The response to the request.
    """
    if const.SessionFields.user_folder.value not in session:
        log.error("User folder not found in session. Needed thumbnail is unreachable.")
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_USER_FOLDER_NOT_FOUND)

    log.info("Deducing cards metadata...")
    cards_metadata = getCardsMetadata(song_data, include_bg_img)
    log.info("Cards metadata calculated successfully.")

    log.info("Generating cards...")
    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.cards.value
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    image_output_path = f"{user_processed_path}{const.SLASH}00.png"
    generateCard(image_output_path, [], song_data, cards_metadata)
    for idx, card in enumerate(cards_contents, start=1):
        padding = '0' if idx < 10 else ''
        image_output_path = f"{user_processed_path}{const.SLASH}{padding}{idx}.png"
        generateCard(image_output_path, card, song_data, cards_metadata)
    if gen_outro:
        image_output_path = f"{user_processed_path}{const.SLASH}{const.PROCESSED_OUTRO_FILENAME}"
        generateOutroCard(image_output_path, song_data.get("contributors", []))
    log.log("Cards generated successfully.")

    return createApiResponse(const.HttpStatus.OK.value, "Cards generated successfully.")

def getSongMetadata(cards_contents: CardsContents) -> dict[str, str]:
    """ Gets the metadata of the song from the cards contents.
    :param cards_contents: [CardsContents] The contents of the cards.
    :return: [dict] The metadata of the song.
    """
    metadata = cards_contents[0][0].replace(const.METADATA_IDENTIFIER, "").split(const.METADATA_SEP)
    cards_contents = cards_contents[1:] # remove the metadata from the cards contents
    song_data = {}
    for datum in metadata:
        key, value = datum.split(": ")
        song_data[key] = value

    def addSongContributors(song_data: dict[str, str]) -> None:
        """ Adds the contributors to the song data.
        :param song_data: [dict] The song data.
        """
        song_id = song_data.get("id", -1)
        if song_id == -1:
            raise ValueError("Song ID not found in metadata.")
        song_contributors = None
        try:
            with log.redirect_stdout_stderr() as (stdout, stderr): # type: ignore
                song_contributors = genius.song_contributors(song_id)
        except ReadTimeoutException as e:
            log.error(f"Lyrics fetch failed: {e}")
        if song_contributors is None:
            raise ValueError("Song contributors not found.")
        contributors = []
        for scribe in song_contributors["contributors"]["transcribers"]:
            contributors.append({
                "login": scribe["user"]["login"],
                "attribution": str(int(scribe["attribution"] * 100)) + "%", # may be useful later
            })
        song_data["contributors"] = [c["login"] for c in contributors[:3]]
    addSongContributors(song_data)

    return song_data

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
    gen_outro: Optional[str] = body[const.SessionFields.gen_outro.value]
    include_bg_img: Optional[str] = body[const.SessionFields.include_bg_img.value]
    if gen_outro is None or include_bg_img is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_CARDS_GEN_PARAMS_NOT_FOUND)

    log.info("Getting cards contents from savefile...")
    try:
        cards_contents: CardsContents = getCardsContentsFromFile(session[const.SessionFields.cards_contents.value])

        if len(cards_contents) == 0 or not cards_contents[0][0].startswith(const.METADATA_IDENTIFIER):
            raise ValueError("Invalid cards contents.")

        song_data = getSongMetadata(cards_contents)
    except Exception as e:
        log.error(f"Error while getting cards contents: {e}")
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_CARDS_CONTENTS_READ_FAILED)
    log.info("Cards contents retrieved successfully.")

    return generateCards(cards_contents, song_data, gen_outro, include_bg_img)

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
    """ Saves the cards contents to the user's folder.
    :param cards_contents: [list[list[str]]] The contents of the cards.
    :return: [Response] The response to the request.
    """
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
        # TODO VIDER LE CACHE
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