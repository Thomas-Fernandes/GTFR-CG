from dotenv import load_dotenv

from enum import Enum
from os import getenv, name as osName
from re import compile
from typing import Optional

from src.typing import JsonDict, Route, Routes

class HttpStatus(Enum):
    """ Enum for HTTP status codes.
    """
    OK = 200
    BAD_REQUEST = 400
    PRECONDITION_FAILED = 412
    UNSUPPORTED_MEDIA_TYPE = 415
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(Enum):
    """ Enum for time units, converted to seconds.
    """
    SECOND = 1
    MINUTE = 60 * SECOND
    HOUR   = 60 * MINUTE
    DAY    = 24 * HOUR
    WEEK   = 7 * DAY
    MONTH  = int(30.44 * DAY)
    YEAR   = int(365.256 * DAY)

class AvailableCacheElemType(Enum):
    """ Enum for the available cache elements.
    """
    sessions = "sessions"
    images = "images"
    cards = "cards"

# Server config
HOST_HOME = "0.0.0.0"
DEFAULT_PORT = 8000

class SessionFields(Enum):
    """ Enum for the fields in the session object.
    """
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
    gen_outro = "generate_outro"
    include_bg_img = "include_background_img"

# Routes
API_ROUTE = "/api"
ROUTES = Routes(
    root = Route(
        path="/",
    ),
    redirect = Route(
        path="/redirect",
        bp_name="redirect",
    ),
    home = Route(
        path="/home",
        bp_name="home",
    ),
    art_gen = Route(
        path="/artwork-generation",
        bp_name="art-gen",
    ),
    proc_img = Route(
        path="/processed-images",
        bp_name="processed-images",
    ),
    lyrics = Route(
        path="/lyrics",
        bp_name="lyrics",
    ),
    cards_gen = Route(
        path="/cards-generation",
        bp_name="cards-gen",
    ),
)

# Statistics
DATE_FORMAT_STAMP = "%Y%m%d_%H%M%S"
DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"
STATS_FILE_PATH = "stats.json"
class AvailableStats(Enum):
    """ Enum for the available statistics.
    """
    dateFirstOperation = "dateFirstOperation"
    dateLastOperation = "dateLastOperation"
    artworkGenerations = "artworkGenerations"
    lyricsFetches = "lyricsFetches"
    cardsGenerated = "cardsGenerated"
EMPTY_STATS: JsonDict = {
    AvailableStats.dateFirstOperation.value: "N/A",
    AvailableStats.dateLastOperation.value: "N/A",
    AvailableStats.artworkGenerations.value: 0,
    AvailableStats.lyricsFetches.value: 0,
    AvailableStats.cardsGenerated.value: 0,
}
INCREMENTABLE_STATS: list[str] = [
    AvailableStats.artworkGenerations.value,
    AvailableStats.lyricsFetches.value,
    AvailableStats.cardsGenerated.value,
]

# Paths
SLASH = '/' if (osName != 'nt') else '\\'
SESSION_DIR = "flask_session" + SLASH
PROCESSED_DIR = "processed" + SLASH
PROCESSED_ARTWORK_FILENAME = "ProcessedArtwork.png"
PROCESSED_OUTRO_FILENAME = "outro.png"
FRONT_PROCESSED = f".{SLASH}front-end{SLASH}public{SLASH}"
FRONT_PROCESSED_IMAGES_DIR = f"{FRONT_PROCESSED}processed-{AvailableCacheElemType.images.value}{SLASH}"
FRONT_PROCESSED_CARDS_DIR = f"{FRONT_PROCESSED}processed-{AvailableCacheElemType.cards.value}{SLASH}"
THUMBNAILS_DIR = f"assets{SLASH}thumbnails{SLASH}"
LOGO_POSITIONS = [
    "top-left",    "top-center",    "top-right",
    "center-left", "center-center", "center-right",
    "bottom-left", "bottom-center", "bottom-right"
]
FONTS_DIR = f"assets{SLASH}fonts{SLASH}"
CARDS_DIR = f"assets{SLASH}cards{SLASH}"
CARDS_BOTTOM_B = f"{CARDS_DIR}bottom_black.png"
CARDS_BOTTOM_W = f"{CARDS_DIR}bottom_white.png"

