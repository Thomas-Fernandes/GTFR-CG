from flask import Flask, render_template, request, send_from_directory, session
from flask_session import Session
from PIL import Image
import os
import uuid
from functions import jaquette, miniature
from waitress import serve

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = 'Artwork/flask_session/'
Session(app)

app.config['UPLOAD_FOLDER'] = 'Artwork/uploads/'
app.config['PROCESSED_FOLDER'] = 'Artwork/processed/'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            if 'user_folder' not in session:
                session['user_folder'] = str(uuid.uuid4())

            user_folder = session['user_folder']
            user_upload_path = os.path.join(app.config['UPLOAD_FOLDER'], user_folder)
            user_processed_path = os.path.join(app.config['PROCESSED_FOLDER'], user_folder)
            os.makedirs(user_upload_path, exist_ok=True)
            os.makedirs(user_processed_path, exist_ok=True)

            filepath = os.path.join(user_upload_path, file.filename)
            file.save(filepath)
            output_bg = os.path.join(user_processed_path, 'ProcessedArtwork.png')
            output_minia = os.path.join(user_processed_path, 'minia.png')

            jaquette(filepath, output_bg)
            miniature(output_bg, 'center', output_minia)

            return render_template('download.html', user_folder=user_folder, bg='ProcessedArtwork.png', minia='minia.png')
    return render_template('upload.html')

@app.route('/download/<filename>')
def download(filename):
    if 'user_folder' in session:
        user_folder = session['user_folder']
        directory = os.path.abspath(os.path.join(app.config['PROCESSED_FOLDER'], user_folder))
        return send_from_directory(directory, filename, as_attachment=True)
    return "Session Expired or Invalid", 404

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8000)
