from time import time
from datetime import datetime

import src.constants as constants

def getNowEpoch() -> str: # in MM-DD 24-hour format
    current_time = datetime.now()
    new_time = current_time
    formatted_time = new_time.strftime(constants.DATE_FORMAT_FULL)
    return formatted_time

def getDefaultExpirationTimestamp() -> int:
    return int(time() - constants.DEFAULT_EXPIRATION * constants.TimeInSeconds.DAY.value)
