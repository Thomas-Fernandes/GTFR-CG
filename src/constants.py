from dotenv import load_dotenv

from enum import Enum
from os import getenv, name as osName
from re import compile
from typing import Optional

from src.typing import Context, ContextObj, JsonDict, Route, Routes

############# ENUMS #############

class HttpStatus(Enum):
    """ Enum for HTTP status codes.
    """
    OK = 200
    REDIRECT = 302
    BAD_REQUEST = 400
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(Enum):
    """ Enum for time units, converted to seconds.
    """
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
    """ Enum for the fields in the session.
    """
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
    redirect = Route(
        path="/redirect",
        view_filename="redirect.html",
        bp_name="redirect",
    ),
    home = Route(
        path="/home",
        view_filename="home.html",
        bp_name="home",
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
DEFAULT_CONTEXT_OBJ = ContextObj(
    ### REDIRECT
    redirect_to = "",
    error_text = "",
    plural = "s",

    ### HOME
    stats = {},
    plurals = {},
    session_status = "initializing",
    genius_token = "",

    ### LYRICS
    lyrics = "",
)
DEFAULT_CONTEXT: Context = {
    ### REDIRECT
    "redirect_to": DEFAULT_CONTEXT_OBJ.redirect_to,
    "error_text": DEFAULT_CONTEXT_OBJ.error_text,
    "plural": DEFAULT_CONTEXT_OBJ.plural,

    ### HOME
    "stats": DEFAULT_CONTEXT_OBJ.stats,
    "plurals": DEFAULT_CONTEXT_OBJ.plurals,
    "session_status": DEFAULT_CONTEXT_OBJ.session_status,
    "genius_token": DEFAULT_CONTEXT_OBJ.genius_token,

    ### LYRICS
    "lyrics": DEFAULT_CONTEXT_OBJ.lyrics,
}

# Statistics
DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"
STATS_FILE_PATH = "stats.json"
DEFAULT_EXPIRATION = 2 # in days (integer)
class AvailableStats(Enum):
    """ Enum for the available statistics.
    """
    dateFirstOperation = "dateFirstOperation"
    dateLastOperation = "dateLastOperation"
    artworkGenerations = "artworkGenerations"
    lyricsFetches = "lyricsFetches"
EMPTY_STATS: JsonDict = {
    AvailableStats.dateFirstOperation.value: "N/A",
    AvailableStats.dateLastOperation.value: "N/A",
    AvailableStats.artworkGenerations.value: 0,
    AvailableStats.lyricsFetches.value: 0,
}
INCREMENTABLE_STATS: list[str] = [
    AvailableStats.artworkGenerations.value,
    AvailableStats.lyricsFetches.value,
]

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
ERR_INVALID_THUMBNAIL = "Invalid thumbnail index."
ERR_FAIL_DOWNLOAD = "Failed to download image."
ERR_GENIUS_TOKEN = "Genius API token not found."

# Genius
load_dotenv()
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