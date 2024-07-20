from flask import Blueprint, render_template, request
from requests import get as requestsGet

from os import path, makedirs
from typing import Optional
from uuid import uuid4

import src.constants as const
from src.logger import log
from src.typing import JsonResponse, RenderView
from src.web_utils import createJsonResponse

from src.app import app
bp_artwork_generation = Blueprint(const.ROUTES.art_gen.bp_name, __name__.split('.')[-1])
session = app.config

@bp_artwork_generation.route(const.ROUTES.art_gen.path + "/use-itunes-image", methods=["POST"])
def useItunesImage() -> JsonResponse:
    """ Interprets the fetched iTunes URL and saves the image to the user's folder.
    :return: [JsonResponse] The response to the request.
    """
    image_url: Optional[str] = request.form.get("url")
    if image_url is None:
        return createJsonResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG_URL)

    if const.SessionFields.user_folder.value not in session:
        log.debug("User folder not found in session. Creating a new one.")
        session[const.SessionFields.user_folder.value] = str(uuid4())

    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.images.value + const.SLASH
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    log.info(f"Creating user processed path: {user_processed_path}")
    makedirs(user_processed_path, exist_ok=True)

    log.debug(f"Fetching iTunes image from URL: {image_url}")
    image_response = requestsGet(image_url) # fetch iTunes image from deducted URL
    if image_response.status_code != const.HttpStatus.OK.value:
        return createJsonResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_FAIL_DOWNLOAD)
    log.debug("iTunes image fetched successfully.")

    image_path = path.join(user_processed_path, "itunes_image.png")
    with open(image_path, "wb") as file:
        log.debug(f"Saving iTunes image to {image_path}")
        file.write(image_response.content)

    session[const.SessionFields.generated_artwork_path.value] = image_path
    log.log(f"Found iTunes image and saved it to {image_path}")
    return createJsonResponse(const.HttpStatus.OK.value)

@bp_artwork_generation.route(const.ROUTES.art_gen.path + "/use-local-image", methods=["POST"])
def useLocalImage() -> JsonResponse:
    """ Saves the uploaded image to the user's folder.
    :return: [JsonResponse] The response to the request.
    """
    if const.SessionFields.user_folder.value not in session:
        log.debug("User folder not found in session. Creating a new one.")
        session[const.SessionFields.user_folder.value] = str(uuid4())
    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.images.value + const.SLASH

    file = request.files["file"]
    def checkImageFilenameValid(filename: str | None) -> Optional[str]:
        """ Checks if the given filename is valid for an image file.
        :param filename: [string] The filename to check.
        :return: [string?] The error message if the filename is invalid, None otherwise.
        """
        log.debug(f"Checking image filename validity: {filename}")
        if filename == None or filename.strip() == "":
            return const.ERR_NO_FILE
        if not('.' in filename and filename.rsplit('.', 1)[1].lower() in ["png", "jpg", "jpeg"]):
            return const.ERR_INVALID_FILE_TYPE
        return None
    error = checkImageFilenameValid(file.filename)
    if error is not None:
        log.error(error)
        return createJsonResponse(const.HttpStatus.BAD_REQUEST.value, error)
    if file.filename is None:
        return createJsonResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_FILE)
    log.debug(f"Image filename is valid: {file.filename}")

    include_center_artwork: bool = \
        const.SessionFields.include_center_artwork.value in request.form \
        and request.form[const.SessionFields.include_center_artwork.value] == "on"
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    log.info(f"Creating user processed path: {user_processed_path}")
    makedirs(user_processed_path, exist_ok=True)

    filepath = path.join(user_processed_path, "uploaded_image.png")
    log.debug(f"Saving uploaded image to {filepath}")
    file.save(filepath)
    session[const.SessionFields.generated_artwork_path.value] = filepath
    session[const.SessionFields.include_center_artwork.value] = include_center_artwork
    log.log("Local image upload complete.")
    return createJsonResponse(const.HttpStatus.OK.value)

@bp_artwork_generation.route(const.ROUTES.art_gen.path, methods=["GET"])
def renderArtworkGeneration() -> RenderView:
    """ Renders the artwork generation page.
    :return: [RenderView] The rendered view.
    """
    log.debug(f"Rendering {const.ROUTES.art_gen.bp_name} page...")
    return render_template(const.ROUTES.art_gen.view_filename)
