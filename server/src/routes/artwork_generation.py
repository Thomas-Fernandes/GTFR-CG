from flask import Blueprint, Response, request
from flask_restx import Resource
from requests import get as requestsGet, Response as RequestsResponse
from werkzeug.datastructures import FileStorage

from ast import literal_eval
from os import path, makedirs
from time import time
from typing import Optional
from uuid import uuid4

from server.src.constants.enums import AvailableCacheElemType, HttpStatus, SessionFields
from server.src.constants.paths import \
    API_ROUTE, PROCESSED_DIR, ROUTES, SLASH, \
    UPLOADED_ITUNES_IMG_FILENAME, UPLOADED_FILE_IMG_FILENAME, UPLOADED_YOUTUBE_IMG_FILENAME
from server.src.constants.regex import REGEX_YOUTUBE_URL
from server.src.constants.responses import Err, Msg, Warn

from server.src.decorators import retry
from server.src.docs import models, ns_artwork_generation
from server.src.logger import log, LogSeverity
from server.src.utils.file_utils import checkImageFilenameValid
from server.src.utils.string_utils import snakeToCamel
from server.src.utils.web_utils import createApiResponse

from server.src.app import api, app
bp_artwork_generation = Blueprint(ROUTES.art_gen.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = API_ROUTE + ROUTES.art_gen.path
api.add_namespace(ns_artwork_generation, path=api_prefix)

@ns_artwork_generation.route("/use-itunes-image")
class ItunesImageResource(Resource):
    @ns_artwork_generation.doc("post_use_itunes_image")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["use-itunes-image"]["payload"])
    @ns_artwork_generation.response(HttpStatus.CREATED, Msg.ITUNES_IMAGE_UPLOADED)
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, Err.NO_IMG_URL)
    @ns_artwork_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, Err.FAIL_DOWNLOAD)
    def post(self) -> Response:
        """ Interprets the fetched iTunes URL and saves the image to the user's folder """
        log.log("POST - Generating artwork using an iTunes image...")
        body = literal_eval(request.get_data(as_text=True))
        image_url: Optional[str] = body.get("url")
        if image_url is None:
            log.error(Err.NO_IMG_URL)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_IMG_URL)

        if SessionFields.USER_FOLDER not in session:
            log.debug(Warn.NO_USER_FOLDER)
            session[SessionFields.USER_FOLDER] = str(uuid4())

        user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.ARTWORKS + SLASH
        user_processed_path = path.join(PROCESSED_DIR, user_folder)
        log.info(f"Creating user processed path: {user_processed_path}")
        makedirs(user_processed_path, exist_ok=True)

        log.debug(f"Fetching iTunes image from URL: {image_url}")
        image_response = requestsGet(image_url) # fetch iTunes image from deducted URL
        if image_response.status_code != HttpStatus.OK:
            return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.FAIL_DOWNLOAD)
        log.debug("iTunes image fetched successfully.")

        image_path = path.join(user_processed_path, UPLOADED_ITUNES_IMG_FILENAME)
        with open(image_path, "wb") as file:
            log.debug(f"Saving iTunes image to {image_path}")
            file.write(image_response.content)

        session[SessionFields.GENERATED_ARTWORK_PATH] = image_path
        session[SessionFields.INCLUDE_CENTER_ARTWORK] = True

        log.log(f"Found iTunes image and saved it to {image_path}")
        return createApiResponse(HttpStatus.CREATED, Msg.ITUNES_IMAGE_UPLOADED)

@retry(condition=(lambda x: x.status_code == HttpStatus.OK), times=3)
def makeItunesRequest(url_to_hit: str) -> RequestsResponse:
    return requestsGet(url_to_hit)

def checkItunesParametersValidity(term: str, country: str) -> Optional[str]:
    """ Checks the validity of the provided iTunes parameters
    :param term: [str] The search term to be used in the iTunes API request
    :param country: [str] The country code to be used in the iTunes API request
    :return: [str | None] An error message if the parameters are invalid, or None if they are valid
    """
    if term is None or country is None or len(term.strip()) == 0 or len(country.strip()) == 0:
        return Err.ITUNES_MISSING_PARAMS
    if not (len(country) == 2 and country.isalpha()):
        return Err.ITUNES_INVALID_COUNTRY
    return None

# iTunes reference: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW1
# Ben Dodson's iTunes artwork finder which we mimic: https://github.com/bendodson/itunes-artwork-finder
@ns_artwork_generation.route("/search-itunes")
class ItunesSearchResource(Resource):
    @ns_artwork_generation.doc("post_search_itunes")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["search-itunes"]["payload"])
    @ns_artwork_generation.response(HttpStatus.OK, Msg.ITUNES_FETCH_COMPLETE)
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, "\n".join([Err.ITUNES_MISSING_PARAMS, Err.ITUNES_INVALID_COUNTRY]))
    def post(self) -> Response:
        """ Handles the request to the iTunes API to fetch possible images """
        log.log("POST - Searching images on iTunes...")

        body = literal_eval(request.get_data(as_text=True))
        term: Optional[str] = body.get("term")
        country: Optional[str] = body.get("country")
        entity = "album" # album by default, but can be "song", "movie", "tv-show"...
        limit = 6 # arbitrary limit for now

        err = checkItunesParametersValidity(term, country)
        if err is not None:
            log.error(err)
            return createApiResponse(HttpStatus.BAD_REQUEST, err)

        log.info(f"Searching {limit} iTunes images for term: '{term}', country: {(country or "''").upper()}...")
        start = time()
        url_to_hit = f"https://itunes.apple.com/search?term={term}&country={country}&entity={entity}&limit={limit}"
        response = makeItunesRequest(url_to_hit)
        log.info(f"iTunes search complete with status code: {response.status_code}") \
            .time(LogSeverity.INFO, time() - start)

        return createApiResponse(response.status_code, Msg.ITUNES_FETCH_COMPLETE, response.json())

