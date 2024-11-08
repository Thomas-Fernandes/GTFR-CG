from flask import Blueprint, Response
from flask_restx import Resource

from os import path
from time import time

from server.src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, SessionFields
from server.src.constants.paths import PROCESSED_ARTWORK_FILENAME, PROCESSED_DIR, ROUTES, SLASH
from server.src.constants.responses import Err, Msg

from server.src.app import session
from server.src.docs import models, ns_artwork_processing
from server.src.logger import log, LogSeverity
from server.src.statistics import updateStats
from server.src.utils.web_utils import createApiResponse

from server.src.routes.artwork_processing.pillow import generateCoverArt, generateThumbnails

bp_artwork_generation_process_artworks = Blueprint("process-artworks", __name__.split('.')[-1])

@ns_artwork_processing.route("/process-artworks")
class ProcessArtworkResource(Resource):
    @ns_artwork_processing.doc("post_process_images")
    @ns_artwork_processing.expect(models[ROUTES.art_proc.bp_name]["process-artworks"]["payload"])
    @ns_artwork_processing.response(HttpStatus.CREATED, Msg.PROCESSED_IMAGES_SUCCESS)
    @ns_artwork_processing.response(HttpStatus.BAD_REQUEST, Err.NO_IMG)
    @ns_artwork_processing.response(HttpStatus.PRECONDITION_FAILED, Err.OVERLAY_NOT_FOUND)
    def post(self) -> Response:
        """ Renders the processed background image and thumbnails """
        if SessionFields.GENERATED_ARTWORK_PATH not in session:
            log.error(Err.NO_IMG)
            return createApiResponse(HttpStatus.BAD_REQUEST, Err.NO_IMG)

        user_folder = str(session[SessionFields.USER_FOLDER]) + SLASH + AvailableCacheElemType.ARTWORKS
        user_processed_path = path.join(PROCESSED_DIR, user_folder)
        generated_artwork_path = str(session[SessionFields.GENERATED_ARTWORK_PATH])
        include_center_artwork = session.get(SessionFields.INCLUDE_CENTER_ARTWORK, True)
        output_bg = path.join(user_processed_path, PROCESSED_ARTWORK_FILENAME)

        start = time()
        generateCoverArt(generated_artwork_path, output_bg, include_center_artwork)
        err = generateThumbnails(output_bg, user_processed_path)
        if err:
            return createApiResponse(HttpStatus.PRECONDITION_FAILED, err)
        center_mark = "with" if include_center_artwork else "without"
        log.log(f"Images generation ({center_mark} center artwork) complete.").time(LogSeverity.LOG, time() - start)
        updateStats(to_increment=AvailableStats.ARTWORK_GENERATIONS)

        return createApiResponse(HttpStatus.CREATED, Msg.PROCESSED_IMAGES_SUCCESS)
