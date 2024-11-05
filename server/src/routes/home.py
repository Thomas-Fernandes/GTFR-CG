from flask import Blueprint, Response
from flask_restx import Resource

from server.src.constants.enums import AvailableStats, HttpStatus, SessionFields
from server.src.constants.paths import API_ROUTE, ROUTES
from server.src.constants.responses import Err, Msg
from server.src.constants.statistics import EMPTY_STATS
from server.src.docs import models, ns_home
from server.src.logger import log
from server.src.statistics import getJsonStatsFromFile
from server.src.utils.web_utils import createApiResponse

from server.src.app import api, app
session = app.config
bp_home = Blueprint(ROUTES.home.bp_name, __name__.split('.')[-1])
api.add_namespace(ns_home, path=API_ROUTE)

@ns_home.route("/genius-token")
class GeniusTokenResource(Resource):
    @ns_home.doc("get_genius_token")
    @ns_home.response(HttpStatus.OK.value, Msg.MSG_GENIUS_TOKEN_FETCHED, models[ROUTES.home.bp_name]["genius-token"]["response"])
    def get(self) -> Response:
        """ Returns the Genius API token """
        log.log("GET - Fetching Genius API token...")

        token = session.get(SessionFields.genius_token.value, "")

        return createApiResponse(HttpStatus.OK.value, Msg.MSG_GENIUS_TOKEN_FETCHED, {"token": token})

@ns_home.route("/statistics")
class StatisticsResource(Resource):
    @ns_home.doc("get_statistics")
    @ns_home.response(HttpStatus.OK.value, Msg.MSG_STATS_FETCHED, models[ROUTES.home.bp_name]["statistics"]["response"])
    @ns_home.response(HttpStatus.CREATED.value, Msg.MSG_STATS_CREATED, models[ROUTES.home.bp_name]["statistics"]["response"])
    @ns_home.response(HttpStatus.BAD_REQUEST.value, Err.ERR_STATS_FILETYPE)
    def get(self) -> Response:
        """ Returns the statistics as a JSON object """
        log.log("GET - Fetching statistics...")

        try:
            stats = getJsonStatsFromFile()
        except ValueError as e:
            return createApiResponse(HttpStatus.BAD_REQUEST.value, str(e))

        if stats[AvailableStats.dateFirstOperation.value] == EMPTY_STATS[AvailableStats.dateFirstOperation.value]:
            return createApiResponse(HttpStatus.CREATED.value, Msg.MSG_STATS_CREATED, stats)
        return createApiResponse(HttpStatus.OK.value, Msg.MSG_STATS_FETCHED, stats)