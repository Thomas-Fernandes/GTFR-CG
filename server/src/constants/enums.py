from enum import IntEnum, StrEnum

class HttpStatus(IntEnum):
    """ Enum for HTTP status codes """
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204
    CONTENT_DIFFERENT = 210
    BAD_REQUEST = 400
    PRECONDITION_FAILED = 412
    UNSUPPORTED_MEDIA_TYPE = 415
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(IntEnum):
    """ Enum for time units, converted to seconds for convenience """
    SECOND = 1
    MINUTE = 60 * SECOND
    HOUR   = 60 * MINUTE
    DAY    = 24 * HOUR
    WEEK   = 7 * DAY
    MONTH  = int(30.44 * DAY)
    YEAR   = int(365.256 * DAY)

class AvailableCacheElemType(StrEnum):
    """ Enum for the available cache elements """
    SESSIONS = "sessions"
    ARTWORKS = "artworks"
    CARDS = "cards"

    def __repr__(self) -> str: return self.value

class SessionFields(StrEnum):
    """ Enum for the fields in the session object """
    USER_FOLDER = "user_folder"
    GENERATED_ARTWORK_PATH = "generated_artwork_path"
    GENIUS_TOKEN = "genius_token"
    INCLUDE_CENTER_ARTWORK = "include_center_artwork"
    CARDS_CONTENTS = "cards_contents"

    def __repr__(self) -> str: return self.value

class PayloadFields(StrEnum):
    INCLUDE_CENTER_ARTWORK = "include_center_artwork"
    LOCAL_FILE = "file"

    CARDS_CONTENTS = "cards_contents"
    ENFORCE_BACKGROUND_IMAGE = "enforce_background_image"
    ENFORCE_BOTTOM_COLOR = "enforce_bottom_color"
    OUTRO_CONTRIBUTORS = "outro_contributors"
    GEN_OUTRO = "generate_outro"
    INCLUDE_BG_IMG = "include_background_img"
    CARD_METANAME = "card_metaname"
    CARDS_LYRICS = "cards_lyrics"
    BOTTOM_COLOR = "card_bottom_color"
    CARD_FILENAME = "card_filename"

    def __repr__(self) -> str: return self.value

class AvailableStats(StrEnum):
    """ Enum for the available statistics """
    DATE_FIRST_OPERATION = "dateFirstOperation"
    DATE_LAST_OPERATION = "dateLastOperation"
    ARTWORK_GENERATIONS = "artworkGenerations"
    LYRICS_FETCHES = "lyricsFetches"
    CARDS_GENERATED = "cardsGenerated"

    def __repr__(self) -> str: return self.value

class MetanameFontNames(StrEnum):
    """ Enum for the available font types """
    LATIN = "FONT_METANAME_LATIN"
    S_CHINESE = "FONT_METANAME_S_CHINESE"
    T_CHINESE = "FONT_METANAME_T_CHINESE"
    JAPANESE = "FONT_METANAME_JAPANESE"
    KOREAN = "FONT_METANAME_KOREAN"
    FALLBACK = "FONT_METANAME_FALLBACK"

    def __repr__(self) -> str: return self.value