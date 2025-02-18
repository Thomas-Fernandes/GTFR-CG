from flask import Blueprint, Response, request
from flask_restx import Resource
from requests import get as requestsGet

from ast import literal_eval
from os import path, makedirs
from typing import Optional
from uuid import uuid4

from src.constants.enums import AvailableCacheElemType, HttpStatus, SessionFields
from src.constants.paths import PROCESSED_DIR, ROUTES, SLASH, UPLOADED_ITUNES_IMG_FILENAME
from src.constants.responses import Error, Success, Warn

from src.app import session
from src.docs import models, ns_artwork_generation
from src.l10n import locale
from src.logger import log
from src.utils.web_utils import createApiResponse

bp_artwork_generation_itunes_image = Blueprint("use-itunes-image", __name__.split('.')[-1])

@ns_artwork_generation.route("/use-itunes-image")
class ItunesImageResource(Resource):
    @ns_artwork_generation.doc("post_use_itunes_image")
    @ns_artwork_generation.expect(models[ROUTES.art_gen.bp_name]["use-itunes-image"]["payload"])
    @ns_artwork_generation.response(HttpStatus.CREATED, locale.get(Success.ITUNES_IMAGE_UPLOADED))
    @ns_artwork_generation.response(HttpStatus.BAD_REQUEST, locale.get(Error.NO_IMG_URL))
    @ns_artwork_generation.response(HttpStatus.INTERNAL_SERVER_ERROR, locale.get(Error.FAIL_DOWNLOAD))
    def post(self) -> Response:
        """Interprets the fetched iTunes URL and saves the image to the user's folder"""
        log.info("POST - Generating artwork using an iTunes image...")
        body = literal_eval(request.get_data(as_text=True))
        image_url: Optional[str] = body.get("url")
        if image_url is None:
            log.error(f"Error in request payload: {locale.get(Error.NO_IMG_URL)}")
            return createApiResponse(HttpStatus.BAD_REQUEST, locale.get(Error.NO_IMG_URL))

        if SessionFields.USER_FOLDER not in session:
            log.debug(locale.get(Warn.NO_USER_FOLDER))
            session[SessionFields.USER_FOLDER] = str(uuid4())

        user_folder = str(session.get(SessionFields.USER_FOLDER)) + SLASH + AvailableCacheElemType.ARTWORKS + SLASH
        user_processed_path = path.join(PROCESSED_DIR, user_folder)
        log.info(f"Creating user processed path: {user_processed_path}")
        makedirs(user_processed_path, exist_ok=True)

        log.debug(f"Fetching iTunes image from URL: {image_url}")
        image_response = requestsGet(image_url)  # fetch iTunes image from deducted URL
        if image_response.status_code != HttpStatus.OK:
            return createApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, locale.get(Error.FAIL_DOWNLOAD))
        log.debug("iTunes image fetched successfully.")

        image_path = path.join(user_processed_path, UPLOADED_ITUNES_IMG_FILENAME)
        with open(image_path, "wb") as file:
            log.debug(f"Saving iTunes image to {image_path}")
            file.write(image_response.content)

        session[SessionFields.GENERATED_ARTWORK_PATH] = image_path
        session[SessionFields.INCLUDE_CENTER_ARTWORK] = True

        log.info(f"Found iTunes image and saved it to {image_path}")
        return createApiResponse(HttpStatus.CREATED, locale.get(Success.ITUNES_IMAGE_UPLOADED))
