from PIL import ImageFont as IFont

from src.constants.enums import MetanameFontNames
from src.constants.paths import SLASH, path_prefix

fonts_dir = f"{path_prefix}assets{SLASH}fonts{SLASH}"

cards_font_lyrics_size = 64
cards_font_metaname_size = 43
cards_font_metaname_size_non_latin = 40
cards_font_outro_size = 36

font_ascii_abspath = f"{fonts_dir}{'programme-light.ttf'}"
FONT_LYRICS = IFont.truetype(font_ascii_abspath, cards_font_lyrics_size)
FONT_OUTRO = IFont.truetype(font_ascii_abspath, cards_font_outro_size)

FONTS_METANAME = {
    MetanameFontNames.LATIN: IFont.truetype(font_ascii_abspath, cards_font_metaname_size),
    MetanameFontNames.S_CHINESE: IFont.truetype(f"{fonts_dir}{'noto-serif-sc-regular.ttf'}", cards_font_metaname_size_non_latin),
    MetanameFontNames.T_CHINESE: IFont.truetype(f"{fonts_dir}{'noto-serif-tc-regular.ttf'}", cards_font_metaname_size_non_latin),
    MetanameFontNames.JAPANESE: IFont.truetype(f"{fonts_dir}{'noto-serif-jp-regular.ttf'}", cards_font_metaname_size_non_latin),
    MetanameFontNames.KOREAN: IFont.truetype(f"{fonts_dir}{'noto-serif-kr-regular.ttf'}", cards_font_metaname_size_non_latin),
    MetanameFontNames.FALLBACK: IFont.truetype(f"{fonts_dir}{'arial.ttf'}", cards_font_metaname_size_non_latin),
}

OUTRO_TEXT_COLOR = (246, 240, 104) #f6f068
X_META_LYRIC = 90
Y_METADATA = 964
Y_BOTTOM_LYRICS = 790
LYRIC_HEIGHT = 94
LYRIC_SPACING = 13
LYRIC_BOX_OFFSET = 16
LYRIC_TEXT_OFFSET = 20