from flask import Blueprint, Response, request
from flask_cors import cross_origin
from requests import get as requestsGet

from ast import literal_eval
from os import path, makedirs
from typing import Optional
from uuid import uuid4

import src.constants as const
from src.logger import log
from src.web_utils import createApiResponse

from src.app import app
bp_artwork_generation = Blueprint(const.ROUTES.art_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE + const.ROUTES.art_gen.path

@bp_artwork_generation.route(api_prefix + "/use-itunes-image", methods=["POST"])
@cross_origin()
def useItunesImage() -> Response:
    """ Interprets the fetched iTunes URL and saves the image to the user's folder.
    :return: [Response] The response to the request.
    """
    log.log("POST - Generating artwork using an iTunes image...")
    body = literal_eval(request.get_data(as_text=True))
    image_url: Optional[str] = body.get("url")
    if image_url is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG_URL)

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
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_FAIL_DOWNLOAD)
    log.debug("iTunes image fetched successfully.")

    image_path = path.join(user_processed_path, "itunes_image.png")
    with open(image_path, "wb") as file:
        log.debug(f"Saving iTunes image to {image_path}")
        file.write(image_response.content)

    session[const.SessionFields.generated_artwork_path.value] = image_path
    session[const.SessionFields.include_center_artwork.value] = True

    log.log(f"Found iTunes image and saved it to {image_path}")
    return createApiResponse(const.HttpStatus.OK.value, "iTunes image processed successfully.")

@bp_artwork_generation.route(api_prefix + "/use-local-image", methods=["POST"])
@cross_origin()
def useLocalImage() -> Response:
    """ Saves the uploaded image to the user's folder.
    :return: [Response] The response to the request.
    """
    log.log("POST - Generating artwork using a local image...")
    if "file" not in request.files:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_FILE)
    file = request.files["file"]

    if const.SessionFields.user_folder.value not in session:
        log.debug("User folder not found in session. Creating a new one.")
        session[const.SessionFields.user_folder.value] = str(uuid4())
    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.images.value + const.SLASH

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
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, error)
    if file.filename is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_FILE)
    log.debug(f"Image filename is valid: {file.filename}")

    include_center_artwork: bool = \
        const.SessionFields.include_center_artwork.value in request.form \
        and request.form[const.SessionFields.include_center_artwork.value] == "on"
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    log.info(f"Creating user processed path: {user_processed_path}")
    makedirs(user_processed_path, exist_ok=True)

    image_path = path.join(user_processed_path, "uploaded_image.png")
    log.debug(f"Saving uploaded image to {image_path}")
    file.save(image_path)

    session[const.SessionFields.generated_artwork_path.value] = image_path
    session[const.SessionFields.include_center_artwork.value] = include_center_artwork

    log.log(f"Local image upload complete and saved it to {image_path}")
    return createApiResponse(const.HttpStatus.OK.value, "Image uploaded successfully.")

def extractYoutubeVideoId(url: str) -> Optional[str]:
    """ Extracts the YouTube video ID from the provided URL.
    :param url: [str] The YouTube URL from which to extract the video ID.
    :return: [str | None] The extracted video ID, or None if the URL does not match the expected formats
    """
    for pattern in const.REGEX_YOUTUBE_URL:
        match = pattern.match(url)
        if match is not None:
            return match.group(1)
    return None

def processYoutubeThumbnail(thumbnail_url: str) -> Response:
    """ Processes the thumbnail from the provided URL, saves it to the server, and updates the session.
    :param thumbnail_url: [str] The URL of the YouTube thumbnail to be processed.
    :return: [Response] Contains the status and path of the processed image.
    """
    if const.SessionFields.user_folder.value not in session:
        log.debug("User folder not found in session. Creating a new one.")
        session[const.SessionFields.user_folder.value] = str(uuid4())

    user_folder = str(session[const.SessionFields.user_folder.value]) + const.SLASH + const.AvailableCacheElemType.images.value + const.SLASH
    user_processed_path = path.join(const.PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    image_response = requestsGet(thumbnail_url)
    if image_response.status_code != const.HttpStatus.OK.value:
        return createApiResponse(const.HttpStatus.INTERNAL_SERVER_ERROR.value, const.ERR_FAIL_DOWNLOAD)

    image_path = path.join(user_processed_path, "youtube_thumbnail.png")
    with open(image_path, "wb") as file:
        file.write(image_response.content)

    session[const.SessionFields.generated_artwork_path.value] = image_path
    session[const.SessionFields.include_center_artwork.value] = False

    log.log(f"YouTube thumbnail upload complete and saved it to {image_path}")
    return createApiResponse(const.HttpStatus.OK.value, "YouTube thumbnail processed successfully.")

@bp_artwork_generation.route(api_prefix + "/use-youtube-thumbnail", methods=["POST"])
@cross_origin()
def useYoutubeThumbnail() -> Response:
    """ Handles the extraction and processing of a YouTube thumbnail from a given URL.
    :return: [Response] The response to the request.
    """
    log.log("POST - Generating artwork using a YouTube thumbnail...")
    body = literal_eval(request.get_data(as_text=True))
    youtube_url: Optional[str] = body.get("url")
    if youtube_url is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_NO_IMG_URL)

    video_id = extractYoutubeVideoId(youtube_url)
    if video_id is None:
        return createApiResponse(const.HttpStatus.BAD_REQUEST.value, const.ERR_INVALID_YT_URL)

    thumbnail_url = f"https://i3.ytimg.com/vi/{video_id}/maxresdefault.jpg"
    return processYoutubeThumbnail(thumbnail_url)
