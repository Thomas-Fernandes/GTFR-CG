from flask import Flask, render_template, request, send_from_directory, session, Response
from flask_session import Session
from waitress import serve

from uuid import uuid4
from os import makedirs, path, name as osName

from functions import generateCoverArt, generateMinia

SLASH = '/' if (osName != 'nt') else '\\'
UPLOAD_FOLDER = 'uploads' + SLASH
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
            user_upload_path: str = path.join(UPLOAD_FOLDER, user_folder)
            user_processed_path: str = path.join(PROCESSED_FOLDER, user_folder)
            makedirs(user_upload_path, exist_ok=True)
            makedirs(user_processed_path, exist_ok=True)

            filepath: str = path.join(user_upload_path, str(file.filename))
            file.save(filepath)
            output_bg = path.join(user_processed_path, 'ProcessedArtwork.png')
            output_minia = path.join(user_processed_path, 'minia.png')

            generateCoverArt(filepath, output_bg)
            generateMinia(output_bg, logo_position, output_minia)

            return render_template('download.html', user_folder=user_folder, bg='ProcessedArtwork.png', minia='minia.png')
    return render_template('upload.html')


@app.route('/download/<filename>', methods=['GET'])
def download(filename: str) -> Response | tuple[str, int]:
    if ('user_folder' in session):
        user_folder = str(session['user_folder'])
        directory: str = path.abspath(path.join(PROCESSED_FOLDER, user_folder))
        return send_from_directory(directory, filename, as_attachment=True)
    return ("Session Expired or Invalid", 404)

# Server config
HOME = "0.0.0.0"
PORT = 8000

def main() -> None:
    makedirs(UPLOAD_FOLDER, exist_ok=True)
    makedirs(PROCESSED_FOLDER, exist_ok=True)
    serve(app, host=HOME, port=PORT)

if __name__ == '__main__':
    main()
