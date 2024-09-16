from colorthief import ColorThief
from flask import Blueprint, Response, request
from flask_cors import cross_origin
from PIL import Image, ImageDraw, ImageFont

from ast import literal_eval
from os import path, makedirs
from requests.exceptions import ReadTimeout as ReadTimeoutException
from typing import Optional
from uuid import uuid4

import src.constants as const
from src.logger import log
from src.routes.lyrics import genius
from src.soft_utils import doesFileExist, getCardsContentsFromFile, getNowStamp, writeCardsContentsToFile
from src.typing import CardsContents, CardMetadata, RGBAColor, SongMetadata
from src.web_utils import createApiResponse

from src.app import app
bp_cards_generation = Blueprint(const.ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.cards_gen.path

def generateOutroCard(output_path: str, contributor_logins: list[str], outro_font: ImageFont.FreeTypeFont) -> None:
    """ Generates the outro card mentioning the transcription contributors.
    :param output_path: [string] The path to save the card to.
    :param contributor_logins: [list[str]] The logins of the contributors.
    """
    log.info("  Generating outro card...")
    user_folder = path.abspath(str(session[const.SessionFields.user_folder.value]))
    user_folder = const.SLASH.join(user_folder.split(const.SLASH)[:-1])
    image_file = f"{user_folder}{const.SLASH}{const.CARDS_DIR}{const.PROCESSED_OUTRO_FILENAME}"
    image: Image.Image = Image.open(image_file)

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
    log.debug(f"    Contributors: {contributor_logins}")

    draw = ImageDraw.Draw(image)
    _, _, w, _ = draw.textbbox((0, 0), contributors_str, font=outro_font) # deduce the width of the text to center it
    draw.text(((1920-w) / 2, 960), contributors_str, font=outro_font, fill=const.OUTRO_TEXT_COLOR)

    image.save(output_path)
    image.save(f"{const.FRONT_PROCESSED_CARDS_DIR}{const.PROCESSED_OUTRO_FILENAME}")
    log.info("  Outro card generated successfully.")

def generateCard(output_path: str, lyrics: list[str], card_metadata: CardMetadata) -> None:
    """ Generates a card using the provided lyrics and metadata.
    :param output_path: [string] The path to save the card to.
    :param lyrics: [list[str]] The lyrics to display on the card.
    :param cards_metadata: [dict] The metadata of the card.
    """
    card_name = output_path.split(const.SLASH)[-1]
    log.info(f"  Generating card {card_name}...")
    card: Image.Image = Image.new("RGBA", (1920, 1080), (255, 255, 255, 0))

    if (card_metadata.include_bg_img == True):
        card.paste(card_metadata.bg, (0, -100))

    bottom_color_bar = Image.new("RGBA", (1920, 200), card_metadata.dominant_color) # bottom: 880px -> 1080 - 880 = 200px
    card.paste(bottom_color_bar, (0, 880))

    bottom_bar = Image.open(f"{const.CARDS_BOTTOM_B if card_metadata.text_meta_color[0] == 0 else const.CARDS_BOTTOM_W}")
    card.paste(bottom_bar, mask=bottom_bar)

    bottom_text = f"{card_metadata.song_author}, “{card_metadata.song_title}”"
    draw = ImageDraw.Draw(card)
    draw.text((const.X_META_LYRIC, const.Y_METADATA), bottom_text, font=card_metadata.text_fonts[1], fill=card_metadata.text_meta_color)

    log.debug(f"    Card contents: {lyrics}")
    start_lyrics_from = const.Y_BOTTOM_LYRICS - (len(lyrics) * const.LYRIC_HEIGHT + (len(lyrics) - 1) * const.LYRIC_SPACING)
    for lyric_line in lyrics:
        lyric_px_length = draw.textlength(lyric_line, font=card_metadata.text_fonts[0])
        rectangle_end_x_coord = const.X_META_LYRIC + const.LYRIC_BOX_OFFSET + const.LYRIC_TEXT_OFFSET + lyric_px_length
        draw.rectangle(
            [(const.X_META_LYRIC, start_lyrics_from), (rectangle_end_x_coord, start_lyrics_from + const.LYRIC_HEIGHT - 1)],
            fill=card_metadata.text_meta_color
        )
        draw.text(
            (const.X_META_LYRIC + const.LYRIC_BOX_OFFSET, start_lyrics_from + const.LYRIC_TEXT_OFFSET),
            lyric_line, font=card_metadata.text_fonts[0], fill=card_metadata.text_lyrics_color
        )
        start_lyrics_from += const.LYRIC_HEIGHT + const.LYRIC_SPACING

    card.save(output_path)
    card.save(f"{const.FRONT_PROCESSED_CARDS_DIR}{card_name}")
    log.info(f"  Card {card_name} generated successfully.")

def getCardsMetadata(song_data: SongMetadata, include_bg_img: bool) -> CardMetadata:
    """ Extracts the metadata needed for card generation from the song data.
    :param song_data: [dict] The data of the song.
    :param include_bg_img: [bool] True if the background image should be included, False otherwise.
    :return: [dict] The metadata of the cards.
    """
    bg_path = f"{const.PROCESSED_DIR}{session[const.SessionFields.user_folder.value]}{const.SLASH}" + \
        f"{const.AvailableCacheElemType.images.value}{const.SLASH}{const.PROCESSED_ARTWORK_FILENAME}"
    if not doesFileExist(bg_path):
        raise FileNotFoundError("Background image missing.")
    bg = Image.open(bg_path)

    song_author = song_data.get("artist", "???").upper()
    song_title = song_data.get("title", "???").upper()

    log.debug("  Calculating dominant color from background image...")
    color_thief = ColorThief(bg_path)
    dominant_color = color_thief.get_color(quality=1)
    log.info(f"  Dominant color: {dominant_color}")

    def shouldUseBlackText(bg_color: RGBAColor) -> bool:
        """ Checks if the text should be black or white, depending on the background color.
        :param bg_color: [RGBAColor] The background color.
        :return: [bool] True if the text should be black, False otherwise.
        """
        r, g, b = bg_color[:3]
        # Calculate luminance (perceived brightness): 0.299 * R + 0.587 * G + 0.114 * B
        luminance = 0.3 * r + 0.6 * g + 0.1 * b
        return luminance > 150
    text_meta_color = (0,0,0) if shouldUseBlackText(dominant_color) else (255,255,255)
    text_lyrics_color = (255,255,255) if text_meta_color[0] == 0 else (0,0,0)

    user_folder = path.abspath(str(session[const.SessionFields.user_folder.value]))
    user_folder = const.SLASH.join(user_folder.split(const.SLASH)[:-1])
    font_file = f"{user_folder}{const.SLASH}{const.FONTS_DIR}{const.FONT_PROGRAMME}"
    lyrics_font = ImageFont.truetype(font_file, const.CARDS_FONT_BIG_SIZE)
    metadata_font = ImageFont.truetype(font_file, const.CARDS_FONT_MEDIUM_SIZE)
    outro_font = ImageFont.truetype(font_file, const.CARDS_FONT_SMALL_SIZE)

    cards_metadata = CardMetadata(
        song_author=song_author, song_title=song_title,
        include_bg_img=eval(include_bg_img.capitalize()), bg=bg, dominant_color=dominant_color,
        text_meta_color=text_meta_color, text_lyrics_color=text_lyrics_color,
        text_fonts=[lyrics_font, metadata_font, outro_font]
    )
    log.debug(f"  {cards_metadata}")
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
    try:
        card_metadata = getCardsMetadata(song_data, include_bg_img)
    except FileNotFoundError as e:
        log.error(f"Error while deducing cards metadata: {e}")
        return createApiResponse(const.HttpStatus.PRECONDITION_FAILED.value, const.ERR_CARDS_BACKGROUND_NOT_FOUND)
    log.info("Cards metadata calculated successfully.")

    log.info("Generating cards...")
    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.cards.value
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    image_output_path = f"{user_processed_path}{const.SLASH}00.png"
    generateCard(image_output_path, [], card_metadata)
    cards_contents = cards_contents[1:] # remove the metadata from the cards contents
    for idx, card in enumerate(cards_contents, start=1):
        padding = '0' if idx < 10 else ''
        image_output_path = f"{user_processed_path}{const.SLASH}{padding}{idx}.png"
        generateCard(image_output_path, card, card_metadata)
    if gen_outro:
        image_output_path = f"{user_processed_path}{const.SLASH}{const.PROCESSED_OUTRO_FILENAME}"
        generateOutroCard(image_output_path, song_data.get("contributors", []), card_metadata.text_fonts[2])
    log.log("Cards generated successfully.")

    return createApiResponse(const.HttpStatus.OK.value, "Cards generated successfully.", {"generated": len(cards_contents) + 1})

def getSongMetadata(cards_contents: CardsContents) -> dict[str, str]:
    """ Gets the metadata of the song from the cards contents.
    :param cards_contents: [CardsContents] The contents of the cards.
    :return: [dict] The metadata of the song.
    """
    metadata = cards_contents[0][0].replace(const.METADATA_IDENTIFIER, "").split(const.METADATA_SEP)
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