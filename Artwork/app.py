from flask import Flask, render_template, request, send_from_directory, session, Response, jsonify
from flask_session import Session
from waitress import serve
from requests import get as restGet

from shutil import rmtree
from uuid import uuid4
from os import path, name as osName, makedirs

from statistics import Statistics as Stats, updateStats
from functions import generateCoverArt, generateMinia
from constants import HttpStatus
from web_utils import createJsonResponse

SLASH = '/' if (osName != 'nt') else '\\'
UPLOADS_FOLDER = 'uploads' + SLASH
PROCESSED_FOLDER = 'processed' + SLASH

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = 'flask_session' + SLASH
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

        logo_position = request.form.get('logo-position', 'center')
        if (file.filename != None):
            if ('user_folder' not in session):
                session['user_folder'] = str(uuid4())

            user_folder = str(session['user_folder'])
            user_upload_path: str = path.join(UPLOADS_FOLDER, user_folder)
            user_processed_path: str = path.join(PROCESSED_FOLDER, user_folder)
            makedirs(user_upload_path, exist_ok=True)
            makedirs(user_processed_path, exist_ok=True)

            filepath: str = path.join(user_upload_path, str(file.filename))
            file.save(filepath)
            output_bg = path.join(user_processed_path, 'ProcessedArtwork.png')
            output_minia = path.join(user_processed_path, 'minia.png')

            generateCoverArt(filepath, output_bg)
            generateMinia(output_bg, logo_position, output_minia)
            updateStats()

            return render_template('download.html', user_folder=user_folder, bg='ProcessedArtwork.png', minia='minia.png')
    return render_template('upload.html')

@app.route('/download/<filename>', methods=['GET'])
def download(filename: str) -> Response | tuple[str, int]:
    if ('user_folder' in session):
        user_folder = str(session['user_folder'])
        directory: str = path.abspath(path.join(PROCESSED_FOLDER, user_folder))
        return send_from_directory(directory, filename, as_attachment=True)
    return createJsonResponse(HttpStatus.NOT_FOUND.value, 'Session Expired or Invalid')

@app.route('/use_itunes_image', methods=['POST'])
def use_itunes_image() -> tuple[str, int] | Response:
    image_url = request.form.get('url')
    logo_position = request.form.get('position', 'center')
    if (not image_url):
        return createJsonResponse(HttpStatus.BAD_REQUEST.value, 'No image URL provided')

    if ('user_folder' not in session):
        session['user_folder'] = str(uuid4())

    user_folder = str(session['user_folder'])
    user_processed_path = path.join(PROCESSED_FOLDER, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    # Mise à jour ici pour utiliser restGet au lieu de requests.get
    image_response = restGet(image_url)
    if (image_response.status_code == HttpStatus.OK.value):
        image_path = path.join(user_processed_path, 'itunes_image.png')
        with open(image_path, 'wb') as file:
            file.write(image_response.content)

        session['itunes_image_path'] = image_path
        session['logo_position'] = logo_position
        return createJsonResponse(HttpStatus.OK.value)
    else:
        return createJsonResponse(HttpStatus.INTERNAL_SERVER_ERROR.value, 'Failed to download image')

@app.route('/process_itunes_image', methods=['GET'])
def process_itunes_image() -> Response | tuple[str, int]:
    if ('itunes_image_path' in session):
        user_folder = str(session['user_folder'])
        user_processed_path = path.join(PROCESSED_FOLDER, user_folder)
        itunes_image_path = session['itunes_image_path']
        logo_position = session.get('logo_position', 'center')
        output_bg = path.join(user_processed_path, 'ProcessedArtwork.png')
        output_minia = path.join(user_processed_path, 'minia.png')

        generateCoverArt(itunes_image_path, output_bg)
        generateMinia(output_bg, logo_position, output_minia)  # Use the selected logo position
        updateStats()

        return render_template('download.html', user_folder=user_folder, bg='ProcessedArtwork.png', minia='minia.png')
    return createJsonResponse(HttpStatus.BAD_REQUEST.value, 'No iTunes image selected')

# Server config
HOME = "0.0.0.0"
PORT = 8000

def main() -> None:
    makedirs(UPLOADS_FOLDER, exist_ok=True)
    makedirs(PROCESSED_FOLDER, exist_ok=True)

    def cache_cleanup(stats: Stats) -> None:
        if (not path.exists(stats.stats_file_path)):
            stats.generateStats()
        else:
            if (stats.isCacheExpired()):
                print("Cache expired, emptying it...")
                rmtree(UPLOADS_FOLDER)
                rmtree(PROCESSED_FOLDER)
            else:
                print("Cache still fresh. Loading...")

    stats = Stats()
    cache_cleanup(stats)
    serve(app, host=HOME, port=PORT)

if __name__ == '__main__':
    main()
