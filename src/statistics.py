from dataclasses import dataclass
from typing import Optional

import src.constants as const
from src.logger import log
from src.typing import JsonDict

############# CLASS #############

@dataclass(slots=True, kw_only=True)
class Stats:
    """ Dataclass to store statistics about the application.

    Attributes:
        date_first_operation: [string?] The date of the first operation. (default: None)
        date_last_operation: [string?] The date of the last operation. (default: None)
        artwork_generations: [int?] The number of artwork generations. (default: None)
        lyrics_fetches: [int?] The number of lyrics fetches. (default: None)
    """

    date_first_operation: Optional[str] = None
    date_last_operation: Optional[str] = None
    artwork_generations: Optional[int] = None
    lyrics_fetches: Optional[int] = None

    def dict(self) -> JsonDict:
        """ Returns the dataclass as a dictionary.
        :return: [dict] The dataclass as a dictionary.
        """
        return {
            "dateFirstOperation": self.date_first_operation,
            "dateLastOperation": self.date_last_operation,
            "artworkGenerations": self.artwork_generations,
            "lyricsFetches": self.lyrics_fetches,
        }

    def __repr__(self) -> str:
        """ Returns the Stats dataclass as a string.
        :return: [string] The dataclass' content, as a string.
        """
        stats_dict = self.dict()
        stats_dict = {k: v for k, v in stats_dict.items() if v is not None} # remove None values

        dict_size = len(stats_dict) - 1
        sep = ", "
        nth = 0

        representation: str = "{"
        for (key, value) in stats_dict.items():
            representation += \
                f"'{key}': {value}" + (sep if nth < dict_size else "")
            nth += 1
        representation += "}"

        return representation

############ METHODS ############

from json import loads, dumps, JSONDecodeError

from src.soft_utils import getNowEpoch

def getJsonStatsFromFile(path: str = const.STATS_FILE_PATH, init: bool = False) -> JsonDict:
    f""" Returns the statistics contained in a JSON statistics file.
    :param path: [string] The path to the statistics file. (default: {const.STATS_FILE_PATH})
    :param init: [bool] Whether to initialize the statistics file if it doesn't exist. (default: False)
    :return: [dict] The statistics from the statistics file.
    """
    log.debug(f"Getting stats from file: {path}...")
    try:
        if not path.endswith(".json"):
            raise ValueError("The stats file must be a JSON file.")
        with open(path, "r") as file:
            log.debug(f"  Stats file ({path}) found.")
            return loads(file.read()) # <- read stats from stats file
    except FileNotFoundError:
        log.warn(f"No stats file ({path}). Initializing new stats file...")
        return initStats(from_error=init)
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path}). Initializing new stats file...")
        return initStats(from_error=True)

def updateStats(path: str = const.STATS_FILE_PATH, to_increment: Optional[str] = None) -> None:
    f""" Updates the statistics contained in a JSON statistics file.
    :param path: [string] The path to the statistics file. (default: {const.STATS_FILE_PATH})
    :param to_increment: [string?] The statistic to increment. (default: None)
    """
    json_stats: JsonDict = getJsonStatsFromFile(path)

    new_stats: JsonDict = {}
    new_stats[const.AvailableStats.dateFirstOperation.value] = \
        json_stats.get(const.AvailableStats.dateFirstOperation.value, getNowEpoch())
    new_stats[const.AvailableStats.dateLastOperation.value] = \
        getNowEpoch()
    new_stats[const.AvailableStats.artworkGenerations.value] = \
        int(json_stats.get(const.AvailableStats.artworkGenerations.value, 0))
    new_stats[const.AvailableStats.lyricsFetches.value] = \
        int(json_stats.get(const.AvailableStats.lyricsFetches.value, 0))

    if to_increment in const.INCREMENTABLE_STATS:
        new_stats[to_increment] += 1

    try:
        with open(path, "w") as file:
            file.write(dumps(new_stats)) # <- write new stats to stats file
    except FileNotFoundError:
        log.warn(f"Error when writing to stats file ({path}). Initializing new stats file...")
        initStats()
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path})")

    log.info(f"Stats updated: {new_stats}")

def initStats(from_error: bool = False) -> JsonDict:
    """ Initializes the statistics contained in a JSON statistics file.
    :param from_error: [bool] Whether the initialization is due to an error. (default: False)
    :return: [dict] The statistics from the statistics file.
    """
    log.debug("Initializing statistics...")
    stats: JsonDict = {}
    if from_error:
        stats[const.AvailableStats.dateFirstOperation.value] = "N/A"

    with open(const.STATS_FILE_PATH, "w") as file:
        log.debug(f"  Stats file created @ {const.STATS_FILE_PATH}")
        file.write(dumps(stats))

    log.info("Statistics initialization complete.")
    return loads(str(stats).replace("'", '"'))

def onLaunch() -> None:
    """ Initializes the project with the statistics from the statistics file.
    """
    log.debug("Initializing project with statistics...")
    log.debug(f"  Getting stats from file: {const.STATS_FILE_PATH}...")
    json_stats: JsonDict = getJsonStatsFromFile(const.STATS_FILE_PATH)

    log.debug("  Creating Stats object with values from file...")
    stats = Stats(
        date_first_operation=json_stats.get(const.AvailableStats.dateFirstOperation.value),
        date_last_operation=json_stats.get(const.AvailableStats.dateLastOperation.value),
        artwork_generations=json_stats.get(const.AvailableStats.artworkGenerations.value),
        lyrics_fetches=json_stats.get(const.AvailableStats.lyricsFetches.value),
    )

    log.info(f"Initializing project with statistics: {stats}")