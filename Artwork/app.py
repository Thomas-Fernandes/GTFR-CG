from flask import Flask, render_template, request, send_from_directory, session, Response
from flask_session import Session
from os import makedirs, path
from uuid import uuid4
from functions import generateCoverArt, generateMinia
from waitress import serve

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = 'Artwork/flask_session/'
Session(app)

app.config['UPLOAD_FOLDER'] = 'Artwork/uploads/'
app.config['PROCESSED_FOLDER'] = 'Artwork/processed/'

makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def upload_file() -> str:
    if request.method == 'POST':
        file = request.files['file']
        logo_position = request.form.get('logo-position', 'center')
        if file:
            if 'user_folder' not in session:
                session['user_folder'] = str(uuid4())

            user_folder: str = session['user_folder']
            user_upload_path: str = path.join(app.config['UPLOAD_FOLDER'], user_folder)
            user_processed_path: str = path.join(app.config['PROCESSED_FOLDER'], user_folder)
            makedirs(user_upload_path, exist_ok=True)
            makedirs(user_processed_path, exist_ok=True)

            filepath: str = path.join(user_upload_path, file.filename)
            file.save(filepath)
            output_bg = path.join(user_processed_path, 'ProcessedArtwork.png')
            output_minia = path.join(user_processed_path, 'minia.png')

            generateCoverArt(filepath, output_bg)
            generateMinia(output_bg, logo_position, output_minia)

            return render_template('download.html', user_folder=user_folder, bg='ProcessedArtwork.png', minia='minia.png')
    return render_template('upload.html')


@app.route('/download/<filename>')
def download(filename: str) -> Response | tuple[str, int]:
    if 'user_folder' in session:
        user_folder: str = session['user_folder']
        directory: str = path.abspath(path.join(app.config['PROCESSED_FOLDER'], user_folder))
        return send_from_directory(directory, filename, as_attachment=True)
    return ("Session Expired or Invalid", 404)

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8000)
