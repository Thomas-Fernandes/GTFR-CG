# Installed libraries
from flask import Flask
from flask_session import Session
from waitress import serve

# Python standard libraries
from os import listdir, makedirs, path, remove, removedirs
from sys import exit

# Local modules
import src.constants as const
from src.logger import log
from src.utils.soft_utils import getExpirationTimestamp
from src.statistics import onLaunch as printInitStatistics

# Application initialization
global app
app = Flask(__name__.split('.')[-1]) # so that the app name is app, not {dirpath}.app
def initApp() -> None:
    """ Initializes the Flask app: declares config and session, assigns blueprints.
    """
    log.debug("Initializing app...")
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = const.SESSION_DIR

    def initBlueprints() -> None:
        """ Initializes the blueprints for the app.
        """
        log.debug("  Initializing blueprints...")
        from src.routes.artwork_generation import bp_artwork_generation
        from src.routes.cards_generation import bp_cards_generation
        from src.routes.home import bp_home
        from src.routes.lyrics import bp_lyrics
        from src.routes.processed_images import bp_processed_images
        blueprints = [
            bp_artwork_generation,
            bp_cards_generation,
            bp_home,
            bp_lyrics,
            bp_processed_images,
        ]
        for blueprint in blueprints:
            app.register_blueprint(blueprint)
        log.debug("  Blueprints initialized.")
    initBlueprints()
    makedirs(const.FRONT_PROCESSED_IMAGES_DIR, exist_ok=True)
    makedirs(const.FRONT_PROCESSED_CARDS_DIR, exist_ok=True)
    Session(app)
    log.debug("App initialized.")

def main(host: str = const.HOST_HOME, port: int = const.DEFAULT_PORT) -> None:
    f""" Main function to clean the cache, initialize the server and start it.
    :param host: [string] The host address to run the server on. (default: "{const.HOST_HOME}")
    :param port: [integer] The port to run the server on. (default: {const.DEFAULT_PORT})
    """
    host_display_name = "localhost" if host == const.HOST_HOME else host
    log.log(f"Starting server @ http://{host_display_name}:{port}...")

    def removeExpiredCache(folder: str, cache_type: str) -> int:
        """ Removes expired cache contents.
        :param folder: [string] The folder whose content is to clean if expired.
        :return: [integer] The number of entries removed.
        """
        nb_eliminated_entries: int = 0
        if not path.isdir(folder):
            return 0

        def isFileExpired(filepath: str, filetype: str) -> bool:
            try:
                return path.isfile(filepath) and int(path.getmtime(filepath)) < getExpirationTimestamp(filetype, app.config)
            except Exception as e:
                log.error(f"Error while checking file expiration: {e}")
                exit(1)

        if cache_type == const.AvailableCacheElemType.sessions.value:
            filepaths: list[str] = [path.join(folder, f) for f in listdir(folder)]
            for file in filepaths:
                if isFileExpired(file, cache_type):
                    remove(file)
                    nb_eliminated_entries += 1
            if len(listdir(folder)) == 0:
                removedirs(folder)
        else:
            directory_paths: list[str] = [path.join(folder, f) for f in listdir(folder)]
            for dir in directory_paths:
                cache_dir_path = dir + const.SLASH + ((cache_type + const.SLASH) if path.isdir(dir + const.SLASH + cache_type) else "")
                filepaths: list[str] = [path.join(cache_dir_path, f) for f in listdir(cache_dir_path)]
                for file in filepaths:
                    if isFileExpired(file, cache_type):
                        remove(file)
                        nb_eliminated_entries += 1
                if len(listdir(dir)) == 0:
                    removedirs(dir)
                if len(listdir(cache_dir_path)) == 0:
                    removedirs(cache_dir_path)
        if nb_eliminated_entries != 0:
            pluralMarks = ["s", "were"] if nb_eliminated_entries != 1 else ["", "was"]
            log.info(f"  {nb_eliminated_entries} cached file{pluralMarks[0]} {pluralMarks[1]} " \
                f"removed in {folder + cache_type}.")
        return nb_eliminated_entries

    def cacheCleanup() -> None:
        """ Cleans up the cache by removing expired entries.
        """
        nb_eliminated_entries: int = 0

        log.debug("Cleaning up cache...")
        nb_eliminated_entries += removeExpiredCache(const.SESSION_DIR, const.AvailableCacheElemType.sessions.value)
        nb_eliminated_entries += removeExpiredCache(const.PROCESSED_DIR, const.AvailableCacheElemType.images.value)
        nb_eliminated_entries += removeExpiredCache(const.PROCESSED_DIR, const.AvailableCacheElemType.cards.value)

        if nb_eliminated_entries == 0:
            log.info("Cache still fresh. Loading...")
        else:
            log.log(f"Cache cleanup complete (-{nb_eliminated_entries} entries).")

    printInitStatistics()
    cacheCleanup()
    initApp()
    serve(app, host=host, port=port, threads=8)
