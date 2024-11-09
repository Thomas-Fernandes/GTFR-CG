from os import path
from typing import Any

from server.src.constants.enums import AvailableCacheElemType, MetanameFontNames, SessionFields

from server.src.app import session
from server.src.constants.paths import PROCESSED_DIR, SLASH
from server.src.logger import log
from server.src.typing_gtfr import RGBAColor

def getContributorsString(contributor_logins: list[str]) -> str:
    """ Gets the string of contributors from their logins
    :param contributor_logins: [list[str]] The logins of the contributors
    :return: [str] The string of contributors
    """
    contributor_logins = [f"@{c}" for c in contributor_logins] # add '@' before each login
    log.debug(f"  Contributors: {contributor_logins}")
    contributors_str = "Traduit par : "
    if len(contributor_logins) != 1:
        contributors_str += ", ".join(contributor_logins[:-1]) + " & " + contributor_logins[-1]
    else:
        contributors_str += contributor_logins[0]
    return contributors_str

def getVerticalOffset(font_type: MetanameFontNames) -> int:
    match font_type:
        case MetanameFontNames.LATIN: return 0
        case MetanameFontNames.S_CHINESE: return -10
        case MetanameFontNames.T_CHINESE: return -10
        case MetanameFontNames.JAPANESE: return -11
        case MetanameFontNames.KOREAN: return -10
        case _ : return -1 # fallback
    return 0

def getCharFontType(char: str) -> MetanameFontNames:
    c = ord(char) # get the Unicode code point of the character
    if char.isascii() or char in "‘’“”" \
        or 0x0080 <= c <= 0x00FF or 0x0100 <= c <= 0x017F or 0x0180 <= c <= 0x024F:
            return MetanameFontNames.LATIN
    if 0x4E00 <= c <= 0x9FFF:
        return MetanameFontNames.S_CHINESE
    if 0x3400 <= c <= 0x4DBF or 0x20000 <= c <= 0x2A6DF:
        return MetanameFontNames.T_CHINESE
    if 0x3040 <= c <= 0x309F or 0x30A0 <= c <= 0x30FF or 0x31F0 <= c <= 0x31FF or 0x3300 <= c <= 0x33FF \
        or 0x2F00 <= c <= 0x2FDF or 0xFE30 <= c <= 0xFE4F or 0xF900 <= c <= 0xFAFF or 0x2F800 <= c <= 0x2FA1F \
        or 0x2E80 <= c <= 0x2EFF or 0x3000 <= c <= 0x303F or 0x31C0 <= c <= 0x31EF or 0x4E00 <= c <= 0x9FFF \
        or 0x20000 <= c <= 0x2A6D6 or 0x2A700 <= c <= 0x2B73F or 0x2B740 <= c <= 0x2B81F \
        or 0x3200 <= c <= 0x32FF or 0x2FF0 <= c <= 0x2FFF:
            return MetanameFontNames.JAPANESE
    if 0xAC00 <= c <= 0xD7A3 or 0x1100 <= c <= 0x11FF or 0x3130 <= c <= 0x318F \
        or 0xA960 <= c <= 0xA97F or 0xD7B0 <= c <= 0xD7FF:
            return MetanameFontNames.KOREAN
    else: return MetanameFontNames.FALLBACK

def getLuminance(bg_color: RGBAColor) -> int:
    """ Checks if the text should be black or white, depending on the background color
    :param bg_color: [RGBAColor] The background color
    :return: [bool] True if the text should be black, False otherwise
    """
    r, g, b = bg_color[:3]
    # Calculate luminance (perceived brightness): 0.299 * R + 0.587 * G + 0.114 * B
    luminance = 0.3 * r + 0.6 * g + 0.1 * b
    log.debug(f"  Deducted luminance={round(luminance, 2)}, rgb=({round(0.3 * r, 2)}, {round(0.6 * g, 2)}, {round(0.1 * b, 2)})")
    return int(luminance)

def getUserProcessedPath() -> str:
    user_folder = f"{str(session.get(SessionFields.USER_FOLDER))}{SLASH}{AvailableCacheElemType.CARDS}"
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    log.info(f"Generating cards... ({user_processed_path}{SLASH}...)")
    return user_processed_path

def isListListStr(obj: list[list[str]] | Any) -> bool:
    """ Checks if the object is a list of lists of strings
    :param obj: [list[list[str]]?] The object to check
    :return: [bool] True if the object is a list of lists of strings, False otherwise
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