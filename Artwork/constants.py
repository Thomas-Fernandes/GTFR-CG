from enum import Enum

class HttpStatus(Enum):
    OK = 200
    BAD_REQUEST = 400
    INTERNAL_SERVER_ERROR = 500
    NOT_FOUND = 404
