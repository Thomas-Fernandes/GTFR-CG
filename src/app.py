# Installed libraries
from flask import Flask, render_template, request, send_from_directory, session, Response
from flask_session import Session
from requests import get as requestsGet
from waitress import serve

# Python standard libraries
from os import path, makedirs, remove, listdir
from shutil import rmtree
from uuid import uuid4

# Local modules
from src.functions import generateCoverArt, generateThumbnail, getLyrics
from src.logger import Logger
from src.soft_utils import getDefaultExpirationTimestamp
from src.statistics import onLaunch as printInitStatistics, updateStats
from src.web_utils import checkFilenameValid, createJsonResponse, JsonResponse

import src.constants as constants

log = Logger()

app = Flask(__name__.split('.')[-1]) # so that the app name is app, not {dirpath}.app
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = 'flask_session' + constants.SLASH
Session(app)

@app.route('/artwork-generation', methods=['GET', 'POST'])
def artworkGeneration() -> str | JsonResponse:
    if (request.method == 'GET'):
        return render_template('upload.html')

    if ('user_folder' not in session):
        session['user_folder'] = str(uuid4())
    user_folder = str(session['user_folder'])

    file = request.files['file']
    error = checkFilenameValid(file.filename)
    if (error):
        log.error(error)
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, error)

    if (file.filename is None):
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, constants.ERR_NO_FILE)
    user_processed_path: str = path.join(constants.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    filepath: str = path.join(user_processed_path, "uploaded_image.png")
    file.save(filepath)
    session['generated_artwork_path'] = filepath
    return createJsonResponse(constants.HttpStatus.OK.value)

@app.route('/downloadArtwork/<filename>', methods=['GET'])
def downloadArtwork(filename: str) -> Response | JsonResponse:
    if ('user_folder' not in session):
        return createJsonResponse(constants.HttpStatus.NOT_FOUND.value, constants.ERR_INVALID_SESSION)
    user_folder = str(session['user_folder'])
    directory: str = path.abspath(path.join(constants.PROCESSED_DIR, user_folder))
    return send_from_directory(directory, filename, as_attachment=True)

@app.route('/processed_images', methods=['POST'])
def downloadThumbnail() -> Response | JsonResponse:
    if ('user_folder' not in session):
        return createJsonResponse(constants.HttpStatus.NOT_FOUND.value, constants.ERR_INVALID_SESSION)
    user_folder = str(session['user_folder'])
    directory: str = path.abspath(path.join(constants.PROCESSED_DIR, user_folder))
    selected_thumbnail_idx = int(request.form.get('selected_thumbnail_idx', 5)) - 1
    filename: str = f"{constants.THUMBNAIL_PREFIX}{constants.LOGO_POSITIONS[selected_thumbnail_idx]}{constants.THUMBNAIL_EXT}"
    return send_from_directory(directory, filename, as_attachment=True)

@app.route('/use_itunes_image', methods=['POST'])
def use_itunes_image() -> Response | JsonResponse:
    image_url = request.form.get('url')
    if (not image_url):
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, 'No image URL provided')

    if ('user_folder' not in session):
        session['user_folder'] = str(uuid4())

    user_folder = str(session['user_folder'])
    user_processed_path = path.join(constants.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    image_response = requestsGet(image_url) # fetch iTunes image from deducted URL
    if (image_response.status_code != constants.HttpStatus.OK.value):
        return createJsonResponse(constants.HttpStatus.INTERNAL_SERVER_ERROR.value, 'Failed to download image')
    image_path = path.join(user_processed_path, 'itunes_image.png')
    with open(image_path, 'wb') as file:
        file.write(image_response.content)

    session['generated_artwork_path'] = image_path
    return createJsonResponse(constants.HttpStatus.OK.value)

@app.route('/processed_images', methods=['GET']) # FIXME GET and POST functions are discordant in use
def processed_images() -> str | JsonResponse:
    if ('generated_artwork_path' not in session):
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, 'No image was selected or uploaded')

    user_folder = str(session['user_folder'])
    user_processed_path = path.join(constants.PROCESSED_DIR, user_folder)
    generated_artwork_path = str(session['generated_artwork_path'])
    output_bg = path.join(user_processed_path, constants.PROCESSED_ARTWORK_FILENAME)
    generateCoverArt(generated_artwork_path, output_bg)
    generateThumbnail(output_bg, user_processed_path)
    updateStats(to_increment='artworkGenerations')

    return render_template('download.html', user_folder=user_folder, bg=constants.PROCESSED_ARTWORK_FILENAME)

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
    return render_template('home.html')

@app.errorhandler(404)
def page_not_found(_e: Exception) -> str:
    log.warn(f"Page not found: {request.url}. Redirecting to home page ({'/home'}).")
    return render_template('home.html')

@app.route('/')
def root() -> str:
    return render_template('home.html')

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
