# Installed libraries
from flask import Flask
from flask_session import Session
from waitress import serve

# Python standard libraries
from os import path, makedirs, remove, listdir
from shutil import rmtree

# Local modules
import src.constants as const
from src.logger import log
from src.soft_utils import getDefaultExpirationTimestamp
from src.statistics import onLaunch as printInitStatistics

# Application initialization
global app
app = Flask(__name__.split('.')[-1]) # so that the app name is app, not {dirpath}.app
def initApp() -> None:
    """ Initializes the Flask app: declares config and session, assigns blueprints.
    """
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = const.SESSION_DIR

    def initBlueprints() -> None:
        from src.routes.artwork_generation import bp_artwork_generation
        from src.routes.processed_images import bp_processed_images
        from src.routes.home import bp_home
        from src.routes.lyrics import bp_lyrics
        blueprints = [
            bp_artwork_generation,
            bp_processed_images,
            bp_home,
            bp_lyrics
        ]
        for blueprint in blueprints:
            app.register_blueprint(blueprint)
    initBlueprints()
    Session(app)

def main(host: str = const.HOST_HOME, port: int = const.DEFAULT_PORT) -> None:
    f""" Main function to clean the cache, initialize the server and start it.
    :param host: [string] The host address to run the server on. (default: "{const.HOST_HOME}")
    :param port: [integer] The port to run the server on. (default: {const.DEFAULT_PORT})
    """
    host_display_name = "localhost" if host == const.HOST_HOME else host
    log.log(f"Starting server @ http://{host_display_name}:{port}")

    processed_folder = const.PROCESSED_DIR
    makedirs(processed_folder, exist_ok=True)

    @DeprecationWarning # cache cleanup process is to be redefined
    def removeExpiredContent(folder: str) -> int:
        """ Removes entries in the given folder that are older than the default expiration time.
        :param folder: [string] The folder to remove expired entries from.
        :return: [integer] The number of entries removed.
        """
        eliminated_entries_count: int = 0
        filepaths: list[str] = [path.join(folder, f) for f in listdir(folder)]

        def isFileExpired(file: str) -> bool:
            return path.isfile(file) and int(path.getmtime(file)) < getDefaultExpirationTimestamp()

        for file in filepaths:
            if isFileExpired(file):
                remove(file)
                eliminated_entries_count += 1
        if listdir(folder) == []: # if folder is empty, remove it
            rmtree(folder)
        if eliminated_entries_count != 0:
            pluralMarks = ["s", "were"] if eliminated_entries_count != 1 else ["", "was"]
            log.info(f"{eliminated_entries_count} cached file{pluralMarks[0]} {pluralMarks[1]} " \
                f"removed in {folder.split(const.SLASH)[0]}.")
        return eliminated_entries_count

    def cacheCleanup() -> None:
        """ Cleans up the cache by removing expired entries.
        """
        to_clean: list[str] = ["DIRECTORY_NAME"] # used as a placeholder
        eliminated_entries_count: int = 0

        for folder in to_clean:
            folder_path = path.join(folder + const.SLASH)
            if not path.isdir(folder_path):
                continue
            session_dirname_list = listdir(folder_path)
            for sdn in session_dirname_list:
                eliminated_entries_count += removeExpiredContent(folder_path + sdn)
        if eliminated_entries_count == 0:
            log.info("Cache still fresh!")
        else:
            log.info(f"Cache cleanup complete (-{eliminated_entries_count}).")

    printInitStatistics()
    cacheCleanup()
    initApp()
    serve(app, host=host, port=port, threads=8)
