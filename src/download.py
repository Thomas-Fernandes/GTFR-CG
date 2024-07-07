from flask import Blueprint, render_template, request, Response, send_from_directory

from os import path

from src.functions import generateCoverArt, generateThumbnail
from src.statistics import updateStats
from src.web_utils import createJsonResponse, JsonResponse
import src.constants as constants

from src.app import app
bp_download = Blueprint('download', __name__.split('.')[-1])
session = app.config

@bp_download.route('/downloadArtwork/<filename>', methods=['GET'])
def downloadArtwork(filename: str) -> Response | JsonResponse:
    if ('user_folder' not in session):
        return createJsonResponse(constants.HttpStatus.NOT_FOUND.value, constants.ERR_INVALID_SESSION)
    user_folder = str(session['user_folder'])
    directory: str = path.abspath(path.join(constants.PROCESSED_DIR, user_folder))
    return send_from_directory(directory, filename, as_attachment=True)

@bp_download.route('/processed_images', methods=['POST'])
def downloadThumbnail() -> Response | JsonResponse:
    if ('user_folder' not in session):
        return createJsonResponse(constants.HttpStatus.NOT_FOUND.value, constants.ERR_INVALID_SESSION)
    user_folder = str(session['user_folder'])
    directory: str = path.abspath(path.join(constants.PROCESSED_DIR, user_folder))
    selected_thumbnail_idx = int(request.form.get('selected_thumbnail_idx', 5)) - 1
    filename: str = f"{constants.THUMBNAIL_PREFIX}{constants.LOGO_POSITIONS[selected_thumbnail_idx]}{constants.THUMBNAIL_EXT}"
    return send_from_directory(directory, filename, as_attachment=True)

@bp_download.route('/processed_images', methods=['GET'])
def processed_images() -> str | JsonResponse:
    if ('generated_artwork_path' not in session):
        return createJsonResponse(constants.HttpStatus.BAD_REQUEST.value, 'No image was selected or uploaded')

    user_folder = str(session['user_folder'])
    user_processed_path = path.join(constants.PROCESSED_DIR, user_folder)
    generated_artwork_path = str(session['generated_artwork_path'])
    include_center_artwork = session.get('include_center_artwork', True)
    output_bg = path.join(user_processed_path, constants.PROCESSED_ARTWORK_FILENAME)
    generateCoverArt(generated_artwork_path, output_bg, include_center_artwork)
    generateThumbnail(output_bg, user_processed_path)
    updateStats(to_increment='artworkGenerations')

    return render_template('download.html', user_folder=user_folder, bg=constants.PROCESSED_ARTWORK_FILENAME)
