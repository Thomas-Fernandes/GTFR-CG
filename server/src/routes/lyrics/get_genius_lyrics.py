from flask import Blueprint, request, Response
from flask_restx import Resource

from ast import literal_eval
from typing import Optional

from server.src.constants.enums import HttpStatus
from server.src.constants.paths import ROUTES
from server.src.constants.responses import Err, Success
from server.src.docs import models, ns_lyrics
from server.src.l10n import locale
from server.src.logger import log
from server.src.utils.web_utils import createApiResponse

from server.src.routes.lyrics.genius import fetchLyricsFromGenius

bp_lyrics_get_genius_lyrics = Blueprint("get-genius-lyrics-token", __name__.split('.')[-1])

@ns_lyrics.route("/get-genius-lyrics")
class GeniusLyricsResource(Resource):
    @ns_lyrics.doc("post_get_genius_lyrics")
    @ns_lyrics.expect(models[ROUTES.lyrics.bp_name]["get-genius-lyrics"]["payload"])
    @ns_lyrics.response(HttpStatus.OK, locale.get(Success.LYRICS_FETCH_SUCCESS), models[ROUTES.lyrics.bp_name]["get-genius-lyrics"]["response"])
    @ns_lyrics.response(HttpStatus.BAD_REQUEST, locale.get(Err.LYRICS_MISSING_PARAMS))
    def post(self) -> Response:
        """ Fetches the lyrics of a song from Genius dot com """
        log.info("POST - Fetching lyrics from Genius...")

        body = literal_eval(request.get_data(as_text=True))
        song_name: Optional[str] = body.get("songName")
        artist: Optional[str] = body.get("artist")

        if song_name is None or artist is None:
            log.error(f"Error in request payload: {locale.get(Err.LYRICS_MISSING_PARAMS)}")
            return createApiResponse(HttpStatus.BAD_REQUEST, locale.get(Err.LYRICS_MISSING_PARAMS))

        lyrics_parts = fetchLyricsFromGenius(song_name, artist)
        return createApiResponse(HttpStatus.OK, locale.get(Success.LYRICS_FETCH_SUCCESS), {"lyricsParts": lyrics_parts})
