from dataclasses import dataclass
from typing import TypeAlias

from src.logger import Logger

import src.constants as constants

JsonDict: TypeAlias = dict[str, str | int]

log = Logger()

############# CLASS #############

@dataclass(slots=True, kw_only=True)
class Stats:
    date_first_generation: str | None
    date_last_generation: str | None
    total_generations: int

    def dict(self) -> JsonDict:
        return {
            'dateFirstGeneration': self.date_first_generation,
            'dateLastGeneration': self.date_last_generation,
            'totalGenerations': self.total_generations,
        }

    def __repr__(self) -> str:
        dict_size = len(self.dict()) - 1
        sep = ', '
        representation: str = "{"
        nth = 0
        for key, value in self.dict().items():
            if (value is not None):
                representation += \
                    f"'{key}': {value}" + (sep if nth < dict_size else "")
            nth += 1
        representation += "}"
        return representation

############ METHODS ############

from json import loads, dumps, JSONDecodeError

from src.soft_utils import getNowEpoch

def getJsonStatsFromFile(path: str, init: bool = False) -> JsonDict:
    try:
        with open(path, 'r') as file:
            return loads(file.read()) # <- read stats from stats file
    except FileNotFoundError:
        log.warn(f"No stats file ({path}). Initializing new stats file...")
        return initStats(from_error=init)
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path}). Initializing new stats file...")
        return initStats(from_error=True)

def updateStats(path: str = constants.STATS_FILE_PATH) -> None:
    json_stats: JsonDict = getJsonStatsFromFile(path)

    new_stats: JsonDict = {}
    new_stats['dateFirstGeneration'] = json_stats.get('dateFirstGeneration', getNowEpoch())
    new_stats['dateLastGeneration'] = getNowEpoch()
    new_stats['totalGenerations'] = int(json_stats.get('totalGenerations', 0)) + 1

    try:
        with open(path, 'w') as file:
            file.write(dumps(new_stats)) # <- write new stats to stats file
    except FileNotFoundError:
        log.warn(f"Error when writing to stats file ({path}). Initializing new stats file...")
        initStats()
    except JSONDecodeError:
        log.warn(f"Error decoding stats file ({path})")

    log.info(f"Stats updated: {new_stats}")

def initStats(from_error: bool = False) -> JsonDict:
    stats = { 'totalGenerations': 0 }
    if (from_error):
        stats['dateFirstGeneration'] = 'unknown'

    with open(constants.STATS_FILE_PATH, 'w') as file:
        file.write(dumps(stats))

    log.info("Statistics initialization complete.")
    return loads(str(stats).replace("'", '"'))

def onLaunch() -> None:
    json_stats = getJsonStatsFromFile(constants.STATS_FILE_PATH)

    stats = Stats(
        date_first_generation=json_stats.get('dateFirstGeneration'),
        date_last_generation=json_stats.get('dateLastGeneration'),
        total_generations=json_stats.get('totalGenerations', 0),
    )

    log.info(f"Initializing project with statistics: {stats}")