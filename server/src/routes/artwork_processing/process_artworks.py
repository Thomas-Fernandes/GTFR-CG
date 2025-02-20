from flask import Blueprint, Response
from flask_restx import Resource

from os import path
from time import time

from src.constants.enums import AvailableCacheElemType, AvailableStats, HttpStatus, SessionFields
from src.constants.paths import PROCESSED_ARTWORK_FILENAME, PROCESSED_DIR, ROUTES, SLASH
from src.constants.responses import Error, Success

from src.app import session
from src.docs import models, ns_artwork_processing
from src.l10n import locale
from src.logger import log, SeverityLevel
from src.statistics import updateStats
from src.utils.web_utils import createApiResponse

from src.routes.artwork_processing.pillow import generateCoverArt, generateThumbnails

bp_artwork_processing_process_artworks = Blueprint("process-artworks", __name__.split('.')[-1])


@ns_artwork_processing.route("/process-artworks")
class ProcessArtworkResource(Resource):
    @ns_artwork_processing.doc("post_process_images")
    @ns_artwork_processing.expect(models[ROUTES.art_proc.bp_name]["process-artworks"]["payload"])
    @ns_artwork_processing.response(HttpStatus.CREATED, locale.get(Success.PROCESSED_IMAGES_SUCCESS))
    @ns_artwork_processing.response(HttpStatus.BAD_REQUEST, locale.get(Error.NO_IMG))
    @ns_artwork_processing.response(HttpStatus.PRECONDITION_FAILED, locale.get(Error.OVERLAY_NOT_FOUND))
    def post(self) -> Response:
        """Renders the processed background image and thumbnails"""
        if SessionFields.GENERATED_ARTWORK_PATH not in session:
            log.error(f"Error in session: {locale.get(Error.NO_IMG)}")
            return createApiResponse(HttpStatus.PRECONDITION_FAILED, locale.get(Error.NO_IMG))

        user_folder = str(session.get(SessionFields.USER_FOLDER)) + SLASH + AvailableCacheElemType.ARTWORKS
        user_processed_path = path.join(PROCESSED_DIR, user_folder)
        generated_artwork_path = str(session.get(SessionFields.GENERATED_ARTWORK_PATH))
        include_center_artwork = session.get(SessionFields.INCLUDE_CENTER_ARTWORK, True)
        output_bg = path.join(user_processed_path, PROCESSED_ARTWORK_FILENAME)

        start = time()
        generateCoverArt(generated_artwork_path, output_bg, include_center_artwork)
        err = generateThumbnails(output_bg, user_processed_path)
        if err:
            return createApiResponse(HttpStatus.PRECONDITION_FAILED, err)
        center_mark = "with" if include_center_artwork else "without"
        log.info(f"Images generation ({center_mark} center artwork) complete.").time(SeverityLevel.INFO, time() - start)
        updateStats(to_increment=AvailableStats.ARTWORK_GENERATIONS)

        return createApiResponse(HttpStatus.CREATED, locale.get(Success.PROCESSED_IMAGES_SUCCESS))