@ns_artwork_generation.route("/use-local-image")
class LocalImageResource(Resource):
    @ns_artwork_generation.doc("post_use_local_image")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["use-local-image"]["payload"])
    @ns_artwork_generation.response(HttpStatus.CREATED, Msg.LOCAL_IMAGE_UPLOADED)
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, Err.NO_FILE)
    @ns_artwork_generation.response(HttpStatus.UNSUPPORTED_MEDIA_TYPE, Err.IMG_INVALID_FILETYPE)
    @ns_artwork_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, Err.FAIL_DOWNLOAD)
    def post(self) -> Response:
        """ Saves the uploaded image to the user's folder """
        log.log("POST - Generating artwork using a local image...")

        if "file" not in request.files:
            log.error(Err.NO_FILE)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_FILE)
        file: FileStorage = request.files["file"]

        if SessionFields.USER_FOLDER not in session:
            log.debug(Warn.NO_USER_FOLDER)
            session[SessionFields.USER_FOLDER] = str(uuid4())
        user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.ARTWORKS + SLASH

        err = checkImageFilenameValid(file.filename)
        if err is not None:
            log.error(err)
            if err == Err.IMG_INVALID_FILETYPE:
                return createApiResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, err)
            else:
                return createApiResponse(HttpStatus.BAD_REQUEST, err)
        if file.filename is None:
            log.error(Err.NO_FILE)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_FILE)
        log.debug(f"Image filename is valid: {file.filename}")

        include_center_artwork: bool = \
            request.form[snakeToCamel(SessionFields.INCLUDE_CENTER_ARTWORK)] == "true"
        user_processed_path = path.join(PROCESSED_DIR, user_folder)
        log.info(f"Creating user processed path: {user_processed_path}")
        makedirs(user_processed_path, exist_ok=True)

        image_path = path.join(user_processed_path, UPLOADED_FILE_IMG_FILENAME)
        log.debug(f"Saving uploaded image to {image_path}")
        file.save(image_path)

        session[SessionFields.GENERATED_ARTWORK_PATH] = image_path
        session[SessionFields.INCLUDE_CENTER_ARTWORK] = include_center_artwork

        log.log(f"Local image upload complete and saved it to {image_path}")
        return createApiResponse(HttpStatus.CREATED, Msg.LOCAL_IMAGE_UPLOADED)

def extractYoutubeVideoId(url: str) -> Optional[str]:
    """ Extracts the YouTube video ID from the provided URL
    :param url: [str] The YouTube URL from which to extract the video ID
    :return: [str | None] The extracted video ID, or None if the URL does not match the expected formats
    """
    for pattern in REGEX_YOUTUBE_URL:
        match = pattern.match(url)
        if match is not None:
            return match.group(1)
    return None

def processYoutubeThumbnail(thumbnail_url: str) -> Response:
    """ Processes the thumbnail from the provided URL, saves it to the server, and updates the session
    :param thumbnail_url: [str] The URL of the YouTube thumbnail to be processed
    :return: [Response] Contains the status and path of the processed image
    """
    if SessionFields.USER_FOLDER not in session:
        log.debug(Warn.NO_USER_FOLDER)
        session[SessionFields.USER_FOLDER] = str(uuid4())

    user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.ARTWORKS + SLASH
    user_processed_path = path.join(PROCESSED_DIR, user_folder)
    makedirs(user_processed_path, exist_ok=True)

    image_response = requestsGet(thumbnail_url)
    if image_response.status_code != HttpStatus.OK:
        return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, Err.FAIL_DOWNLOAD)

    image_path = path.join(user_processed_path, UPLOADED_YOUTUBE_IMG_FILENAME)
    with open(image_path, "wb") as file:
        file.write(image_response.content)

    session[SessionFields.GENERATED_ARTWORK_PATH] = image_path
    session[SessionFields.INCLUDE_CENTER_ARTWORK] = False

    log.log(f"YouTube thumbnail upload complete and saved it to {image_path}")
    return createApiResponse(HttpStatus.CREATED, Msg.YOUTUBE_IMAGE_UPLOADED)

@ns_artwork_generation.route("/use-youtube-thumbnail")
class YoutubeThumbnailResource(Resource):
    @ns_artwork_generation.doc("post_use_youtube_thumbnail")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["use-youtube-thumbnail"]["payload"])
    @ns_artwork_generation.response(HttpStatus.CREATED, Msg.YOUTUBE_IMAGE_UPLOADED)
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, "\n".join([Err.NO_IMG_URL, Err.INVALID_YT_URL]))
    @ns_artwork_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, Err.FAIL_DOWNLOAD)
    def post(self) -> Response:
        """ Handles the extraction and processing of a YouTube thumbnail from a given URL """
        log.log("POST - Generating artwork using a YouTube thumbnail...")

        body = literal_eval(request.get_data(as_text=True))
        youtube_url: Optional[str] = body.get("url")

        if youtube_url is None:
            log.error(Err.NO_IMG_URL)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_IMG_URL)

        video_id = extractYoutubeVideoId(youtube_url)
        if video_id is None:
            log.error(Err.INVALID_YT_URL)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.INVALID_YT_URL)

        thumbnail_url = f"https://i3.ytimg.com/vi/{video_id}/maxresdefault.jpg"
        return processYoutubeThumbnail(thumbnail_url)
