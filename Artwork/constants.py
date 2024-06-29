from enum import Enum
from os import name as osName

class HttpStatus(Enum):
    OK = 200
    BAD_REQUEST = 400
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500

class TimeInSeconds(Enum):
    WEEK   = 600_000
    DAY    = 86_400
    HOUR   = 3_600
    MINUTE = 60
    SECOND = 1

DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"
STATS_FILE_PATH = 'stats.json'
DEFAULT_EXPIRATION = 2 # in days (integer)

SLASH = '/' if (osName != 'nt') else '\\'
UPLOADS_FOLDER = 'uploads' + SLASH
PROCESSED_FOLDER = 'processed' + SLASH
PROCESSED_ARTWORK_FILENAME = 'ProcessedArtwork.png'
MINIA_FILENAME = 'minia.png'

LOGO_POSITIONS = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center-center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
]