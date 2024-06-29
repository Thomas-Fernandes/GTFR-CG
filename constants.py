from enum import Enum
from os import name as osName
from time import time

############# ENUMS #############

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

########### ANY TYPES ###########

DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"
STATS_FILE_PATH = 'stats.json'
DEFAULT_EXPIRATION = 2 # in days (integer)

SLASH = '/' if (osName != 'nt') else '\\'
UPLOADS_FOLDER = 'uploads' + SLASH
PROCESSED_FOLDER = 'processed' + SLASH
PROCESSED_ARTWORK_FILENAME = 'ProcessedArtwork.png'
THUMBNAIL_FILENAME = 'minia.png'
THUMBNAIL_FOLDER = 'assets/thumbnails' + SLASH

LOGO_POSITIONS = [
    'top-left',    'top-center',    'top-right',
    'center-left', 'center-center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
]

############ METHODS ############

def getDefaultExpirationTime() -> int:
    return int(time() - DEFAULT_EXPIRATION * TimeInSeconds.DAY.value)
