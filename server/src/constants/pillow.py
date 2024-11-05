from PIL import ImageFont as IFont

from server.src.constants.enums import MetanameFontNames
from server.src.constants.paths import SLASH, path_prefix

FONTS_DIR = f"{path_prefix}assets{SLASH}fonts{SLASH}"

CARDS_FONT_LYRICS_SIZE = 64
CARDS_FONT_METANAME_SIZE = 43
CARDS_FONT_METANAME_SIZE_NON_LATIN = 40
CARDS_FONT_OUTRO_SIZE = 36

FONT_ASCII_ABSPATH = f"{FONTS_DIR}{'programme-light.ttf'}"
FONT_LYRICS = IFont.truetype(FONT_ASCII_ABSPATH, CARDS_FONT_LYRICS_SIZE)
FONT_OUTRO = IFont.truetype(FONT_ASCII_ABSPATH, CARDS_FONT_OUTRO_SIZE)

FONTS_METANAME = {
    MetanameFontNames.latin: IFont.truetype(FONT_ASCII_ABSPATH, CARDS_FONT_METANAME_SIZE),
    MetanameFontNames.s_chinese: IFont.truetype(f"{FONTS_DIR}{'noto-serif-sc-regular.ttf'}", CARDS_FONT_METANAME_SIZE_NON_LATIN),
    MetanameFontNames.t_chinese: IFont.truetype(f"{FONTS_DIR}{'noto-serif-tc-regular.ttf'}", CARDS_FONT_METANAME_SIZE_NON_LATIN),
    MetanameFontNames.japanese: IFont.truetype(f"{FONTS_DIR}{'noto-serif-jp-regular.ttf'}", CARDS_FONT_METANAME_SIZE_NON_LATIN),
    MetanameFontNames.korean: IFont.truetype(f"{FONTS_DIR}{'noto-serif-kr-regular.ttf'}", CARDS_FONT_METANAME_SIZE_NON_LATIN),
    MetanameFontNames.fallback: IFont.truetype(f"{FONTS_DIR}{'arial.ttf'}", CARDS_FONT_METANAME_SIZE_NON_LATIN),
}

OUTRO_TEXT_COLOR = (246, 240, 104) #f6f068
X_META_LYRIC = 90
Y_METADATA = 964
Y_BOTTOM_LYRICS = 790
LYRIC_HEIGHT = 94
LYRIC_SPACING = 13
LYRIC_BOX_OFFSET = 16
LYRIC_TEXT_OFFSET = 20