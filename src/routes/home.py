from flask import Blueprint, Response
from flask_restx import Resource

import src.constants as const
from src.docs import models, ns_home
from src.logger import log
from src.statistics import getJsonStatsFromFile
from src.utils.web_utils import createApiResponse

from src.app import api, app
session = app.config
bp_home = Blueprint(const.ROUTES.home.bp_name, __name__.split('.')[-1])
api.add_namespace(ns_home, path=const.API_ROUTE)

@ns_home.route("/genius-token")
class GeniusTokenResource(Resource):
    @ns_home.doc("get_genius_token")
    @ns_home.response(const.HttpStatus.OK.value, const.MSG_GENIUS_TOKEN_FETCHED, models["genius-token"])
    def get(self) -> Response:
        """ Returns the Genius API token. """
        log.log("GET - Fetching Genius API token...")

        token = session.get(const.SessionFields.genius_token.value, "")

        return createApiResponse(const.HttpStatus.OK.value, const.MSG_GENIUS_TOKEN_FETCHED, {"token": token})

@ns_home.route("/statistics")
class StatisticsResource(Resource):
    @ns_home.doc("get_statistics")
    @ns_home.response(const.HttpStatus.OK.value, const.MSG_STATS_FETCHED, models["statistics"])
    @ns_home.response(const.HttpStatus.CREATED.value, const.MSG_STATS_CREATED, models["statistics"])
    @ns_home.response(const.HttpStatus.BAD_REQUEST.value, const.ERR_STATS_FILETYPE)
    def get(self) -> Response:
        """ Returns the statistics as a JSON object. """
        log.log("GET - Fetching statistics...")

        try:
            stats = getJsonStatsFromFile()
        except ValueError as e:
            return createApiResponse(const.HttpStatus.BAD_REQUEST.value, str(e))

        if stats[const.AvailableStats.dateFirstOperation.value] == const.EMPTY_STATS[const.AvailableStats.dateFirstOperation.value]:
            return createApiResponse(const.HttpStatus.CREATED.value, const.MSG_STATS_CREATED, stats)
        return createApiResponse(const.HttpStatus.OK.value, const.MSG_STATS_FETCHED, stats)