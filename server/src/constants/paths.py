from os import environ as env, name as osName, path

from src.constants.enums import AvailableCacheElemType
from src.typing_gtfr import Route, Routes

HOST_HOME = "0.0.0.0"
DEFAULT_PORT = 8000

API_ROUTE = "/api"
ROUTES = Routes(
    root=Route(
        path="/",
    ),
    redirect=Route(
        path="/redirect",
        bp_name="redirect",
    ),
    home=Route(
        path="/home",
        bp_name="home",
    ),
    art_gen=Route(
        path="/artwork-generation",
        bp_name="artwork-generation",
    ),
    art_proc=Route(
        path="/artwork-processing",
        bp_name="artwork-processing",
    ),
    lyrics=Route(
        path="/lyrics",
        bp_name="lyrics",
    ),
    cards_gen=Route(
        path="/cards-generation",
        bp_name="cards-generation",
    ),
)

SLASH = '/' if (osName != 'nt') else '\\'
path_prefix = "" if path.isfile("requirements.txt") else f"server{SLASH}"  # for running from installer.py
SESSION_TYPE = "filesystem"
SESSION_FILE_DIR = f"flask_session{SLASH}"

run_from_docker = env.get("RUN_FROM_DOCKER", "False") == "True"
PROCESSED_DIR = f"processed{SLASH}"
GENERATED_CONTENT_DIR = f"{SLASH}app{SLASH}generated_files{SLASH}" if run_from_docker else f".{SLASH}"
STATS_FILE_PATH = f"{GENERATED_CONTENT_DIR}stats.json"
GENERATED_ARTWORKS_DIR = f"{GENERATED_CONTENT_DIR}processed-{AvailableCacheElemType.ARTWORKS}{SLASH}"
GENERATED_CARDS_DIR = f"{GENERATED_CONTENT_DIR}processed-{AvailableCacheElemType.CARDS}{SLASH}"

ASSETS_THUMBNAILS_DIR = f"{path_prefix}assets{SLASH}thumbnails{SLASH}"
UPLOADED_ITUNES_IMG_FILENAME = "itunes_image.png"
UPLOADED_FILE_IMG_FILENAME = "uploaded_image.png"
UPLOADED_YOUTUBE_IMG_FILENAME = "youtube_thumbnail.png"
LOGO_POSITIONS = [
    "top-left",
    "top-center",
    "top-right",
    "center-left",
    "center-center",
    "center-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
]
PROCESSED_ARTWORK_FILENAME = "ProcessedArtwork.png"
PROCESSED_OUTRO_FILENAME = "outro.png"

ASSETS_CARDS_DIR = f"{path_prefix}assets{SLASH}cards{SLASH}"
CARDS_OUTRO_FILEPATH = f"{ASSETS_CARDS_DIR}{PROCESSED_OUTRO_FILENAME}"
CARDS_BOTTOM_B_FILEPATH = f"{ASSETS_CARDS_DIR}bottom_black.png"
CARDS_BOTTOM_W_FILEPATH = f"{ASSETS_CARDS_DIR}bottom_white.png"
