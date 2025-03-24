from PIL import Image, ImageDraw as IDraw

from src.constants.image_generation import ImageMode, OUTRO_IMAGE
from src.constants.paths import GENERATED_CARDS_DIR, SLASH, PROCESSED_OUTRO_FILENAME
from src.constants.pillow import (
    FONT_LYRICS,
    FONT_OUTRO,
    FONTS_METANAME,
    LYRIC_HEIGHT,
    LYRIC_SPACING,
    LYRIC_BOX_OFFSET,
    LYRIC_TEXT_OFFSET,
    OUTRO_TEXT_COLOR,
    X_META_LYRIC,
    Y_METADATA,
    Y_BOTTOM_LYRICS,
)

from src.logger import log
from src.typing_gtfr import CardMetadata, RGBColor, RGBAColor

from src.routes.cards_generation.utils import getContributorsString, getVerticalOffset, getCharFontType


def generateOutroCard(output_path: str, contributor_logins: list[str]) -> None:
    """Generates the outro card mentioning the transcription contributors
    :param output_path: [string] The path to save the card to
    :param contributor_logins: [list[str]] The logins of the contributors
    """
    log.info("  Generating outro card...")
    card = Image.new(ImageMode.RGB, (1920, 1080), (0, 0, 0))
    card.paste(OUTRO_IMAGE, (0, -32))

    draw = IDraw.Draw(card)
    contributors_str = "" if contributor_logins == [] else getContributorsString(contributor_logins)
    _, _, w, _ = draw.textbbox((0, 0), contributors_str, font=FONT_OUTRO)  # deduce the width of the text to center it
    draw.text(((1920 - w) / 2, 960 - 16), contributors_str, font=FONT_OUTRO, fill=OUTRO_TEXT_COLOR)

    card.save(output_path)
    card.save(f"{GENERATED_CARDS_DIR}{PROCESSED_OUTRO_FILENAME}")
    log.info("  Outro card generated successfully.")


def drawLyrics(draw: IDraw.ImageDraw, lyrics: list[list[str]], text_lyrics_color: RGBColor) -> None:
    start_lyrics_from = Y_BOTTOM_LYRICS - (len(lyrics) * LYRIC_HEIGHT + (len(lyrics) - 1) * LYRIC_SPACING)
    for lyric_line in lyrics:
        lyric_px_length = draw.textlength(lyric_line, font=FONT_LYRICS)
        rectangle_end_x_coord = X_META_LYRIC + LYRIC_BOX_OFFSET + LYRIC_TEXT_OFFSET + lyric_px_length
        draw.rectangle(
            [(X_META_LYRIC, start_lyrics_from), (rectangle_end_x_coord, start_lyrics_from + LYRIC_HEIGHT - 1)],
            fill=((255, 255, 255) if text_lyrics_color[0] == 0 else (0, 0, 0))
        )
        draw.text(
            (X_META_LYRIC + LYRIC_BOX_OFFSET, start_lyrics_from + LYRIC_TEXT_OFFSET),
            lyric_line,
            font=FONT_LYRICS,
            fill=text_lyrics_color
        )
        start_lyrics_from += LYRIC_HEIGHT + LYRIC_SPACING


def drawMetaname(draw: IDraw.ImageDraw, metaname: str, color: RGBAColor) -> None:
    """Draws the metadata name on the card
    :param draw: [IDraw__ImageDraw] The drawing object
    :param metaname: [str] The metadata name to draw
    :param color: [RGBAColor] The color to use
    """
    cursor = 0
    for char in metaname:
        font_type = getCharFontType(char)
        vertical_offset = getVerticalOffset(font_type)
        metaname_position = (X_META_LYRIC + cursor, Y_METADATA + vertical_offset)
        draw.text(metaname_position, char, font=FONTS_METANAME[font_type], fill=color)
        cursor += draw.textlength(char, font=FONTS_METANAME[font_type])


def generateCard(output_path: str, lyrics: list[str], card_metadata: CardMetadata) -> None:
    """Generates a card using the provided lyrics and metadata
    :param output_path: [string] The path to save the card to
    :param lyrics: [list[str]] The lyrics to display on the card
    :param cards_metadata: [dict] The metadata of the card
    """
    card_name = output_path.split(SLASH)[-1]
    log.info(f"  Generating card {card_name}...")
    card: Image.Image = Image.new(ImageMode.RGBA, (1920, 1080), (0, 0, 0, 0))

    if card_metadata.include_bg_img == True:
        card.paste(card_metadata.bg, (0, -100))

    bottom_bar = Image.new(
        ImageMode.RGB, (1920, 200), card_metadata.dominant_color
    )  # bottom: 880px -> 1080 - 880 = 200px
    card.paste(bottom_bar, (0, 880))
    card.paste(card_metadata.bottom_bar_overlay, mask=card_metadata.bottom_bar_overlay)

    draw = IDraw.Draw(card)
    drawMetaname(draw, card_metadata.card_metaname, card_metadata.text_meta_color)

    log.debug(f"    Card contents: {lyrics}")
    drawLyrics(draw, lyrics, card_metadata.text_lyrics_color)

    card.save(output_path)
    card.save(f"{GENERATED_CARDS_DIR}{card_name}")
    log.info(f"  Card {card_name} generated successfully.")
