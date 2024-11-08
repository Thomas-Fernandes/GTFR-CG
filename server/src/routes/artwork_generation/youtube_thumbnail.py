from flask import Response, request
from flask_restx import Resource

from ast import literal_eval
from typing import Optional

from server.src.constants.enums import HttpStatus
from server.src.logger import log
from server.src.constants.paths import ROUTES
from server.src.constants.responses import Err, Msg
from server.src.docs import models, ns_artwork_generation
from server.src.utils.web_utils import createApiResponse

from server.src.app import app
session = app.config

from server.src.routes.artwork_generation.utils import extractYoutubeVideoId, processYoutubeThumbnail

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
