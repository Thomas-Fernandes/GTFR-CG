from os import name as osName, path

from server.src.constants.enums import AvailableCacheElemType
from server.src.typing_gtfr import Route, Routes

HOST_HOME = "0.0.0.0"
DEFAULT_PORT = 8000

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
        bp_name="artwork-generation",
    ),
    art_proc = Route(
        path="/artwork-processing",
        bp_name="artwork-processing",
    ),
    lyrics = Route(
        path="/lyrics",
        bp_name="lyrics",
    ),
    cards_gen = Route(
        path="/cards-generation",
        bp_name="cards-generation",
    ),
)

STATS_FILE_PATH = "stats.json"

SLASH = '/' if (osName != 'nt') else '\\'
path_prefix = "" if path.isfile("requirements.txt") else f"server{SLASH}" # for running from installer.py
SESSION_TYPE = "filesystem"
SESSION_DIR = "flask_session" + SLASH

PROCESSED_DIR = "processed" + SLASH
front_dir = f"..{SLASH}client{SLASH}"

FRONT_PROCESSED = f"{front_dir}public{SLASH}"
FRONT_PROCESSED_ARTWORKS_DIR = f"{FRONT_PROCESSED}processed-{AvailableCacheElemType.ARTWORKS}{SLASH}"
ASSETS_THUMBNAILS_DIR = f"{path_prefix}assets{SLASH}thumbnails{SLASH}"
UPLOADED_ITUNES_IMG_FILENAME = "itunes_image.png"
UPLOADED_FILE_IMG_FILENAME = "uploaded_image.png"
UPLOADED_YOUTUBE_IMG_FILENAME = "youtube_thumbnail.png"
LOGO_POSITIONS = [
    "top-left",    "top-center",    "top-right",
    "center-left", "center-center", "center-right",
    "bottom-left", "bottom-center", "bottom-right"
]
PROCESSED_ARTWORK_FILENAME = "ProcessedArtwork.png"
PROCESSED_OUTRO_FILENAME = "outro.png"

FRONT_PROCESSED_CARDS_DIR = f"{FRONT_PROCESSED}processed-{AvailableCacheElemType.CARDS}{SLASH}"
ASSETS_CARDS_DIR = f"{path_prefix}assets{SLASH}cards{SLASH}"
CARDS_OUTRO_FILEPATH = f"{ASSETS_CARDS_DIR}{PROCESSED_OUTRO_FILENAME}"
CARDS_BOTTOM_B_FILEPATH = f"{ASSETS_CARDS_DIR}bottom_black.png"
CARDS_BOTTOM_W_FILEPATH = f"{ASSETS_CARDS_DIR}bottom_white.png"