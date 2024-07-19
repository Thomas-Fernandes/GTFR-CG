from flask import Config

from time import time
from datetime import datetime

import src.constants as const
from src.typing import CachedElemType

def getNowEpoch() -> str: # in MM-DD 24-hour format
    current_time = datetime.now()
    formatted_time = current_time.strftime(const.DATE_FORMAT_FULL)
    return formatted_time

# cards and images: 1 to 2 hours if the user is still logged in
#   (maybe send a toast to remind him to download the generated files)
# 20 to 30 minutes after the user logs out
def getExpirationTimestamp(filetype: CachedElemType, session: Config) -> int:
    """ Returns the default expiration timestamp for a given cached element type.
    :param elem: [CachedElemType] A type of cached elements.
    :return: [integer] The default expiration timestamp.
    """

    expiration_time: int = 0
    match filetype:
        case "sessions":
            expiration_time = const.TimeInSeconds.DAY.value
        case "images" | "cards":
            if const.SessionFields.user_folder.value in session: # user is still logged in
                expiration_time = 2 * const.TimeInSeconds.HOUR.value
            else: # user has logged out
                expiration_time = 30 * const.TimeInSeconds.MINUTE.value
        case _:
            raise ValueError(f"Invalid cached element type: {filetype}")
    return int(time() - expiration_time)
