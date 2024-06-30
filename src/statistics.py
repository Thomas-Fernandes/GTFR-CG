from dataclasses import dataclass
from typing import TypeAlias

from src.logger import Logger

import src.constants as constants

JsonDict: TypeAlias = dict[str, str | int]

log = Logger()

############ CLASSES ############

@dataclass(slots=True, kw_only=True)
class Stats:
    dateLastGeneration: str
    totalGenerations: int

    def dict(self) -> JsonDict:
        return { 'dateLastGeneration': self.dateLastGeneration, 'totalGenerations': self.totalGenerations }

    def __str__(self) -> str:
        return f"{{ 'dateLastGeneration': '{self.dateLastGeneration}', 'totalGenerations': {self.totalGenerations} }}"

class Statistics:
    def generateStats(self) -> None:
        try:
            with open(self.__stats_file_path, 'w') as file:
                file.write('{"dateLastGeneration": "' + getNowEpoch() + '"}')
        except FileNotFoundError:
            log.warn(f"Error when writing to stats file. ({self.__stats_file_path})")

    def getStats(self) -> Stats:
        return self.__stats
    def getStatsFilePath(self) -> str:
        return self.__stats_file_path

    def __init__(self) -> None:
        self.__stats_file_path: str = constants.STATS_FILE_PATH
        stats_from_file = getJsonStatsFromFile(self.__stats_file_path)
        self.__stats: Stats = Stats(
            dateLastGeneration=str(stats_from_file.get('dateLastGeneration', getNowEpoch())),
            totalGenerations=int(stats_from_file.get('totalGenerations', 0))
        )
        log.info(f"Initializing project with statistics: {self.__stats}")

############ METHODS ############

from json import loads, dumps, JSONDecodeError

from src.soft_utils import getNowEpoch

def getJsonStatsFromFile(path: str) -> JsonDict:
    try:
        with open(path, 'r') as file:
            return loads(file.read()) # <- read stats from stats file
    except FileNotFoundError:
        log.warn(f"No stats file. ({path})")
        return {}
    except JSONDecodeError:
        log.warn(f"Error decoding stats file. ({path})")
        return {}

def updateStats(path: str = constants.STATS_FILE_PATH) -> None:
    jsonStatsFromFile: JsonDict = getJsonStatsFromFile(path)

    stats: JsonDict = {}
    stats['dateLastGeneration'] = getNowEpoch()
    stats['totalGenerations'] = int(jsonStatsFromFile.get('totalGenerations', 0)) + 1

    try:
        with open(path, 'w') as file:
            file.write(dumps(stats)) # <- write new stats to stats file
    except FileNotFoundError:
        log.warn(f"Error when writing to stats file. ({path})")
    log.info(f"Stats updated: {stats}")
