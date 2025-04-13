from flask import Config

from os import listdir, path, remove, removedirs
from sys import exit

from src.constants.enums import AvailableCacheElemType
from src.constants.paths import PROCESSED_DIR, SLASH
from src.logger import log
from src.typing_gtfr import CachedElemType
from src.utils.time_utils import getExpirationTimestamp


def isFileExpired(filepath: str, filetype: CachedElemType, session: Config) -> bool:
    try:
        return path.isfile(filepath) and int(path.getmtime(filepath)) < getExpirationTimestamp(filetype, session)
    except Exception as e:
        log.error(f"Error while checking file expiration: {e}")
        exit(1)


def cacheCleanup(session: Config) -> None:
    """Cleans up the cache by removing expired entries"""
    nb_eliminated_entries: int = 0

    log.debug("Cleaning up cache...")

    def removeExpiredCache(folder: str, cache_type: CachedElemType, session: Config) -> int:
        """Removes expired cache contents
        :param folder: [string] The folder whose content is to clean if expired
        :return: [integer] The number of entries removed
        """
        nb_eliminated_entries: int = 0
        if not path.isdir(folder):
            return 0

        directory_paths: list[str] = [path.join(folder, f) for f in listdir(folder)]
        for dir in directory_paths:
            cache_dir_path = dir + SLASH + ((cache_type + SLASH) if path.isdir(dir + SLASH + cache_type) else "")
            filepaths: list[str] = [path.join(cache_dir_path, f) for f in listdir(cache_dir_path)]
            for file in filepaths:
                if isFileExpired(file, cache_type, session):
                    remove(file)
                    nb_eliminated_entries += 1
            if len(listdir(dir)) == 0:
                removedirs(dir)
            if len(listdir(cache_dir_path)) == 0:
                removedirs(cache_dir_path)
        if nb_eliminated_entries != 0:
            pluralMarks = ["s", "were"] if nb_eliminated_entries != 1 else ["", "was"]
            log.info(
                f"  {nb_eliminated_entries} cached file{pluralMarks[0]} {pluralMarks[1]} "
                f"removed in {folder + cache_type}."
            )
        return nb_eliminated_entries

    nb_eliminated_entries += removeExpiredCache(PROCESSED_DIR, AvailableCacheElemType.ARTWORKS, session)
    nb_eliminated_entries += removeExpiredCache(PROCESSED_DIR, AvailableCacheElemType.CARDS, session)

    if nb_eliminated_entries == 0:
        log.info("Cache still fresh. Loading...")
    else:
        log.info(f"Cache cleanup complete (-{nb_eliminated_entries} entries).")
