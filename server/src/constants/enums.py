from enum import IntEnum, StrEnum

class HttpStatus(IntEnum):
    """ Enum for HTTP status codes """
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204
    BAD_REQUEST = 400
    PRECONDITION_FAILED = 412
    UNSUPPORTED_MEDIA_TYPE = 415
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(IntEnum):
    """ Enum for time units, converted to seconds """
    SECOND = 1
    MINUTE = 60 * SECOND
    HOUR   = 60 * MINUTE
    DAY    = 24 * HOUR
    WEEK   = 7 * DAY
    MONTH  = int(30.44 * DAY)
    YEAR   = int(365.256 * DAY)

class AvailableCacheElemType(StrEnum):
    """ Enum for the available cache elements """
    sessions = "sessions"
    artworks = "artworks"
    cards = "cards"

    def __repr__(self) -> str: return self.value

class SessionFields(StrEnum):
    """ Enum for the fields in the session object """
    # Application
    user_folder = "user_folder"

    # Artwork generation
    generated_artwork_path = "generated_artwork_path"
    include_center_artwork = "include_center_artwork"

    # Lyrics
    genius_token = "genius_token"

    # Cards generation
    cards_contents = "cards_contents"
    song_data = "song_data"
    enforce_background_image = "enforce_background_image"
    enforce_bottom_color = "enforce_bottom_color"
    outro_contributors = "outro_contributors"
    gen_outro = "generate_outro"
    include_bg_img = "include_background_img"
    card_metaname = "card_metaname"
    bottom_color = "card_bottom_color"
    card_filename = "card_filename"

    def __repr__(self) -> str: return self.value

class AvailableStats(StrEnum):
    """ Enum for the available statistics """
    dateFirstOperation = "dateFirstOperation"
    dateLastOperation = "dateLastOperation"
    artworkGenerations = "artworkGenerations"
    lyricsFetches = "lyricsFetches"
    cardsGenerated = "cardsGenerated"

    def __repr__(self) -> str: return self.value

class MetanameFontNames(StrEnum):
    """ Enum for the available font types """
    latin = "FONT_METANAME_LATIN"
    s_chinese = "FONT_METANAME_S_CHINESE"
    t_chinese = "FONT_METANAME_T_CHINESE"
    japanese = "FONT_METANAME_JAPANESE"
    korean = "FONT_METANAME_KOREAN"
    fallback = "FONT_METANAME_FALLBACK"

    def __repr__(self) -> str: return self.value