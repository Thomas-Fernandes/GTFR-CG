from dotenv import load_dotenv

from enum import Enum
from os import getenv, name as osName
from re import compile
from typing import Optional

from src.typing import Context, DictKeys, JsonDict, Route, Routes

############# ENUMS #############

class HttpStatus(Enum):
    OK = 200
    REDIRECT = 302
    BAD_REQUEST = 400
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(Enum):
    SECOND = 1
    MINUTE = 60 * SECOND
    HOUR   = 60 * MINUTE
    DAY    = 24 * HOUR
    WEEK   = 7 * DAY
    YEAR   = int(365.256 * DAY)

######### REGULAR TYPES #########

# Server config
HOST_HOME = "0.0.0.0"
DEFAULT_PORT = 8000

class SessionFields(Enum):
    # Application
    session_status = "session_status"
    user_folder = "user_folder"

    # Artwork generation
    generated_artwork_path = "generated_artwork_path"
    include_center_artwork = "include_center_artwork"

    # Lyrics
    genius_token = "genius_token"

# Routes and views
ROUTES = Routes(
    root = Route(
        path="/",
        view_filename="home.html",
    ),
    home = Route(
        path="/home",
        view_filename="home.html",
        bp_name="home",
    ),
    redirect = Route(
        path="/redirect",
        view_filename="redirect.html",
        bp_name="redirect",
    ),
    art_gen = Route(
        path="/artwork-generation",
        view_filename="artwork-generation.html",
        bp_name="art-gen",
    ),
    proc_img = Route(
        path="/processed-images",
        view_filename="processed-images.html",
        bp_name="processed-images",
    ),
    lyrics = Route(
        path="/lyrics",
        view_filename="lyrics.html",
        bp_name="lyrics",
    ),
)
DEFAULT_CONTEXT: Context = {
    ### HOME
    "stats": {},
    "pluralMarks": {},

    ### LYRICS
    "lyrics": "",
}

# Statistics
DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"
STATS_FILE_PATH = "stats.json"
DEFAULT_EXPIRATION = 2 # in days (integer)
EMPTY_STATS: JsonDict = {
    "dateFirstOperation": "N/A",
    "dateLastOperation": "N/A",
    "artworkGenerations": 0,
    "lyricsFetches": 0,
}
AVAILABLE_STATS: DictKeys = list(EMPTY_STATS.keys())

# Paths
SLASH = '/' if (osName != 'nt') else '\\'
SESSION_DIR = "flask_session" + SLASH
PROCESSED_DIR = "processed" + SLASH
PROCESSED_ARTWORK_FILENAME = "ProcessedArtwork.png"
THUMBNAIL_DIR = "assets" + SLASH + "thumbnails" + SLASH
THUMBNAIL_PREFIX = "thumbnail_"; THUMBNAIL_EXT = ".png"
LOGO_POSITIONS = [
    "top-left",    "top-center",    "top-right",
    "center-left", "center-center", "center-right",
    "bottom-left", "bottom-center", "bottom-right"
]

# Error messages
ERR_INVALID_SESSION = "Session expired or invalid."
ERR_NO_FILE = "Invalid file: No file selected."
ERR_NO_IMG = "No image was selected or uploaded."
ERR_INVALID_FILE_TYPE = "Invalid file type. Only PNG and JPG files are allowed."
ERR_NO_IMG_URL = "No image URL provided."
ERR_FAIL_DOWNLOAD = "Failed to download image."
ERR_GENIUS_TOKEN = "Genius API token not found."

# Genius
load_dotenv()
GENIUS_API_TOKEN: Optional[str] = getenv("GENIUS_API_TOKEN")

# Patterns for lyricsGenius prints
PATTERNS = [
    (compile(r"Searching for \"(.*)\" by (.*)..."),                       lambda m: f"Lyrics for \"{m.group(1)}\" by {m.group(2)} are being searched..."),
    (compile(r"Searching for \"(.*)\"..."),                               lambda m: f"Lyrics for \"{m.group(1)}\" are being searched..."),
    (compile(r"No results found for: \"(.*)\""),                          lambda m: f"No results found for \"{m.group(1)}\"."),
    (compile(r"Specified song does not contain lyrics. Rejecting."),      lambda m: "The specified song does not contain lyrics and was rejected."),
    (compile(r"Specified song does not have a valid lyrics. Rejecting."), lambda m: "The specified song does not have valid lyrics and was rejected."),
]