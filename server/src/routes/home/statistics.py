from flask import Blueprint, Response
from flask_restx import Resource

from server.src.constants.enums import AvailableStats, HttpStatus
from server.src.constants.paths import ROUTES
from server.src.constants.responses import Err, Success
from server.src.constants.statistics import EMPTY_STATS

from server.src.docs import models, ns_home
from server.src.logger import log
from server.src.l10n import locale
from server.src.statistics import getJsonStatsFromFile
from server.src.utils.web_utils import createApiResponse

bp_home_statistics = Blueprint("statistics", __name__.split('.')[-1])

@ns_home.route("/statistics")
class StatisticsResource(Resource):
    @ns_home.doc("get_statistics")
    @ns_home.response(HttpStatus.OK, locale.get(Success.STATS_FETCHED), models[ROUTES.home.bp_name]["statistics"]["response"])
    @ns_home.response(HttpStatus.CREATED, locale.get(Success.STATS_CREATED), models[ROUTES.home.bp_name]["statistics"]["response"])
    @ns_home.response(HttpStatus.BAD_REQUEST, locale.get(Err.STATS_FILETYPE))
    def get(self) -> Response:
        """ Returns the statistics as a JSON object """
        log.info("GET - Fetching statistics...")

        try:
            stats = getJsonStatsFromFile()
        except ValueError as e:
            return createApiResponse(HttpStatus.BAD_REQUEST, str(e))

        if stats[AvailableStats.DATE_FIRST_OPERATION] == EMPTY_STATS[AvailableStats.DATE_FIRST_OPERATION]:
            return createApiResponse(HttpStatus.CREATED, locale.get(Success.STATS_CREATED), stats)
        return createApiResponse(HttpStatus.OK, locale.get(Success.STATS_FETCHED), stats)