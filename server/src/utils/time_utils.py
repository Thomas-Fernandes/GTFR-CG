from flask import Config

from datetime import datetime
from time import time

import server.src.constants as const
from server.src.typing_gtfr import CachedElemType

def getNowStamp() -> str: # as YY-MM-DD_HH-MM-SS
    """ Returns the current time in stamp format.
    :return: [string] The current time in stamp format.
    """
    current_time = datetime.now()
    formatted_time = current_time.strftime(const.DATE_FORMAT_STAMP)
    return formatted_time

def getNowEpoch() -> str: # in MM-DD 24-hour format
    """ Returns the current time in epoch format.
    :return: [string] The current time in epoch format.
    """
    current_time = datetime.now()
    formatted_time = current_time.strftime(const.DATE_FORMAT_FULL)
    return formatted_time

def getExpirationTimestamp(filetype: CachedElemType, session: Config) -> int:
    """ Returns the default expiration timestamp for a given cached element type.
    :param elem: [CachedElemType] A type of cached elements.
    :return: [integer] The default expiration timestamp.
    """

    expiration_time: int = 0
    match filetype:
        case const.AvailableCacheElemType.sessions.value:
            expiration_time = const.TimeInSeconds.DAY.value
        case const.AvailableCacheElemType.artworks.value | const.AvailableCacheElemType.cards.value:
            if const.SessionFields.user_folder.value in session: # user is still logged in
                expiration_time = 2 * const.TimeInSeconds.HOUR.value
            else: # user has logged out
                expiration_time = 30 * const.TimeInSeconds.MINUTE.value
        case _:
            raise ValueError(f"Invalid cached element type: {filetype}")
    return int(time() - expiration_time)