# Error messages
ERR_USER_FOLDER_NOT_FOUND = "User folder not found."
ERR_NO_FILE = "Invalid file: No file selected."
ERR_NO_IMG = "No image was selected or uploaded."
ERR_INVALID_FILE_TYPE = "Invalid file type. Only PNG and JPG files are allowed."
ERR_NO_IMG_URL = "No image URL provided."
ERR_FAIL_DOWNLOAD = "Failed to download image."
ERR_GENIUS_TOKEN = "Genius API token not found."
ERR_LYRICS_MISSING_PARAMS = "Missing parameters for lyrics fetching."
ERR_LYRICS_NOT_FOUND = "Lyrics not found."
ERR_CARDS_CONTENTS_NOT_FOUND = "No cards contents provided."
ERR_CARDS_CONTENTS_INVALID = "Invalid cards contents provided."
ERR_CARDS_CONTENTS_SAVE_FAILED = "Failed to save cards contents."
ERR_CARDS_CONTENTS_READ_FAILED = "Failed to read cards contents."
ERR_CARDS_GEN_PARAMS_NOT_FOUND = "Required parameters not found for cards generation."
ERR_CARDS_BACKGROUND_NOT_FOUND = "No background image provided for cards generation."

# .env contents
load_dotenv()
LOGGER_SEVERITY: Optional[str] = getenv("LOGGER_SEVERITY")
GENIUS_API_TOKEN: Optional[str] = getenv("GENIUS_API_TOKEN")

# Patterns for lyricsGenius prints
LYRICSGENIUS_PATTERNS = [
    (compile(r"Searching for \"(.*)\" by (.*)..."),                       lambda m: f"Lyrics for \"{m.group(1)}\" by {m.group(2)} are being searched..."),
    (compile(r"Searching for \"(.*)\"..."),                               lambda m: f"Lyrics for \"{m.group(1)}\" are being searched..."),
    (compile(r"No results found for: \"(.*)\""),                          lambda m: f"No results found for \"{m.group(1)}\"."),
    (compile(r"Specified song does not contain lyrics. Rejecting."),      lambda m: "The specified song does not contain lyrics and was rejected."),
    (compile(r"Specified song does not have a valid lyrics. Rejecting."), lambda m: "The specified song does not have valid lyrics and was rejected."),
]

# YouTube URL regex
REGEX_YOUTUBE_URL = [
    compile(r'https?://(?:www\.)?youtube\.com/watch\?.*?v=([a-zA-Z0-9_-]{11})'),  # Normal url
    compile(r'https?://youtu\.be/([a-zA-Z0-9_-]{11})'),                           # Short url
]

# Cards processing
ATTRIBUTION_PERCENTAGE_TOLERANCE = 5 # if user_attr < ATTRIBUTION_TOLERANCE, don't display them on outro card
TRANSLATION_TABLE = {
    ord('\u2005'): ' ', # Replace four-per-em space with normal space
    ord('\u200b'): '', # Replace zero-width space with nothing
    ord('\u0435'): 'e', # Replace Cyrillic 'е' with Latin 'e'
}
METADATA_IDENTIFIER = "Metadata | "
METADATA_SEP = " ;;; "
FONT_PROGRAMME = "programme-light.ttf"
CARDS_FONT_SMALL_SIZE = 36
CARDS_FONT_MEDIUM_SIZE = 43
CARDS_FONT_BIG_SIZE = 64
OUTRO_TEXT_COLOR = (246, 240, 104) #f6f068
X_META_LYRIC = 90
Y_METADATA = 964
Y_BOTTOM_LYRICS = 790
LYRIC_HEIGHT = 94
LYRIC_SPACING = 13
LYRIC_BOX_OFFSET = 16
LYRIC_TEXT_OFFSET = 20