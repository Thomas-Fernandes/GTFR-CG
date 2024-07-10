from dataclasses import dataclass
from typing import Optional

from src.logger import log
from src.typing import JsonDict

import src.constants as constants

############# CLASS #############

@dataclass(slots=True, kw_only=True)
class Stats:
    date_first_operation: Optional[str] = None
    date_last_operation: Optional[str] = None
    artwork_generations: Optional[int] = None
    lyrics_fetches: Optional[int] = None

    def dict(self) -> JsonDict:
        return {
            "dateFirstOperation": self.date_first_operation,
            "dateLastOperation": self.date_last_operation,
            "artworkGenerations": self.artwork_generations,
            "lyricsFetches": self.lyrics_fetches,
        }

    def __repr__(self) -> str:
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

def getJsonStatsFromFile(path: str = constants.STATS_FILE_PATH, init: bool = False) -> JsonDict:
    try:
        with open(path, "r") as file:
            return loads(file.read()) # <- read stats from stats file
    except FileNotFoundError:
        log.warn(f"No stats file ({path}). Initializing new stats file...")
        return initStats(from_error=init)
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path}). Initializing new stats file...")
        return initStats(from_error=True)

def updateStats(path: str = constants.STATS_FILE_PATH, to_increment: Optional[str] = None) -> None:
    json_stats: JsonDict = getJsonStatsFromFile(path)

    new_stats: JsonDict = {}
    new_stats["dateFirstOperation"] = json_stats.get("dateFirstOperation", getNowEpoch())
    new_stats["dateLastOperation"] = getNowEpoch()
    new_stats["artworkGenerations"] = int(json_stats.get("artworkGenerations", 0))
    new_stats["lyricsFetches"] = int(json_stats.get("lyricsFetches", 0))

    incrementable_stats: list[str] = ["artworkGenerations", "lyricsFetches"]
    if to_increment in incrementable_stats:
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
    stats: JsonDict = {}
    if from_error:
        stats["dateFirstOperation"] = "N/A"

    with open(constants.STATS_FILE_PATH, "w") as file:
        file.write(dumps(stats))

    log.info("Statistics initialization complete.")
    return loads(str(stats).replace("'", '"'))

def onLaunch() -> None:
    json_stats: JsonDict = getJsonStatsFromFile(constants.STATS_FILE_PATH)

    stats = Stats(
        date_first_operation=json_stats.get("dateFirstOperation"),
        date_last_operation=json_stats.get("dateLastOperation"),
        artwork_generations=json_stats.get("artworkGenerations"),
        lyrics_fetches=json_stats.get("lyricsFetches"),
    )

    log.info(f"Initializing project with statistics: {stats}")