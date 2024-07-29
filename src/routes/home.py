from flask import Blueprint, jsonify, render_template, request
from flask_cors import cross_origin

import src.constants as const
from src.logger import log
from src.statistics import JsonDict, getJsonStatsFromFile
from src.typing import RenderView

from src.app import app
bp_home = Blueprint(const.ROUTES.home.bp_name, __name__.split('.')[-1])
session = app.config

@bp_home.route("/api/genius-token", methods=["GET"])
@cross_origin()
def getGeniusToken() -> JsonDict:
    """ Returns the Genius API token.
    :return: [str] The Genius API token.
    """
    log.debug("GET - Fetching Genius API token...")
    token = session.get(const.SessionFields.genius_token.value, "")
    return jsonify(
        status=200,
        message="Genius API token fetched successfully.",
        data=token
    )

@bp_home.route("/api/statistics", methods=["GET"])
@cross_origin()
def getStatistics() -> JsonDict:
    """ Returns the statistics as a JSON object.
    :return: [JsonDict] The statistics.
    """
    log.debug("GET - Fetching statistics...")
    stats = getJsonStatsFromFile()
    return jsonify(
        status=200,
        message="Statistics fetched successfully.",
        data=stats
    )

@staticmethod
def getPluralMarks(stats: JsonDict) -> JsonDict:
    """ Determines whether statistics' units should be pluralized.
    :param stats: [JsonDict] The statistics to check.
    :return: [JsonDict] The plural mark for each unit.
    """
    plurals = {}
    for (key, value) in stats.items():
        plurals[key] = "s" if (value != 1 and value != 0) else ""
    return plurals

@bp_home.route(const.ROUTES.home.path)
def renderHome() -> RenderView:
    """ Renders the home page.
    :return: [RenderView] The rendered view.
    """
    log.debug(f"Loading {const.ROUTES.home.bp_name} page context...")
    context = const.DEFAULT_CONTEXT_OBJ
    context.stats = getJsonStatsFromFile()
    context.plurals = getPluralMarks(context.stats)
    context.genius_token = session.get(const.SessionFields.genius_token.value, const.DEFAULT_CONTEXT_OBJ.genius_token)
    context.session_status = session.get(const.SessionFields.session_status.value, const.DEFAULT_CONTEXT_OBJ.session_status)
    for key in const.AvailableStats: # fill missing stats with default values
        if key.value not in context.stats:
            context.stats[key.value] = const.EMPTY_STATS[key.value]
    if context.session_status == "initializing":
        session[const.SessionFields.session_status.value] = "running"
    log.debug(f"{const.ROUTES.home.bp_name} page context loaded.")

    log.debug(f"Rendering {const.ROUTES.home.bp_name} page...")
    return render_template(const.ROUTES.home.view_filename, **context.__dict__)

@app.errorhandler(const.HttpStatus.NOT_FOUND.value) # needs to be applied to app, not blueprint
def pageNotFound(_e: Exception) -> RenderView:
    """ Redirects to the home page if the requested page is not found.
    :param _e: [Exception] The exception that occurred. Not used.
    :return: [RenderView] The home page.
    """
    @staticmethod
    def extractSearchedPath(url: str) -> str:
        """ Extracts the searched path from the URL, excluding the domain.
        :param url: [str] The complete URL.
        :return: [str] The searched path.
        """
        return "/" + '/'.join(url.split(const.SLASH)[3:])
    log.warn(f"Page not found: {extractSearchedPath(request.url)}. "
             f"Redirecting to {const.ROUTES.home.bp_name} page ({const.ROUTES.home.path}).")
    return render_template(const.ROUTES.home.view_filename, **const.DEFAULT_CONTEXT)

@bp_home.route("/")
def root() -> RenderView:
    """ Flask's root route, directly redirects to the home page.
    :return: [RenderView] The home page.
    """
    log.debug("Rendering root page...")
    return render_template(const.ROUTES.home.view_filename, **const.DEFAULT_CONTEXT)
