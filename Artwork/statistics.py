from dataclasses import dataclass
from typing import Optional, TypeAlias

import constants

JsonDict: TypeAlias = dict[str, str | int]

######################## CLASSES ########################

@dataclass(slots=True, kw_only=True)
class Stats:
    dateLastGeneration: str | None
    totalGenerated: int

    def dict(self) -> JsonDict:
        return { 'dateLastGeneration': self.dateLastGeneration, 'totalGenerated': self.totalGenerated }

    def __str__(self) -> str:
        return f"{{ 'dateLastGeneration': '{self.dateLastGeneration}', 'totalGenerated': {self.totalGenerated} }}"

class Statistics:
    def generateStats(self) -> None:
        try:
            with open(self.__stats_file_path, 'w') as file:
                now = getNowEpoch()
                file.write('{ "dateLastGeneration": "' + now + '" }')
        except FileNotFoundError:
            print(f"Error writing stats file. ({self.__stats_file_path})")

    def getStats(self) -> Stats:
        return self.__stats
    def getStatsFilePath(self) -> str:
        return self.__stats_file_path

    def __init__(self) -> None:
        self.__stats_file_path: str = constants.STATS_FILE_PATH
        stats_from_file = getJsonStatsFromFile(self.__stats_file_path)
        self.__stats: Stats = Stats(
            dateLastGeneration=stats_from_file.get('dateLastGeneration', ''),
            totalGenerated=stats_from_file.get('totalGenerated', 0)
        )
        print(f"Initializing project with statistics:\n\t{self.__stats}")

######################## METHODS ########################

from time import gmtime, strftime
from json import loads, dumps, JSONDecodeError

def getNowEpoch() -> str:
    result = strftime(constants.DATE_FORMAT_FULL, gmtime())
    return result[:11] + str(int(result[11:13]) + 2) + result[13:] # add two hours because Paris is GMT+2

def getJsonStatsFromFile(path: str) -> JsonDict:
    try:
        with open(path, 'r') as file:
            return loads(file.read())
    except FileNotFoundError:
        print(f"No stats file. ({path})")
        return {}
    except JSONDecodeError:
        print(f"Error decoding stats file. ({path})")
        return {}

def updateStats(path: str = constants.STATS_FILE_PATH) -> None:
    newTotalGenerated = getJsonStatsFromFile(path).get('totalGenerated', 0) + 1

    stats: JsonDict = {}
    stats['dateLastGeneration'] = getNowEpoch()
    stats['totalGenerated'] = newTotalGenerated

    try:
        with open(path, 'w') as file:
            file.write(dumps(stats))
    except FileNotFoundError:
        print(f"Error writing stats file. ({path})")
    print(f"Stats updated:\n\t{stats}")