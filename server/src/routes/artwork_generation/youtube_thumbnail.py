from flask import Blueprint, Response, request
from flask_restx import Resource
from requests import get as requestsGet

from ast import literal_eval
from os import path, makedirs
from typing import Optional
from uuid import uuid4

from src.constants.enums import AvailableCacheElemType, HttpStatus, SessionFields
from src.constants.paths import PROCESSED_DIR, SLASH, UPLOADED_YOUTUBE_IMG_FILENAME
from src.constants.regex import REGEX_YOUTUBE_URL
from src.constants.responses import Error, Success, Warn

from src.app import session
from src.l10n import locale
from src.logger import log
from src.constants.paths import ROUTES
from src.constants.responses import Error, Success
from src.docs import models, ns_artwork_generation
from src.utils.web_utils import createApiResponse

def extractYoutubeVideoId(url: str) -> Optional[str]:
    """Extracts the YouTube video ID from the provided URL
    :param url: [str] The YouTube URL from which to extract the video ID
    :return: [str | None] The extracted video ID, or None if the URL does not match the expected formats
    """
    for pattern in REGEX_YOUTUBE_URL:
        match = pattern.match(url)
        if match is not None:
            return match.group(1)
    return None


def processYoutubeThumbnail(thumbnail_url: str) -> Response:
    """Processes the thumbnail from the provided URL, saves it to the server, and updates the session
    :param thumbnail_url: [str] The URL of the YouTube thumbnail to be processed
    :return: [Response] Contains the status and path of the processed image
    """
    if SessionFields.USER_FOLDER not in session:
        log.debug(locale.get(Warn.NO_USER_FOLDER))
        session[SessionFields.USER_FOLDER] = str(uuid4())

    user_folder = str(session.get(SessionFields.USER_FOLDER)) + SLASH + AvailableCacheElemType.ARTWORKS + SLASH
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    image_response = requestsGet(thumbnail_url)
    if image_response.status_code != HttpStatus.OK:
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, locale.get(Error.FAIL_DOWNLOAD))

    image_path = path.join(user_processed_path, UPLOADED_YOUTUBE_IMG_FILENAME)
    with open(image_path, "wb") as file:
        file.write(image_response.content)

    session[SessionFields.GENERATED_ARTWORK_PATH] = image_path
    session[SessionFields.INCLUDE_CENTER_ARTWORK] = False

    log.info(f"YouTube thumbnail upload complete and saved it to {image_path}")
    return createApiResponse(HttpStatus.CREATED, locale.get(Success.YOUTUBE_IMAGE_UPLOADED))


bp_artwork_generation_youtube_thumbnail = Blueprint("use-youtube-thumbnail", __name__.split('.')[-1])


@ns_artwork_generation.route("/use-youtube-thumbnail")
class YoutubeThumbnailResource(Resource):
    @ns_artwork_generation.doc("post_use_youtube_thumbnail")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["use-youtube-thumbnail"]["payload"])
    @ns_artwork_generation.response(HttpStatus.CREATED, locale.get(Success.YOUTUBE_IMAGE_UPLOADED))
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, "\n".join([locale.get(Error.NO_IMG_URL), locale.get(Error.INVALID_YT_URL)]))
    @ns_artwork_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, locale.get(Error.FAIL_DOWNLOAD))
    def post(self) -> Response:
        """Handles the extraction and processing of a YouTube thumbnail from a given URL"""
        log.info("POST - Generating artwork using a YouTube thumbnail...")

        body = literal_eval(request.get_data(as_text=True))
        youtube_url: Optional[str] = body.get("url")

        if youtube_url is None:
            log.error(f"Error in request payload: {locale.get(Error.NO_IMG_URL)}")
            return createApiResponse(HttpStatus.BAD_REQUEST, locale.get(Error.NO_IMG_URL))

        video_id = extractYoutubeVideoId(youtube_url)
        if video_id is None:
            log.error(f"Error in request payload: {locale.get(Error.INVALID_YT_URL)}")
            return createApiResponse(HttpStatus.BAD_REQUEST, locale.get(Error.INVALID_YT_URL))

        thumbnail_url = f"https://i3.ytimg.com/vi/{video_id}/maxresdefault.jpg"
        return processYoutubeThumbnail(thumbnail_url)
