from flask import Blueprint, Response, request
from flask_restx import Resource
from werkzeug.datastructures import FileStorage

from os import path
from uuid import uuid4

from src.constants.enums import HttpStatus, PayloadFields, SessionFields
from src.constants.paths import GENERATED_ARTWORKS_DIR, ROUTES, UPLOADED_FILE_IMG_FILENAME
from src.constants.responses import Err, Msg, Warn

from src.app import session
from src.docs import models, ns_artwork_generation
from src.logger import log
from src.utils.file_utils import validateImageFilename
from src.utils.string_utils import snakeToCamel
from src.utils.web_utils import createApiResponse

bp_artwork_generation_local_file = Blueprint("use-local-image", __name__.split('.')[-1])

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
        log.info("POST - Generating artwork using a local image...")

        if snakeToCamel(PayloadFields.LOCAL_FILE) not in request.files:
            log.error(f"Error in request payload: {Err.NO_FILE}")
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_FILE)
        file: FileStorage = request.files[snakeToCamel(PayloadFields.LOCAL_FILE)]

        if SessionFields.USER_FOLDER not in session:
            log.debug(Warn.NO_USER_FOLDER)
            session[SessionFields.USER_FOLDER] = str(uuid4())

        err = validateImageFilename(file.filename)
        if err is not None:
            log.error(f"Error in request payload: {err}")
            if err == Err.IMG_INVALID_FILETYPE:
                return createApiResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, err)
            else:
                return createApiResponse(HttpStatus.BAD_REQUEST, err)
        if file.filename is None:
            log.error(f"Error in request payload: {Err.NO_FILE}")
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_FILE)
        log.debug(f"Image filename is valid: {file.filename}")

        include_center_artwork: bool = \
            request.form[snakeToCamel(PayloadFields.INCLUDE_CENTER_ARTWORK)] == "true"

        image_path = path.join(GENERATED_ARTWORKS_DIR, UPLOADED_FILE_IMG_FILENAME)
        log.debug(f"Saving uploaded image to {image_path}")
        file.save(image_path)

        session[SessionFields.GENERATED_ARTWORK_PATH] = image_path
        session[SessionFields.INCLUDE_CENTER_ARTWORK] = include_center_artwork

        log.info(f"Local image upload complete and saved it to {image_path}")
        return createApiResponse(HttpStatus.CREATED, Msg.LOCAL_IMAGE_UPLOADED)