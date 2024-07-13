from flask import Blueprint, render_template, request
from requests import get as requestsGet

from os import path, makedirs
from typing import Optional
from uuid import uuid4

from src.logger import log
from src.typing import JsonResponse, RenderView
from src.web_utils import checkImageFilenameValid, createJsonResponse
import src.constants as const

from src.app import app
bp_artwork_generation = Blueprint(const.ROUTES.art_gen.bp_name, __name__.split('.')[-1])
session = app.config

@bp_artwork_generation.route(const.ROUTES.art_gen.path + "/use-itunes-image", methods=["POST"])
def useItunesImage() -> JsonResponse:
    image_url: Optional[str] = request.form.get("url")
    if image_url is None:
        return createJsonResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG_URL)

    if const.SessionFields.user_folder.value not in session:
        session[const.SessionFields.user_folder.value] = str(uuid4())

    user_folder = str(session[const.SessionFields.user_folder.value])
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    image_response = requestsGet(image_url) # fetch iTunes image from deducted URL
    if image_response.status_code != const.HttpStatus.OK.value:
        return createJsonResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_FAIL_DOWNLOAD)
    image_path = path.join(user_processed_path, "itunes_image.png")
    with open(image_path, "wb") as file:
        file.write(image_response.content)

    session[const.SessionFields.generated_artwork_path.value] = image_path
    return createJsonResponse(const.HttpStatus.OK.value)

@bp_artwork_generation.route(const.ROUTES.art_gen.path + "/use-local-image", methods=["POST"])
def useLocalImage() -> JsonResponse:
    if const.SessionFields.user_folder.value not in session:
        session[const.SessionFields.user_folder.value] = str(uuid4())
    user_folder = str(session[const.SessionFields.user_folder.value])

    file = request.files["file"]
    error = checkImageFilenameValid(file.filename)
    if error is not None:
        log.error(error)
        return createJsonResponse(const.HttpStatus.BAD_REQUEST.value, error)

    if file.filename is None:
        return createJsonResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_FILE)

    include_center_artwork: bool = \
        const.SessionFields.include_center_artwork.value in request.form and request.form[const.SessionFields.include_center_artwork.value] == "on"
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    filepath = path.join(user_processed_path, "uploaded_image.png")
    file.save(filepath)
    session[const.SessionFields.generated_artwork_path.value] = filepath
    session[const.SessionFields.include_center_artwork.value] = include_center_artwork
    return createJsonResponse(const.HttpStatus.OK.value)

@bp_artwork_generation.route(const.ROUTES.art_gen.path, methods=["GET"])
def renderArtworkGeneration() -> RenderView:
    return render_template(const.ROUTES.art_gen.view_filename)
