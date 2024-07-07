from time import time, gmtime, strftime

import src.constants as constants

def getNowEpoch() -> str: # in MM-DD 24-hour format
    now = strftime(constants.DATE_FORMAT_FULL, gmtime())
    hour = (int(now[11:13]) + 2) % 24 # adding two hours because Paris is GMT+2
    return now[:11] + ("0" if hour < 10 else "") + str(hour) + now[13:]

def getDefaultExpirationTimestamp() -> int:
    return int(time() - constants.DEFAULT_EXPIRATION * constants.TimeInSeconds.DAY.value)
