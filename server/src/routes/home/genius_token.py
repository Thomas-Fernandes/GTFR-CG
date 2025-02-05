from flask import Blueprint, Response
from flask_restx import Resource

from src.constants.enums import HttpStatus, SessionFields
from src.constants.paths import ROUTES
from src.constants.responses import Msg

from src.app import session
from src.docs import models, ns_home
from src.logger import log
from src.utils.web_utils import createApiResponse

bp_home_genius_token = Blueprint("genius-token", __name__.split('.')[-1])

@ns_home.route("/genius-token")
class GeniusTokenResource(Resource):
    @ns_home.doc("get_genius_token")
    @ns_home.response(HttpStatus.OK, Msg.GENIUS_TOKEN_FETCHED, models[ROUTES.home.bp_name]["genius-token"]["response"])
    def get(self) -> Response:
        """ Returns the Genius API token """
        log.info("GET - Fetching Genius API token...")

        return createApiResponse(HttpStatus.OK, Msg.GENIUS_TOKEN_FETCHED, {"token": session.get(SessionFields.GENIUS_TOKEN)})