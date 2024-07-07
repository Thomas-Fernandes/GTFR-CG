# Installed libraries
from flask import Flask, render_template, request
from flask_session import Session
from waitress import serve

# Python standard libraries
from os import path, makedirs, remove, listdir
from shutil import rmtree

# Local modules
from src.functions import getLyrics
from src.logger import log
from src.soft_utils import getDefaultExpirationTimestamp, getPluralMarks
from src.statistics import onLaunch as printInitStatistics, JsonDict, getJsonStatsFromFile
import src.constants as constants

# Application initialization
global app
app = Flask(__name__.split('.')[-1]) # so that the app name is app, not {dirpath}.app
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = 'flask_session' + constants.SLASH

from src.artwork_generation import artwork_generation
from src.download import download
app.register_blueprint(artwork_generation)
app.register_blueprint(download)
Session(app)

@app.route('/lyrics', methods=['GET', 'POST'])
def lyrics() -> str:
    if (request.method != 'POST'):
        return render_template('lyrics.html', lyrics="")

    artist = request.form.get('artist', None)
    song = request.form.get('song', None)
    lyrics_text = request.form.get('lyrics')

    if (artist is not None and song is not None):
        lyrics_text = getLyrics(song, artist)

    return render_template('lyrics.html', lyrics=lyrics_text)

@app.route('/statistics')
def statistics() -> str:
    return render_template('statistics.html')

@app.route('/home')
def home() -> str:
    stats: JsonDict = getJsonStatsFromFile()
    plurals: dict[str, str] = getPluralMarks(stats)
    for key in constants.AVAILABLE_STATS:
        if (key not in stats):
            stats[key] = constants.EMPTY_STATS[key]
    return render_template('home.html', stats=stats, pluralMarks=plurals)

@app.errorhandler(404)
def page_not_found(_e: Exception) -> str:
    log.warn(f"Page not found: {request.url}. Redirecting to home page ({'/home'}).")
    return render_template('home.html', stats={}, pluralMarks={})

@app.route('/')
def root() -> str:
    return render_template('home.html', stats={}, pluralMarks={})

def main(host: str = constants.HOST_HOME, port: int = constants.DEFAULT_PORT) -> None:
    host_display_name = "localhost" if host == constants.HOST_HOME else host
    log.log(f"Starting server @ http://{host_display_name}:{port}")

    processed_folder = constants.PROCESSED_DIR
    makedirs(processed_folder, exist_ok=True)

    @DeprecationWarning # cache cleanup process is to be redefined
    def removeOldUploads(folder: str) -> int:
        eliminated_files_count: int = 0
        filepaths: list[str] = [path.join(folder, f) for f in listdir(folder)]

        def isFileExpired(file: str) -> bool:
            return path.isfile(file) and int(path.getmtime(file)) < getDefaultExpirationTimestamp()

        for file in filepaths:
            if (isFileExpired(file)):
                remove(file)
                eliminated_files_count += 1
        if (not listdir(folder)): # if folder is empty, remove it
            rmtree(folder)
        if (eliminated_files_count != 0):
            pluralMarks = ["s", "were"] if eliminated_files_count != 1 else ["", "was"]
            log.info(f"{eliminated_files_count} cached file{pluralMarks[0]} {pluralMarks[1]} " \
                + f"removed in {folder.split(constants.SLASH)[0]}.")
        return eliminated_files_count

    def cacheCleanup() -> None:
        to_clean = ["DIRECTORY_NAME" + constants.SLASH]
        eliminated_files_count: int = 0

        for folder in to_clean:
            if (not path.isdir(folder)):
                continue
            session_dirname_list = listdir(folder)
            for sdn in session_dirname_list:
                eliminated_files_count += removeOldUploads(folder + sdn)
            if (eliminated_files_count == 0):
                log.info("Cache still fresh. Loading...")

    printInitStatistics()
    cacheCleanup()
    serve(app, host=host, port=port, threads=8)
