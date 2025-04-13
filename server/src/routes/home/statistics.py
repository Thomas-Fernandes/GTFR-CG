from flask import Blueprint, Response
from flask_restx import Resource

from src.constants.enums import AvailableStats, HttpStatus
from src.constants.paths import ROUTES
from src.constants.responses import Error, Success
from src.constants.statistics import EMPTY_STATS

from src.docs import models, ns_home
from src.logger import log
from src.l10n import locale
from src.statistics import getJsonStatsFromFile
from src.utils.web_utils import createApiResponse

bp_home_statistics = Blueprint("statistics", __name__.split('.')[-1])


@ns_home.route("/statistics")
class StatisticsResource(Resource):
    @ns_home.doc("get_statistics")
    @ns_home.response(
        HttpStatus.OK,
        locale.get(Success.STATS_FETCHED),
        models[ROUTES.home.bp_name]["statistics"]["response"]
    )
    @ns_home.response(
        HttpStatus.CREATED,
        locale.get(Success.STATS_CREATED),
        models[ROUTES.home.bp_name]["statistics"]["response"]
    )
    @ns_home.response(HttpStatus.BAD_REQUEST, locale.get(Error.STATS_FILETYPE))
    def get(self) -> Response:
        """Returns the statistics as a JSON object"""
        log.info("GET - Fetching statistics...")

        try:
            stats = getJsonStatsFromFile()
        except ValueError as e:
            return createApiResponse(HttpStatus.BAD_REQUEST, str(e))

        if stats[AvailableStats.DATE_FIRST_OPERATION] == EMPTY_STATS[AvailableStats.DATE_FIRST_OPERATION]:
            return createApiResponse(HttpStatus.CREATED, locale.get(Success.STATS_CREATED), stats)
        return createApiResponse(HttpStatus.OK, locale.get(Success.STATS_FETCHED), stats)
