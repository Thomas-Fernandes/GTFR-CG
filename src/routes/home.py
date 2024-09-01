from flask import Blueprint, Response
from flask_cors import cross_origin

import src.constants as const
from src.logger import log
from src.statistics import getJsonStatsFromFile
from src.web_utils import createApiResponse

from src.app import app
bp_home = Blueprint(const.ROUTES.home.bp_name, __name__.split('.')[-1])
session = app.config
api_prefix = const.API_ROUTE

@bp_home.route(api_prefix + "/genius-token", methods=["GET"])
@cross_origin()
def getGeniusToken() -> Response:
    """ Returns the Genius API token.
    :return: [Response] The response to the request.
    """
    log.log("GET - Fetching Genius API token...")
    token = session.get(const.SessionFields.genius_token.value, "")
    return createApiResponse(const.HttpStatus.OK.value, "Genius API token fetched successfully.", {"token": token})

@bp_home.route(api_prefix + "/statistics", methods=["GET"])
@cross_origin()
def getStatistics() -> Response:
    """ Returns the statistics as a JSON object.
    :return: [Response] The response to the request.
    """
    log.log("GET - Fetching statistics...")
    stats = getJsonStatsFromFile()
    return createApiResponse(const.HttpStatus.OK.value, "Statistics fetched successfully.", stats)
