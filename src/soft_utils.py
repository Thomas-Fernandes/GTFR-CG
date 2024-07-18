from time import time
from datetime import datetime

import src.constants as const
from src.logger import log

def getNowEpoch() -> str: # in MM-DD 24-hour format
    """ Returns the current time in epoch format.
    :return: [string] The current time in epoch format.
    """
    current_time = datetime.now()
    formatted_time = current_time.strftime(const.DATE_FORMAT_FULL)
    return formatted_time

def getDefaultExpirationTimestamp() -> int:
    """ Returns the default expiration timestamp.
    :return: [integer] The default expiration timestamp.
    """
    log.debug("Getting default expiration timestamp...")
    return int(time() - const.DEFAULT_EXPIRATION * const.TimeInSeconds.DAY.value)
