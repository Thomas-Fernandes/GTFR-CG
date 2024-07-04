# Installed libraries
from dotenv import load_dotenv

# Python standard libraries
from enum import Enum
from os import getenv, name as osName

load_dotenv()

############# ENUMS #############

class HttpStatus(Enum):
    OK = 200
    REDIRECT = 302
    BAD_REQUEST = 400
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(Enum):
    WEEK   = 600_000
    DAY    = 86_400
    HOUR   = 3_600
    MINUTE = 60
    SECOND = 1

######### REGULAR TYPES #########

# Server config
HOST_HOME = "0.0.0.0"
DEFAULT_PORT = 8000

# Statistics
DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"
STATS_FILE_PATH = 'stats.json'
DEFAULT_EXPIRATION = 2 # in days (integer)

# Paths
SLASH = '/' if (osName != 'nt') else '\\'
PROCESSED_DIR = 'processed' + SLASH
PROCESSED_ARTWORK_FILENAME = 'ProcessedArtwork.png'
THUMBNAIL_DIR = 'assets' + SLASH + 'thumbnails' + SLASH
THUMBNAIL_PREFIX = 'thumbnail_'
THUMBNAIL_EXT = '.png'

LOGO_POSITIONS = [
    'top-left',    'top-center',    'top-right',
    'center-left', 'center-center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
]

# Error messages
ERR_INVALID_FILE_TYPE = 'Invalid file type. Only PNG and JPG files are allowed.'
ERR_NO_FILE = 'Invalid file: No file selected.'
ERR_INVALID_SESSION = 'Session Expired or Invalid'

# Genius API
GENIUS_API_TOKEN = getenv('GENIUS_API_TOKEN')