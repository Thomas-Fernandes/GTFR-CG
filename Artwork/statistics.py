from dataclasses import dataclass
from typing import Optional, TypeAlias

import constants

JsonDict: TypeAlias = dict[str, str | int]

@dataclass(slots=True, kw_only=True)
class Stats:
    dateLastGeneration: str | None
    totalGenerated: int

    def dict(self) -> JsonDict:
        return { 'dateLastGeneration': self.dateLastGeneration, 'totalGenerated': self.totalGenerated }

    def __str__(self) -> str:
        return f"{{ 'dateLastGeneration': '{self.dateLastGeneration}', 'totalGenerated': {self.totalGenerated} }}"

from time import gmtime, strftime
from json import loads, dumps, JSONDecodeError

@dataclass(slots=True, kw_only=True)
class Epoch:
    year: int
    month: int
    day: int
    hour: Optional[int] = None
    minute: Optional[int] = None
    second: Optional[int] = None

class Statistics:
    def isCacheExpired(self, days_before_expiration: int = constants.DEFAULT_EXPIRATION) -> bool:
        statsDict = self.__stats.dict()
        if ('dateLastGeneration' not in statsDict or statsDict['dateLastGeneration'] == ''):
            self.generateStats()
            return False # no cache date, so not expired

        cache_date = Epoch(
            year=int(statsDict['dateLastGeneration'][:4]),
            month=int(statsDict['dateLastGeneration'][5:7]),
            day=int(statsDict['dateLastGeneration'][8:10])
        )
        now = getNowEpoch()
        now_date = Epoch(
            year=int(now[:4]),
            month=int(now[5:7]),
            day=int(now[8:10])
        )
        cache_day_is_before_today: bool = \
            cache_date.year <= now_date.year and \
            cache_date.month <= now_date.month and \
            cache_date.day <= now_date.day

        if (cache_day_is_before_today and \
            cache_date.day + days_before_expiration < now_date.day \
        ): return True # cache is sure to be older than expiration time: expired

        def get_timestamp(date: str) -> int:
            return int(date[17:])  * constants.TimeInSeconds.DAY.value \
                + int(date[14:16]) * constants.TimeInSeconds.MINUTE.value \
                + int(date[11:13]) * constants.TimeInSeconds.HOUR.value

        cache_time: int = get_timestamp(statsDict['dateLastGeneration'])
        now_time:   int = get_timestamp(now)

        return cache_day_is_before_today \
            and (cache_date.day + days_before_expiration - 1) < now_date.day \
            and cache_time < now_time

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
    stats = getJsonStatsFromFile(path)

    stats['dateLastGeneration'] = getNowEpoch()
    stats['totalGenerated'] = stats.get('totalGenerated', 0) + 1

    # nullifying deprecated fields
    stats['totalGenerations'] = None

    try:
        with open(path, 'w') as file:
            file.write(dumps(stats))
    except FileNotFoundError:
        print(f"Error writing stats file. ({path})")
    print(f"Stats updated:\n\t{stats}")