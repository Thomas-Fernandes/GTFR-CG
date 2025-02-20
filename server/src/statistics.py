from dataclasses import dataclass
from time import time
from typing import Optional

from src.constants.enums import AvailableStats
from src.constants.paths import STATS_FILE_PATH
from src.constants.responses import Error
from src.constants.statistics import EMPTY_STATS, INCREMENTABLE_STATS
from src.logger import log, SeverityLevel
from src.typing_gtfr import JsonDict

############# CLASS #############


@dataclass(slots=True, kw_only=True)
class Stats:
    """Dataclass to store statistics about the application

    Attributes:
        date_first_operation: [string?] The date of the first operation (default: None)
        date_last_operation: [string?] The date of the last operation (default: None)
        artwork_generations: [int?] The number of artwork generations (default: None)
        lyrics_fetches: [int?] The number of lyrics fetches (default: None)
        cards_generations: [int?] The number of cards generations (default: None)
    """

    date_first_operation: Optional[str] = None
    date_last_operation: Optional[str] = None
    artwork_generations: Optional[int] = None
    lyrics_fetches: Optional[int] = None
    cards_generations: Optional[int] = None

    def dict(self) -> JsonDict:
        """Returns the dataclass as a dictionary
        :return: [dict] The dataclass as a dictionary
        """
        return {
            AvailableStats.DATE_FIRST_OPERATION: self.date_first_operation,
            AvailableStats.DATE_LAST_OPERATION: self.date_last_operation,
            AvailableStats.ARTWORK_GENERATIONS: self.artwork_generations,
            AvailableStats.LYRICS_FETCHES: self.lyrics_fetches,
            AvailableStats.CARDS_GENERATED: self.cards_generations,
        }

    def __repr__(self) -> str:
        """Returns the Stats dataclass as a string
        :return: [string] The dataclass' content, as a string
        """
        stats_dict = self.dict()
        stats_dict = {k: v for (k, v) in stats_dict.items() if v is not None}  # remove None values

        dict_size = len(stats_dict) - 1
        sep = ", "
        nth = 0

        representation: str = "{"
        for key, value in stats_dict.items():
            representation += f"'{key}': {value}" + (sep if nth < dict_size else "")
            nth += 1
        representation += "}"

        return representation


############ METHODS ############

from json import loads, dumps, JSONDecodeError

from src.utils.time_utils import getNowEpoch


def getJsonStatsFromFile(path: str = STATS_FILE_PATH) -> JsonDict:
    f"""Returns the statistics contained in a JSON statistics file
    :param path: [string] The path to the statistics file (default: {STATS_FILE_PATH})
    :return: [dict] The statistics from the statistics file
    """
    log.debug(f"  Getting stats from file: {path}...")
    try:
        if not path.endswith(".json"):
            raise ValueError(Error.STATS_FILETYPE)
        with open(path, "r") as file:
            log.debug(f"Loaded stats from file {path}.")
            return loads(file.read())
    except FileNotFoundError:
        log.warn(f"No stats file ({path}). Initializing new stats file...")
        return initStats()
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path}). Initializing new stats file...")
        return initStats()


def updateStats(
    *, path: str = STATS_FILE_PATH, to_increment: Optional[AvailableStats] = None, increment: int = 1
) -> None:
    f"""Updates the statistics contained in a JSON statistics file
    :param path: [string] The path to the statistics file (default: {STATS_FILE_PATH})
    :param to_increment: [string?] The statistic to increment (default: None)
    """
    json_stats: JsonDict = getJsonStatsFromFile(path)

    log.debug(f"Updating stats from file: {path}...")
    new_stats: JsonDict = {
        AvailableStats.DATE_FIRST_OPERATION: json_stats.get(AvailableStats.DATE_FIRST_OPERATION, getNowEpoch()),
        AvailableStats.DATE_LAST_OPERATION: getNowEpoch(),
        AvailableStats.ARTWORK_GENERATIONS: int(json_stats.get(AvailableStats.ARTWORK_GENERATIONS, 0)),
        AvailableStats.LYRICS_FETCHES: int(json_stats.get(AvailableStats.LYRICS_FETCHES, 0)),
        AvailableStats.CARDS_GENERATED: int(json_stats.get(AvailableStats.CARDS_GENERATED, 0)),
    }

    if new_stats[AvailableStats.DATE_FIRST_OPERATION] == EMPTY_STATS[AvailableStats.DATE_FIRST_OPERATION]:
        new_stats[AvailableStats.DATE_FIRST_OPERATION] = getNowEpoch()

    if to_increment in INCREMENTABLE_STATS:
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
    """Initializes the statistics contained in a JSON statistics file
    :return: [dict] The statistics from the statistics file
    """
    log.debug("Initializing statistics...")
    start = time()
    stats: JsonDict = {}
    for stat in AvailableStats:
        stats.setdefault(stat, EMPTY_STATS[stat])

    with open(STATS_FILE_PATH, "w") as file:
        log.debug(f"  Stats file created @ {STATS_FILE_PATH}")
        file.write(dumps(stats))

    log.info("Statistics initialization complete.").time(SeverityLevel.INFO, time() - start)
    return getJsonStatsFromFile(STATS_FILE_PATH)


def onLaunch() -> None:
    """Initializes the project with the statistics from the statistics file"""
    log.debug("Loading project statistics...")
    json_stats: JsonDict = getJsonStatsFromFile(STATS_FILE_PATH)

    log.debug("  Creating Stats object with values from file...")
    stats = Stats(
        date_first_operation=json_stats.get(AvailableStats.DATE_FIRST_OPERATION),
        date_last_operation=json_stats.get(AvailableStats.DATE_LAST_OPERATION),
        artwork_generations=json_stats.get(AvailableStats.ARTWORK_GENERATIONS),
        lyrics_fetches=json_stats.get(AvailableStats.LYRICS_FETCHES),
        cards_generations=json_stats.get(AvailableStats.CARDS_GENERATED),
    )
    log.info(f"Initializing project with statistics: {stats}")
