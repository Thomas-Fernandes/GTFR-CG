from dataclasses import dataclass
from time import time
from typing import Optional

import src.constants as const
from src.logger import log, LogSeverity
from src.typing_gtfr import JsonDict

############# CLASS #############

@dataclass(slots=True, kw_only=True)
class Stats:
    """ Dataclass to store statistics about the application.

    Attributes:
        date_first_operation: [string?] The date of the first operation. (default: None)
        date_last_operation: [string?] The date of the last operation. (default: None)
        artwork_generations: [int?] The number of artwork generations. (default: None)
        lyrics_fetches: [int?] The number of lyrics fetches. (default: None)
        cards_generations: [int?] The number of cards generations. (default: None)
    """

    date_first_operation: Optional[str] = None
    date_last_operation: Optional[str] = None
    artwork_generations: Optional[int] = None
    lyrics_fetches: Optional[int] = None
    cards_generations: Optional[int] = None

    def dict(self) -> JsonDict:
        """ Returns the dataclass as a dictionary.
        :return: [dict] The dataclass as a dictionary.
        """
        return {
            const.AvailableStats.dateFirstOperation.value: self.date_first_operation,
            const.AvailableStats.dateLastOperation.value: self.date_last_operation,
            const.AvailableStats.artworkGenerations.value: self.artwork_generations,
            const.AvailableStats.lyricsFetches.value: self.lyrics_fetches,
            const.AvailableStats.cardsGenerated.value: self.cards_generations,
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

from src.utils.soft_utils import getNowEpoch

def getJsonStatsFromFile(path: str = const.STATS_FILE_PATH) -> JsonDict:
    f""" Returns the statistics contained in a JSON statistics file.
    :param path: [string] The path to the statistics file. (default: {const.STATS_FILE_PATH})
    :return: [dict] The statistics from the statistics file.
    """
    log.debug(f"Getting stats from file: {path}...")
    try:
        if not path.endswith(".json"):
            raise ValueError("The stats file must be a JSON file.")
        with open(path, "r") as file:
            log.debug(f"Loaded stats from file {path}.")
            return loads(file.read()) # <- read stats from stats file
    except FileNotFoundError:
        log.warn(f"No stats file ({path}). Initializing new stats file...")
        return initStats()
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path}). Initializing new stats file...")
        return initStats()

def updateStats(path: str = const.STATS_FILE_PATH, to_increment: Optional[str] = None, increment: int = 1) -> None:
    f""" Updates the statistics contained in a JSON statistics file.
    :param path: [string] The path to the statistics file. (default: {const.STATS_FILE_PATH})
    :param to_increment: [string?] The statistic to increment. (default: None)
    """
    json_stats: JsonDict = getJsonStatsFromFile(path)

    log.debug(f"Updating stats from file: {path}...")
    new_stats: JsonDict = {}
    new_stats[const.AvailableStats.dateFirstOperation.value] = \
        json_stats.get(const.AvailableStats.dateFirstOperation.value, getNowEpoch())
    new_stats[const.AvailableStats.dateLastOperation.value] = \
        getNowEpoch()
    new_stats[const.AvailableStats.artworkGenerations.value] = \
        int(json_stats.get(const.AvailableStats.artworkGenerations.value, 0))
    new_stats[const.AvailableStats.lyricsFetches.value] = \
        int(json_stats.get(const.AvailableStats.lyricsFetches.value, 0))
    new_stats[const.AvailableStats.cardsGenerated.value] = \
        int(json_stats.get(const.AvailableStats.cardsGenerated.value, 0))

    if to_increment in const.INCREMENTABLE_STATS:
        new_stats[to_increment] += increment
    else:
        log.warn(f"Invalid statistic to increment: {to_increment}")

    try:
        with open(path, "w") as file:
            log.debug(f"  Writing stats to file: {path}...")
            file.write(dumps(new_stats))
    except FileNotFoundError:
        log.warn(f"Error when writing to stats file ({path}). Initializing new stats file...")
        initStats()
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path})")

    log.info(f"Stats updated: {new_stats}")

def initStats() -> JsonDict:
    """ Initializes the statistics contained in a JSON statistics file.
    :return: [dict] The statistics from the statistics file.
    """
    log.debug("Initializing statistics...")
    start = time()
    stats: JsonDict = {}
    for stat in const.AvailableStats:
        stats.setdefault(stat.value, const.EMPTY_STATS[stat.value])

    with open(const.STATS_FILE_PATH, "w") as file:
        log.debug(f"  Stats file created @ {const.STATS_FILE_PATH}")
        file.write(dumps(stats))

    log.info("Statistics initialization complete.").time(LogSeverity.INFO, time() - start)
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
        cards_generations=json_stats.get(const.AvailableStats.cardsGenerated.value),
    )
    log.info(f"Initializing project with statistics: {stats}")