from flask import Blueprint, render_template, request, Response
from requests import get as requestsGet

from os import path, makedirs
from uuid import uuid4

from src.logger import log
from src.web_utils import checkImageFilenameValid, createJsonResponse, JsonResponse
import src.constants as constants

from src.app import app
artwork_generation = Blueprint('artwork-generation', __name__.split('.')[-1])
session = app.config

@artwork_generation.route('/use_itunes_image', methods=['POST'])
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

@artwork_generation.route('/artwork-generation', methods=['GET', 'POST'])
def artworkGeneration() -> str | JsonResponse:
    if (request.method == 'GET'):
        return render_template('artwork-generation.html')

    if ('user_folder' not in session):
        session['user_folder'] = str(uuid4())
    user_folder = str(session['user_folder'])

    file = request.files['file']
    error = checkImageFilenameValid(file.filename)
    if (error):
        log.error(error)
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, error)

    if (file.filename is None):
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, constants.ERR_NO_FILE)

    include_center_artwork = 'include_center_artwork' in request.form and\
                             request.form['include_center_artwork'] == 'on'
    user_processed_path = path.join(constants.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    filepath = path.join(user_processed_path, "uploaded_image.png")
    file.save(filepath)
    session['generated_artwork_path'] = filepath
    session['include_center_artwork'] = include_center_artwork
    return createJsonResponse(constants.HttpStatus.OK.value)
