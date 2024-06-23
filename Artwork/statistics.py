from time import gmtime, strftime
from json import loads, dumps, JSONDecodeError

STATS_FILE_PATH = 'stats.json'
DATE_FORMAT_FULL = "%Y-%m-%d %H:%M:%S"

def updateStats(path: str = STATS_FILE_PATH) -> None:
    stats = get_stats(path)

    stats['dateLastGeneration'] = strftime(DATE_FORMAT_FULL, gmtime())
    stats['totalGenerated'] = stats.get('totalGenerated', 0) + 1

    with open(path, 'w') as file:
        file.write(dumps(stats))

def get_stats(path: str) -> dict[str, str | int]:
    try:
        with open(path, 'r') as file:
            return loads(file.read())
    except FileNotFoundError:
        return {}
    except JSONDecodeError:
        return {}

ONE_WEEK = 600_000
ONE_DAY = 86_400
ONE_HOUR = 3_600

class Statistics:
    def isCacheExpired(self) -> bool:
        if ('dateLastGeneration' not in self.stats):
            self.generateStats()
            return False # no cache, so not expired

        cache_date = {
            "year": int(self.stats['dateLastGeneration'][:4]),
            "month": int(self.stats['dateLastGeneration'][5:7]),
            "day": int(self.stats['dateLastGeneration'][8:10])
        }
        now = strftime(DATE_FORMAT_FULL, gmtime())
        now = now[:11] + str(int(now[11:13]) + 2) + now[13:] # add two hours because Paris is GMT+2
        now_date = {
            "year": int(now[:4]),
            "month": int(now[5:7]),
            "day": int(now[8:10])
        }
        if (cache_date['year'] != now_date['year'] and \
            cache_date['month'] != now_date['month'] and \
            cache_date['day'] + 1 < now_date['day'] \
        ): return True # cache is sure to be older than one day-time: expired

        def get_timestamp(date: str) -> int:
            return int(date[17:]) + int(date[14:16]) * 60 + int(date[11:13]) * 3_600

        cache_time: int = get_timestamp(self.stats['dateLastGeneration'])
        now_time:   int = get_timestamp(now)
        # cache expired if dateLastGeneration is older than one day-time
        return now_date['day'] > cache_date['day'] and now_time > cache_time

    def generateStats(self) -> None:
        with open(self.stats_file_path, 'w') as file:
            now = strftime(DATE_FORMAT_FULL, gmtime())
            now = now[:11] + str(int(now[11:13]) + 2) + now[13:] # add two hours because Paris is GMT+2
            file.write('{ "dateLastGeneration": "' + now + '" }')

    def __init__(self) -> None:
        self.stats_file_path = STATS_FILE_PATH
        self.stats = get_stats(self.stats_file_path)