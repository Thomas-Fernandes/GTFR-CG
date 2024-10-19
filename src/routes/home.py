from flask import Blueprint, Response
from flask_restx import fields, Namespace, Resource

import src.constants as const
from src.logger import log
from src.statistics import getJsonStatsFromFile
from src.utils.web_utils import createApiResponse

from src.app import api, app
bp_home = Blueprint(const.ROUTES.home.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE
home_ns = Namespace(const.ROUTES.home.bp_name, description="Home related operations")
api.add_namespace(home_ns, path=api_prefix)

@bp_home.route(api_prefix + "/genius-token", methods=["GET"])
def getGeniusToken() -> Response:
    """ Returns the Genius API token.
    :return: [Response] The response to the request.
    """
    log.log("GET - Fetching Genius API token...")
    token = session.get(const.SessionFields.genius_token.value, "")
    return createApiResponse(const.HttpStatus.OK.value, "Genius API token fetched successfully.", {"token": token})

stats_model = home_ns.model("Statistics", {
    "date_first_operation": fields.DateTime(description="Date of the first operation (YYYY-MM-DD HH:MM:SS)"),
    "date_last_operation": fields.DateTime(description="Date of the last operation (YYYY-MM-DD HH:MM:SS)"),
    "artwork_generations": fields.Integer(description="Number of artwork generations"),
    "lyrics_fetches": fields.Integer(description="Number of lyrics fetches"),
    "cards_generated": fields.Integer(description="Number of cards generated"),
})
@home_ns.route("/statistics")
@bp_home.route(api_prefix + "/statistics", methods=["GET"])
class StatisticsResource(Resource):
    @home_ns.doc("get_statistics")
    @home_ns.response(const.HttpStatus.OK.value, "Success", stats_model)
    @home_ns.response(const.HttpStatus.BAD_REQUEST.value, "Bad Request")
    def get(self) -> Response:
        """ Returns the statistics as a JSON object.
        :return: [Response] The response to the request.
        """
        log.log("GET - Fetching statistics...")

        stats = getJsonStatsFromFile()

        if stats[const.AvailableStats.dateFirstOperation.value] == "N/A":
            return createApiResponse(const.HttpStatus.CREATED.value, "Statistics created successfully.", stats)
        return createApiResponse(const.HttpStatus.OK.value, "Statistics fetched successfully.", stats)