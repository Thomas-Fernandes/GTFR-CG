# Installed libraries
from flask import Flask, render_template, request, send_from_directory, session, Response
from flask_session import Session
from requests import get as restGet
from waitress import serve

# Python standard libraries
from os import path, makedirs, remove, listdir
from shutil import rmtree
from uuid import uuid4

# Local modules
from src.statistics import Statistics, updateStats
from src.functions import generateCoverArt, generateThumbnail
from src.web_utils import createJsonResponse

import src.constants as constants

app = Flask(__name__.split('.')[-1])
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = 'flask_session' + constants.SLASH
Session(app)

def checkFilenameValid(filename: str) -> str:
    ERR_INVALID_FILE_TYPE = 'Invalid file type. Only PNG and JPG files are allowed.'
    ERR_NO_FILE = 'Invalid file: No file selected.'

    if (filename == None or filename == ''):
        return ERR_NO_FILE
    if (not('.' in filename and filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg'])):
        return ERR_INVALID_FILE_TYPE
    return ""

@app.route('/', methods=['GET', 'POST'])
def upload_file() -> str:
    if (request.method == 'POST'):
        file = request.files['file']

        rv = checkFilenameValid(file.filename)
        if (rv != ""):
            return render_template('upload.html', error=rv)

        if (file.filename != None):
            if ('user_folder' not in session):
                session['user_folder'] = str(uuid4())

            user_folder = str(session['user_folder'])
            user_upload_path: str = path.join(constants.UPLOADS_DIR, user_folder)
            user_processed_path: str = path.join(constants.PROCESSED_DIR, user_folder)
            makedirs(user_upload_path, exist_ok=True)
            makedirs(user_processed_path, exist_ok=True)

            filepath: str = path.join(user_upload_path, str(file.filename))
            file.save(filepath)
            output_bg = path.join(user_processed_path, constants.PROCESSED_ARTWORK_FILENAME)
            generateCoverArt(filepath, output_bg)
            generateThumbnail(output_bg, user_processed_path)
            updateStats()

            return render_template('download.html', user_folder=user_folder)
    return render_template('upload.html')

@app.route('/download/<filename>', methods=['GET'])
def download(filename: str) -> Response | tuple[str, int]:
    if ('user_folder' in session):
        user_folder = str(session['user_folder'])
        directory: str = path.abspath(path.join(constants.PROCESSED_DIR, user_folder))
        return send_from_directory(directory, filename, as_attachment=True)
    return createJsonResponse(constants.HttpStatus.NOT_FOUND.value, 'Session Expired or Invalid')

@app.route('/use_itunes_image', methods=['POST'])
def use_itunes_image() -> tuple[str, int] | Response:
    image_url = request.form.get('url')
    logo_position = request.form.get('position', 'center')
    if (not image_url):
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, 'No image URL provided')

    if ('user_folder' not in session):
        session['user_folder'] = str(uuid4())

    user_folder = str(session['user_folder'])
    user_processed_path = path.join(constants.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    # Mise à jour ici pour utiliser restGet au lieu de requests.get
    image_response = restGet(image_url)
    if (image_response.status_code == constants.HttpStatus.OK.value):
        image_path = path.join(user_processed_path, 'itunes_image.png')
        with open(image_path, 'wb') as file:
            file.write(image_response.content)

        session['itunes_image_path'] = image_path
        session['logo_position'] = logo_position
        return createJsonResponse(constants.HttpStatus.OK.value)
    else:
        return createJsonResponse(constants.HttpStatus.INTERNAL_SERVER_ERROR.value, 'Failed to download image')

@app.route('/process_itunes_image', methods=['GET'])
def process_itunes_image() -> str | tuple[str, int]:
    if ('itunes_image_path' in session):
        user_folder = str(session['user_folder'])
        user_processed_path = path.join(constants.PROCESSED_DIR, user_folder)
        itunes_image_path = session['itunes_image_path']
        output_bg = path.join(user_processed_path, constants.PROCESSED_ARTWORK_FILENAME)
        generateCoverArt(itunes_image_path, output_bg)
        generateThumbnail(output_bg, user_processed_path)
        updateStats()

        return render_template('download.html', user_folder=user_folder, bg=constants.PROCESSED_ARTWORK_FILENAME, minia=constants.THUMBNAIL_FILENAME)
    return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, 'No iTunes image selected')

def main(host: str = constants.HOST_HOME, port: int = constants.DEFAULT_PORT) -> None:
    uploads_folder = constants.UPLOADS_DIR
    processed_folder = constants.PROCESSED_DIR
    makedirs(uploads_folder, exist_ok=True)
    makedirs(processed_folder, exist_ok=True)

    def removeOldUploads(folder: str) -> int:
        eliminated_files_count = 0
        filepaths: list[str] = [path.join(folder, f) for f in listdir(folder)]
        for file in filepaths:
            if (path.isfile(file) and int(path.getmtime(file)) < constants.getDefaultExpirationTime()):
                remove(file)
                eliminated_files_count += 1
        if (not listdir(folder)): # if folder is empty, remove it
            rmtree(folder)
        if (eliminated_files_count != 0):
            pluralMarks = ["s", "were"] if eliminated_files_count != 1 else ["", "was"]
            print(f"{eliminated_files_count} cached file{pluralMarks[0]} {pluralMarks[1]} " \
                + f"removed in {folder.split(constants.SLASH)[0]}.")
        return eliminated_files_count

    def cacheCleanup(stats: Statistics) -> None:
        eliminated_files_count = 0

        if (not path.exists(stats.getStatsFilePath())):
            stats.generateStats()
        else:
            session_dirname_list = listdir(uploads_folder)
            for sdn in session_dirname_list:
                eliminated_files_count += removeOldUploads(uploads_folder + sdn)
            if (eliminated_files_count == 0):
                print("Cache still fresh. Loading...")

    stats = Statistics()
    cacheCleanup(stats)
    serve(app, host=host, port=port, threads=8)
